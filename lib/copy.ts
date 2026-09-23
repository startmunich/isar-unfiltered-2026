import { withUtm } from "@/lib/utm";

const LINKEDIN_BASE =
  "https://www.linkedin.com/showcase/isar-unfiltered/";
const INSTAGRAM_BASE = "https://www.instagram.com/isar.unfiltered/";

export const social = {
  linkedin: withUtm(LINKEDIN_BASE, "follow_linkedin"),
  instagram: withUtm(INSTAGRAM_BASE, "follow_instagram"),
  linkedinMenu: withUtm(LINKEDIN_BASE, "menu_follow_iu26"),
  linkedinHero: withUtm(LINKEDIN_BASE, "hero_follow_story"),
  instagramHero: withUtm(INSTAGRAM_BASE, "hero_instagram"),
  linkedinIntro: withUtm(LINKEDIN_BASE, "intro_follow_iu26"),
  linkedinRtb: withUtm(LINKEDIN_BASE, "rtb_follow_iu26"),
  instagramRtb: withUtm(INSTAGRAM_BASE, "rtb_instagram"),
  linkedinProgram: withUtm(LINKEDIN_BASE, "program_follow_iu26"),
  linkedinCloser: withUtm(LINKEDIN_BASE, "closer_follow_iu26"),
  instagramCloser: withUtm(INSTAGRAM_BASE, "closer_instagram"),
  linkedinHappening: withUtm(LINKEDIN_BASE, "happening_follow_iu26"),
  instagramHappening: withUtm(INSTAGRAM_BASE, "happening_instagram"),
  linkedinFollowStory: withUtm(LINKEDIN_BASE, "follow_story_linkedin"),
  instagramFollowStory: withUtm(INSTAGRAM_BASE, "follow_story_instagram"),
  luma5k: withUtm("https://luma.com/ujokrzce", "program_luma_5k"),
  lumaIsarAndCo: withUtm(
    "https://luma.com/start-9y22",
    "program_luma_isar_and_co",
  ),
} as const;

export type ProgramSlot = {
  when: string;
  where: string;
  format: string;
  length: string;
  href?: string;
  cta?: string;
};

export const copy = {
  happening: {
    headline: "IU26 IS HAPPENING.",
    sub: "100 young builders. Four days in Munich. Follow the story as we bring the room together.",
    followCta: "FOLLOW IU26",
    instagramCta: "INSTAGRAM",
  },
  followStory: {
    headline: "FOLLOW THE STORY.",
    body: "The applications are closed. The room is coming together. Now you can follow what happens next.",
    detail:
      "Follow ISAR Unfiltered on LinkedIn and Instagram for the people, conversations, moments and chaos that make IU26 what it is.",
    linkedinCta: "LINKEDIN",
    instagramCta: "INSTAGRAM",
  },
  apply: {
    // Kept only for the unlinked /apply page embed fallback.
    small: "Application form loading soon. Check back shortly.",
  },
  footer: {
    instagram: withUtm(INSTAGRAM_BASE, "footer_instagram"),
    linkedin: withUtm(LINKEDIN_BASE, "footer_linkedin"),
    wide: "https://www.wide-communication.com/?utm_source=isarunfiltered&utm_medium=website&utm_campaign=iu26&utm_content=footer_wide",
    pages: [
      { label: "Intro", href: "/#intro" },
      { label: "Features", href: "/#features" },
      { label: "Why", href: "/#rtb" },
      { label: "Last time", href: "/#iu2025" },
      { label: "Partners", href: "/#partners" },
      { label: "Mentors", href: "/mentors" },
      { label: "Program", href: "/#program" },
      { label: "Impressum", href: "/impressum" },
      { label: "Datenschutz", href: "/datenschutz" },
    ],
  },
  rev2: {
    eyebrow: "Bits & Pretzels Scholarship powered by",
    city: "Munich",
    dates: "27–30 September, 2026",
    followStory: "FOLLOW THE STORY",
    followIu26: "FOLLOW IU26",
    instagram: "INSTAGRAM",
    rtb: {
      dare: {
        kicker: "FOLLOW IU26",
        title: ["NO", "PITCH", "ZONE"] as const,
        body: "100 carefully chosen people. Four days in Munich. No polished pitch required. What matters is what you're actually working on, what problem you're chasing, and why you care enough to do something about it.",
      },
    },
    crew: {
      title: "THE PEOPLE BEHIND IU",
      body: [
        "A few slightly crazy people from START Munich decided to do this again. This is the core crew behind ISAR Unfiltered. Not everyone who helped make IU26 happen, because honestly, that list would be way too long.",
        "If you have a question, want to know who’s behind something, or just want to say hi, find the person you’re looking for and reach out.",
      ] as const,
      hint: "Drag me",
      linkedinCta: "LinkedIn",
      cards: [
        {
          name: "Fabi",
          role: "makes the whole thing happen",
          href: withUtm(
            "https://www.linkedin.com/in/fabian-rieth/",
            "crew_fabi",
          ),
        },
        {
          name: "Ali",
          role: "makes IU look like IU",
          href: withUtm(
            "https://www.linkedin.com/in/alihajihashemi/",
            "crew_ali",
          ),
        },
        {
          name: "Chris",
          role: "makes the event happen",
          href: withUtm(
            "https://www.linkedin.com/in/christopher-hassinger/",
            "crew_chris",
          ),
        },
      ],
    },
    lookback: {
      title: ["LAST TIME,", "UNFILTERED"] as const,
    },
    partners: {
      title: "PARTNERS",
    },
    closer: {
      instagram: "Instagram .",
      linkedin: "Linkedin",
      follow: "FOLLOW IU26",
    },
    menu: [
      { label: "Landing", href: "/#landing" },
      { label: "Intro", href: "/#intro" },
      { label: "Features", href: "/#features" },
      { label: "Program", href: "/#program" },
      { label: "Mentors", href: "/mentors" },
      { label: "Why", href: "/#rtb" },
      { label: "Last time", href: "/#iu2025" },
      { label: "Partners", href: "/#partners" },
      { label: "FOLLOW IU26", href: social.linkedinMenu },
    ],
  },
  rev3: {
    intro: {
      a: {
        left: {
          headline: "Not your typical founder club.",
          body: "ISAR Unfiltered cuts through the BS around entrepreneurship and gets to what actually matters: solving real problems, building real things, and putting them out into the world. If you're doing something real, whether you're a builder, researcher, creator, operator, or student, you belong here.",
          cta: "IU2025",
          href: "#iu2025",
        },
        right: {
          headline: "IT'S ALL ABOUT BUILDING HERE",
          body: "You didn't start because it was easy. You started because something annoyed you, because you were curious, or because you got tired of waiting for someone else to fix it.",
          cta: "FOLLOW IU26",
          href: social.linkedinIntro,
        },
      },
      b: {
        left: {
          headline: "Built to be useful",
          body: "Four days of conversations, ideas, and experiences designed to move things forward.",
          cta: "Program",
          href: "#program",
        },
        right: {
          headline: "People who've done it.",
          body: "Meet founders and builders who can share what actually happens beyond the pitch deck.",
          cta: "Mentors",
          href: "/mentors",
        },
      },
    },
    features: [
      {
        title: ["The 1:1", "That Matters"] as const,
        body: "Small groups where you can ask real questions, trade experience, and meet people you might actually stay in touch with.",
        n: "1/3",
      },
      {
        title: ["The Stories", "Behind It"] as const,
        body: "Hear how people got through the messy parts of building: the calls, failures, and lessons that never make the polished version.",
        n: "2/3",
      },
      {
        title: ["The Ideas", "That Move"] as const,
        body: "Sessions meant to push your thinking, open a new angle, and send you home with something useful.",
        n: "3/3",
      },
    ],
  },
  programTease: {
    prefix: "4 DAYS OF",
    words: ["QUESTIONING", "MEETING", "THINKING"] as const,
    title: "PROGRAM",
    blurb:
      "ISAR Unfiltered is four days in Munich for people who are already doing something about a problem they care about. We curate the room so you meet others who are doing the same.",
    cta: "FOLLOW IU26",
  },
  programDays: [
    {
      n: "0",
      date: "27/09",
      body: "The first chance to meet the room before the main days begin.",
      slots: [
        {
          when: "Sun 27 Sep, 18:00–21:00",
          where: "1KOMMA5° Showroom, Pacellistraße 2",
          format: "Pre-Event",
          length: "3h",
        },
      ] satisfies readonly ProgramSlot[],
    },
    {
      n: "1",
      date: "28/09",
      body: "Start the week together, get oriented, and dig into small-group conversations with people who have actually built.",
      slots: [
        {
          when: "Mon 28 Sep, 08:30–10:00",
          where: "Bits & Pretzels Bavaria Lounge",
          format: "Onsite Session",
          length: "1.5h",
        },
        {
          when: "Mon 28 Sep, 13:00–16:00",
          where: "Bits & Pretzels, Room 3 (ground floor)",
          format: "Microcircles",
          length: "3h",
        },
      ] satisfies readonly ProgramSlot[],
    },
    {
      n: "2",
      date: "29/09",
      body: "Start outside, keep the conversations going, then pull Munich's student initiatives into one room.",
      slots: [
        {
          when: "Tue 29 Sep, 09:00–11:00",
          where: "LAP Coffee, Fraunhoferstraße 41",
          format: "5K Run",
          length: "2h",
          href: social.luma5k,
          cta: "Register",
        },
        {
          when: "Tue 29 Sep, 13:00–16:00",
          where: "Bits & Pretzels, Room 3 (ground floor)",
          format: "Microcircles",
          length: "3h",
        },
        {
          when: "Tue 29 Sep, 18:00–22:00",
          where: "1KOMMA5° Showroom, Pacellistraße 2",
          format: "Isar & Co. — Student Initiative Gathering",
          length: "4h",
          href: social.lumaIsarAndCo,
          cta: "Register",
        },
      ] satisfies readonly ProgramSlot[],
    },
    {
      n: "3",
      date: "30/09",
      body: "The final day of IU26. More time together, more conversations, and the last chance to make the room count.",
      slots: [
        {
          when: "Wed 30 Sep, 10:00–12:00",
          where: "Oktoberfest tent",
          format: "Table Captains at Oktoberfest",
          length: "2h",
        },
      ] satisfies readonly ProgramSlot[],
    },
  ],
} as const;
