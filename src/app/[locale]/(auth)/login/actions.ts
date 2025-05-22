"use server";

import { handleLogin } from "@/lib/auth";
import { PASSWORD_MIN_LENGTH, PASSWORD_REGEX } from "@/lib/constants";
import db from "@/lib/db";
import bcrypt from "bcryptjs";
import { getTranslations } from "next-intl/server";
import { z } from "zod";

const checkEmailExists = async (email: string) => {
  const user = await db.user.findUnique({
    where: {
      email,
    },
    select: {
      id: true,
    },
  });
  return Boolean(user);
};
export async function logIn(prevState: any, formData: FormData) {
  const t = await getTranslations("login.errors");
  const data = {
    email: formData.get("email"),
    password: formData.get("password"),
  };

  const formSchema = z.object({
    email: z
      .string()
      .email()
      .toLowerCase()
      .refine(checkEmailExists, t("emailNotExists")),
    password: z
      .string({
        required_error: t("required"),
      })
      .min(PASSWORD_MIN_LENGTH)
      .regex(PASSWORD_REGEX, t("passwordRegex")),
  });

  const result = await formSchema.safeParseAsync(data);
  if (!result.success) {
    return result.error.flatten();
  } else {
    const user = await db.user.findUnique({
      where: {
        email: result.data.email,
      },
      select: {
        id: true,
        password: true,
      },
    });

    const isPasswordValid = await bcrypt.compare(
      result.data.password,
      user!.password ?? ""
    );
    if (isPasswordValid) {
      await handleLogin(user!.id);
    } else {
      return {
        fieldErrors: {
          email: [],
          password: [t("passwordNotValid")],
        },
      };
    }
  }
}
