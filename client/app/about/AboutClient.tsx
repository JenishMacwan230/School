"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/auth";
import { apiFetch } from "@/lib/api";
import Image from "next/image";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { History } from "@/components/History";

/* ================= TYPES ================= */

interface TrustInfo {
  title: string;
  description1: string;
  description2: string;
  logo: string;
}

interface Trustee {
  id: number;
  name: string;
  role: string;
  image: string;
  position: number;
}

/* ================= PAGE ================= */



export default function AboutPage() {
  const { user } = useAuthStore();
  const isAdmin = user?.role === "SUPER_ADMIN";

  const NAME_ROLE_REGEX = /^[A-Za-z\s]+$/;

  const [trust, setTrust] = useState<TrustInfo | null>(null);
  const [trustees, setTrustees] = useState<Trustee[]>([]);
  const [loading, setLoading] = useState(true);
  const [trustImageFile, setTrustImageFile] = useState<File | null>(null);


  /* ===== dialogs ===== */
  const [editTrustOpen, setEditTrustOpen] = useState(false);
  const [editTrustee, setEditTrustee] = useState<Trustee | null>(null);
  const [addOpen, setAddOpen] = useState(false);

  /* ===== form state ===== */
  const [trustDraft, setTrustDraft] = useState<TrustInfo | null>(null);
  const [trusteeDraft, setTrusteeDraft] = useState({
    name: "",
    role: "",
    image: "",
    position: 0,
  });

  const [errors, setErrors] = useState<{ name?: string; role?: string }>({});
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  /* ================= VALIDATION ================= */

  const validateTrustee = () => {
    const newErrors: { name?: string; role?: string } = {};

    if (!trusteeDraft.name.trim()) {
      newErrors.name = "Name is required";
    } else if (!NAME_ROLE_REGEX.test(trusteeDraft.name)) {
      newErrors.name = "Only letters allowed";
    }

    if (!trusteeDraft.role.trim()) {
      newErrors.role = "Role is required";
    } else if (!NAME_ROLE_REGEX.test(trusteeDraft.role)) {
      newErrors.role = "Only letters allowed";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /* ================= FETCH ================= */

  useEffect(() => {
    Promise.all([
      apiFetch("/api/about/trust"),
      apiFetch("/api/about/trustees"),
    ])
      .then(([t, list]) => {
        setTrust(t);
        setTrustDraft(t);
        setTrustees(list);
      })
      .finally(() => setLoading(false));
  }, []);

  /* ================= IMAGE UPLOAD ================= */

  const uploadTrusteeImage = async (file: File) => {
    const fd = new FormData();
    fd.append("image", file);

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/upload/trustee-photo`,
      {
        method: "POST",
        credentials: "include",
        body: fd,
      }
    );

    if (!res.ok) throw new Error("Image upload failed");
    return res.json(); // { url }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  /* ================= JSX ================= */

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 space-y-16 pt-32">

      {/* HEADER */}
      <section className="text-center space-y-4">
        <h1 className="text-4xl font-bold">About Our School</h1>
        <p className="text-muted-foreground max-w-3xl mx-auto">
          Learn about our journey, our guiding trust, and the people who shape
          the future of our students.
        </p>
      </section>

      <Separator />

      {/* HISTORY */}
      <History />

      <Separator />

      {/* TRUST INFO */}
      {trust && (
        <section className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold">{trust.title}</h2>
            {isAdmin && (
              <Button size="sm" variant="outline" onClick={() => setEditTrustOpen(true)}>
                Edit Trust
              </Button>
            )}
          </div>

          <Card>
            <CardContent className="p-6 flex flex-col md:flex-row gap-6">
              <Image
                src={trust.logo}
                alt="Trust Logo"
                width={160}
                height={160}
                className="rounded-xl object-contain"
              />
              <div className="space-y-3">
                <p className="text-muted-foreground">{trust.description1}</p>
                <p className="text-muted-foreground">{trust.description2}</p>
              </div>
            </CardContent>
          </Card>
        </section>
      )}

      {/* TRUSTEES */}
      <section className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold">Trustees & Management</h2>
          {isAdmin && (
            <Button size="sm" variant="outline" onClick={() => setAddOpen(true)}>
              Add Trustee
            </Button>
          )}
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {trustees.map((t) => (
            <Card key={t.id} className="relative text-center">
              {isAdmin && (
                <div className="absolute top-2 right-2 flex gap-1">
                  {/* EDIT */}
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => {
                      setEditTrustee(t);
                      setTrusteeDraft(t);
                      setImageFile(null);
                    }}
                  >
                    ✏️
                  </Button>

                  {/* DELETE */}
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={async () => {
                      if (!confirm("Are you sure you want to delete this trustee?")) return;

                      await apiFetch(`/api/about/trustees/${t.id}`, {
                        method: "DELETE",
                      });

                      setTrustees((prev) =>
                        prev.filter((x) => x.id !== t.id)
                      );
                    }}
                  >
                    🗑
                  </Button>
                </div>
              )}


              <CardHeader>
                <div className="mx-auto w-32 h-32 relative rounded-full overflow-hidden">
                  <Image src={t.image} alt={t.name} fill className="object-cover" />
                </div>
                <CardTitle className="mt-4">{t.name}</CardTitle>
              </CardHeader>

              <CardContent>
                <p className="text-muted-foreground">{t.role}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>



      <Dialog open={editTrustOpen} onOpenChange={() => {
        setEditTrustOpen(false);
        setTrustImageFile(null);
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Trust Info</DialogTitle>
          </DialogHeader>

          {trustDraft && (
            <div className="space-y-4">

              {/* TITLE */}
              <Input
                placeholder="Title"
                value={trustDraft.title}
                onChange={(e) =>
                  setTrustDraft({ ...trustDraft, title: e.target.value })
                }
              />

              {/* LOGO UPLOAD (CIRCULAR) */}
              <div className="flex justify-center">
                <label className="relative w-32 h-32 rounded-full overflow-hidden border-2 border-dashed border-slate-300 cursor-pointer">

                  <Image
                    src={
                      trustImageFile
                        ? URL.createObjectURL(trustImageFile)
                        : trustDraft.logo || "/user.jpg"
                    }
                    alt="Trust Logo"
                    fill
                    className="object-cover"
                  />

                  {!trustImageFile && !trustDraft.logo && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 text-white text-sm">
                      Upload Logo
                    </div>
                  )}

                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) =>
                      setTrustImageFile(e.target.files?.[0] || null)
                    }
                  />
                </label>
              </div>

              {/* DESCRIPTION 1 */}
              <textarea
                rows={4}
                className="w-full border rounded-md p-2 text-sm"
                placeholder="Description 1"
                value={trustDraft.description1}
                onChange={(e) =>
                  setTrustDraft({
                    ...trustDraft,
                    description1: e.target.value,
                  })
                }
              />

              {/* DESCRIPTION 2 */}
              <textarea
                rows={4}
                className="w-full border rounded-md p-2 text-sm"
                placeholder="Description 2"
                value={trustDraft.description2}
                onChange={(e) =>
                  setTrustDraft({
                    ...trustDraft,
                    description2: e.target.value,
                  })
                }
              />

              {/* SAVE */}
              <Button
                onClick={async () => {
                  let logoUrl = trustDraft.logo || "/user.jpg";

                  if (trustImageFile) {
                    const uploaded = await uploadTrusteeImage(trustImageFile);
                    logoUrl = uploaded.url;
                  }

                  const updated = await apiFetch("/api/about/trust", {
                    method: "PUT",
                    body: JSON.stringify({
                      ...trustDraft,
                      logo: logoUrl,
                    }),
                  });

                  setTrust(updated);
                  setEditTrustOpen(false);
                  setTrustImageFile(null);
                }}
              >
                Save
              </Button>

            </div>
          )}
        </DialogContent>
      </Dialog>



      {/* ADD / EDIT TRUSTEE */}
      <Dialog open={addOpen || !!editTrustee} onOpenChange={() => {
        setAddOpen(false);
        setEditTrustee(null);
        setImageFile(null);
        setErrors({});
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editTrustee ? "Edit Trustee" : "Add Trustee"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-3">
            <Input
              placeholder="Name"
              value={trusteeDraft.name}
              onChange={(e) =>
                setTrusteeDraft({ ...trusteeDraft, name: e.target.value })
              }
            />
            {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}

            <Input
              placeholder="Role"
              value={trusteeDraft.role}
              onChange={(e) =>
                setTrusteeDraft({ ...trusteeDraft, role: e.target.value })
              }
            />
            {errors.role && <p className="text-sm text-red-500">{errors.role}</p>}

            {/* CIRCULAR IMAGE UPLOAD */}
            <div className="flex justify-center">
              <label className="relative w-32 h-32 rounded-full overflow-hidden border-2 border-dashed border-slate-300 cursor-pointer">
                <Image
                  src={
                    imageFile
                      ? URL.createObjectURL(imageFile)
                      : trusteeDraft.image || "/user.jpg"
                  }
                  alt="Trustee"
                  fill
                  className="object-cover"
                />
                {!imageFile && !trusteeDraft.image && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 text-white">
                    Upload Image
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) =>
                    setImageFile(e.target.files?.[0] || null)
                  }
                />
              </label>
            </div>

            <Button
              disabled={uploading}
              onClick={async () => {
                if (!validateTrustee()) return;

                try {
                  setUploading(true);

                  let imageUrl: string = trusteeDraft.image || "/user.jpg";
                  // 👈 DEFAULT IMAGE

                  if (imageFile) {
                    const uploaded = await uploadTrusteeImage(imageFile);
                    imageUrl = uploaded.url;
                  }

                  const payload = {
                    ...trusteeDraft,
                    image: imageUrl,
                  };


                  //  let imageUrl: string = trusteeDraft.image || "/user.jpg";



                  if (editTrustee) {
                    await apiFetch(`/api/about/trustees/${editTrustee.id}`, {
                      method: "PUT",
                      body: JSON.stringify(payload),
                    });
                    setTrustees((prev) =>
                      prev.map((t) =>
                        t.id === editTrustee.id ? { ...t, ...payload } : t
                      )
                    );
                  } else {
                    const created = await apiFetch("/api/about/trustees", {
                      method: "POST",
                      body: JSON.stringify(payload),
                    });
                    setTrustees((prev) => [...prev, created]);
                  }

                  setTrusteeDraft({ name: "", role: "", image: "", position: 0 });
                  setAddOpen(false);
                  setEditTrustee(null);
                  setErrors({});
                } finally {
                  setUploading(false);
                }
              }}
            >
              {uploading ? "Uploading..." : "Save"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
