import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface SessionPackage {
    id: bigint;
    name: string;
    description: string;
    numberOfSessions: bigint;
    priceCents: bigint;
}
export interface BookingInquiry {
    status: InquiryStatus;
    dogName: string;
    name: string;
    email: string;
    message: string;
    preferredDate: string;
    phone: string;
    dogBreed: string;
}
export interface InquiryInput {
    dogName: string;
    name: string;
    email: string;
    message: string;
    preferredDate: string;
    phone: string;
    dogBreed: string;
}
export interface UserProfile {
    name: string;
}
export enum InquiryStatus {
    cancelled = "cancelled",
    pending = "pending",
    confirmed = "confirmed"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createPackage(pkg: SessionPackage): Promise<bigint>;
    deleteInquiry(id: bigint): Promise<void>;
    deletePackage(id: bigint): Promise<void>;
    getAllInquiries(): Promise<Array<BookingInquiry>>;
    getAllPackages(): Promise<Array<SessionPackage>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    submitInquiry(input: InquiryInput): Promise<bigint>;
    updateInquiryStatus(id: bigint, status: InquiryStatus): Promise<void>;
    updatePackage(pkg: SessionPackage): Promise<void>;
}
