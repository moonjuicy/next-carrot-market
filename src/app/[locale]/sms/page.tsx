"use client";

import Button from "@/components/button";
import Input from "@/components/input";
import { useTranslations } from "next-intl";
import { useActionState } from "react";
import { smsLogIn } from "./actions";

const initialState = {
  token: false,
  error: undefined,
};

export default function SMSLogin() {
  const t = useTranslations("sms");
  const [state, dispatch] = useActionState(smsLogIn, initialState);
  return (
    <div className="flex flex-col gap-10 py-8 px-6">
      <div className="flex flex-col gap-2 *:font-medium">
        <h1 className="text-2xl">{t("title")}</h1>
        <h2 className="text-xl">{t("subtitle")}</h2>
      </div>
      <form action={dispatch} className="flex flex-col gap-3">
        {state.token ? (
          <Input
            name="token"
            type="number"
            placeholder={t("token")}
            required
            min={100000}
            max={999999}
          />
        ) : (
          <Input
            name="phone"
            type="text"
            placeholder={t("phone")}
            required
            errors={state.error?.formErrors}
          />
        )}
        <Button
          text={state.token ? t("verify") : t("send")}
          type="submit"
        />
      </form>
    </div>
  );
}