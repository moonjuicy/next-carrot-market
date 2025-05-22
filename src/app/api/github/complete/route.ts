import { handleLogin } from "@/lib/auth";
import db from "@/lib/db";
import { getGithubAccessToken, getGithubUser, getGithubUserEmails } from "@/lib/github";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  if (!code) {
    return new Response(null, {
      status: 400,
    });
  }
  const accessToken = await getGithubAccessToken(code);
  const { id, login, avatar_url } = await getGithubUser(accessToken);
  const email = await getGithubUserEmails(accessToken);

  const user = await db.user.findUnique({
    where: {
      githubId: id.toString(),
    },
    select: {
      id: true,
    },
  });

  if (user) {
    await handleLogin(user.id);
  }

  const usernameExists = await db.user.findUnique({
    where: {
      username: login,
    },
  });

  const newUser = await db.user.create({
    data: {
      email,
      githubId: id.toString(),
      username: usernameExists ? `${login}-gh` : login,
      avatar: avatar_url,
    },
    select: {
      id: true,
    },
  });

  await handleLogin(newUser.id);
}
