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

/* ===== TYPES ===== */
interface Alumni {
  id: number;
  name: string;
  batch: string;
  profession: string;
  achievement?: string;
  image: string;
}

export default function AlumniPage() {
  const { user } = useAuthStore();
  const isAdmin = user?.role === "SUPER_ADMIN";

  const [alumni, setAlumni] = useState<Alumni[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Alumni | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  

  const [draft, setDraft] = useState({
    name: "",
    batch: "",
    profession: "",
    achievement: "",
    image: "",
  });


  

  /* ===== FETCH ===== */
  useEffect(() => {
    apiFetch("/api/alumni").then(setAlumni);
  }, []);

  /* ===== IMAGE UPLOAD ===== */
  const uploadImage = async (file: File) => {
    const fd = new FormData();
    fd.append("image", file);

    const res = await fetch("http://localhost:5000/api/upload/student-image", {
      method: "POST",
      credentials: "include",
      body: fd,
    });

    if (!res.ok) throw new Error("Image upload failed");
    return res.json(); // { url }
  };

  /* ===== SAVE ===== */
 const saveAlumni = async () => {
  // ✅ VALIDATION — ADD THIS AT THE TOP
  if (!draft.name || !draft.batch || !draft.profession) {
    alert("Name, Batch and Profession are required");
    return;
  }

  const payload = {
    ...draft,
    image: draft.image || "/user.png", // default image
  };

  if (editing) {
    await apiFetch(`/api/alumni/${editing.id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });

    setAlumni((prev) =>
      prev.map((a) =>
        a.id === editing.id ? { ...a, ...payload } : a
      )
    );
  } else {
    const created = await apiFetch("/api/alumni", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    setAlumni((prev) => [created, ...prev]);
  }

  // reset
  setOpen(false);
  setEditing(null);
  setDraft({
    name: "",
    batch: "",
    profession: "",
    achievement: "",
    image: "",
  });
};


  return (
    <div className="max-w-7xl mx-auto px-4 pt-32 pb-24 space-y-12">

      {/* HEADER */}
      <section className="text-center space-y-4">
        <h1 className="text-4xl font-bold">Our Alumni</h1>
        <p className="text-muted-foreground max-w-3xl mx-auto">
          Celebrating the achievements and journeys of our proud alumni.
        </p>
      </section>

      {isAdmin && (
        <div className="flex justify-end">
          <Button onClick={() => setOpen(true)}>Add Alumni</Button>
        </div>
      )}

      {/* GRID */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {alumni.map((a) => (
          <Card key={a.id} className="relative">
            {isAdmin && (
              <div className="absolute top-2 right-2 flex gap-2">
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => {
                    setEditing(a);
                    setDraft({
                      name: a.name,
                      batch: a.batch,
                      profession: a.profession,
                      achievement: a.achievement ?? "",
                      image: a.image ?? "",
                    });

                    setOpen(true);
                  }}
                >
                  ✏️
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={async () => {
                    await apiFetch(`/api/alumni/${a.id}`, {
                      method: "DELETE",
                    });
                    setAlumni((p) =>
                      p.filter((x) => x.id !== a.id)
                    );
                  }}
                >
                  🗑
                </Button>
              </div>
            )}

            <CardHeader>
              <div className="relative w-28 h-28 mx-auto rounded-full overflow-hidden">
                <Image
                  src={a.image || "/user.png"}
                  alt={a.name}
                  fill
                  className="object-cover"
                />
              </div>
              <CardTitle className="text-center mt-4">
                {a.name}
              </CardTitle>
            </CardHeader>

            <CardContent className="text-center text-muted-foreground space-y-1">
              <p><strong>Batch:</strong> {a.batch}</p>
              <p>{a.profession}</p>
              {a.achievement && <p className="text-sm">{a.achievement}</p>}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* DIALOG */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editing ? "Edit Alumni" : "Add Alumni"}
            </DialogTitle>
          </DialogHeader>

          {/* IMAGE UPLOAD */}
          <label className="cursor-pointer flex justify-center">
            {imageFile ? (
              <img
                src={URL.createObjectURL(imageFile)}
                className="h-28 w-28 rounded-full object-cover border"
              />
            ) : (
              <img
                src={draft.image || "/user.png"}
                className="h-28 w-28 rounded-full object-cover border"
              />
            )}

            <Input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) =>
                setImageFile(e.target.files?.[0] || null)
              }
            />
          </label>

          <Input
            placeholder="Name *"
            value={draft.name}
            onChange={(e) =>
              setDraft({ ...draft, name: e.target.value })
            }
          />
          <Input
            placeholder="Batch * (e.g. 2018-19)"
            value={draft.batch}
            onChange={(e) =>
              setDraft({ ...draft, batch: e.target.value })
            }
          />
          <Input
            placeholder="Profession *"
            value={draft.profession}
            onChange={(e) =>
              setDraft({ ...draft, profession: e.target.value })
            }
          />
          <Input
            placeholder="Achievement (optional)"
            value={draft.achievement}
            onChange={(e) =>
              setDraft({ ...draft, achievement: e.target.value })
            }
          />

          <Button disabled={saving} onClick={saveAlumni}>
            {saving ? "Saving..." : "Save"}
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
