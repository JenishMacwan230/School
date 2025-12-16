"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function AcademicsPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 pt-32 pb-24 space-y-20">

        {/* ================= HEADER ================= */}
        <section className="text-center space-y-5">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            Academics
          </h1>
          <p className="text-muted-foreground max-w-3xl mx-auto text-base md:text-lg leading-relaxed">
            Our academic framework is designed to prepare students for board
            examinations, higher education, and responsible citizenship.
          </p>
        </section>

        <Separator />

        {/* ================= SCHOOL STRUCTURE ================= */}
        <section className="space-y-8">
          <h2 className="text-2xl font-semibold text-center">
            Academic Structure
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="border-l-4 border-primary hover:shadow-md transition">
              <CardHeader>
                <CardTitle>Secondary Section (Std. 9 – 10)</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground space-y-2">
                <p>• Gujarat State Board syllabus</p>
                <p>• NCERT-aligned curriculum</p>
                <p>• Strong focus on board exam preparation</p>
                <p>• Concept clarity & regular assessments</p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-purple-500 hover:shadow-md transition">
              <CardHeader>
                <CardTitle>Higher Secondary (Std. 11 – 12)</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground space-y-2">
                <p>• Gujarat Board curriculum</p>
                <p>• Stream-based specialization</p>
                <p>• Competitive exam readiness</p>
                <p>• Academic mentoring & guidance</p>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator />

         {/* ================= JEE / NEET PREPARATION ================= */}
        <section className="space-y-8">
          <h2 className="text-2xl font-semibold text-center">
            JEE & NEET Preparation (Std. 11 – 12)
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="bg-gradient-to-br from-primary/5 to-purple-500/5 hover:shadow-md transition border-l-4 border-primary">
              <CardHeader>
                <CardTitle>Competitive Exam Training</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground space-y-2">
                <p>• Integrated JEE & NEET preparation with board syllabus</p>
                <p>• Strong NCERT-based conceptual teaching</p>
                <p>• Regular problem-solving and practice sessions</p>
                <p>• Performance tracking through tests & revisions</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-primary/5 to-purple-500/5 hover:shadow-md transition border-l-4 border-purple-500">
              <CardHeader>
                <CardTitle>Guidance & Mentorship</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground space-y-2">
                <p>• Personalized mentoring for JEE & NEET aspirants</p>
                <p>• Doubt-solving and revision support</p>
                <p>• Exam strategy, time management & discipline</p>
                <p>• Foundation for engineering and medical careers</p>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator />

        {/* ================= STREAMS OFFERED ================= */}
        <section className="space-y-10">
          <h2 className="text-2xl font-semibold text-center">
            Streams Offered (Std. 11 – 12)
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Science – PCM",
                desc: [
                  "Mathematics",
                  "Physics & Chemistry",
                  "English",
                  "Computer or Sanskrit",
                  "Engineering & technical pathways",
                ],
              },
              {
                title: "Science – PCB",
                desc: [
                  "Biology",
                  "Physics & Chemistry",
                  "English",
                  "Computer or Sanskrit",
                  "Medical & life sciences",
                ],
              },
              {
                title: "Arts",
                desc: [
                  "Sociology",
                  "Geography",
                  "Psychology & Philosophy",
                  "Gujarati, Sanskrit & English",
                  "Chemical Technology & Sports",
                ],
              },
            ].map((stream) => (
              <Card
                key={stream.title}
                className="bg-gradient-to-br from-primary/5 to-purple-500/5 hover:shadow-lg transition border-t-4 border-primary"
              >
                <CardHeader>
                  <CardTitle className="text-center">
                    {stream.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-muted-foreground space-y-2 text-center">
                  {stream.desc.map((d) => (
                    <p key={d}>{d}</p>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <Separator />

        {/* ================= TEACHING METHODOLOGY ================= */}
        <section className="space-y-8">
          <h2 className="text-2xl font-semibold text-center">
            Teaching Methodology
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                title: "Concept-Oriented Teaching",
                desc: "Strong emphasis on fundamentals and clarity.",
              },
              {
                title: "Board Examination Focus",
                desc: "Structured preparation aligned with Gujarat Board.",
              },
              {
                title: "Continuous Assessment",
                desc: "Unit tests, prelim exams, and progress tracking.",
              },
              {
                title: "Student Mentorship",
                desc: "Academic support and career guidance.",
              },
            ].map((item) => (
              <Card
                key={item.title}
                className="hover:shadow-md transition"
              >
                <CardContent className="p-6 space-y-2">
                  <h3 className="font-semibold">{item.title}</h3>
                  <p className="text-muted-foreground">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>


       

        <Separator />

        {/* ================= ACHIEVEMENTS ================= */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-center">
            Academic Achievements
          </h2>

          <Card className="bg-gradient-to-r from-primary/5 to-purple-500/5">
            <CardContent className="p-6 text-muted-foreground space-y-2">
              <p>• Consistent Gujarat Board examination results</p>
              <p>• High pass percentage in Std. 10 & 12</p>
              <p>• Students progressing to reputed colleges</p>
              <p>• Strong academic discipline and performance</p>
            </CardContent>
          </Card>
        </section>

      </div>
    </div>
  );
}
