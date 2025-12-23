"use client";

import { useEffect, useState } from "react";
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
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

/* ================= TYPES ================= */

interface CampusSection {
  id: number;
  title: string;
  description: string;
  image: string;
  position: number;
}

/* ================= PAGE ================= */

export default function ExploreCampusPage() {
  const { user } = useAuthStore();
  const isAdmin = user?.role === "SUPER_ADMIN";

  const [sections, setSections] = useState<CampusSection[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<CampusSection | null>(null);

  const [draft, setDraft] = useState({
    title: "",
    description: "",
    image: "",
    position: 0,
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);


  /* FETCH */
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await apiFetch("/api/campus");
        setSections(data);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);


  /* IMAGE UPLOAD */
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

  /* SAVE */
  const saveSection = async () => {
    try {
      setSaving(true);

      let imageUrl = draft.image || "/user.jpg";

      if (imageFile) {
        const uploaded = await uploadImage(imageFile);
        imageUrl = uploaded.url;
      }

      const payload = { ...draft, image: imageUrl };

      if (editing) {
        await apiFetch(`/api/campus/${editing.id}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });

        setSections((prev) =>
          prev.map((s) =>
            s.id === editing.id ? { ...s, ...payload } : s
          )
        );
      } else {
        const created = await apiFetch("/api/campus", {
          method: "POST",
          body: JSON.stringify(payload),
        });
        setSections((prev) => [...prev, created]);
      }

      setOpen(false);
      setEditing(null);
      setDraft({ title: "", description: "", image: "", position: 0 });
      setImageFile(null);
      setImagePreview(null);
    } finally {
      setSaving(false);
    }
  };

  /* DELETE */
  const deleteSection = async (id: number) => {
    const ok = window.confirm(
      "Are you sure you want to delete this section?"
    );
    if (!ok) return;

    try {
      setDeletingId(id);
      await apiFetch(`/api/campus/${id}`, { method: "DELETE" });
      setSections((p) => p.filter((x) => x.id !== id));
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 pt-32 pb-32 space-y-12">

        <section className="text-center space-y-4">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            Explore Our Campus
          </h1>
          <p className="text-muted-foreground max-w-3xl mx-auto">
            Discover classrooms, facilities, and spaces that shape learning
            at our school.
          </p>
        </section>

        <div className="h-px bg-border" />

        {isAdmin && (
          <div className="flex justify-end">
            <Button onClick={() => setOpen(true)}>Add Section</Button>
          </div>
        )}

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="animate-pulse">
                <div className="h-52 bg-muted rounded-t-md" />
                <CardContent className="space-y-3 pt-4">
                  <div className="h-4 w-3/4 bg-muted rounded" />
                  <div className="h-4 w-full bg-muted rounded" />
                  <div className="h-4 w-5/6 bg-muted rounded" />
                </CardContent>
              </Card>
            ))
          ) : (
            sections.map((s) => (
              <Card key={s.id} className="relative">
                <CardHeader>
                  <div className="relative w-full h-52">
                    <Image
                      src={s.image || "/user.jpg"}
                      alt={s.title}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="flex items-start justify-between mt-3">
                    <CardTitle>{s.title}</CardTitle>

                    {isAdmin && (
                      <div className="flex gap-2">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => {
                            setEditing(s);
                            setDraft(s);
                            setImagePreview(s.image);
                            setOpen(true);
                          }}
                        >
                          ✏️
                        </Button>

                        <Button
                          size="icon"
                          variant="ghost"
                          disabled={deletingId === s.id}
                          onClick={() => deleteSection(s.id)}
                        >
                          {deletingId === s.id ? "⏳" : "🗑"}
                        </Button>
                      </div>
                    )}
                  </div>
                </CardHeader>

                <CardContent>
                  <p className="text-muted-foreground">{s.description}</p>
                </CardContent>
              </Card>
            ))
          )}
        </div>



        {/* DIALOG */}
        < Dialog open={open} onOpenChange={setOpen} >
          <DialogContent aria-describedby={undefined}>
            <DialogHeader>
              <DialogTitle>
                {editing ? "Edit Section" : "Add Section"}
              </DialogTitle>
            </DialogHeader>

            <Input
              placeholder="Title"
              value={draft.title}
              onChange={(e) =>
                setDraft({ ...draft, title: e.target.value })
              }
            />

            <textarea
              rows={4}
              className="border rounded-md p-2"
              placeholder="Description"
              value={draft.description}
              onChange={(e) =>
                setDraft({ ...draft, description: e.target.value })
              }
            />

            {/* IMAGE PREVIEW */}
            {(imagePreview || draft.image) && (
              <div className="relative w-full h-40 rounded-md overflow-hidden">
                <Image
                  src={imagePreview || draft.image}
                  alt="Preview"
                  fill
                  className="object-cover"
                />
              </div>
            )}

            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                setImageFile(file);
                setImagePreview(URL.createObjectURL(file));
              }}
            />

            <Button disabled={saving} onClick={saveSection}>
              {saving
                ? editing
                  ? "Updating..."
                  : "Adding..."
                : "Save"}
            </Button>
          </DialogContent>
        </Dialog>

      </div>
    </div>
  );
}
