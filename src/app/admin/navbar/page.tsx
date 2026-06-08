"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Navdata = {
  title: string;
  imageUrl: string;
};

export default function NavbarAdminPage() {
  const [data, setData] = useState<Navdata>({
    title: "",
    imageUrl: "",
  });
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{
    type: "success" | "error";
    msg: string;
  } | null>(null);

  useEffect(() => {
    fetch("/api/admin/navbar")
      .then((r) => r.json())
      .then((d) =>
        setData({
          title: d.title || "",
          imageUrl: d.imageUrl || "",
        }),
      );
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/admin/navbar", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Save failed");
      setToast({ type: "success", msg: "Navbar section saved!" });
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
          NavBar Section
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Manage the NavBar content of your homepage
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
            Logo URL
          </label>
          <div className="flex gap-4 items-center">
            {data.imageUrl && (
              <img
                src={data.imageUrl}
                alt="Logo Preview"
                className="w-12 h-12 rounded-full object-cover border border-border bg-muted/40 shrink-0"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            )}
            <Input
              value={data.imageUrl}
              onChange={(e) =>
                setData((p) => ({ ...p, imageUrl: e.target.value }))
              }
              placeholder="https://images.unsplash.com/photo-..."
              className="flex-1 bg-muted/30 border-border focus-visible:ring-violet-500"
            />
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
          className="px-6 py-2 bg-violet-600 hover:bg-violet-700 text-white font-semibold rounded-md shadow-sm hover:translate-y-[-1px] transition-all cursor-pointer"
        >
          {saving ? "Saving…" : "Save Navbar"}
        </Button>
      </form>
    </div>
  );
}
