
"use client";

import { motion } from "framer-motion";
import emailjs from "@emailjs/browser";
import { useState } from "react";

const services = [
  "VIDEOGRAPHY",
  "PHOTOGRAPHY",
  "VIDEO EDITS",
  "GRAPHICS DESIGN",
];

const ease = [0.22, 1, 0.36, 1] as const;

type FormMessage = {
  type: "success" | "error";
  text: string;
};

export default function ContactPage() {
  const [selectedService, setSelectedService] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formMessage, setFormMessage] = useState<FormMessage | null>(null);

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

    if (
      !serviceId ||
      !publicKey ||
      !notificationTemplateId ||
      !confirmationTemplateId
    ) {
      setFormMessage({
        type: "error",
        text: "The contact form is not configured correctly. Please try again later.",
      });
      setIsSubmitting(false);
      return;
    }

    const notificationParams = {
      name,
      email,
      service,
      description,
    };

    const confirmationParams = {
      name,
      email,
      service,
    };

    try {
      // Send the enquiry notification to your inbox.
      await emailjs.send(
        serviceId,
        notificationTemplateId,
        notificationParams,
        publicKey
      );

      // The enquiry has been received successfully.
      form.reset();
      setSelectedService("");

      try {
        // Send the confirmation email to the visitor.
        await emailjs.send(
          serviceId,
          confirmationTemplateId,
          confirmationParams,
          publicKey
        );

        setFormMessage({
          type: "success",
          text: "Your message has been sent successfully!",
        });
      } catch (confirmationError) {
        console.error(
          "The enquiry was received, but the confirmation email failed:",
          confirmationError
        );

        setFormMessage({
          type: "success",
          text: "Your enquiry was received, but the confirmation email could not be sent.",
        });
      }
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
} finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="h-screen overflow-hidden bg-[#F8F8F5] lg:pl-[270px]">
      <section className="relative flex h-full flex-col overflow-hidden">
        {/* Japanese background element */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, x: 20 }}
          animate={{ opacity: 0.025, scale: 1, x: 0 }}
          transition={{ duration: 1.1, ease }}
          className="pointer-events-none absolute -right-16 top-20 z-0 text-[170px] font-light leading-none tracking-[-0.08em] text-[#151516]"
        >
          連絡
        </motion.div>

        {/* Fixed header */}
        <header className="relative z-10 shrink-0 px-8 pb-6 pt-8 md:px-12 lg:px-16">
          <div className="flex flex-col">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, ease }}
            >
              <p className="text-[9px] font-medium tracking-[0.3em] text-[#151516]/40">
                PORTFOLIO / 006
              </p>

              <h1 className="mt-3 text-4xl font-bold tracking-[-0.04em] text-[#B82134] md:text-5xl">
                CONTACT ME
              </h1>
            </motion.div>

            {/* Divider */}
            <motion.div
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{
                delay: 0.25,
                duration: 0.65,
                ease: [0.77, 0, 0.175, 1],
              }}
              style={{ transformOrigin: "left" }}
              className="mt-8 h-px w-full bg-[#151516]/10"
            />
          </div>
        </header>

        {/* Scrollable content */}
        <section className="custom-scrollbar relative z-10 min-h-0 flex-1 overflow-y-auto px-8 py-8 md:px-12 lg:px-16">
          <div className="max-w-3xl">
            {/* Intro */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.65, ease }}
              className="mb-8"
            >
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.42, duration: 0.5, ease }}
                className="max-w-2xl text-[11px] font-medium leading-5 tracking-[0.04em] text-[#151516]/70"
              >
                Have a project in mind? Tell me a little about what you need
                and I&apos;ll get back to you.
              </motion.p>

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5, ease }}
                className="mt-3 max-w-xl text-[9px] font-normal leading-5 tracking-[0.04em] text-[#151516]/50"
              >
                Whether it&apos;s video editing, photography, motion graphics,
                or graphic design, feel free to get in touch.
              </motion.p>
            </motion.div>

            {/* Contact form */}
            <form onSubmit={handleSubmit} className="space-y-7">
              {/* Name + Email */}
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55, duration: 0.6, ease }}
                className="grid gap-6 md:grid-cols-2"
              >
                {/* Full name */}
                <div>
                  <label
                    htmlFor="name"
                    className="mb-2 block text-[8px] font-semibold tracking-[0.18em] text-[#151516]/65"
                  >
                    FULL NAME
                  </label>

                  <input
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    placeholder="Your full name"
                    required
                    maxLength={120}
                    className="w-full border-b border-[#151516]/20 bg-transparent pb-2.5 text-[11px] font-medium tracking-[0.03em] text-[#151516] outline-none placeholder:text-[#151516]/40 transition-colors duration-300 focus:border-[#B82134]"
                  />
                </div>

                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-[8px] font-semibold tracking-[0.18em] text-[#151516]/65"
                  >
                    EMAIL ADDRESS
                  </label>

                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="Your email address"
                    required
                    maxLength={254}
                    className="w-full border-b border-[#151516]/20 bg-transparent pb-2.5 text-[11px] font-medium tracking-[0.03em] text-[#151516] outline-none placeholder:text-[#151516]/40 transition-colors duration-300 focus:border-[#B82134]"
                  />
                </div>
              </motion.div>

              {/* Services */}
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.65, duration: 0.6, ease }}
              >
                <p className="mb-3 block text-[8px] font-semibold tracking-[0.18em] text-[#151516]/65">
                  SERVICE
                </p>

                <div className="flex flex-wrap gap-2">
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
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          delay: 0.72 + index * 0.06,
                          duration: 0.45,
                          ease,
                        }}
                        whileTap={{ scale: 0.97 }}
                        className={`border px-4 py-2.5 text-[8px] font-semibold tracking-[0.14em] transition-all duration-300 ${
                          isSelected
                            ? "border-[#B82134] bg-[#B82134] text-[#F8F8F5] shadow-[0_0_18px_rgba(184,33,52,0.25)]"
                            : "border-[#151516]/20 bg-transparent text-[#151516]/60 hover:border-[#B82134]/50 hover:text-[#B82134]"
                        }`}
                      >
                        {service}
                      </motion.button>
                    );
                  })}
                </div>
              </motion.div>

              {/* Project description */}
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.88, duration: 0.6, ease }}
              >
                <label
                  htmlFor="description"
                  className="mb-2 block text-[8px] font-semibold tracking-[0.18em] text-[#151516]/65"
                >
                  PROJECT DESCRIPTION
                </label>

                <textarea
                  id="description"
                  name="description"
                  rows={4}
                  placeholder="Tell me about your project..."
                  required
                  maxLength={5000}
                  className="w-full resize-none border border-[#151516]/20 bg-transparent p-3.5 text-[11px] font-medium leading-5 tracking-[0.03em] text-[#151516] outline-none placeholder:text-[#151516]/40 transition-colors duration-300 focus:border-[#B82134]"
                />
              </motion.div>

              {/* Submission feedback */}
              {formMessage && (
                <motion.p
                  role="status"
                  aria-live="polite"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`text-[10px] leading-5 ${
                    formMessage.type === "success"
                      ? "text-green-700"
                      : "text-[#B82134]"
                  }`}
                >
                  {formMessage.text}
                </motion.p>
              )}

              {/* Send button */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.98, duration: 0.55, ease }}
              >
                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  whileTap={isSubmitting ? undefined : { scale: 0.98 }}
                  className="group flex items-center gap-4 bg-[#151516] px-6 py-3.5 text-[8px] font-semibold tracking-[0.18em] text-[#F8F8F5] transition-all duration-300 hover:bg-[#B82134] hover:shadow-[0_0_25px_rgba(184,33,52,0.18)] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <span>
                    {isSubmitting ? "SENDING..." : "SEND MESSAGE"}
                  </span>

                  {!isSubmitting && (
                    <span className="text-base font-light leading-none transition-transform duration-300 group-hover:translate-x-1">
                      →
                    </span>
                  )}
                </motion.button>
              </motion.div>
            </form>

            {/* Social links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.08, duration: 0.6, ease }}
              className="mt-10 border-t border-[#151516]/10 pb-8 pt-6"
            >
              <motion.p
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.15, duration: 0.45, ease }}
                className="mb-4 text-[8px] font-semibold tracking-[0.2em] text-[#151516]/40"
              >
                ELSEWHERE
              </motion.p>

              <div className="flex flex-wrap gap-x-8 gap-y-3">
                {[
                  {
                    label: "FACEBOOK",
                    href: "#",
                  },
                  {
                    label: "LINKEDIN",
                    href: "#",
                  },
                  {
                    label: "BEHANCE",
                    href: "#",
                  },
                  {
                    label: "EMAIL",
                    href: "mailto:zyrellcazmirebaculi@gmail.com",
                  },
                ].map((social, index) => (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: 1.2 + index * 0.07,
                      duration: 0.4,
                      ease,
                    }}
                    whileHover={{ y: -2 }}
                    className="text-[9px] font-medium tracking-[0.16em] text-[#151516]/55 transition-colors duration-300 hover:text-[#B82134]"
                  >
                    {social.label}
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      </section>
    </main>
  );
}
