"use server";
import { PASSWORD_MIN_LENGTH, PASSWORD_REGEX } from "@/lib/constants";
import { getTranslations } from "next-intl/server";
import { z } from "zod";

export async function createAccount(prevState: any | null, formData: FormData) {
  const t = await getTranslations("createAccount.errors");

  const formSchema = z
    .object({
      username: z.string().min(5, t("username.min")).max(10, t("username.max")),
      email: z.string().email(t("email")),
      password: z
        .string()
        .min(PASSWORD_MIN_LENGTH, t("password"))
        .regex(PASSWORD_REGEX, t("passwordRegex")),
      confirmPassword: z.string().min(PASSWORD_MIN_LENGTH, t("password")),
    })
    .superRefine(({ password, confirmPassword }, ctx) => {
      if (password !== confirmPassword) {
        ctx.addIssue({
          code: "custom",
          message: t("confirmPassword"),
          path: ["confirmPassword"],
        });
      }
    });

  const data = {
    username: formData.get("username"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  };

  const result = formSchema.safeParse(data);
  if (!result.success) {
    return result.error.flatten();
  } else {
    console.log(result.data);
  }
}
