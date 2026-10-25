import Link from "next/link";

// Replace these with the real slugs your /videography page links to,
// e.g. href="/videography/wedding-film" -> { album: "wedding-film" }
export function generateStaticParams() {
  return [{ album: "sample" }];
}

export const dynamicParams = false;

const videos = [
  {
    number: "01",
    title: "VIDEO TITLE",
    category: "MAIN VIDEO",
  },
  {
    number: "02",
    title: "VIDEO TITLE",
    category: "EDUCATIONAL",
  },
  {
    number: "03",
    title: "VIDEO TITLE",
    category: "SOCIAL CUT",
  },
  {
    number: "04",
    title: "VIDEO TITLE",
    category: "SHORT FORM",
  },
  {
    number: "05",
    title: "VIDEO TITLE",
    category: "PROMOTIONAL",
  },
  {
    number: "06",
    title: "VIDEO TITLE",
    category: "ADDITIONAL",
  },
];

export default function AlbumPage() {
  return (
    <main className="h-screen overflow-hidden bg-[#F8F8F5] lg:pl-[270px]">
      <section className="relative flex h-full flex-col overflow-hidden">

        {/* Japanese background element */}
        <div className="pointer-events-none absolute -right-10 top-24 z-0 text-[170px] font-light leading-none tracking-[-0.08em] text-[#151516] opacity-[0.025]">
          映像
        </div>

        {/* Fixed Album Header */}
        <header className="relative z-10 shrink-0 border-b border-[#151516]/10 px-8 pb-8 pt-10 md:px-12 lg:px-16">

          <div className="flex items-end justify-between">

            <div>
              <p className="text-[9px] tracking-[0.3em] text-[#151516]/30">
                VIDEOGRAPHY / ALBUM 001
              </p>

              <h1 className="mt-3 text-4xl font-bold tracking-[-0.04em] text-[#B82134] md:text-5xl">
                ALBUM NAME
              </h1>
            </div>

            <Link
              href="/videography"
              className="group mb-1 flex items-center gap-3 text-[8px] tracking-[0.18em] text-[#151516]/50 transition-all duration-300 hover:text-[#151516]"
            >
              <span className="text-xl font-light leading-none transition-transform duration-300 group-hover:-translate-x-1">
                ‹
              </span>

              <span>GO BACK</span>
            </Link>

          </div>

          {/* Album description */}
          <div className="mt-8">
            <p className="max-w-2xl text-[9px] leading-5 tracking-[0.08em] text-[#151516]/45">
              Album description goes here. This space can be used to briefly
              describe the project, production, client, or creative direction.
            </p>
          </div>

        </header>

        {/* Scrollable Video Area */}
        <section className="custom-scrollbar relative z-10 min-h-0 flex-1 overflow-y-auto px-8 py-10 md:px-12 lg:px-16">

          <div className="grid gap-x-6 gap-y-12 md:grid-cols-2 xl:grid-cols-3">

            {videos.map((video) => (
              <article
                key={video.number}
                className="group cursor-pointer"
              >

                {/* Video Frame */}
                <div className="relative aspect-video overflow-hidden bg-[#151516]">

                  {/* Video number */}
                  <div className="absolute left-4 top-4 z-10 text-[9px] tracking-[0.2em] text-[#F8F8F5]/35">
                    {video.number}
                  </div>

                  {/* Video information */}
                  <div className="absolute inset-x-0 bottom-0 z-10 p-5">

                    <h2 className="text-sm font-bold tracking-[0.03em] text-[#F8F8F5]">
                      {video.title}
                    </h2>

                    <p className="mt-2 text-[8px] tracking-[0.18em] text-[#F8F8F5]/40">
                      {video.category}
                    </p>

                  </div>

                  {/* Bottom gradient */}
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#151516] via-[#151516]/60 to-transparent" />

                  {/* Hover line */}
                  <div className="absolute bottom-0 left-0 z-20 h-[2px] w-0 bg-[#B82134] transition-all duration-500 group-hover:w-full" />

                </div>

              </article>
            ))}

          </div>

        </section>

      </section>
    </main>
  );
}
