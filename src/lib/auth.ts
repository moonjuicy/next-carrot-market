import getSession from "@/lib/session";
import { redirect } from "next/navigation";

export async function handleLogin(userId: number) {
  const session = await getSession();
  session.id = userId;
  await session.save();
  redirect("/profile");
}
export async function handleLogout() {
  const session = await getSession();
  session.destroy();
  redirect("/");
}