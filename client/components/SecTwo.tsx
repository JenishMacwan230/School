'use client';

import Marquee from '@/components/ui/marquee';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export function SecTwo() {
  const router = useRouter();

  const heading = '🏫 Discover Life at Our School';

  const description = `Explore opportunities that shape young minds.
From admissions to academics, campus life to achievements —
everything you need to know, all in one place.`;

  const sections = [
    {
      title: 'Admission Inquiry',
      image: '/admissions.jpg',
      path: '/admission',
    },
    {
      title: 'Our Campus',
      image: '/campus.jpeg',
      path: '/campus',
    },
    {
      title: 'Academics',
      image: '/academics.jpg',
      path: '/academics',
    },
    {
      title: 'Sports & Activities',
      image: '/sports.jpeg',
      path: '/sports',
    },
    {
      title: 'Alumni',
      image: '/alumni.png',
      path: '/alumni',
    },
    {
      title: 'Teachers',
      image: '/teachers.jpeg',
      path: '/teachers',
    },
  ];

  return (
    <section className="relative flex flex-col items-center justify-center px-4 py-16">

      {/* Heading */}
      <h2 className="text-center text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight mb-4 text-primary">
        {heading}
      </h2>

      {/* Description */}
      <p className="text-center text-sm sm:text-base md:text-lg text-muted-foreground max-w-3xl leading-relaxed mb-10">
        {description}
      </p>

      {/* Marquee */}
      <Marquee speed={120} pauseOnHover className="w-full py-8">
        <div className="flex items-center gap-10 sm:gap-14">

          {sections.map((item) => (
            <div
              key={item.title}
              className="flex flex-col items-center text-center cursor-pointer"
              onClick={() => router.push(item.path)}
            >
              {/* Circular Image */}
              <div className="relative w-40 h-40 sm:w-48 sm:h-48 md:w-52 md:h-52 rounded-full overflow-hidden border-4 border-primary/20 shadow-lg hover:shadow-xl transition">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  sizes="(max-width: 640px) 160px, (max-width: 1024px) 192px, 208px"
                  className="object-cover transition-transform duration-300 hover:scale-105"
                />
              </div>

              {/* Title */}
              <h3 className="mt-4 text-base sm:text-lg font-semibold text-primary">
                {item.title}
              </h3>
            </div>
          ))}

        </div>
      </Marquee>
    </section>
  );
}
