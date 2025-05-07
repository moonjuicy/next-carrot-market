"use server";
import { PASSWORD_MIN_LENGTH, PASSWORD_REGEX } from "@/lib/constants";
import db from "@/lib/db";
import getSession from "@/lib/session";
import bcrypt from "bcryptjs";
import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";
import { z } from "zod";

const checkPasswords = ({
  password,
  confirmPassword,
}: {
  password: string;
  confirmPassword: string;
}) => password === confirmPassword;

export async function createAccount(prevState: any | null, formData: FormData) {
  const t = await getTranslations("createAccount.errors");

  const formSchema = z
    .object({
      username: z
        .string()
        .min(5, t("username.min"))
        .max(10, t("username.max"))
        .toLowerCase()
        .trim(),
      email: z.string().email(t("email.format")).toLowerCase().trim(),
      password: z
        .string()
        .min(PASSWORD_MIN_LENGTH, t("password"))
        .regex(PASSWORD_REGEX, t("passwordRegex")),
      confirmPassword: z.string().min(PASSWORD_MIN_LENGTH, t("password"))
    })
    .superRefine(async ({ username }, ctx) => {
      const user = await db.user.findUnique({
        where: {
          username,
        },
        select: {
          id: true,
        },
      });
      if (user) {
        ctx.addIssue({
          code: "custom",
          message: t("username.exists"),
          path: ["username"],
          fatal: true,
        });
        return z.NEVER;
      }
    })
    .superRefine(async ({ email }, ctx) => {
      const user = await db.user.findUnique({
        where: {
          email,
        },
        select: {
          id: true,
        },
      });
      if (user) {
        ctx.addIssue({
          code: "custom",
          message: t("email.exists"),
          path: ["email"],
          fatal: true,
        });
        return z.NEVER;
      }
    })
    .refine(checkPasswords, {
      message: t("confirmPassword"),
      path: ["confirmPassword"],
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
    const session = await getSession();
    session.id = user.id;
    await session.save();
    redirect("/");
  }
}
