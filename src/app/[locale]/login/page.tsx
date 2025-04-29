"use client";

import FormButton from "@/components/form-btn";
import FormInput from "@/components/form-input";
import SocialLogin from "@/components/social-login";
import { useTranslations } from "next-intl";
import { useFormState } from "react-dom";
import { handleForm } from "./actions";

export default function LogIn() {
  const t = useTranslations("login");
  const [state, action] = useFormState(handleForm, null);

  return (
    <div className="flex flex-col gap-10 py-8 px-6">
      <div className="flex flex-col gap-2 *:font-medium">
        <h1 className="text-2xl">{t("hello")}</h1>
        <h2 className="text-xl">{t("logInWithEmailAndPassword")}</h2>
      </div>
      <form action={action} className="flex flex-col gap-3">
        <FormInput
          name="email"
          type="email"
          placeholder={t("email")}
          required
          errors={[]}
        />
        <FormInput
          name="password"
          type="password"
          placeholder={t("password")}
          required
          errors={state?.errors ?? []}
        />
        <FormButton text={t("login")} />
      </form>
      <SocialLogin />
    </div>
  );
}