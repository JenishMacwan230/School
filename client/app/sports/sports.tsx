"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { useAuthStore } from "@/store/auth";
import { apiFetch } from "@/lib/api";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import MasonryGallery from "@/components/Sgrid";

/* ================= TYPES ================= */

interface Sport {
  id: number;
  title: string;
  category: "OUTDOOR" | "INDOOR";
  description?: string;
  image: string;
  position: number;
}

interface GalleryImage {
  id: number;
  image: string;
}

/* ================= PAGE ================= */

export default function SportsPage() {
  const { user } = useAuthStore();
  const isAdmin = user?.role === "SUPER_ADMIN";

  const [sports, setSports] = useState<Sport[]>([]);
  const [gallery, setGallery] = useState<GalleryImage[]>([]);

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Sport | null>(null);

  const [draft, setDraft] = useState({
    title: "",
    category: "OUTDOOR" as "OUTDOOR" | "INDOOR",
    description: "",
    image: "",
    position: 0,
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const [errors, setErrors] = useState<{ title?: string }>({});
  const galleryInputRef = useRef<HTMLInputElement | null>(null);

  /* ================= FETCH ================= */

  useEffect(() => {
    apiFetch("/api/sports").then(setSports);
    apiFetch("/api/gallery").then(setGallery);
  }, []);

  /* ================= IMAGE UPLOAD ================= */

  const uploadImage = async (file: File) => {
    const fd = new FormData();
    fd.append("image", file);

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/upload/campus-image`,
      {
        method: "POST",
        credentials: "include",
        body: fd,
      }
    );

    if (!res.ok) throw new Error("Upload failed");
    return res.json(); // { url }
  };

  /* ================= VALIDATION ================= */

  const validate = () => {
    const e: { title?: string } = {};
    if (!draft.title.trim()) e.title = "Title is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  /* ================= SAVE SPORT ================= */

  const saveSport = async () => {
    if (!validate()) return;

    try {
      setSaving(true);

      let imageUrl = draft.image || "/user.jpg";

      if (imageFile) {
        const uploaded = await uploadImage(imageFile);
        imageUrl = uploaded.url;
      }

      const payload = { ...draft, image: imageUrl };

      if (editing) {
        await apiFetch(`/api/sports/${editing.id}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });

        setSports((p) =>
          p.map((s) => (s.id === editing.id ? { ...s, ...payload } : s))
        );
      } else {
        const created = await apiFetch("/api/sports", {
          method: "POST",
          body: JSON.stringify(payload),
        });
        setSports((p) => [...p, created]);
      }

      setOpen(false);
      setEditing(null);
      setDraft({
        title: "",
        category: "OUTDOOR",
        description: "",
        image: "",
        position: 0,
      });
      setImageFile(null);
      setErrors({});
    } finally {
      setSaving(false);
    }
  };

  const outdoor = sports.filter((s) => s.category === "OUTDOOR");
  const indoor = sports.filter((s) => s.category === "INDOOR");

  /* ================= UI ================= */

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 pt-32 pb-24 space-y-20">

        {/* HEADER */}
        <section className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
            Sports & Physical Education
          </h1>
          <p className="text-muted-foreground max-w-3xl mx-auto">
            Physical fitness, discipline, and teamwork form the foundation of our sports culture.
          </p>
        </section>

        <Separator />

        {isAdmin && (
          <div className="flex justify-end">
            <Button onClick={() => setOpen(true)}>Add Sport</Button>
          </div>
        )}

        {/* OUTDOOR */}
        <SportSection
          title="Outdoor Sports"
          sports={outdoor}
          isAdmin={isAdmin}
          deletingId={deletingId}
          onEdit={(s) => {
            setEditing(s);
            setDraft({
              title: s.title,
              category: s.category,
              description: s.description || "",
              image: s.image,
              position: s.position,
            });
            setOpen(true);
          }}
          onDelete={async (id) => {
            if (!confirm("Are you sure you want to delete this sport?")) return;
            try {
              setDeletingId(id);
              await apiFetch(`/api/sports/${id}`, { method: "DELETE" });
              setSports((p) => p.filter((x) => x.id !== id));
            } finally {
              setDeletingId(null);
            }
          }}
        />

        <Separator />

        {/* INDOOR */}
        <SportSection
          title="Indoor Sports"
          sports={indoor}
          isAdmin={isAdmin}
          deletingId={deletingId}
          onEdit={(s) => {
            setEditing(s);
            setDraft({
              title: s.title,
              category: s.category,
              description: s.description || "",
              image: s.image,
              position: s.position,
            });
            setOpen(true);
          }}
          onDelete={async (id) => {
            if (!confirm("Are you sure you want to delete this sport?")) return;
            try {
              setDeletingId(id);
              await apiFetch(`/api/sports/${id}`, { method: "DELETE" });
              setSports((p) => p.filter((x) => x.id !== id));
            } finally {
              setDeletingId(null);
            }
          }}
        />

        <Separator />

        {/* GALLERY */}
        <section className="space-y-8">
          <h2 className="text-2xl font-semibold text-center">
            Sports Gallery
          </h2>

          {isAdmin && (
            <div className="flex justify-center">
              <input
                ref={galleryInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;

                  const uploaded = await uploadImage(file);

                  const created = await apiFetch("/api/gallery", {
                    method: "POST",
                    body: JSON.stringify({ image: uploaded.url }),
                  });

                  setGallery((p) => [...p, created]);
                  e.target.value = "";
                }}
              />

              <Button
                variant="outline"
                onClick={() => galleryInputRef.current?.click()}
              >
                ➕ Add Gallery Image
              </Button>
            </div>
          )}

          <MasonryGallery
            images={gallery}
            isAdmin={isAdmin}
            onDelete={async (id) => {
              if (!confirm("Delete this image?")) return;
              await apiFetch(`/api/gallery/${id}`, { method: "DELETE" });
              setGallery((p) => p.filter((x) => x.id !== id));
            }}
          />
        </section>

        <Separator />

        {/* FINAL QUOTE */}
        <section className="text-center space-y-3">
          <h2 className="text-2xl font-semibold">
            “A Healthy Body Builds a Strong Mind”
          </h2>
          <p className="text-muted-foreground max-w-3xl mx-auto">
            Through sports, we instill confidence, discipline, leadership, and lifelong fitness habits in our students.
          </p>
        </section>

        {/* DIALOG */}
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editing ? "Edit Sport" : "Add Sport"}</DialogTitle>
            </DialogHeader>

            <Input
              placeholder="Title *"
              value={draft.title}
              onChange={(e) =>
                setDraft({ ...draft, title: e.target.value })
              }
            />
            {errors.title && (
              <p className="text-sm text-red-500">{errors.title}</p>
            )}

            {/* CATEGORY SELECTOR (NEW) */}
            <div className="flex gap-4">
              <Button
                type="button"
                variant={draft.category === "OUTDOOR" ? "default" : "outline"}
                onClick={() =>
                  setDraft({ ...draft, category: "OUTDOOR" })
                }
              >
                Outdoor
              </Button>
              <Button
                type="button"
                variant={draft.category === "INDOOR" ? "default" : "outline"}
                onClick={() =>
                  setDraft({ ...draft, category: "INDOOR" })
                }
              >
                Indoor
              </Button>
            </div>

            {/* IMAGE PREVIEW */}
            <div className="flex justify-center">
              <div className="relative w-32 h-32 rounded-full overflow-hidden border">
                <Image
                  src={
                    imageFile
                      ? URL.createObjectURL(imageFile)
                      : draft.image || "/user.jpg"
                  }
                  alt="Preview"
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                setImageFile(e.target.files?.[0] || null)
              }
            />

            <Button disabled={saving} onClick={saveSport}>
              {saving ? "Saving..." : "Save"}
            </Button>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

/* ================= HELPERS ================= */

function SportSection({
  title,
  sports,
  isAdmin,
  deletingId,
  onEdit,
  onDelete,
}: {
  title: string;
  sports: Sport[];
  isAdmin: boolean;
  deletingId: number | null;
  onEdit: (s: Sport) => void;
  onDelete: (id: number) => void;
}) {
  return (
    <section className="space-y-8">
      <h2 className="text-2xl font-semibold text-center">{title}</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {sports.map((s) => (
          <Card key={s.id} className="relative">
            {isAdmin && (
              <div className="absolute top-2 right-2 flex gap-2 z-10">
                <Button size="icon" variant="ghost" onClick={() => onEdit(s)}>
                  ✏️
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  disabled={deletingId === s.id}
                  onClick={() => onDelete(s.id)}
                >
                  {deletingId === s.id ? "⏳" : "🗑"}
                </Button>
              </div>
            )}

            <CardHeader>
              <div className="relative w-full h-44 rounded-xl overflow-hidden">
                <Image
                  src={s.image || "/user.jpg"}
                  alt={s.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover"
                />
              </div>
              <CardTitle className="mt-3 text-center">{s.title}</CardTitle>
            </CardHeader>

            {s.description && (
              <CardContent className="text-muted-foreground text-center">
                {s.description}
              </CardContent>
            )}
          </Card>
        ))}
      </div>
    </section>
  );
}
