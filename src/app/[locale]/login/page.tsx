"use client";

import FormButton from "@/components/button";
import FormInput from "@/components/input";
import SocialLogin from "@/components/social-login";
import { PASSWORD_MIN_LENGTH } from "@/lib/constants";
import { useTranslations } from "next-intl";
import { useActionState } from "react";
import { logIn } from "./actions";

export default function LogIn() {
  const t = useTranslations("login");
  const [state, dispatch] = useActionState(logIn, null);

  return (
    <div className="flex flex-col gap-10 py-8 px-6">
      <div className="flex flex-col gap-2 *:font-medium">
        <h1 className="text-2xl">{t("hello")}</h1>
        <h2 className="text-xl">{t("logInWithEmailAndPassword")}</h2>
      </div>
      <form action={dispatch} className="flex flex-col gap-3">
        <FormInput
          name="email"
          type="email"
          placeholder={t("email")}
          required
          errors={state?.fieldErrors.email}
        />
        <FormInput
          name="password"
          type="password"
          placeholder={t("password")}
          required
          minLength={PASSWORD_MIN_LENGTH}
          errors={state?.fieldErrors.password}
        />
        <FormButton text={t("login")} />
      </form>
      <SocialLogin />
    </div>
  );
}