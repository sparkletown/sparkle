const jazz_events = [
  {
    start_minute: 0,
    duration_minutes: 720,
    host: "Abbott HE&R",
    name: "Abbott Demo - Sample Event (Jazztastic Park)",
    text:
      "Enjoy a social happy hour while listening to London’s finest jazz band, Kansas Smitty’s!",
    interactivity: "high",
  },
];

const survivor_events = [
  {
    start_minute: 0,
    duration_minutes: 720,
    host: "Abbott HE&R",
    name: "Abbott Demo - Sample Event (Survivor Island)",
    text:
      "Get to know you teammates more! Outwit, outplay and outlast with team building exercises like lip sync battles, pet beauty pageants and more.",
    interactivity: "high",
  },
];

const worldpool_events = [
  {
    start_minute: 0,
    duration_minutes: 720,
    host: "Abbott HE&R",
    name: "HE&R America’s Meeting",
    text: "The HE&R America’s Meeting is here!",
    interactivity: "high",
  },
];

const bermuda_events = [
  {
    start_minute: 0,
    duration_minutes: 720,
    host: "Abbott HE&R",
    name: "Abbott Demo - Sample Event (Bermuda Party Portal)",
    text:
      "Enter the conference here. Be prepared to hang on tight as we are experiencing high winds!",
    interactivity: "high",
  },
];

const sirens_call_events = [
  {
    start_minute: 0,
    duration_minutes: 720,
    host: "Abbott HE&R",
    name: "Abbott Demo - Sample Event (Sirens Call)",
    text:
      "Sit back and relax with this unique cabaret full of aerial, breakdancing, and fire performances.",
    interactivity: "high",
  },
];

module.exports = {
  template: "partymap",
  name: "Abbott's 2020 HE&R Conference",
  description: {
    text: "",
  },
  start_utc_seconds: 1595592000,
  duration_hours: 12,
  entrance_hosted_hours: 400,
  party_name: "Abbott Island Festival",
  unhosted_entry_video_url: "https://i.imgur.com/TIs7NzK.jpg",
  map_url: "/maps/AbbottIslandFestival.jpg",
  map_viewbox: "0 0 3000 2000",
  password: "abbott",
  host: {
    icon: "/logos/abbott.png",
    name: "Abbott HE&R Department",
    url: "https://www.abbott.com/",
  },
  config: {
    theme: {
      primaryColor: "lightblue",
    },
    landingPageConfig: {
      subtitle: "First-ever Online Edition of the HE&R Gathering",
      coverImageUrl: "/maps/AbbottIslandFestival.jpg",
      presentation: [],
      checkList: [
        "Abbott's HE&R event, happening online for the first time ever",
        "Over 50 staff from around the world",
        "Up to a dozen configurable zoom event spaces",
        "Custom events program",
        "Bespoke immersive entrance experience produced by Co-reality Collective",
        "Bespoke half-time show by Co-reality Collective",
        "Audio-Visual Support In Zoom Rooms For Speakers",
        "Technical Support for Guests",
      ],
    },
  },
  profile_questions: [
    {
      name: "doYouDance",
      text: "Do you dance?",
    },
  ],
  experiences: {
    jazzbar: {
      associatedRoom: "Jazz Mountain",
    },
    friendship: {
      associatedRoom: "Isle of Friends",
    },
  },
  description: {
    program_url:
      "https://drive.google.com/file/d/1kd-xV0cvd2WSEG-aXusC0BhEk7MuRqok/view?usp=sharing",
    text:
      "Welcome to the party. We recommend starting at the Bermuda Party Portal.",
  },
  rooms: [
    {
      title: "Live Music: Jazztastic Park",
      subtitle: "Dinosaurs and all that Jazz",
      about:
        "Live jazz shows from the marvellous Kansas Smitty's and mellifluous Sam Leak. Come enjoy at a table with your party friends.",
      url: "/jazztastic-park-preview",
      external_url: "/venue/jazztastic-park",
      on_map: true,
      on_list: true,
      path:
        "M -0.404 762.512 C 42.074 778.441 97.738 760.31 126.531 789.105 C 140.584 803.159 131.566 828.417 146.246 843.097 C 151.566 848.416 164.211 847.362 169.213 852.364 C 172.587 855.738 185.416 849.198 186.941 850.724 C 191.315 855.098 204.211 857.907 207.088 860.784 C 212.471 866.166 206.724 880.573 212.319 886.168 C 222.982 896.83 246.477 890.555 261.878 898.255 C 264.189 899.411 278.64 898.829 280.01 897.436 C 291.601 885.645 331.857 906.163 344.478 893.323 C 353.147 884.503 340.585 866.466 345.207 861.763 C 348.938 857.967 354.566 853.882 358.503 849.877 C 366.357 841.887 395.146 860.481 404.84 850.62 C 417.125 838.123 409.685 805.114 422.165 792.419 C 433.576 780.812 468.619 806.588 480.186 794.822 C 486.471 788.429 509.243 797.234 515.644 790.724 C 524.275 781.943 542.344 792.517 552.317 787.445 C 589.531 768.515 664.39 803.344 692.937 774.308 C 708.599 758.377 665.819 738.616 659.293 732.091 C 653.809 726.609 631.314 731.883 636.75 726.353 C 654.139 708.663 679.642 695.239 692.756 668.561 C 694.914 664.173 699.944 642.196 694.75 637.001 C 689.718 631.969 701.331 619.436 696.355 614.458 C 667.717 585.817 625.415 636.929 611.102 650.999 C 605.243 656.759 583.202 638.862 573.803 648.103 C 565.689 656.08 546.842 646.892 540.194 640.246 C 535.429 635.481 522.474 639.33 517.241 634.097 C 500.021 616.877 453.36 626.367 436.087 609.095 C 427 600.009 425.84 575.1 425.84 558.681 C 425.84 553.771 428.31 535.329 425.021 532.04 C 413.904 520.923 424.905 494.51 417.643 479.986 C 404.868 454.437 413.771 416.272 394.28 396.783 C 385.018 387.521 390.19 362.361 381.574 353.746 C 372.623 344.795 378.878 318.669 368.868 308.66 C 365.01 304.802 352.615 308.802 348.785 304.972 C 346.119 302.305 335.902 306.75 334.439 308.188 C 331.19 311.382 321.464 308.856 318.044 312.217 C 314.757 315.449 305.164 309.876 303.289 308.938 C 297.389 305.988 254.587 297.078 248.366 303.193 C 234.303 317.019 242.563 349.191 228.693 362.826 C 205.121 385.998 165.23 383.663 138.931 409.516 C 126.777 421.465 137.656 456.703 126.225 467.94 C 122.293 471.806 127.595 484.322 123.766 488.086 C 119.808 491.977 125.922 505.71 122.126 509.441 C 115.912 515.551 125.848 538.815 118.84 545.704 C 105.509 558.811 91.345 571.927 78.673 584.385 C 71.418 591.518 74.261 607.257 66.787 614.604 C 49.616 631.483 23.378 639.363 7.41 654.928 C 0.447 661.715 0.035 659.568 -0.117 675.501 C -0.198 683.997 -0.614 753.844 -0.396 762.392",
      attendance_x: "5%",
      attendance_y: "10%",
      image: "CRC_Island_JAZZ2.png",
      events: jazz_events,
    },
    {
      title: "Fun & Games: Survivor Island",
      subtitle: "A Place Proper Preppers Have Prepped for",
      about:
        "Work together to win it all and fulfill your dream of being on the TV show 'Survivor.' Get silly with lip sync battles, trivia, festival Bingo and more!",
      url: "/survivor-island-preview",
      external_url: "https://zoom.us/j/4157588161",
      on_map: true,
      on_list: true,
      path:
        "M 597.644 931.617 C 573.902 886.291 586.377 873.254 611.931 847.259 C 619.935 839.117 597.382 830.35 603.549 824.076 C 622.893 804.398 652.671 804.554 677.615 791.868 C 694.909 783.072 693.087 769.047 705.469 756.45 C 713.371 748.41 706.464 727.102 714.331 719.101 C 734.672 698.411 750.607 614.043 732.624 578.074 C 729.099 571.024 706.439 509.06 712.661 502.731 C 724.44 490.75 726.233 465.744 737.983 453.79 C 753.012 438.501 781.384 430.428 802.553 419.661 C 807.369 417.211 822.864 419.584 827.242 415.131 C 833.874 408.384 858.265 411.241 867.124 402.23 C 883.298 385.777 930.367 401.647 944.988 386.775 C 950.669 380.996 994.863 385.736 1001.962 389.286 C 1048.365 412.487 1103.469 390.063 1134.9 421.494 C 1142.296 428.89 1142.552 441.174 1149.46 448.082 C 1154.38 453.002 1144.869 468.824 1149.449 473.404 C 1183.099 507.053 1119.247 561.161 1098.402 581.654 C 1079.239 600.494 1036.473 589.358 1017.908 607.609 C 1007.131 618.203 1033.59 659.272 1050.182 642.393 C 1066.236 626.062 1089.918 687.685 1102.091 699.858 C 1141.824 739.591 1161.655 792.357 1186.919 842.882 C 1199.863 868.769 1206.877 908.331 1183.459 931.552 C 1175.88 939.067 1166.502 948.97 1159.283 956.066 C 1151.25 963.963 1124.135 958.3 1118.07 964.263 C 1113.048 969.2 1071.572 945.238 1058.182 958.401 C 1045.902 970.474 1062.333 996.068 1051.066 1007.146 C 1046.259 1011.871 1032.582 1005.681 1027.24 1010.933 C 1019.206 1018.831 1019.377 1037.02 1011.141 1045.117 C 993.157 1062.797 920.38 1057.091 892.653 1057.091 C 878.956 1057.091 834.581 1062.706 827.613 1055.737 C 821.028 1049.152 828.811 1020.273 826.281 1017.744 C 819.24 1010.703 806.498 1016.602 800.523 1010.627 C 791.156 1001.261 797.417 977.256 788.932 968.77 C 787.2 967.038 772.45 976.743 771.545 977.633 C 769.156 979.981 745.324 976.978 738.703 976.978 C 683.144 976.978 595.723 989.837 595.723 925.985",
      attendance_x: "28%",
      attendance_y: "19%",
      image: "CRC_Island_SURVIVE.png",
      events: survivor_events,
    },
    {
      title: "Discussions & Q&A: The Worldpool",
      subtitle: "A Space of Reflection on Current Events",
      about:
        "A collection of artists & speakers touching on what’s happening externally & how internally we can influence it.",
      url: "/the-worldpool-preview",
      external_url: "https://zoom.us/j/4157588161",
      on_map: true,
      on_list: true,
      path:
        "M 1209.654 1127.943 C 1209.654 1168 1209.908 1194.044 1231.166 1215.302 C 1236.188 1220.324 1293.445 1250.527 1292.571 1251.386 C 1282.761 1261.031 1256.009 1235.944 1246.207 1245.579 C 1221.024 1270.333 1181.69 1295.109 1222.686 1336.104 C 1240.726 1354.145 1301.547 1325.696 1318.275 1342.424 C 1329.276 1353.425 1393.916 1346.222 1411.332 1346.222 C 1483.441 1346.222 1621.078 1368.382 1663.283 1325.452 C 1666.222 1322.462 1658.775 1304.691 1658.775 1300.982 C 1658.775 1254.887 1621.543 1257.192 1578.925 1257.192 C 1572.971 1257.192 1545.363 1260.981 1541.575 1257.192 C 1539.623 1255.239 1561.825 1245.609 1563.099 1244.313 C 1570.607 1236.675 1580.076 1229.62 1587.787 1221.775 C 1611.444 1197.707 1619.02 1109.763 1591.291 1082.036 C 1587.03 1077.775 1535.22 1040.518 1517.88 1057.566 C 1512.946 1062.417 1501.387 1060.485 1495.985 1065.795 C 1492.44 1069.28 1485.038 1080.895 1485.038 1075.924 C 1485.038 997.705 1380.899 1026.054 1354.959 974.179 C 1352.23 968.722 1313.144 952.362 1306.018 959.368 C 1296.643 968.584 1280.188 974 1271.244 982.79 C 1256.776 997.011 1287.235 1029.011 1271.79 1044.196 C 1254.757 1060.941 1238.145 1078.535 1221.561 1094.839 C 1213.424 1102.839 1216.017 1119.28 1208.682 1126.491 C 1206.692 1128.447 1208.253 1118.764 1205.463 1118.764",
      attendance_x: "46%",
      attendance_y: "40%",
      image: "CRC_Island_WORLD.png",
      events: worldpool_events,
    },
    {
      title: "Welcome: The Bermuda Party Portal",
      subtitle: "The party begins here - lose yourself to find yourself",
      about:
        "Bring your suitcase, your sunglasses and swimwear for we are going sail across the seas to a small cluster of Islands in uncharted waters. The forecast is for clear skies and serene seas...",
      url: "/bermuda-party-portal-preview",
      external_url: "https://zoom.us/j/4157588161",
      on_map: true,
      on_list: true,
      path:
        "M 94.015 1203.415 C 91.21 1155.737 115.041 1123.042 129.168 1094.3 C 133.785 1084.907 75.946 1048.113 95.07 1028.661 C 105.351 1018.202 128.545 1025.283 139.484 1014.154 C 147.401 1006.101 137.384 978.783 145.35 970.679 C 149.139 966.825 157.116 968.087 161.272 963.859 C 167.253 957.775 154.323 942.768 161.243 935.728 C 165.13 931.775 206.978 925.215 213.2 931.437 C 236.242 954.479 275.135 964.041 300.353 989.26 C 308.224 997.131 321.573 965.117 323.818 962.833 C 332.863 953.633 418.743 943.024 432.759 950.032 C 454.094 960.699 413.172 970.164 418.18 975.172 C 430.179 987.171 444.31 997.949 455.891 1009.531 C 468.307 1021.947 395.011 1074.407 387.694 1081.6 C 382.51 1086.696 444.11 1091.087 447.193 1094.17 C 462.433 1109.41 438.59 1176.144 453.825 1191.379 C 455.247 1192.802 455.247 1224.34 453.825 1225.738 C 443.212 1236.17 372.744 1218.763 364.317 1210.336 C 359.983 1206.002 299.878 1209.993 296.972 1212.85 C 292.415 1217.329 263.366 1213.688 256.054 1213.688 C 215.891 1213.688 174.467 1210.278 135.858 1210.278 C 125.277 1210.278 92.941 1212.249 92.941 1203.732",
      image: "",
      attendance_x: "13%",
      attendance_y: "44%",
      image: "CRC_Island_PORTAL.png",
      events: bermuda_events,
    },
    {
      title: "Live Performances: Sirens' Call",
      subtitle: "A Cabaret Show",
      about:
        "Get pulled in --  Enchantment happening in our Siren’s Cove Cabaret of Mystics, Mermaids, Air Pixies, Fire Stewards, and Luring Dancers. We intend to keep you.",
      url: "/sirens-call-preview",
      external_url: "https://zoom.us/j/4157588161",
      on_map: true,
      on_list: true,
      path:
        "M 774.164 1148.325 C 758.915 1169.977 745.902 1179.215 729.926 1194.919 C 719.836 1204.837 722.477 1228.335 712.863 1237.786 C 698.103 1252.295 671.185 1257.707 655.353 1272.577 C 637.086 1289.734 671.578 1192.864 631.658 1365.047 C 626.311 1388.109 677.037 1468.638 711.995 1450.858 C 719.379 1447.102 771.295 1424.701 777.228 1430.635 C 785.118 1438.525 815.978 1466.688 835.005 1447.334 C 841.825 1440.397 866.41 1422.355 882.221 1430.26 C 885.157 1431.728 897.191 1432.184 899.616 1434.609 C 902.713 1437.705 902.809 1471.547 905.949 1474.879 C 914.598 1484.056 960.619 1477.313 973.126 1478.373 C 978.723 1478.847 1034.525 1480.842 1039.137 1476.074 C 1044.283 1470.754 1048.844 1461.796 1051.704 1451.915 C 1054.927 1440.781 1044.176 1431.166 1053.419 1421.763 C 1064.276 1410.718 1099.347 1408.021 1111.467 1402.582 C 1116.931 1400.13 1140.603 1415.556 1147.643 1413.561 C 1163.315 1409.12 1181.988 1403.401 1196.084 1398.167 C 1212.918 1391.916 1215.845 1333.956 1215.269 1326.458 C 1210.038 1258.317 1172.017 1266.203 1143.429 1237.615 C 1124.508 1218.694 1136.562 1171.974 1118.783 1154.195 C 1111.519 1146.931 1083.193 1157.723 1072.016 1146.547 C 1069.852 1144.382 1094.831 1106.378 1083.81 1095.357 C 1077.635 1089.182 1061.804 1099.301 1057.899 1091.49 C 1051.91 1079.512 1059.506 1067.818 1050.315 1058.627 C 1032.813 1041.125 985.467 1061.92 959.311 1060.153 C 949.974 1059.522 904.13 1052.897 898.381 1055.723 C 879.485 1065.012 865.598 1050.267 852.507 1063.137 C 850.415 1065.194 834.513 1059.029 829.124 1064.326 C 818.712 1074.562 820.721 1094.951 811.429 1104.087 C 802.748 1112.622 789.936 1120.244 781.726 1128.316 C 777.235 1132.732 777.003 1143.847 768.455 1143.847",
      attendance_x: "22%",
      attendance_y: "50%",
      image: "CRC_Island_SIREN.png",
      events: sirens_call_events,
    },
    {
      title: "Message in a Bottle",
      subtitle: "You Have Found a Secret!",
      about: "You Have Found a Secret!",
      url: "https://www.youtube.com/watch?v=GZuDPONddPE",
      on_map: true,
      on_list: true,
      path:
        "M 744.878 1549.806 C 755.992 1555.036 769.584 1557.189 783.795 1557.189 C 786.154 1557.189 796.623 1558.536 798.101 1557.032 C 800.735 1554.352 811.343 1559.363 814.252 1556.404 C 817.925 1552.666 820.983 1549.871 824.25 1546.546 C 826.905 1543.845 834.477 1545.845 837.325 1542.947 C 840.293 1539.928 842.47 1536.306 845.478 1533.246 C 846.484 1532.222 848.863 1526.182 847.008 1524.327 C 846.073 1523.392 840.735 1508.027 834.021 1514.626 C 832.135 1516.479 826.308 1515.285 824.476 1517.087 C 823.194 1518.347 821.678 1521.895 820.407 1520.625 C 811.932 1512.15 795.718 1509.999 785.514 1520.028 C 782.128 1523.356 775.303 1522.373 772.213 1525.412 C 765.798 1531.722 747.62 1524.358 741.388 1530.482 C 733.754 1537.986 739.858 1549.697 748.408 1549.697",
      image: "",
      events: [],
    },
  ],
};
