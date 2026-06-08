"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GripVertical } from "lucide-react";
import { cn } from "@/lib/utils";

type Skill = { _id?: string; category: string; name: string; level: number };

export default function SkillsAdminPage() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [newCategory, setNewCategory] = useState("");
  const [emptyCategories, setEmptyCategories] = useState<string[]>([]);
  const [categoryNamesOrder, setCategoryNamesOrder] = useState<string[]>([]);
  const [skillInputs, setSkillInputs] = useState<
    Record<string, { name: string; level: number | "" }>
  >({});
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{
    type: "success" | "error";
    msg: string;
  } | null>(null);
  const [draggedSkillId, setDraggedSkillId] = useState<string | null>(null);
  const [draggedCategoryIndex, setDraggedCategoryIndex] = useState<
    number | null
  >(null);

  const fetchSkills = async () => {
    const res = await fetch("/api/admin/skills");
    const data = await res.json();
    setSkills(data);

    // Initialize categoryNamesOrder based on unique category fields in fetched data
    const cats: string[] = [];
    data.forEach((s: any) => {
      if (!cats.includes(s.category)) cats.push(s.category);
    });

    setCategoryNamesOrder((prev) => {
      const merged = [...cats];
      // Keep any empty categories that aren't represented in skills yet
      prev.forEach((p) => {
        if (!merged.includes(p)) merged.push(p);
      });
      return merged;
    });
  };
  useEffect(() => {
    fetchSkills();
  }, []);

  const handleCreateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    const catName = newCategory.trim();
    if (!catName) return;

    // Check if category already exists in master order list
    const exists = categoryNamesOrder.some(
      (c) => c.toLowerCase() === catName.toLowerCase(),
    );
    if (exists) {
      setToast({ type: "error", msg: "Category already exists." });
      return;
    }

    setEmptyCategories((p) => [...p, catName]);
    setCategoryNamesOrder((p) => [...p, catName]);
    setNewCategory("");
    setToast({ type: "success", msg: `Category "${catName}" created!` });
    setTimeout(() => setToast(null), 2000);
  };

  const addSubSkill = async (category: string) => {
    const input = skillInputs[category];
    const name = input?.name?.trim();
    const level = typeof input?.level === "number" ? input.level : 80;

    if (!name) {
      setToast({ type: "error", msg: "Sub-skill name is required." });
      return;
    }

    setSaving(true);

    // Find current skills in this category to set correct order index
    const catSkills = skills.filter((s) => s.category === category);
    const nextOrder = catSkills.length;

    await fetch("/api/admin/skills", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ category, name, level, order: nextOrder }),
    });

    // Clear local input
    setSkillInputs((p) => ({
      ...p,
      [category]: { name: "", level: 80 },
    }));

    // Remove category from emptyCategories since it now exists in database
    setEmptyCategories((p) => p.filter((c) => c !== category));

    await fetchSkills();
    setSaving(false);
    setToast({ type: "success", msg: "Sub-skill added!" });
    setTimeout(() => setToast(null), 2000);
  };

  const deleteSkill = async (id: string) => {
    const skillToDelete = skills.find((s) => s._id === id);
    if (!skillToDelete) return;

    await fetch(`/api/admin/skills/${id}`, { method: "DELETE" });

    // If it was the last skill in this category, keep the category in emptyCategories state
    const siblings = skills.filter(
      (s) => s.category === skillToDelete.category && s._id !== id,
    );
    if (siblings.length === 0) {
      setEmptyCategories((p) => {
        if (!p.includes(skillToDelete.category))
          return [...p, skillToDelete.category];
        return p;
      });
    }

    fetchSkills();
  };

  const handleDragStart = (id: string) => {
    setDraggedSkillId(id);
  };

  const handleDragOver = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    if (!draggedSkillId || draggedSkillId === targetId) return;

    const draggedIdx = skills.findIndex((s) => s._id === draggedSkillId);
    const targetIdx = skills.findIndex((s) => s._id === targetId);
    if (draggedIdx === -1 || targetIdx === -1) return;

    if (skills[draggedIdx].category !== skills[targetIdx].category) return;

    const updated = [...skills];
    const [draggedItem] = updated.splice(draggedIdx, 1);
    updated.splice(targetIdx, 0, draggedItem);

    setSkills(updated);
  };

  const handleDragEnd = async () => {
    setDraggedSkillId(null);
    try {
      const orders = skills.map((s, idx) => ({ id: s._id, order: idx }));
      await fetch("/api/admin/skills", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orders }),
      });
    } catch (err) {
      console.error("Failed to save skill order:", err);
    }
  };

  const handleCategoryDragStart = (index: number) => {
    setDraggedCategoryIndex(index);
  };

  const handleCategoryDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedCategoryIndex === null || draggedCategoryIndex === index) return;

    const updatedNames = [...categoryNamesOrder];
    const draggedName = updatedNames[draggedCategoryIndex];
    updatedNames.splice(draggedCategoryIndex, 1);
    updatedNames.splice(index, 0, draggedName);

    setDraggedCategoryIndex(index);
    setCategoryNamesOrder(updatedNames);
  };

  const handleCategoryDragEnd = async () => {
    setDraggedCategoryIndex(null);
    try {
      const orders: { id: string; categoryOrder: number }[] = [];
      categoryNamesOrder.forEach((catName, catIdx) => {
        const catSkills = skills.filter((s) => s.category === catName);
        catSkills.forEach((s) => {
          orders.push({ id: s._id!, categoryOrder: catIdx });
        });
      });
      await fetch("/api/admin/skills", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orders }),
      });
    } catch (err) {
      console.error("Failed to save category order:", err);
    }
  };

  const categoriesList: { category: string; skills: Skill[] }[] = [];
  skills.forEach((s) => {
    let cat = categoriesList.find((c) => c.category === s.category);
    if (!cat) {
      cat = { category: s.category, skills: [] };
      categoriesList.push(cat);
    }
    cat.skills.push(s);
  });

  emptyCategories.forEach((catName) => {
    if (!categoriesList.some((c) => c.category === catName)) {
      categoriesList.push({ category: catName, skills: [] });
    }
  });

  categoriesList.sort((a, b) => {
    const idxA = categoryNamesOrder.indexOf(a.category);
    const idxB = categoryNamesOrder.indexOf(b.category);
    if (idxA === -1) return 1;
    if (idxB === -1) return -1;
    return idxA - idxB;
  });

  return (
    <div className="space-y-6 max-w-3xl animate-in fade-in duration-300">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
          Skills
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Manage technical skills displayed on the public portfolio (drag cards
          to reorder categories, drag rows inside to reorder skills)
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

      <Card className="bg-card border-border shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-foreground">
            Create New Category
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleCreateCategory}
            className="flex gap-3 items-center"
          >
            <Input
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="Category name (e.g. Mobile Development)"
              className="bg-muted/30 border-border focus-visible:ring-violet-500 max-w-md h-9 text-sm"
            />
            <Button
              type="submit"
              className="bg-violet-600 hover:bg-violet-700 text-white font-semibold cursor-pointer shrink-0 h-9 px-4 text-sm"
            >
              Create Category
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-6">
        {categoriesList.map(({ category, skills: catSkills }, catIdx) => (
          <Card
            key={category}
            draggable
            onDragStart={() => handleCategoryDragStart(catIdx)}
            onDragOver={(e) => handleCategoryDragOver(e, catIdx)}
            onDragEnd={handleCategoryDragEnd}
            className={cn(
              "bg-card border-border shadow-sm relative group/card cursor-grab active:cursor-grabbing transition-all",
              draggedCategoryIndex === catIdx
                ? "opacity-40 border-violet-500 scale-[0.98] duration-100"
                : "duration-200",
            )}
          >
            <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-base font-bold text-foreground">
                {category}
              </CardTitle>
              <div className="p-1 rounded text-muted-foreground/40 opacity-50 group-hover/card:opacity-100 transition-opacity">
                <GripVertical className="w-4 h-4" />
              </div>
            </CardHeader>
            <CardContent
              className="space-y-4 cursor-default"
              draggable={false}
              onDragStart={(e) => e.stopPropagation()}
            >
              {catSkills.length > 0 ? (
                <div className="space-y-2">
                  {catSkills.map((skill) => (
                    <div
                      key={skill._id}
                      draggable
                      onDragStart={(e) => {
                        e.stopPropagation();
                        handleDragStart(skill._id!);
                      }}
                      onDragOver={(e) => handleDragOver(e, skill._id!)}
                      onDragEnd={handleDragEnd}
                      className={cn(
                        "flex items-center gap-4 p-2 rounded-lg transition-all cursor-grab active:cursor-grabbing hover:bg-muted/30 border border-transparent",
                        draggedSkillId === skill._id
                          ? "opacity-40 border-dashed border-violet-500/40 bg-violet-500/5 scale-[0.98]"
                          : "",
                      )}
                    >
                      <GripVertical className="w-3.5 h-3.5 text-muted-foreground/40 hover:text-muted-foreground/80 shrink-0" />
                      <span className="text-sm font-medium text-foreground w-32 truncate">
                        {skill.name}
                      </span>
                      <div className="flex-grow h-2 bg-muted/60 rounded-full overflow-hidden">
                        <div
                          style={{ width: `${skill.level}%` }}
                          className="h-full bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-full"
                        />
                      </div>
                      <span className="text-xs text-muted-foreground w-9 text-right font-medium">
                        {skill.level}%
                      </span>
                      <button
                        onClick={() => deleteSkill(skill._id!)}
                        className="text-muted-foreground hover:text-destructive transition-colors text-base font-semibold cursor-pointer px-1"
                        draggable={false}
                        onDragStart={(e) => e.stopPropagation()}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 text-xs text-muted-foreground border border-dashed border-border/60 rounded-lg">
                  No sub-skills in this category. Add your first one below!
                </div>
              )}

              {/* Inline Add Skill Form */}
              <div className="border-t border-border/40 pt-4 mt-2 space-y-3">
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Add Sub-Skill
                </h4>
                <div className="flex gap-2 items-center">
                  <Input
                    placeholder="Skill Name (e.g. React)"
                    value={skillInputs[category]?.name || ""}
                    onChange={(e) =>
                      setSkillInputs((p) => ({
                        ...p,
                        [category]: { ...p[category], name: e.target.value },
                      }))
                    }
                    className="bg-muted/30 border-border focus-visible:ring-violet-500 h-8 text-xs flex-1"
                    draggable={false}
                    onDragStart={(e) => e.stopPropagation()}
                  />
                  <Input
                    type="number"
                    min={0}
                    max={100}
                    placeholder="Level %"
                    value={skillInputs[category]?.level ?? ""}
                    onChange={(e) =>
                      setSkillInputs((p) => ({
                        ...p,
                        [category]: {
                          ...p[category],
                          level:
                            e.target.value === "" ? "" : Number(e.target.value),
                        },
                      }))
                    }
                    className="bg-muted/30 border-border focus-visible:ring-violet-500 h-8 text-xs w-24 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    draggable={false}
                    onDragStart={(e) => e.stopPropagation()}
                  />
                  <Button
                    onClick={() => addSubSkill(category)}
                    className="bg-violet-600 hover:bg-violet-700 text-white font-semibold h-8 text-xs px-3 cursor-pointer shrink-0"
                    draggable={false}
                    onDragStart={(e) => e.stopPropagation()}
                  >
                    Add
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {skills.length === 0 && emptyCategories.length === 0 && (
          <div className="text-center py-12 text-muted-foreground text-sm border border-dashed border-border rounded-xl">
            No categories or skills yet. Create your first category using the
            form above!
          </div>
        )}
      </div>
    </div>
  );
}
