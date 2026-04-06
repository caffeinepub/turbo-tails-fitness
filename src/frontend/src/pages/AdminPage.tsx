import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertTriangle,
  CheckCircle2,
  ChevronLeft,
  ClipboardList,
  Clock,
  Loader2,
  LogIn,
  LogOut,
  Package,
  Pencil,
  Plus,
  Trash2,
  XCircle,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  InquiryStatus,
  useCreatePackage,
  useDeleteInquiry,
  useDeletePackage,
  useGetAllInquiries,
  useGetAllPackages,
  useIsAdmin,
  useUpdateInquiryStatus,
  useUpdatePackage,
} from "../hooks/useQueries";
import type { BookingInquiry, SessionPackage } from "../hooks/useQueries";

function formatPrice(cents: bigint): string {
  return `$${(Number(cents) / 100).toFixed(0)}`;
}

// ── Status badge ─────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: InquiryStatus }) {
  const map: Record<
    InquiryStatus,
    { label: string; className: string; icon: React.ReactNode }
  > = {
    [InquiryStatus.pending]: {
      label: "Pending",
      className: "bg-yellow-100 text-yellow-800 border-yellow-200",
      icon: <Clock className="w-3 h-3" />,
    },
    [InquiryStatus.confirmed]: {
      label: "Confirmed",
      className: "bg-green-100 text-green-800 border-green-200",
      icon: <CheckCircle2 className="w-3 h-3" />,
    },
    [InquiryStatus.cancelled]: {
      label: "Cancelled",
      className: "bg-red-100 text-red-800 border-red-200",
      icon: <XCircle className="w-3 h-3" />,
    },
  };
  const info = map[status];
  return (
    <Badge
      variant="outline"
      className={`flex items-center gap-1 ${info.className}`}
    >
      {info.icon}
      {info.label}
    </Badge>
  );
}

// ── Package form modal ────────────────────────────────────────────────────────
interface PackageFormProps {
  open: boolean;
  onClose: () => void;
  existing?: SessionPackage;
}

function PackageFormModal({ open, onClose, existing }: PackageFormProps) {
  const createPackage = useCreatePackage();
  const updatePackage = useUpdatePackage();
  const [name, setName] = useState(existing?.name ?? "");
  const [description, setDescription] = useState(existing?.description ?? "");
  const [sessions, setSessions] = useState(
    String(existing?.numberOfSessions ?? "1"),
  );
  const [priceCents, setPriceCents] = useState(
    existing ? String(Number(existing.priceCents) / 100) : "",
  );

  const isPending = createPackage.isPending || updatePackage.isPending;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const pkg: SessionPackage = {
      id: existing?.id ?? 0n,
      name,
      description,
      numberOfSessions: BigInt(sessions),
      priceCents: BigInt(Math.round(Number.parseFloat(priceCents) * 100)),
    };
    try {
      if (existing) {
        await updatePackage.mutateAsync(pkg);
        toast.success("Package updated");
      } else {
        await createPackage.mutateAsync(pkg);
        toast.success("Package created");
      }
      onClose();
    } catch {
      toast.error("Failed to save package");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md" data-ocid="packages.dialog">
        <DialogHeader>
          <DialogTitle className="text-navy font-bold">
            {existing ? "Edit Package" : "New Package"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSave} className="space-y-4 pt-2">
          <div className="space-y-1">
            <Label htmlFor="pkg-name">Package Name</Label>
            <Input
              id="pkg-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. 5-Pack Bundle"
              required
              data-ocid="packages.input"
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="pkg-desc">Description</Label>
            <Textarea
              id="pkg-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of this package..."
              rows={2}
              data-ocid="packages.textarea"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label htmlFor="pkg-sessions">No. of Sessions</Label>
              <Input
                id="pkg-sessions"
                type="number"
                min="1"
                value={sessions}
                onChange={(e) => setSessions(e.target.value)}
                required
                data-ocid="packages.input"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="pkg-price">Price (CAD $)</Label>
              <Input
                id="pkg-price"
                type="number"
                min="0"
                step="0.01"
                value={priceCents}
                onChange={(e) => setPriceCents(e.target.value)}
                placeholder="35.00"
                required
                data-ocid="packages.input"
              />
            </div>
          </div>
          <DialogFooter className="gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              data-ocid="packages.cancel_button"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="bg-primary text-white rounded-full"
              data-ocid="packages.save_button"
            >
              {isPending && <Loader2 className="mr-2 w-4 h-4 animate-spin" />}
              {existing ? "Save Changes" : "Create Package"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ── Packages panel ────────────────────────────────────────────────────────────
function PackagesPanel() {
  const { data: packages, isLoading } = useGetAllPackages();
  const deletePackage = useDeletePackage();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<SessionPackage | undefined>(undefined);
  const [deletingId, setDeletingId] = useState<bigint | null>(null);

  const handleDelete = async (pkg: SessionPackage) => {
    if (!window.confirm(`Delete package "${pkg.name}"?`)) return;
    setDeletingId(pkg.id);
    try {
      await deletePackage.mutateAsync(pkg.id);
      toast.success("Package deleted");
    } catch {
      toast.error("Failed to delete package");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div data-ocid="packages.panel">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-navy">Session Packages</h2>
        <Button
          onClick={() => {
            setEditing(undefined);
            setModalOpen(true);
          }}
          className="rounded-full bg-primary text-white text-sm"
          data-ocid="packages.open_modal_button"
        >
          <Plus className="w-4 h-4 mr-1" /> New Package
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-3" data-ocid="packages.loading_state">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-14 w-full rounded-lg" />
          ))}
        </div>
      ) : !packages || packages.length === 0 ? (
        <div
          className="text-center py-12 text-muted-foreground"
          data-ocid="packages.empty_state"
        >
          <Package className="w-10 h-10 mx-auto mb-3 opacity-40" />
          <p className="font-medium">No packages yet</p>
          <p className="text-sm mt-1">
            Create your first session package above.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <Table data-ocid="packages.table">
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Sessions</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {packages.map((pkg, i) => (
                <TableRow
                  key={String(pkg.id)}
                  data-ocid={`packages.item.${i + 1}`}
                >
                  <TableCell className="font-semibold text-navy">
                    {pkg.name}
                  </TableCell>
                  <TableCell>{String(pkg.numberOfSessions)}</TableCell>
                  <TableCell className="font-bold text-primary">
                    {formatPrice(pkg.priceCents)}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm max-w-xs truncate">
                    {pkg.description}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setEditing(pkg);
                          setModalOpen(true);
                        }}
                        data-ocid={`packages.edit_button.${i + 1}`}
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        disabled={deletingId === pkg.id}
                        onClick={() => handleDelete(pkg)}
                        data-ocid={`packages.delete_button.${i + 1}`}
                      >
                        {deletingId === pkg.id ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Trash2 className="w-3.5 h-3.5" />
                        )}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <PackageFormModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditing(undefined);
        }}
        existing={editing}
      />
    </div>
  );
}

// ── Inquiries panel ───────────────────────────────────────────────────────────
function InquiriesPanel() {
  const { data: inquiries, isLoading } = useGetAllInquiries();
  const updateStatus = useUpdateInquiryStatus();
  const deleteInquiry = useDeleteInquiry();
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const handleStatusChange = async (
    inquiry: BookingInquiry & { _id: bigint },
    newStatus: InquiryStatus,
  ) => {
    try {
      await updateStatus.mutateAsync({ id: inquiry._id, status: newStatus });
      toast.success("Status updated");
    } catch {
      toast.error("Failed to update status");
    }
  };

  const handleDelete = async (id: bigint, index: number) => {
    if (!window.confirm("Delete this booking inquiry?")) return;
    setDeletingId(index);
    try {
      await deleteInquiry.mutateAsync(id);
      toast.success("Inquiry deleted");
    } catch {
      toast.error("Failed to delete inquiry");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div data-ocid="inquiries.panel">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-navy">Booking Inquiries</h2>
        {inquiries && inquiries.length > 0 && (
          <Badge variant="outline" className="text-primary border-primary/30">
            {inquiries.length} total
          </Badge>
        )}
      </div>

      {isLoading ? (
        <div className="space-y-3" data-ocid="inquiries.loading_state">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-20 w-full rounded-lg" />
          ))}
        </div>
      ) : !inquiries || inquiries.length === 0 ? (
        <div
          className="text-center py-12 text-muted-foreground"
          data-ocid="inquiries.empty_state"
        >
          <ClipboardList className="w-10 h-10 mx-auto mb-3 opacity-40" />
          <p className="font-medium">No inquiries yet</p>
          <p className="text-sm mt-1">
            Booking inquiries from the website will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {inquiries.map((inquiry, i) => {
            const inqWithId = { ...inquiry, _id: BigInt(i) };
            return (
              <motion.div
                key={`${inquiry.email}-${i}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white border border-border rounded-xl p-5 shadow-xs"
                data-ocid={`inquiries.item.${i + 1}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold text-navy">{inquiry.name}</p>
                      <StatusBadge status={inquiry.status} />
                    </div>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      {inquiry.email} · {inquiry.phone}
                    </p>
                    <p className="text-sm mt-1">
                      <span className="font-medium text-primary">Dog: </span>
                      {inquiry.dogName} ({inquiry.dogBreed})
                    </p>
                    {inquiry.preferredDate && (
                      <p className="text-sm text-muted-foreground">
                        <span className="font-medium">Date: </span>
                        {inquiry.preferredDate}
                      </p>
                    )}
                    {inquiry.message && (
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2 italic">
                        "{inquiry.message}"
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col gap-2 flex-shrink-0">
                    <Select
                      value={inquiry.status}
                      onValueChange={(val) =>
                        handleStatusChange(inqWithId, val as InquiryStatus)
                      }
                    >
                      <SelectTrigger
                        className="w-32 text-xs h-8"
                        data-ocid={`inquiries.select.${i + 1}`}
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={InquiryStatus.pending}>
                          Pending
                        </SelectItem>
                        <SelectItem value={InquiryStatus.confirmed}>
                          Confirmed
                        </SelectItem>
                        <SelectItem value={InquiryStatus.cancelled}>
                          Cancelled
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      size="sm"
                      variant="destructive"
                      disabled={deletingId === i}
                      onClick={() => handleDelete(inqWithId._id, i)}
                      className="h-8"
                      data-ocid={`inquiries.delete_button.${i + 1}`}
                    >
                      {deletingId === i ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Trash2 className="w-3.5 h-3.5" />
                      )}
                    </Button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── Admin page ────────────────────────────────────────────────────────────────
export default function AdminPage() {
  const { identity, login, clear, isLoggingIn, isInitializing } =
    useInternetIdentity();
  const isAuthenticated = !!identity;
  const { data: isAdmin, isLoading: isAdminLoading } = useIsAdmin();

  if (isInitializing || isAdminLoading) {
    return (
      <div
        className="min-h-screen bg-background flex items-center justify-center"
        data-ocid="admin.loading_state"
      >
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin text-primary mx-auto mb-3" />
          <p className="text-muted-foreground font-medium">
            Loading admin panel...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Admin header */}
      <header className="bg-navy text-white px-6 py-4 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-4">
          <a
            href="/"
            className="flex items-center gap-2 text-white/70 hover:text-white transition-colors text-sm"
            data-ocid="admin.link"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Site
          </a>
          <div className="h-5 w-px bg-white/20" />
          <div className="flex items-center gap-2">
            <img
              src="/assets/generated/logo-icon-transparent.dim_200x200.png"
              alt="Logo"
              className="w-8 h-8 rounded-full object-cover"
            />
            <span className="font-bold">Turbo Tails Admin</span>
          </div>
        </div>
        {isAuthenticated && (
          <Button
            variant="outline"
            size="sm"
            onClick={clear}
            className="rounded-full border-white/30 text-white hover:bg-white/10 text-sm"
            data-ocid="admin.secondary_button"
          >
            <LogOut className="w-4 h-4 mr-1" />
            Sign Out
          </Button>
        )}
      </header>

      <main className="max-w-5xl mx-auto px-4 py-10">
        <AnimatePresence mode="wait">
          {!isAuthenticated ? (
            /* Login screen */
            <motion.div
              key="login"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center py-20"
            >
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-6">
                <img
                  src="/assets/generated/logo-icon-transparent.dim_200x200.png"
                  alt="Logo"
                  className="w-12 h-12 rounded-full object-cover"
                />
              </div>
              <h1 className="text-3xl font-bold text-navy mb-2">
                Admin Dashboard
              </h1>
              <p className="text-muted-foreground mb-8 max-w-sm mx-auto">
                Sign in with Internet Identity to manage bookings and packages.
              </p>
              <Button
                onClick={login}
                disabled={isLoggingIn}
                size="lg"
                className="rounded-full bg-primary text-white hover:bg-primary/90 font-bold px-10 shadow-lg"
                data-ocid="admin.primary_button"
              >
                {isLoggingIn ? (
                  <>
                    <Loader2 className="mr-2 w-5 h-5 animate-spin" /> Signing
                    in...
                  </>
                ) : (
                  <>
                    <LogIn className="mr-2 w-5 h-5" /> Sign In
                  </>
                )}
              </Button>
            </motion.div>
          ) : isAdmin === false ? (
            /* Not admin */
            <motion.div
              key="not-admin"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-20"
              data-ocid="admin.error_state"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-orange/10 mb-5">
                <AlertTriangle className="w-8 h-8 text-orange" />
              </div>
              <h2 className="text-2xl font-bold text-navy mb-2">
                Access Restricted
              </h2>
              <p className="text-muted-foreground max-w-sm mx-auto">
                Your account doesn't have admin access yet. Please contact the
                business owner to request admin permissions.
              </p>
              <p className="text-sm text-muted-foreground mt-4">
                Signed in as:{" "}
                <code className="bg-muted px-2 py-0.5 rounded text-xs font-mono">
                  {identity?.getPrincipal().toString()}
                </code>
              </p>
            </motion.div>
          ) : (
            /* Admin dashboard */
            <motion.div
              key="dashboard"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="mb-8">
                <h1 className="text-2xl font-bold text-navy">
                  Admin Dashboard
                </h1>
                <p className="text-muted-foreground text-sm mt-1">
                  Manage booking inquiries and session packages
                </p>
              </div>

              <Tabs defaultValue="inquiries" className="w-full">
                <TabsList
                  className="mb-6 bg-white border border-border"
                  data-ocid="admin.tab"
                >
                  <TabsTrigger
                    value="inquiries"
                    className="gap-2"
                    data-ocid="admin.tab"
                  >
                    <ClipboardList className="w-4 h-4" />
                    Inquiries
                  </TabsTrigger>
                  <TabsTrigger
                    value="packages"
                    className="gap-2"
                    data-ocid="admin.tab"
                  >
                    <Package className="w-4 h-4" />
                    Packages
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="inquiries">
                  <div className="bg-white rounded-2xl shadow-card p-6">
                    <InquiriesPanel />
                  </div>
                </TabsContent>

                <TabsContent value="packages">
                  <div className="bg-white rounded-2xl shadow-card p-6">
                    <PackagesPanel />
                  </div>
                </TabsContent>
              </Tabs>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
