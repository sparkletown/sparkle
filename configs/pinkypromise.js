const TODO_events = [
  {
    start_minute: 0,
    duration_minutes: 60,
    host: "TODO",
    name: "TODO",
    text: "TODO",
    interactivity: "high",
  },
];

module.exports = {
  template: "partymap",
  name: "Pinky Promise Online Party",
  description: {
    text: "",
  },
  start_utc_seconds: 1595620800,
  duration_hours: 4,
  entrance_hosted_hours: 400,
  party_name: "Pinky Promise Online Party",
  unhosted_entry_video_url: "",
  map_url: "/maps/PleasurePalace.jpg",
  map_viewbox: "0 0 2400 1600",
  password: "pleasure",
  host: {
    icon: "/logos/pinkypromise.png",
    name: "Pinky Promise",
    url: "https://www.pinkypromiseland.co.uk/",
  },
  config: {
    theme: {
      primaryColor: "pink",
    },
    landingPageConfig: {
      subtitle: "Pinky Promise's Online Party",
      coverImageUrl: "/maps/PleasurePalace.jpg",
      presentation: [],
      checkList: [
        "7 online spaces made for your pleasure",
        "Have fun online with a co-created community of ethical hedonists",
        "Help champion new ways to be sensual, playful and intimate",
        "The party is better with you!",
      ],
    },
  },
  profile_questions: [
    {
      name: "whatsYourFantasy",
      text: "What is your fantasy?",
    },
  ],
  code_of_conduct_questions: [
    {
      name: "seekConsent",
      text: "I will seek consent before engaging with any individual",
    },
    {
      name: "agreeToRules",
      text: "I agree to the Pinky Promise rules (click to read them)",
      link: "https://www.pinkypromiseland.co.uk/rules",
    },
    {
      name: "readFaq",
      text: "I am aware of the FAQ",
      link: "https://www.pinkypromiseland.co.uk/faq",
    },
  ],
  description: {
    program_url:
      "https://docs.google.com/spreadsheets/d/1LtUNnWvFWHKGg53sw_CCn6Rp_d0bhuWClITrBg2Udpg/",
    text:
      "Welcome to the party. There are many spaces to choose from. We hope you have a great time!",
  },
  rooms: [
    {
      title: "The Latin Quarter",
      subtitle: "",
      about: "",
      url: "/latin-quarter-preview",
      external_url: "https://us02web.zoom.us/j/81042840884",
      on_map: true,
      on_list: true,
      path:
        "M 1780.544 1029.152 L 1745.14 616.201 C 1743.512 505.07 1840.717 329.533 1972.367 354.789 C 2118.099 382.747 2163.74 434.524 2191.155 568.844 C 2221.284 716.449 2218.183 727.993 2233.5 876.37 C 2235.011 891.007 2219.62 1014.559 2224.923 1028.969 C 2224.923 1028.969 2088.302 1028.521 1780.544 1029.152 Z",
      attendance_x: "58%",
      attendance_y: "53%",
      image: "",
      events: TODO_events,
    },
    {
      title: "The Boudoir",
      subtitle: "",
      about: "",
      url: "/boudoir-preview",
      external_url: "https://zoom.us/j/98223917421",
      on_map: true,
      on_list: true,
      path:
        "M 804.326 1560.926 L 792.883 1141.684 C 796.697 1028.861 889.759 850.65 1003.416 876.291 C 1129.23 904.674 1166.608 957.24 1184.2 1093.606 C 1203.534 1243.459 1198.42 1302.594 1204.796 1453.231 C 1205.425 1468.09 1212.289 1532.835 1216.237 1547.463 C 1216.237 1547.463 1068.255 1650.672 804.326 1560.926 Z",
      attendance_x: "49%",
      attendance_y: "21%",
      image: "",
      events: TODO_events,
    },
    {
      title: "Twisted Time Machine",
      subtitle: "",
      about: "",
      url: "/twisted-time-machine-preview",
      external_url: "https://us02web.zoom.us/j/83836827454",
      on_map: true,
      on_list: true,
      path:
        "M 1237.047 1557.179 L 1225.604 1137.937 C 1229.418 1025.114 1322.48 846.903 1436.137 872.544 C 1561.951 900.927 1599.329 953.493 1616.921 1089.859 C 1636.255 1239.712 1631.141 1298.847 1637.517 1449.484 C 1638.146 1464.343 1645.01 1529.088 1648.958 1543.716 C 1648.958 1543.716 1500.976 1646.925 1237.047 1557.179 Z",
      attendance_x: "39%",
      attendance_y: "53%",
      image: "",
      events: TODO_events,
    },
    {
      title: "Lovers Layer",
      subtitle: "",
      about: "",
      url: "/lovers-layer-preview",
      external_url: "https://us02web.zoom.us/j/85699468721",
      on_map: true,
      on_list: true,
      path:
        "M 183.776 1040.784 L 170.106 618.31 C 174.663 504.617 285.843 325.032 421.628 350.871 C 571.937 379.472 616.591 432.444 637.61 569.861 C 660.706 720.87 654.597 780.459 662.214 932.259 C 662.966 947.233 671.166 1012.476 675.883 1027.217 C 675.883 1027.217 518.307 1015.713 215.075 1049.249 C 204.799 1050.385 194.366 1043.821 183.776 1040.784 Z",
      attendance_x: "16%",
      attendance_y: "23%",
      image: "",
      events: TODO_events,
    },
    {
      title: "The Den of Iniquity",
      subtitle: "",
      about: "",
      url: "/den-of-iniquity-preview",
      external_url: "https://us02web.zoom.us/j/2438058357",
      on_map: true,
      on_list: true,
      path:
        "M 1766.247 1065.441 L 1754.804 1381.945 C 1758.618 1467.12 1715.867 1607.182 1981.479 1592.857 C 2159.676 1583.247 2140.343 1556.204 2167.644 1492.138 C 2216.022 1378.614 2176.483 1350.202 2182.859 1236.48 C 2183.488 1225.262 2174.21 1086.649 2178.158 1075.606 C 2178.158 1075.606 2030.176 997.688 1766.247 1065.441 Z",
      attendance_x: "81%",
      attendance_y: "63%",
      image: "",
      events: TODO_events,
    },
    {
      title: "The Pussy Cat Parlour",
      subtitle: "",
      about: "",
      url: "/pussy-cat-lounge-preview",
      external_url: "https://us02web.zoom.us/j/84028874875",
      on_map: true,
      on_list: true,
      path:
        "M 826.83 841.593 L 846.27 523.691 C 852.902 446.205 1014.731 323.812 1212.374 341.422 C 1431.156 360.916 1496.154 397.017 1526.747 490.672 C 1560.366 593.589 1551.474 634.201 1562.561 737.658 C 1563.655 747.863 1575.592 792.328 1582.457 802.375 C 1582.457 802.375 1375.703 845.158 826.83 841.593 Z",
      attendance_x: "81%",
      attendance_y: "23%",
      image: "",
      events: TODO_events,
    },
    {
      title: "The Living Room",
      subtitle: "",
      about: "",
      url: "/living-room-preview",
      external_url: "https://us02web.zoom.us/j/82333058273",
      on_map: true,
      on_list: true,
      path:
        "M 228.6 1563.996 L 217.157 1241.368 C 220.971 1154.545 178.22 1011.772 443.832 1026.374 C 622.029 1036.17 602.696 1063.737 629.997 1129.042 C 678.375 1244.763 638.836 1273.725 645.212 1389.648 C 645.841 1401.083 636.563 1542.378 640.511 1553.635 C 640.511 1553.635 492.529 1633.06 228.6 1563.996 Z",
      attendance_x: "17%",
      attendance_y: "63%",
      image: "",
      events: TODO_events,
    },
  ],
};
