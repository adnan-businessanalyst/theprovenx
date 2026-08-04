export type ProofStat = {
  value: string | null;
  label: string;
};

export const whoWeAre = {
  meta: {
    title: "Who We Are — TheProvenX",
    description:
      "TheProvenX is a Saudi-based answers community and digital solutions company. Real experience, useful answers, practical digital solutions.",
  },
  header: {
    brand: "TheProvenX",
    nav: [
      { href: "#our-direction", label: "Our direction" },
      { href: "#what-makes-it-proven", label: "What makes it proven" },
      { href: "#whos-behind-it", label: "Who's behind it" },
      { href: "#our-proof", label: "Our proof" },
    ],
  },
  hero: {
    eyebrow: "Who we are · Riyadh, Saudi Arabia",
    lines: [
      { text: "Real experience.", color: "ink" as const },
      { text: "Useful answers.", color: "orange" as const },
      { text: "Digital solutions.", color: "blue" as const },
    ],
    lead:
      "TheProvenX is a Saudi-based answers community and software company. We help people find guidance they can trust, and help businesses build a presence that actually gets found.",
    chips: [
      { n: "01", label: "Answers community" },
      { n: "02", label: "Software development" },
      // { n: "03", label: "SaaS solutions" },
    ],
    stampText: "PROVEN · CONFIRMED BY REAL EXPERIENCE · ",
  },
  why: {
    id: "why-we-started",
    eyebrow: "Why we started",
    title: "Good local knowledge exists. It's just hard to reach.",
    lead:
      "It lives in group chats, forum threads, and people you happen to know. Even when you get an answer, you can't always tell whether it came from someone who has actually been there.",
    bullets: [
      "Finding the right person to ask takes longer than it should.",
      "Advice arrives without the context that makes it usable.",
      "Businesses have presentable websites that nobody discovers.",
    ],
    notes: [
      "Ask my cousin, he did it last year",
      "A 2019 forum thread",
      "Screenshot in a WhatsApp group",
      "A reply under someone's post",
      "I think the rules changed?",
    ],
    gatherPill: "TheProvenX gathers it in one place",
  },
  whatWeDo: {
    id: "what-we-do",
    eyebrow: "What we do",
    title: "Three connected areas, one idea: build what people can actually use.",
    cards: [
      {
        kind: "answers" as const,
        tag: "Answers community",
        title: "Questions answered by people who were there",
        body: "Contributors explain what they did, where and when it happened, and the position they were in — so you can judge whether it applies to you.",
        list: [
          "Real situations, not general opinions",
          "Context attached to every answer",
          "The asker marks what actually helped",
          "The community confirms from experience",
        ],
      },
      {
        kind: "websites" as const,
        tag: "Websites & e-stores",
        title: "Sites built to be found, understood, and acted on",
        body: "We design for businesses in Saudi Arabia and the wider Middle East that need to explain what they do and reach the right audience.",
        list: [
          "SEO-friendly informative & corporate sites",
          "SEO-friendly e-commerce stores",
          "Responsive design and development",
          "Clear content structure and user journeys",
          "On-page SEO, performance, usability",
        ],
      },
      {
        kind: "saas" as const,
        tag: "SaaS solutions",
        title: "Focused software for repetitive work",
        body: "Each product is built around one clear use case — saving time and organising a process, without the extra weight.",
        products: [
          { name: "Attend X", blurb: "Attendance management" },
          { name: "Shortlist X", blurb: "AI-assisted candidate screening" },
          { name: "Store X", blurb: "E-commerce solution" },
          { name: "Parts X", blurb: "Parts discovery & management" },
        ],
      },
    ],
  },
  proven: {
    id: "what-makes-it-proven",
    eyebrow: "What makes it proven",
    title: "What makes an answer proven?",
    lead:
      "An answer here is more than an opinion. It earns the Proven mark when enough people confirm it matches their own experience.",
    steps: [
      {
        title: "Someone asks about a real situation",
        body: "Not a hypothetical, something they're actually trying to do.",
      },
      {
        title: "People who've been there answer",
        body: "With the context: where, when, and the position they were in.",
      },
      {
        title: "The asker marks what helped",
        body: "One answer is selected as the one that solved the problem.",
      },
      {
        title: "The community confirms it",
        body: "Members with relevant experience confirm it matched theirs.",
      },
    ],
    demo: {
      label: "Try it — demo",
      question:
        "Which documents did you need to renew a commercial registration for a small business in Riyadh?",
      answerer: "Answered by a shop owner",
      answerMeta: "Riyadh · renewed in March 2025 · sole proprietor",
      answerBody:
        "I needed the commercial register, national ID, municipality license, and a bank letter confirming the business account — submitted through the Ministry of Commerce portal.",
      helpful: "Marked helpful by the asker",
      confirm: "Confirm from experience",
      proven: "Proven",
      statusProven: "Proven by the community",
      moreToGo: (n: number) => `${n} more to go`,
    },
  },
  approach: {
    id: "how-we-approach",
    eyebrow: "How we approach digital work",
    title: "We start with the problem, not the page.",
    lead:
      "Website, e-store, or SaaS product — the first conversation is the same five questions.",
    questions: [
      "What is the business trying to achieve?",
      "Who are the users or customers?",
      "What information do they need?",
      "What should they be able to do?",
      "How does it stay simple and fast?",
    ],
  },
  founder: {
    id: "whos-behind-it",
    eyebrow: "Built around people",
    monogram: "AA",
    quote:
      "I created TheProvenX because useful knowledge was often hidden inside private conversations, while many businesses struggled to communicate clearly online.",
    name: "Adnan Akhonbay",
    role: "Founder",
    note: "TheProvenX is founder-led, supported by the people who ask questions, share what worked, use our products, and trust us with their digital projects.",
  },
  proof: {
    id: "our-proof",
    eyebrow: "Our proof",
    title: "These numbers are empty on purpose.",
    lead:
      "A company called TheProvenX shouldn't publish figures it can't back up. Here's exactly what we'll measure — and we'll fill it in when the numbers are real.",
    stats: [
      { value: null, label: "Questions answered" },
      { value: null, label: "Community confirmations" },
      { value: null, label: "Answers marked Proven" },
      { value: null, label: "Active contributors" },
      { value: null, label: "Websites & e-stores delivered" },
      { value: null, label: "SaaS products launched" },
      { value: null, label: "Businesses served" },
      { value: null, label: "Documented project outcomes" },
    ] satisfies ProofStat[],
    disclaimer:
      "Until the figures are verified, we don't publish estimates for customers served, success rates, or traffic increases. Client testimonials and project outcomes will appear here first.",
  },
  direction: {
    id: "our-direction",
    eyebrow: "Our direction",
    title: "Where we're heading.",
    items: [
      "A trusted source of experience-based answers",
      "A reliable website and e-commerce development partner",
      "A creator of focused SaaS products",
      "A digital business built for Saudi Arabia and the wider Middle East",
    ],
  },
  cta: {
    title: "Have a question, or a project?",
    body: "Ask the community and get answers from people who've been in your situation — or tell us what you're building and we'll start with the problem.",
    ask: { label: "Ask a question", href: "/ask" },
    project: { label: "Start a project", href: "/about" },
  },
  footer: {
    left: "TheProvenX — Riyadh, Saudi Arabia",
    right: "Real experience. Useful answers. Practical digital solutions.",
  },
} as const;

export type WhoWeAreContent = typeof whoWeAre;
