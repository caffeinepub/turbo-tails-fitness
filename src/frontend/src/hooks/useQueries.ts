import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  BookingInquiry,
  InquiryInput,
  SessionPackage,
} from "../backend.d";
import { InquiryStatus } from "../backend.d";
import { useActor } from "./useActor";

export type { SessionPackage, BookingInquiry, InquiryInput };
export { InquiryStatus };

// ── Packages ──────────────────────────────────────────────────────────────────

export function useGetAllPackages() {
  const { actor, isFetching } = useActor();
  return useQuery<SessionPackage[]>({
    queryKey: ["packages"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllPackages();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreatePackage() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (pkg: SessionPackage) => {
      if (!actor) throw new Error("Not connected");
      return actor.createPackage(pkg);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["packages"] }),
  });
}

export function useUpdatePackage() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (pkg: SessionPackage) => {
      if (!actor) throw new Error("Not connected");
      return actor.updatePackage(pkg);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["packages"] }),
  });
}

export function useDeletePackage() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Not connected");
      return actor.deletePackage(id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["packages"] }),
  });
}

// ── Inquiries ─────────────────────────────────────────────────────────────────

export function useSubmitInquiry() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: InquiryInput) => {
      if (!actor) throw new Error("Not connected");
      return actor.submitInquiry(input);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["inquiries"] }),
  });
}

export function useGetAllInquiries() {
  const { actor, isFetching } = useActor();
  return useQuery<BookingInquiry[]>({
    queryKey: ["inquiries"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllInquiries();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useUpdateInquiryStatus() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      status,
    }: { id: bigint; status: InquiryStatus }) => {
      if (!actor) throw new Error("Not connected");
      return actor.updateInquiryStatus(id, status);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["inquiries"] }),
  });
}

export function useDeleteInquiry() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Not connected");
      return actor.deleteInquiry(id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["inquiries"] }),
  });
}

// ── Auth ──────────────────────────────────────────────────────────────────────

export function useIsAdmin() {
  const { actor, isFetching } = useActor();
  return useQuery<boolean>({
    queryKey: ["isAdmin"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
  });
}
