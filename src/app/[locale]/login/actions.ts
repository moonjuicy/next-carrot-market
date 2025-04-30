"use server";

import { PASSWORD_MIN_LENGTH, PASSWORD_REGEX } from "@/lib/constants";
import { getTranslations } from "next-intl/server";
import { z } from "zod";

export async function logIn(prevState: any, formData: FormData) {
  const t = await getTranslations("login.errors");
  const data = {
    email: formData.get("email"),
    password: formData.get("password"),
  };

  const formSchema = z.object({
    email: z.string().email().toLowerCase(),
    password: z
      .string({
        required_error: t("required"),
      })
      .min(PASSWORD_MIN_LENGTH)
      .regex(PASSWORD_REGEX, t("passwordRegex")),
  });

  const result = formSchema.safeParse(data);
  if (!result.success) {
    console.log(result.error.flatten());
    return result.error.flatten();
  } else {
    console.log(result.data);
  }
}
