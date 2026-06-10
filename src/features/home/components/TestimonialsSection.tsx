"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useState } from "react";

const testimonials = [
  {
    name: "Sarah M.",
    text: "Elara transformed our living room into a space we never want to leave. Exceptional taste and attention to detail.",
  },
  {
    name: "Ahmed K.",
    text: "Professional, creative, and truly understood our vision. The entire process was seamless from start to finish.",
  },
  {
    name: "Layla H.",
    text: "The furniture selection and layout advice were spot on. Our home feels completely renewed.",
  },
];

export function TestimonialsSection() {
  const t = useTranslations("home");
  const [active, setActive] = useState(0);

  return (
    <section className="bg-card py-20 lg:py-24">
      <div className="mx-auto max-w-3xl px-6 text-center lg:px-8">
        <h2 className="mb-12 font-serif text-3xl">{t("testimonials")}</h2>

        <motion.div
          key={active}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          <p className="text-lg leading-relaxed text-muted italic">
            &ldquo;{testimonials[active].text}&rdquo;
          </p>
          <p className="mt-6 font-medium">{testimonials[active].name}</p>
        </motion.div>

        <div className="mt-8 flex justify-center gap-2">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`h-2 w-2 rounded-full transition-colors ${
                i === active ? "bg-accent" : "bg-border"
              }`}
              aria-label={`Testimonial ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
