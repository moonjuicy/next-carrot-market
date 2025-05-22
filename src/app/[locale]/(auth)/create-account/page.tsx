"use client";

import Button from "@/components/button";
import Input from "@/components/input";
import SocialLogin from "@/components/social-login";
import { PASSWORD_MIN_LENGTH } from "@/lib/constants";
import { useTranslations } from "next-intl";
import { useActionState, useState } from "react";
import { createAccount } from "./actions";

export default function CreateAccount() {
  const t = useTranslations("createAccount");
  const [formValues, setFormValues] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [state, dispatch] = useActionState(
    async (prev: any, formData: FormData) => {
      const result = await createAccount(prev, formData);
      if (!result?.fieldErrors) {
        setFormValues({
          username: "",
          email: "",
          password: "",
          confirmPassword: "",
        });
      }
      return result;
    },
    null
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValues((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="flex flex-col gap-10 py-8 px-6">
      <div className="flex flex-col gap-2 *:font-medium">
        <h1 className="text-2xl">{t("title")}</h1>
        <h2 className="text-xl">{t("description")}</h2>
      </div>
      <form action={dispatch} className="flex flex-col gap-3">
        <Input
          name="username"
          type="text"
          placeholder={t("username")}
          required
          value={formValues.username}
          onChange={handleChange}
          errors={state?.fieldErrors.username}
          minLength={3}
          maxLength={10}
        />
        <Input
          name="email"
          type="email"
          placeholder={t("email")}
          required
          value={formValues.email}
          onChange={handleChange}
          errors={state?.fieldErrors.email}
        />
        <Input
          name="password"
          type="password"
          placeholder={t("password")}
          minLength={PASSWORD_MIN_LENGTH}
          required
          value={formValues.password}
          onChange={handleChange}
          errors={state?.fieldErrors.password}
        />
        <Input
          name="confirmPassword"
          type="password"
          placeholder={t("confirmPassword")}
          required
          minLength={PASSWORD_MIN_LENGTH}
          value={formValues.confirmPassword}
          onChange={handleChange}
          errors={state?.fieldErrors.confirmPassword}
        />
        <Button text={t("createAccount")} type="submit" />
      </form>
      <SocialLogin />
    </div>
  );
}
