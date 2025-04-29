"use client";

import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { useFormStatus } from "react-dom";

interface FormButtonProps {
  text: string;
}

export default function FormButton({  text }: FormButtonProps) {
  const {pending} = useFormStatus();

  useEffect(() => {
    console.log(pending);
  }, [pending]);
  
  const t = useTranslations("login");
  return (
    <button
      disabled={pending}
      className="primary-btn h-10 disabled:bg-neutral-400  disabled:text-neutral-300 disabled:cursor-not-allowed"
    >
      {pending ? t("loading") : text}
    </button>
  );
}