export const copy = {
  apply: {
    headline: "APPLICATIONS ARE OPEN.",
    sub: "No company required. No funding required. Just show us what you're building.",
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
    instagram: "https://www.instagram.com/isar.unfiltered/",
    linkedin: "https://www.linkedin.com/showcase/isar-unfiltered/",
    pages: [
      { label: "Intro", href: "/#intro" },
      { label: "Features", href: "/#features" },
      { label: "Why", href: "/#rtb" },
      { label: "Last time", href: "/#iu2025" },
      { label: "Partners", href: "/#partners" },
      { label: "Mentors", href: "/mentors" },
      { label: "Program", href: "/program" },
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
        body: "100 tickets. Four days in Munich. Substance over status, builders over talkers. No company required, no funding required. Just show us what you're actually working on.",
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
      { label: "Program", href: "/program" },
      { label: "Mentors", href: "/mentors" },
      { label: "Why", href: "/#rtb" },
      { label: "Last time", href: "/#iu2025" },
      { label: "Partners", href: "/#partners" },
      { label: "Apply", href: "/#apply" },
    ],
  },
  rev3: {
    intro: {
      a: {
        left: {
          headline: "Not your typical founder club.",
          body: "ISAR Unfiltered cuts through the BS around entrepreneurship and gets to what actually matters: solving real problems, building real things, putting them out into the world. Builders, researchers, creators, operators, students. If you're doing something real, you belong here. See what last year looked like.",
          cta: "IU2025",
          href: "#iu2025",
        },
        right: {
          headline: "IT'S ALL ABOUT BUILDING HERE",
          body: "You didn't start because it was easy. You started because something annoyed you, because you were curious, because you got tired of waiting for someone else to fix it.",
          cta: "Apply today",
        },
      },
      b: {
        left: {
          headline: "Built to be useful",
          body: "Four days of conversations, ideas and experiences designed to move things forward.",
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
        body: "Small circles. Real conversations. People you'll want to talk to again.",
        n: "1/3",
      },
      {
        title: ["The", "Conversations", "That Matter"] as const,
        body: "No founder theatre. Just honest stories from people who've done it.",
        n: "2/3",
      },
      {
        title: ["The Ideas", "That Move"] as const,
        body: "Less sitting and listening. More thinking, asking, and doing.",
        n: "3/3",
      },
    ],
  },
  programTease: {
    prefix: "4 DAYS OF",
    words: [
      "THINKING",
      "BUILDING",
      "CREATING",
      "SHIPPING",
      "DOING",
    ] as const,
    title: "PROGRAM",
  },
  programDaysEyebrow: "IU25 · LAST TIME, UNFILTERED",
  programDays: [
    {
      n: "1",
      date: "27/09",
      body: "Evening kickoff. Meet the cohort, get the briefing, pick up merch. Straight talk. No pitch zone.",
      slots: [
        {
          when: "Sun 27 Sep, evening",
          where: "A Munich space we're still locking in",
          format: "Intro to ISAR Unfiltered",
          length: "3h",
        },
      ],
    },
    {
      n: "2",
      date: "28/09",
      body: "First full day on the Bits grounds. Welcome from the Bits team, then micro circles with people already building.",
      slots: [
        {
          when: "Mon 28 Sep, midday",
          where: "Room on the Bits & Pretzels grounds",
          format: "Intro to Bits & Pretzels",
          length: "1–1.5h",
        },
        {
          when: "Mon 28 Sep, afternoon",
          where: "Across the Bits & Pretzels grounds",
          format: "Micro Circles, slot 1",
          length: "3h",
        },
      ],
    },
    {
      n: "3",
      date: "29/09",
      body: "Morning movement or coffee, afternoon circles, then an open evening where Munich founders and students actually meet.",
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
          format: "Micro Circles, slot 2",
          length: "3h",
        },
        {
          when: "Tue 29 Sep, evening",
          where: "A cool community & cultural hub in the heart of Munich",
          format: "Open night: founders meet students",
          length: "open evening",
        },
      ],
    },
    {
      n: "4",
      date: "30/09",
      body: "Last day at Bits & Pretzels. No separate ISAR block. You're in the room with the cohort. Use the day.",
      slots: [
        {
          when: "Wed 30 Sep",
          where: "Bits & Pretzels grounds",
          format: "Conference day with the cohort",
          length: "full day",
        },
      ],
    },
  ],
} as const;

export const applyHref =
  process.env.NEXT_PUBLIC_APPLY_URL || "#apply";

export const applyFormHref = "#apply-form";
export const mobileApplyFormHref = "#m-apply-form";
