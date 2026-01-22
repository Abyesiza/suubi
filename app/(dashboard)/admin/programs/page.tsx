"use client";

import { useMemo, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { FileText, Plus, Search } from "lucide-react";

import Loader from "@/components/ui/Loader";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const STATUSES = ["upcoming", "ongoing", "completed", "cancelled", "postponed"] as const;

export default function AdminProgramsPage() {
  const { user } = useUser();
  const [q, setQ] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const currentUser = useQuery(api.users.getCurrentUser, { clerkId: user?.id || "" });
  const items = useQuery(api.programs.getAllPrograms, {});
  const createProgram = useMutation(api.programs.createProgram);
  const updateProgram = useMutation(api.programs.updateProgram);
  const deleteProgram = useMutation(api.programs.deleteProgram);

  const [form, setForm] = useState({
    name: "",
    description: "",
    goal: "",
    status: STATUSES[0],
    location: "",
  });

  if (currentUser === undefined || items === undefined) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader />
      </div>
    );
  }

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return items;
    return items.filter((p: any) => {
      return (
        (p.name || "").toLowerCase().includes(s) ||
        (p.description || "").toLowerCase().includes(s) ||
        (p.goal || "").toLowerCase().includes(s)
      );
    });
  }, [items, q]);

  const onCreate = async () => {
    try {
      await createProgram({
        name: form.name,
        description: form.description,
        goal: form.goal || undefined,
        startDate: Date.now(),
        endDate: undefined,
        location: form.location || undefined,
        images: [],
        videos: [],
        createdAt: Date.now(),
        updatedAt: Date.now(),
        status: form.status as any,
        contactPersonId: undefined,
        contactPhone: undefined,
        contactEmail: undefined,
        tags: [],
        relatedNewsIds: [],
        isFeatured: false,
        approved: true, // admin can approve; mutation will enforce
      });
      toast.success("Program created");
      setIsOpen(false);
      setForm({ name: "", description: "", goal: "", status: STATUSES[0], location: "" });
    } catch (e: any) {
      toast.error(e?.message || "Failed to create program");
    }
  };

  const toggleApproved = async (id: string, approved: boolean) => {
    try {
      await updateProgram({ id: id as any, approved: !approved });
      toast.success(!approved ? "Approved" : "Unapproved");
    } catch (e: any) {
      toast.error(e?.message || "Failed to update approval");
    }
  };

  const onDelete = async (id: string) => {
    try {
      await deleteProgram({ id: id as any });
      toast.success("Deleted");
    } catch (e: any) {
      toast.error(e?.message || "Failed to delete");
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <PageHeader title="Programs" description="Create and manage community programs">
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="bg-brand-navy hover:bg-brand-navy/90">
              <Plus className="mr-2 h-4 w-4" />
              New Program
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create Program</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Name</Label>
                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <select
                  className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm"
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value as any })}
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label>Location</Label>
                <Input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Goal</Label>
                <Input value={form.goal} onChange={(e) => setForm({ ...form, goal: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  className="min-h-[140px]"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button onClick={onCreate} className="bg-brand-teal hover:bg-brand-teal/90" disabled={!form.name.trim()}>
                Create
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </PageHeader>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input className="pl-9" placeholder="Search programs…" value={q} onChange={(e) => setQ(e.target.value)} />
      </div>

      <Card className="shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <FileText className="h-4 w-4 text-brand-navy" />
            Programs
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {filtered.length ? (
            filtered.map((p: any) => (
              <div key={p._id} className="flex flex-col gap-2 rounded-lg border border-gray-200 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="font-semibold text-brand-navy truncate">{p.name}</div>
                    <div className="text-xs text-gray-500">
                      {p.status} • starts {format(new Date(p.startDate), "MMM d, yyyy")}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={p.approved ? "bg-green-600 text-white" : "bg-brand-amber text-black"}>
                      {p.approved ? "Approved" : "Unapproved"}
                    </Badge>
                    <Button size="sm" variant="outline" onClick={() => toggleApproved(p._id, p.approved)}>
                      {p.approved ? "Unapprove" : "Approve"}
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => onDelete(p._id)}>
                      Delete
                    </Button>
                  </div>
                </div>
                {p.goal && <div className="text-sm text-gray-700">Goal: {p.goal}</div>}
                {p.description && <div className="text-sm text-gray-600 line-clamp-2">{p.description}</div>}
              </div>
            ))
          ) : (
            <div className="text-center py-10 text-gray-500">No programs found</div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

