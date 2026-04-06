import Text "mo:core/Text";
import Nat "mo:core/Nat";
import Iter "mo:core/Iter";
import Map "mo:core/Map";
import Runtime "mo:core/Runtime";
import List "mo:core/List";
import Principal "mo:core/Principal";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  type InquiryStatus = {
    #pending;
    #confirmed;
    #cancelled;
  };

  type BookingInquiry = {
    name : Text;
    email : Text;
    phone : Text;
    dogName : Text;
    dogBreed : Text;
    preferredDate : Text;
    message : Text;
    status : InquiryStatus;
  };

  type InquiryInput = {
    name : Text;
    email : Text;
    phone : Text;
    dogName : Text;
    dogBreed : Text;
    preferredDate : Text;
    message : Text;
  };

  type SessionPackage = {
    id : Nat;
    name : Text;
    description : Text;
    priceCents : Nat;
    numberOfSessions : Nat;
  };

  public type UserProfile = {
    name : Text;
  };

  module SessionPackage {
    public func compare(a : SessionPackage, b : SessionPackage) : { #less; #equal; #greater } {
      Nat.compare(a.id, b.id);
    };
  };

  // Security
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  var nextInquiryId = 1;
  var nextPackageId = 1;
  let inquiries = Map.empty<Nat, BookingInquiry>();
  let packages = Map.empty<Nat, SessionPackage>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  // User Profile Management
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Booking Inquiries
  public shared ({ caller }) func submitInquiry(input : InquiryInput) : async Nat {
    let id = nextInquiryId;
    nextInquiryId += 1;

    let inquiry : BookingInquiry = {
      input with
      status = #pending;
    };

    inquiries.add(id, inquiry);
    id;
  };

  public query ({ caller }) func getAllInquiries() : async [BookingInquiry] {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can view inquiries");
    };
    inquiries.values().toArray();
  };

  public shared ({ caller }) func updateInquiryStatus(id : Nat, status : InquiryStatus) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can update inquiries");
    };
    switch (inquiries.get(id)) {
      case (null) { Runtime.trap("Inquiry not found") };
      case (?inquiry) {
        let updatedInquiry : BookingInquiry = {
          inquiry with
          status;
        };
        inquiries.add(id, updatedInquiry);
      };
    };
  };

  public shared ({ caller }) func deleteInquiry(id : Nat) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can delete inquiries");
    };
    if (not inquiries.containsKey(id)) {
      Runtime.trap("Inquiry not found");
    };
    inquiries.remove(id);
  };

  // Session Packages
  public shared ({ caller }) func createPackage(pkg : SessionPackage) : async Nat {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can create packages");
    };
    let id = nextPackageId;
    nextPackageId += 1;

    let newPackage : SessionPackage = {
      pkg with
      id;
    };

    packages.add(id, newPackage);
    id;
  };

  public shared ({ caller }) func updatePackage(pkg : SessionPackage) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can update packages");
    };
    if (not packages.containsKey(pkg.id)) {
      Runtime.trap("Package not found");
    };
    packages.add(pkg.id, pkg);
  };

  public shared ({ caller }) func deletePackage(id : Nat) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can delete packages");
    };
    if (not packages.containsKey(id)) {
      Runtime.trap("Package not found");
    };
    packages.remove(id);
  };

  public query ({ caller }) func getAllPackages() : async [SessionPackage] {
    packages.values().toArray().sort();
  };
};
