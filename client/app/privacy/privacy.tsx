"use client";

import { Separator } from "@/components/ui/separator";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-4 pt-32 pb-24 space-y-10">

        {/* HEADER */}
        <section className="text-center space-y-4">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-muted-foreground">
            RN Naik Sarvajanik High School & Bharat Darshan Uchchattar Madhyamik High School, Sarikhurad.
          </p>
        </section>

        <Separator />

        {/* CONTENT */}
        <section className="space-y-6 text-muted-foreground leading-relaxed">
          <p>
            Our School is committed to protecting the privacy
            of students, parents, and visitors. This Privacy Policy explains how
            we collect, use, and safeguard information through our website.
          </p>

          <h2 className="text-xl font-semibold text-foreground">
            Information We Collect
          </h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>Student or parent names</li>
            <li>Contact details such as phone number and email</li>
            <li>Admission inquiry information</li>
            <li>Images from school activities and events</li>
          </ul>

          <h2 className="text-xl font-semibold text-foreground">
            How We Use Information
          </h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>To respond to admission inquiries</li>
            <li>For academic and administrative communication</li>
            <li>To showcase school activities on the website</li>
            <li>To improve our services and website experience</li>
          </ul>

          <h2 className="text-xl font-semibold text-foreground">
            Data Protection
          </h2>
          <p>
            We take appropriate security measures to protect personal
            information. Access to data is restricted to authorized school
            staff only.
          </p>

          <h2 className="text-xl font-semibold text-foreground">
            Third-Party Services
          </h2>
          <p>
            Images and files may be stored using secure third-party services.
            We do not sell or share personal information with unauthorized
            parties.
          </p>

          <h2 className="text-xl font-semibold text-foreground">
            Updates to This Policy
          </h2>
          <p>
            This Privacy Policy may be updated from time to time. Any changes
            will be reflected on this page.
          </p>

          <p className="pt-4">
            If you have any questions regarding this policy, please contact the
            school administration.
          </p>
        </section>

      </div>
    </div>
  );
}
