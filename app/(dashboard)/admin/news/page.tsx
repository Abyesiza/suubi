"use client";

import { useMemo, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { Newspaper, Plus, Search } from "lucide-react";

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

const CATEGORIES = [
  "Announcements",
  "Health Tips",
  "Community Programs",
  "Medical Updates",
  "Staff Highlights",
  "Success Stories",
  "Event Recaps",
  "Policy Changes",
  "Emergency Alerts",
  "Research & Innovation",
] as const;

export default function AdminNewsPage() {
  const { user } = useUser();
  const [q, setQ] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const currentUser = useQuery(api.users.getCurrentUser, { clerkId: user?.id || "" });
  const items = useQuery(api.news.getAllNews, {});
  const updateNews = useMutation(api.news.updateNews);
  const createNews = useMutation(api.news.createNews);
  const deleteNews = useMutation(api.news.deleteNews);

  const [form, setForm] = useState({
    title: "",
    summary: "",
    content: "",
    category: CATEGORIES[0],
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
    return items.filter((n: any) => {
      return (
        (n.title || "").toLowerCase().includes(s) ||
        (n.summary || "").toLowerCase().includes(s) ||
        (n.content || "").toLowerCase().includes(s)
      );
    });
  }, [items, q]);

  const togglePublish = async (id: string, isPublished: boolean) => {
    try {
      await updateNews({ id: id as any, isPublished: !isPublished });
      toast.success(!isPublished ? "Published" : "Unpublished");
    } catch {
      toast.error("Failed to update publish status");
    }
  };

  const onCreate = async () => {
    try {
      await createNews({
        title: form.title,
        summary: form.summary,
        content: form.content,
        images: [],
        category: form.category as any,
        startDate: Date.now(),
        endDate: undefined,
        publishedAt: Date.now(),
        isPublished: false,
        tags: [],
        institution: "Suubi Medical Centre",
        updatedAt: Date.now(),
      });
      toast.success("Draft created");
      setIsOpen(false);
      setForm({ title: "", summary: "", content: "", category: CATEGORIES[0] });
    } catch (e: any) {
      toast.error(e?.message || "Failed to create news");
    }
  };

  const onDelete = async (id: string) => {
    try {
      await deleteNews({ id: id as any });
      toast.success("Deleted");
    } catch (e: any) {
      toast.error(e?.message || "Failed to delete");
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <PageHeader title="News" description="Create and publish news updates">
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="bg-brand-navy hover:bg-brand-navy/90">
              <Plus className="mr-2 h-4 w-4" />
              New Article
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create News Draft</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Title</Label>
                <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Category</Label>
                <select
                  className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm"
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value as any })}
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label>Summary</Label>
                <Textarea value={form.summary} onChange={(e) => setForm({ ...form, summary: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Content</Label>
                <Textarea
                  className="min-h-[160px]"
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button onClick={onCreate} className="bg-brand-teal hover:bg-brand-teal/90" disabled={!form.title.trim()}>
                Create
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </PageHeader>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input className="pl-9" placeholder="Search news…" value={q} onChange={(e) => setQ(e.target.value)} />
      </div>

      <Card className="shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Newspaper className="h-4 w-4 text-brand-navy" />
            Articles
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {filtered.length ? (
            filtered.map((n: any) => (
              <div key={n._id} className="flex flex-col gap-2 rounded-lg border border-gray-200 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="font-semibold text-brand-navy truncate">{n.title}</div>
                    <div className="text-xs text-gray-500">
                      {n.category} • {format(new Date(n.publishedAt || n._creationTime), "MMM d, yyyy")}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={n.isPublished ? "bg-green-600 text-white" : "bg-brand-amber text-black"}>
                      {n.isPublished ? "Published" : "Draft"}
                    </Badge>
                    <Button size="sm" variant="outline" onClick={() => togglePublish(n._id, n.isPublished)}>
                      {n.isPublished ? "Unpublish" : "Publish"}
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => onDelete(n._id)}>
                      Delete
                    </Button>
                  </div>
                </div>
                {n.summary && <div className="text-sm text-gray-600 line-clamp-2">{n.summary}</div>}
              </div>
            ))
          ) : (
            <div className="text-center py-10 text-gray-500">No news found</div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

