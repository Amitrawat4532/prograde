import Image from "next/image";
import Link from "next/link";
import type { Course } from "@/lib/content";
import { formatPrice } from "@/lib/site";

export function CourseCard({ course, index }: { course: Course; index: number }) {
  return (
    <article className="group h-full">
      <Link href={`/courses/${course.slug}`} data-parallax data-cursor="View" className="flex h-full flex-col">
        <div className="tilt relative aspect-[4/5] overflow-hidden bg-panel">
          <div className="tilt-deep absolute inset-0">
            <Image
              src={course.image.src}
              alt={course.image.alt}
              fill
              sizes="(min-width: 1024px) 24vw, 74vw"
              quality={65}
              className="object-cover"
              style={{ objectPosition: `${course.image.focus ?? 50}% 50%` }}
            />
          </div>
          <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
          <div className="tilt-pop absolute inset-x-0 bottom-0 p-5">
            <p className="meta text-amber">
              {String(index + 1).padStart(2, "0")} — {course.kicker}
            </p>
            <h3 className="mt-2 text-[clamp(1.6rem,6.5vw,2.1rem)] font-semibold uppercase leading-[0.92] tracking-[-0.035em]">
              {course.title}
            </h3>
          </div>
        </div>
        <p className="mt-4 line-clamp-2 text-sm leading-relaxed text-ink-2">{course.description}</p>
        <p className="meta mt-4 flex items-center justify-between border-t border-line pt-3 text-[0.62rem]!">
          <span>
            {course.lessons} lessons · {course.duration}
          </span>
          <span className="text-amber">{formatPrice(course.price)} →</span>
        </p>
      </Link>
    </article>
  );
}
