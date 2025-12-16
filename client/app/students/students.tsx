"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/store/auth";
import { apiFetch } from "@/lib/api";
import { Users, GraduationCap, Trophy, BookOpen } from "lucide-react";

/* ================= TYPES ================= */

interface StudentSection {
  id: string;
  title: string;
  description: string;
  image?: string;
}

interface StudentStats {
  total_students: number;
  total_classes: number;
  achievements: number;
  activities: number;
}

/* ================= STAT CARD ================= */

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: any;
  label: string;
  value: string | number;
}) {
  return (
    <Card className="text-center">
      <CardContent className="p-6 space-y-2">
        <Icon className="mx-auto h-8 w-8 text-slate-600" />
        <p className="text-3xl font-bold text-slate-800">{value}</p>
        <p className="text-slate-600 text-sm">{label}</p>
      </CardContent>
    </Card>
  );
}

/* ================= PAGE ================= */

export default function StudentsPage() {
  const { user } = useAuthStore();
  const isAdmin = user?.role === "SUPER_ADMIN";

  const [sections, setSections] = useState<StudentSection[]>([]);
  const [stats, setStats] = useState<StudentStats>({
    total_students: 0,
    total_classes: 0,
    achievements: 0,
    activities: 0,
  });

  const [editSection, setEditSection] = useState<StudentSection | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [editStats, setEditStats] = useState(false);
  const [statsDraft, setStatsDraft] = useState<StudentStats>(stats);

  /* ================= FETCH DATA ================= */

  useEffect(() => {
    apiFetch("/api/students/sections").then(setSections);

    apiFetch("/api/students/stats").then((data) => {
      setStats(data);
      setStatsDraft(data);
    });
  }, []);


  useEffect(() => {
    apiFetch("/api/students/sections").then(setSections);
    apiFetch("/api/students/stats").then(setStats);
  }, []);

  const otherSections = sections.slice(1);

  /* ================= IMAGE UPLOAD ================= */

  const uploadImage = async (file: File) => {
    const fd = new FormData();
    fd.append("image", file);

    const res = await fetch("http://localhost:5000/api/upload/student-image", {
      method: "POST",
      credentials: "include",
      body: fd,
    });

    const text = await res.text();
    console.log("UPLOAD RESPONSE:", text);

    if (!res.ok) throw new Error(text || "Upload failed");

    return JSON.parse(text);
  };

interface StudentSection {
  id: string;
  title: string;
  description: string;
  image?: string;
}

  const createEmptySection = (): StudentSection => ({
    id: "",
    title: "",
    description: "",
    image: "",
  });


  return (
    <div className="min-h-screen pt-32 px-4 bg-gradient-to-b from-slate-100 to-slate-200 pb-20">
      <div className="max-w-7xl mx-auto space-y-12">

        {/* ================= HEADER ================= */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-slate-800">Our Students</h1>
          <p className="text-slate-600 mt-2">
            Nurturing talent, building futures
          </p>
        </div>


        {isAdmin && (
          <div className="flex justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setEditStats(true)}
            >
              Edit Statistics
            </Button>
          </div>
        )}


        {/* ================= TOP STATS (ONLY 4) ================= */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <StatCard
            icon={Users}
            label="Total Students"
            value={stats.total_students}
          />
          <StatCard
            icon={GraduationCap}
            label="Total Classes"
            value={stats.total_classes}
          />
          <StatCard
            icon={BookOpen}
            label="Activities"
            value={`${stats.activities}+`}
          />
          <StatCard
            icon={Trophy}
            label="Achievements"
            value={`${stats.achievements}+`}
          />
        </div>
        {isAdmin && (
          <div className="flex justify-end gap-3">
            <Button
              size="sm"
              onClick={() => {
                setEditSection(createEmptySection());
                setImageFile(null);
              }}
            >
              + Add Section
            </Button>
          </div>
        )}

        {/* ================= SECTIONS ================= */}
        {otherSections.map((section) => (
          <Card key={section.id} className="relative">
            {isAdmin && (
              <div className="absolute top-3 right-3 flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setEditSection(section);
                    setImageFile(null);
                  }}
                >
                  Edit
                </Button>

                <Button
                  size="sm"
                  variant="destructive"
                  onClick={async () => {
                    const ok = confirm(
                      "Delete this section permanently?"
                    );
                    if (!ok) return;

                    await apiFetch(
                      `/api/students/sections/${section.id}`,
                      { method: "DELETE" }
                    );

                    setSections((prev) =>
                      prev.filter((s) => s.id !== section.id)
                    );
                  }}
                >
                  Delete
                </Button>
              </div>
            )}

            <CardHeader>
              <CardTitle>{section.title}</CardTitle>
            </CardHeader>

            <CardContent className="grid md:grid-cols-2 gap-6">
              <p className="text-slate-600">{section.description}</p>

              {section.image ? (
                <img
                  src={section.image}
                  className="rounded-xl h-48 w-full object-cover"
                  alt={section.title}
                />
              ) : (
                <div className="h-48 rounded-xl border flex items-center justify-center text-slate-400">
                  No Image
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* ================= EDIT DIALOG ================= */}
      <Dialog open={!!editSection} onOpenChange={() => setEditSection(null)}>
        {editSection && (
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Student Section</DialogTitle>
            </DialogHeader>

            <label className="cursor-pointer flex justify-center">
              {imageFile ? (
                <img
                  src={URL.createObjectURL(imageFile)}
                  className="h-32 w-32 rounded-full object-cover border"
                />
              ) : editSection.image ? (
                <img
                  src={editSection.image}
                  className="h-32 w-32 rounded-full object-cover border"
                />
              ) : (
                <div className="h-32 w-32 rounded-full border flex items-center justify-center text-slate-400">
                  Upload Image
                </div>
              )}

              <Input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => setImageFile(e.target.files?.[0] || null)}
              />
            </label>

            <Input
              value={editSection.title}
              onChange={(e) =>
                setEditSection({ ...editSection, title: e.target.value })
              }
              placeholder="Title"
            />

            <textarea
              rows={4}
              className="border rounded-md p-2 text-sm w-full"
              value={editSection.description}
              onChange={(e) =>
                setEditSection({
                  ...editSection,
                  description: e.target.value,
                })
              }
              placeholder="Description"
            />

            <Button
              disabled={saving}
              className="relative"
              onClick={async () => {
                try {
                  setSaving(true);

                  let image = editSection.image;

                  if (imageFile) {
                    const uploaded: { url: string } = await uploadImage(imageFile);
                    image = uploaded.url;
                  }

                  let saved: StudentSection;

                  if (!editSection.id) {
                    // ➕ ADD
                    saved = await apiFetch<StudentSection>("/api/students/sections", {
                      method: "POST",
                      body: JSON.stringify({
                        title: editSection.title,
                        description: editSection.description,
                        image,
                      }),
                    });

                    setSections((prev) => [...prev, saved]);
                  } else {
                    // ✏️ UPDATE
                    saved = await apiFetch<StudentSection>(
                      `/api/students/sections/${editSection.id}`,
                      {
                        method: "PUT",
                        body: JSON.stringify({
                          ...editSection,
                          image,
                        }),
                      }
                    );

                    setSections((prev) =>
                      prev.map((s) => (s.id === saved.id ? saved : s))
                    );
                  }

                  setEditSection(null);
                  setImageFile(null);
                } finally {
                  setSaving(false);
                }
              }}
            >
              {saving ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Saving...
                </span>
              ) : editSection.id ? (
                "Save Changes"
              ) : (
                "Add Section"
              )}
            </Button>


          </DialogContent>
        )}
      </Dialog>

      <Dialog open={editStats} onOpenChange={setEditStats}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Student Statistics</DialogTitle>
          </DialogHeader>

          <div className="space-y-3">

            {/* TOTAL STUDENTS */}
            <div className="w-full flex items-center justify-between gap-4">
              <p className="font-medium whitespace-nowrap">
                Total Students
              </p>

              <Input
                type="number"
                className="w-40"
                placeholder="Total Students"
                value={statsDraft.total_students}
                onChange={(e) =>
                  setStatsDraft({
                    ...statsDraft,
                    total_students: Number(e.target.value),
                  })
                }
              />
            </div>

            {/* TOTAL CLASSES */}
            <div className="w-full flex items-center justify-between gap-4">
              <p className="font-medium whitespace-nowrap">
                Total Classes
              </p>

              <Input
                type="number"
                className="w-40"
                placeholder="Total Classes"
                value={statsDraft.total_classes}
                onChange={(e) =>
                  setStatsDraft({
                    ...statsDraft,
                    total_classes: Number(e.target.value),
                  })
                }
              />
            </div>

            {/* ACTIVITIES */}
            <div className="w-full flex items-center justify-between gap-4">
              <p className="font-medium whitespace-nowrap">
                Activities
              </p>

              <Input
                type="number"
                className="w-40"
                placeholder="Activities"
                value={statsDraft.activities}
                onChange={(e) =>
                  setStatsDraft({
                    ...statsDraft,
                    activities: Number(e.target.value),
                  })
                }
              />
            </div>

            {/* ACHIEVEMENTS */}
            <div className="w-full flex items-center justify-between gap-4">
              <p className="font-medium whitespace-nowrap">
                Achievements
              </p>

              <Input
                type="number"
                className="w-40"
                placeholder="Achievements"
                value={statsDraft.achievements}
                onChange={(e) =>
                  setStatsDraft({
                    ...statsDraft,
                    achievements: Number(e.target.value),
                  })
                }
              />
            </div>

          </div>

          <Button
            disabled={saving}
            onClick={async () => {
              try {
                setSaving(true);

                const updated = await apiFetch("/api/students/stats", {
                  method: "PUT",
                  body: JSON.stringify(statsDraft),
                });

                setStats(updated);
                setEditStats(false);
              } finally {
                setSaving(false);
              }
            }}
          >
            Save Statistics
          </Button>
        </DialogContent>
      </Dialog>

    </div>
  );
}
