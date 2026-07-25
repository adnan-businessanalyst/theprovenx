import type { Metadata } from "next";
import UserProfile from "@/views/user-profile";
import { fetchUserMeta } from "@/lib/api-server";
import { buildMetadata, jsonLdScript } from "@/lib/seo";
import { absoluteUrl } from "@/lib/site";

type Props = { params: Promise<{ username: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username } = await params;
  const user = await fetchUserMeta(username);
  if (!user) {
    return buildMetadata({
      title: `@${username}`,
      path: `/users/${username}`,
    });
  }

  const name = user.displayName || user.username;
  const description =
    user.bio?.trim() ||
    `${name} on The Proven X${typeof user.reputation === "number" ? ` · ${user.reputation} reputation` : ""}`;

  return buildMetadata({
    title: name,
    description,
    path: `/users/${user.username}`,
    ogType: "profile",
  });
}

export default async function UserPage({ params }: Props) {
  const { username } = await params;
  const user = await fetchUserMeta(username);

  const jsonLd = user
    ? {
        "@context": "https://schema.org",
        "@type": "Person",
        name: user.displayName || user.username,
        url: absoluteUrl(`/users/${user.username}`),
        description: user.bio || undefined,
      }
    : null;

  return (
    <>
      {jsonLd ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={jsonLdScript(jsonLd)}
        />
      ) : null}
      <UserProfile username={username} />
    </>
  );
}
