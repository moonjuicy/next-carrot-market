"use server";
import { PASSWORD_MIN_LENGTH, PASSWORD_REGEX } from "@/lib/constants";
import db from "@/lib/db";
import bcrypt from "bcryptjs";
import { getIronSession } from "iron-session";
import { getTranslations } from "next-intl/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";

const checkUniqueUsername = async (username: string) => {
  const user = await db.user.findUnique({
    where: {
      username,
    },
    select: {
      id: true,
    },
  });
  return !Boolean(user);
};

const checkUniqueEmail = async (email: string) => {
  const user = await db.user.findUnique({
    where: {
      email,
    },
    select: {
      id: true,
    },
  });
  return Boolean(user) === false;
};

export async function createAccount(prevState: any | null, formData: FormData) {
  const t = await getTranslations("createAccount.errors");

  const formSchema = z
    .object({
      username: z
        .string()
        .min(5, t("username.min"))
        .max(10, t("username.max"))
        .toLowerCase()
        .trim()
        .refine(checkUniqueUsername, t("username.exists")),
      email: z
        .string()
        .email(t("email.format"))
        .toLowerCase()
        .trim()
        .refine(checkUniqueEmail, t("email.exists")),
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

  const result = await formSchema.safeParseAsync(data);
  if (!result.success) {
    return result.error.flatten();
  } else {
    const hashedPassword = await bcrypt.hash(result.data.password, 12);
    const user = await db.user.create({
      data: {
        username: result.data.username,
        email: result.data.email,
        password: hashedPassword,
      },
      select: {
        id: true,
      },
    });
    const cookie = await getIronSession(await cookies(), {
      cookieName: "delicious-karrot",
      password: process.env.COOKIE_PASSWORD!,
    });
    //@ts-ignore
    cookie.id = user.id;
    await cookie.save();
    redirect("/");
  }
}
