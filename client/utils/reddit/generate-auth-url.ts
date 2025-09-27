export const generateRedditAuthUrl = () => {
  const randomState = Math.random().toString(36).substring(2, 15);

  const baseUrl = "https://www.reddit.com/api/v1/authorize";
  const params = new URLSearchParams({
    client_id: process.env.NEXT_PUBLIC_REDDIT_CLIENT_ID!,
    response_type: "code",
    state: randomState,
    redirect_uri: `${process.env.NEXT_PUBLIC_CLIENT_URL}/api/auth/reddit/callback`,
    duration: "permanent",
    scope: "identity privatemessages read history submit",
  });

  return `${baseUrl}?${params.toString()}`;
};
