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

    /* FETCH */
    useEffect(() => {
        apiFetch("/api/campus").then(setSections);
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
                    {sections.map((s) => (
                        <Card key={s.id} className="relative">

                            <CardHeader>
                                <div className="relative w-full" style={{ height: "13rem" }}>
                                    <Image
                                        src={s.image || "/user.jpg"}
                                        alt={s.title}
                                        fill
                                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                        className="object-cover"
                                    />
                                </div>

                                <div className="flex items-start justify-between mt-3">
                                    <CardTitle>{s.title}</CardTitle>

                                    {isAdmin && (
                                        <div className="flex gap-2">
                                            <Button
                                                className=""
                                                size="icon"
                                                variant="ghost"
                                                
                                                onClick={() => {
                                                    setEditing(s);
                                                    setDraft(s);
                                                    setOpen(true);
                                                }}
                                                
                                            >
                                                ✏️
                                            </Button>
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                onClick={async () => {
                                                    await apiFetch(`/api/campus/${s.id}`, {
                                                        method: "DELETE",
                                                    });
                                                    setSections((p) =>
                                                        p.filter((x) => x.id !== s.id)
                                                    );
                                                }}
                                            >
                                                🗑
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </CardHeader>

                            <CardContent>
                                <p className="text-muted-foreground">{s.description}</p>
                            </CardContent>

                        </Card>

                    ))}
                </div>

                {/* DIALOG */}
                <Dialog open={open} onOpenChange={setOpen}>
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

                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) =>
                                setImageFile(e.target.files?.[0] || null)
                            }
                        />

                        <Button onClick={saveSection}>Save</Button>
                    </DialogContent>
                </Dialog>

            </div>
        </div>
    );
}
