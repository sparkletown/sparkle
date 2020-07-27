const midnight_event = {
  start_minute: 240,
  duration_minutes: 30,
  host: "Co-reality Collective",
  name: "Temporary Closure. Head to THE PRESENT for Midnight Ritual.",
  text:
    "Room will be closed for 30 minutes to bring everyone together. Tonight's Midnight Ritual is at The Present.",
  interactivity: "high",
};

const closing_ceremony_event = {
  start_minute: 480,
  duration_minutes: 30,
  host: "Co-reality Collective",
  name: "Closing Ceremony",
  text:
    "Come to the TEMPORAL MENTAL TIME-MACHINE and enjoy the closing ceremony with us as we celebrate the night's festivities!",
  interactivity: "high",
};

const time_machine_events = [
  {
    start_minute: 0,
    duration_minutes: 240,
    host: "Co-reality Collective",
    name: "PlayTIME with the Time Nannies",
    text:
      "Welcome, relax and breathe. Your inner child is waiting and ready to help you travel through our time vortex. It’s TIME to play. It’s play TIME!",
    interactivity: "high",
  },
  midnight_event,
  {
    start_minute: 480,
    duration_minutes: 180,
    host: "Co-reality Collective",
    name: "BathTIME - CLOSING CEREMONY",
    text:
      "Wash off all that temporal time dust and close the time vortex with our closing BathTIME ritual!",
    interactivity: "high",
  },
  closing_ceremony_event,
];

const ddp_events = [
  midnight_event,
  {
    start_minute: 300,
    duration_minutes: 60,
    host: "Distributed Dance Party",
    name: "PARTY TIME",
    text: "DDP Disco Barge Art Car Begins roaming thru Zoom Realms.",
    interactivity: "high",
  },
  {
    start_minute: 360,
    duration_minutes: 60,
    host: "Distributed Dance Party",
    name: "PARTY TIME",
    text: "DDP Disco Barge Art Car continues roaming thru Zoom Realms.",
    interactivity: "high",
  },
  {
    start_minute: 420,
    duration_minutes: 60,
    host: "Distributed Dance Party",
    name: "PARTY TIME",
    text: "DDP Disco Barge Art Car continues roaming thru Zoom Realms.",
    interactivity: "high",
  },
  {
    start_minute: 480,
    duration_minutes: 180,
    host: "Distributed Dance Party",
    name: "DDP AFTERPARTY",
    text:
      "The 100% Open family-friendly hybrid virtual/terrestrial Party commences! 3+ hours of mirth and merriment!",
    interactivity: "high",
  },
  closing_ceremony_event,
];

const utopiyeah_events = [
  {
    start_minute: 30,
    duration_minutes: 90,
    host: "Co-reality Collective",
    name: "The Rave at the End of Universe",
    text: "DJ Frogmoose",
    interactivity: "high",
  },
  {
    start_minute: 120,
    duration_minutes: 60,
    host: "Co-reality Collective",
    name: "XNN Systems - Love Letters From Your Death Bed",
    text:
      "A comedic view to your lust for life. Lie down, it’s almost over. Let’s discover the moments you loved and missed out on.",
    interactivity: "high",
  },
  {
    start_minute: 180,
    duration_minutes: 60,
    host: "Co-reality Collective",
    name: "The Rave at the End of Universe",
    text: "DJ Behindthebeats - Electro, IDM, Rare Groove, Techno",
    interactivity: "high",
  },
  midnight_event,
  {
    start_minute: 270,
    duration_minutes: 30,
    host: "Co-reality Collective",
    name: "The Hollow Men",
    text:
      "Witness end of the world poetry recited by a computer with some end of the world visuals by Outer Lumen.",
    interactivity: "high",
  },
  {
    start_minute: 300,
    duration_minutes: 60,
    host: "Co-reality Collective",
    name: "The Rave at the End of the Universe",
    text: "DJ AnoneMau5",
    interactivity: "high",
  },
  {
    start_minute: 360,
    duration_minutes: 60,
    host: "Co-reality Collective",
    name: "The Rave at the End of the Universe",
    text: "DJ AnoneMau5 and DJ Mycho Pan Cocoa",
    interactivity: "high",
  },
  {
    start_minute: 420,
    duration_minutes: 60,
    host: "Co-reality Collective",
    name: "The Rave at the End of the Universe",
    text: "DJ Mycho Pan Cocoa",
    interactivity: "high",
  },
  closing_ceremony_event,
];

const woodstock_events = [
  {
    start_minute: 30,
    duration_minutes: 60,
    host: "Co-reality Collective",
    name: "Love Sensation Workshop",
    text:
      "Power to the People. A place to connect, move and tap into your sense of self.",
    interactivity: "high",
  },
  {
    start_minute: 90,
    duration_minutes: 150,
    host: "Co-reality Collective",
    name: "Welcome to the 1969 Woodstock Music and Art Fair!",
    text:
      "Experience the sun and rain, mud and mayhem. Jam to music from the summer of love & hear stories behind the magic. And even experience ~*tripping*~ without having to commit to the full 12 hours.",
    interactivity: "high",
  },
  midnight_event,
  {
    start_minute: 270,
    duration_minutes: 90,
    host: "Co-reality Collective",
    name: "Woodstock ‘99",
    text:
      "Travel back to the 1999 Woodstock Music Festival and rock out to 90’s nostalgic favorites.",
    interactivity: "high",
  },
  {
    start_minute: 360,
    duration_minutes: 60,
    host: "Co-reality Collective",
    name: "Stories from an Original Woodstock Attendee",
    text:
      "Our special guest, veteran musician and producer David Snider, will share his experiences at the original Woodstock and play live for us!",
    interactivity: "high",
  },
  {
    start_minute: 420,
    duration_minutes: 60,
    host: "Co-reality Collective",
    name: "Trippy Sound Bath with The Sonic Shamanic",
    text:
      "A powerful Sound Medicine Journey that incorporates drums and shakers, Native American flute, harmonium, saxophone, Tibetan metal singing bowls, mineral-based crystal bowls, and vocals.",
    interactivity: "high",
  },
  closing_ceremony_event,
];

const remember_the_times_events = [
  {
    start_minute: 30,
    duration_minutes: 90,
    host: "Co-reality Collective",
    name: "Throwback Camp Fire",
    text: "Sing-a-long to nostalgic ‘80s and ‘90s favorites.",
    interactivity: "high",
  },
  {
    start_minute: 120,
    duration_minutes: 60,
    host: "Co-reality Collective",
    name: "‘90s AIM Chat Room Party!",
    text:
      "You’ve got buddies! Find that old AOL CD with 800 free hours, logon and join #metaforyou for a ‘90s style hangout full of nostalgic sounds and chat room fun.",
    interactivity: "high",
  },
  {
    start_minute: 180,
    duration_minutes: 60,
    host: "Co-reality Collective",
    name: "‘80s Dance Party",
    text: "Shake your booty to DJ Alza’s award winning ‘80s mix.",
    interactivity: "high",
  },
  midnight_event,
  {
    start_minute: 270,
    duration_minutes: 90,
    host: "Co-reality Collective",
    name: "Superhero HQ of Future Past",
    text:
      "Create your own superhero powers based on your unique personality traits and time travel to avoid super villains!",
    interactivity: "high",
  },
  {
    start_minute: 360,
    duration_minutes: 60,
    host: "Co-reality Collective",
    name: "‘90s VJ Dance Party",
    text: "Witness VJing by Outer Lumen while listening to ‘90s music.",
    interactivity: "high",
  },
  {
    start_minute: 420,
    duration_minutes: 60,
    host: "Co-reality Collective",
    name: "DDP Crash",
    text:
      "The Roaming DDP Disco Barge crash lands! Get ready for more dancing.",
    interactivity: "high",
  },
  closing_ceremony_event,
];

const antimatter_chute_events = [
  {
    start_minute: 0,
    duration_minutes: 60,
    host: "Co-reality Collective",
    name: "Be Your Own Party",
    text: "Enjoy this un-hosted space and make whatever you want out of it!",
    interactivity: "high",
  },
  {
    start_minute: 60,
    duration_minutes: 60,
    host: "Co-reality Collective",
    name: "Endless People",
    text: "Who will you meet?",
    interactivity: "high",
  },
  {
    start_minute: 120,
    duration_minutes: 60,
    host: "Co-reality Collective",
    name: "Endless Possibilities",
    text: "What will you create?",
    interactivity: "high",
  },
  {
    start_minute: 180,
    duration_minutes: 60,
    host: "Co-reality Collective",
    name: "The Party is Rockin’ Now!",
    text: "The best party is always in the toilets.",
    interactivity: "high",
  },
  midnight_event,
  {
    start_minute: 270,
    duration_minutes: 90,
    host: "Co-reality Collective",
    name: "Stay Away From The Toilet",
    text: "People are starting to disappear. ",
    interactivity: "high",
  },
  {
    start_minute: 360,
    duration_minutes: 60,
    host: "Co-reality Collective",
    name: "Add Bleach",
    text: "This is so much worse.",
    interactivity: "high",
  },
  {
    start_minute: 420,
    duration_minutes: 60,
    host: "Co-reality Collective",
    name: "Singing in Utter Despair",
    text: "Is that all there is?",
    interactivity: "high",
  },
  closing_ceremony_event,
];

const infinite_theatre_events = [
  {
    start_minute: 60,
    duration_minutes: 60,
    host: "Co-reality Collective",
    name: "WTF is the Online Burn, SparkleVerse, & Co-Reality Collective?",
    text:
      "Learn about how to get involved in virtual experience design and production with CRC Elder, Nat Fong.",
    interactivity: "high",
  },
  {
    start_minute: 120,
    duration_minutes: 120,
    host: "Co-reality Collective",
    name: "Past Co-Reality Cabarets",
    text: "Sit at a table with friends and chat.",
    interactivity: "low",
  },
  midnight_event,
  {
    start_minute: 270,
    duration_minutes: 210,
    host: "Co-reality Collective",
    name: "Past Co-Reality Cabarets",
    text: "Sit at a table with friends and chat.",
    interactivity: "low",
  },
  closing_ceremony_event,
];

const cat_pirates_events = [
  {
    start_minute: 60,
    duration_minutes: 60,
    host: "Co-reality Collective",
    name: "Onboarding",
    text:
      "To become part of the crew, you’ll have to agree to the pirate code of conduct and swear a secret oath.",
    interactivity: "high",
  },
  {
    start_minute: 120,
    duration_minutes: 60,
    host: "Co-reality Collective",
    name: "Erotic Archetypes Tarot",
    text:
      "The cards will foretell your sexy fate in an intimate tarot reading imbued with gypsy magic.",
    interactivity: "high",
  },
  {
    start_minute: 180,
    duration_minutes: 60,
    host: "Co-reality Collective",
    name: "Pirate Tales from the High Seas",
    text:
      "Learn pirates shanties and tall tales from the seas, as well as what it means to be “more pirate” in a pre- or post-apocalyptic age.",
    interactivity: "high",
  },
  midnight_event,
  closing_ceremony_event,
];

const time_heals_events = [
  {
    start_minute: 30,
    duration_minutes: 90,
    host: "Co-reality Collective",
    name: "Empathy Cafe",
    text:
      "Empathy (Dance) Cafe is inviting you to have a cup of tea and take a moment to check in.  There may be space for you to bring something that is on your mind, and experiment with language that supports being heard.",
    interactivity: "high",
  },
  {
    start_minute: 120,
    duration_minutes: 120,
    host: "Co-reality Collective",
    name: "Consensuality: The Art of Playing Consensually",
    text: "A workshop exploring the senses and consensual play.",
    interactivity: "high",
  },
  midnight_event,
  {
    start_minute: 270,
    duration_minutes: 30,
    host: "Co-reality Collective",
    name: "Ascentral Alignment",
    text: "Healing meditations to harmonise you and your family tree.",
    interactivity: "high",
  },
  {
    start_minute: 300,
    duration_minutes: 60,
    host: "Co-reality Collective",
    name: "Timeline Trust Disco",
    text:
      "A place where the stories that made you who you are can be heard, heeded and transformed through music and dance.",
    interactivity: "high",
  },
  {
    start_minute: 360,
    duration_minutes: 120,
    host: "Co-reality Collective",
    name: "Designing the Future",
    text: "Incentive System Design with Raman and Thomas.",
    interactivity: "high",
  },
  closing_ceremony_event,
];

const the_present_events = [
  {
    start_minute: 240,
    duration_minutes: 30,
    host: "Co-reality Collective",
    name: "Midnight Ritual",
    text:
      "Co-reality Collective presents our traditional midnight ritual! We look forward to bringing everyone at the party together.",
    interactivity: "high",
  },
  {
    start_minute: 300,
    duration_minutes: 10,
    host: "Diamond Reign",
    name: "Opening Ceremony",
    text: "Opening Ceremony w Diamond Reign",
    interactivity: "low",
  },
  {
    start_minute: 310,
    duration_minutes: 20,
    host: "Co-reality Collective",
    name:
      "Warm up Games w Diamond Reign + Kitty; My Soul’s Expression on Hammock by Cory Catt; Movement for Collective Liberation w Julia Muse",
    text: "",
    interactivity: "low",
  },
  {
    start_minute: 330,
    duration_minutes: 30,
    host: "Co-reality Collective",
    name:
      "Serving You Out of This World Acts by Alien Gale Force; Prayerformance - Remember our Wild w Amanda; My Soul’s Expression Act II on Lyra w Cory Catt; Move w/ a Queen Burlesque by Diamond Reign",
    text: "",
    interactivity: "low",
  },
  {
    start_minute: 360,
    duration_minutes: 30,
    host: "Co-reality Collective",
    name:
      "Fever by Sultry Jazz Fox Rebel Rose; Breakdancing Acrobatic Show w JWolf, EarthQUAKE, Sho N Tell; Striking Again by The Bandit of Burlesque Elektra Gray",
    text: "",
    interactivity: "low",
  },
  {
    start_minute: 390,
    duration_minutes: 30,
    host: "Co-reality Collective",
    name:
      "Improvised Hip Hop Piece by Movement Maverick JVill; The Cat’s Meow by Feline D’Vine; Serving You Out of This World Acts II by Alien Gale Force; People’s Choice Show w JWolf, EarthQUAKE, Sho N Tell",
    text: "",
    interactivity: "low",
  },
  {
    start_minute: 420,
    duration_minutes: 30,
    host: "Co-reality Collective",
    name:
      "Purrrr-fect Talent Show w Diamond Reign + Kitty; Spoken Movement w Komorebi; Whipping + Hooping w Amanda",
    text: "",
    interactivity: "low",
  },
  {
    start_minute: 450,
    duration_minutes: 30,
    host: "Co-reality Collective",
    name:
      "Tease w/ a Dash of Sass & Pinch of Class by Elektra Gray; Meowing for More by Burlesque Kitten Feline D’Vine; Serving You Out of This World Acts III by Alien Gale Force; Improvised Hip Hop Piece by Crowd Favorite JVill",
    text: "",
    interactivity: "low",
  },
  {
    start_minute: 480,
    duration_minutes: 30,
    host: "Co-reality Collective",
    name:
      "Heaping Spoonful of Raw Expert-tease w Cybil Unrest; Exotic Art w Cory Catt",
    text: "",
    interactivity: "low",
  },
  {
    start_minute: 510,
    duration_minutes: 20,
    host: "Co-reality Collective",
    name: "Closing Ceremony",
    text: "Freestyles & People’s Choice",
    interactivity: "low",
  },
  closing_ceremony_event,
];

module.exports = {
  template: "partymap",
  name: "The Time Warp Party",
  description: {
    text: "",
  },
  start_utc_seconds: 1595703600,
  duration_hours: 8,
  entrance_hosted_hours: 3,
  party_name: "The Time Warp Party",
  unhosted_entry_video_url: "https://www.youtube.com/embed/tHo4WXDikug",
  map_url: "/maps/TimeWarp.jpg",
  map_viewbox: "0 0 2000 1000",
  password: "partytime",
  host: {
    icon: "/room-images/CRC_Time_Party_210720_1532_Title.png",
    name: "Co-reality Collective",
    url: "https://co-reality.co/",
  },
  config: {
    theme: {
      primaryColor: "yellow",
    },
    landingPageConfig: {
      subtitle: "Co-reality Collective Presents: An Online Adventure",
      coverImageUrl: "/maps/TimeWarp.jpg",
      presentation: [],
      checkList: [
        "11 beautiful and awesome spaces",
        "Party your way through lockdown with amazing people",
        "Hurry up and get in here!",
        "Enter the secret password from your email to gain entry!",
      ],
      videoIframeUrl: "https://www.youtube.com/embed/tHo4WXDikug",
    },
  },
  profile_questions: [
    {
      name: "drinkOfChoice",
      text: "What is your drink of choice?",
    },
    {
      name: "favouriteRecord",
      text: "What's your favourite record",
    },
    {
      name: "doYouDance",
      text: "Do you dance?",
    },
  ],
  code_of_conduct_questions: [
    {
      name: "seekFun",
      text: "I will seek out the fun",
    },
    {
      name: "addFun",
      text: "I will add to the fun",
    },
    {
      name: "wearCostume",
      text: "I will wear a costume where possible",
    },
    {
      name: "respectParty",
      text:
        "I will respect my fellow party-goers’ feelings and boundaries by obeying the Consent Policy",
      link: "https://co-reality.co/consent-policy/",
    },
    {
      name: "partyReal",
      text: "I understand these parties are real",
    },
  ],
  description: {
    program_url:
      "https://docs.google.com/presentation/d/1BljnW14jp6BjJKe1-2e9Mvva1yDDUPJwYb1tNUaav1g/",
    text:
      "Welcome to the party. We recommend starting at the Temporal Mental Time Machine.",
  },
  rooms: [
    {
      title: "Temporal-Mental Time Machine",
      subtitle: "",
      url: "/time-machine-preview",
      external_url:
        "https://us02web.zoom.us/j/85184898681?pwd=TS93S2x3UUNka2dwdXR0T1Jsdlk5QT09",
      on_map: true,
      on_list: true,
      path:
        "M 410.927 233.815 C 403.939 252.45 410.791 284.786 415.61 304.062 C 423.635 336.162 422.669 369.764 430.831 402.409 C 435.972 422.971 432.508 438.876 444.88 457.436 C 452.698 469.163 451.737 481.52 464.784 490.218 C 471.941 494.989 489.082 499.584 497.566 499.584 C 501.668 499.584 508.574 495.839 512.786 497.242 C 521.257 500.066 533.566 495.853 542.056 493.73 C 568.451 487.131 596.491 484.219 624.011 477.339 C 652.768 470.15 681.941 485.687 710.649 478.51 C 733.917 472.693 746.606 460.115 763.335 443.386 C 768.677 438.044 778.738 433.653 782.067 426.995 C 786.548 418.033 783.801 404.098 780.897 395.384 C 769.788 362.058 758.284 327.549 746.944 293.525 C 741.498 277.185 748.869 255.981 743.431 239.669 C 739.048 226.52 742.983 211.395 738.748 198.691 C 732.47 179.856 728.427 165.061 716.503 147.177 C 691.156 109.157 623.86 147.686 590.058 130.786 C 571.514 121.513 568.827 108.891 558.447 93.32 C 547.99 77.634 524.473 68.138 509.274 60.538 C 489.531 50.667 453.199 71.999 444.88 88.637 C 436.223 105.951 429.22 125.081 422.635 144.835 C 417.738 159.525 429.019 177.199 423.806 192.837 C 417.543 211.626 410.927 224.988 410.927 245.523",
      attendance_x: "29%",
      attendance_y: "34%",
      image: "CRC_Time_Party_210720_1532_Time.png",
      events: time_machine_events,
    },
    {
      title: "The Infinite Theatre",
      subtitle: "",
      url: "/infinite-theatre-preview",
      external_url: "/venue/infinite-theatre/event/timewarp",
      on_map: true,
      on_list: true,
      path:
        "M 65.545 512.463 C 65.545 494.502 67.182 465.869 74.911 450.411 C 80.371 439.491 92.674 432.648 100.668 424.654 C 124.802 400.52 148.655 396.562 174.428 383.676 C 184.192 378.794 198.141 386.018 207.21 386.018 C 233.174 386.018 260.195 386.753 284.482 398.896 C 294.058 403.684 308.122 401.312 318.435 404.75 C 357.101 417.639 395.672 440.408 417.952 473.827 C 424.469 483.602 436.34 489.759 443.709 499.584 C 465.511 528.653 477.655 561.666 468.296 599.101 C 463.941 616.52 436.56 626.196 426.148 640.079 C 409.551 662.207 387.084 687.31 360.583 693.935 C 340.98 698.836 319.946 693.85 300.873 698.618 C 292.2 700.786 284.924 705.825 276.287 707.984 C 264.041 711.046 249.92 705.643 237.651 705.643 C 177.086 705.643 127.256 691.254 84.277 648.274 C 76.918 640.914 72.289 627.53 69.057 617.834 C 61.5 595.164 71.399 587.504 71.399 562.807 C 71.399 542.965 70.842 546.415 71.399 537.049",
      attendance_x: "11%",
      attendance_y: "38%",
      image: "CRC_Time_Party_210720_1532_Theatre.png",
      events: infinite_theatre_events,
    },
    {
      title: "Time Heals",
      subtitle: "",
      url: "/time-heals-preview",
      external_url:
        "https://us02web.zoom.us/j/83428535894?pwd=YUtlUzV2YmR0MEFGZWo0ZXcvVWNwdz09",
      on_map: true,
      on_list: true,
      path:
        "M 1088.814 183.471 C 1081.381 131.443 1102.086 59.627 1155.549 41.805 C 1165.192 38.591 1183.543 31.801 1194.185 37.122 C 1202.11 41.085 1216.867 34.999 1223.454 38.293 C 1235.844 44.488 1250.97 40.83 1264.432 45.318 C 1283.1 51.54 1303.166 56.668 1321.801 62.879 C 1350.035 72.29 1375.771 92.577 1406.097 102.686 C 1444.757 115.573 1471.961 135.667 1506.785 158.884 C 1512.276 162.545 1522.504 164.066 1526.689 168.25 C 1532.481 174.043 1537.622 181.393 1544.251 185.812 C 1560.089 196.372 1577.424 206.107 1591.082 219.765 C 1611.182 239.864 1599.985 290.241 1585.228 309.916 C 1577.377 320.383 1567.372 328.651 1559.471 339.186 C 1550.867 350.657 1547.712 372.591 1536.055 381.334 C 1526.366 388.601 1499.982 393.683 1488.053 390.7 C 1457.627 383.094 1440.307 352.421 1410.781 345.04 C 1383.422 338.2 1357.413 328.031 1331.167 319.282 C 1310.881 312.52 1287.69 312.933 1269.115 300.55 C 1252.256 289.31 1230.528 275.975 1211.746 271.28 C 1196.985 267.59 1179.642 263.885 1166.086 253.718 C 1141.586 235.344 1128.797 211.746 1108.717 191.666 C 1103.733 186.682 1090.597 183.191 1084.13 179.958",
      attendance_x: "70%",
      attendance_y: "10%",
      image: "CRC_Time_Party_210720_1532_Heals.png",
      events: time_heals_events,
    },
    {
      title: "World of Woodstock",
      subtitle: "",
      url: "/world-of-woodstock-preview",
      external_url:
        "https://us02web.zoom.us/j/86939460845?pwd=ODQxbFg0QlQrc2JyWUkzaWNITjRkQT09",
      on_map: true,
      on_list: true,
      path:
        "M 30.421 130.452 C 27.967 116.907 33.312 108.472 37.446 97.066 C 48.296 67.124 69.803 26.834 107.693 15.216 C 117.568 12.188 127.587 19.168 136.963 16.293 C 143.686 14.231 160.495 10.944 167.403 13.061 C 182.715 17.756 197.118 28.635 213.064 33.524 C 222.992 36.568 244.121 39.306 255.212 36.755 C 262.164 35.157 273.6 31.265 280.97 33.524 C 292.667 37.111 304.108 36.153 316.093 38.909 C 328.753 41.82 343.836 54.845 354.729 61.526 C 364.911 67.77 380.206 70.831 387.512 80.911 C 405.393 105.583 400.099 131.803 409.757 158.454 C 420.282 187.498 390.842 221.42 381.658 246.765 C 376.134 262.008 374.588 279.861 365.267 294.152 C 357.287 306.386 345.651 315.833 337.168 327.539 C 331.021 336.02 326.251 345.032 317.264 351.232 C 275.101 380.321 212.081 356.22 167.403 348.001 C 140.138 342.985 108.088 346.028 84.277 335.077 C 75.911 331.229 74.682 314.848 72.569 307.076 C 68.179 290.922 59.428 275.24 52.666 259.689 C 42.541 236.404 14.03 226.443 14.03 199.379",
      attendance_x: "9%",
      attendance_y: "0%",
      image: "CRC_Time_Party_210720_1532_WOW.png",
      events: woodstock_events,
    },
    {
      title: "Remember the Times",
      subtitle: "",
      url: "/remember-the-times-preview",
      external_url:
        "https://us02web.zoom.us/j/84006809629?pwd=ako2aExlZUIvRXVESTUzK1NxQUdCdz09",
      on_map: true,
      on_list: true,
      path:
        "M 718.845 606.126 C 699.097 573.213 755.057 563.615 775.043 556.953 C 784.756 553.715 798.156 558.123 808.996 558.123 C 837.309 558.123 867.495 556.159 894.463 565.148 C 909.35 570.11 927.331 561.678 941.295 568.661 C 958.006 577.017 963.074 563.745 979.931 572.173 C 1008.188 586.301 1008.03 652.48 1008.03 679.885 C 1008.03 700.927 1019.737 715.829 1019.737 737.254 C 1019.737 747.388 1017.787 762.624 1022.079 771.207 C 1026.389 779.826 1020.084 794.146 1024.421 802.818 C 1027.068 808.113 1023.008 816.385 1025.591 821.551 C 1028.982 828.331 1033.119 852.157 1029.104 860.187 C 1020.441 877.513 994.151 879.25 983.443 895.311 C 979.281 901.554 977.394 916.125 971.735 919.897 C 954.467 931.41 932.569 920.747 915.537 929.263 C 891.659 941.203 837.184 955.831 810.166 946.825 C 803.573 944.628 789.171 945.734 784.409 940.971 C 771.72 928.282 780.177 897.563 764.506 887.115 C 744.985 874.101 725.096 879.714 714.162 857.845 C 708.243 846.007 708.962 813.736 712.991 801.648 C 715.405 794.406 710.762 785.031 714.162 778.232 C 720.108 766.338 712.991 738.942 712.991 725.546 C 712.991 713.794 715.231 702.435 718.845 691.593 C 721.852 682.57 717.441 668.418 715.332 659.982 C 711.161 643.297 714.162 620.332 714.162 603.784",
      attendance_x: "43%",
      attendance_y: "76%",
      image: "CRC_Time_Party_210720_1532_TV.png",
      events: remember_the_times_events,
    },
    {
      title: "Utopiyeah",
      subtitle: "",
      url: "/utopiyeah-preview",
      external_url:
        "https://us02web.zoom.us/j/85266325089?pwd=d21yNmpsUWFYVVd3T1NKMHkvaFhaQT09",
      on_map: true,
      on_list: true,
      path:
        "M 1580.545 176.446 C 1580.545 159.146 1593.607 145.639 1600.448 131.956 C 1604.438 123.977 1609.705 100.771 1621.523 96.832 C 1627.08 94.98 1633.615 94.884 1639.085 92.149 C 1648.21 87.586 1650.898 76.876 1660.159 72.246 C 1687.303 58.673 1744.419 55.452 1773.725 65.221 C 1787.928 69.955 1804.968 65.098 1819.386 69.904 C 1840.202 76.843 1858.629 87.481 1877.925 100.345 C 1891.332 109.282 1900.244 126.138 1914.22 133.127 C 1928.291 140.163 1948.877 146.244 1957.539 163.567 C 1965.202 178.894 1962.543 197.31 1968.076 213.911 C 1978.015 243.732 1940.722 278.194 1950.514 307.574 C 1957.326 328.012 1966.652 346.873 1976.272 366.114 C 1981.037 375.645 1990.952 392.322 1986.809 404.75 C 1984.448 411.832 1983.514 430.289 1978.613 435.19 C 1962.336 451.468 1947.715 464.222 1925.928 471.485 C 1914.499 475.294 1901.594 470.836 1889.633 473.826 C 1879.752 476.297 1870 481.151 1860.364 484.363 C 1847.569 488.628 1830.826 481.331 1818.215 485.534 C 1804.371 490.148 1777.677 494.52 1762.017 491.388 C 1719.828 482.95 1682.336 466.165 1647.28 439.873 C 1613.529 414.56 1617.639 381.019 1608.644 345.04 C 1605.262 331.511 1595.669 314.886 1600.448 300.55 C 1607.482 279.452 1616.839 263 1616.839 239.669 C 1616.839 210.055 1575.862 198.262 1575.862 165.909",
      attendance_x: "90%",
      attendance_y: "8%",
      image: "CRC_Time_Party_210720_1532_Utopia.png",
      events: utopiyeah_events,
    },
    {
      title: "Antimatter Evacuation Chute",
      subtitle: "",
      url: "/antimatter-evacuation-chute-preview",
      external_url:
        "https://us02web.zoom.us/j/89783018445?pwd=WEoxOVNhZW94YVRWR20wN21HbVBldz09",
      on_map: true,
      on_list: true,
      path:
        "M 1514.981 579.197 C 1519.141 558.398 1527.569 530.314 1543.08 514.804 C 1559.965 497.919 1583.028 489.561 1602.79 479.68 C 1612.057 475.047 1635.643 459.41 1647.28 463.289 C 1665.412 469.333 1683.654 478.549 1699.965 486.705 C 1726.073 499.758 1755.9 501.75 1780.75 518.316 C 1793.183 526.605 1795.345 549.304 1805.336 559.294 C 1827.549 581.505 1860.922 593.194 1876.755 624.858 C 1881.786 634.92 1889.791 664.348 1884.95 674.031 C 1882.695 678.542 1887.798 687.068 1886.121 690.422 C 1879.133 704.4 1877.591 728.391 1884.95 743.108 C 1887.765 748.735 1884.471 757.369 1887.292 763.011 C 1889.86 768.148 1898.625 771.347 1903.683 774.719 C 1923.148 787.696 1943.248 794.851 1962.222 807.501 C 1970.78 813.206 1971.396 824.678 1975.101 832.088 C 1983.25 848.385 1970.76 882.232 1966.905 897.652 C 1961.723 918.382 1962.335 944.315 1950.514 962.045 C 1935.619 984.388 1914.309 969.926 1894.316 974.924 C 1844.837 987.292 1786.723 999.541 1735.089 986.632 C 1721.925 983.341 1700.534 972.547 1694.111 959.704 C 1686.879 945.24 1690.924 923.215 1685.916 908.189 C 1682.533 898.038 1690.636 878.957 1682.404 870.724 C 1671.237 859.556 1652.911 858.793 1642.597 848.479 C 1625.96 831.842 1616.265 819.827 1608.644 796.964 C 1598.6 766.834 1607.161 731.089 1581.716 705.642 C 1563.916 687.842 1531.326 686.822 1518.493 661.152 C 1512.986 650.136 1506.1 621.061 1510.298 608.467 C 1513.092 600.083 1520.569 586.863 1516.152 578.026",
      attendance_x: "92%",
      attendance_y: "72%",
      image: "CRC_Time_Party_210720_1532_Toilet.png",
      events: antimatter_chute_events,
    },
    {
      title: "The Present",
      subtitle: "A Purr-fect Time Capsule Cabaret",
      url: "/the-present-preview",
      external_url:
        "https://us02web.zoom.us/j/84838710539?pwd=R0hZVGhOZ2FJUGQvRlhSeEhsTGlZUT09",
      on_map: true,
      on_list: true,
      path:
        "M 1003.346 525.341 C 1008.639 493.583 1031.555 460.838 1053.69 438.703 C 1061.427 430.965 1066.923 413.054 1070.081 403.579 C 1073.199 394.226 1085.991 385.327 1092.326 378.992 C 1102.111 369.207 1106.967 354.401 1119.254 346.21 C 1157.886 320.456 1209.254 302.45 1256.237 318.111 C 1271.32 323.139 1286.983 331.873 1301.897 336.844 C 1323.88 344.171 1352.535 334.21 1374.486 341.527 C 1401.89 350.662 1438.278 377.793 1451.758 404.75 C 1455.225 411.682 1452.822 421.99 1455.271 429.336 C 1461.295 447.411 1469.391 463.501 1475.174 480.851 C 1477.763 488.617 1488.358 494.187 1492.736 500.754 C 1500.247 512.021 1505.573 541.855 1500.931 555.781 C 1487.256 596.808 1460.893 636.327 1436.538 672.86 C 1427.352 686.64 1422.485 708.377 1407.268 718.521 C 1378.158 737.928 1341.304 744.479 1311.263 759.499 C 1296.303 766.979 1270.317 750.132 1255.066 750.132 C 1232.373 750.132 1208.208 758.336 1187.16 765.353 C 1183.678 766.513 1171.36 768.575 1167.256 766.523 C 1151.767 758.778 1130.472 760.506 1113.4 754.816 C 1081.659 744.236 1032.088 711.082 1020.908 677.544 C 1011.77 650.132 1027.849 618.754 1018.566 590.905 C 1010.373 566.325 987.517 547.635 1001.004 520.658",
      attendance_x: "60%",
      attendance_y: "50%",
      image: "CRC_Time_Party_210720_1532_Present.png",
      events: the_present_events,
    },
    {
      title: "Roaming DDP Disco Doge",
      subtitle: "",
      url: "/ddp-disco-barge-preview",
      external_url: "https://bit.ly/virtualddp",
      on_map: true,
      on_list: true,
      path:
        "M 1060.715 888.286 C 1054.804 858.729 1071.818 858.45 1088.814 841.454 C 1111.621 818.647 1133.92 793.637 1166.086 782.915 C 1181.13 777.9 1216.446 774.335 1231.65 779.403 C 1239.339 781.965 1258.38 781.844 1265.603 778.232 C 1278.611 771.728 1293.996 768.718 1307.752 761.841 C 1314.364 758.535 1324.732 762.717 1331.167 759.499 C 1344.404 752.881 1359.381 754.387 1372.145 750.133 C 1382.741 746.601 1408.428 726.721 1418.977 723.204 C 1431.855 718.912 1461.563 698.082 1474.004 693.935 C 1512.975 680.945 1524.903 704.721 1548.934 740.767 C 1558.778 755.532 1575.117 779.936 1579.375 796.964 C 1581.513 805.516 1581.304 816.044 1585.229 823.893 C 1587.616 828.667 1581.488 847.766 1579.375 851.992 C 1573.575 863.59 1577.518 877.021 1570.008 888.286 C 1557.21 907.485 1538.52 916.262 1523.177 931.605 C 1515.262 939.521 1508.984 954.726 1499.761 960.875 C 1491.981 966.062 1479.776 965.975 1470.491 969.07 C 1456.62 973.694 1444.089 980.647 1429.514 984.291 C 1402.728 990.987 1373.701 984.682 1346.388 990.145 C 1295.808 1000.26 1243.569 1002.783 1193.014 990.145 C 1167.985 983.887 1138.989 998.59 1114.571 992.486 C 1099.623 988.749 1084.676 986.216 1071.252 977.266 C 1059.407 969.368 1050.598 920.227 1057.203 907.019 C 1059.316 902.792 1055.584 895.759 1060.715 890.628",
      attendance_x: "70%",
      attendance_y: "87%",
      image: "CRC_Time_Party_220720_2256_DDP.png",
      events: ddp_events,
    },
    {
      title: "The Centuripede",
      subtitle: "",
      url: "/centuripede-preview",
      external_url:
        "https://us02web.zoom.us/j/84860121978?pwd=Tk0rSE5IQkRmTGdJcUdEVTBFd2l2QT09",
      on_map: false,
      on_list: false,
      path: "",
      image: "CRC_Time_Party_Map_Centuripede.png",
      events: [],
    },
    {
      title: "Pre-Pocalyptic Pussy Cat Pirates",
      subtitle: "",
      url: "/pussy-cat-pirates-preview",
      external_url:
        "https://us02web.zoom.us/j/86538512364?pwd=S25Jbmhmei95ZEsvdUE4V0w2cnRCUT09",
      on_map: true,
      on_list: true,
      path:
        "M 772.701 323.965 C 762.711 307.315 758.674 275.895 764.505 258.401 C 766.096 253.629 765.235 243.621 769.188 239.669 C 780.488 228.369 788.747 217.287 793.775 202.203 C 800.1 183.229 787.59 159.876 793.775 141.322 C 804.164 110.153 812.634 60.886 852.314 47.659 C 873.088 40.734 892.809 47.659 914.366 47.659 C 927.999 47.659 956.417 42.927 968.222 48.83 C 1007.861 68.648 1004.643 128.825 1016.225 163.567 C 1018.333 169.889 1014.118 178.319 1016.225 184.641 C 1019.194 193.548 1014.132 206.674 1019.737 215.082 C 1046.096 254.62 1087.962 296.075 1070.081 349.723 C 1064.334 366.964 1022.855 374.115 1008.029 377.822 C 988.06 382.814 958.462 396.163 936.611 390.7 C 919.327 386.379 899.257 385.664 882.755 380.163 C 871.749 376.494 861.404 370.142 849.973 367.284 C 817.579 359.186 771.53 369.022 771.53 321.624",
      attendance_x: "40%",
      attendance_y: "10%",
      image: "CRC_Time_Party_210720_1532_Cat.png",
      events: cat_pirates_events,
    },
    {
      title: "Support The Artists",
      subtitle: "",
      external_url: "https://paypal.me/corealitycollective",
      on_map: true,
      on_list: false,
      path:
        "M 463.613 627.2 C 463.613 547.996 559.081 531.797 616.986 551.099 C 640.976 559.096 653.853 580.743 668.501 600.272 C 687.936 626.185 721.057 647.493 708.308 685.74 C 700.124 710.288 684.841 722.085 667.33 739.596 C 658.054 748.872 649.631 766.592 638.06 772.378 C 625.94 778.438 611.048 774.72 598.253 774.72 C 570.583 774.72 546.134 775.153 520.981 768.866 C 510.056 766.135 501.221 756.035 490.541 752.475 C 482.902 749.928 470.852 749.177 464.783 743.108 C 453.839 732.163 458.479 718.342 454.246 705.643 C 446.296 681.793 444.021 644.449 463.613 624.859",
      image: "",
      events: [],
    },
    {
      title: "Co-reality Collective Website",
      subtitle: "",
      external_url: "https://co-reality.co/",
      on_map: true,
      on_list: false,
      path:
        "M 46.361 876.659 C 18.806 849.103 6.161 790.414 35.824 760.751 C 41.226 755.349 44.231 743.508 52.215 740.847 C 73.125 733.877 103.889 759.527 124.804 752.555 C 132.112 750.119 145.754 744.621 154.074 746.701 C 160.643 748.343 170.399 752.577 177.49 750.213 C 237.804 730.11 312.559 738.506 376.524 738.506 C 412.705 738.506 440.722 745.075 473.699 756.067 C 484.055 759.519 500.68 755.106 504.14 768.946 C 507.393 781.959 507.026 818.718 491.261 823.973 C 454.937 836.082 406.972 838.023 367.158 838.023 C 354.968 838.023 337.854 832.961 326.18 836.852 C 309.309 842.475 331.738 862.595 333.205 868.463 C 336.223 880.536 326.312 887.063 319.155 894.22 C 312.373 901.003 296.384 899.469 287.544 902.416 C 255.948 912.948 218.059 909.578 186.856 919.978 C 172.758 924.677 153.495 914.712 141.195 910.612 C 115.939 902.192 89.421 905.841 65.094 897.733 C 49.788 892.631 35.824 887.629 35.824 870.805",
      image: "",
      events: [],
    },
    {
      title: "Time Warp",
      subtitle: "You have found a secret!",
      external_url: "https://www.youtube.com/watch?v=BMwGMOly6-c",
      on_map: true,
      on_list: false,
      path:
        "M 907.341 400.067 C 872.382 400.067 816.145 398.523 801.97 441.044 C 798.044 452.822 796.786 464.123 793.775 476.168 C 788.524 497.17 776.917 514.161 799.629 531.195 C 819.385 546.013 839.829 534.707 860.51 534.707 C 891.611 534.707 926.785 532.773 956.515 525.341 C 995.954 515.481 995.768 456.307 976.418 430.507 C 965.131 415.458 949.714 413.058 935.44 405.921 C 927.034 401.717 905.951 409.213 899.146 402.408",
      image: "",
      events: [],
    },
    {
      title: "Californication",
      subtitle: "You have found a secret!",
      external_url: "https://www.youtube.com/watch?v=YlUKcNNmywk",
      on_map: true,
      on_list: false,
      path:
        "M 487.028 914.043 C 464.308 914.043 424.003 942.988 460.1 955.021 C 467.54 957.501 490.247 951.802 495.224 946.825 C 503.286 938.763 510.576 921.503 495.224 916.384 C 490.829 914.919 484.273 916.384 480.003 916.384",
      image: "",
      events: [],
    },
    {
      title: "Pirates of the Caribbean",
      subtitle: "You have found a secret!",
      external_url: "https://www.youtube.com/watch?v=ksDOIIv5HeQ",
      on_map: true,
      on_list: false,
      path:
        "M 614.644 907.018 C 606.197 908.426 598.636 912.681 591.228 916.384 C 576.033 923.982 563.769 945.388 583.033 955.021 C 597.793 962.401 640.483 951.345 647.426 937.459 C 652.544 927.223 634.683 911.792 627.523 907.018 C 618.444 900.965 609.406 909.082 600.595 904.677",
      image: "",
      events: [],
    },
  ],
};
