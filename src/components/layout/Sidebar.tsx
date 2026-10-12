"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const mainNavigation = [
  { label: "HOME", href: "/" },
  { label: "VIDEOGRAPHY", href: "/videography" },
  { label: "PHOTOGRAPHY", href: "/photography" },
  { label: "VIDEO EDITS", href: "/video-edits" },
  { label: "GRAPHIC DESIGNS", href: "/graphics-design" },
];

const secondaryNavigation = [
  { label: "CONTACT ME", href: "/contact" },
  { label: "ABOUT", href: "/about" },
];

const adobeTools = [
  { name: "Premiere Pro", icon: "/adobe/Pr.svg" },
  { name: "After Effects", icon: "/adobe/Ae.svg" },
  { name: "Photoshop", icon: "/adobe/Ps.svg" },
  { name: "Lightroom Classic", icon: "/adobe/LrC.svg" },
  { name: "Media Encoder", icon: "/adobe/Me.svg" },
  { name: "Illustrator", icon: "/adobe/Ai.svg" },
];

export default function Sidebar() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <aside className="fixed left-0 top-0 z-50 hidden h-screen w-[270px] bg-[#151516] text-[#F8F8F5] lg:block">
      <div className="relative flex h-full flex-col overflow-hidden rounded-tl-[32px] px-8 py-8">

        {/* Subtle Japanese background */}
        <div className="pointer-events-none absolute -right-14 top-[35%] rotate-90 text-[78px] font-light leading-none tracking-[0.08em] text-[#F8F8F5] opacity-[0.025]">
          映像 写真 編集
        </div>

        {/* Subtle vertical guide */}
        <div className="pointer-events-none absolute right-8 top-0 h-full w-px bg-[#F8F8F5]/[0.035]" />

        {/* Profile Image / Identity */}
        <div className="relative z-10 -mx-8 -mt-8 h-[220px] w-[calc(100%+4rem)] overflow-hidden">

          {/* Profile image */}
          <Image
            src="/profile.jpg"
            alt="Zyrell Baculi"
            fill
            priority
            className="object-cover object-center"
            sizes="270px"
          />

          {/* Overall dark tint */}
          <div className="absolute inset-0 bg-[#151516]/10" />

          {/* Bottom gradient */}
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#151516] via-[#151516]/75 to-transparent" />

          {/* Side gradients */}
          <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-[#151516]/25 to-transparent" />
          <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-[#151516]/25 to-transparent" />

          {/* Identity over image */}
          <div className="absolute bottom-7 left-8 z-10">
            <h1 className="text-[15px] font-bold tracking-[0.14em] text-[#F8F8F5]">
              ZYRELL BACULI
            </h1>

            <p className="mt-2 text-[8px] font-medium tracking-[0.24em] text-[#F8F8F5]/50">
              MULTIMEDIA DESIGNER
            </p>

            <div className="mt-5 h-px w-10 bg-[#B82134]" />
          </div>
        </div>

        {/* Main Navigation */}
        <nav className="relative z-10 mt-10 flex flex-col gap-2">
          {mainNavigation.map((item, index) => {
            const active = isActive(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className="group relative flex items-center py-2.5"
              >
                {/* Active / hover line */}
                <span
                  className={`absolute left-0 top-1/2 h-px bg-[#B82134] transition-all duration-300 ${
                    active ? "w-5" : "w-0 group-hover:w-5"
                  }`}
                />

                {/* Number */}
                <span
                  className={`ml-8 w-7 text-[8px] tracking-[0.12em] transition-all duration-300 ${
                    active
                      ? "text-[#B82134]"
                      : "text-[#F8F8F5]/20 group-hover:text-[#F8F8F5]/40"
                  }`}
                >
                  {String(index + 1).padStart(2, "0")}
                </span>

                {/* Label */}
                <span
                  className={`origin-left text-[11px] tracking-[0.14em] transition-all duration-300 ${
                    active
                      ? "scale-[1.08] font-semibold text-[#F8F8F5]"
                      : "font-medium text-[#F8F8F5]/45 group-hover:translate-x-1 group-hover:text-[#F8F8F5]/85"
                  }`}
                >
                  {item.label}
                </span>

                {/* Active dot */}
                {active && (
                  <span className="absolute right-5 h-1 w-1 rounded-full bg-[#B82134]" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Secondary Navigation */}
        <nav className="relative z-10 mt-10 flex flex-col gap-2 border-t border-[#F8F8F5]/[0.07] pt-6">
          {secondaryNavigation.map((item, index) => {
            const active = isActive(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className="group relative flex items-center py-2.5"
              >
                {/* Active / hover line */}
                <span
                  className={`absolute left-0 top-1/2 h-px bg-[#B82134] transition-all duration-300 ${
                    active ? "w-5" : "w-0 group-hover:w-5"
                  }`}
                />

                {/* Number */}
                <span
                  className={`ml-8 w-7 text-[8px] tracking-[0.12em] transition-all duration-300 ${
                    active
                      ? "text-[#B82134]"
                      : "text-[#F8F8F5]/20 group-hover:text-[#F8F8F5]/40"
                  }`}
                >
                  {String(index + 6).padStart(2, "0")}
                </span>

                {/* Label */}
                <span
                  className={`origin-left text-[11px] tracking-[0.14em] transition-all duration-300 ${
                    active
                      ? "scale-[1.08] font-semibold text-[#F8F8F5]"
                      : "font-medium text-[#F8F8F5]/45 group-hover:translate-x-1 group-hover:text-[#F8F8F5]/85"
                  }`}
                >
                  {item.label}
                </span>

                {/* Active dot */}
                {active && (
                  <span className="absolute right-5 h-1 w-1 rounded-full bg-[#B82134]" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Brand Area */}
        <div className="relative z-10 mt-auto pt-6">

          {/* Adobe Logo Carousel */}
        <div className="relative mb-5 h-7 w-full overflow-hidden">

          {/* Inner carousel viewport */}
          <div className="mx-4 h-full overflow-hidden">

            {/* Left fade */}
            <div className="pointer-events-none absolute left-4 top-0 z-10 h-full w-2 bg-gradient-to-r from-[#151516] to-transparent" />

            {/* Right fade */}
            <div className="pointer-events-none absolute right-4 top-0 z-10 h-full w-2 bg-gradient-to-l from-[#151516] to-transparent" />

            <div className="flex h-full w-max animate-[adobeCarousel_18s_linear_infinite] items-center">
              {[...adobeTools, ...adobeTools].map((tool, index) => (
                <div
                  key={`${tool.name}-${index}`}
                  className="mx-2 flex h-6 w-6 shrink-0 items-center justify-center opacity-75 transition-opacity duration-300 hover:opacity-100"
                >
                  <Image
                    src={tool.icon}
                    alt={tool.name}
                    width={20}
                    height={20}
                    className="h-5 w-5 object-contain"
                  />
                </div>
              ))}
            </div>

          </div>
        </div>

          {/* Divider */}
          <div className="mb-5 h-px w-full bg-[#F8F8F5]/[0.07]" />

          {/* Logo / Archive */}
          <div className="flex items-end justify-between">

            {/* Logo */}
            <div className="relative h-12 w-12 opacity-80">
              <Image
                src="/logo.svg"
                alt="Zyrell Baculi logo"
                fill
                className="object-contain"
                sizes="48px"
              />
            </div>

            {/* Archive information */}
            <div className="text-right">
              <p className="text-[7px] font-medium tracking-[0.2em] text-[#F8F8F5]/30">
                VISUAL ARCHIVE
              </p>

              <p className="mt-2 text-[7px] tracking-[0.12em] text-[#F8F8F5]/15">
                © {new Date().getFullYear()} ZYRELL BACULI
              </p>
            </div>

          </div>
        </div>

      </div>
    </aside>
  );
}