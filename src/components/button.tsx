"use client";

import { useTranslations } from "next-intl";
import { useFormStatus } from "react-dom";

interface ButtonProps {
  text: string;
  type?: "submit" | "button";
}

export default function Button({ text, type = "button" }: ButtonProps) {
  const t = useTranslations("common");
  const { pending } = useFormStatus();
  return (
    <button
      disabled={pending}
      className="primary-btn h-10 disabled:bg-neutral-400  disabled:text-neutral-300 disabled:cursor-not-allowed"
      type={type}
    >
      {pending ? t("loading") : text}
    </button>
  );
}