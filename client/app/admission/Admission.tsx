"use client";

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

export default function AdmissionInquiryPage() {
    return (
        <div className="min-h-screen bg-background">
            <div className="max-w-6xl mx-auto px-4 pt-32 pb-24 space-y-16">

                {/* ================= HEADER ================= */}
                <section className="text-center space-y-4">
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                        Admission Inquiry
                    </h1>
                    <p className="text-muted-foreground max-w-3xl mx-auto text-base md:text-lg">
                        Admissions are granted strictly on a merit basis following
                        Gujarat State Board norms.
                    </p>
                </section>

                <Separator />

                {/* ================= STD 9 ADMISSION ================= */}
                <section className="space-y-6">
                    <h2 className="text-2xl font-semibold text-center">
                        Admission for Std. 9
                    </h2>

                    <Card className="border-l-4 border-primary">
                        <CardHeader>
                            <CardTitle>Merit-Based Admission Process</CardTitle>
                        </CardHeader>

                        <CardContent className="space-y-3 text-muted-foreground">
                            <p>
                                Admission to <strong>Std. 9</strong> is offered based on the
                                student’s academic performance in Std. 8, as per
                                Gujarat Secondary Education Board (GSEB) guidelines.
                            </p>

                            <ul className="list-disc list-inside space-y-1">
                                <li>Evaluation of previous academic records</li>
                                <li>Limited intake based on available seats</li>
                                <li>Preference given to meritorious students</li>
                                <li>Final decision by the school admission committee</li>
                            </ul>

                            <div className="pt-2">
                                <p className="font-medium text-foreground">
                                    Required Documents:
                                </p>
                                <ul className="list-disc list-inside space-y-1">
                                    <li>Previous year mark sheet</li>
                                    <li>School Leaving Certificate (if applicable)</li>
                                    <li>Passport-size photographs</li>
                                </ul>
                            </div>
                        </CardContent>
                    </Card>
                </section>

                <Separator />

                {/* ================= STD 11 ADMISSION ================= */}
                <section className="space-y-6">
                    <h2 className="text-2xl font-semibold text-center">
                        Admission for Std. 11
                    </h2>

                    <Card className="border-l-4 border-primary">
                        <CardHeader>
                            <CardTitle>Merit-Based Admission (Science & Arts)</CardTitle>
                        </CardHeader>

                        <CardContent className="space-y-4 text-muted-foreground">
                            <p>
                                Admission to <strong>Std. 11</strong> is strictly based on
                                merit obtained in the <strong>Std. 10 Board Examination</strong>,
                                as per Gujarat Board rules.
                            </p>

                            <div>
                                <p className="font-medium text-foreground">
                                    Streams Offered:
                                </p>
                                <ul className="list-disc list-inside space-y-1">
                                    <li>Science – PCM (Physics, Chemistry, Mathematics)</li>
                                    <li>Science – PCB (Physics, Chemistry, Biology)</li>
                                    <li>Arts Stream</li>
                                </ul>
                            </div>

                            <div>
                                <p className="font-medium text-foreground">
                                    Admission Criteria:
                                </p>
                                <ul className="list-disc list-inside space-y-1">
                                    <li>Merit list prepared based on Std. 10 marks</li>
                                    <li>Stream eligibility as per board norms</li>
                                    <li>Seat availability in the selected stream</li>
                                    <li>Final approval by admission committee</li>
                                </ul>
                            </div>

                            <div>
                                <p className="font-medium text-foreground">
                                    Required Documents:
                                </p>
                                <ul className="list-disc list-inside space-y-1">
                                    <li>Std. 10 Marksheet</li>
                                    <li>School Leaving Certificate</li>
                                    <li>Cast Certificate (if applicable)</li>
                                    <li>Passport-size photographs</li>
                                </ul>
                            </div>
                        </CardContent>
                    </Card>
                </section>

                <Separator />

                {/* ================= IMPORTANT NOTE ================= */}
                <section className="space-y-6 text-center">
                    <Card className="bg-muted">
                        <CardContent className="p-6 space-y-2 text-muted-foreground">
                            <p className="font-medium text-foreground">
                                Important Note
                            </p>
                            <p>
                                Submission of the inquiry form does not guarantee admission.
                                Admissions are confirmed only after merit verification and
                                document validation.
                            </p>
                        </CardContent>
                    </Card>
                </section>

                {/* ================= CONTACT ================= */}
                <section className="space-y-4 text-center">
                    <h2 className="text-xl font-semibold">
                        For Admission Inquiries
                    </h2>
                    <p className="text-muted-foreground">
                        Please visit the school office during working hours or contact us
                        directly for detailed guidance.
                    </p>

                    <div className="flex justify-center gap-4 flex-wrap">
                        <Button
                            variant="outline"
                            onClick={() =>
                                window.open(
                                    "https://maps.app.goo.gl/i8TjtNBo3zzue1Rx6",
                                    "_blank"
                                )
                            }
                        >
                            📍 View School Location
                        </Button>

                        {/* <Button
                            onClick={() => window.location.href = "tel:+919999999999"}
                        >
                            📞 Contact Administration
                        </Button> */}
                    </div>

                </section>

            </div>
        </div>
    );
}
