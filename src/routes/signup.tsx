import { createFileRoute } from "@tanstack/react-router";
import { AuthForm } from "@/components/AuthForm";

export const Route = createFileRoute("/signup")({
  head: () => ({
    meta: [
      { title: "Sign up — Snake" },
      { name: "description", content: "Create a snake account and climb the leaderboard." },
      { property: "og:title", content: "Sign up — Snake" },
      { property: "og:description", content: "Create a snake account and climb the leaderboard." },
    ],
  }),
  component: () => <AuthForm kind="signup" />,
});
