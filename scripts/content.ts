export interface FAQ { q: string; a: string }
export interface KV { label: string; value: string }

export interface SeedCountry {
  slug: string;
  name: string;
  heroTitle: string;
  heroKicker: string;
  metaTitle: string;
  metaDescription: string;
  intro: string;
  bestTime: string;
  currency: string;
  languages: string;
  imageKey: string;
  highlights: { title: string; body: string }[];
  faqs: FAQ[];
}

export interface SeedRegion {
  slug: string;
  countrySlug: string;
  name: string;
  displayName: string;
  tagline: string;
  metaTitle: string;
  metaDescription: string;
  intro: string;
  lat: number; lng: number;
  imageKey: string;
  knownFor: string[];
  faqs: FAQ[];
}

export interface SeedAttraction {
  slug: string;
  regionSlug: string;
  name: string;
  category: string;
  shortDescription: string;
  body: string;
  metaTitle: string;
  metaDescription: string;
  lat: number; lng: number;
  imageKey: string;
  practical: KV[];
  faqs: FAQ[];
}

export interface SeedItinerary {
  slug: string;
  title: string;
  subtitle: string;
  durationDays: number;
  regionSlugs: string[];
  summary: string;
  metaTitle: string;
  metaDescription: string;
  priceFromUsd: number;
  imageKey: string;
  days: { day: number; title: string; body: string; attractionSlugs: string[] }[];
  includes: string[];
  faqs: FAQ[];
}

export const countries: SeedCountry[] = [
  {
    slug: "morocco",
    name: "Morocco",
    heroTitle: "Morocco, where three worlds meet",
    heroKicker: "The far west of the Arab world",
    metaTitle: "Morocco Travel Guide | Cities, Sahara & Atlas",
    metaDescription:
      "Plan a trip to Morocco: Marrakech and Fès medinas, the Sahara at Merzouga, the High Atlas and the blue city of Chefchaouen. Best times, routes and advice.",
    intro:
      "Morocco sits at the corner where the Mediterranean, the Atlantic and the Sahara press against one another, a day's drive from Spain yet unmistakably African. The country has kept its medieval cities intact: Fès el-Bali is the largest car-free urban area in the world, and Marrakech still trades under the same city walls the Almoravids raised in the eleventh century. Between the two run the snow-capped ridges of the High Atlas, and beyond them the sand.\n\nWhat holds it together is a layered culture, Amazigh (Berber) at the root, Arab since the seventh century, with Andalusian, Jewish and French additions folded in over time. You taste it in a tagine slow-cooked with preserved lemon, hear it in the call to prayer over Chefchaouen, and see it in the geometry of the zellij tilework that gives this kind of travel its name."
    ,
    bestTime: "March to May and September to November",
    currency: "Moroccan dirham (MAD)",
    languages: "Arabic, Amazigh (Berber), French",
    imageKey: "morocco",
    highlights: [
      {
        title: "Living medieval cities",
        body:
          "The medinas of Fès and Marrakech are working cities, not open-air museums. Donkeys still carry hides to the tanneries, and craftsmen work copper and cedar in the same lanes their grandfathers did."
      },
      {
        title: "The Sahara at Merzouga",
        body:
          "The dunes of Erg Chebbi rise nearly 150 metres above the plain near the Algerian border. A camel ride to a desert camp for one night, sleeping under a sky with no light pollution, is the classic Moroccan splurge."
      },
      {
        title: "The High Atlas",
        body:
          "North Africa's highest range tops out at Jebel Toubkal, 4,167 metres. Berber villages of pisé and stone cling to the valley walls, and the trailheads at Imlil are only 90 minutes from Marrakech."
      },
      {
        title: "A craft tradition worth buying into",
        body:
          "Fès leather, Safi ceramics, Tazenakht rugs and the argan oil of the Souss are made by hand and sold in the souks. Prices are negotiable, and quality varies, so buy from cooperatives where you can."
      }
    ],
    faqs: [
      {
        q: "Do I need a visa to visit Morocco?",
        a: "Citizens of the US, UK, EU, Canada and Australia can enter visa-free for up to 90 days. You need a passport valid for at least six months from your date of entry."
      },
      {
        q: "Is Morocco safe for travelers?",
        a: "Yes, for ordinary tourism it is one of the safer countries in the region. The usual caution against pickpockets and pushy touts in busy medinas applies, but violent crime against visitors is rare."
      },
      {
        q: "What should I wear in Morocco?",
        a: "Morocco is a Muslim country and dressing modestly, shoulders and knees covered, is respectful and draws less attention, especially away from the coast. Women do not need to cover their hair except inside a working mosque, which most are closed to non-Muslims anyway."
      },
      {
        q: "Can non-Muslims enter mosques in Morocco?",
        a: "Almost never. The Hassan II Mosque in Casablanca and the Tin Mal mosque in the Atlas are the main exceptions open to non-Muslim visitors on guided tours. You can admire the rest, like the Koutoubia, only from outside."
      }
    ]
  }
];

export const regions: SeedRegion[] = [
  {
    slug: "marrakech-safi",
    countrySlug: "morocco",
    name: "Marrakech-Safi",
    displayName: "Marrakech & the Red City",
    tagline: "The Almoravid capital, its walls the colour of the plain around it",
    metaTitle: "Marrakech Travel Guide | The Red City & Medina",
    metaDescription:
      "What to see in Marrakech: Jemaa el-Fnaa, Bahia Palace, Jardin Majorelle and the Koutoubia. How long to stay, where the medina meets Gueliz, and when to go.",
    intro:
      "Marrakech was founded around 1070 by the Almoravids and took its colour from the red earth of the Haouz plain, which the builders packed into the ramparts and never plastered over. For four centuries it was the seat of dynasties, and the money left behind palaces, tombs and the Koutoubia minaret that still sets the skyline. The old walled city, the medina, is where most visitors spend their time, converging each evening on the square called Jemaa el-Fnaa.\n\nA short taxi ride away is Gueliz, the new town the French laid out in the 1910s, now full of galleries, wine bars and the restored Jardin Majorelle. The contrast is the point: you can spend a morning bargaining for slippers in the Semmarine souk and the afternoon at a rooftop café in the ville nouvelle. Marrakech is also the natural base for the High Atlas and the road to the Sahara, which is why so many trips begin here."
    ,
    lat: 31.63, lng: -7.99,
    imageKey: "marrakech",
    knownFor: [
      "Jemaa el-Fnaa at dusk",
      "The souks of the medina",
      "Bahia and El Badi palaces",
      "Jardin Majorelle and YSL",
      "Riads with tiled courtyards",
      "Gateway to the Atlas and Sahara"
    ],
    faqs: [
      {
        q: "How many days do you need in Marrakech?",
        a: "Three days is the sweet spot: one for the medina and souks, one for the palaces and gardens, and one for a day trip to the Ourika Valley or the Atlas foothills."
      },
      {
        q: "Is it better to stay in a riad or a hotel in Marrakech?",
        a: "A riad, a traditional house built around a courtyard, puts you inside the medina within walking distance of the square. Choose a modern hotel in Gueliz or the Palmeraie if you want a pool, parking and quiet."
      },
      {
        q: "Is Jemaa el-Fnaa safe at night?",
        a: "Yes, the square is busy and well-lit until late and is fine to explore. Keep your bag zipped in the crowds, agree a price before you photograph a performer, and be ready to say no firmly to henna artists."
      }
    ]
  },
  {
    slug: "fes-meknes",
    countrySlug: "morocco",
    name: "Fès-Meknès",
    displayName: "Fès & Meknès, the imperial north",
    tagline: "The country's oldest imperial city and its intellectual heart",
    metaTitle: "Fès & Meknès Guide | Morocco's Imperial North",
    metaDescription:
      "Explore Fès el-Bali, the world's largest car-free medina, the Chouara tannery and Al-Qarawiyyin, plus Meknès and Roman Volubilis nearby. Planning advice.",
    intro:
      "Fès was founded in the late eighth century and for a thousand years was Morocco's capital of learning. Its university mosque, Al-Qarawiyyin, dates from 859 and is often cited as the oldest continuously operating degree-granting institution in the world. The old city, Fès el-Bali, has perhaps 9,000 lanes and no cars: goods still move on the backs of mules, and the tanneries dye leather in stone vats much as they did in the Middle Ages.\n\nMeknès, an hour to the west, was rebuilt on a grand scale by Sultan Moulay Ismail around 1700, with monumental gates and granaries meant to rival Versailles. Nearby stand the Roman ruins of Volubilis, the mosaics still in place under an open sky. Fès sees fewer package tourists than Marrakech and rewards a slower pace, ideally with a local guide for at least the first morning in the labyrinth."
    ,
    lat: 34.04, lng: -5.00,
    imageKey: "fes",
    knownFor: [
      "Fès el-Bali, the great medina",
      "The Chouara leather tannery",
      "Al-Qarawiyyin, founded 859",
      "The Bou Inania madrasa",
      "Meknès and its imperial gates",
      "Roman Volubilis nearby"
    ],
    faqs: [
      {
        q: "Do I need a guide for the Fès medina?",
        a: "For your first foray, yes. The maze is genuinely disorienting and a licensed guide, booked through your riad, will save you hours and steer you to the workshops worth seeing. After a day you can wander on your own."
      },
      {
        q: "Is the smell at the tannery really that bad?",
        a: "It is strong, a mix of ammonia and pigeon droppings used to soften the hides. Vendors hand you a sprig of mint to hold under your nose, and most people find it bearable for the ten minutes it takes to look."
      },
      {
        q: "Is Fès or Marrakech better to visit?",
        a: "Fès is more medieval and less commercial, better for craft and history. Marrakech is livelier, better connected and closer to the mountains and desert. With a week you can and should see both."
      }
    ]
  },
  {
    slug: "draa-tafilalet",
    countrySlug: "morocco",
    name: "Drâa-Tafilalet",
    displayName: "The Sahara & the road of a thousand kasbahs",
    tagline: "Palm-lined valleys, red mud fortresses and the dunes at Merzouga",
    metaTitle: "Sahara & Kasbahs Guide | Drâa-Tafilalet, Morocco",
    metaDescription:
      "Cross the Atlas to Aït Benhaddou, Ouarzazate, the Todra Gorge and the Erg Chebbi dunes at Merzouga. How many days for the Sahara and what to expect.",
    intro:
      "South of the High Atlas the land turns red and dry, cut by two great palm-fringed valleys, the Drâa and the Dadès. This is the country of the kasbahs, the fortified earthen houses of clay and straw that gave the route between Ouarzazate and the desert its nickname, the road of a thousand kasbahs. Ouarzazate itself is Morocco's film capital, its studios standing in for ancient Egypt, Tibet and Judea in dozens of productions.\n\nThe road climbs through the Todra Gorge, where limestone walls rise 300 metres and narrow to a corridor barely ten metres wide, then runs east to Merzouga and the dunes of Erg Chebbi. This is where most travelers meet the Sahara, riding a camel out to a tented camp for a night under the stars. It is a long way from Marrakech, a full day of driving each way, so give the south the time it needs."
    ,
    lat: 31.28, lng: -4.28,
    imageKey: "sahara",
    knownFor: [
      "Erg Chebbi dunes at Merzouga",
      "Aït Benhaddou, a UNESCO ksar",
      "The Todra and Dadès gorges",
      "Ouarzazate film studios",
      "Overnight desert camps",
      "The Drâa Valley palm groves"
    ],
    faqs: [
      {
        q: "How many days do you need in the Sahara?",
        a: "Plan on at least two nights out of Marrakech to reach Merzouga comfortably: one night on the road, usually near the Dadès or Todra Gorge, and one night in a desert camp. Rushing it as a single overnight means eight hours of driving each way."
      },
      {
        q: "Is Aït Benhaddou worth the stop?",
        a: "Yes. The ksar is a UNESCO World Heritage site and one of the best-preserved earthen fortresses in the south, familiar from Gladiator and Game of Thrones. It sits right on the road to Ouarzazate, so it costs you little detour."
      },
      {
        q: "When is the best time to visit the desert?",
        a: "October to April, when daytime heat is manageable and desert nights are clear. Summer is punishing, often above 40 degrees Celsius by day, though the nights cool off fast year-round, so pack a layer even in warm months."
      }
    ]
  },
  {
    slug: "tanger-tetouan",
    countrySlug: "morocco",
    name: "Tanger-Tétouan-Al Hoceïma",
    displayName: "Tangier, Tétouan & the blue city",
    tagline: "Where the Mediterranean meets the Atlantic, and Chefchaouen glows blue",
    metaTitle: "Tangier & Chefchaouen Guide | Morocco's North",
    metaDescription:
      "The Mediterranean north: cosmopolitan Tangier, whitewashed Tétouan and the blue streets of Chefchaouen in the Rif mountains. Routes and timing advice.",
    intro:
      "The far north of Morocco looks toward Spain, 14 kilometres across the Strait of Gibraltar, and has always been a place apart. Tangier spent much of the twentieth century as an international zone with its own rules, drawing writers from Paul Bowles to William Burroughs, and its medina still has a raffish, port-town character. Tétouan, whitewashed and Andalusian in feel, holds a UNESCO-listed medina built by refugees from Muslim Spain.\n\nInland, in the folds of the Rif mountains, sits Chefchaouen, the blue city, where the walls of the old town are painted every shade from powder to indigo. It is small, walkable and photogenic to the point of cliché, and it makes an easy overnight from Fès or a longer stay for hikers heading into the Rif. The north is greener and cooler than the rest of the country, and its rhythm is slower."
    ,
    lat: 35.17, lng: -5.27,
    imageKey: "chefchaouen",
    knownFor: [
      "Chefchaouen's blue-washed lanes",
      "Tangier's medina and kasbah",
      "The Strait of Gibraltar",
      "Tétouan's Andalusian medina",
      "Cool Rif mountain air",
      "Mediterranean beaches"
    ],
    faqs: [
      {
        q: "Is Chefchaouen worth a day trip from Fès?",
        a: "It is doable in a long day, around four hours each way, but the town is at its best in early morning and late afternoon when the day-trippers have gone. If you can spare it, stay one night."
      },
      {
        q: "Why is Chefchaouen painted blue?",
        a: "Nobody is certain. Explanations range from a Jewish tradition brought by refugees in the 1930s, to keeping mosquitoes away, to simply keeping the walls cool. Whatever the origin, residents now repaint it each year and it draws visitors for that reason alone."
      },
      {
        q: "How do I get from Tangier to Chefchaouen?",
        a: "It is about two hours by road. Frequent buses run the route, or you can hire a car or grand taxi. Tangier itself is 2.5 hours from Casablanca on the high-speed Al Boraq train."
      }
    ]
  },
  {
    slug: "marrakech-atlas",
    countrySlug: "morocco",
    name: "The High Atlas",
    displayName: "The High Atlas & Ourika Valley",
    tagline: "Snow peaks, Berber villages and North Africa's highest summit",
    metaTitle: "High Atlas & Ourika Valley Guide | Morocco Trekking",
    metaDescription:
      "Trek the High Atlas from Imlil to Jebel Toubkal, or take an easy day in the Ourika Valley from Marrakech. Berber villages, waterfalls and walking advice.",
    intro:
      "The High Atlas is the spine of Morocco, a wall of rock that separates the fertile north from the Sahara and rises to 4,167 metres at Jebel Toubkal, the highest peak in North Africa. Its slopes are terraced with walnut and cherry, and its villages, built of stone and pisé, are Amazigh (Berber) to the core, many still reached only on foot or by mule. From the trailhead village of Imlil, fit walkers summit Toubkal over two days.\n\nCloser to the city, the Ourika Valley makes an easy half-day escape: a green river gorge an hour from Marrakech, with roadside cafés built out over the water and a chain of waterfalls above the village of Setti Fatma. You do not need to be a trekker to enjoy the mountains here. A short walk to a Berber home for mint tea and a tagine is one of the best days you can have near Marrakech."
    ,
    lat: 31.36, lng: -7.68,
    imageKey: "atlas-mountains",
    knownFor: [
      "Jebel Toubkal, 4,167 metres",
      "Imlil, the trekking base",
      "Berber mountain villages",
      "Setti Fatma waterfalls",
      "Ourika Valley day trips",
      "Walnut and cherry terraces"
    ],
    faqs: [
      {
        q: "Do you need to be experienced to climb Toubkal?",
        a: "No technical skill is required in summer, but it is a serious two-day walk at altitude, and you should be fit. From November to April the summit needs crampons, an ice axe and a guide. A local mountain guide is mandatory by regulation for the ascent."
      },
      {
        q: "Is the Ourika Valley worth visiting from Marrakech?",
        a: "Yes, for an easy nature break within an hour of the city. It gets busy with locals on Fridays and weekends, so go early on a weekday for the quietest walk to the Setti Fatma falls."
      },
      {
        q: "When is there snow in the High Atlas?",
        a: "The high peaks hold snow from roughly December to April, and the small resort of Oukaïmeden even runs ski lifts. Spring brings meltwater to the Ourika river and wildflowers to the valleys, which is the prettiest time to walk."
      }
    ]
  }
];

export const attractions: SeedAttraction[] = [
  {
    slug: "jemaa-el-fnaa",
    regionSlug: "marrakech-safi",
    name: "Jemaa el-Fnaa",
    category: "Medina",
    shortDescription:
      "Marrakech's great square, a market by day and an open-air theatre of food stalls, musicians and storytellers by night.",
    body:
      "Jemaa el-Fnaa has been the heart of Marrakech since the city's founding, a wide plaza at the edge of the medina where the desert caravans once unloaded. By day it is orange-juice carts, snake charmers and water sellers in fringed hats. The show starts at dusk, when scores of food stalls are wheeled in, grills fired up, and the square fills with Gnaoua musicians, henna artists and halqa storytellers working the crowd in Arabic.\n\nUNESCO named the square's oral traditions a Masterpiece of the Intangible Heritage of Humanity in 2001, the first place ever so listed. That said, it is also a working tourist scene, and the performers expect payment. Agree a few dirhams before you photograph anyone, and be firm with the henna women who reach for your hand.\n\nThe best view is from above. The rooftop cafés along the eastern edge, Café de France and Le Grand Balcon among them, charge a small premium for a mint tea and a table over the railing, worth it for the sweep of the square as the light goes and the smoke rises from the grills."
    ,
    metaTitle: "Jemaa el-Fnaa, Marrakech | The Great Square",
    metaDescription:
      "Marrakech's Jemaa el-Fnaa: food stalls, musicians and storytellers at dusk. When to go, rooftop views and how to handle the performers. A visitor's guide.",
    lat: 31.6258, lng: -7.9891,
    imageKey: "jemaa-el-fnaa",
    practical: [
      { label: "Best time", value: "One hour before sunset, when the food stalls open" },
      { label: "Entry", value: "Free" },
      { label: "Rooftop view", value: "Cafés on the east side, cost of a drink" },
      { label: "Getting there", value: "Walkable from anywhere in the medina" }
    ],
    faqs: [
      {
        q: "Is it safe to eat at the food stalls?",
        a: "Generally yes. Choose stalls that are busy with locals and cooking to order, where turnover is high. Stall 14 and the surrounding snail-soup and grilled-meat vendors are long-running favourites."
      },
      {
        q: "Do I have to pay to take photos?",
        a: "Of the square, no. Of a specific performer, snake charmer or henna artist, yes. Agree the amount before you lift your camera, keep it small, and you will avoid an argument."
      }
    ]
  },
  {
    slug: "jardin-majorelle",
    regionSlug: "marrakech-safi",
    name: "Jardin Majorelle",
    category: "Garden",
    shortDescription:
      "A cobalt-blue villa and cactus garden created by a French painter and saved by Yves Saint Laurent.",
    body:
      "The French painter Jacques Majorelle bought this plot in Gueliz in 1923 and spent almost forty years turning it into a botanical garden, planting cacti, bamboo and palms from around the world. His signature was the intense cobalt he painted the studio walls, a shade now trademarked as Majorelle Blue. After his death the garden fell into neglect and was nearly sold to developers.\n\nYves Saint Laurent and Pierre Bergé bought it in 1980 and restored it, and Saint Laurent's ashes were scattered here after his death in 2008. The garden is compact, so it fills quickly, and the queues can be long by mid-morning. The onsite Berber Museum, in Majorelle's old studio, holds a fine collection of Amazigh jewellery and textiles.\n\nNext door, the Musée Yves Saint Laurent opened in 2017 and is worth combining in the same visit, with a rotating selection from the designer's archive. Book timed tickets online for both to skip the worst of the line, and come at opening or in the last hour for the quietest light."
    ,
    metaTitle: "Jardin Majorelle, Marrakech | The YSL Garden",
    metaDescription:
      "Jardin Majorelle: Jacques Majorelle's cobalt garden, restored by Yves Saint Laurent. Tickets, the Berber Museum and the YSL museum next door. A guide.",
    lat: 31.6417, lng: -8.0033,
    imageKey: "majorelle",
    practical: [
      { label: "Hours", value: "Daily, roughly 8am to 6pm" },
      { label: "Entry", value: "Around 150-300 MAD depending on museums included" },
      { label: "Best time", value: "At opening or the last hour, to avoid crowds" },
      { label: "Tickets", value: "Book timed entry online in advance" }
    ],
    faqs: [
      {
        q: "Is the Jardin Majorelle worth the entry fee?",
        a: "For garden and design lovers, yes, though it is small and busy. Buy the combined ticket if you want the Berber Museum, and add the neighbouring YSL museum for the fashion archive."
      },
      {
        q: "How long do you need at the Majorelle garden?",
        a: "About an hour for the garden and Berber Museum, or two to three hours if you add the Yves Saint Laurent museum and a coffee at the café."
      }
    ]
  },
  {
    slug: "bahia-palace",
    regionSlug: "marrakech-safi",
    name: "Bahia Palace",
    category: "Palace",
    shortDescription:
      "A late-nineteenth-century vizier's palace of painted cedar ceilings, tiled courtyards and a harem wing.",
    body:
      "The Bahia was built in stages in the 1860s to 1900 for Si Moussa, grand vizier to the sultan, and later expanded by his son Ba Ahmed, who effectively ran the country. The name means brilliance, and the palace was meant to be the finest of its age. There is no single grand plan: it rambles across roughly two hectares of courtyards, reception rooms and a garden, added to as land came available.\n\nThe pleasure is in the surfaces. Ceilings of painted and carved cedar, walls of carved stucco and zellij mosaic, and a great marble courtyard that housed Ba Ahmed's four wives and twenty-four concubines. When Ba Ahmed died in 1900 the palace was stripped by rivals within days, so the rooms are largely empty, which lets you focus on the craftsmanship rather than the furniture.\n\nIt is a short walk from Jemaa el-Fnaa and pairs naturally with the nearby Saadian Tombs and the ruined El Badi Palace, all in the southern medina. Go early: the courtyards get crowded and hot by late morning, and the tour groups arrive in force after 10am."
    ,
    metaTitle: "Bahia Palace, Marrakech | The Vizier's Palace",
    metaDescription:
      "The Bahia Palace in Marrakech: painted cedar ceilings, zellij courtyards and a harem wing from the 1890s. Hours, tickets and what to see nearby. A guide.",
    lat: 31.6218, lng: -7.9836,
    imageKey: "bahia-palace",
    practical: [
      { label: "Hours", value: "Daily, roughly 9am to 5pm" },
      { label: "Entry", value: "Around 70-100 MAD" },
      { label: "Best time", value: "At opening, before the tour groups" },
      { label: "Nearby", value: "Saadian Tombs and El Badi Palace, both walkable" }
    ],
    faqs: [
      {
        q: "How long do you need at the Bahia Palace?",
        a: "About 45 minutes to an hour is enough to see the courtyards and painted rooms at an unhurried pace. Combine it with the Saadian Tombs a short walk away."
      },
      {
        q: "Is the Bahia Palace furnished?",
        a: "Mostly no. It was looted when Ba Ahmed died in 1900, so the rooms are largely bare, which puts the focus on the carved cedar ceilings, stucco and tilework that are the real reason to visit."
      }
    ]
  },
  {
    slug: "koutoubia-mosque",
    regionSlug: "marrakech-safi",
    name: "Koutoubia Mosque",
    category: "Religious site",
    shortDescription:
      "Marrakech's largest mosque, its 77-metre Almohad minaret the model for the Giralda in Seville.",
    body:
      "The Koutoubia is the great mosque of Marrakech, begun under the Almohad ruler Abd al-Mu'min around 1147 after the first attempt was found to be misaligned with Mecca and torn down. Its 77-metre minaret is the tallest structure in the medina, capped with copper orbs, and its proportions became the template for the Giralda in Seville and the Hassan Tower in Rabat, the three great Almohad minarets.\n\nThe name comes from the Arabic for booksellers, kutubiyyin, after the manuscript market that once stood beside it. The stonework is deliberately plain, in keeping with Almohad austerity, its decoration confined to bands of carved arches near the top and the changing pattern on each of the four faces.\n\nThe mosque is closed to non-Muslims, as almost all working mosques in Morocco are, so you admire it from outside. The gardens on its southern and western sides are open to everyone and are a pleasant place to sit, and the minaret is the landmark you will use to navigate back toward Jemaa el-Fnaa, a five-minute walk away."
    ,
    metaTitle: "Koutoubia Mosque, Marrakech | The Almohad Minaret",
    metaDescription:
      "The Koutoubia Mosque and its 77-metre Almohad minaret, model for Seville's Giralda. History, the gardens and why you see it only from outside. A guide.",
    lat: 31.6242, lng: -7.9931,
    imageKey: "koutoubia",
    practical: [
      { label: "Entry", value: "Exterior and gardens free; interior closed to non-Muslims" },
      { label: "Best time", value: "Late afternoon, when the minaret catches the light" },
      { label: "Getting there", value: "Five minutes on foot from Jemaa el-Fnaa" }
    ],
    faqs: [
      {
        q: "Can tourists go inside the Koutoubia Mosque?",
        a: "No. Like nearly all active mosques in Morocco, it is closed to non-Muslims. You can walk the surrounding gardens and admire the minaret from outside, which is where its beauty lies anyway."
      },
      {
        q: "Why does the Koutoubia look like the Giralda in Seville?",
        a: "Both were built by the Almohad dynasty in the twelfth century by related designers. The Koutoubia's minaret set the pattern, and the Giralda and Rabat's Hassan Tower followed the same proportions."
      }
    ]
  },
  {
    slug: "fes-el-bali",
    regionSlug: "fes-meknes",
    name: "Fes el-Bali medina",
    category: "Medina",
    shortDescription:
      "The old walled city of Fès, the largest car-free urban area in the world and a UNESCO World Heritage site.",
    body:
      "Fès el-Bali is the medieval core of Fès, founded in the late eighth century and enclosed by walls with a warren of lanes too narrow for cars. Estimates of the number of streets run to around 9,000, and getting lost is not a risk but a certainty, which is part of the pleasure. Goods still move by mule and handcart, and each trade has its quarter: the coppersmiths of Place Seffarine hammering in unison, the dyers with their skeins of wool, the bakers taking in the neighbourhood's dough.\n\nAt its heart stands Al-Qarawiyyin, founded in 859 by Fatima al-Fihri and regarded as the world's oldest existing degree-granting university. The Bou Inania and Al-Attarine madrasas, both open to visitors, show fourteenth-century Marinid craftsmanship at its peak, with carved cedar, stucco and zellij on every surface.\n\nA guide for your first morning is money well spent, both to find the landmarks and to fend off the faux guides who latch onto lost-looking visitors. After that, let yourself wander. The city was made to be experienced on foot, at the pace of a mule, with no clear route from one gate to the next."
    ,
    metaTitle: "Fes el-Bali Medina | The Old City of Fès",
    metaDescription:
      "Fes el-Bali, the world's largest car-free medina and a UNESCO site: Al-Qarawiyyin, the madrasas, the craft quarters and the tannery. Do you need a guide?",
    lat: 34.0653, lng: -4.9736,
    imageKey: "fes",
    practical: [
      { label: "Best time", value: "Morning, when the workshops and markets are busiest" },
      { label: "Entry", value: "Free to wander; madrasas around 20-70 MAD each" },
      { label: "Guide", value: "Recommended for a first visit, book through your riad" },
      { label: "Getting there", value: "Enter at Bab Bou Jeloud, the blue gate" }
    ],
    faqs: [
      {
        q: "Will I get lost in the Fès medina?",
        a: "Almost certainly, and that is fine. The lanes are unmarked and turn back on themselves. Note that most run downhill toward the river, so heading uphill will eventually bring you back to a main gate."
      },
      {
        q: "How much should I pay a guide in Fès?",
        a: "An official licensed guide runs roughly 300 to 500 MAD for a half-day. Book through your accommodation rather than accepting an offer on the street, where unlicensed guides steer you to shops for commission."
      }
    ]
  },
  {
    slug: "chouara-tannery",
    regionSlug: "fes-meknes",
    name: "Chouara Tannery",
    category: "Medina",
    shortDescription:
      "The largest of Fès's medieval tanneries, a honeycomb of stone dye pits worked by hand since the eleventh century.",
    body:
      "The Chouara tannery has been dyeing leather in the same spot for close to a thousand years, its stone vats laid out like a honeycomb in the heart of the medina. Hides of cow, sheep, goat and camel are first soaked in a white mixture of quicklime and pigeon droppings to strip the hair and soften them, then moved to the coloured pits: poppy for red, saffron for yellow, indigo, mint for green, all natural dyes.\n\nYou view it from the balconies of the leather shops that ring the pits, and the shopkeepers who let you up will, reasonably, hope you buy a jacket or a pouf on the way down. There is no obligation, though a small tip or a polite browse is good manners. The smell is famously strong, and staff hand you a sprig of mint to hold under your nose.\n\nThe tannery was carefully restored in 2016, its crumbling vats rebuilt and the drainage improved, so it is in better shape than the old photographs suggest while still being entirely a working site. Go in the morning, when the light is good and the men are working the pits."
    ,
    metaTitle: "Chouara Tannery, Fès | Medieval Leather Dyeing",
    metaDescription:
      "The Chouara tannery in Fès: stone dye pits worked by hand for a thousand years. Where to view it, the smell, and buying leather. An honest visitor's guide.",
    lat: 34.0658, lng: -4.9700,
    imageKey: "tannery",
    practical: [
      { label: "Best time", value: "Morning, for good light and active work" },
      { label: "Entry", value: "Free via the leather shops; a small tip is courteous" },
      { label: "Bring", value: "The shops provide mint; the smell is strong" },
      { label: "Getting there", value: "In the medina near Place Seffarine" }
    ],
    faqs: [
      {
        q: "Do you have to pay to see the Chouara tannery?",
        a: "There is no official fee. You reach the viewing balconies through the surrounding leather shops, which hope you will buy something. A small tip or a genuine browse keeps things friendly, but you are not obliged to purchase."
      },
      {
        q: "Is the tannery smell overwhelming?",
        a: "It is pungent, from the ammonia used to cure the hides, but you are given mint to hold to your nose and most people cope fine for the ten minutes it takes to look and photograph."
      }
    ]
  },
  {
    slug: "chefchaouen",
    regionSlug: "tanger-tetouan",
    name: "Chefchaouen blue city",
    category: "Medina",
    shortDescription:
      "A small Rif-mountain town whose old medina is painted in every shade of blue, from powder to deep indigo.",
    body:
      "Chefchaouen was founded in 1471 as a fortress against Portuguese incursions and later took in Muslims and Jews expelled from Spain, whose Andalusian style shaped the old town. What draws visitors now is the colour: the walls, steps and doorways of the medina are painted blue, repainted each year, in a palette that ranges from pale sky to indigo. The origin is debated, variously credited to Jewish tradition, mosquito control or simple cool, and nobody can prove which.\n\nThe medina is small enough to see in a few hours of aimless walking, climbing the stepped lanes to the Plaza Uta el-Hammam and the red kasbah at its centre. For the classic photograph, follow the crowds up to the Ras El Maa spring, where women still do laundry, or climb the short trail to the Spanish Mosque above town for the sunset view over the whole blue sprawl.\n\nBecause it is a long way from anywhere, Chefchaouen rewards an overnight stay. Day-trippers from Fès or Tangier arrive mid-morning and leave by late afternoon, so staying a night gives you the town at dawn and dusk, when the light on the blue is at its best and the lanes are quiet."
    ,
    metaTitle: "Chefchaouen, the Blue City | Morocco's Rif Town",
    metaDescription:
      "Chefchaouen, Morocco's blue city in the Rif mountains: the painted medina, the Spanish Mosque viewpoint and why to stay overnight. A visitor's guide.",
    lat: 35.1688, lng: -5.2636,
    imageKey: "chefchaouen",
    practical: [
      { label: "Best time", value: "Early morning and sunset, when day-trippers have gone" },
      { label: "Viewpoint", value: "The Spanish Mosque, a 30-minute walk uphill" },
      { label: "Stay", value: "One night to see the town at dawn and dusk" },
      { label: "Getting there", value: "Two hours from Tangier, four from Fès by road" }
    ],
    faqs: [
      {
        q: "Is one day enough in Chefchaouen?",
        a: "You can see the main lanes and the viewpoint in a day, but the town is calmest and prettiest at dawn and dusk. An overnight stay lets you photograph it without the crowds."
      },
      {
        q: "Is Chefchaouen a difficult place to walk?",
        a: "The medina is steep and stepped, so wear proper shoes, but it is compact. The uphill walk to the Spanish Mosque for the sunset view takes about half an hour at an easy pace."
      }
    ]
  },
  {
    slug: "erg-chebbi-merzouga",
    regionSlug: "draa-tafilalet",
    name: "Erg Chebbi dunes, Merzouga",
    category: "Desert",
    shortDescription:
      "A sea of Saharan dunes up to 150 metres high beside the village of Merzouga, and the classic desert-camp overnight.",
    body:
      "Erg Chebbi is the most accessible of Morocco's true sand seas, a band of orange dunes some 22 kilometres long and up to 150 metres high, rising abruptly out of the flat hammada near the Algerian border. The desert village of Merzouga is the jumping-off point, and the classic experience is to ride a camel out over the dunes in late afternoon, watch the sun set from a high crest, and spend the night at a tented camp among the sand.\n\nCamps range from basic Berber bivouacs to luxury operations with private tents, proper beds and en-suite bathrooms. After dinner around a fire, with Gnaoua drumming, the sky is what you came for: with no light pollution for hundreds of kilometres, the Milky Way is startlingly bright. Wake before dawn to climb a dune and watch the sun come up over the sand.\n\nGetting here is the commitment. Merzouga is a full day's drive from Marrakech, around 560 kilometres over the Atlas, so it is built into multi-day desert itineraries rather than done as a quick side trip. Come October to April to avoid the worst heat, and bring a warm layer for the surprisingly cold nights."
    ,
    metaTitle: "Erg Chebbi Dunes, Merzouga | The Moroccan Sahara",
    metaDescription:
      "Erg Chebbi at Merzouga: 150-metre Saharan dunes, camel rides and overnight desert camps under the stars. How to get there and when to go. A guide.",
    lat: 31.1000, lng: -3.9764,
    imageKey: "desert-camp",
    practical: [
      { label: "Best time", value: "October to April; nights are cold year-round" },
      { label: "Experience", value: "Camel ride at sunset, one night at a desert camp" },
      { label: "Getting there", value: "A full day's drive from Marrakech, about 560 km" },
      { label: "Bring", value: "A warm layer, a scarf for sand, and a headlamp" }
    ],
    faqs: [
      {
        q: "Is one night in the desert enough at Merzouga?",
        a: "One night in a camp is plenty to get the sunset, the stars and the dawn, which are the highlights. The long drive to reach Merzouga is the real time cost, so build in overnights on the road."
      },
      {
        q: "Do I have to ride a camel to reach the camp?",
        a: "No. Camps can be reached by 4x4 if you would rather not ride, and the camel leg is usually optional and short, about an hour. Many people do the camel out and the jeep back."
      }
    ]
  },
  {
    slug: "ait-benhaddou",
    regionSlug: "draa-tafilalet",
    name: "Aït Benhaddou",
    category: "Kasbah",
    shortDescription:
      "A UNESCO-listed earthen ksar of clustered kasbahs above the Ounila river, and a favourite film location.",
    body:
      "Aït Benhaddou is a ksar, a fortified village of red mud-brick houses and towers packed together on a hillside above the Ounila river, on the old caravan route between Marrakech and the Sahara. It has stood here since at least the eleventh century, though most of the surviving buildings date from the seventeenth onward, and it was inscribed as a UNESCO World Heritage site in 1987 as one of the finest examples of southern Moroccan earthen architecture.\n\nHollywood found it long ago. Lawrence of Arabia, Gladiator, The Mummy, Kingdom of Heaven and Game of Thrones, where it stood in for the city of Yunkai, all filmed here, and the nearby studios of Ouarzazate keep the crews coming. A handful of families still live in the old ksar, though most residents have moved to the modern village across the river.\n\nYou cross the riverbed, often just a trickle, and climb through the alleys to the agadir, the fortified granary at the summit, for the view back over the whole cluster and the palm groves beyond. It sits right on the road from Marrakech to Ouarzazate and the desert, so almost every southern itinerary stops here. Early morning and late afternoon give the warmest light on the mud walls."
    ,
    metaTitle: "Aït Benhaddou | UNESCO Ksar & Film Location",
    metaDescription:
      "Aït Benhaddou, the UNESCO earthen ksar on the road to the Sahara, seen in Gladiator and Game of Thrones. History, the climb and when to go. A guide.",
    lat: 31.0472, lng: -7.1319,
    imageKey: "ait-benhaddou",
    practical: [
      { label: "Best time", value: "Early morning or late afternoon for warm light" },
      { label: "Entry", value: "Free to enter; some houses charge a small fee" },
      { label: "Getting there", value: "On the Marrakech to Ouarzazate road, about 30 km from Ouarzazate" },
      { label: "Time needed", value: "One to two hours to climb to the granary and back" }
    ],
    faqs: [
      {
        q: "Which films were shot at Aït Benhaddou?",
        a: "Among many, Lawrence of Arabia, Gladiator, The Mummy, Kingdom of Heaven and Game of Thrones, where it played the slave city of Yunkai. The film studios at nearby Ouarzazate keep productions coming to the region."
      },
      {
        q: "Do people still live in Aït Benhaddou?",
        a: "A few families remain inside the old ksar, but most residents have moved to the modern village across the river. Those who stay run small shops and guesthouses for visitors."
      }
    ]
  },
  {
    slug: "todra-gorge",
    regionSlug: "draa-tafilalet",
    name: "Todra Gorge",
    category: "Natural wonder",
    shortDescription:
      "A canyon where limestone walls rise 300 metres and narrow to a corridor barely ten metres wide.",
    body:
      "The Todra Gorge is the dramatic climax of the Todra river's descent from the High Atlas, a slot canyon where the rock walls close in to a passage barely ten metres wide with cliffs rising some 300 metres on either side. The river, cold and clear even in summer, runs along the canyon floor, and a paved road threads through the narrowest section, where the light barely reaches the ground at midday.\n\nThe gorge is a magnet for rock climbers, with hundreds of bolted routes on the sheer limestone, and an easy stop for everyone else: you can walk the flat canyon floor through the narrows in twenty minutes, past small stalls and a couple of hotels built right against the rock. Above the gorge, palm-filled villages line the valley, and longer walks lead up to Berber hamlets and viewpoints for those who want to stretch the visit into a half-day.\n\nIt lies on the eastern route between the Dadès Valley and Merzouga, so it slots neatly into a Sahara trip as a morning stop. Go early to have the narrows to yourself, before the tour buses arrive from Ouarzazate and Errachidia."
    ,
    metaTitle: "Todra Gorge, Morocco | The 300-Metre Canyon",
    metaDescription:
      "The Todra Gorge: sheer limestone walls rising 300 metres over a river-cut slot canyon. Walking the narrows and how it fits a Sahara route. A guide.",
    lat: 31.5875, lng: -5.5947,
    imageKey: "todra-gorge",
    practical: [
      { label: "Best time", value: "Early morning, before the tour buses" },
      { label: "Entry", value: "Free" },
      { label: "Activity", value: "A short flat walk through the narrows, or rock climbing" },
      { label: "Getting there", value: "About 15 km north of Tinghir, on the Dadès to Merzouga route" }
    ],
    faqs: [
      {
        q: "How long do you need at the Todra Gorge?",
        a: "Half an hour is enough to walk the dramatic narrow section and back. Add a couple of hours if you want to walk up into the villages above the gorge or do a guided hike."
      },
      {
        q: "Can you swim in the Todra river?",
        a: "The water is shallow and very cold, fed from the mountains, so it is more a paddle than a swim. In spring, snowmelt can raise the level and the flow through the narrows."
      }
    ]
  },
  {
    slug: "ourika-valley",
    regionSlug: "marrakech-atlas",
    name: "Ourika Valley",
    category: "Natural wonder",
    shortDescription:
      "A green river gorge an hour from Marrakech, ending in a chain of waterfalls above the village of Setti Fatma.",
    body:
      "The Ourika Valley is the easiest taste of the Atlas from Marrakech, a green river gorge that climbs south into the mountains an hour from the city. The road follows the Ourika river past roadside cafés built out over the water on stilts, terraced fields of mint and vegetables, and Berber villages of red stone stacked up the valley sides. It is where Marrakchis themselves escape the summer heat.\n\nThe road ends at Setti Fatma, from where a rough footpath climbs to a chain of seven small waterfalls. The first fall is a scramble of twenty minutes over boulders, with local lads offering a steadying hand for a tip; reaching the higher falls takes longer and is best with grippy shoes. Along the way you will pass argan-oil and saffron cooperatives, and Berber homes offering mint tea and tagine cooked over wood.\n\nBecause it is so close and so pretty, it gets busy, especially with local families on Fridays and weekends. Come on a weekday morning for the quietest walk, and note that flash floods have hit the valley in the past, so heed local advice if heavy rain is forecast upstream."
    ,
    metaTitle: "Ourika Valley, Morocco | Atlas Day Trip from Marrakech",
    metaDescription:
      "The Ourika Valley: a green river gorge and the Setti Fatma waterfalls, an hour from Marrakech. Walking, Berber villages and when to go. A day-trip guide.",
    lat: 31.3600, lng: -7.6800,
    imageKey: "ourika",
    practical: [
      { label: "Best time", value: "Weekday morning; spring for meltwater and flowers" },
      { label: "Getting there", value: "About one hour south of Marrakech by road" },
      { label: "Walk", value: "20 minutes to the first Setti Fatma fall, longer for the rest" },
      { label: "Bring", value: "Grippy shoes for the boulder scramble" }
    ],
    faqs: [
      {
        q: "Is the Ourika Valley a good day trip from Marrakech?",
        a: "Yes, it is the closest and easiest mountain escape, about an hour each way. You can combine the river cafés, a Berber village visit and the Setti Fatma waterfalls in a half-day."
      },
      {
        q: "How hard is the walk to the Setti Fatma waterfalls?",
        a: "The first waterfall is a 20-minute scramble over boulders, manageable for most people in good shoes. The higher falls involve more climbing, so turn back at the first if you prefer an easy walk."
      }
    ]
  },
  {
    slug: "toubkal-imlil",
    regionSlug: "marrakech-atlas",
    name: "Toubkal & Imlil",
    category: "Natural wonder",
    shortDescription:
      "The trailhead village of Imlil and the two-day route up Jebel Toubkal, North Africa's highest peak at 4,167 metres.",
    body:
      "Imlil is the gateway to the Toubkal massif, a walnut-shaded Berber village at 1,740 metres, 90 minutes' drive from Marrakech, where the tarmac ends and the mule tracks begin. It is the base for the two-day ascent of Jebel Toubkal, at 4,167 metres the highest mountain in North Africa, and for gentler valley walks that need no more than a day and a decent pair of shoes.\n\nThe classic climb is done over two days: a half-day walk up to the refuge at around 3,200 metres, an overnight, then an early start for the summit and the long descent. In summer no technical skill is required, though the altitude is real and you should be fit. From November to April the mountain is snow-covered and needs crampons, an ice axe and experience. A licensed local mountain guide is required by regulation for the ascent, and hiring one supports the valley's economy.\n\nEven if you never leave the valley floor, Imlil rewards a visit. Short walks lead to villages such as Aroumd and Around, to the shrine of Sidi Chamharouch, and past terraced fields and waterfalls, with Berber guesthouses serving lunch along the way. It is the most straightforward way to swap the heat of the city for cool mountain air."
    ,
    metaTitle: "Toubkal & Imlil | Climbing North Africa's Highest Peak",
    metaDescription:
      "Imlil and Jebel Toubkal: the trailhead village and the two-day climb to 4,167 metres, North Africa's highest summit. Guides, seasons and easy walks.",
    lat: 31.1353, lng: -7.9192,
    imageKey: "toubkal",
    practical: [
      { label: "Best time", value: "May to October for the summit; winter needs full kit" },
      { label: "Guide", value: "A licensed mountain guide is required for the ascent" },
      { label: "Getting there", value: "About 90 minutes by road from Marrakech to Imlil" },
      { label: "Summit route", value: "Two days via the refuge at around 3,200 m" }
    ],
    faqs: [
      {
        q: "How fit do you need to be to climb Toubkal?",
        a: "You do not need technical skills in summer, but it is a strenuous two-day walk to over 4,000 metres, so a good level of fitness and some acclimatisation help. Altitude, not difficulty, is the main challenge."
      },
      {
        q: "Can you visit Imlil without climbing Toubkal?",
        a: "Absolutely. Imlil is a fine base for easy valley walks to nearby Berber villages and waterfalls, with guesthouses for lunch, all doable as a day trip from Marrakech without any climbing."
      }
    ]
  }
];

export const itineraries: SeedItinerary[] = [
  {
    slug: "marrakech-in-three-days",
    title: "Marrakech in Three Days",
    subtitle: "The medina, the palaces and a first taste of the Atlas",
    durationDays: 3,
    regionSlugs: ["marrakech-safi", "marrakech-atlas"],
    summary:
      "Three days is enough to know Marrakech properly: the tangle of the medina and its souks, the palaces and gardens of the old and new towns, and an easy day in the mountains that begin an hour from the city walls. This route keeps the walking manageable and saves the best of the square for the evenings.\n\nYou stay in a riad inside the medina, within walking distance of Jemaa el-Fnaa, and take a car and driver only for the day trip to the Ourika Valley. It works year-round, though the shoulder months of spring and autumn are the most comfortable, and it pairs neatly onto the front of any longer Moroccan trip."
    ,
    metaTitle: "Marrakech in 3 Days | Itinerary & Route",
    metaDescription:
      "A three-day Marrakech itinerary: the medina and souks, Bahia Palace, Jardin Majorelle, the Koutoubia and an Atlas day trip to Ourika. Day by day.",
    priceFromUsd: 690,
    imageKey: "riad-courtyard",
    days: [
      {
        day: 1,
        title: "Into the medina",
        body:
          "Settle into your riad, then walk into the souks in the afternoon while the light is good, following the Semmarine toward the leather and metalwork quarters. As the heat drops, make your way to Jemaa el-Fnaa, find a rooftop café for a mint tea over the square, then come down to eat at the food stalls once they are set up.",
        attractionSlugs: ["jemaa-el-fnaa"]
      },
      {
        day: 2,
        title: "Palaces and gardens",
        body:
          "Start early at the Bahia Palace before the tour groups, taking in the painted cedar ceilings and tiled courtyards, then walk to the nearby Saadian Tombs. After lunch, taxi to Gueliz for the Jardin Majorelle and the Yves Saint Laurent museum. On the way back, pause at the Koutoubia gardens as the minaret catches the late light.",
        attractionSlugs: ["bahia-palace", "jardin-majorelle", "koutoubia-mosque"]
      },
      {
        day: 3,
        title: "Into the Atlas",
        body:
          "Take a car and driver south to the Ourika Valley, an hour from the city. Stop at a roadside café over the river, visit a Berber home or an argan cooperative, and walk the boulder path to the first of the Setti Fatma waterfalls. Return to Marrakech by late afternoon for a final evening on a medina rooftop.",
        attractionSlugs: ["ourika-valley"]
      }
    ],
    includes: [
      "Two nights in a medina riad with breakfast",
      "A licensed guide for a half-day medina walk",
      "Palace and garden entry tickets",
      "Private car and driver for the Ourika Valley day",
      "Airport transfers in Marrakech",
      "24-hour local support line"
    ],
    faqs: [
      {
        q: "Is three days enough for Marrakech?",
        a: "Yes. Three days covers the medina, the main palaces and gardens, and a day in the Atlas foothills at an unhurried pace. Add a night if you want a slower start or a hammam afternoon."
      },
      {
        q: "Do I need a guide for all three days?",
        a: "No. A guide for the first morning in the medina is worth it to get your bearings and reach the best workshops. After that the palaces, gardens and Ourika day are easy to do with just a driver."
      }
    ]
  },
  {
    slug: "imperial-cities-and-the-sahara",
    title: "Imperial Cities & the Sahara",
    subtitle: "Marrakech and Fès by way of the Atlas and the dunes of Merzouga",
    durationDays: 7,
    regionSlugs: ["marrakech-safi", "fes-meknes", "draa-tafilalet"],
    summary:
      "This is the classic first trip to Morocco, linking the two great imperial cities with the desert in between. You start in Marrakech, cross the High Atlas to Aït Benhaddou and the kasbah country, spend a night in a Sahara camp at Merzouga, then climb north through the gorges to finish in the medieval medina of Fès.\n\nThe driving days over the Atlas and through the south are long but scenic, broken by stops at the ksar of Aït Benhaddou and the Todra Gorge. It is best done with a private driver-guide so you can stop when you like, and it works from October to April in the desert and spring or autumn overall for the mountain passes."
    ,
    metaTitle: "Morocco 7-Day Itinerary | Cities & Sahara Route",
    metaDescription:
      "A seven-day Morocco itinerary from Marrakech to Fès via Aït Benhaddou, the Todra Gorge and a Sahara camp at Merzouga. Day-by-day route and what's included.",
    priceFromUsd: 1780,
    imageKey: "sahara",
    days: [
      {
        day: 1,
        title: "Marrakech",
        body:
          "Arrive and settle into a medina riad. Spend the afternoon in the souks and finish at Jemaa el-Fnaa for the evening food stalls and the view from a rooftop café.",
        attractionSlugs: ["jemaa-el-fnaa", "koutoubia-mosque"]
      },
      {
        day: 2,
        title: "Marrakech to Aït Benhaddou",
        body:
          "Cross the Tizi n'Tichka pass over the High Atlas, stopping for the views, and reach Aït Benhaddou in the afternoon. Climb through the ksar to the granary at the top for the light on the mud walls, and overnight nearby in Ouarzazate.",
        attractionSlugs: ["ait-benhaddou"]
      },
      {
        day: 3,
        title: "The Dadès and the gorges",
        body:
          "Drive east along the road of a thousand kasbahs through the Dadès Valley, then walk the narrows of the Todra Gorge before the tour buses arrive. Continue toward the desert, overnighting in the Tinghir or Erfoud area.",
        attractionSlugs: ["todra-gorge"]
      },
      {
        day: 4,
        title: "Into the Sahara at Merzouga",
        body:
          "Reach Merzouga and the dunes of Erg Chebbi by late afternoon. Ride a camel out over the sand to a desert camp, watch the sunset from a high crest, and spend the night under the stars with dinner around the fire.",
        attractionSlugs: ["erg-chebbi-merzouga"]
      },
      {
        day: 5,
        title: "Merzouga to Fès",
        body:
          "Rise for sunrise over the dunes, then begin the long drive north over the Middle Atlas, through cedar forests where Barbary macaques live, arriving in Fès in the evening.",
        attractionSlugs: ["erg-chebbi-merzouga"]
      },
      {
        day: 6,
        title: "Fès el-Bali",
        body:
          "Spend the day in the great medina with a local guide: Al-Qarawiyyin, the Bou Inania madrasa, the craft quarters, and the Chouara tannery viewed from a leather shop balcony. Wander on your own in the late afternoon.",
        attractionSlugs: ["fes-el-bali", "chouara-tannery"]
      },
      {
        day: 7,
        title: "Depart Fès",
        body:
          "A last morning in the medina for any shopping, then transfer to Fès airport, or continue on to the north and Chefchaouen if you are extending the trip.",
        attractionSlugs: ["fes-el-bali"]
      }
    ],
    includes: [
      "Six nights of accommodation, including a desert camp",
      "Private driver-guide and vehicle throughout",
      "A licensed city guide for the Fès medina",
      "Camel ride and overnight camp at Merzouga",
      "Daily breakfast and dinner at the desert camp",
      "Airport transfers in Marrakech and Fès"
    ],
    faqs: [
      {
        q: "Are the driving days on this route very long?",
        a: "Two of them are, the day to Merzouga and the day from the desert to Fès, each around seven to eight hours with stops. The scenery over the Atlas and through the gorges makes them part of the trip rather than dead time."
      },
      {
        q: "Can this seven-day trip be done in reverse?",
        a: "Yes. Many travelers fly into Fès and out of Marrakech, running the route the other way. It makes no difference to the sights, only to which city you start and finish in."
      }
    ]
  },
  {
    slug: "the-blue-city-and-the-north",
    title: "The Blue City & the North",
    subtitle: "Tangier, the Rif and the blue lanes of Chefchaouen",
    durationDays: 4,
    regionSlugs: ["tanger-tetouan"],
    summary:
      "Morocco's Mediterranean north is greener, cooler and less visited than the imperial south, and this short trip makes the most of it. You begin in cosmopolitan Tangier, looking across the strait to Spain, then head inland to Chefchaouen, the blue-washed town in the Rif mountains that has become one of the country's most photographed places.\n\nFour days is enough to feel the difference in pace up here. The route suits travelers arriving by ferry from Spain or by the high-speed train from Casablanca, and it can be tacked onto a Fès trip since the two are within a few hours of each other. Spring and autumn are ideal, when the Rif is at its greenest."
    ,
    metaTitle: "Northern Morocco 4-Day Trip | Tangier & Chefchaouen",
    metaDescription:
      "A four-day northern Morocco itinerary: cosmopolitan Tangier, the Strait of Gibraltar and the blue city of Chefchaouen in the Rif mountains. Day by day.",
    priceFromUsd: 820,
    imageKey: "chefchaouen",
    days: [
      {
        day: 1,
        title: "Tangier",
        body:
          "Explore the Tangier medina and kasbah, with its view over the Strait of Gibraltar toward Spain. Walk the old international quarter that drew Bowles and Burroughs, and take coffee at the Café Hafa above the sea.",
        attractionSlugs: ["chefchaouen"]
      },
      {
        day: 2,
        title: "Tangier to Chefchaouen",
        body:
          "Drive two hours south into the Rif to Chefchaouen. Arrive in time to walk the blue medina in the softer afternoon light, climbing the stepped lanes to the Plaza Uta el-Hammam and the red kasbah at its heart.",
        attractionSlugs: ["chefchaouen"]
      },
      {
        day: 3,
        title: "Chefchaouen",
        body:
          "A full day in the blue city: the Ras El Maa spring where women still do laundry, the artisan workshops, and the short climb to the Spanish Mosque above town for the sunset view over the whole blue sprawl.",
        attractionSlugs: ["chefchaouen"]
      },
      {
        day: 4,
        title: "Depart the north",
        body:
          "A final quiet morning in the medina before the day-trippers arrive, then transfer onward, either back to Tangier, ahead to Fès a few hours south, or to your next stop.",
        attractionSlugs: ["chefchaouen"]
      }
    ],
    includes: [
      "Three nights of accommodation in Tangier and Chefchaouen",
      "Private transfer between Tangier and Chefchaouen",
      "A guided walk of the Tangier medina and kasbah",
      "A guided orientation walk in Chefchaouen",
      "Daily breakfast",
      "24-hour local support line"
    ],
    faqs: [
      {
        q: "Is Chefchaouen worth staying overnight?",
        a: "Yes. The town is loveliest at dawn and dusk, before and after the day-trippers, and an overnight lets you photograph the blue lanes when they are quiet and the light is soft."
      },
      {
        q: "Can I combine the north with Fès?",
        a: "Easily. Chefchaouen is about four hours by road from Fès, so this northern loop attaches naturally to the front or back of an imperial-cities trip."
      }
    ]
  },
  {
    slug: "sahara-kasbahs-and-gorges",
    title: "Sahara, Kasbahs & Gorges",
    subtitle: "A loop south from Marrakech through the kasbah country and the dunes",
    durationDays: 5,
    regionSlugs: ["draa-tafilalet", "marrakech-atlas"],
    summary:
      "This five-day loop out of Marrakech is built around the south: the earthen ksar of Aït Benhaddou, the narrow slot of the Todra Gorge, and a night in the Sahara at Merzouga, returning over the High Atlas. It is the most efficient way to see the desert and the kasbah country without committing to a full cross-country trip.\n\nYou travel with a private driver-guide and stop at the sights that punctuate the long, scenic driving days. The route is at its best from October to April, when the desert heat is manageable, and it starts and ends in Marrakech, so it slots onto a city stay at either end."
    ,
    metaTitle: "Sahara & Kasbahs 5-Day Loop | From Marrakech",
    metaDescription:
      "A five-day loop from Marrakech to the Sahara: Aït Benhaddou, the Todra Gorge and a camp at Merzouga, returning over the High Atlas. Day-by-day route.",
    priceFromUsd: 1240,
    imageKey: "desert-camp",
    days: [
      {
        day: 1,
        title: "Marrakech to Aït Benhaddou",
        body:
          "Cross the Tizi n'Tichka pass over the High Atlas with photo stops, and reach Aït Benhaddou by afternoon. Climb through the ksar to the granary for the view, then overnight in Ouarzazate.",
        attractionSlugs: ["ait-benhaddou"]
      },
      {
        day: 2,
        title: "The Dadès and the Todra Gorge",
        body:
          "Drive the road of a thousand kasbahs through the Dadès Valley, then walk the narrows of the Todra Gorge, where the walls rise 300 metres over the river. Overnight near Tinghir.",
        attractionSlugs: ["todra-gorge"]
      },
      {
        day: 3,
        title: "Into the Sahara",
        body:
          "Continue east to Merzouga and the dunes of Erg Chebbi. Ride a camel out over the sand to a desert camp, catch the sunset from a high crest, and spend the night under the stars.",
        attractionSlugs: ["erg-chebbi-merzouga"]
      },
      {
        day: 4,
        title: "Merzouga to the Atlas",
        body:
          "Watch the sunrise over the dunes, then begin the long drive back west toward the mountains, overnighting in the Dadès or the High Atlas foothills to break the return journey.",
        attractionSlugs: ["erg-chebbi-merzouga"]
      },
      {
        day: 5,
        title: "Back to Marrakech via the Ourika Valley",
        body:
          "Return over the Atlas, with time for a stop in the green Ourika Valley and a short walk toward the Setti Fatma waterfalls before arriving back in Marrakech in the afternoon.",
        attractionSlugs: ["ourika-valley"]
      }
    ],
    includes: [
      "Four nights of accommodation, including a desert camp",
      "Private driver-guide and vehicle throughout",
      "Camel ride and overnight camp at Merzouga",
      "Breakfasts and dinner at the desert camp",
      "All Atlas and gorge stops on the route",
      "Return transfers from Marrakech"
    ],
    faqs: [
      {
        q: "How does this differ from the seven-day cities-and-Sahara trip?",
        a: "This loop skips Fès and returns to Marrakech, so it is shorter and stays in the south. Choose it if the desert and kasbahs are your priority and you have already seen, or plan to skip, the imperial cities."
      },
      {
        q: "Is one night in the desert enough on this route?",
        a: "Yes. One night at Merzouga gives you the sunset, the stars and the sunrise, which are the core of the desert experience. The rest of the days are the scenic drive there and back."
      }
    ]
  },
  {
    slug: "the-grand-morocco-tour",
    title: "The Grand Morocco Tour",
    subtitle: "Two weeks across the cities, the desert, the mountains and the blue north",
    durationDays: 12,
    regionSlugs: [
      "marrakech-safi",
      "fes-meknes",
      "draa-tafilalet",
      "tanger-tetouan",
      "marrakech-atlas"
    ],
    summary:
      "This is the full circuit, the trip for travelers who want to see Morocco's range in one journey: the two imperial cities, the Sahara, the High Atlas and the blue north. Over twelve days you loop from Marrakech through the desert to Fès, up to Chefchaouen and Tangier, and back through the mountains, at a pace that leaves room to slow down.\n\nIt is designed with a private driver-guide and a mix of riads, kasbah hotels and a desert camp. The long driving legs are the price of covering this much ground, but each is broken by a landmark stop. Spring and autumn are the ideal seasons, balancing comfortable desert temperatures with clear mountain passes."
    ,
    metaTitle: "Grand Morocco Tour | 12-Day Complete Itinerary",
    metaDescription:
      "A twelve-day Morocco itinerary: Marrakech, the Sahara at Merzouga, Fès, Chefchaouen, Tangier and the High Atlas. The full circuit, day by day.",
    priceFromUsd: 2980,
    imageKey: "morocco",
    days: [
      {
        day: 1,
        title: "Marrakech",
        body:
          "Arrive and settle into a medina riad. Ease in with an afternoon in the souks and the evening theatre of Jemaa el-Fnaa from a rooftop café.",
        attractionSlugs: ["jemaa-el-fnaa"]
      },
      {
        day: 2,
        title: "Marrakech in depth",
        body:
          "The palaces and gardens: the Bahia Palace, the Koutoubia's gardens, and the Jardin Majorelle with the Yves Saint Laurent museum in Gueliz.",
        attractionSlugs: ["bahia-palace", "koutoubia-mosque", "jardin-majorelle"]
      },
      {
        day: 3,
        title: "Over the Atlas to Aït Benhaddou",
        body:
          "Cross the Tizi n'Tichka pass to the ksar of Aït Benhaddou, climbing to the granary for the view, then overnight in Ouarzazate.",
        attractionSlugs: ["ait-benhaddou"]
      },
      {
        day: 4,
        title: "The Dadès and Todra Gorge",
        body:
          "Drive the road of a thousand kasbahs to the Todra Gorge, walking the narrows before continuing east toward the desert.",
        attractionSlugs: ["todra-gorge"]
      },
      {
        day: 5,
        title: "The Sahara at Merzouga",
        body:
          "Reach Erg Chebbi, ride a camel over the dunes to a desert camp, and spend the night under the stars with dinner around the fire.",
        attractionSlugs: ["erg-chebbi-merzouga"]
      },
      {
        day: 6,
        title: "Merzouga to Fès",
        body:
          "Sunrise over the dunes, then the long drive north over the Middle Atlas and its cedar forests to Fès.",
        attractionSlugs: ["erg-chebbi-merzouga"]
      },
      {
        day: 7,
        title: "Fès el-Bali",
        body:
          "A full day in the great medina with a local guide: Al-Qarawiyyin, the madrasas, the craft quarters and the Chouara tannery.",
        attractionSlugs: ["fes-el-bali", "chouara-tannery"]
      },
      {
        day: 8,
        title: "Fès to Chefchaouen",
        body:
          "Drive north into the Rif to the blue city, arriving to walk the medina in the afternoon light and climb toward the Spanish Mosque for sunset.",
        attractionSlugs: ["chefchaouen"]
      },
      {
        day: 9,
        title: "Chefchaouen and on to Tangier",
        body:
          "A morning in the quiet blue lanes before the crowds, then continue to Tangier on the coast for the evening.",
        attractionSlugs: ["chefchaouen"]
      },
      {
        day: 10,
        title: "Tangier",
        body:
          "Explore the Tangier medina and kasbah and the view across the Strait of Gibraltar, before the long return south.",
        attractionSlugs: ["chefchaouen"]
      },
      {
        day: 11,
        title: "South to the High Atlas",
        body:
          "Travel back toward Marrakech and into the mountains, basing at Imlil for a walk among the Berber villages of the Toubkal valleys.",
        attractionSlugs: ["toubkal-imlil"]
      },
      {
        day: 12,
        title: "Imlil to Marrakech and depart",
        body:
          "A final valley walk or a stop in the Ourika Valley on the way down, then transfer to Marrakech for your departure.",
        attractionSlugs: ["toubkal-imlil", "ourika-valley"]
      }
    ],
    includes: [
      "Eleven nights of accommodation, including a desert camp",
      "Private driver-guide and vehicle for the whole route",
      "Licensed city guides in Marrakech and Fès",
      "Camel ride and overnight camp at Merzouga",
      "Daily breakfast and dinner at the desert camp",
      "All airport and intercity transfers"
    ],
    faqs: [
      {
        q: "Is twelve days too long for Morocco?",
        a: "Not for the full circuit. Twelve days lets you see the cities, the desert, the north and the mountains without rushing. If you have less time, cut the north or the Atlas and keep the cities and the Sahara."
      },
      {
        q: "How much of this trip is spent driving?",
        a: "Several days involve long, scenic drives, notably crossing the Atlas and the leg from the desert to Fès. A private driver-guide means you stop at the landmarks and set the pace, so the road becomes part of the experience."
      }
    ]
  }
];

const content = { countries, regions, attractions, itineraries };
export default content;
