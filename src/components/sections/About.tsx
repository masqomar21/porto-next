'use client';

export default function AboutSection({
  data,
}: {
  data: { bio?: string; photoUrl?: string; resumeUrl?: string };
  name?: string;
  email?: string;
}) {
  return (
    <section id="about" className="py-16 md:py-20 px-6 max-w-3xl mx-auto border-t border-border/40">
      <div className="flex flex-col gap-6">
        <span className="font-mono text-xs text-muted-foreground uppercase tracking-wider">
          About
        </span>

        <p className="text-sm sm:text-base leading-relaxed text-foreground/85 font-sans whitespace-pre-wrap">
          {data.bio ||
            "I'm a full-stack engineer passionate about user experience, API performance, and robust system architecture."}
        </p>

        {data.resumeUrl && (
          <div className="pt-2">
            <a
              href={data.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 font-mono text-xs text-foreground hover:underline"
            >
              <span>Download Resume</span>
              <span>↓</span>
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
