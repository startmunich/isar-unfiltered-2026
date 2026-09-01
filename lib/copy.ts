export const copy = {
  apply: {
    headline: "APPLICATIONS ARE OPEN.",
    sub: "You don't need a company or funding. Just show us what you're building.",
    cta: "Apply",
    small: "Application form loading soon. Check back shortly.",
    start: "Start application",
    formGuide: "Scroll to read, Click to edit",
    formActivate: "Click to Edit",
    formActivateHint: "Click to edit. Scroll outside to move on.",
    formGuideMobile: "Scroll to read, Tap to edit",
    formActivateMobile: "Tap to Edit",
    formActivateHintMobile: "Tap to edit. Scroll outside to move on.",
    formActive: "You're editing. Type your answers here.",
    formActiveHint: "Scroll outside to move on.",
  },
  footer: {
    instagram:
      "https://www.instagram.com/isar.unfiltered/?utm_source=isarunfiltered&utm_medium=website&utm_campaign=iu26&utm_content=footer_instagram",
    linkedin:
      "https://www.linkedin.com/showcase/isar-unfiltered/?utm_source=isarunfiltered&utm_medium=website&utm_campaign=iu26&utm_content=footer_linkedin",
    wide: "https://www.wide-communication.com/?utm_source=isarunfiltered&utm_medium=website&utm_campaign=iu26&utm_content=footer_wide",
    pages: [
      { label: "Intro", href: "/#intro" },
      { label: "Features", href: "/#features" },
      { label: "Why", href: "/#rtb" },
      { label: "Last time", href: "/#iu2025" },
      { label: "Partners", href: "/#partners" },
      { label: "Mentors", href: "/mentors" },
      { label: "Program", href: "/#program" },
    ],
  },
  rev2: {
    eyebrow: "Bits & Pretzels Scholarship powered by",
    city: "Munich",
    dates: "27–30 September, 2026",
    applyToday: "Apply today",
    rtb: {
      dare: {
        kicker: "Apply today",
        title: ["NO", "PITCH", "ZONE"] as const,
        body: "We're bringing 100 carefully chosen people to Munich for four days. You don't need a company or a funding round. We care what you're actually working on, what problem you're chasing, and why you care enough to do something about it.",
      },
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
      apply: "Apply today",
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
      { label: "Apply", href: "/apply" },
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
          cta: "Apply today",
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
    words: [
      "THINKING",
      "MEETING",
      "QUESTIONING",
      "CONNECTING",
      "LISTENING",
      "EXCHANGING",
    ] as const,
    title: "PROGRAM",
    blurb:
      "ISAR Unfiltered is four days in Munich for people who are already doing something about a problem they care about. We curate the room so you meet others who are doing the same.",
  },
  programDays: [
    {
      n: "0",
      date: "27/09",
      body: "Pre-event evening. The point is simple: get to know other builders in your generation before the days kick off. Merch, briefing, no pitch zone.",
      slots: [
        {
          when: "Sun 27 Sep, evening",
          where: "TBA",
          format: "Intro to ISAR Unfiltered",
          length: "3h",
        },
      ],
    },
    {
      n: "1",
      date: "28/09",
      body: "First full day on the Bits grounds. Connect to the ecosystem and get inspired by the people building now.",
      slots: [
        {
          when: "Mon 28 Sep, midday",
          where: "Room on the Bits & Pretzels grounds",
          format:
            "Inspiration Sessions and Unfiltered Conversations with some of the biggest Speakers",
          length: "1–1.5h",
        },
        {
          when: "Mon 28 Sep, afternoon",
          where: "Across the Bits & Pretzels grounds",
          format:
            "Micro Circles, slot 1, with the best founders and operators onsite",
          length: "3h",
        },
      ],
    },
    {
      n: "2",
      date: "29/09",
      body: "Keep plugging into the ecosystem. More circles, more inspiration, then the Munich student scene gathers for real.",
      slots: [
        {
          when: "Tue 29 Sep, morning",
          where: "Isar riverside or a café in the city",
          format: "Running Club & Coffee",
          length: "1h",
        },
        {
          when: "Tue 29 Sep, afternoon",
          where: "Across the Bits & Pretzels grounds",
          format:
            "Micro Circles, slot 2, with the best founders and operators onsite",
          length: "3h",
        },
        {
          when: "Tue 29 Sep, evening",
          where: "A cool community & cultural hub in the heart of Munich",
          format: "Munich student ecosystem gathering",
          length: "open evening",
        },
      ],
    },
    {
      n: "3",
      date: "30/09",
      body: "Oktoberfest day with the 100 people in the room. Table Captains keep the tables moving. Show up, stay curious, make it count.",
      slots: [
        {
          when: "Wed 30 Sep, 10:00–12:00",
          where: "Oktoberfest tent",
          format: "Table Captains at Oktoberfest",
          length: "2h",
        },
      ],
    },
  ],
} as const;

/** Dedicated apply form route. Ignores legacy hash env values like #apply. */
function resolveApplyPageHref(): string {
  const env = process.env.NEXT_PUBLIC_APPLY_URL?.trim();
  if (!env || env.startsWith("#")) return "/apply";
  return env;
}

export const applyPageHref = resolveApplyPageHref();

/** @deprecated Use applyPageHref */
export const applyHref = applyPageHref;
