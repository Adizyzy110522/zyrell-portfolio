"use client";

import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import emailjs from "@emailjs/browser";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const services = [
  "VIDEOGRAPHY",
  "PHOTOGRAPHY",
  "VIDEO EDITS",
  "GRAPHICS DESIGN",
];

const ease = [0.22, 1, 0.36, 1] as const;

type FormMessage = {
  type: "error";
  text: string;
};



type TileIconName =

  | "video"

  | "camera"

  | "film"

  | "palette"

  | "mail"

  | "user"

  | "close"

  | "arrow";



type TileTiming = {

  open: number;

  exit: number;

};



type MenuTile = {

  id: string;

  label: string;

  href: string;

  icon?: TileIconName;

  className: string;

};



const menuTiles: MenuTile[] = [

  {

    id: "home",

    label: "Home",

    href: "/",

    className: "col-span-2 min-h-[clamp(72px,14dvh,108px)]",

  },

  {

    id: "videography",

    label: "Videography",

    href: "/videography",

    icon: "video",

    className: "min-h-[clamp(56px,11dvh,80px)]",

  },

  {

    id: "photography",

    label: "Photography",

    href: "/photography",

    icon: "camera",

    className: "min-h-[clamp(56px,11dvh,80px)]",

  },

  {

    id: "video-edits",

    label: "Video Edits",

    href: "/video-edits",

    icon: "film",

    className: "min-h-[clamp(56px,11dvh,80px)]",

  },

  {

    id: "graphic-designs",

    label: "Graphic Designs",

    href: "/graphics-design",

    icon: "palette",

    className: "min-h-[clamp(56px,11dvh,80px)]",

  },

  {

    id: "contact",

    label: "Contact Me",

    href: "/contact",

    icon: "mail",

    className: "col-span-2 min-h-[clamp(42px,7dvh,54px)]",

  },

  {

    id: "about",

    label: "About Me",

    href: "/about",

    icon: "user",

    className: "col-span-2 min-h-[clamp(42px,7dvh,54px)]",

  },

];



function TileIcon({

  name,

  className = "h-6 w-6",

}: {

  name: TileIconName;

  className?: string;

}) {

  const common = {

    className,

    viewBox: "0 0 24 24",

    fill: "none",

    stroke: "currentColor",

    strokeWidth: 1.7,

    strokeLinecap: "round" as const,

    strokeLinejoin: "round" as const,

    "aria-hidden": true as const,

  };



  switch (name) {

    case "video":

      return (

        <svg {...common}>

          <rect x="3" y="5" width="13" height="14" rx="1" />

          <path d="m16 10 5-3v10l-5-3" />

        </svg>

      );



    case "camera":

      return (

        <svg {...common}>

          <path d="M4 7h4l2-2h4l2 2h4a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1Z" />

          <circle cx="12" cy="13" r="3.5" />

        </svg>

      );



    case "film":

      return (

        <svg {...common}>

          <rect x="4" y="3" width="16" height="18" rx="1" />

          <path d="M8 3v18M16 3v18M4 8h4m-4 8h4m8-8h4m-4 8h4" />

        </svg>

      );



    case "palette":

      return (

        <svg {...common}>

          <path d="M12 3a9 9 0 1 0 0 18h1a2 2 0 0 0 1.5-3.3 1.8 1.8 0 0 1 1.4-3h1.2A4.9 4.9 0 0 0 22 9.8C22 6 17.5 3 12 3Z" />

          <circle cx="7.5" cy="10" r="1" />

          <circle cx="10" cy="6.8" r="1" />

          <circle cx="15" cy="7" r="1" />

        </svg>

      );



    case "mail":

      return (

        <svg {...common}>

          <rect x="3" y="5" width="18" height="14" rx="1" />

          <path d="m4 7 8 6 8-6" />

        </svg>

      );



    case "user":

      return (

        <svg {...common}>

          <circle cx="12" cy="8" r="4" />

          <path d="M4 21a8 8 0 0 1 16 0" />

        </svg>

      );



    case "close":

      return (

        <svg {...common}>

          <path d="m6 6 12 12M18 6 6 18" />

        </svg>

      );



    case "arrow":

      return (

        <svg {...common}>

          <path d="M7 17 17 7M7 7h10v10" />

        </svg>

      );

  }

}



/* Mobile tile navigation */

function MobileTileMenu() {

  const [isOpen, setIsOpen] = useState(false);

  const [isClosing, setIsClosing] = useState(false);

  const [timings, setTimings] = useState<Record<string, TileTiming>>({});

  const pathname = usePathname();

  const shouldReduceMotion = useReducedMotion();



  function openMenu() {

    const entranceOrder = [...menuTiles].sort(

      () => Math.random() - 0.5,

    );



    const exitOrder = [...menuTiles].sort(

      () => Math.random() - 0.5,

    );



    const nextTimings: Record<string, TileTiming> = {};



    menuTiles.forEach((tile) => {

      nextTimings[tile.id] = {

        open: shouldReduceMotion

          ? 0

          : entranceOrder.findIndex((item) => item.id === tile.id) * 0.035,

        exit: shouldReduceMotion

          ? 0

          : exitOrder.findIndex((item) => item.id === tile.id) * 0.025,

      };

    });



    setTimings(nextTimings);

    setIsClosing(false);

    setIsOpen(true);

  }



  function closeMenu() {

    if (!isOpen || isClosing) return;



    setIsClosing(true);



    const exitDelay = shouldReduceMotion

      ? 0

      : (menuTiles.length - 1) * 25;



    window.setTimeout(

      () => {

        setIsOpen(false);

        setIsClosing(false);

      },

      exitDelay + (shouldReduceMotion ? 120 : 240),

    );

  }



  useEffect(() => {

    if (!isOpen) return;



    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";



    const handleKeyDown = (event: KeyboardEvent) => {

      if (event.key === "Escape") closeMenu();

    };



    window.addEventListener("keydown", handleKeyDown);



    return () => {

      document.body.style.overflow = previousOverflow;

      window.removeEventListener("keydown", handleKeyDown);

    };

  }, [isOpen, isClosing]);



  const tileVariants = {

    hidden: (timing: TileTiming) => ({

      opacity: 0,

      scale: 0.88,

      transition: {

        duration: shouldReduceMotion ? 0.1 : 0.22,

        delay: timing.exit,

        ease: [0.4, 0, 1, 1] as const,

      },

    }),

    visible: (timing: TileTiming) => ({

      opacity: 1,

      scale: 1,

      transition: {

        duration: shouldReduceMotion ? 0.1 : 0.42,

        delay: timing.open,

        ease: [0.22, 1, 0.36, 1] as const,

      },

    }),

  };



  return (

    <>

      <button

        type="button"

        onClick={isOpen ? closeMenu : openMenu}

        aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}

        aria-expanded={isOpen}

        className="fixed right-4 top-4 z-[130] flex h-11 w-11 items-center justify-center border border-white/15 bg-[#151516] text-[#F8F8F5] shadow-lg transition-all duration-300 hover:border-[#B82134] hover:bg-[#B82134] lg:hidden"

      >

        {isOpen && !isClosing ? (

          <TileIcon name="close" />

        ) : (

          <img

            src="/logo.svg"

            alt=""

            className="h-7 w-7 object-contain"

          />

        )}

      </button>



      <AnimatePresence>

        {isOpen && (

          <motion.div

            key="tile-navigation"

            initial={{ opacity: 0 }}

            animate={{ opacity: isClosing ? 0 : 1 }}

            exit={{ opacity: 0 }}

            transition={{

              duration: shouldReduceMotion ? 0.1 : 0.28,

              ease: [0.22, 1, 0.36, 1],

            }}

            onClick={closeMenu}

            className="fixed inset-0 z-[120] flex items-center justify-center overflow-hidden bg-[#0B0B0C]/[0.97] px-3 pb-3 pt-16 backdrop-blur-md lg:hidden"

          >

            <div

              onClick={(event) => event.stopPropagation()}

              className="flex max-h-full w-full max-w-[390px] flex-col"

            >

              <div className="mb-2 flex shrink-0 items-center justify-between">

                <div>

                  <p className="text-[9px] font-semibold tracking-[0.28em] text-[#E85A6A]">

                    CAZMIRECREATES

                  </p>

                  <h2 className="mt-0.5 text-xs font-medium tracking-[0.16em] text-[#F8F8F5]">

                    NAVIGATION

                  </h2>

                </div>

              </div>



              <div className="grid shrink-0 grid-cols-2 gap-1.5">

                {menuTiles.map((tile) => {

                  const isActive =

                    pathname === tile.href ||

                    (tile.href !== "/" &&

                      pathname.startsWith(`${tile.href}/`));



                  const timing = timings[tile.id] ?? {

                    open: 0,

                    exit: 0,

                  };



                  const isHome = tile.id === "home";



                  return (

                    <motion.div

                      key={tile.id}

                      custom={timing}

                      variants={tileVariants}

                      initial="hidden"

                      animate={isClosing ? "hidden" : "visible"}

                      className={tile.className}

                    >

                      <Link

                        href={tile.href}

                        onClick={closeMenu}

                        aria-current={isActive ? "page" : undefined}

                        className={[

                          "group relative flex h-full min-h-0 w-full flex-col justify-between overflow-hidden p-3 text-left sm:p-4",

                          "border transition-[background-color,color,border-color] duration-300",

                          isActive

                            ? "border-[#B82134] bg-[#F8F8F5] text-[#151516] shadow-[inset_0_0_0_1px_#B82134]"

                            : isHome

                              ? "border-[#B82134] bg-[#B82134] text-white hover:bg-[#CE2C41]"

                              : "border-white/10 bg-[#242426] text-[#F8F8F5] hover:border-[#B82134] hover:bg-[#35161C]",

                        ].join(" ")}

                      >

                        {isHome ? (

                          <>

                            <div className="flex items-start justify-between">

                              <img

                                src="/logo.svg"

                                alt="CazmireCreates"

                                className={[

                                  "h-9 w-9 object-contain sm:h-11 sm:w-11",

                                  isActive ? "brightness-0" : "",

                                ].join(" ")}

                              />

                              <TileIcon

                                name="arrow"

                                className={[

                                  "h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5",

                                  isActive

                                    ? "text-[#B82134]"

                                    : "text-white",

                                ].join(" ")}

                              />

                            </div>



                            <div>

                              <p

                                className={[

                                  "text-[9px] font-medium tracking-[0.2em]",

                                  isActive

                                    ? "text-[#B82134]"

                                    : "text-white/90",

                                ].join(" ")}

                              >

                                CAZMIRECREATES

                              </p>

                              <span className="mt-0.5 block text-xl font-semibold tracking-tight sm:text-2xl">

                                Home

                              </span>

                            </div>

                          </>

                        ) : (

                          <>

                            <div className="flex items-center justify-between">

                              {tile.icon && (

                                <TileIcon

                                  name={tile.icon}

                                  className={[

                                    "h-5 w-5 transition-transform duration-300 group-hover:scale-110 sm:h-6 sm:w-6",

                                    isActive

                                      ? "text-[#B82134]"

                                      : "text-[#E85A6A]",

                                  ].join(" ")}

                                />

                              )}



                              <TileIcon

                                name="arrow"

                                className={[

                                  "h-3.5 w-3.5 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5",

                                  isActive

                                    ? "text-[#B82134]"

                                    : "text-white/65",

                                ].join(" ")}

                              />

                            </div>



                            <span

                              className={[

                                "mt-2 text-xs font-semibold leading-tight tracking-wide sm:text-sm",

                                isActive

                                  ? "text-[#151516]"

                                  : "text-[#F8F8F5]",

                              ].join(" ")}

                            >

                              {tile.label}

                            </span>

                          </>

                        )}

                      </Link>

                    </motion.div>

                  );

                })}

              </div>



              <p className="mt-2 shrink-0 text-center text-[8px] tracking-[0.16em] text-white/50">

                VISUAL ARCHIVE · © 2026 CAZMIRECREATES

              </p>

            </div>

          </motion.div>

        )}

      </AnimatePresence>

    </>

  );

}

export default function ContactPage() {
  const [selectedService, setSelectedService] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formMessage, setFormMessage] = useState<FormMessage | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successModalMessage, setSuccessModalMessage] = useState("");
  const shouldReduceMotion = useReducedMotion();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    setFormMessage(null);

    const form = e.currentTarget;
    const formData = new FormData(form);
    const name = String(formData.get("name") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const service = selectedService || "Not specified";
    const description = String(formData.get("description") ?? "").trim();

    const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
    const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;
    const notificationTemplateId =
      process.env.NEXT_PUBLIC_EMAILJS_NOTIFICATION_TEMPLATE_ID;
    const confirmationTemplateId =
      process.env.NEXT_PUBLIC_EMAILJS_CONFIRMATION_TEMPLATE_ID;

    if (!serviceId || !publicKey || !notificationTemplateId || !confirmationTemplateId) {
      setFormMessage({
        type: "error",
        text: "The contact form is not configured correctly. Please try again later.",
      });
      setIsSubmitting(false);
      return;
    }

    const notificationParams = { name, email, service, description };
    const confirmationParams = { name, email, service };

    try {
      await emailjs.send(serviceId, notificationTemplateId, notificationParams, publicKey);
      form.reset();
      setSelectedService("");

      try {
        await emailjs.send(serviceId, confirmationTemplateId, confirmationParams, publicKey);
        setSuccessModalMessage(
          "Please check your inbox for the confirmation email. If you don't see it, check your spam or junk folder."
        );
      } catch (confirmationError) {
        console.error(
          "The enquiry was received, but the confirmation email failed:",
          confirmationError
        );
        setSuccessModalMessage(
          "Your enquiry has been received successfully, but we couldn't send the confirmation email. Please check your inbox and try your spam or junk folder. You don't need to submit the form again."
        );
      }

      setShowSuccessModal(true);
    } catch (error: unknown) {
      if (error && typeof error === "object") {
        const emailJSError = error as {
          status?: number;
          text?: string;
          message?: string;
        };
        console.error("Contact form submission failed:", {
          status: emailJSError.status,
          text: emailJSError.text,
          message: emailJSError.message,
          error,
        });
      } else {
        console.error("Contact form submission failed:", error);
      }
      setFormMessage({
        type: "error",
        text: "Your message couldn't be sent. Please try again in a moment.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  const fieldClass =
    "w-full border-b border-white/20 bg-transparent px-0 pb-1.5 text-[11px] font-medium tracking-[0.01em] text-[#F8F8F5] outline-none placeholder:text-white/30 transition-colors duration-300 focus:border-[#B82134] sm:pb-2 sm:text-[11px]";
  const labelClass =
    "mb-1 block text-[6px] font-semibold tracking-[0.13em] text-white/50 sm:mb-1.5 sm:text-[8px] sm:tracking-[0.18em]";

  return (
    <main className="h-[100dvh] overflow-hidden bg-[#151516] text-[#F8F8F5] lg:pl-[270px]">
      <MobileTileMenu />

      <section className="relative flex h-full flex-col overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-2 top-16 select-none text-[clamp(100px,20vw,250px)] font-light leading-none tracking-[-0.12em] text-white/[0.025]"
        >
          連絡
        </div>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-16 left-0 hidden h-px w-full bg-white/[0.06] sm:block"
        />

        <header className="relative z-10 flex shrink-0 items-center justify-between border-b border-white/10 px-3 py-2 sm:px-8 sm:py-5 lg:px-12">
          <div className="flex items-center gap-3">
            <span className="h-6 w-[3px] bg-[#B82134] sm:h-9" />
            <div>
              <p className="text-[7px] font-semibold tracking-[0.28em] text-white/40 sm:text-[8px]">
                CAZMIRECREATES / 006
              </p>
              <h1 className="mt-0.5 text-[19px] font-bold leading-none tracking-[-0.06em] text-[#F8F8F5] sm:mt-1 sm:text-3xl">
                CONTACT<span className="text-[#B82134]">.</span>
              </h1>
            </div>
          </div>
          <p className="hidden text-right text-[8px] leading-5 tracking-[0.18em] text-white/35 sm:block">
            INDEPENDENT CREATIVE<br />WORK · VIDEO · PHOTO · DESIGN
          </p>

        </header>

        <section className="relative z-10 min-h-0 flex-1 overflow-hidden px-3 py-2 sm:px-8 sm:py-6 lg:px-12 lg:py-8">
          <div className="mx-auto flex h-full min-h-0 max-w-6xl flex-col gap-0 lg:grid lg:grid-cols-[0.82fr_1.18fr] lg:items-center lg:gap-12">
            <motion.aside
              initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: shouldReduceMotion ? 0 : 0.5, ease }}
              className="shrink-0 pb-2 sm:pb-5 lg:pb-0"
            >
              <p className="mb-1 text-[6px] font-semibold tracking-[0.22em] text-[#E05A68] sm:mb-2 sm:text-[8px]">
                HAVE A PROJECT IN MIND?
              </p>
              <h2 className="max-w-xl text-[17px] font-semibold leading-[1.08] tracking-[-0.045em] text-[#F8F8F5] sm:text-3xl lg:text-5xl">
                Let&apos;s make something <span className="text-[#E05A68]">worth seeing.</span>
              </h2>
              <p className="mt-1.5 hidden max-w-xl text-[10px] leading-[1.5] text-white/55 sm:mt-3 sm:block sm:text-xs sm:leading-6">
                Tell me what you&apos;re planning. I&apos;ll get back to you to discuss the details.
              </p>

              <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 sm:mt-5 sm:gap-x-5">
                {[
                  { label: "FACEBOOK", href: "https://www.facebook.com/zykunoww" },
                  { label: "LINKEDIN", href: "https://www.linkedin.com/in/zyrell-cazmire-baculi/" },
                  { label: "BEHANCE", href: "https://www.behance.net/zyrellbaculi05" },
                  { label: "EMAIL", href: "mailto:zyrellcazmirebaculi@gmail.com" },
                ].map((social, index) => (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    target={social.label === "EMAIL" ? undefined : "_blank"}
                    rel={social.label === "EMAIL" ? undefined : "noreferrer"}
                    initial={shouldReduceMotion ? false : { opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: shouldReduceMotion ? 0 : 0.08 + index * 0.04, duration: shouldReduceMotion ? 0 : 0.3, ease }}
                    className="text-[6px] font-semibold tracking-[0.1em] text-white/45 transition-colors hover:text-[#E05A68] sm:text-[8px] sm:tracking-[0.13em]"
                  >
                    {social.label}<span className="ml-1 text-[#E05A68]">↗</span>
                  </motion.a>
                ))}
              </div>
            </motion.aside>

            <motion.div
              initial={shouldReduceMotion ? false : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: shouldReduceMotion ? 0 : 0.08, duration: shouldReduceMotion ? 0 : 0.5, ease }}
              className="min-h-0 flex-1 border border-white/10 bg-white/[0.025] p-3 sm:p-6 lg:flex-none lg:p-8"
            >
              <div className="mb-2 flex items-center justify-between border-b border-white/10 pb-2 sm:mb-5 sm:pb-4">
                <div>
                  <p className="text-[7px] font-semibold tracking-[0.18em] text-[#E05A68] sm:text-[9px] sm:tracking-[0.22em]">
                    PROJECT ENQUIRY
                  </p>
                  <p className="mt-0.5 text-[6px] text-white/35 sm:mt-1 sm:text-[9px]">
                    Fields marked * are required.
                  </p>
                </div>
                <span className="text-[6px] tracking-[0.12em] text-white/30 sm:text-[8px] sm:tracking-[0.16em]">LET&apos;S TALK / 01</span>
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col gap-2.5 sm:gap-5">
                <div className="grid grid-cols-2 gap-3 sm:gap-6">
                  <div>
                    <label htmlFor="name" className={labelClass}>FULL NAME <span className="text-[#E05A68]">*</span></label>
                    <input id="name" name="name" type="text" autoComplete="name" placeholder="Your name" required maxLength={120} className={fieldClass} />
                  </div>
                  <div>
                    <label htmlFor="email" className={labelClass}>EMAIL ADDRESS <span className="text-[#E05A68]">*</span></label>
                    <input id="email" name="email" type="email" autoComplete="email" placeholder="Your email" required maxLength={254} className={fieldClass} />
                  </div>
                </div>

                <div>
                  <p className={labelClass}>SERVICE <span className="font-normal text-white/30">(OPTIONAL)</span></p>
                  <div className="grid grid-cols-4 gap-1 sm:gap-2.5">
                    {services.map((service, index) => {
                      const isSelected = selectedService === service;
                      return (
                        <motion.button
                          key={service}
                          type="button"
                          aria-pressed={isSelected}
                          onClick={() => {
                            setSelectedService(isSelected ? "" : service);
                            setFormMessage(null);
                          }}
                          initial={shouldReduceMotion ? false : { opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: shouldReduceMotion ? 0 : 0.12 + index * 0.03, duration: shouldReduceMotion ? 0 : 0.3, ease }}
                          whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
                          style={{
                            fontSize: "8px",
                            lineHeight: 1.1,
                            letterSpacing: "0.01em",
                          }}
                          className={`relative flex min-h-[34px] min-w-0 items-center justify-center overflow-hidden border px-0.5 py-1 text-center font-semibold transition-all duration-200 sm:min-h-11 sm:px-2 sm:py-2 ${
                            isSelected
                              ? "border-[#B82134] bg-[#B82134]/15 text-[#F8F8F5]"
                              : "border-white/15 text-white/60 hover:border-[#B82134]/70 hover:text-white"
                          }`}
                        >
                          <span
                            style={{
                              display: "block",
                              width: "100%",
                              maxWidth: "100%",
                              fontSize: "8px",
                              lineHeight: 1.1,
                              whiteSpace: "normal",
                              overflowWrap: "anywhere",
                              textAlign: "center",
                            }}
                          >
                            {service}
                          </span>
                          <span className={`pointer-events-none absolute inset-x-2 bottom-0 h-[2px] transition-colors ${isSelected ? "bg-[#E05A68]" : "bg-transparent"}`} />
                        </motion.button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label htmlFor="description" className={labelClass}>PROJECT DETAILS <span className="text-[#E05A68]">*</span></label>
                  <textarea
                    id="description"
                    name="description"
                    rows={2}
                    placeholder="What do you need, and what is the goal?"
                    required
                    maxLength={5000}
                    className="min-h-[48px] w-full resize-none border border-white/15 bg-[#0F0F10]/60 p-2 text-[9px] leading-4 text-[#F8F8F5] outline-none placeholder:text-white/30 transition-colors duration-300 focus:border-[#B82134] sm:min-h-[100px] sm:p-3.5 sm:text-[11px] sm:leading-6"
                  />
                </div>

                {formMessage && (
                  <motion.p role="alert" aria-live="polite" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="text-[9px] leading-4 text-[#F0808A]">
                    {formMessage.text}
                  </motion.p>
                )}

                <div className="flex items-center justify-between gap-2 pt-0 sm:pt-1">
                  <p className="hidden max-w-[48%] text-[7px] leading-3 text-white/30 sm:block sm:text-[8px] sm:leading-4">
                    Your details are only used to respond to your enquiry.
                  </p>
                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    whileTap={isSubmitting || shouldReduceMotion ? undefined : { scale: 0.985 }}
                    className="group flex min-h-9 w-full min-w-0 items-center justify-between gap-4 bg-[#B82134] px-3 py-2 text-[7px] font-semibold tracking-[0.13em] text-white transition-all duration-300 hover:bg-[#d02b40] disabled:cursor-not-allowed disabled:opacity-60 sm:min-h-12 sm:w-auto sm:min-w-48 sm:px-5 sm:py-3 sm:text-[9px]"
                  >
                    <span>{isSubmitting ? "SENDING..." : "SEND ENQUIRY"}</span>
                    {!isSubmitting && <span className="text-base font-light leading-none transition-transform duration-300 group-hover:translate-x-1">↗</span>}
                  </motion.button>
                </div>
              </form>
            </motion.div>

            <footer className="mt-1 hidden shrink-0 items-center justify-between border-t border-white/10 pt-1 lg:hidden">
              <p className="text-[6px] tracking-[0.17em] text-white/30">VISUAL ARCHIVE © 2026</p>
              <p className="text-[6px] tracking-[0.14em] text-white/30">CAZMIRECREATES</p>
            </footer>
          </div>
        </section>
      </section>

      <AnimatePresence>
        {showSuccessModal && (
          <motion.div
            className="fixed inset-0 z-[150] flex items-center justify-center overflow-y-auto bg-black/70 px-5 py-8 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowSuccessModal(false)}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="success-modal-title"
              aria-describedby="success-modal-description"
              className="my-auto w-full max-w-md border border-white/10 bg-[#151516] p-6 text-center shadow-2xl sm:p-9"
              initial={{ opacity: 0, scale: 0.82, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 12 }}
              transition={{ type: "spring", stiffness: 260, damping: 22 }}
              onClick={(event) => event.stopPropagation()}
            >
              <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-[#B82134]/15 text-[#E05A68]">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-7 w-7" aria-hidden="true">
                  <path d="M5 12.5l4.5 4.5L19 7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <p className="mb-3 text-[10px] font-bold tracking-[0.3em] text-[#E05A68]">MESSAGE STATUS</p>
              <h2 id="success-modal-title" className="mb-4 text-2xl font-extrabold text-[#F8F8F5] sm:text-3xl">Enquiry Sent Successfully!</h2>
              <p id="success-modal-description" className="mb-6 text-sm leading-7 text-[#B7B7B7]">
                Thank you for reaching out to CazmireCreates. I&apos;ve received your enquiry and appreciate your interest in my creative services.
              </p>
              <div className="mb-7 border-l-2 border-[#B82134] bg-white/[0.04] p-4 text-left">
                <p className="mb-2 text-xs font-bold tracking-wider text-[#F8F8F5]"><span aria-hidden="true">✉ </span>CHECK YOUR INBOX</p>
                <p className="text-xs leading-6 text-[#B7B7B7]">{successModalMessage}</p>
              </div>
              <button type="button" onClick={() => setShowSuccessModal(false)} className="w-full bg-[#B82134] px-6 py-4 text-xs font-bold tracking-[0.2em] text-white transition-colors duration-300 hover:bg-[#961a2a] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#B82134]">
                GOT IT
              </button>
              <p className="mt-5 text-[10px] tracking-wider text-[#777777]">CAZMIRECREATES</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
