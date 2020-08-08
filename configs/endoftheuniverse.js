const midnight_event = {
  start_minute: 240,
  duration_minutes: 30,
  host: "Co-reality Collective",
  name: "Temporary Closure. Head to STARDUST for Midnight Ritual.",
  text:
    "Room will be closed for 30 minutes to bring everyone together. Tonight's Midnight Ritual is at Stardust.",
  interactivity: "high",
};

const default_events = [
  {
    start_minute: 0,
    duration_minutes: 240,
    host: "Co-reality Collective",
    name: "First half of the party",
    text:
      "This room doesn't have an events program. Why not jump in and see what you find!",
    interactivity: "high",
  },
  midnight_event,
  {
    start_minute: 270,
    duration_minutes: 210,
    host: "Co-reality Collective",
    name: "Second half of the party",
    text:
      "This room doesn't have an events program. Why not jump in and see what you find!",
    interactivity: "high",
  },
];

const generateEvent = (
  start_minute,
  duration_minutes,
  host,
  name,
  text,
  interactivity
) => ({
  start_minute,
  duration_minutes,
  host: host || "Co-reality Collective",
  name,
  text,
  interactivity: interactivity || "high",
});

const generateEvents = (title) => [
  {
    start_minute: 0,
    duration_minutes: 240,
    host: "Co-reality Collective",
    name: title,
    text: `Yep, it sure is ${title} aight. When's this universe end again?`,
    interactivity: "high",
  },
  midnight_event,
  {
    start_minute: 270,
    duration_minutes: 210,
    host: "Co-reality Collective",
    name: title,
    text: "Still kicking, end of the universe is getting closer now.",
    interactivity: "high",
  },
];

module.exports = {
  template: "partymap",
  name: "Party at the End of the Universe",
  description: {
    text: "The last party you'll ever go to; just not chronologically",
  },
  start_utc_seconds: 1596913200,
  duration_hours: 8,
  entrance_hosted_hours: 3,
  party_name: "Party at the End of the Universe",
  unhosted_entry_video_url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
  map_url: "/maps/EndOfTheUniverse.jpg",
  map_viewbox: "0 0 4000 2000",
  password: "lastchance",
  host: {
    icon: "/room-images/CRC_EndOfTheUniverse_Logo.jpg",
    name: "Co-reality Collective",
  },
  config: {
    theme: {
      primaryColor: "yellow",
    },
    landingPageConfig: {
      subtitle: "Co-reality Collective Presents: An Online Adventure",
      coverImageUrl: "/maps/EndOfTheUniverse.jpg",
      presentation: [],
      quotations: [
        {
          text: "It’s the only way I’ve ever been able to make friends online.",
          author: "A fellow reveller",
        },
        {
          text: "More fun than I’ve had in years. More real than numbers",
          author: "Another fellow reveller",
        },
        {
          text:
            "Way better than sitting around on zoom with my so-called friends",
          author: "A true convert",
        },
      ],
      checkList: [
        "12 beautiful and awesome spaces",
        "Party your way through lockdown with amazing people",
        "Enter the secret password from your email to gain entry",
        "Hurry up and get in here",
        "Never gonna give you up",
      ],
      videoIframeUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    },
  },
  profile_questions: [
    {
      name: "memory",
      text: "Your greatest party memory, in 10 words or less:",
    },
    {
      name: "likeAboutParties",
      text: "What do you like about parties?",
    },
    {
      name: "bestDanceMove",
      text: "What's your best dance move?",
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
      "https://docs.google.com/presentation/d/e/2PACX-1vQCC-lRX9axXHLGpW1WmA4rWng6e0BOA3jhaemRvqeJbWx3RwQ4RYEnElgTiIt_z7Q0XTWwc4uYw0D_/pub?start=false&loop=true&delayms=60000&slide=id.g81ea402f3e_20_14",
    text: "Welcome to the party. We recommend starting at Wish Upon A Star.",
  },
  rooms: [
    {
      title: "BYO Party: Space Loo",
      subtitle:
        "NOTHING HAPPENS HERE UNLESS YOU MAKE IT HAPPEN (Screen Share Is Permitted Here!)",
      external_url:
        "https://us02web.zoom.us/j/86238134181?pwd=UExXUldBalBZbzdwVzRQYTBrY1VWdz09",
      on_map: true,
      on_list: true,
      path:
        "M 319.968 70.474 C 272.387 86.334 279.757 141.175 261.644 177.4 C 225.586 249.515 163.952 383.311 193.601 472.256 C 203.88 503.095 185.859 546.644 216.282 569.461 C 288.716 623.787 419.747 615.8 501.418 595.383 C 539.846 585.776 592.512 562.242 611.584 524.099 C 629.58 488.106 628.031 452.075 640.745 413.933 C 647.122 394.804 629.789 355.843 640.745 339.409 C 672.469 291.823 845.15 349.676 789.793 238.963 C 749.058 157.494 619.03 187.442 540.3 161.199 C 503.811 149.036 493.933 79.693 456.055 60.753 C 418.468 41.96 346.057 90.083 319.968 63.994",
      attendance_x: "13%",
      attendance_y: "5%",
      image: "CRC_EndOfUniverse_Room_SpaceLoo.png",
      events: [
        generateEvent(
          0,
          60,
          "you!",
          "Be Your Own Party",
          "DIS-KAUS-TANG which one of you’s didn’t flush?"
        ),
        generateEvent(
          60,
          60,
          "you!",
          "I’m Trapped!",
          "The lock is broken, please send help..."
        ),
        generateEvent(
          120,
          60,
          "you!",
          "Strange Noises",
          "What strange noises can you hear? What noises will you make? Make them as loud and obnoxious as possible."
        ),
        generateEvent(
          180,
          60,
          "you!",
          "My keys and my phone have been sucked in to the Space Loo",
          "TI reached in to get them now there’s all these insects crawling over my arms. Can you help me pick them off?"
        ),
        midnight_event,
        generateEvent(
          270,
          90,
          "you!",
          "Stay Away From The Toilet",
          "People are starting to disappear."
        ),
        generateEvent(360, 60, "you!", "Add Bleach", "This is so much worse."),
        generateEvent(
          420,
          60,
          "you!",
          "Singing in Utter Despair",
          "Is that all there is?"
        ),
      ],
    },
    {
      title: "Conversation, Q&A: Worm Whole",
      subtitle: "WHOLESOME INVERTEBRATE FRIENDLY IMMERSIVE EXPERIENCES",
      external_url:
        "https://us02web.zoom.us/j/87418882738?pwd=MGNIZDJCbk9jSDRaM0V5aFlFSGxaUT09",
      on_map: true,
      on_list: true,
      path:
        "M 1019.846 284.326 C 1019.846 230.374 1046.607 151.059 1097.61 125.557 C 1128.04 110.342 1165.54 107.793 1194.816 93.155 C 1210.558 85.284 1268.036 74.36 1285.541 80.194 C 1301.742 85.595 1369.465 131.396 1376.266 144.998 C 1382.936 158.338 1392.71 182.382 1408.667 190.36 C 1446.392 209.222 1526.057 202.815 1554.475 245.443 C 1566.385 263.308 1557.77 284.49 1564.196 303.767 C 1569.081 318.422 1569.233 346.978 1564.196 362.09 C 1539.811 435.244 1515.137 409.765 1454.03 430.134 C 1433.579 436.95 1397.665 448.067 1373.025 439.854 C 1361.649 436.062 1323.077 423.022 1311.462 426.893 C 1290.046 434.032 1272.33 455.058 1249.899 462.535 C 1205.45 477.352 1141.431 477.143 1097.61 462.535 C 1041.567 443.854 983.946 326.707 1029.567 281.085",
      attendance_x: "33%",
      attendance_y: "18%",
      image: "CRC_EndOfUniverse_Room_WormWhole.png",
      events: [
        generateEvent(
          30,
          120,
          "Intergalactic Centipede Crew",
          "The Intergalactic Centipede",
          "Join us for an hour-long journey of self-discovery to explore the far edge of your comfort zone and beyond!\n\nThe intergalactic centipede will be leaving on its voyage through the wormhole every 10 minutes...only one will be chosen - be The One!\n\n(Last centipede departs at 10.30pm UK time/ 2.30pm PST)"
        ),
        generateEvent(
          150,
          90,
          "Space Grandma",
          "Space Grandma’s Tea Room",
          "Come experience worm love with Space Grandma! Everyone is welcome at Grandma’s Tea Time!"
        ),
        midnight_event,
      ],
    },
    {
      title: "Dancing & DJs: Shake Your Asteroid",
      subtitle:
        "Don't miss the last opportunity to dance with DJs who are out of this world.",
      external_url:
        "https://us02web.zoom.us/j/87287651248?pwd=Rld0elF2RWJwZWFZTXFrUlVqcTNIUT09",
      on_map: true,
      on_list: true,
      path:
        "M 718.509 724.99 C 718.509 640.049 742.023 556.085 818.955 517.618 C 848.923 502.634 885.678 510.178 916.16 494.937 C 933.386 486.324 981.079 471.214 1003.645 478.736 C 1036.879 489.814 1081.938 491.961 1113.811 507.898 C 1136.332 519.158 1162.082 539.109 1185.095 546.78 C 1213.177 556.141 1246.047 556.195 1272.58 569.461 C 1348.996 607.671 1521.717 581.353 1554.475 679.627 C 1569.14 723.621 1530.526 836.658 1486.432 851.357 C 1457.781 860.908 1424.788 850.567 1395.707 857.837 C 1355.434 867.906 1317.886 877.297 1279.06 890.239 C 1248.643 900.378 1207.889 879.4 1175.375 890.239 C 1119.411 908.894 1055.561 925.845 1003.645 951.802 C 987.422 959.913 958.988 945.322 942.082 945.322 C 849.684 945.322 761.161 924.231 728.23 825.435 C 713.881 782.388 718.509 753.064 718.509 708.789",
      attendance_x: "22%",
      attendance_y: "31%",
      image: "CRC_EndOfUniverse_Room_Asteroid.png",
      events: [
        generateEvent(
          30,
          90,
          "Maximitosis",
          "Come shake your Asteroids on the dancefloor",
          "Maximitosis commences launch with some star killer Bass"
        ),
        generateEvent(
          120,
          60,
          "Behindthebeats",
          "Party like there's no tomorrow with Behindthebeats",
          "Because there isn't..."
        ),
        generateEvent(
          180,
          60,
          "DJ Affinity",
          "Take us to your DJ it's Code Affinity",
          "With alien sounds & galaxy music."
        ),
        midnight_event,
        generateEvent(
          270,
          90,
          "Anonemau5",
          "Anonymau5 will rebirth the music",
          "The music will be the last sounds of the universe."
        ),
        generateEvent(
          360,
          120,
          "Shake Your Asteroid DJs",
          "The DJ plays the Universe out before the end of the Universe.",
          "Save the last dance for me!"
        ),
        generateEvent(
          480,
          90,
          "Shake Your Asteroid DJs",
          "Closing Ceremony",
          "Closing Ceremony for the End of the Universe"
        ),
      ],
    },
    {
      title: "Live Cabaret: Apocalyse Meow Cabaret",
      subtitle: "Universal Space Cadets Cabaret Show",
      external_url:
        "https://us02web.zoom.us/j/89190080486?pwd=bzZPTDF1Mi9RV3E4bllDZHZERnFnQT09",
      on_map: true,
      on_list: true,
      path:
        "M 196.841 851.357 C 212.603 804.071 228.032 772.774 248.684 731.47 C 261.733 705.372 300.947 690.758 323.208 679.627 C 413.098 634.682 563.654 649.182 650.466 692.588 C 711.446 723.078 692.927 843.861 676.387 893.479 C 672.321 905.678 644.987 962.024 663.426 971.243 C 696.878 987.969 746.896 965.996 776.833 980.964 C 837.779 1011.437 925.675 988.963 987.444 1019.846 C 1006.328 1029.287 1049.75 1028.554 1058.728 1055.488 C 1069.387 1087.466 1061.968 1121.075 1061.968 1155.933 C 1061.968 1183.262 1057.056 1209.552 1049.008 1233.698 C 1037.969 1266.814 1011.957 1260.323 987.444 1272.58 C 968.044 1282.28 940.676 1272.58 919.401 1272.58 C 860.652 1272.58 799.449 1281.199 744.431 1262.859 C 667.298 1237.148 550.389 1278.939 481.977 1301.741 C 395.781 1330.472 288.406 1261.66 219.522 1227.217 C 192.996 1213.954 155.649 1197.608 144.998 1165.654 C 128.104 1114.971 147.135 1051.213 167.679 1010.125 C 185.542 974.4 174.418 886.74 203.321 857.837",
      attendance_x: "17%",
      attendance_y: "46%",
      image: "CRC_EndOfUniverse_Room_ApocalypseMeowCabaret.png",
      events: [
        generateEvent(
          90,
          30,
          "Apocalyse Meow UK Crew",
          "UK Takeover",
          [
            "Ben of the Green: Comedy and Musical Madness",
            "Tinika Belle: LED Ninja",
            "Ludoler of the North: Beatboxing Genre - Fluid Mistro of Bass",
          ].join("\n")
        ),
        generateEvent(
          120,
          30,
          "Apocalyse Meow UK Crew",
          "UK Takeover",
          [
            "The Queen of Heartbreak: Comedy Poet",
            "Betty Hayes: Planet D.I.S.C.O Space Captain",
            "Matt Mooks: Fire Starting Juggling Master of the Universe",
          ].join("\n")
        ),
        generateEvent(
          150,
          30,
          "Apocalyse Meow UK Crew",
          "UK Takeover",
          [
            "Shelly Skye: LED Hoop Lessons of Consciousness",
            "Thomas Florence: Psychological Illusionist and Escapologist",
          ].join("\n")
        ),
        generateEvent(
          180,
          60,
          "Apocalyse Meow UK Crew",
          "UK Takeover",
          ["Open Stage Renegade Style:", "Anything Could Happen..."].join("\n")
        ),
        midnight_event,
        generateEvent(
          300,
          30,
          "Apocalyse Meow US Crew",
          "US Takeover",
          [
            "Opening Ceremony: Dance w/ Space Cats",
            "JVILL: Hip Hop Flow Artist",
            "Cybil Unrest: California’s Darling of Discord",
          ].join("\n")
        ),
        generateEvent(
          330,
          30,
          "Apocalyse Meow US Crew",
          "US Takeover",
          [
            "Star Maiden: Storytelling Through Dance",
            "Guy Vigor: The BBoy of Boylesque",
            "Julia Muse: Witch Craft Dance for Collective Liberation",
            "Qu’in De La Noche: Professional Tease & Queen the Damned",
          ].join("\n")
        ),
        generateEvent(
          360,
          30,
          "Apocalyse Meow US Crew",
          "US Takeover",
          [
            "Chris Marcum: Boylesque & Hip Hop Brat",
            "Miss Amber Lust: The Goth Gata From Panama",
            "Elektra Gray: The Bandit of Burlesque",
            "Morticia LaMarr: Our Sultry Spectre",
            "Diamond Reign Purr - forming Polesque",
          ].join("\n")
        ),
        generateEvent(
          390,
          30,
          "Apocalyse Meow US Crew",
          "US Takeover",
          [
            "Your Favorite Feral Showgirl Vixi Vale",
            "Knaughty Nebula Our Ethereal Burlesque Beauty",
            "HoolaHoop Burlesque Purrr - formance w / Planetary Hues",
            "Cybil Unrest sharing some Rawwwrr Expert - Tease",
          ].join("\n")
        ),
        generateEvent(
          420,
          30,
          "Apocalyse Meow US Crew",
          "US Takeover",
          [
            "Hip Hop Dances",
            "Bare Elegance Burlesque Babes",
            "Purrr - Formance by Truth or Dare Productions",
            "Acapella Song & Dance w / Star Maiden and",
            "Get Cosmic w / Planetary Hues",
          ].join("\n")
        ),
        generateEvent(
          450,
          30,
          "Apocalyse Meow US Crew",
          "US Takeover",
          [
            "Fire Purr-formances w/ Diamond  Julia & Qu’in",
            "DJ & Free Style Dance W / Puurr - fomers",
          ].join("\n")
        ),
        generateEvent(
          480,
          30,
          "Apocalyse Meow US Crew",
          "US Takeover",
          [
            "AFTERPARTY!!!",
            "Music by MR RAD | Josh is Your Guide | Eluid",
          ].join("\n")
        ),
      ],
    },
    {
      title: "Salon & Q&A: The Oat Milky Way",
      subtitle:
        "Come enjoy a debate about the nature of time, the universe and conciousness.",
      external_url:
        "https://us02web.zoom.us/j/87920530976?pwd=d2JkYVdBc3BYejc2Z3FsRW1UTTFUZz09",
      on_map: true,
      on_list: true,
      path:
        "M 1236.938 1100.85 C 1210.784 1048.543 1280.487 917.069 1334.143 890.239 C 1357.952 878.334 1435.851 889.25 1457.27 899.959 C 1492.324 917.486 1546.481 900.535 1583.637 912.92 C 1643.768 932.964 1692.117 957.439 1745.646 984.204 C 1774.152 998.457 1769.753 1055.099 1781.288 1078.169 C 1796.756 1109.106 1836.296 1159.398 1823.41 1198.056 C 1808.123 1243.918 1803.375 1291.292 1774.807 1334.143 C 1747.738 1374.747 1678.075 1371.607 1661.401 1421.628 C 1646.738 1465.618 1623.357 1559.937 1567.436 1573.916 C 1510.164 1588.234 1456.164 1564.196 1402.187 1564.196 C 1358.255 1564.196 1254.855 1554.666 1230.458 1505.873 C 1203.068 1451.094 1195.277 1346.183 1223.977 1288.781 C 1237.592 1261.55 1222.994 1219.463 1236.938 1191.575 C 1249.63 1166.191 1227.217 1122.397 1227.217 1097.61",
      attendance_x: "35%",
      attendance_y: "56%",
      image: "CRC_EndOfUniverse_Room_OatMilkyWay.png",
      events: [
        generateEvent(
          30,
          210,
          "Ed Cooke",
          "Online Burn vs Regular Burn?",
          'Join us in the Oat Millky Way to learn and contribute as we discuss the ups and downs of an online answer to "That Thing in the Desert". Can an online burn really be better than a dusty week with strangers?'
        ),
        midnight_event,
      ],
    },
    {
      title: "Midnight Ritual, Q&A: Stardust",
      subtitle: "Bowie-esque Enchantment",
      external_url:
        "https://us02web.zoom.us/j/81359178818?pwd=cm1Cc1hNc0lwM1B4M2VIRVlNdDFjUT09",
      on_map: true,
      on_list: true,
      path:
        "M 1667.882 481.976 C 1657.489 440.406 1693.841 397.615 1706.764 358.85 C 1720.224 318.471 1746.084 296.409 1765.087 258.404 C 1792.667 203.245 1827.386 101.305 1888.214 60.753 C 1912.431 44.609 1950.406 55.579 1972.458 44.552 C 1979.849 40.857 2023.657 42.61 2034.022 47.793 C 2062.978 62.271 2100.257 85.582 2118.266 112.596 C 2131.247 132.066 2149.942 169.355 2166.869 180.64 C 2212.972 211.375 2264.008 241.078 2309.437 271.365 C 2324.945 281.704 2351.649 297.554 2358.04 316.727 C 2376.421 371.876 2368.558 435.759 2387.201 491.697 C 2400.612 531.935 2457.576 546.386 2468.206 588.902 C 2474.226 612.982 2458.634 632.987 2445.524 650.466 C 2394.675 718.265 2318.403 671.239 2254.354 692.588 C 2231.667 700.15 2177.389 707.989 2160.389 724.99 C 2123.683 761.695 2087.572 789.735 2043.742 818.955 C 2016.528 837.098 1979.885 834.109 1949.777 841.636 C 1865.852 862.618 1767.321 867.614 1693.803 812.475 C 1631.273 765.577 1600.399 667.661 1619.279 592.143 C 1630.735 546.32 1635.48 537.785 1661.401 481.976",
      attendance_x: "53%",
      attendance_y: "18%",
      image: "CRC_EndOfUniverse_Room_Stardust.png",
      events: [
        generateEvent(
          30,
          90,
          "Nagle",
          "The Serenade",
          "Let Nagle Bone take you away to another place."
        ),
        generateEvent(
          120,
          60,
          "Mara d’Or & Lindy Larsson",
          "The Space Vaudeville",
          "Mara d’Or & Lindy Larsson, Sweden’s premier talent will dazzle you."
        ),
        generateEvent(
          180,
          60,
          "Michael Ronen",
          "Space Odyssey",
          "Michael Ronen bring back your memories from EARTH"
        ),
        generateEvent(
          240,
          30,
          null,
          "MIDNIGHT RITUAL",
          "Join us at midnight UK time for our traditional midnight ritual."
        ),
        generateEvent(
          300,
          180,
          null,
          "The Quintessential Wonder Nasty",
          "A cabaret presentation"
        ),
      ],
    },
    {
      title: "Immersive Theatre: XNN Colony Fantasea Rocket",
      subtitle:
        "Aboard with the last of the best of humanity. Cults, Comedy and a chance to begin again.",
      external_url:
        "https://us02web.zoom.us/j/87657322607?pwd=c0JYZjZmSGJ4WXhDS2ZrOWRhamJydz09",
      on_map: true,
      on_list: true,
      path:
        "M 1849.331 1065.209 C 1835.24 1046.419 1823.233 1025.973 1813.69 1006.885 C 1805.586 990.678 1827.123 970.299 1833.131 958.283 C 1857.933 908.68 1961 876.526 2011.34 851.357 C 2069.472 822.292 2153.232 841.974 2212.232 812.475 C 2227.359 804.911 2264.847 821.81 2283.515 812.475 C 2421.145 743.656 2646.703 757.681 2759.822 870.798 C 2805.78 916.755 2861.157 935.035 2882.948 1000.405 C 2891.695 1026.642 2866.756 1074.916 2853.787 1094.37 C 2795.317 1182.073 2761.399 1216.969 2662.616 1249.899 C 2516.641 1298.56 2408.371 1238.595 2277.035 1194.816 C 2242.312 1183.241 2189.466 1199.697 2157.148 1207.776 C 2052.991 1233.817 1883.362 1267.75 1839.611 1136.492 C 1833.513 1118.199 1852.571 1085.089 1852.571 1068.448",
      attendance_x: "63%",
      attendance_y: "40%",
      image: "CRC_EndOfUniverse_Room_FantaSea.png",
      events: [
        generateEvent(
          0,
          60,
          "XNN Fantasea Crew",
          "XNN Afterlife Services",
          "Join the office of Afterlife Processing. Meet Grim Rita. What lies beyond? An intimate look of our lust for life."
        ),
        generateEvent(
          60,
          60,
          "XNN Fantasea Crew",
          "Post Stasis Exercise",
          "Defeat muscle wastage! Shake your booty, your mind and your face in zero G with the XNN Fantasea Crew."
        ),
        generateEvent(
          120,
          60,
          "XNN Fantasea Crew",
          "Mess Hall Hell Yeah",
          "Someone came into the airlock with a strange new friend. It is adorable but it hurts to be around it. What’s going on?"
        ),
        generateEvent(
          180,
          60,
          "XNN Fantasea Crew",
          "Apocalyptic Admin Dance Off & Panic",
          "The universe is ending. Come get a cup of tea, sit back and bathe in the existential dread that is now upon us. Shit."
        ),
        midnight_event,
        generateEvent(
          270,
          90,
          "XNN Fantasea Crew",
          "DARK MATTERS",
          "Explore your DARK SIDE in a secret occult art museum! 💀ARK"
        ),
        generateEvent(
          360,
          180,
          "XNN Fantasea Crew",
          "DARK MATTERS - Continued",
          "Plumb the depths of your soul in a chamber of black magic💀"
        ),
      ],
    },
    {
      title: "DDP Disco Barge",
      subtitle:
        "An Interstellar Disco Barge that perambulates all Zoom realms. Commences as a Virtual Art Car, followed by an acceleration into virtual / terrestrial afterparty dimensions!",
      external_url: "https://bit.ly/virtualddp",
      on_map: true,
      on_list: true,
      path:
        "M 1823.41 1700.283 C 1842.62 1585.029 1861.347 1427.343 1995.14 1382.746 C 2048.417 1364.987 2113.388 1377.892 2166.869 1360.065 C 2208.703 1346.12 2261.839 1314.199 2299.716 1295.261 C 2310.524 1289.858 2332.737 1279.679 2341.839 1288.781 C 2348.527 1295.47 2392.791 1292.021 2403.402 1292.021 C 2446.647 1292.021 2511.558 1283.792 2555.69 1298.501 C 2604.292 1314.701 2614.576 1376.454 2662.616 1392.466 C 2700.441 1405.074 2746.336 1433.444 2733.9 1483.191 C 2715.688 1556.045 2693.016 1629.77 2659.376 1697.043 C 2642.675 1730.443 2668.849 1791.504 2649.656 1829.891 C 2633.706 1861.788 2634.542 1915.934 2591.332 1930.336 C 2477.644 1968.23 2350.666 1932.541 2238.153 1904.415 C 2146.981 1881.623 2039.112 1931.608 1943.297 1907.655 C 1918.857 1901.545 1868.764 1896.3 1852.572 1872.013 C 1817.692 1819.695 1826.65 1746.317 1826.65 1687.323",
      attendance_x: "51%",
      attendance_y: "84%",
      image: "CRC_EndOfUniverse_Room_DDP.png",
      events: [
        midnight_event,
        generateEvent(
          330,
          30,
          "Distributed Dance Party",
          "PRE-PARTY TIME",
          "We begin calibrating our warp drive(s) and banana boosters and may or may not let you aboard!"
        ),
        generateEvent(
          360,
          120,
          "Distributed Dance Party",
          "PARTY TIME",
          "DDP Disco Barge Virtual Art Car perambulates across all Zoom Realms. All are welcome aboard!"
        ),
        generateEvent(
          480,
          180,
          "Distributed Dance Party",
          "DDP AFTERPARTY",
          "The 100% Open family-friendly hybrid virtual/terrestrial Party commences! 3+ hours of mirth and merriment!"
        ),
      ],
    },
    {
      title: "Wish Upon A Star",
      subtitle:
        "See a shooting star, and let us help you make your dreams come true. Real magic happens here.",
      external_url:
        "https://us02web.zoom.us/j/87273699622?pwd=K21TNUg4YmEvQmpvb2lKbTQyUDhkUT09",
      on_map: true,
      on_list: true,
      path:
        "M 2464.965 336.169 C 2443.527 319.817 2448.838 174.012 2474.686 122.317 C 2480.165 111.359 2488.022 90.87 2500.607 86.675 C 2581.698 59.644 2716.565 19.686 2805.184 63.994 C 2826.043 74.422 2863.176 59.563 2886.188 67.234 C 2930.548 82.02 2968.292 120.524 3012.555 135.277 C 3078.169 157.148 3152.61 275.666 3129.202 345.889 C 3074.03 511.401 2860.931 608.511 2691.778 566.221 C 2618.231 547.834 2536.464 548.724 2487.647 475.496 C 2471.898 451.873 2445.025 402.468 2455.245 371.81 C 2467.201 335.943 2473.725 302.807 2452.004 281.085",
      attendance_x: "63%",
      attendance_y: "10%",
      image: "CRC_EndOfUniverse_Room_WishUponAStar.png",
      events: [
        generateEvent(
          0,
          60,
          null,
          "Inner Space",
          "Deep Dive Into Our Multidimensional Innerverse & Potent Limitless Potentials As Eternal Star Beings."
        ),
        generateEvent(
          60,
          60,
          null,
          "Outer Space",
          "Intentioning in our manifestations into the physical reality."
        ),
        generateEvent(
          120,
          60,
          null,
          "The Space Around the Corner",
          "What will you create? With whom will you co-create?"
        ),
        midnight_event,
      ],
    },
    {
      title: "Games and Fun: Escape Pod",
      subtitle: "Join Us For Games, Fun and Frustration",
      external_url:
        "https://us02web.zoom.us/j/84744362145?pwd=Z1Zub2FMTVVSbXNwNFY1WlBtZ2dodz09",
      on_map: true,
      on_list: true,
      path:
        "M 3161.604 300.527 C 3161.604 247.658 3174.649 149.732 3203.726 106.116 C 3214.829 89.461 3219.292 54.59 3239.368 44.552 C 3280.888 23.792 3342.588 48.025 3381.936 28.352 C 3410.55 14.045 3458.985 38.072 3488.862 38.072 C 3618.467 38.072 3773.159 91.115 3880.923 144.998 C 3907.613 158.343 3900.934 197.978 3910.084 216.282 C 3917.662 231.44 3910.084 270.56 3910.084 287.566 C 3910.084 356.71 3906.473 453.187 3858.242 501.418 C 3836.068 523.591 3736.311 547.179 3705.953 537.06 C 3541.98 482.399 3335.449 531.64 3177.804 452.815 C 3134.948 431.386 3161.604 326.79 3161.604 294.046",
      attendance_x: "90%",
      attendance_y: "6%",
      image: "CRC_EndOfUniverse_Room_EscapePod.png",
      events: [
        generateEvent(
          60,
          120,
          null,
          "Universal Complaints Department",
          "Has the Universe refused to meet your expectations? Do you need to formalise your dissatisfaction with someone? Come and file a complaint with the (un)Official Complaints Department. Silly bureaucracy and red tape aplenty. Frustration guaranteed."
        ),
        midnight_event,
        generateEvent(
          300,
          60,
          null,
          "Escape To The Intergalactic Mystery Game Show",
          "OH NO! You need to escape! From what? That’s up to you, but there isn’t enough SPACE in the escape pod for everyone! Do you and your space crew have what it takes to come aboard? Compete against crews from across the galaxy to gain entry to a different dimension!"
        ),
      ],
    },
    {
      title: "Women's Space: Goddess Galaxy",
      subtitle: "For women and humans who identify as female.",
      external_url:
        "https://us02web.zoom.us/j/88232569509?pwd=UitZZzRwd2NxdmZ2VGFGc0pHQ0VBQT09",
      on_map: true,
      on_list: true,
      path:
        "M 3161.604 520.859 C 3045.009 520.859 2834.938 567.68 2795.464 686.108 C 2774.174 749.979 2869.266 816.072 2882.948 870.798 C 2895.146 919.584 2909.127 968.772 2925.071 1016.606 C 2935.083 1046.645 2913.187 1077.356 2944.512 1100.85 C 3000.538 1142.871 3057.49 1115.324 3116.241 1130.012 C 3176.306 1145.028 3254.333 1152.693 3317.132 1152.693 C 3407.261 1152.693 3490.338 1116.559 3576.346 1087.89 C 3622.648 1072.456 3676.915 1083.529 3722.154 1068.449 C 3771.267 1052.077 3822.96 1042.407 3871.203 1026.326 C 3890.609 1019.858 3929.812 1009.698 3942.486 990.685 C 3981.477 932.195 3939.234 828.646 3913.325 776.833 C 3900.662 751.509 3869.433 743.397 3855.002 721.75 C 3831.181 686.02 3756.758 641.479 3715.674 627.784 C 3679.971 615.883 3645.865 591.554 3608.748 579.182 C 3559.819 562.873 3504.783 569.391 3453.219 556.501 C 3418.089 547.718 3387.93 532.888 3352.774 524.099 C 3285.794 507.354 3209.278 520.859 3142.163 520.859",
      attendance_x: "88%",
      attendance_y: "32%",
      image: "CRC_EndOfUniverse_Room_GoddessGalaxy.png",
      events: [
        generateEvent(
          120,
          60,
          "Leah Emmott",
          "Womb Clearing & Activation Ceremony",
          "Guided Visual Embodiment Practice w/ Creatrix of Awakening the Womb, Healing Arts Teacher, Initiated Magdalena Rose Womb Priestess & Guide Cherezade."
        ),
        generateEvent(
          180,
          60,
          "Ella Love",
          "Awakening Your Divine Femininity",
          "Ella Alexandria Love is a transformation Midwife & Women’s Empowerment Leader. She deeply understands a woman’s duty to awaken themselves as sovereign beings and devotes her life to support us in doing so."
        ),
        midnight_event,
        generateEvent(
          300,
          120,
          "Anthe Aelea",
          "Living Life More Golden: Women’s Circle",
          [
            "Coming more deeply into your own. Honoring & governing your unique sacral life energy from the heart. Empowering your creative, sexual sovereignty.",
            "",
            "W/ Visionary Artist, DJ, Dancer and Facilitator of conscious (womens) events Anthe Aelea",
          ].join("\n")
        ),
        generateEvent(
          420,
          60,
          "Alesha Howard",
          "Moving Heavy in to Light",
          "Prayerformer and Healer Alesha Howard extends an invitation to come together in sisterhood to recognize, observe, actively listen and possibly release heavy emotions."
        ),
        generateEvent(
          480,
          60,
          "Lisa Dang",
          "Spaceholding for Space Holders",
          "How to gracefully show up for tribe whilst honoring your energetic life force. Lisa Dang invites hearts to discuss tools, offer suggestions & consider sustainability in the practice of Spaceholding."
        ),
        generateEvent(
          540,
          60,
          "MR RAD & Josh is Your Tour Guide",
          "Movement is Medicine Dance",
          [
            "Musical Journey by MR RAD & Josh is Your Tour Guide",
            "Open to All. Feel into the FREEquency.",
          ].join("\n")
        ),
      ],
    },
    {
      title: "International Donation Station",
      subtitle: "Give generously to the artists",
      external_url: "https://donorbox.org/interdependence-day-bury-treasure",
      on_map: true,
      on_list: false,
      path:
        "M 2811.664 1499.392 C 2836.556 1437.164 2790.471 1409.886 2772.782 1356.825 C 2764.248 1331.224 2792.373 1311.162 2801.944 1292.021 C 2817.795 1260.319 2822.95 1224.015 2857.027 1201.296 C 2936.761 1148.139 3065.524 1137.055 3155.123 1181.855 C 3170.746 1189.666 3214.454 1183.367 3226.407 1201.296 C 3266.118 1260.861 3266.012 1361.132 3242.608 1431.349 C 3226.59 1479.406 3201.983 1578.9 3164.844 1616.039 C 3052.342 1728.539 2863.17 1719.037 2788.983 1570.676 C 2775.846 1544.404 2818.145 1513.135 2818.145 1492.912",
      image: "CRC_EndOfUniverse_Room_IDS.png",
      events: [
        generateEvent(
          0,
          480,
          null,
          "Donations open",
          "Donations will go to supporting the artists who create the wondrous experiences you are enjoying tonight."
        ),
      ],
    },
    {
      title: "Powered By SparkleVerse",
      subtitle:
        "Providing information about SparkleVerse, 1/10 universes in the online burn. Info at https://sparklever.se/.",
      external_url:
        "https://us02web.zoom.us/j/88396553119?pwd=Mk9pRjFHc3JuUWxoTFRpUzVLM1Y1Zz09",
      on_map: true,
      on_list: true,
      path:
        "M 3297.691 1350.344 C 3319.916 1305.894 3300.335 1240.775 3336.573 1204.536 C 3355.712 1185.398 3385.253 1183.437 3407.857 1172.134 C 3414.469 1168.828 3438.942 1173.451 3443.499 1168.894 C 3453.775 1158.619 3480.971 1169.599 3495.342 1162.414 C 3540.355 1139.907 3597.67 1149.453 3644.39 1149.453 C 3687.534 1149.453 3748.225 1152.917 3773.997 1191.575 C 3800.948 1232.002 3820.632 1273.157 3835.561 1317.942 C 3843.414 1341.501 3837.527 1376.958 3848.521 1398.947 C 3899.939 1501.786 3901.082 1626.841 3864.722 1735.925 C 3860.952 1747.237 3869.931 1769.024 3874.443 1778.048 C 3891.953 1813.067 3870.388 1912.317 3842.041 1933.576 C 3782.235 1978.43 3683.618 1956.345 3618.469 1940.057 C 3590.033 1932.947 3554.838 1947.641 3524.504 1940.057 C 3469.77 1926.372 3409.301 1931.507 3352.774 1917.375 C 3326.073 1910.7 3276.813 1925.658 3255.569 1904.415 C 3185.791 1834.639 3250.045 1725.618 3268.53 1651.681 C 3283.214 1592.941 3272.539 1532.731 3291.211 1476.711 C 3300.761 1448.059 3323.01 1353.284 3291.211 1337.383",
      attendance_x: "87%",
      attendance_y: "79%",
      image: "CRC_EndOfUniverse_Room_SparkleVerse.png",
      events: [
        generateEvent(
          120,
          120,
          "Jess & the SparkleVerse Team",
          "Webinar",
          "Join us to find out more about co-creating with us in the SparkleVerse, one of the universes in the online burn multiverse. Find out how to bring your camp, art car, performances and art installations to the online burn, including demos, walkthroughs, Q&A and more."
        ),
        midnight_event,
        generateEvent(
          300,
          120,
          "Jess, Thomas & the SparkleVerse Team",
          "Webinar",
          "Join us to find out more about co-creating with us in the SparkleVerse, one of the universes in the online burn multiverse. Find out how to bring your camp, art car, performances and art installations to the online burn, including demos, walkthroughs, Q&A and more."
        ),
      ],
    },
    {
      title: "Co-reality Collective",
      subtitle: "Click to go to our homepage.",
      external_url: "https://co-reality.co/",
      on_map: true,
      on_list: false,
      path:
        "M 1042.527018929285 1471.0404914277135 C 1035.9019317514092 1437.9135511626034 1039.4167048394663 1385.2403482708153 1003.6449584960938 1367.35498046875 C 951.3499012144292 1341.2081906325884 829.1640055766802 1348.8307450724797 773.5923461914062 1367.35498046875 C 728.5245983833549 1382.3778460518736 610.5795087433229 1364.8598175280722 569.461181640625 1351.154052734375 C 535.2069395211914 1339.7362588026633 483.5901470011408 1342.6500220603166 449.5745849609375 1351.154052734375 C 412.88172903610604 1360.327417911607 350.1400013269086 1347.913818359375 310.2469787597656 1347.913818359375 C 248.3069122015262 1347.913818359375 190.14233194811825 1361.0200410055536 141.7577667236328 1393.2763671875 C 129.95787331153292 1401.1429504469952 90.49071423257209 1424.1652718349953 96.395263671875 1441.87890625 C 113.78456060260015 1494.046756097184 214.848947601336 1510.4005780231723 264.8844909667969 1493.7218017578125 C 313.86287611160384 1477.395417097568 385.35603157855985 1493.7218017578125 436.6139221191406 1493.7218017578125 C 570.7086375141512 1493.7218017578125 702.7750332360697 1503.4423828125 841.6360473632812 1503.4423828125 C 890.5813923671703 1503.4423828125 962.8482329399104 1506.0203228178495 1006.8851928710938 1484.001220703125 C 1028.936913466822 1472.9750488610746 1055.48779296875 1495.8416554097653 1055.48779296875 1467.80029296875",
      events: default_events,
    },
    {
      title: "What does the future hold?",
      subtitle: "You have found a secret!",
      external_url:
        "https://en.wikipedia.org/wiki/Ultimate_fate_of_the_universe",
      on_map: true,
      on_list: false,
      path:
        "M 167.6791704209253 1636.289566560178 C 199.71091549180647 1629.8833281332497 212.4256912794678 1643.6448787643114 238.96307373046875 1652.490478515625 C 255.60864100382415 1658.0388790033344 290.5207944656585 1649.2503662109375 310.2469787597656 1649.2503662109375 C 321.01028775153213 1649.2503662109375 340.86624254919826 1658.2418955059688 352.3692932128906 1652.490478515625 C 375.8588242461129 1640.745934235202 398.0273633202933 1661.0322357680914 423.6531982421875 1652.490478515625 C 473.31539531280157 1635.9367766247688 550.9311298790456 1623.328857421875 605.1030883789062 1623.328857421875 C 640.599645624477 1623.328857421875 732.1113564655132 1614.2500772950332 754.1512451171875 1636.28955078125 C 780.3008722430254 1662.4386853264725 865.710440500013 1596.9523922829792 851.3566284179688 1568.245849609375 C 814.1496489203352 1493.8346939804924 743.4072944433705 1526.12353515625 676.3870239257812 1526.12353515625 C 555.9817006673655 1526.12353515625 438.8632126355408 1513.1629638671875 316.72735595703125 1513.1629638671875 C 275.99331275139934 1513.1629638671875 194.99387552019698 1481.6833817585193 157.95867919921875 1500.2020263671875 C 98.91629760683944 1529.7248854356922 95.14325256756975 1593.7494170969105 164.4390106201172 1616.8485107421875 C 170.44856035395136 1618.8517380099017 177.31675278238095 1629.8092041015625 183.8800506591797 1629.8092041015625",
      events: generateEvents("the future"),
    },
    {
      title: "How big's this thing again?",
      subtitle: "You have found a secret!",
      external_url: "https://www.youtube.com/watch?v=i93Z7zljQ7I",
      on_map: true,
      on_list: false,
      path:
        "M 151.4782905175847 1817.7394659746549 C 105.83000979346957 1810.13132442499 105.57009756104281 1734.5861791332115 122.31669616699219 1701.0931396484375 C 128.91768748965518 1687.8912191742668 161.7642870928762 1671.6487067551384 174.15956115722656 1665.451171875 C 185.9894824026961 1659.5363087451115 211.29432284606366 1669.5650895313033 219.52200317382812 1665.451171875 C 271.69256013356954 1639.3654020266497 370.40905001344606 1685.359659524657 430.1335754394531 1665.451171875 C 458.054245081657 1656.1441358997936 502.00322461500645 1671.6390376938175 527.3389282226562 1658.970947265625 C 586.80903595449 1629.235333280397 691.9982871903187 1652.490478515625 757.3914184570312 1652.490478515625 C 797.593216879958 1652.490478515625 859.9293430253175 1640.5753981694054 896.7190551757812 1658.970947265625 C 915.9248909165386 1668.574226923212 954.0438810306348 1654.9832445703257 971.2431640625 1649.2503662109375 C 996.9326761768926 1640.6875181090147 1051.3302583852956 1648.7915243604982 1071.688720703125 1658.970947265625 C 1080.2828482268183 1663.2680919712764 1112.3517912743985 1656.4603485754417 1120.2913818359375 1652.490478515625 C 1141.0619058432978 1642.1050208847291 1226.5727128977962 1642.4477334020232 1246.658203125 1652.490478515625 C 1285.7173783392925 1672.0200661227714 1279.2743360868142 1704.9771669016552 1292.020751953125 1743.2154541015625 C 1299.0958621645857 1764.440251650486 1277.5095266335718 1792.335068310439 1259.618896484375 1798.2984619140625 C 1196.1279181700424 1819.4615898089442 1102.695692276045 1827.4600830078125 1032.8065185546875 1827.4600830078125 C 731.3570413186716 1827.4600830078125 435.58892905274956 1824.219970703125 138.517578125 1824.219970703125",
      events: generateEvents("the size of the universe"),
    },
    {
      title: "A Musical Tune",
      subtitle: "You have found a secret!",
      external_url: "https://www.youtube.com/watch?v=dLxpNiF0YKs",
      on_map: true,
      on_list: false,
      path:
        "M 1340.6232981448766 1772.377046742364 C 1307.852462889132 1575.7471679097189 1614.1558545274117 1593.226120623081 1726.204345703125 1649.2503662109375 C 1790.0032725871397 1681.1498296529448 1777.7049512098833 1742.5327309169347 1803.96875 1795.058349609375 C 1829.7669135465037 1846.6527328986192 1733.7967513012027 1911.1489981034279 1700.2830810546875 1927.905517578125 C 1684.6039900917629 1935.7449153860423 1659.2201007397957 1928.6318656182261 1641.9598388671875 1934.3858642578125 C 1562.2307984235297 1960.9648810557196 1390.692868284724 1910.6633316637676 1343.8634033203125 1840.4208984375 C 1325.2390639998534 1812.485091097081 1347.103759765625 1785.9416012524741 1347.103759765625 1759.41650390625",
      events: generateEvents("Man on the Moon"),
    },
    {
      title: "5 hours of space rock",
      subtitle: "Handy if you hate parties and interacting with other humans",
      external_url: "https://www.youtube.com/watch?v=ors0wpcVDcc",
      on_map: true,
      on_list: false,
      path:
        "M 3019.0353683207422 1775.6174340840794 C 2967.282848414504 1736.803017658534 2823.416790470063 1754.8196956822824 2772.78173828125 1788.577880859375 C 2727.3036935902287 1818.89790992633 2783.8788307977184 1907.5333225882853 2818.144287109375 1924.6654052734375 C 2889.4283517420145 1960.3060947862941 3006.9437142866095 1977.6908952722713 3087.078857421875 1937.6263427734375 C 3128.947477749565 1916.6936099979935 3179.834699865887 1886.609891615461 3148.64208984375 1824.219970703125 C 3118.8100117824147 1764.5513187507415 3035.5617439664256 1805.1017587509166 2996.353759765625 1765.896728515625",
      events: generateEvents("psychedelic space rock"),
    },
    {
      title: "A Musical Tune",
      subtitle: "You have found a secret!",
      external_url: "https://www.youtube.com/watch?v=XCbAEkfXSDE",
      on_map: true,
      on_list: false,
      path:
        "M 1742.405297735973 48.602708059798886 C 1684.5526343941217 71.74371621146521 1625.6352501762271 84.49293854823762 1596.5972900390625 142.56790161132812 C 1572.936926720921 189.88784830420013 1643.264991184105 248.84116773802572 1687.3223876953125 226.81246948242188 C 1748.4025109675495 196.27240784630337 1861.3439103190894 51.842899322509766 1729.444580078125 51.842899322509766",
      events: generateEvents("Space Man"),
    },
    {
      title: "A Musical Tune",
      subtitle: "You have found a secret!",
      external_url: "https://www.youtube.com/watch?v=a4eav7dFvc8",
      on_map: true,
      on_list: false,
      path:
        "M 993.9243235979352 42.12237834699397 C 935.6734222728079 42.122379302978516 869.9952025329137 17.816099830479168 818.9547729492188 51.842899322509766 C 776.6745435357296 80.0295917242805 824.0304227673378 155.95932016761103 838.3958740234375 184.69015502929688 C 844.0486267471944 195.99563385658013 840.8824298552826 218.07072980684873 844.8762817382812 230.05264282226562 C 850.7019626742722 247.5302069071423 875.2457029670987 252.0565042144396 886.99853515625 255.97412109375 C 936.7909973030495 272.57163452959986 956.472636654373 215.6615796542207 977.7235107421875 194.41070556640625 C 1011.3808804511389 160.75333585745483 1053.060081738647 78.30560498649407 993.92431640625 38.88218688964844 C 982.9867457280058 31.590551795581362 969.278135775075 36.279456778243635 961.5225830078125 32.40182876586914",
      events: generateEvents("Out of Space"),
    },
    {
      title: "Halley's Comet Tracker",
      subtitle: "You have found a secret!",
      external_url: "https://theskylive.com/halley-tracker",
      on_map: true,
      on_list: false,
      path:
        "M 903.1993738906967 314.2972552793734 C 866.9005997466994 341.5214282625968 829.4171490897372 352.80920064703656 789.7931518554688 372.6204528808594 C 741.4516901172879 396.790273158823 697.9603172555109 378.0762631309563 669.9066772460938 434.1838073730469 C 653.3832687137477 467.2307800634903 711.4002590195032 491.20060957170836 734.7102661132812 479.5462646484375 C 784.329062032734 454.73826866644396 829.2933290469506 416.0540924567237 883.7583618164062 388.8213195800781 C 903.2939520652932 379.0534324567732 937.6593070442192 390.59454109405044 951.8020629882812 369.3803405761719 C 984.0429658737243 321.01883441750795 922.3460794928556 293.3835231981131 880.5182495117188 314.2972412109375",
      events: generateEvents("A Halley's Comet Tracker"),
    },
    {
      title: "A Musical Tune",
      subtitle: "You have found a secret!",
      external_url: "https://www.youtube.com/watch?v=NE2AvbROl5k",
      on_map: true,
      on_list: false,
      path:
        "M 216.28183794161112 61.56347872806526 C 187.5267447036787 73.06542167999213 150.04507967398706 52.55939644915995 119.07649993896484 68.04377746582031 C 30.53435809057258 112.31510899418274 8.476702933577446 180.14873775204845 38.07207489013672 268.9347839355469 C 47.94372915639403 298.5497234902159 59.897241179853424 329.1327613360697 93.1551284790039 340.21868896484375 C 124.28010101581657 350.5936472382606 146.98013860691708 312.94398280826226 161.1988067626953 291.6159973144531 C 178.5958108553168 265.52051165728324 189.72431021494018 241.0454468971134 203.3211212158203 213.8517608642578 C 212.4802433098836 195.5334735433246 204.31581915560056 169.73992725647815 213.04164123535156 152.2884063720703 C 216.8065912276241 144.75855957730616 226.40338859454843 104.48771787387622 222.76219177246094 97.20537567138672 C 215.42073012186532 82.52255608806063 199.2736727763583 63.189169383852445 193.60060119628906 51.842899322509766",
      events: generateEvents("Exploration of Space"),
    },
  ],
};
