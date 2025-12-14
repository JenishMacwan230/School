'use client';
import { StickyScroll } from '@/components/ui/sticky-scroll-reveal';
import Image from 'next/image';

const content = [
  {
    title: 'Establishment & Foundation',
    description:
      'R. N. Naik Sarvajanik High School was established in 1966 in the Gandevi Taluka of Navsari district, Gujarat. Since its foundation, the school has played a vital role in providing quality secondary and higher secondary education to students from surrounding rural areas.',
    content: (
      <div className="relative h-full w-full flex items-center justify-center overflow-hidden rounded-2xl">
        <Image
          src="/est.jpeg"
          alt="School building"
          fill
          className="object-cover"
          priority
        />
      </div>
    ),
  },
  {
    title: 'Serving Rural Communities',
    description:
      'Located in the Gandevi block, the school primarily serves students from villages such as Amalsad and Sarikhurad. It has become a trusted educational institution for rural families seeking accessible and reliable education for their children.',
    content: (
      <div className="relative h-full w-full flex items-center justify-center overflow-hidden rounded-2xl">
        <Image
          src="/trust.webp"
          alt="Students from rural communities"
          fill
          className="object-cover"
        />
      </div>
    ),
  },
  {
    title: 'Management & Governance',
    description:
      'The school is managed by Katha Vibhag Kelavani Mandal, Sarikhurad, a private aided educational trust. The trust is committed to maintaining academic standards, supporting teachers, and continuously improving educational facilities.',
    content: (
      <div className="relative h-full w-full flex items-center justify-center overflow-hidden rounded-2xl">
        <Image
          src="/manage.jpeg"
          alt="School management and administration"
          fill
          className="object-cover"
        />
      </div>
    ),
  },
  {
    title: 'Academic Focus & Growth',
    description:
      'R. N. Naik Sarvajanik High School offers education from Grades 9 to 12 in the Gujarati medium, following the State Board curriculum. Along with strong academic foundations, the school emphasizes arts, physical education, and overall personality development to prepare students for future success.',
    content: (
      <div className="relative h-full w-full flex items-center justify-center overflow-hidden rounded-2xl">
        <Image
          src="/acad.jpeg"
          alt="Students engaged in academics and activities"
          fill
          className="object-cover"
        />
      </div>
    ),
  },
];

export function History() {
  return (
    <div className="w-full pt-4">
      <div className="mb-4 text-center">
        <h2 className="text-3xl font-bold tracking-tight mb-2">
          Our History
        </h2>
        <p className="text-muted-foreground max-w-3xl mx-auto">
          A journey of educational excellence, community service, and holistic
          development since 1966.
        </p>
      </div>

      <StickyScroll content={content} />
    </div>
  );
}
