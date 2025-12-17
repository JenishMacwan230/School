"use client";

import { useState, useMemo, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { UserRound, Search, Filter } from "lucide-react";
import { useAuthStore } from "@/store/auth";
import { apiFetch } from "@/lib/api";



/* ================= TYPES ================= */

type Stream = "Science" | "Commerce" | "Arts";
type SchoolClass = "11-12" | "9-10" | "1-8" | "Pre-Primary";
type Role = "Principal" | "Teacher" | "Visiting Teacher";

interface Teacher {
    id: string;
    name: string;
    subject: string;
    role: Role;
    class: SchoolClass;
    stream?: Stream;
    experience: string;
    qualification: string;
    bio: string;
    photo: string;
    photo_public_id?: string;
    email?: string;
    phone?: string;
}


/* ================= DATA ================= */



/* ================= HELPERS ================= */

const streamColor: Record<string, string> = {
    Science: "border-blue-500",
    Commerce: "border-green-500",
    Arts: "border-purple-500",
};

/* ================= PAGE ================= */

export default function TeachersPage() {
    const [search, setSearch] = useState("");
    const [stream, setStream] = useState<Stream | "All">("All");
    const [schoolClass, setSchoolClass] = useState<SchoolClass | "All">("All");
    const [role, setRole] = useState<Role | "All">("All");
    const [subject, setSubject] = useState<string>("All");
    const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
    const [filterOpen, setFilterOpen] = useState(false);
    const { user, loading } = useAuthStore();
    const isSuperAdmin = user?.role === "SUPER_ADMIN";
    const [editTeacher, setEditTeacher] = useState<Teacher | null>(null);
    const [teacherList, setTeacherList] = useState<Teacher[]>([]);
    const [loadingTeachers, setLoadingTeachers] = useState(true);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const nameRegex = /^[A-Za-z\s]{2,50}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[6-9]\d{9}$/; // Indian 10-digit numbers
    // 🔵 ADD — loaders to prevent double submit
    const [savingTeacher, setSavingTeacher] = useState(false);
    const [deletingTeacherId, setDeletingTeacherId] = useState<string | null>(null);






    useEffect(() => {
        const fetchTeachers = async () => {
            try {
                const data = await apiFetch("/api/teachers");
                setTeacherList(data);
            } catch (err) {
                console.error("Failed to fetch teachers", err);
            } finally {
                setLoadingTeachers(false);
            }
        };

        fetchTeachers();
    }, []);


    const validateTeacher = (teacher: Teacher) => {
        const newErrors: Record<string, string> = {};

        // ✅ NAME (required)
        if (!teacher.name.trim()) {
            newErrors.name = "Name is required";
        } else if (!nameRegex.test(teacher.name)) {
            newErrors.name = "Name must contain only letters";
        }

        // ✅ SUBJECT (required)
        if (!teacher.subject.trim()) {
            newErrors.subject = "Subject is required";
        }

        // ✅ QUALIFICATION (required)
        if (!teacher.qualification.trim()) {
            newErrors.qualification = "Qualification is required";
        }

        // 🔹 EXPERIENCE (optional, TEXT → no regex, no validation)

        // 🔹 EMAIL (optional but validated if present)
        if (teacher.email && !emailRegex.test(teacher.email)) {
            newErrors.email = "Invalid email format";
        }

        // 🔹 PHONE (optional but validated if present)
        if (teacher.phone && !phoneRegex.test(teacher.phone)) {
            newErrors.phone = "Invalid mobile number";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };


    const filteredTeachers = useMemo(() => {
        return teacherList.filter((t) => {
            return (
                t.name.toLowerCase().includes(search.toLowerCase()) &&
                (stream === "All" || t.stream === stream) &&
                (schoolClass === "All" || t.class === schoolClass) &&
                (role === "All" || t.role === role) &&
                (subject === "All" || t.subject === subject)
            );
        });
    }, [teacherList, search, stream, schoolClass, role, subject]);

    const createEmptyTeacher = (): Teacher => ({
        id: "",
        name: "",
        subject: "",
        role: "Teacher",
        class: "11-12",
        stream: "Science",
        experience: "",
        qualification: "",
        bio: "",
        photo: "",
        email: "",
        phone: "",
    });



    const uploadTeacherImage = async (file: File) => {
        const formData = new FormData();
        formData.append("image", file);

        const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/upload/teacher-photo`,
            {
                method: "POST",
                credentials: "include", // 🔥 REQUIRED for cookie auth
                body: formData,
            }
        );

        if (!res.ok) {
            throw new Error("Image upload failed");
        }

        const data = await res.json();
        return data;

    };


    if (loadingTeachers) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-slate-500">Loading teachers...</p>
            </div>
        );
    }


    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-100 via-slate-50 to-slate-200/40 px-4 pt-32 pb-10">
            <div className="max-w-7xl mx-auto space-y-8">

                {/* HEADER */}
                <div className="text-center">
                    <h1 className="text-3xl md:text-4xl font-bold text-slate-800">
                        Our Teaching Faculty
                    </h1>
                    <p className="text-slate-600 mt-1">
                        Dedicated educators shaping young minds
                    </p>

                    {isSuperAdmin && (
                        <div className="flex justify-center pt-4">
                            <Button onClick={() => setEditTeacher(createEmptyTeacher())}>
                                + Add Teacher
                            </Button>
                        </div>
                    )}


                </div>



                {/* MOBILE FILTER BUTTON */}
                <div className="flex md:hidden justify-start">
                    <Button size="sm" onClick={() => setFilterOpen(true)}>
                        <Filter className="mr-2" size={16} />
                        Filters
                    </Button>
                </div>

                {/* DESKTOP FILTER BAR — UNCHANGED */}
                <div className="hidden md:block  top-28 z-10">
                    <div className="bg-white/90 backdrop-blur-md border rounded-2xl shadow-lg p-4 space-y-4">
                        <div className="flex items-center gap-2 font-medium text-slate-700">
                            <Filter size={18} />
                            Search & Filters
                        </div>

                        <div className="relative">
                            <Search className="absolute left-3 top-3 text-slate-400" size={18} />
                            <Input
                                placeholder="Search teacher by name..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-10 rounded-xl w-full"
                            />
                        </div>

                        <div className="grid grid-cols-12 gap-3">
                            <div className="col-span-2">
                                <Select value={stream} onValueChange={(v) => setStream(v as any)}>
                                    <SelectTrigger className="rounded-xl w-full">
                                        <SelectValue placeholder="Stream" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="All">All Streams</SelectItem>
                                        <SelectItem value="Science">Science</SelectItem>
                                        <SelectItem value="Commerce">Commerce</SelectItem>
                                        <SelectItem value="Arts">Arts</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="col-span-2">
                                <Select
                                    value={schoolClass}
                                    onValueChange={(v) => setSchoolClass(v as any)}
                                >
                                    <SelectTrigger className="rounded-xl w-full">
                                        <SelectValue placeholder="Class" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="All">All Classes</SelectItem>
                                        <SelectItem value="11-12">11 – 12</SelectItem>
                                        <SelectItem value="9-10">9 – 10</SelectItem>
                                        <SelectItem value="1-8">1 – 8</SelectItem>
                                        <SelectItem value="Pre-Primary">Pre-Primary</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="col-span-2">
                                <Select value={role} onValueChange={(v) => setRole(v as any)}>
                                    <SelectTrigger className="rounded-xl w-full">
                                        <SelectValue placeholder="Role" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="All">All Roles</SelectItem>
                                        <SelectItem value="Principal">Principal</SelectItem>
                                        <SelectItem value="Teacher">Teacher</SelectItem>
                                        <SelectItem value="Visiting Teacher">
                                            Visiting Teacher
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="col-span-4">
                                <Select value={subject} onValueChange={setSubject}>
                                    <SelectTrigger className="rounded-xl w-full">
                                        <SelectValue placeholder="Subject" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="All">All Subjects</SelectItem>
                                        {[
                                            ...new Set(
                                                teacherList
                                                    .map((t) => t.subject)
                                                    .filter((s): s is string => !!s && s.trim() !== "")
                                            ),
                                        ].map((sub) => (
                                            <SelectItem key={sub} value={sub}>
                                                {sub}
                                            </SelectItem>
                                        ))}

                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="col-span-2">
                                <Button
                                    variant="secondary"
                                    className="rounded-xl w-full bg-gradient-to-r from-green-300 to-teal-300 hover:from-green-500 hover:to-teal-500 transition-colors duration-300"

                                    onClick={() => {
                                        setSearch("");
                                        setStream("All");
                                        setSchoolClass("All");
                                        setRole("All");
                                        setSubject("All");
                                    }}
                                >
                                    Reset
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* TEACHER CARDS */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredTeachers.map((teacher, index) => (
                        <Card
                            key={index}
                            className={`rounded-2xl border-l-4 ${teacher.stream ? streamColor[teacher.stream] : "border-slate-300"
                                } hover:shadow-xl hover:-translate-y-1 transition`}
                        >
                            <CardHeader className="flex flex-row gap-4 items-center">
                                <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center">
                                    <UserRound />
                                </div>
                                <div>
                                    <CardTitle>{teacher.name}</CardTitle>
                                    <Badge variant="secondary">{teacher.role}</Badge>
                                </div>
                            </CardHeader>

                            <CardContent className="space-y-4">
                                <div className="flex place-content-between">
                                    <p className="text-slate-600">
                                        Subject:{" "}
                                        <span className="font-medium text-slate-800">
                                            {teacher.subject}
                                        </span>
                                    </p>

                                    <div className="flex gap-2 flex-wrap">
                                        <Badge variant="outline">{teacher.class}</Badge>
                                        {teacher.stream && <Badge>{teacher.stream}</Badge>}
                                    </div>
                                </div>


                                <Button
                                    className="w-full "

                                    onClick={() => setSelectedTeacher(teacher)}
                                >
                                    See Profile
                                </Button>
                                {isSuperAdmin && (
                                    <div className="flex place-content-evenly gap-2">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => setEditTeacher(teacher)}
                                            className="w-[50%]"
                                        >
                                            Edit
                                        </Button>

                                        <Button
                                            size="sm"
                                            variant="destructive"
                                            className="w-[50%] text-red-600 bg-gradient-to-r from-red-100 to-red-200 "
                                            onClick={async () => {
                                                const confirmed = confirm(
                                                    "Are you sure?\nThis will permanently delete the teacher and photo."
                                                );

                                                if (!confirmed) return;

                                                await apiFetch(`/api/teachers/${teacher.id}`, {
                                                    method: "DELETE",
                                                });

                                                setTeacherList((prev) =>
                                                    prev.filter((t) => t.id !== teacher.id)
                                                );
                                            }}
                                        >
                                            Delete
                                        </Button>

                                    </div>
                                )}

                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
            {/* MOBILE / TABLET FILTER DIALOG */}
            <Dialog open={filterOpen} onOpenChange={setFilterOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Filters</DialogTitle>
                    </DialogHeader>

                    <div className="space-y-4">
                        <Input
                            placeholder="Search teacher..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full"
                        />

                        <Select value={stream} onValueChange={(v) => setStream(v as any)}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Stream" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="All">All Streams</SelectItem>
                                <SelectItem value="Science">Science</SelectItem>
                                <SelectItem value="Commerce">Commerce</SelectItem>
                                <SelectItem value="Arts">Arts</SelectItem>
                            </SelectContent>
                        </Select>

                        <Select value={schoolClass} onValueChange={(v) => setSchoolClass(v as any)}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Class" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="All">All Classes</SelectItem>
                                <SelectItem value="11-12">11 – 12</SelectItem>
                                <SelectItem value="9-10">9 – 10</SelectItem>
                                <SelectItem value="1-8">1 – 8</SelectItem>
                                <SelectItem value="Pre-Primary">Pre-Primary</SelectItem>
                            </SelectContent>
                        </Select>

                        <Select value={role} onValueChange={(v) => setRole(v as any)}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Role" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="All">All Roles</SelectItem>
                                <SelectItem value="Principal">Principal</SelectItem>
                                <SelectItem value="Teacher">Teacher</SelectItem>
                                <SelectItem value="Visiting Teacher">Visiting Teacher</SelectItem>
                            </SelectContent>
                        </Select>

                        <Select value={subject} onValueChange={setSubject}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Subject" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="All">All Subjects</SelectItem>
                                {[
                                    ...new Set(
                                        teacherList
                                            .map((t) => t.subject)
                                            .filter((s): s is string => Boolean(s && s.trim()))
                                    ),
                                ].map((sub) => (
                                    <SelectItem key={sub} value={sub}>
                                        {sub}
                                    </SelectItem>
                                ))}

                            </SelectContent>
                        </Select>

                        <Button className="w-full" onClick={() => setFilterOpen(false)}>
                            Apply Filters
                        </Button>

                        <Button
                            variant="secondary"
                            className="w-full"
                            onClick={() => {
                                setSearch("");
                                setStream("All");
                                setSchoolClass("All");
                                setRole("All");
                                setSubject("All");
                                setFilterOpen(false);
                            }}
                        >
                            Reset Filters
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* PROFILE MODAL */}
            <Dialog open={!!selectedTeacher} onOpenChange={() => setSelectedTeacher(null)}>
                {selectedTeacher && (
                    <DialogContent className="rounded-2xl max-w-md">
                        <DialogHeader>
                            <DialogTitle>{selectedTeacher.name}</DialogTitle>
                        </DialogHeader>

                        {/* PHOTO */}
                        <div className="flex justify-center">
                            <div className="flex justify-center">
                                <img
                                    src={selectedTeacher.photo || "/user.jpg"}
                                    alt={selectedTeacher.name}
                                    className="h-32 w-32 rounded-full object-cover border"
                                />
                            </div>


                        </div>

                        <div className="space-y-4 text-slate-700">

                            {/* BASIC INFO */}
                            <p><strong>Role:</strong> {selectedTeacher.role}</p>
                            <p><strong>Class:</strong> {selectedTeacher.class}</p>

                            {selectedTeacher.stream && (
                                <p><strong>Stream:</strong> {selectedTeacher.stream}</p>
                            )}

                            <p><strong>Subject:</strong> {selectedTeacher.subject}</p>
                            <p><strong>Experience:</strong> {selectedTeacher.experience}</p>
                            <p><strong>Qualification:</strong> {selectedTeacher.qualification}</p>

                            {/* CONTACT INFO */}
                            {(selectedTeacher.email || selectedTeacher.phone) && (
                                <div className="pt-3 border-t space-y-2">
                                    <h4 className="text-sm font-semibold text-slate-600">
                                        Contact Information
                                    </h4>

                                    {selectedTeacher.email && (
                                        <p className="text-sm">
                                            <span className="font-medium">Email:</span>{" "}
                                            <a
                                                href={`mailto:${selectedTeacher.email}`}
                                                className="text-blue-600 hover:underline"
                                            >
                                                {selectedTeacher.email}
                                            </a>
                                        </p>
                                    )}

                                    {selectedTeacher.phone && (
                                        <p className="text-sm">
                                            <span className="font-medium">Phone:</span>{" "}
                                            <a
                                                href={`tel:${selectedTeacher.phone}`}
                                                className="text-green-600 hover:underline"
                                            >
                                                {selectedTeacher.phone}
                                            </a>
                                        </p>
                                    )}
                                </div>
                            )}

                            {/* BIO */}
                            <p className="text-sm text-slate-600 pt-2">
                                {selectedTeacher.bio}
                            </p>
                        </div>

                    </DialogContent>
                )}
            </Dialog>



            {/* Edit profile model */}

            <Dialog open={!!editTeacher} onOpenChange={() => setEditTeacher(null)}>
                {editTeacher && (
                    <DialogContent className="max-w-sm">
                        <DialogHeader>
                            <DialogTitle>
                                {editTeacher.id ? "Edit Teacher" : "Add Teacher"}
                            </DialogTitle>
                            <DialogDescription>
                                Update teacher details and profile photo
                            </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-2 flex flex-col">

                            {/* IMAGE */}
                            <div className="flex flex-col items-center gap-2">
                                {/* CLICKABLE IMAGE AREA */}
                                <label
                                    htmlFor="teacher-image"
                                    className="cursor-pointer group"
                                >
                                    {editTeacher.photo || imageFile ? (
                                        <img
                                            src={
                                                imageFile
                                                    ? URL.createObjectURL(imageFile) // 👈 instant preview
                                                    : editTeacher.photo
                                            }
                                            alt="Teacher"
                                            className="h-28 w-28 rounded-full object-cover border group-hover:opacity-80 transition"
                                        />
                                    ) : (
                                        <div className="h-28 w-28 rounded-full border flex items-center justify-center text-sm text-slate-400 group-hover:bg-slate-50 transition">
                                            Insert profile pic
                                        </div>
                                    )}
                                </label>

                                {/* HIDDEN FILE INPUT */}
                                <Input
                                    id="teacher-image"
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => {
                                        if (e.target.files?.[0]) {
                                            setImageFile(e.target.files[0]);
                                        }
                                    }}
                                />

                                <span className="text-xs text-slate-500">
                                    Click image to upload
                                </span>
                            </div>


                            {/* NAME */}
                            <Input
                                value={editTeacher.name}
                                onChange={(e) =>
                                    setEditTeacher({ ...editTeacher, name: e.target.value })
                                }
                                placeholder="Name"
                            />
                            {errors.name && (
                                <p className="text-xs text-red-500">{errors.name}</p>
                            )}

                            <div className="grid grid-cols-3 gap-3">

                                {/* ROLE */}
                                <Select
                                    value={editTeacher.role ?? "Teacher"}
                                    onValueChange={(v) =>
                                        setEditTeacher({ ...editTeacher, role: v as Role })
                                    }
                                >

                                    <SelectTrigger className="w-full h-9">
                                        <SelectValue placeholder="Role" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Principal">Principal</SelectItem>
                                        <SelectItem value="Teacher">Teacher</SelectItem>
                                        <SelectItem value="Visiting Teacher">Visiting Teacher</SelectItem>
                                    </SelectContent>
                                </Select>

                                {/* CLASS */}
                                <Select
                                    value={editTeacher.class ?? "11-12"}
                                    onValueChange={(v) =>
                                        setEditTeacher({
                                            ...editTeacher,
                                            class: v as SchoolClass,
                                            stream: v === "11-12" ? editTeacher.stream : undefined,
                                        })
                                    }
                                >

                                    <SelectTrigger className="w-full h-9">
                                        <SelectValue placeholder="Class" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="11-12">11 – 12</SelectItem>
                                        <SelectItem value="9-10">9 – 10</SelectItem>
                                        <SelectItem value="1-8">1 – 8</SelectItem>
                                        <SelectItem value="Pre-Primary">Pre-Primary</SelectItem>
                                    </SelectContent>
                                </Select>

                                {/* STREAM OR PLACEHOLDER */}
                                {editTeacher.class === "11-12" ? (
                                    <Select
                                        value={editTeacher.stream ?? "none"}
                                        onValueChange={(v) =>
                                            setEditTeacher({
                                                ...editTeacher,
                                                stream: v === "none" ? undefined : (v as Stream),
                                            })
                                        }
                                    >

                                        <SelectTrigger className="w-full h-9">
                                            <SelectValue placeholder="Stream" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="none">Select Stream</SelectItem>
                                            <SelectItem value="Science">Science</SelectItem>
                                            <SelectItem value="Commerce">Commerce</SelectItem>
                                            <SelectItem value="Arts">Arts</SelectItem>
                                        </SelectContent>

                                    </Select>
                                ) : (
                                    // ✅ Invisible placeholder to fill grid space
                                    <div className="h-9" />
                                )}

                            </div>




                            {/* SUBJECT */}
                            <Input
                                value={editTeacher.subject}
                                onChange={(e) =>
                                    setEditTeacher({ ...editTeacher, subject: e.target.value })
                                }
                                placeholder="Subject"
                            />

                            {/* EXPERIENCE */}
                            <Input
                                value={editTeacher.experience}
                                onChange={(e) =>
                                    setEditTeacher({ ...editTeacher, experience: e.target.value })
                                }
                                placeholder="Experience"
                            />

                            {/* QUALIFICATION */}
                            <Input
                                value={editTeacher.qualification}
                                onChange={(e) =>
                                    setEditTeacher({ ...editTeacher, qualification: e.target.value })
                                }
                                placeholder="Qualification"
                                
                            />

                            {/* EMAIL */}
                            <Input
                                value={editTeacher.email || ""}
                                onChange={(e) =>
                                    setEditTeacher({ ...editTeacher, email: e.target.value })
                                }
                                placeholder="Email"
                            />
                            {errors.email && (
                                <p className="text-xs text-red-500">{errors.email}</p>
                            )}


                            {/* PHONE */}
                            <Input
                                value={editTeacher.phone || ""}
                                onChange={(e) =>
                                    setEditTeacher({ ...editTeacher, phone: e.target.value })
                                }
                                placeholder="Mobile Number"
                            />
                            {errors.phone && (
                                <p className="text-xs text-red-500">{errors.phone}</p>
                            )}


                            {/* BIO */}
                            <textarea
                                className="border rounded-md p-2 text-sm w-full"
                                rows={4}
                                value={editTeacher.bio}
                                onChange={(e) =>
                                    setEditTeacher({ ...editTeacher, bio: e.target.value })
                                }
                                placeholder="Bio"
                            />

                            {/* SAVE */}
                            <Button
                                disabled={uploadingImage || savingTeacher}
                                onClick={async () => {
                                    if (savingTeacher) return;
                                    setSavingTeacher(true);

                                    if (!validateTeacher(editTeacher)) {
                                        setSavingTeacher(false); // ✅ IMPORTANT
                                        return;
                                    }

                                    try {
                                        let photoUrl = editTeacher.photo;
                                        let publicId = editTeacher.photo_public_id;

                                        if (imageFile) {
                                            setUploadingImage(true);
                                            const uploaded = await uploadTeacherImage(imageFile);
                                            photoUrl = uploaded.url;
                                            publicId = uploaded.public_id;
                                        }

                                        const payload = {
                                            ...editTeacher,
                                            photo: photoUrl,
                                            photo_public_id: publicId,
                                        };

                                        let savedTeacher: Teacher;

                                        if (!editTeacher.id) {
                                            savedTeacher = await apiFetch("/api/teachers", {
                                                method: "POST",
                                                body: JSON.stringify(payload),
                                            });
                                            setTeacherList((prev) => [savedTeacher, ...prev]);
                                        } else {
                                            savedTeacher = await apiFetch(
                                                `/api/teachers/${editTeacher.id}`,
                                                {
                                                    method: "PUT",
                                                    body: JSON.stringify(payload),
                                                }
                                            );
                                            setTeacherList((prev) =>
                                                prev.map((t) =>
                                                    t.id === savedTeacher.id ? savedTeacher : t
                                                )
                                            );
                                        }

                                        setEditTeacher(null);
                                        setImageFile(null);
                                        setErrors({});
                                    } finally {
                                        setUploadingImage(false);
                                        setSavingTeacher(false); // ✅ FIX
                                    }
                                }}
                            >
                                {savingTeacher
                                    ? "Saving..."
                                    : editTeacher.id
                                        ? "Save Changes"
                                        : "Add Teacher"}
                            </Button>


                        </div>
                    </DialogContent>
                )}
            </Dialog>

        </div>
    );
}
