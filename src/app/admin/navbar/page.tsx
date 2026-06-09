"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GripVertical } from "lucide-react";
import { cn } from "@/lib/utils";
import { ImageUpload } from "@/components/ui/image-upload";

type Navdata = {
  title: string;
  imageUrl: string;
};

const sectionNames: Record<string, string> = {
  hero: "Hero Section",
  about: "Biography (About)",
  experience: "Work Experience",
  skills: "Main Skills",
  projects: "Featured Projects",
  blog: "Blog Publications",
  contact: "Contact Section",
};

export default function NavbarAdminPage() {
  const [data, setData] = useState<Navdata>({
    title: "",
    imageUrl: "",
  });
  const [sectionOrder, setSectionOrder] = useState<string[]>([]);
  const [draggedSection, setDraggedSection] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{
    type: "success" | "error";
    msg: string;
  } | null>(null);

  useEffect(() => {
    fetch("/api/admin/navbar", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => {
        setData({
          title: d.title || "",
          imageUrl: d.imageUrl || "",
        });
        setSectionOrder(
          d.sectionOrder && d.sectionOrder.length > 0
            ? d.sectionOrder
            : [
                "hero",
                "about",
                "experience",
                "skills",
                "projects",
                "blog",
                "contact",
              ],
        );
      });
  }, []);

  const handleDragStart = (sectionId: string) => {
    setDraggedSection(sectionId);
  };

  const handleDragOver = (e: React.DragEvent, targetSection: string) => {
    e.preventDefault();
    if (!draggedSection || draggedSection === targetSection) return;

    const draggedIdx = sectionOrder.indexOf(draggedSection);
    const targetIdx = sectionOrder.indexOf(targetSection);
    if (draggedIdx === -1 || targetIdx === -1) return;

    const updated = [...sectionOrder];
    const [draggedItem] = updated.splice(draggedIdx, 1);
    updated.splice(targetIdx, 0, draggedItem);

    console.log(updated);

    setSectionOrder(updated);
  };

  const handleDragEnd = () => {
    setDraggedSection(null);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/admin/navbar", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: data.title,
          imageUrl: data.imageUrl,
          sectionOrder,
        }),
      });
      if (!res.ok) throw new Error("Save failed");
      setToast({ type: "success", msg: "Navbar & section ordering saved!" });
    } catch {
      setToast({ type: "error", msg: "Failed to save. Please try again." });
    } finally {
      setSaving(false);
      setTimeout(() => setToast(null), 3000);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl animate-in fade-in duration-300">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
          NavBar & Ordering
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Manage the NavBar details and drag sections to reorder the landing
          page layout.
        </p>
      </div>

      <form
        onSubmit={handleSave}
        className="space-y-6 bg-card border border-border p-6 rounded-xl shadow-sm"
      >
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Title
          </label>
          <Input
            value={data.title}
            onChange={(e) => setData((p) => ({ ...p, title: e.target.value }))}
            placeholder="My Portfolio"
            className="bg-muted/30 border-border focus-visible:ring-violet-500"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Logo Image
          </label>
          <ImageUpload
            value={data.imageUrl}
            onChange={(url) => setData((p) => ({ ...p, imageUrl: url }))}
            allowedTypes={['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml']}
          />
        </div>

        {/* Dynamic Section Ordering */}
        <div className="border-t border-border/40 pt-4 space-y-3">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
            Landing Section Ordering (Drag to Reorder)
          </label>
          <p className="text-xs text-muted-foreground">
            Navbar is fixed at the top and Footer is fixed at the bottom.
            Reorder the rest below:
          </p>

          <div className="space-y-2 mt-2">
            {sectionOrder.map((sectionId) => (
              <div
                key={sectionId}
                draggable
                onDragStart={() => handleDragStart(sectionId)}
                onDragOver={(e) => handleDragOver(e, sectionId)}
                onDragEnd={handleDragEnd}
                className={cn(
                  "flex items-center gap-3 p-3 rounded-lg border border-border bg-muted/30 cursor-grab active:cursor-grabbing transition-all",
                  draggedSection === sectionId
                    ? "opacity-45 scale-[0.98] border-violet-500 bg-violet-500/5"
                    : "hover:bg-muted/50",
                )}
              >
                <GripVertical className="w-4 h-4 text-muted-foreground/50 shrink-0" />
                <span className="text-sm font-medium text-foreground">
                  {sectionNames[sectionId] || sectionId}
                </span>
                <span className="ml-auto text-[10px] font-mono text-muted-foreground bg-muted border border-border/50 px-2 py-0.5 rounded uppercase tracking-wider">
                  #{sectionId}
                </span>
              </div>
            ))}
          </div>
        </div>

        {toast && (
          <div
            className={`p-3 rounded-md text-sm border ${
              toast.type === "success"
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                : "bg-destructive/10 border-destructive/30 text-destructive"
            }`}
          >
            {toast.msg}
          </div>
        )}

        <Button
          type="submit"
          disabled={saving}
          className="px-6 py-2 bg-violet-600 hover:bg-violet-700 text-white font-semibold rounded-md shadow-sm hover:translate-y-[-1px] transition-all cursor-pointer w-full sm:w-auto"
        >
          {saving ? "Saving…" : "Save Navbar & Layout"}
        </Button>
      </form>
    </div>
  );
}
