const lost_soul_chamber_events = [
  {
    start_hour: 1.5,
    duration_hours: 2.5,
    host: 'Rina 🙋‍♀️',
    name: 'The Sol Apothecary: a random mercurial cabinet',
    text: 'Ask a burning question in a 1-2-1 chat, with a modern high priestess casting spells of hope in a violent world. Sessions are timed at 10min per seeker. You may want to bring your favouite dice to hand.',
    interactivity: 'high',
  },
];

const roots_events = [
  {
    start_hour: 0.5,
    duration_hours: 3.5,
    host: 'Ed & Sam Zara',
    name: 'Welcome to the party',
    text: 'Champagne reception early, with light jazz and affable chit-chat. Transitioning later into intimate conversation, meet-space.',
    interactivity: 'high',
  },
  {
    start_hour: 4.5,
    duration_hours: 3.5,
    host: 'Az',
    name: 'Az hosts a magical time in the Roots',
    text: 'Ground yourself at the foundation of the party with our champagne reception. Light jazz, affable chit-chat: a place to get settled, make your first party friends.',
    interactivity: 'high',
  },
];

const upside_down_room_events = [
  {
    start_hour: 0.5,
    duration_hours: 3.5,
    host: 'Shelby, Maz, Kyle, Brenda & Kate',
    name: 'Mystic Bat Cave',
    text: 'Come dance as your spirit animal, turn your body upside down, and come to face to face with all the witches in the tree of life town.  Sacrifice rituals and bloody bites, come to the bat cave for the party’s most glorious delights. Begin in the bat cave to be born in the dark and live in the light.  Traverse through witches brews, spells and potions of the past, present, and future.  Don’t be alarmed if you’re chosen to be the vampire’s human sacrifice.  Afterall, the tree of life legend says old blood can only last so long in a quarantine.  As the night progresses prepare to take a dive into the dark side of your deepest fears...',
    interactivity: 'high',
  },
  {
    start_hour: 4.5,
    duration_hours: 4,
    host: 'Jonathan Cain',
    name: 'Ambient synth music - LIVE!',
    text: 'Live! ambient synthesizer music by Panumbra',
    interactivity: 'low',
  },
];

const funk_in_the_trunk_common = {
  name: 'Deep Tribal, Techno, Trancy, Trippy, (Tree)house Vibes',
  text: 'Come dance with us in the Funk in the Trunk. Make sure to mute your microphone and grab the Twitch link to hear the music!',
  interactivity: 'low',
};

const funk_in_the_trunk_events = [
  {
    start_hour: 0.5,
    duration_hours: 1.5,
    host: 'TreeMau5',
    ...funk_in_the_trunk_common,
  },
  {
    start_hour: 2,
    duration_hours: 1,
    host: 'Behindthebeats + Zandra ',
    ...funk_in_the_trunk_common,
  },
  {
    start_hour: 3,
    duration_hours: 1,
    host: 'Maximitosis',
    ...funk_in_the_trunk_common,
  },
  {
    start_hour: 4,
    duration_hours: .75,
    host: 'Godtek',
    ...funk_in_the_trunk_common,
  },
  {
    start_hour: 4.75,
    duration_hours: .75,
    host: 'KU3A',
    ...funk_in_the_trunk_common,
  },
  {
    start_hour: 5.5,
    duration_hours: 0.75,
    host: 'Avenir',
    ...funk_in_the_trunk_common,
  },
  {
    start_hour: 6.25,
    duration_hours: 0.75,
    host: 'Risky Danger',
    ...funk_in_the_trunk_common,
  },
  {
    start_hour: 7,
    duration_hours: 1,
    host: 'Chemical Adam',
    ...funk_in_the_trunk_common,
  },
];

const heart_room_events = [
  {
    start_hour: 3,
    duration_hours: 1,
    host: 'Jana',
    name: 'Your heart in the bark',
    text: 'Tell us the name of your loved ones and it will appear in the animation!',
    interactivity: 'medium',
  },
  {
    start_hour: 4,
    duration_hours: .5,
    host: 'Bobcat',
    name: 'Midnight Ritual 🌒🎊',
    text: 'The Co-reality Collective would like to invite you to our trademark Midnight Ritual, a combination performance and interactive experience for everyone who comes to the Tree of Life.',
    interactivity: 'medium',
  },
  {
    start_hour: 4.5,
    duration_hours: 2.5,
    host: 'Bobcat/Jana/Karin',
    name: 'Share your story',
    text: 'Do you have stories about sexy ideas gone wrong, weird fantasies or unsuccessful flirting? Do you want a picture of it? Then join us as we share our true and somewhat embarrassing stories and get them illustrated live!',
    interactivity: 'high',
  },
];

const mood_swing_common = {
  name: 'Sordid Affairs and Other Historical Naughtiness',
  text: 'Come hear the Lady Amelia Muchness discuss her sordid past alongside Dawn and a select few of her past lovers. Improv fans will have a ball - you may be lucky enough to be called upon to take part in the unfolding story, or you can watch from the sidelines!',
  interactivity: 'high',
};

const mood_swing_events = [
  {
    start_hour: 2,
    duration_hours: 2,
    host: 'Lady Amelia Muchness & Dawn',
    ...mood_swing_common,
  },
  {
    start_hour: 4.5,
    duration_hours: 1.5,
    host: 'Lady Amelia Muchness & Dawn',
    ...mood_swing_common,
  },
  {
    start_hour: 6,
    duration_hours: 2,
    host: 'Lady Amelia Muchness & Shelby',
    ...mood_swing_common,
  },
];

const treehouse_events = [
  {
    start_hour: 5,
    duration_hours: 3,
    host: 'Lisa, Jess, & Their Deer Friends 🦌',
    name: 'The Treehouse: A Cabaret Show 🧚🏻‍♀️🔥🍿🎪💃🏻🧜‍♀️🎭',
    text: 'Hosted by your Deer friends: Come watch insanely talented performers from all across the world dance with fire, hoops, feather fans, and more. Don\'t forget to play in our interactive laughing yoga workshop!',
    interactivity: 'medium',
  },
  {
    start_hour: 5,
    duration_hours: .25,
    host: 'Courtney Wild Free',
    name: 'Aquatic Dance',
    text: 'Courtney Wild Free is an embodied mermaid with a passion for inspiring, nurturing, serving, and illuminating conscious creative culture. This piece will be dedicated to the element of water, our ocean mother, and all there is to learn from being and flowing like this powerful cosmic liquid that heals.',
    interactivity: 'medium',
  },
  {
    start_hour: 5.25,
    duration_hours: .08333333333333,
    host: 'Cookie L\'Amour',
    name: 'Feather Fans',
    text: '',
    interactivity: 'medium',
  },
  {
    start_hour: 5.3333333333,
    duration_hours: .16666666666666,
    host: 'Kolarova Dance',
    name: 'Contemporary Dance',
    text: 'A contemporary dance choreography called ISOLATION',
    interactivity: 'medium',
  },
  {
    start_hour: 5.5,
    duration_hours: .16666666666666,
    host: 'Cory',
    name: 'Hammock',
    text: '',
    interactivity: 'medium',
  },
  {
    start_hour: 5.66666666666666,
    duration_hours: .5,
    host: 'Noya Tsur',
    name: 'Laughter Yoga',
    text: '',
    interactivity: 'medium',
  },
  {
    start_hour: 6.16666666666666,
    duration_hours: .25,
    host: 'Jwolf',
    name: 'Breakdancing & Bboying',
    text: 'One of the original 4 elements of hip-hop, breaking is a combination of dynamics, flexibility, and musicality.',
    interactivity: 'medium',
  },
  {
    start_hour: 6.41666666666666,
    duration_hours: .16666666666666,
    host: 'Delaney',
    name: 'Hoop',
    text: 'Making art with a plastic circle :)',
    interactivity: 'medium',
  },
  {
    start_hour: 6.58333333333333,
    duration_hours: .16666666666666,
    host: 'Sammy Sunshine',
    name: 'Hoop',
    text: '',
    interactivity: 'medium',
  },
  {
    start_hour: 6.75,
    duration_hours: .25,
    host: 'Cory',
    name: 'Hammock',
    text: '',
    interactivity: 'medium',
  },
  {
    start_hour: 7,
    duration_hours: .16666666666666,
    host: 'Amanda',
    name: 'LED Hoop',
    text: 'Amanda Marcus is a 25-year-old artist, nomad, and international vagabond since 2018. A Hooping 101 class on an island in Panama introduced her to the world of circus years ago. Since then, she has traveled around the world learning and training her skills, usually during sunsets on foreign beaches. She seeks to empower herself and others to create the lives they truly want via media, art, creativity, and movement.',
    interactivity: 'medium',
  },
  {
    start_hour: 7.1666666666666,
    duration_hours: .16666666666666,
    host: 'Patches',
    name: 'Throw Dart / Fire',
    text: '',
    interactivity: 'medium',
  },
  {
    start_hour: 7.3333333333333,
    duration_hours: .16666666666666,
    host: 'Kelsey',
    name: 'Dance & Hoop',
    text: 'A story about metamorphosis, told through embodied movement, flow arts, and dance.',
    interactivity: 'medium',
  },
  {
    start_hour: 7.5,
    duration_hours: .25,
    host: 'Ashronaut',
    name: 'Fire Fan',
    text: 'Ashtronaut will be sharing her gifts with the element of fire, bringing light into the darkness. Using her unique movement and her connection to the flames to create a prayer thru dance and expression. Feeling her flow within your soul, expanding thru your vision.',
    interactivity: 'medium',
  },
  {
    start_hour: 7.75,
    duration_hours: .25,
    host: 'Azula Flow',
    name: 'Fire Fan',
    text: 'Azula is a trained artist who’s roots are in dance. Her skills have sprouted into prop manipulation, fire dancing, and many other forms of expression. You are sure to be captivated by her movements as she tells a story through her enchanting flow.',
    interactivity: 'medium',
  },
  {
    start_hour: 8,
    duration_hours: 1.5,
    host: '❓❓❓',
    name: 'Secret Afterparty',
    text: 'Ask and you shall receive.. those who wish to keep partying are welcome at the official afterparty.',
  }
];

const beehive_common = {
  name: 'Welcome to The Beehive 🐝🐝',
  text: 'The Beehive is officially the most exciting and BUZZING room in the Tree! First half of the party we\'ll be giving you tasks to all you busy bees and get you to WORK. We\'ll be pollinating your ideas and help you with procreating. Be prepared to please the Queen Bee at all times... otherwise you will get STUNG! After all that hard work leading up to the midnight ritual, we can enjoy the taste of the sweet honeyz, watch the fire throwers, and fly around to the beats of the unBEElievable DJs.',
  interactivity: 'high',
};

const beehive_events = [
  {
    start_hour: 1,
    duration_hours: 3,
    host: 'Maz/Iona/DJ Joe 🐝🐝',
    ...beehive_common,
  },
  {
    start_hour: 4.5,
    duration_hours: .5,
    host: 'Max 🐝🐝',
    ...beehive_common,
  },
  {
    start_hour: 5,
    duration_hours: 3,
    ...beehive_common,
  },
];

const canopy_events = [
  {
    start_hour: 5,
    duration_hours: 1,
    host: 'Bobcat, Dina & Jen Chan',
    name: 'Sister San Pedro: succulent spirit guide',
    text: 'Mescaline curious? Experienced practitioners share their love and respect for this beautiful and trustworthy plant medicine.',
    interactivity: 'medium, presentation with Q&As',
  },
  {
    start_hour: 6,
    duration_hours: .5,
    host: 'Dina & Jen Chan',
    name: 'Inner Light: cosmic journey from photosynthesis to the stars',
    text: 'Discover your origins. Explore light\'s restless journey from stars to chlorophyll, told through the lens of wild edible & medicinal plants.',
    interactivity: 'medium, presentation with Q&As',
  },
  {
    start_hour: 6.5,
    duration_hours: .5,
    host: 'Holly / Dylan & Jen Chan',
    name: 'Medicine Magic: toad medicine with Holly and Dylan',
    text: 'Expanding your consciousness and transforming your life with psychedelics from the animal kingdom.',
    interactivity: 'medium, presentation with Q&As',
  },
  {
    start_hour: 7,
    duration_hours: .75,
    host: 'Dina Fisher / Nir Lahav & Jen Chan',
    name: 'Uncovering Reality: a quantum leap into fractals of the soul',
    text: 'Round-circle exploration into the nature of reality. Fearlessly hosted by Dina Fisher with physicist Nir Lahav, specializing in fractal-based consciousness.',
    interactivity: 'high, round-circle discussion',
  },
  {
    start_hour: 7.75,
    duration_hours: 1,
    host: 'Leo Raderman & Natasha',
    name: 'The Sonic Shamanic: Sound Medicine (Sound Healing)',
    text: 'Lean back, relax, and feel the magic wash over you. Perfect soft landing & after party.',
    interactivity: 'low',
  },
];

const compost_heap_events = [
  {
    start_hour: 0,
    duration_hours: 8,
    host: 'Co-reality Collective',
    name: 'Unplanned Space / Toilets',
    text: 'A space away from the party: the compost heap at the Tree of Life. Impromptu conversations and magical connections while in line for the bathrooms.',
    interactivity: 'high',
  },
];

const sunset_room_events = [
  {
    start_hour: 0,
    duration_hours: 8,
    host: 'Michael & Chris',
    name: 'Real-life sunrise & sunset',
    text: 'Come share with us your sunrises and sunsets from all over the world.',
    interactivity: 'low',
  },
];

export const LINEUP = {
  rooms: [
    {
      name: 'Party Starts Here',
      title: 'Party Starts Here',
      on_list: false,
      on_map: false,
      url: '/',
      path: 'M 103.34963568143598 2619.2178821632797 C 200.47417707175768 2516.007375498673 374.4675154390775 2459.0556873770656 518.9537353515625 2477.3681640625 C 628.4211262261107 2491.2422832997513 730.4211882016716 2566.6207524640786 696.7603759765625 2698.99169921875 C 686.8392942780356 2738.006294840564 631.6245178257464 2778.7123978089794 601.1869506835938 2801.168212890625 C 486.87261207540746 2885.505493757302 262.1880525878259 2938.184943993999 147.86146545410156 2825.977294921875 C 117.66204716751457 2796.3375950564355 89.46888833128847 2638.1455078125 112.43914031982422 2638.1455078125',
    },
    {
      name: 'Lost Soul Chamber',
      title: 'Lost? Come to the Lost Soul Chamber!',
      on_list: false,
      on_map: true,
      url: 'https://us02web.zoom.us/j/82251109039?pwd=cTNweWQyZVU1dGNlNFowOEloYVVjUT09',
      path: 'M 160.54069858433604 3362.4291775691463 C 173.0866990748163 3333.1003071694004 206.61424236052974 3323.9419498761413 235.92852783203125 3312.072509765625 C 257.3814281754849 3303.386167535962 276.0505538586773 3295.144267477855 299.2745666503906 3291.15869140625 C 315.3089419769088 3288.406960979745 356.2219555587389 3278.1315466270257 372.4403076171875 3286.24072265625 C 444.1022691622238 3322.071703428768 445.4221076848638 3410.7829237299934 479.1498718261719 3478.239501953125 C 492.0123554776973 3503.964869663468 536.8089175026862 3574.417430040139 520.536376953125 3605.74853515625 C 509.7725088716804 3626.4732573524275 424.84033083267997 3639.051663150915 404.4972839355469 3641.579833984375 C 319.03247173893396 3652.2011360231113 195.46177320662744 3664.8907851421345 155.72071838378906 3565.015625 C 134.35756793665357 3511.326862042908 130.70864215327455 3439.7388138191873 154.34823608398438 3391.300048828125 C 157.30666367846632 3385.2380758766344 153.69337982518581 3356.80859375 162.4523468017578 3356.80859375',
      events: lost_soul_chamber_events,
    },
    {
      name: 'Rabbit Hole - Entrance Experience',
      title: 'Rabbit Hole - Re-enter the Party Here if you need to!',
      on_list: true,
      on_map: true,
      url: 'https://us02web.zoom.us/j/89864208695?pwd=TThzMkl5Rk84NEFiRW93MGs0eUdlUT09',
      path: 'M 625.0278034091177 3516.4500923136166 C 625.02783203125 3479.538233734821 619.8412478461694 3436.5873777738925 625.02783203125 3399.56982421875 C 635.1832473385055 3327.088858597404 757.1947647155353 3272.4410586690633 809.5714111328125 3242.56201171875 C 868.934920432852 3208.6972035868926 924.3635930787267 3160.501856799863 994.6497192382812 3149.822265625 C 1176.7840750943847 3122.147949714849 1315.0595485072909 3193.2969878411773 1343.4993896484375 3383.26220703125 C 1350.2834890767363 3428.5769093359504 1353.1647049286803 3493.5201459627474 1345.4510498046875 3539.173828125 C 1335.3817497662267 3598.769521238423 1314.1468443738459 3678.0126078878607 1268.5911865234375 3723.156005859375 C 1203.7614077784922 3787.3991018958436 1012.0357435465648 3756.305908203125 927.7883911132812 3756.305908203125 C 840.2719683768435 3756.305908203125 719.2224814293378 3769.443733870744 653.0983276367188 3703.319580078125 C 576.0480291220396 3626.269281563446 622.0336303710938 3576.75855820217 622.0336303710938 3501.906982421875',
    },
    {
      name: 'The Roots',
      title: 'The Roots - Underground Below The Tree of Life',
      on_list: true,
      on_map: true,
      url: 'https://us02web.zoom.us/j/88672357751?pwd=bjlySGMwVlhod3ZDMEZnWFdXc0VNZz09',
      path: 'M 878.3842873494855 2859.6534164196673 C 878.38427734375 2902.8960495203796 865.4193501988497 2983.4077887560447 898.3544311523438 3016.848388671875 C 964.8105254188455 3084.324514310456 1105.5796089408232 3037.825375602309 1190.55517578125 3052.350830078125 C 1302.7707366299082 3071.532602924033 1373.0571809495434 3189.610390292137 1490.0543212890625 3202.140380859375 C 1722.3223085017985 3227.0154819122845 1925.467484803804 3112.809312276109 2150.56689453125 3088.68212890625 C 2286.378546418528 3074.125215439372 2412.3210704481444 3097.7751523965644 2539.4638671875 3131.670166015625 C 2577.8417673365957 3141.901335075806 2604.1708168511377 3128.1552953802443 2609.42626953125 3087.425537109375 C 2637.7458506554303 2867.948783396979 2438.595512562865 2806.479736328125 2254.9892578125 2806.479736328125 C 2131.321065564491 2806.479736328125 2009.2856852497223 2775.3990117169446 1883.68310546875 2788.568115234375 C 1674.3450278156115 2810.516667720808 1463.2234792361537 2813.767843240454 1256.34716796875 2775.73583984375 C 1165.1286334952988 2758.9662851679013 1045.4577035677355 2783.6152803821897 962.4888916015625 2809.206787109375 C 930.7810782161026 2818.986976801487 879.1185558504563 2822.2196205806567 862.6915283203125 2854.280029296875 C 856.6332730665943 2866.1038446027765 893.4888916015625 2867.1095803339445 893.4888916015625 2874.330322265625',
      events: roots_events,
    },
    {
      name: 'Upside Down Room - The Bat Cave 🦇',
      title: 'Upside Down Room - The Bat Cave 🦇',
      on_list: true,
      on_map: true,
      url: 'https://us02web.zoom.us/j/81019504786?pwd=Ulhtd1JTM2syVHJkOTVJRkh1cUZ1Zz09',
      path: 'M 1559.1612065793543 3549.1188296118257 C 1579.8857741029633 3459.011768279796 1674.2961220732464 3415.8814914341838 1735.230224609375 3354.3896484375 C 1879.3075595569399 3208.9935485323062 2004.465432325158 3197.5452795273636 2191.068603515625 3161.7724609375 C 2235.9080913649486 3153.176493064805 2309.5734817961134 3144.1928753512757 2355.722412109375 3155.73046875 C 2558.7239564479614 3206.4824420242035 2781.273170146047 3433.17088860904 2734.326904296875 3656.8828125 C 2717.824238717075 3735.5225722211944 2586.324062845213 3713.201462807033 2526.47119140625 3721.953125 C 2312.6682284558747 3753.2153061220083 2050.1412401608445 3792.009358917086 1840.294189453125 3732.0048828125 C 1770.0967138360697 3711.932345533276 1676.691005365758 3669.727126252041 1617.7884521484375 3630.656982421875 C 1609.5490368420071 3625.191767019225 1545.6116706843168 3555.58837890625 1574.85400390625 3555.58837890625',
      events: upside_down_room_events,
    },
    {
      name: 'Funk in the Trunk',
      title: 'Funk in the Trunk',
      on_list: true,
      on_map: true,
      url: 'https://us02web.zoom.us/j/88068069004?pwd=UFZMMjJzWXliZ1owL3pBM1dsMGNGQT09',
      path: 'M 1282.1987528891345 2672.9176307993794 C 1282.19873046875 2853.0911393730507 1599.1981280729015 2792.498046875 1721.75634765625 2792.498046875 C 1769.5717450483753 2792.498046875 1828.6764268192 2801.720222094344 1874.13916015625 2786.3759765625 C 1950.4782903911255 2760.610557899105 2037.5633516389516 2731.736544108625 2020.18603515625 2640.623046875 C 1994.8123730827858 2507.5827646519715 1860.6107046091365 2372.229566936859 1728.5467529296875 2346.0966796875 C 1678.8861956331732 2336.2698213505623 1620.0212741415817 2297.059544648299 1564.9891357421875 2314.8447265625 C 1462.0508789841915 2348.112116775195 1356.863103585546 2493.575087192284 1309.8682861328125 2584.054443359375 C 1305.2212546938506 2593.001396140038 1269.7424848274047 2713.392578125 1291.154541015625 2713.392578125',
      events: funk_in_the_trunk_events,
    },
    {
      name: 'Heart Room 💚',
      title: 'Heart Room 💚',
      on_list: true,
      on_map: true,
      url: 'https://us02web.zoom.us/j/82550216130?pwd=OUtuQWxxM01BVWM5cjNzSDVpbUp1QT09',
      path: 'M 1069.0527652068631 1665.5093908606664 C 1065.3263436575132 1603.6622363459198 1058.4114101897476 1541.079696554658 1090.1190185546875 1487.007568359375 C 1113.5147191248586 1447.1100363257835 1209.610326822914 1421.3807684906662 1251.6715087890625 1409.8804931640625 C 1427.41201825836 1361.8299118332495 1684.2523045581204 1372.1518983706083 1804.5003662109375 1532.4818115234375 C 1843.5714047934991 1584.5762580918924 1828.4758461841448 1676.6488181360594 1802.01416015625 1729.2427978515625 C 1773.2732213503614 1786.3669112193936 1756.2660878783063 1849.9859848472543 1716.7598876953125 1902.1839599609375 C 1668.3904637349415 1966.0925610527097 1569.4149116229164 1999.8483584270716 1495.991943359375 2024.4912109375 C 1446.6949347973732 2041.0366999027283 1376.5724454293795 2082.5388875190642 1321.7408447265625 2061.223388671875 C 1250.0000637144512 2033.3345341544186 1133.807210922124 1931.2954628399661 1105.4107666015625 1860.2119140625 C 1090.481323196728 1822.839706242821 1092.702884036317 1710.1722443878796 1064.88232421875 1682.3516845703125',
      events: heart_room_events,
    },
    {
      name: 'The Mood Swing',
      title: 'The Mood Swing',
      on_list: true,
      on_map: true,
      url: 'https://us02web.zoom.us/j/81353086776?pwd=a2p0UXZNMVZHVDA3OUVJM1pKS0hXdz09',
      path: 'M 316.444975291932 2058.422381095738 C 316.4449768066406 2034.73278191323 303.17013195615107 1946.0966501290006 318.26287841796875 1925.6087646484375 C 338.68445792412837 1897.8871711456984 389.27163584571866 1884.3230525617291 419.3969421386719 1871.232177734375 C 529.5481417854464 1823.3662555546518 712.2357644800364 1735.351603988127 825.617431640625 1818.9942626953125 C 897.4851518362486 1872.0117155421829 911.8769994019077 2071.517011818892 898.0393676757812 2151.77685546875 C 866.6062220857405 2334.0926881496152 504.35373102232563 2340.706392362396 379.67047119140625 2253.31201171875 C 326.22452621629196 2215.850084068249 310.79419628995703 2161.139258909404 293.5340881347656 2106.008544921875 C 287.0909180216899 2085.4283396599435 331.07243752761735 2045.888314528865 329.6514892578125 2044.46728515625 C 324.4053442600596 2039.2208407266942 314.43994140625 2043.211462534469 314.43994140625 2035.618408203125',
      events: mood_swing_events,
    },
    {
      name: 'The Treehouse',
      title: 'The Treehouse',
      on_list: true,
      on_map: true,
      url: 'https://us02web.zoom.us/j/83985212358?pwd=VS8zS0N6UjhhZlZrNjVhUXhLUWFxUT09',
      path: 'M 195.6318844623496 1088.5904612254255 C 277.82280556034345 1088.5904541015625 379.49997307996995 1054.7397642383073 459.254150390625 1074.9561767578125 C 625.1282499174101 1117.0026166486412 809.3984714893745 1101.7435302734375 985.6165161132812 1101.7435302734375 C 1061.6516668328165 1101.7435302734375 1273.965473891992 1057.876436220699 1224.3763427734375 1199.9368896484375 C 1189.2593302857424 1300.5383441305248 1033.354074496402 1332.005241780465 938.35107421875 1344.5401611328125 C 861.1166037209003 1354.7306588653305 785.0482001076584 1396.2666888080373 711.380859375 1420.2236328125 C 539.0183784597688 1476.2766715497303 283.6851930999063 1541.4694212980858 105.59235382080078 1484.4114990234375 C 75.34005395950892 1474.7191757323828 91.48818306349324 1425.2668742299481 99.44357299804688 1405.09228515625 C 129.96298520632095 1327.6961291993407 116.11055743163067 1235.9575933366875 135.77484130859375 1156.76171875 C 141.1316459720422 1135.1877406195863 165.99261972599066 1106.6744226049955 184.43040466308594 1097.1719970703125 C 195.4123835282021 1091.5121286671795 208.65126037597656 1069.0043718278296 208.65126037597656 1077.9237060546875',
      events: treehouse_events,
    },
    {
      name: 'The Beehive 🔥🐝🐝🐝',
      title: 'The Beehive 🔥🐝🐝🐝',
      on_list: true,
      on_map: true,
      url: 'https://us02web.zoom.us/j/87381955525?pwd=d0VBQ0FBazRDR0NOanFyN09hVm5YUT09',
      path: 'M 2111.992846612543 1818.9051629541336 C 2149.630450218656 1680.0615079839579 2342.190462393759 1651.9404129322752 2449.64111328125 1713.7877197265625 C 2539.830214758106 1765.6994855694775 2566.1855761757593 1912.5246693335655 2588.3896484375 2001.3367919921875 C 2598.7372037900686 2042.725071779616 2609.1855239307706 2135.7968051816283 2580.556640625 2169.733154296875 C 2548.3178444767454 2207.948652591281 2463.976960200711 2191.841024241332 2419.45849609375 2199.4345703125 C 2349.3813967647316 2211.387670963282 2202.637575362857 2225.0033501862945 2153.109375 2158.799072265625 C 2134.5187020905446 2133.948945125677 2133.1275910766076 2103.277984162525 2119.87939453125 2076.77978515625 C 2114.0425314608055 2065.105263368814 2115.202276443879 2026.906726592707 2113.97119140625 2014.3294677734375 C 2110.5999480644678 1979.887492803128 2104.5884235193985 1792.4654541015625 2130.519287109375 1792.4654541015625',
      events: beehive_events,
    },
    {
      name: 'The Canopy',
      title: 'Climb up to the canopy for gazing into the great beyond. Join us for deep conversations about consciousness, the nature of reality, psychedelic experiences and amazing after-party sound medicine healing.',
      on_list: true,
      on_map: true,
      url: 'https://us02web.zoom.us/j/84339095111?pwd=dytid01RY2dCbTJ4S2lOeVB2THJzdz09',
      path: 'M 2298.541495439797 659.4055933158904 C 2222.322137909433 656.0982790428228 2057.338948587923 626.0006338347279 1992.7867431640625 674.0289916992188 C 1959.9018477147185 698.4961267352228 1945.733260927631 744.610041463349 1927.716552734375 780.5365600585938 C 1868.5923942192176 898.4340781589373 1820.5127158770683 1016.5178291884536 1910.2059326171875 1135.6954345703125 C 1956.9806122154585 1197.8461134023291 2036.8116515654829 1202.2894287109375 2107.554931640625 1202.2894287109375 C 2224.0822960676546 1202.2894287109375 2338.7572116431675 1206.56689453125 2455.041259765625 1206.56689453125 C 2507.0750263189175 1206.56689453125 2576.894877868067 1201.3441240598145 2622.341552734375 1171.1177978515625 C 2675.452739838563 1135.793847937928 2658.646240234375 1049.223623874646 2658.646240234375 994.7814331054688 C 2658.646240234375 887.6003917583706 2682.478905507281 754.8200696893501 2588.656982421875 684.2947998046875 C 2523.5329003116553 635.3414921365718 2420.5140181006113 595.1897860420324 2351.8486328125 630.0518798828125 C 2333.795644062734 639.2175604547651 2283.142822265625 630.648353171254 2283.142822265625 645.7713623046875',
      events: canopy_events,
    },
    {
      name: 'The Compost Heap (Toilets Here)',
      title: 'Compost Heap (Toilets Here)',
      on_list: true,
      on_map: true,
      url: 'https://us02web.zoom.us/j/81835132191?pwd=RWpOOWM3cGpXNURDQzJNd0EyV2hMUT09',
      path: 'M 2138.830789915747 2503.4251639657896 C 2203.6863072849706 2483.9595318749575 2255.8014877476753 2441.661556181118 2318.4287109375 2423.97216796875 C 2380.211607444113 2406.5212642638635 2456.5106242776924 2415.71142578125 2521.33837890625 2415.71142578125 C 2551.3815713195486 2415.71142578125 2646.1489661995856 2410.049296004643 2662.76025390625 2443.274169921875 C 2688.732989128695 2495.2232342141738 2677.8307636992977 2555.583707719901 2696.8994140625 2612.23193359375 C 2707.706131862602 2644.33600909122 2717.6988712710704 2716.0912600892084 2706.523681640625 2751.648681640625 C 2688.412248809434 2809.2759679216874 2622.9769028630326 2805.544189453125 2572.720703125 2805.544189453125 C 2459.2877161656975 2805.544189453125 2294.30101694 2774.1384235090622 2196.014404296875 2724.9951171875 C 2149.038260832066 2701.5070454550955 2113.54052734375 2618.615791129309 2113.54052734375 2570.36669921875 C 2113.54052734375 2523.9723747958524 2114.5113383345597 2547.430428803035 2142.252685546875 2533.447265625 C 2147.808556741301 2530.6468012887435 2156.26123046875 2493.0322229261865 2156.26123046875 2512.033447265625',
      events: compost_heap_events,
    },
    {
      name: 'Sunset Room',
      title: 'Sunset Room - Sunrises and Sunsets from all over the world',
      on_list: true,
      on_map: true,
      url: 'https://us02web.zoom.us/j/83141633570?pwd=bk1sWWJrSlFlVHRKUyt3R0pLMk5EZz09',
      path: 'M 317.263 416.699 C 349.319 338.788 407.46 335.261 472.135 315.394 C 663.145 256.719 807.601 299.218 992.016 389.583 C 1093.048 439.09 1238.093 495.435 1199.91 667.592 C 1173.176 788.126 1083.451 912.832 1018.394 1008.23 C 990.67 1048.885 958.848 1120.03 910.557 1134.018 C 773.346 1173.763 543.462 1155.828 424.337 1063.206 C 321.216 983.029 310.985 746.992 310.985 613.391 C 310.985 570.443 297.381 431.155 323.119 400.43 C 327.854 394.778 330.215 414.781 330.215 422.711',
      events: sunset_room_events,
    },
    {
      name: 'Letterbox',
      title: 'Letterbox',
      on_list: false,
      on_map: true,
      url: 'https://www.youtube.com/watch?v=VDndE432GpU',
      path: 'M 1168.6986170498312 2393.147733604849 C 1159.2449973838782 2354.839881408881 1160.837246576575 2314.8028075328125 1153.75439453125 2276.695068359375 C 1148.8415991670297 2250.262845413852 1132.241333308931 2171.4292815131535 1147.63232421875 2145.271728515625 C 1165.835460986953 2114.3348305910245 1296.8258988333089 2129.663397421762 1325.3321533203125 2143.6943359375 C 1340.410538858404 2151.1160019616354 1340.5356264728364 2217.217836700831 1344.5269775390625 2232.69140625 C 1382.2467096110465 2378.92231601152 1279.461632303044 2391.0625 1167.3084716796875 2391.0625',
    },
    {
      name: 'Apple of my Eye 👁',
      title: 'Apple of my Eye 👁',
      on_list: false,
      on_map: true,
      url: 'https://www.youtube.com/watch?v=jVhcEh-lOGk',
      path: 'M 2511.690302705446 1567.1527086683425 C 2511.690185546875 1634.7958506743905 2535.7605830495436 1689.8731637285407 2608.14599609375 1707.6923828125 C 2635.573129010213 1714.4441587536671 2671.803327009319 1722.3368073494803 2686.850341796875 1691.7857666015625 C 2718.5310634761267 1627.4621095432396 2734.915807957848 1404.907017177149 2603.253662109375 1438.8837890625 C 2569.5085062339854 1447.5920738623943 2480.936565102747 1555.914592446497 2518.42724609375 1593.4052734375',
    },
  ],
};