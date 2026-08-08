import type { Metadata } from "next";
import QuestionDetail from "@/views/question-detail";
import { fetchQuestionMeta, fetchQuestionDetail } from "@/lib/api-server";
import { buildMetadata, jsonLdScript } from "@/lib/seo";
import { absoluteUrl } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const question = await fetchQuestionMeta(slug);
  if (!question) {
    return buildMetadata({
      title: "Question",
      path: `/questions/${slug}`,
    });
  }

  const description = question.body.replace(/\s+/g, " ").slice(0, 160);
  return buildMetadata({
    title: question.title,
    description,
    path: `/questions/${question.slug}`,
    ogType: "article",
  });
}

export default async function QuestionPage({ params }: Props) {
  const { slug } = await params;
  const detail = await fetchQuestionDetail(slug);
  const question = detail?.question;
  const answers = detail?.answers ?? [];
  const accepted = answers.find((a) => a.isAccepted);
  
  const jsonLd = question
    ? {
        "@context": "https://schema.org",
        "@type": "QAPage",
        mainEntity: {
          "@type": "Question",
          name: question.title,
          text: question.body.slice(0, 5000),
          url: absoluteUrl(`/questions/${question.slug}`),
          dateCreated: question.createdAt,
          dateModified: question.updatedAt,
          answerCount: answers.length,
          upvoteCount: question.score,
          author: {
            "@type": "Person",
            name: question.author.displayName || question.author.username,
            url: absoluteUrl(`/users/${question.author.username}`),
          },
          ...(accepted
            ? {
                acceptedAnswer: {
                  "@type": "Answer",
                  text: accepted.body.slice(0, 5000),
                  dateCreated: accepted.createdAt,
                  upvoteCount: accepted.score,
                  author: {
                    "@type": "Person",
                    name: accepted.author.displayName || accepted.author.username,
                  },
                },
              }
            : {}),
          suggestedAnswer: answers
            .filter((a) => !a.isAccepted)
            .map((a) => ({
              "@type": "Answer",
              text: a.body.slice(0, 5000),
              dateCreated: a.createdAt,
              upvoteCount: a.score,
              author: {
                "@type": "Person",
                name: a.author.displayName || a.author.username,
              },
            })),
        },
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
      <QuestionDetail slug={slug} />
    </>
  );
}
