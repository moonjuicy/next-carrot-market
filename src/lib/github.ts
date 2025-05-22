interface GitHubAccessTokenResponse {
  error?: string;
  access_token?: string;
}

interface GitHubUserResponse {
  id: number;
  email: string;
  login: string;
  avatar_url: string;
}

interface GitHubUserEmailResponse {
  email: string;
  primary: boolean;
  verified: boolean;
}

export async function getGithubAccessToken(code: string): Promise<string> {
  const accessTokenParams = new URLSearchParams({
    client_id: process.env.GITHUB_CLIENT_ID!,
    client_secret: process.env.GITHUB_CLIENT_SECRET!,
    code,
  }).toString();

  const accessTokenURL = `https://github.com/login/oauth/access_token?${accessTokenParams}`;
  const accessTokenResponse = await fetch(accessTokenURL, {
    method: "POST",
    headers: {
      Accept: "application/json",
    },
  });

  const { error, access_token }: GitHubAccessTokenResponse =
    await accessTokenResponse.json();
  if (error) {
    throw new Error("Failed to get access token");
  }

  if (!access_token) {
    throw new Error("No access token received");
  }

  return access_token;
}

export async function getGithubUser(
  accessToken: string
): Promise<GitHubUserResponse> {
  const userResponse = await fetch("https://api.github.com/user", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!userResponse.ok) {
    throw new Error("Failed to get user data");
  }

  return userResponse.json();
}

export async function getGithubUserEmails(
  accessToken: string
): Promise<string> {
  const userEmailsResponse = await fetch("https://api.github.com/user/emails", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!userEmailsResponse.ok) {
    throw new Error("Failed to get user emails");
  }

  const emails: GitHubUserEmailResponse[] = await userEmailsResponse.json();
  const primaryEmail = emails.find(
    (email) => email.primary && email.verified
  )?.email;

  if (!primaryEmail) {
    throw new Error("No primary email found");
  }

  return primaryEmail;
}
