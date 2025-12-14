import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { History } from '@/components/History';

export default function AboutPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12 space-y-16 pt-35">

      {/* PAGE HEADER */}
      <section className="text-center space-y-4">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
          About Our School
        </h1>
        <p className="text-muted-foreground max-w-3xl mx-auto">
          Learn about our journey, our guiding trust, and the people who shape
          the future of our students.
        </p>
      </section>

      <Separator />

      {/* SCHOOL HISTORY */}

      <History />

      <Separator />
      {/* TRUST INFORMATION */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-center">
          About the Managing Trust
        </h2>

        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">

              {/* TRUST LOGO (Mobile: top | Desktop: right) */}
              <div className="md:order-2 flex-shrink-0">
                <Image
                  src="/trus.jpeg" // put logo inside public/
                  alt="Katha Vibhag Kelavani Mandal Logo"
                  width={160}
                  height={160}
                  
                  className="object-contain rounded-2xl"
                />
              </div>

              {/* TEXT CONTENT */}
              <div className="space-y-4 md:order-1 text-center md:text-left">
                <p className="text-muted-foreground leading-relaxed">
                  R. N. Naik Sarvajanik High School is managed by{" "}
                  <span className="font-semibold text-primary">
                    Katha Vibhag Kelavani Mandal, Sarikhurad
                  </span>
                  , a private aided educational trust dedicated to strengthening education
                  in rural communities of the Gandevi Taluka, Navsari district.
                </p>

                <p className="text-muted-foreground leading-relaxed">
                  The trust focuses on providing accessible and quality education at the
                  secondary and higher secondary levels by maintaining academic
                  discipline, supporting qualified teaching staff, and developing
                  essential educational infrastructure.
                </p>
              </div>

            </div>
          </CardContent>
        </Card>
      </section>



      {/* TRUSTEES / MANAGEMENT */}
      {/* TRUSTEES / MANAGEMENT */}
      <section className="space-y-8">
        <h2 className="text-2xl font-semibold text-center">
          Trustees & Management
        </h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {trustees.map((member) => (
            <Card key={member.name} className="text-center">
              <CardHeader>
                <div className="mx-auto w-32 h-32 relative rounded-full overflow-hidden">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <CardTitle className="mt-4">{member.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {member.role}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>


    </div>
  );
}

/* ---------------- DATA ---------------- */

const trustees = [
  {
    name: "Shri A. B. Patel",
    role: "Chairman, Managing Trust",
    image: "/about/trustee-1.jpg",
  },
  {
    name: "Shri C. D. Shah",
    role: "Trustee",
    image: "/about/trustee-2.jpg",
  },
  {
    name: "Smt. E. F. Mehta",
    role: "Trustee",
    image: "/about/trustee-3.jpg",
  },
];
