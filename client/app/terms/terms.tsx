"use client";

import { Separator } from "@/components/ui/separator";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-4 pt-32 pb-24 space-y-10">

        {/* HEADER */}
        <section className="text-center space-y-4">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            Terms & Conditions
          </h1>
          <p className="text-muted-foreground">
            RN Naik Sarvajanik High School
          </p>
        </section>

        <Separator />

        {/* CONTENT */}
        <section className="space-y-6 text-muted-foreground leading-relaxed">
          <p>
            By accessing and using this website, you agree to comply with the
            following terms and conditions. If you do not agree, please refrain
            from using the website.
          </p>

          <h2 className="text-xl font-semibold text-foreground">
            Website Usage
          </h2>
          <p>
            This website is intended for informational purposes related to the
            school, its academics, activities, and admissions.
          </p>

          <h2 className="text-xl font-semibold text-foreground">
            Content Ownership
          </h2>
          <p>
            All content including text, images, logos, and designs belongs to
            RN Naik Sarvajanik High School unless otherwise stated. Unauthorized
            use is prohibited.
          </p>

          <h2 className="text-xl font-semibold text-foreground">
            Accuracy of Information
          </h2>
          <p>
            While we strive to keep information accurate and up to date, the
            school does not guarantee completeness or correctness at all times.
          </p>

          <h2 className="text-xl font-semibold text-foreground">
            Image Usage
          </h2>
          <p>
            Images displayed on this website are from school events and
            activities. If any concern arises regarding image usage, please
            contact the school administration.
          </p>

          <h2 className="text-xl font-semibold text-foreground">
            External Links
          </h2>
          <p>
            The website may contain links to external sites. The school is not
            responsible for the content or privacy practices of those websites.
          </p>

          <h2 className="text-xl font-semibold text-foreground">
            Changes to Terms
          </h2>
          <p>
            RN Naik Sarvajanik High School reserves the right to modify these
            terms at any time without prior notice.
          </p>

          <p className="pt-4">
            Continued use of the website signifies acceptance of these terms.
          </p>
        </section>

      </div>
    </div>
  );
}
