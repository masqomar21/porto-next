"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GripVertical, Trash2, Pencil, Link2, Plus, X } from "lucide-react";
import { cn } from "@/lib/utils";

type ExperienceLink = { label: string; url: string };

type Experience = {
  _id?: string;
  role: string;
  company: string;
  companyUrl?: string;
  duration: string;
  description: string;
  tags: string[];
  links?: ExperienceLink[];
  order: number;
};

export default function ExperienceAdminPage() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [role, setRole] = useState("");
  const [company, setCompany] = useState("");
  const [companyUrl, setCompanyUrl] = useState("");
  const [duration, setDuration] = useState("");
  const [description, setDescription] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [links, setLinks] = useState<ExperienceLink[]>([]);
  const [newLinkLabel, setNewLinkLabel] = useState("");
  const [newLinkUrl, setNewLinkUrl] = useState("");

  const [toast, setToast] = useState<{ type: "success" | "error"; msg: string } | null>(null);
  const [draggedId, setDraggedId] = useState<string | null>(null);

  const fetchExperiences = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/experience");
      if (res.ok) {
        const data = await res.json();
        setExperiences(data);
      }
    } catch (err) {
      console.error("Failed to fetch experiences:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExperiences();
  }, []);

  const resetForm = () => {
    setRole("");
    setCompany("");
    setCompanyUrl("");
    setDuration("");
    setDescription("");
    setTagsInput("");
    setLinks([]);
    setNewLinkLabel("");
    setNewLinkUrl("");
    setEditingId(null);
  };

  const handleEdit = (exp: Experience) => {
    setEditingId(exp._id || null);
    setRole(exp.role);
    setCompany(exp.company);
    setCompanyUrl(exp.companyUrl || "");
    setDuration(exp.duration);
    setDescription(exp.description);
    setTagsInput(exp.tags.join(", "));
    setLinks(exp.links || []);
  };

  const handleAddLink = () => {
    const label = newLinkLabel.trim();
    const url = newLinkUrl.trim();
    if (!label || !url) return;
    setLinks([...links, { label, url }]);
    setNewLinkLabel("");
    setNewLinkUrl("");
  };

  const handleRemoveLink = (index: number) => {
    setLinks(links.filter((_, idx) => idx !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const roleName = role.trim();
    const compName = company.trim();
    const durName = duration.trim();
    const descName = description.trim();

    if (!roleName || !compName || !durName || !descName) {
      setToast({ type: "error", msg: "All primary fields are required." });
      return;
    }

    setSaving(true);
    const tagsArray = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t !== "");

    const payload = {
      role: roleName,
      company: compName,
      companyUrl: companyUrl.trim(),
      duration: durName,
      description: descName,
      tags: tagsArray,
      links,
      order: editingId ? undefined : experiences.length,
    };

    try {
      let res;
      if (editingId) {
        res = await fetch(`/api/admin/experience/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch("/api/admin/experience", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      if (res.ok) {
        setToast({
          type: "success",
          msg: editingId ? "Experience updated successfully!" : "Experience added successfully!",
        });
        resetForm();
        fetchExperiences();
      } else {
        setToast({ type: "error", msg: "Failed to save experience." });
      }
    } catch (err) {
      console.error(err);
      setToast({ type: "error", msg: "An error occurred while saving." });
    } finally {
      setSaving(false);
      setTimeout(() => setToast(null), 3000);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this experience?")) return;
    try {
      const res = await fetch(`/api/admin/experience/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setToast({ type: "success", msg: "Experience deleted." });
        fetchExperiences();
      } else {
        setToast({ type: "error", msg: "Failed to delete experience." });
      }
    } catch (err) {
      console.error(err);
      setToast({ type: "error", msg: "An error occurred." });
    } finally {
      setTimeout(() => setToast(null), 3000);
    }
  };

  // Drag and drop handlers for reordering
  const handleDragStart = (id: string) => {
    setDraggedId(id);
  };

  const handleDragOver = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    if (!draggedId || draggedId === targetId) return;

    const draggedIdx = experiences.findIndex((exp) => exp._id === draggedId);
    const targetIdx = experiences.findIndex((exp) => exp._id === targetId);
    if (draggedIdx === -1 || targetIdx === -1) return;

    const updated = [...experiences];
    const [draggedItem] = updated.splice(draggedIdx, 1);
    updated.splice(targetIdx, 0, draggedItem);

    setExperiences(updated);
  };

  const handleDragEnd = async () => {
    setDraggedId(null);
    try {
      const orders = experiences.map((exp, idx) => ({ id: exp._id, order: idx }));
      await fetch("/api/admin/experience", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orders }),
      });
    } catch (err) {
      console.error("Failed to save experience order:", err);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl animate-in fade-in duration-300">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
          Work Experience
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Manage your career timeline displayed on the public landing page.
        </p>
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

      {/* Add / Edit Form */}
      <Card className="bg-card border-border shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-foreground">
            {editingId ? "Edit Experience" : "Add New Experience"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Role / Position
                </label>
                <Input
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="e.g. Senior Frontend Engineer"
                  className="bg-muted/30 border-border focus-visible:ring-violet-500"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Company
                </label>
                <Input
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="e.g. Klaviyo"
                  className="bg-muted/30 border-border focus-visible:ring-violet-500"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Company Website URL
                </label>
                <Input
                  value={companyUrl}
                  onChange={(e) => setCompanyUrl(e.target.value)}
                  placeholder="https://example.com"
                  className="bg-muted/30 border-border focus-visible:ring-violet-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Duration / Period
                </label>
                <Input
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  placeholder="e.g. 2024 — PRESENT or JULY — DEC 2017"
                  className="bg-muted/30 border-border focus-visible:ring-violet-500"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Job Description
              </label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your achievements and tasks..."
                className="min-h-32 bg-muted/30 border-border focus-visible:ring-violet-500"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Technologies / Tags (comma separated)
              </label>
              <Input
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="JavaScript, TypeScript, React, Storybook"
                className="bg-muted/30 border-border focus-visible:ring-violet-500"
              />
            </div>

            {/* Custom Links Management */}
            <div className="border-t border-border/40 pt-4 mt-2 space-y-3">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
                Additional Links / References (optional)
              </label>
              
              {/* Existing links */}
              {links.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {links.map((link, idx) => (
                    <Badge
                      key={idx}
                      variant="secondary"
                      className="bg-violet-500/10 text-violet-400 border-transparent gap-1.5 px-3 py-1 text-xs"
                    >
                      <Link2 className="w-3 h-3" />
                      <span>{link.label}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveLink(idx)}
                        className="hover:text-destructive text-muted-foreground/60 transition-colors ml-1"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}

              {/* Add link input row */}
              <div className="flex flex-col sm:flex-row gap-3 items-end sm:items-center">
                <Input
                  value={newLinkLabel}
                  onChange={(e) => setNewLinkLabel(e.target.value)}
                  placeholder="Link Label (e.g. MusicKit.js)"
                  className="bg-muted/30 border-border focus-visible:ring-violet-500 text-xs h-9 flex-1"
                />
                <Input
                  value={newLinkUrl}
                  onChange={(e) => setNewLinkUrl(e.target.value)}
                  placeholder="https://developer.apple.com..."
                  className="bg-muted/30 border-border focus-visible:ring-violet-500 text-xs h-9 flex-1"
                />
                <Button
                  type="button"
                  onClick={handleAddLink}
                  className="bg-muted hover:bg-muted/80 text-foreground border border-border text-xs font-semibold h-9 px-4 cursor-pointer shrink-0"
                >
                  <Plus className="w-4 h-4 mr-1" /> Add Link
                </Button>
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t border-border/40 justify-end">
              {editingId && (
                <Button
                  type="button"
                  onClick={resetForm}
                  className="bg-muted text-foreground hover:bg-muted/80 font-semibold cursor-pointer border border-border"
                >
                  Cancel
                </Button>
              )}
              <Button
                type="submit"
                disabled={saving}
                className="bg-violet-600 hover:bg-violet-700 text-white font-semibold cursor-pointer px-6"
              >
                {saving ? "Saving..." : editingId ? "Save Changes" : "Create Experience"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Experience Timeline Reordering List */}
      <div>
        <h2 className="text-xl font-bold text-foreground mb-4">Seeded & Configured Timeline</h2>
        
        {loading ? (
          <div className="text-center py-12 text-muted-foreground text-sm">Loading timeline...</div>
        ) : experiences.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground text-sm border border-dashed border-border rounded-xl">
            No work experiences configured yet. Use the form above to add your first job!
          </div>
        ) : (
          <div className="space-y-4">
            {experiences.map((exp, idx) => (
              <Card
                key={exp._id}
                draggable
                onDragStart={() => handleDragStart(exp._id!)}
                onDragOver={(e) => handleDragOver(e, exp._id!)}
                onDragEnd={handleDragEnd}
                className={cn(
                  "bg-card border-border shadow-sm relative group/card cursor-grab active:cursor-grabbing transition-all",
                  draggedId === exp._id
                    ? "opacity-40 border-violet-500 scale-[0.98] duration-100"
                    : "duration-200"
                )}
              >
                <CardContent
                  className="p-5 flex gap-4 cursor-default"
                  draggable={false}
                  onDragStart={(e) => e.stopPropagation()}
                >
                  <div
                    className="p-1 rounded text-muted-foreground/40 opacity-50 hover:text-muted-foreground/80 cursor-grab active:cursor-grabbing shrink-0 self-center"
                    draggable
                    onDragStart={(e) => {
                      e.stopPropagation();
                      handleDragStart(exp._id!);
                    }}
                    onDragOver={(e) => handleDragOver(e, exp._id!)}
                    onDragEnd={handleDragEnd}
                  >
                    <GripVertical className="w-4 h-4" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                      <div>
                        <h3 className="font-bold text-foreground text-base leading-snug">
                          {exp.role} <span className="text-muted-foreground font-normal">at</span> {exp.company}
                        </h3>
                        <p className="text-xs text-muted-foreground font-mono mt-0.5">{exp.duration}</p>
                      </div>
                      <div className="flex items-center gap-2" onDragStart={(e) => e.stopPropagation()} draggable={false}>
                        <Button
                          onClick={() => handleEdit(exp)}
                          size="sm"
                          className="bg-muted hover:bg-muted/80 text-foreground border border-border h-8 px-3 text-xs cursor-pointer font-semibold"
                        >
                          <Pencil className="w-3.5 h-3.5 mr-1" /> Edit
                        </Button>
                        <Button
                          onClick={() => handleDelete(exp._id!)}
                          variant="destructive"
                          size="sm"
                          className="bg-destructive/10 text-destructive border-transparent hover:bg-destructive hover:text-white transition-colors h-8 px-3 text-xs cursor-pointer font-semibold"
                        >
                          <Trash2 className="w-3.5 h-3.5 mr-1" /> Delete
                        </Button>
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground mt-2 leading-relaxed line-clamp-3">
                      {exp.description}
                    </p>

                    {exp.tags && exp.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-3">
                        {exp.tags.map((t) => (
                          <Badge
                            key={t}
                            variant="secondary"
                            className="bg-violet-500/10 text-violet-400 border-transparent text-[10px] px-2 py-0.5"
                          >
                            {t}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
