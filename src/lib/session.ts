import { getIronSession } from "iron-session";
import { cookies } from "next/headers";

interface Session {
  id?: number;
}

export default async function getSession() {
  return getIronSession<Session>(await cookies(), {
    cookieName: "delicious-karrot",
    password: process.env.COOKIE_PASSWORD!,
  });
}
