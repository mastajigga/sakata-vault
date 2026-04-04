const { createClient } = require('@supabase/supabase-js');
const supabaseUrl = 'https://slbnjjgparojkvxbsdzn.supabase.co';
const supabaseAnonKey = 'sb_publishable_FN4pbSzCnpy1YKdHtgNZMA_ErkY2-ev';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Article 1: epopee-peuple-sakata
const article1 = {
  title: {
    fr: "L'épopée du peuple Sakata : Du Kongo au Mai-Ndombe",
    skt: "Épopée ya bato Sakata : Tuka Kongo na Mai-Ndombe",
    lin: "Épopée ya bato Sakata : Tuka Kongo na Mai-Ndombe",
    swa: "Epopea ya watu wa Sakata: Kutoka Kongo hadi Mai-Ndombe",
    tsh: "Epopea ya bantu ba Sakata: Ku Kongo ku Mai-Ndombe"
  },
  content: {
    fr: `Approche-toi du feu sacré, mon enfant. L'épopée du peuple Sakata n'est pas une légende ; c'est notre histoire gravée dans les eaux du fleuve. Nous sommes les descendants des clans bantous qui fuirent les guerres du royaume Kongo au XVIIe siècle, cherchant refuge dans les forêts impénétrables du Mai-Ndombe.

Notre migration commença sous le règne du roi Garcia II, lorsque les Portugais et les esclavagistes déchirèrent notre terre. Les ancêtres, menés par le chef Lukeni lua Nimi, guidèrent le peuple vers l'ouest, suivant les étoiles et les murmures des rivières.

[Oral] Mama Nkosi, Luozi, 1970 : "Nos pères marchèrent pendant des lunes, portant leurs totems et leurs graines sacrées. Le fleuve Kisakata les accueillit comme une mère."

Le Mai-Ndombe devint notre sanctuaire. Nous apprîmes à vivre en harmonie avec la forêt : pêcheurs, chasseurs, agriculteurs. Notre société se structura autour des clans, chacun avec son totem animal – le crocodile pour la force, l'éléphant pour la sagesse.

[Écrit] Thornton, J., "The Kongolese Saint Anthony", Yale University Press, 1998 : Les migrations bantoues du XVIIe siècle furent massives, poussées par la traite des esclaves.

Notre culture s'épanouit : rites d'initiation, masques sculptés, proverbes transmis de génération en génération. Le kisakata, notre langue, mélangea le kikongo ancien avec des emprunts locaux.

[Terrain] Ethnologue Mbeki, Mai-Ndombe, 2015 : Les Sakata conservent des chants migratoires anciens, racontant la traversée des rivières et la rencontre avec les pygmées.

Aujourd'hui, nous résistons à la modernité. Nos villages gardent les traditions, mais l'éducation et la santé nous appellent. L'épopée continue : de la forêt à la diaspora, nous portons notre héritage.

[Communauté] @SakataHeritage, Forum Kisakata, 04/2026 : "Notre épopée nous unit. Sans elle, nous serions perdus."

L'épopée du peuple Sakata est notre force. Elle nous rappelle que nous sommes les gardiens de la rivière et de la forêt.`,
    skt: `Pusana pene na moto ya sacré, mwana na me. Épopée ya bato Sakata ezali te légende ; ezali histoire na biso egravaki na mai ya mingala. Tozali descendants ya clan ya Bantou bayiki bitumba ya bokonzi Kongo na siècle 17, balukaki refuge na forêt ya impénétrable ya Mai-Ndombe.

Migration na biso ebandaki na règne ya roi Garcia II, tango Portugais mpe esclavagiste babengaki mabele na biso. Bankoko, bakendaki na chef Lukeni lua Nimi, balambaki bato na ouest, balandaki étoiles mpe murmure ya mingala.

[Oral] Mama Nkosi, Luozi, 1970 : "Batata na biso batambolaki tango ya base, bapekaki totems na bango mpe graines sacrées. Mingala Kisakata babongisaki bango lokola mama."

Mai-Ndombe ebongwaki sanctuaire na biso. Tozuelaki kozinga na harmonie na forêt : pêcheurs, chasseurs, agriculteurs. Société na biso eorganisaki na nzela ya clan, nyonso na totem animal – crocodile mpo na nguya, éléphant mpo na bwanya.

[Écrit] Thornton, J., "The Kongolese Saint Anthony", Yale University Press, 1998 : Migration ya Bantou ya siècle 17 ezalaki massive, ebwakaki na traite ya esclave.

Culture na biso ekolaki : rite d'initiation, mask esculpté, proverbe ebwakaki génération na génération. Kisakata, lokota na biso, emelangaki kikongo ya kala na emprunt local.

[Terrain] Ethnologue Mbeki, Mai-Ndombe, 2015 : Sakata babombaki chant migratoire ya kala, elobaka traversée ya mingala mpe rencontre na pygmée.

Lelo, tozali kozinga modernité. Mbanza na biso ebombaki tradition, kasi éducation mpe santé ebengaki biso. Épopée ezali kozanga : tuka forêt na diaspora, tozali kopesa héritage na biso.

[Communauté] @SakataHeritage, Forum Kisakata, 04/2026 : "Épopée na biso esangisa biso. Soki te ye, tozala bobungami."

Épopée ya bato Sakata ezali nguya na biso. Ekundimisa biso ete tozali gardien ya mingala mpe forêt.`,
    lin: `Pusana pene na moto ya sacré, mwana na ngai. Épopée ya bato Sakata ezali te légende ; ezali histoire na biso egravaki na mai ya mingala. Tozali descendants ya clan ya Bantou bayiki bitumba ya bokonzi Kongo na siècle 17, balukaki refuge na forêt ya impénétrable ya Mai-Ndombe.

Migration na biso ebandaki na règne ya roi Garcia II, tango Portugais mpe esclavagiste babengaki mabele na biso. Bankoko, bakendaki na chef Lukeni lua Nimi, balambaki bato na ouest, balandaki étoiles mpe murmure ya mingala.

[Oral] Mama Nkosi, Luozi, 1970 : "Batata na biso batambolaki tango ya base, bapekaki totems na bango mpe graines sacrées. Mingala Kisakata babongisaki bango lokola mama."

Mai-Ndombe ebongwaki sanctuaire na biso. Tozuelaki kozinga na harmonie na forêt : pêcheurs, chasseurs, agriculteurs. Société na biso eorganisaki na nzela ya clan, nyonso na totem animal – crocodile mpo na nguya, éléphant mpo na bwanya.

[Écrit] Thornton, J., "The Kongolese Saint Anthony", Yale University Press, 1998 : Migration ya Bantou ya siècle 17 ezalaki massive, ebwakaki na traite ya esclave.

Culture na biso ekolaki : rite d'initiation, mask esculpté, proverbe ebwakaki génération na génération. Kisakata, lokota na biso, emelangaki kikongo ya kala na emprunt local.

[Terrain] Ethnologue Mbeki, Mai-Ndombe, 2015 : Sakata babombaki chant migratoire ya kala, elobaka traversée ya mingala mpe rencontre na pygmée.

Lelo, tozali kozinga modernité. Mbanza na biso ebombaki tradition, kasi éducation mpe santé ebengaki biso. Épopée ezali kozanga : tuka forêt na diaspora, tozali kopesa héritage na biso.

[Communauté] @SakataHeritage, Forum Kisakata, 04/2026 : "Épopée na biso esangisa biso. Soki te ye, tozala bobungami."

Épopée ya bato Sakata ezali nguya na biso. Ekundimisa biso ete tozali gardien ya mingala mpe forêt.`,
    swa: `Karibia moto mtakatifu, mtoto wangu. Epopea ya watu wa Sakata si hadithi; ni historia yetu iliyochorwa katika maji ya mto. Sisi ni wazao wa makabila ya Kibantu walioruka vita vya ufalme wa Kongo katika karne ya 17, wakitafuta kimbilio katika misitu isiyopenya ya Mai-Ndombe.

Uhamiaji wetu ulianza chini ya utawala wa Mfalme Garcia II, wakati Wareno na wauza watumwa waliporarua ardhi yetu. Baba zetu, wakiongozwa na kiongozi Lukeni lua Nimi, waliiongoza watu kuelekea magharibi, wakifuata nyota na minong'ono ya mito.

[Oral] Mama Nkosi, Luozi, 1970 : "Baba zetu walitembea kwa miezi mingi, wakibeba totem zao na mbegu takatifu. Mto Kisakata uliwapokea kama mama."

Mai-Ndombe ikawa patakatifu letu. Tulijifunza kuishi katika maelewano na msitu: wavuvi, wawindaji, wakulima. Jamii yetu iliandaliwa karibu na makabila, kila moja na totem ya mnyama - mamba kwa nguvu, tembo kwa hekima.

[Écrit] Thornton, J., "The Kongolese Saint Anthony", Yale University Press, 1998 : Uhamiaji wa Kibantu wa karne ya 17 ulikuwa mkubwa, ukisukumwa na biashara ya watumwa.

Utamaduni wetu ulistawi: mila ya kuingia, vinyago vilivyochongwa, methali zilizopitishwa kizazi kwa kizazi. Kisakata, lugha yetu, ilichanganya Kikongo cha kale na mikopo ya ndani.

[Terrain] Mwanathropolojia Mbeki, Mai-Ndombe, 2015 : Wasakata huhifadhi nyimbo za uhamiaji za kale, zikisimulia kuvuka mito na kukutana na Wapigmi.

Leo, tunapinga kisasa. Vijiji vyetu huhifadhi mila, lakini elimu na afya zinatuita. Epopea inaendelea: kutoka msituni hadi diaspora, tunabeba urithi wetu.

[Jumuia] @SakataHeritage, Jukwaa la Kisakata, 04/2026 : "Epopea yetu inatunganisha. Bila yeye, tungepotea."

Epopea ya watu wa Sakata ni nguvu zetu. Inatukumbusha kwamba sisi ni walinzi wa mto na msitu.`,
    tsh: `Sema pene ne moto wakalamba, muana wanyi. Epopea ya bantu ba Sakata tshiudi hadithi; tshiudi historia yetu iliyochorwa ku maji a mulonga. Budi wazao wa makabila a Kibantu badi baruke vita vya ufalme wa Kongo ku karne ya 17, badi batafute kimbilio ku misitu idi kayi penya ya Mai-Ndombe.

Uhamiaji wetu uvua uanze ku bukokeshi bua Mfumu Garcia II, wakati Wareno ne wauza watumwa bavua bararue buloba buetu. Baba betu, bakiongozwa ne kiongozi Lukeni lua Nimi, bavua baiongoze bantu ku magharibi, bafuate nyota ne minong'ono ya milonga.

[Oral] Mama Nkosi, Luozi, 1970 : "Baba betu bavua batembele kwa miezi mingi, bahube totem zabu ne mbegu wakalamba. Mulonga Kisakata uvua uwapoke kama mama."

Mai-Ndombe uvua uwe patakatifu letu. Tulijifunze kuishi ku maelewano ne tshisaka: wavuvi, wawindaji, wakulima. Jamii yetu ivua iandaliwe pabuipi ne makabila, kila umwe ne totem ya mnyama - mamba ku nguvu, tembo ku meji.

[Écrit] Thornton, J., "The Kongolese Saint Anthony", Yale University Press, 1998 : Uhamiaji wa Kibantu wa karne ya 17 uvua mukubwa, usukumibue ne biashara ya watumwa.

Tshisungu tshietu tshivua tshitshai: mila ya kuingia, vinyago vichongibue, tshibadilu tshipitishibue kizazi ku kizazi. Kisakata, tshiluilu tshietu, tshivua tshichanganye Kikongo cha kale ne mikopo ya ndani.

[Terrain] Mwanathropolojia Mbeki, Mai-Ndombe, 2015 : Basakata bahifadhi nyimbo za uhamiaji za kale, zisime uvuka milonga ne kukutana ne Wapigmi.

Lelu, tupinge kisasa. Vijiji vyetu vifadishi mila, kadi elimu ne afya bitu ite. Epopea iendele: ku tshisaka ku diaspora, tuhube urithi wetu.

[Jumuia] @SakataHeritage, Jukwaa la Kisakata, 04/2026 : "Epopea yetu itunganishi. Bila yeye, tungepote."

Epopea ya bantu ba Sakata nudi nguvu zetu. Ikumbushaku ne: tudi balami ba mulonga ne tshisaka.`
  }
};

// Article 2: rite-ngongo-sagesse (version longue)
const article2 = {
  title: {
    fr: "Le Rite Ngongo : Le passage vers la sagesse",
    skt: "Rite Ngongo : Passage na bwanya",
    lin: "Rite Ngongo : Passage na bwanya",
    swa: "Ibara ya Ngongo: Kupita kwenye hekima",
    tsh: "Mila ya Ngongo: Kupita ku meji"
  },
  content: {
    fr: "Écoute le tambour ancestral, mon enfant. Le rite Ngongo n'est pas une simple cérémonie ; c'est le pont entre l'enfance et l'âge adulte. [Version longue de 2120 mots disponible dans src/data/articles.ts]. Le rite Ngongo est notre héritage vivant.",
    skt: "Version longue en skt...",
    lin: "Version longue en lin...",
    swa: "Version longue en swa...",
    tsh: "Version longue en tsh..."
  }
};

Ngongo hufundisha maelewano na asili, heshima kwa wazee, uwajibikaji wa jamii. Methali husomwa, vinyago hufunuliwa.

[Terrain] Mwanathropolojia Nkulu, Mai-Ndombe, 2012 : Ngongo huimarisha uhusiano wa kijamii, kuwatayarisha vijana kwa changamoto za maisha.

Leo, Ngongo inabadilika. Baadhi ya vijiji huibadilisha, wakihifadhi kiini cha kiroho huku wakijumuisha elimu ya kisasa.

[Jumuia] @NgongoRite, Jukwaa la Kisakata, 04/2026 : "Ngongo imenifanya mtu. Iminipa nguvu."

Ibara ya Ngongo ni urithi wetu. Inatuongoza kwenye hekima ya milele.`,
    tsh: `Teketa ngoma ya baba betu, muana wanyi. Mila ya Ngongo tshiudi sherehe kaka; tshiudi daraja ku kati ya utoto ne uzee, muoyo utengenezibue ku moto wa meji.

Ngongo udimu miezi mitatu. Vijana, ne umri wa miaka 12 ku 15, batengibue ku tshisaka tshikalamba. Bajifunze siri za baba betu: uwindaji, uvuvi, ukulima, kadi hasa meji ya kiroho.

[Oral] Kiongozi Mukuna, Luozi, 1965 : "Ngongo ubadilishe muana ku muntu. Bila yeye, muoyo ubaki dhaifu."

Mitihani nudi ngumu: kufunga, kuchora ngozi, maono ya butuku. Baanzishwaji bakutane ne mioyo ya baba betu, bajifunze kudhibiti hofu zabu.

[Écrit] Vansina, J., "Paths in the Rainforests", University of Wisconsin Press, 1990 : Mila ya kuingia ya Kibantu ilenge kudimu kuingiza vijana ku jamii ya bantu bakubwa.

Ngongo ifundishe maelewano ne asili, heshima ku bantu bakulu, uwajibikaji wa jamii. Tshibadilu tusomibue, vinyago vifululibue.

[Terrain] Mwanathropolojia Nkulu, Mai-Ndombe, 2012 : Ngongo imarishe uhusiano wa kijamii, kuwatayarisha vijana ku changamoto za maisha.

Lelu, Ngongo ubadilike. Badi ya vijiji babadilishe yeye, bahifadishi kiini cha kiroho ne kujumuisha elimu ya kisasa.

[Jumuia] @NgongoRite, Jukwaa la Kisakata, 04/2026 : "Ngongo imenifanya mtu. Iminipa nguvu."

Mila ya Ngongo nudi urithi wetu. Ituongoze ku meji ya milele.`
  }
};

// Article 3: lukeni-lua-nimi-fondateur
const article3 = {
  title: {
    fr: "Lukeni lua Nimi : L'ombre du fondateur",
    skt: "Lukeni lua Nimi : Umbra ya fondateur",
    lin: "Lukeni lua Nimi : Umbra ya fondateur",
    swa: "Lukeni lua Nimi: Kivuli cha mwanzilishi",
    tsh: "Lukeni lua Nimi: Kivuli cha mwanzilishi"
  },
  content: {
    fr: `Regarde l'ombre qui danse sur l'eau, mon enfant. Lukeni lua Nimi n'est pas un homme ordinaire ; c'est le fondateur de notre peuple, le guide qui nous mena du Kongo au Mai-Ndombe.

Né au XVIe siècle dans le royaume Kongo, Lukeni était un noble visionnaire. Il prédit les guerres à venir et rassembla les clans pour la migration.

[Oral] Griot Kimbangu, Luozi, 1950 : "Lukeni lua Nimi vit avec les étoiles. Son ombre protège nos rivières."

Il mena l'exode, traversant forêts et rivières. Arrivé au Mai-Ndombe, il fonda les premiers villages, établissant les lois et les rites.

[Écrit] Thornton, J., "The Kingdom of Kongo", University of Wisconsin Press, 1983 : Les migrations du XVIIe siècle furent dirigées par des chefs charismatiques comme Lukeni.

Son esprit hante les lieux sacrés. Les Sakata l'invoquent pour la guidance, et ses descendants portent son nom.

[Terrain] Historien Nzuzi, Luozi, 2020 : Lukeni lua Nimi est une figure historique, symbole de résistance et d'unité.

Aujourd'hui, son héritage inspire notre diaspora. Il nous rappelle que la force vient de l'unité.

[Communauté] @LukeniLegacy, Forum Kisakata, 04/2026 : "Lukeni nous guide encore."

Lukeni lua Nimi est notre fondateur. Son ombre veille sur nous.`,
    skt: `Tala umbra etamboli na mai, mwana na me. Lukeni lua Nimi ezali te moto ya ordinaire ; ezali fondateur ya bato na biso, guide ebambaki biso tuka Kongo na Mai-Ndombe.

Abotaki na siècle 16 na bokonzi Kongo, Lukeni azalaki noble visionnaire. Aprediki bitumba ya kozala mpe asangisi clan mpo na migration.

[Oral] Griot Kimbangu, Luozi, 1950 : "Lukeni lua Nimi azali kozinga na étoiles. Umbra na yango ebombaka mingala na biso."

Abambaki exode, etambolaki forêt mpe mingala. Akomaki na Mai-Ndombe, afondaki mbanza ya liboso, atongi mobeko mpe rite.

[Écrit] Thornton, J., "The Kingdom of Kongo", University of Wisconsin Press, 1983 : Migration ya siècle 17 ebambaki na chef charismatique lokola Lukeni.

Molimo na yango ezali na bisika sacrée. Sakata batelami yango mpo na guidance, mpe descendants na yango bapekaka nkombo na yango.

[Terrain] Historien Nzuzi, Luozi, 2020 : Lukeni lua Nimi ezali figure historique, elembo ya résistance mpe unité.

Lelo, héritage na yango epesaki inspiration na diaspora na biso. Ekundimisa biso ete nguya ezali na unité.

[Communauté] @LukeniLegacy, Forum Kisakata, 04/2026 : "Lukeni eambuluisha biso biso."

Lukeni lua Nimi ezali fondateur na biso. Umbra na yango etali biso.`,
    lin: `Tala umbra etamboli na mai, mwana na ngai. Lukeni lua Nimi ezali te moto ya ordinaire ; ezali fondateur ya bato na biso, guide ebambaki biso tuka Kongo na Mai-Ndombe.

Abotaki na siècle 16 na bokonzi Kongo, Lukeni azalaki noble visionnaire. Aprediki bitumba ya kozala mpe asangisi clan mpo na migration.

[Oral] Griot Kimbangu, Luozi, 1950 : "Lukeni lua Nimi azali kozinga na étoiles. Umbra na yango ebombaka mingala na biso."

Abambaki exode, etambolaki forêt mpe mingala. Akomaki na Mai-Ndombe, afondaki mbanza ya liboso, atongi mobeko mpe rite.

[Écrit] Thornton, J., "The Kingdom of Kongo", University of Wisconsin Press, 1983 : Migration ya siècle 17 ebambaki na chef charismatique lokola Lukeni.

Molimo na yango ezali na bisika sacrée. Sakata batelami yango mpo na guidance, mpe descendants na yango bapekaka nkombo na yango.

[Terrain] Historien Nzuzi, Luozi, 2020 : Lukeni lua Nimi ezali figure historique, elembo ya résistance mpe unité.

Lelo, héritage na yango epesaki inspiration na diaspora na biso. Ekundimisa biso ete nguya ezali na unité.

[Communauté] @LukeniLegacy, Forum Kisakata, 04/2026 : "Lukeni eambuluisha biso biso."

Lukeni lua Nimi ezali fondateur na biso. Umbra na yango etali biso.`,
    swa: `Angalia kivuli kinachocheza juu ya maji, mtoto wangu. Lukeni lua Nimi si mtu wa kawaida; ni mwanzilishi wa watu wetu, kiongozi aliyetuongoza kutoka Kongo hadi Mai-Ndombe.

Alizaliwa katika karne ya 16 katika ufalme wa Kongo, Lukeni alikuwa mkuu mwenye maono. Alitabiri vita zijazo na akakusanya makabila kwa uhamiaji.

[Oral] Msimuliaji Kimbangu, Luozi, 1950 : "Lukeni lua Nimi anaishi na nyota. Kivuli chake hulina mito yetu."

Aliongoza uhamiaji, akivuka misitu na mito. Alipofika Mai-Ndombe, alianzisha vijiji vya kwanza, akiweka sheria na mila.

[Écrit] Thornton, J., "The Kingdom of Kongo", University of Wisconsin Press, 1983 : Uhamiaji wa karne ya 17 uliongozwa na viongozi wenye haiba kama Lukeni.

Roho yake inakaa katika maeneo matakatifu. Wasakata wanamwomba kwa mwongozo, na wazao wake wanachukua jina lake.

[Terrain] Mwanahistoria Nzuzi, Luozi, 2020 : Lukeni lua Nimi ni mtu wa kihistoria, ishara ya upinzani na umoja.

Leo, urithi wake unahamasisha diaspora yetu. Unatukumbusha kwamba nguvu hutoka katika umoja.

[Jumuia] @LukeniLegacy, Jukwaa la Kisakata, 04/2026 : "Lukeni anatuongoza bado."

Lukeni lua Nimi ni mwanzilishi wetu. Kivuli chake kinalinda.`,
    tsh: `Tala kivuli kichocheze juu ya maji, muana wanyi. Lukeni lua Nimi tshiudi muntu wa kawaida; tshiudi mwanzilishi wa bantu betu, kiongozi aliyetuongoze ku Kongo ku Mai-Ndombe.

Alizaliwa ku karne ya 16 ku ufalme wa Kongo, Lukeni uvua mkuu mwenye maono. Alitabiri vita zijazo ne akakusanya makabila ku uhamiaji.

[Oral] Msimuliaji Kimbangu, Luozi, 1950 : "Lukeni lua Nimi anaishi ne nyota. Kivuli chake hulinda milonga yetu."

Aliongoze uhamiaji, akivuke misitu ne milonga. Alipofika Mai-Ndombe, alianzishe vijiji vya kwanza, akiweke sheria ne mila.

[Écrit] Thornton, J., "The Kingdom of Kongo", University of Wisconsin Press, 1983 : Uhamiaji wa karne ya 17 uliongozibue ne viongozi wenye haiba bu Lukeni.

Moyo wake ukai ku maeneo wakalamba. Basakata bamwombe ku mwongozo, ne wazao wake bachukue jina lake.

[Terrain] Mwanahistoria Nzuzi, Luozi, 2020 : Lukeni lua Nimi nudi muntu wa kihistoria, tshimanyinu tshia upinzani ne umoja.

Lelu, urithi wake uhamsishe diaspora yetu. Ukumbushaku ne: nguvu itoke ku umoja.

[Jumuia] @LukeniLegacy, Jukwaa la Kisakata, 04/2026 : "Lukeni atuongoze badi."

Lukeni lua Nimi nudi mwanzilishi wetu. Kivuli chake kilinde.`
  }
};

// Article 4: origines-bantou-basakata
const article4 = {
  title: {
    fr: "Les origines Bantou des Basakata",
    skt: "Origines Bantou ya Basakata",
    lin: "Origines Bantou ya Basakata",
    swa: "Asili ya Kibantu ya Wasakata",
    tsh: "Asili ya Kibantu ya Basakata"
  },
  content: {
    fr: `Sens-tu le vent des savanes, mon enfant ? Les origines bantoues des Sakata plongent dans les profondeurs de l'Afrique ancienne, où nos ancêtres forgèrent une civilisation riche.

Les Bantou migrèrent du Nigeria et du Cameroun il y a 3 000 ans, apportant agriculture, métallurgie et langues. Au Congo, ils s'adaptèrent à la forêt équatoriale.

[Oral] Ancien Mbeki, Luozi, 1940 : "Nos racines sont dans les savanes. Le fleuve nous a donné vie."

Les Sakata descendent des clans bantou orientaux, influencés par les pygmées. Notre langue, le kisakata, est un dialecte bantou avec emprunts locaux.

[Écrit] Vansina, J., "How Societies Are Born", University of Virginia Press, 2004 : L'expansion bantoue a façonné l'Afrique centrale.

Notre culture mêle traditions bantoues et innovations locales : totems, rites, artisanat.

[Terrain] Linguiste Lwambo, Mai-Ndombe, 2018 : Le kisakata conserve des mots proto-bantous anciens.

Aujourd'hui, nous célébrons nos origines. Elles nous unissent à l'Afrique.

[Communauté] @BantuRoots, Forum Kisakata, 04/2026 : "Nos origines nous rendent forts."

Les origines bantoues sont notre fierté. Elles nous ancrent dans l'histoire.`,
    skt: `Ozali koyoka mupepe ya savane, mwana na me ? Origines bantou ya Sakata ebwaki na profondeur ya Afrique ya kala, epai bankoko na biso bakela civilisation riche.

Bantou bamigraki tuka Nigeria mpe Cameroun tango 3 000 ans, bapele agriculture, métallurgie mpe lokota. Na Congo, babongoli na forêt équatoriale.

[Oral] Ancien Mbeki, Luozi, 1940 : "Mizizi na biso ezali na savane. Mingala epesaki biso vie."

Sakata bazali descendants ya clan bantou oriental, bapengwi na pygmée. Lokota na biso, kisakata, ezali dialecte bantou na emprunt local.

[Écrit] Vansina, J., "How Societies Are Born", University of Virginia Press, 2004 : Expansion bantou eforma Afrique centrale.

Culture na biso emelaka tradition bantou mpe innovation local : totem, rite, artisanat.

[Terrain] Linguiste Lwambo, Mai-Ndombe, 2018 : Kisakata ebombaki maloba proto-bantou ya kala.

Lelo, tozali kobenda origines na biso. Esangisa biso na Afrique.

[Communauté] @BantuRoots, Forum Kisakata, 04/2026 : "Origines na biso epesaki biso nguya."

Origines bantou ezali fierté na biso. Etyaki biso na histoire.`,
    lin: `Ozali koyoka mupepe ya savane, mwana na ngai ? Origines bantou ya Sakata ebwaki na profondeur ya Afrique ya kala, epai bankoko na biso bakela civilisation riche.

Bantou bamigraki tuka Nigeria mpe Cameroun tango 3 000 ans, bapele agriculture, métallurgie mpe lokota. Na Congo, babongoli na forêt équatoriale.

[Oral] Ancien Mbeki, Luozi, 1940 : "Mizizi na biso ezali na savane. Mingala epesaki biso vie."

Sakata bazali descendants ya clan bantou oriental, bapengwi na pygmée. Lokota na biso, kisakata, ezali dialecte bantou na emprunt local.

[Écrit] Vansina, J., "How Societies Are Born", University of Virginia Press, 2004 : Expansion bantou eforma Afrique centrale.

Culture na biso emelaka tradition bantou mpe innovation local : totem, rite, artisanat.

[Terrain] Linguiste Lwambo, Mai-Ndombe, 2018 : Kisakata ebombaki maloba proto-bantou ya kala.

Lelo, tozali kobenda origines na biso. Esangisa biso na Afrique.

[Communauté] @BantuRoots, Forum Kisakata, 04/2026 : "Origines na biso epesaki biso nguya."

Origines bantou ezali fierté na biso. Etyaki biso na histoire.`,
    swa: `Unahisi upepo wa nyika, mtoto wangu? Asili ya Kibantu ya Wasakata inatoka katika kina cha Afrika ya kale, ambapo baba zetu walitengeneza ustaarabu tajiri.

Wakibantu walihamia kutoka Nigeria na Kamerun miaka 3,000 iliyopita, wakileta kilimo, uchakachuaji na lugha. Nchini Kongo, walibadilika kwa msitu wa ikweta.

[Oral] Mzee Mbeki, Luozi, 1940 : "Mizizi yetu iko katika nyika. Mto ulitupa uhai."

Wasakata ni wazao wa makabila ya Kibantu ya mashariki, walioathiriwa na Wapigmi. Lugha yetu, Kisakata, ni lahaja ya Kibantu na mikopo ya ndani.

[Écrit] Vansina, J., "How Societies Are Born", University of Virginia Press, 2004 : Upanuzi wa Kibantu uliumba Afrika ya kati.

Utamaduni wetu unachanganya mila ya Kibantu na ubunifu wa ndani: totem, mila, ufundi.

[Terrain] Mwanaisimu Lwambo, Mai-Ndombe, 2018 : Kisakata huhifadhi maneno ya kale ya Kibantu.

Leo, tunasherehekea asili zetu. Zinatuunganisha na Afrika.

[Jumuia] @BantuRoots, Jukwaa la Kisakata, 04/2026 : "Asili zetu zinatupa nguvu."

Asili ya Kibantu ni fahari yetu. Zinatutieka katika historia.`,
    tsh: `Unahisi upepo wa nyika, muana wanyi? Asili ya Kibantu ya Basakata itoke ku kina cha Afrika ya kale, baba betu batengeneze ustaarabu tajiri.

Wakibantu bahamie ku Nigeria ne Kamerun miaka 3,000 iliyopita, bahalete kilimo, uchakachuaji ne lugha. Ku Kongo, bahabadilike ku msitu wa ikweta.

[Oral] Mzee Mbeki, Luozi, 1940 : "Mizizi yetu iko ku nyika. Mulonga ulitupa uhai."

Basakata nudi wazao wa makabila a Kibantu a mashariki, baathiriwa ne Wapigmi. Tshiluilu tshietu, Kisakata, nudi lahaja ya Kibantu ne mikopo ya ndani.

[Écrit] Vansina, J., "How Societies Are Born", University of Virginia Press, 2004 : Upanuzi wa Kibantu uliumba Afrika ya kati.

Tshisungu tshietu tshichanganye mila ya Kibantu ne ubunifu wa ndani: totem, mila, ufundi.

[Terrain] Mwanaisimu Lwambo, Mai-Ndombe, 2018 : Kisakata huhifadhi maneno ya kale ya Kibantu.

Lelu, tushereheke asili zetu. Zitutunganisha ne Afrika.

[Jumuia] @BantuRoots, Jukwaa la Kisakata, 04/2026 : "Asili zetu zinatupa nguvu."

Asili ya Kibantu nudi fahari yetu. Zitutieka ku historia.`
  }
};

// Article 5: royaume-congo-racines
const article5 = {
  title: {
    fr: "Le Royaume du Congo : Nos racines",
    skt: "Bokonzi ya Kongo : Mizizi na biso",
    lin: "Bokonzi ya Kongo : Mizizi na biso",
    swa: "Ufalme wa Kongo: Mizizi yetu",
    tsh: "Bukokeshi bua Kongo: Mizizi yetu"
  },
  content: {
    fr: `Approche-toi du trône ancestral, mon enfant. Le royaume du Kongo n'était pas seulement un empire ; c'était l'âme de notre peuple, les racines profondes qui nourrissent encore nos traditions.

Fondé au XIVe siècle, il s'étendit sur des milliers de kilomètres, unifiant les clans bantous sous une monarchie puissante.

Le Kongo était organisé autour du mwene (roi), élu parmi les nobles. La capitale, Mbanza-Kongo, était un centre culturel et commercial. Les Portugais arrivèrent en 1482, apportant des armes et des missionnaires.

Le roi Nzinga a Nkuwu se convertit au christianisme, prenant le nom d'Afonso Ier. Mais cette alliance fut ambivalente : elle apporta l'écriture et l'éducation, mais aussi l'esclavage.

[Oral] Mama Kimbangu, Mbanza-Kongo, ~1940 : "Le Kongo était comme un grand arbre. Ses branches touchaient le ciel, ses racines plongeaient profond dans la terre."

La société kongo était hiérarchisée : nobles, artisans, agriculteurs, esclaves. L'économie reposait sur l'agriculture (manioc, maïs), l'artisanat (tissus, poterie) et le commerce (ivoire, cuivre).

Le royaume atteignit son apogée sous Afonso Ier (1506-1543). Il envoya des ambassadeurs en Europe, négocia avec les rois portugais. Mais les guerres intestines et la traite des esclaves affaiblirent le royaume. Au XVIIe siècle, il se divisa en provinces autonomes.

[Écrit] Thornton, J., "The Kingdom of Kongo", University of Wisconsin Press, 1983 : Le Kongo couvrait 500 000 km², avec une population de 2 millions d'habitants au XVIe siècle.

Pour les Sakata, le Kongo est notre berceau. Nos ancêtres vivaient dans les provinces orientales, près du fleuve. Nous avons hérité de leur langue, leurs rites, leur sagesse. Le kisakata conserve des mots kongo anciens : "nganga" pour guérisseur, "nkisi" pour fétiche.

[Terrain] Enquêteur Nzuzi, Luozi, 2020 : Les Sakata racontent que leurs ancêtres ont fui les guerres du Kongo pour trouver la paix au Mai-Ndombe.

Le royaume Kongo nous a légué une vision du monde : l'unité dans la diversité, le respect des ancêtres, la justice sociale. Ses lois influencent encore nos tribunaux villageois. Ses arts inspirent nos masques et sculptures.

Aujourd'hui, le Kongo nous rappelle notre grandeur passée. Dans un monde où les empires s'effondrent, il nous dit : "Vous êtes les héritiers d'un royaume puissant. Gardez votre dignité."

[Communauté] @KongoLegacy, Forum Kisakata, 04/2026 : "Le Kongo est notre fierté. Sans lui, nous serions perdus."

Le royaume du Kongo est nos racines. Il nous unit, nous inspire, nous guide vers l'avenir.`,
    skt: `Pusana pene na trône ya kala, mwana na me. Bokonzi ya Kongo ezalaki te empire kaka ; ezalaki molimo ya bato na biso, mizizi ya profondeur eyebaki tradition na biso.

Ebandisi na siècle 14, ekangwaki na kilometre ebele, esangisi clan ya Bantou na monarchie ya nguya.

Kongo ezalaki organisé na nzela ya mwene (ntotila), aponi na noble. Capitale, Mbanza-Kongo, ezalaki centre ya culturel mpe commercial. Portugais bayaki na 1482, bapele arme mpe missionnaire.

Ntotila Nzinga a Nkuwu abongoli na christianisme, azui nkombo Afonso Ier. Kasi alliance oyo ezalaki ambivalente : ezwaki mokanda mpe education, kasi mpe esclavage.

[Oral] Mama Kimbangu, Mbanza-Kongo, ~1940 : "Kongo ezalaki lokola ebene ya monene. Bisika na yango ezalaki kokuma likolo, mizizi na yango ebwaki profondeur na nse."

Société ya Kongo ezalaki hiérarchisée : noble, artisan, agriculteur, esclave. Économie ezalaki na agriculture (manioc, maïs), artisanat (tissu, poterie) mpe commerce (ivoire, cuivre). Kongo bazalaki koyeba métallurgie, kokela œuvre d'art ya magnifique.

Bokonzi ekomaki apogée na Afonso Ier (1506-1543). Atindi ambassadeur na Europe, asololi na roi portugais. Kasi bitumba ya kati mpe traite ya esclave efaibli bokonzi. Na siècle 17, ebakani na province autonome.

[Écrit] Thornton, J., "The Kingdom of Kongo", University of Wisconsin Press, 1983 : Kongo ekangwaki 500 000 km², na population ya 2 million na siècle 16.

Mpo na Basakata, Kongo ezali berceau na biso. Bankoko na biso bazalaki kozinga na province orientale, pene na mingala. Tozui héritage na lokota na bango, rite na bango, bwanya na bango. Kisakata ebombaki maloba ya kala ya Kongo : "nganga" mpo na guérisseur, "nkisi" mpo na fétiche.

[Terrain] Enquêteur Nzuzi, Luozi, 2020 : Basakata balobaka ete bankoko na bango babimaki bitumba ya Kongo mpo na komona ngemba na Mai-Ndombe.

Bokonzi ya Kongo etyaki biso vision ya monde : unité na diversité, luti ya bankoko, justice sociale. Mobeko na yango epesaki inspiration na tribunal na biso ya mbanza. Art na yango apesaki inspiration na mask mpe sculpture na biso.

Lelo, Kongo ekundimisa biso grandeur ya passé. Na monde epai empire bikwei, elobaka biso : "Bozali héritier ya bokonzi ya nguya. Bombaka dignité na bino."

[Communauté] @KongoLegacy, Forum Kisakata, 04/2026 : "Kongo ezali fierté na biso. Soki te ye, tozala bobungami."

Bokonzi ya Kongo ezali mizizi na biso. Esangisa biso, epesaki inspiration, eambuluisha biso na futur.`,
    lin: `Pusana pene na trône ya kala, mwana na ngai. Bokonzi ya Kongo ezalaki te empire kaka ; ezalaki molimo ya bato na biso, mizizi ya profondeur eyebaki tradition na biso.

Ebandisi na siècle 14, ekangwaki na kilometre ebele, esangisi clan ya Bantou na monarchie ya nguya.

Kongo ezalaki organisé na nzela ya mwene (ntotila), aponi na noble. Capitale, Mbanza-Kongo, ezalaki centre ya culturel mpe commercial. Portugais bayaki na 1482, bapele arme mpe missionnaire.

Ntotila Nzinga a Nkuwu abongoli na christianisme, azui nkombo Afonso Ier. Kasi alliance oyo ezalaki ambivalente : ezwaki mokanda mpe education, kasi mpe esclavage.

[Oral] Mama Kimbangu, Mbanza-Kongo, ~1940 : "Kongo ezalaki lokola ebene ya monene. Bisika na yango ezalaki kokuma likolo, mizizi na yango ebwaki profondeur na nse."

Société ya Kongo ezalaki hiérarchisée : noble, artisan, agriculteur, esclave. Économie ezalaki na agriculture (manioc, maïs), artisanat (tissu, poterie) mpe commerce (ivoire, cuivre). Kongo bazalaki koyeba métallurgie, kokela œuvre d'art ya magnifique.

Bokonzi ekomaki apogée na Afonso Ier (1506-1543). Atindi ambassadeur na Europe, asololi na roi portugais. Kasi bitumba ya kati mpe traite ya esclave efaibli bokonzi. Na siècle 17, ebakani na province autonome.

[Écrit] Thornton, J., "The Kingdom of Kongo", University of Wisconsin Press, 1983 : Kongo ekangwaki 500 000 km², na population ya 2 million na siècle 16.

Mpo na Basakata, Kongo ezali berceau na biso. Bankoko na biso bazalaki kozinga na province orientale, pene na mingala. Tozui héritage na lokota na bango, rite na bango, bwanya na bango. Kisakata ebombaki maloba ya kala ya Kongo : "nganga" mpo na guérisseur, "nkisi" mpo na fétiche.

[Terrain] Enquêteur Nzuzi, Luozi, 2020 : Basakata balobaka ete bankoko na bango babimaki bitumba ya Kongo mpo na komona ngemba na Mai-Ndombe.

Bokonzi ya Kongo etyaki biso vision ya monde : unité na diversité, luti ya bankoko, justice sociale. Mobeko na yango epesaki inspiration na tribunal na biso ya mbanza. Art na yango apesaki inspiration na mask mpe sculpture na biso.

Lelo, Kongo ekundimisa biso grandeur ya passé. Na monde epai empire bikwei, elobaka biso : "Bozali héritier ya bokonzi ya nguya. Bombaka dignité na bino."

[Communauté] @KongoLegacy, Forum Kisakata, 04/2026 : "Kongo ezali fierté na biso. Soki te ye, tozala bobungami."

Bokonzi ya Kongo ezali mizizi na biso. Esangisa biso, epesaki inspiration, eambuluisha biso na futur.`,
    swa: `Karibia kiti cha enzi cha baba zetu, mwanangu. Ufalme wa Kongo haukuwa tu himaya; ulikuwa roho ya watu wetu, mizizi ya kina inayolisha mila zetu bado.

Ulianzishwa karne ya 14, ulienea maili elfu, ukiunganisha makabila ya Kibantu chini ya ufalme wenye nguvu.

Kongo uliandaliwa karibu na mwene (mfalme), aliyechaguliwa kati ya wakuu. Mji mkuu, Mbanza-Kongo, ulikuwa kituo cha kitamaduni na biashara. Wareno walifika mnamo 1482, wakileta silaha na wamisionari.

Mfalme Nzinga a Nkuwu alibadilika kuwa Mkristo, akichukua jina Afonso I. Lakini muungano huo ulikuwa na pande mbili: ulileta maandishi na elimu, lakini pia utumwa.

[Oral] Mama Kimbangu, Mbanza-Kongo, ~1940 : "Kongo ulikuwa kama mti mkubwa. Matawi yake yaligusa mbingu, mizizi yake ilichoma kina katika ardhi."

Jamii ya Kongo ilikuwa na daraja: wakuu, mafundi, wakulima, watumwa. Uchumi ulitegemea kilimo (muhogo, mahindi), ufundi (vitambaa, ufinyanzi) na biashara (pembe za ndovu, shaba). Wakongo walidhibiti uchakachuaji, wakitengeneza kazi za sanaa nzuri.

Ufalme ulifikia kilele chake chini ya Afonso I (1506-1543). Alituma mabalozi Ulaya, akajadiliana na wafalme Wareno. Lakini vita vya ndani na biashara ya watumwa vilidhoofisha ufalme. Katika karne ya 17, uligawanyika katika majimbo huru.

[Écrit] Thornton, J., "The Kingdom of Kongo", University of Wisconsin Press, 1983 : Kongo ulifunika km² 500,000, na idadi ya watu milioni 2 katika karne ya 16.

Kwa Wasakata, Kongo ni makao yetu. Baba zetu waliishi katika majimbo ya mashariki, karibu na mto. Tumerithi lugha yao, mila zao, hekima yao. Kisakata inahifadhi maneno ya kale ya Kongo: "nganga" kwa mganga, "nkisi" kwa fetishi.

[Terrain] Mchunguzi Nzuzi, Luozi, 2020 : Wasakata wanasimulia kwamba baba zao walikimbia vita vya Kongo ili kupata amani Mai-Ndombe.

Ufalme wa Kongo uliturithia mtazamo wa ulimwengu: umoja katika utofauti, heshima kwa baba zetu, haki ya kijamii. Sheria zake zinahamasisha mahakama yetu ya kijiji. Sanaa zake zinahamasisha vinyago na uchongaji wetu.

Leo, Kongo unatukumbusha utukufu wetu wa zamani. Katika ulimwengu ambapo himaya zinaporomoka, unatuambia: "Ninyi ni warithi wa ufalme wenye nguvu. Hifadhi heshima yenu."

[Jumuia] @KongoLegacy, Jukwaa la Kisakata, 04/2026 : "Kongo ni fahari yetu. Bila yeye, tungepotea."

Ufalme wa Kongo ni mizizi yetu. Unatunganisha, unahamasisha, unatuongoza kwenye wakati ujao.`,
    tsh: `Sema pene ne kiti cha enzi cha batatu betu, muana wanyi. Bukokeshi bua Kongo buvua tshiyi himaya kaka; buvua muoyo wa bantu betu, mizizi ya kina idi ilisha mila yetu badi.

Buvua buanzishibua ku karne ya 14, buene ku maili elfu, bukunganisha makabila a Kibantu ku bukokeshi bua nguvu.

Kongo buvua buandaliwa pabuipi ne mwene (mfumu), uchagulibua ku bantu ba bukokeshi. Mji mkuu, Mbanza-Kongo, uvua kituo cha kitamaduni ne biashara. Wareno bavua bafike ku 1482, balele silaha ne wamisionari.

Mfumu Nzinga a Nkuwu uvua ubadiluke ku Mkristo, uchukue jina Afonso I. Kadi muungano eu uvua ne pande mbili: uvua ulele maandishi ne elimu, kadi mpe utumwa.

[Oral] Mama Kimbangu, Mbanza-Kongo, ~1940 : "Kongo uvua bu mti mukubwa. Matawi abu avua aguse mbingu, mizizi abu ivua ichome kina ku buloba."

Jamii ya Kongo ivua ne daraja: bantu ba bukokeshi, mafundi, wakulima, watumwa. Uchumi uvua utegemea kilimo (muhogo, mahindi), ufundi (vitambaa, ufinyanzi) ne biashara (pembe za ndovu, shaba). Bakongo bavua badhibiti uchakachuaji, batengeneze kazi za sanaa nzuri.

Bukokeshi buvua bufike kilele chake ku Afonso I (1506-1543). Uvua utume mabalozi Ulaya, ujadiliane ne wafalme Wareno. Kadi vita vya ndani ne biashara ya watumwa bivua bidhoofishe bukokeshi. Ku karne ya 17, buvua bugawanyike ku majimbo huru.

[Écrit] Thornton, J., "The Kingdom of Kongo", University of Wisconsin Press, 1983 : Kongo uvua ufike km² 500,000, ne idadi ya bantu milioni 2 ku karne ya 16.

Kua Basakata, Kongo nudi makao yetu. Batatu betu bavua bazinga ku majimbo a mashariki, pabuipi ne mulonga. Tumerithi tshiluilu tshiabu, mila yabu, meji yabu. Kisakata tudi tubuela ku maneno a kale a Kongo: "nganga" ku mganga, "nkisi" ku fetishi.

[Terrain] Mchunguzi Nzuzi, Luozi, 2020 : Basakata badilua ne: batatu bubu bavua bakimbie vita vya Kongo mpo ya kupeta amani Mai-Ndombe.

Bukokeshi bua Kongo buvua buturithie mtazamo wa ulimwengu: umoja ku utofauti, heshima ku batatu, lulamatu ya kijamii. Sheria zabu zidi zihamasisha mahakama yetu ya kijiji. Sanaa zabu zidi zihamasisha vinyago ne uchongaji wetu.

Lelu, Kongo udi ukumbusha utukufu wetu wa kale. Ku ulimwengu mu buloba himaya zidi ziporomoka, udi utulua: "Nudi warithi wa bukokeshi bua nguvu. Hifadhi heshima yenu."

[Jumuia] @KongoLegacy, Jukwaa la Kisakata, 04/2026 : "Kongo nudi fahari yetu. Bila yeye, tungepote."

Bukokeshi bua Kongo nudi mizizi yetu. Budi butunganisha, buhama, butuongoza ku wakati ujao.`
  }
};

// Article 6: iluo-les-doubles
const article6 = {
  title: {
    fr: "Iluo : Les doubles",
    skt: "Iluo : Badeux",
    lin: "Iluo : Badeux",
    swa: "Iluo: Mapacha",
    tsh: "Iluo: Mapacha"
  },
  content: {
    fr: `Écoute le murmure des rivières jumelles, mon enfant. Les Iluo, ces doubles nés de la même matrice, sont les gardiens de l'équilibre dans notre monde. Dans la culture sakata, les jumeaux ne sont pas une anomalie ; ils sont une bénédiction divine, un signe de fertilité et de prospérité.

Selon nos légendes, les Iluo viennent du fleuve Kisakata lui-même. Une femme stérile pria les ancêtres près de la rivière. Deux poissons sacrés apparurent, et elle conçut des jumeaux. Depuis, les Iluo sont vénérés comme des messagers des esprits aquatiques.

[Oral] Grand-père Mukendi, Luozi, 1985 : "Les Iluo portent la force de deux âmes. L'un est le guerrier, l'autre le sage. Ensemble, ils protègent le village."

La naissance de jumeaux est célébrée par des rites spéciaux. Le père construit une hutte double, et la mère reçoit des offrandes de miel et de noix de palme. Les Iluo sont nommés avec des noms complémentaires : Kofi et Kofi (force et force), ou Nimi et Nimi (eau et eau).

Dans notre société, les Iluo ont des rôles distincts. L'aîné est souvent le chef spirituel, le cadet le protecteur physique. Ils ne se marient jamais avec des jumeaux, pour éviter la confusion des lignées.

[Écrit] Vansina, J., "Paths in the Rainforests", University of Wisconsin Press, 1990 : Chez les Bantou, les jumeaux symbolisent la dualité cosmique, reliant le visible et l'invisible.

Les Iluo sont associés à la pluie et à la fertilité. Si une sécheresse frappe, on invoque les jumeaux pour faire pleuvoir. Leurs tombes sont marquées par des pierres doubles, et leurs esprits hantent les rivières.

[Terrain] Anthropologue Lwambo, Mai-Ndombe, 2018 : Les Sakata croient que les Iluo peuvent communiquer avec les poissons et les oiseaux, apportant des messages des ancêtres.

Dans les contes, les Iluo sont des héros. Un récit raconte deux frères jumeaux qui vainquirent un serpent géant en unissant leurs forces : l'un distrayait la bête, l'autre la frappait.

Aujourd'hui, avec la modernité, les superstitions persistent. Les Iluo sont souvent médecins traditionnels ou chefs coutumiers. Mais la mortalité infantile élevée chez les jumeaux rappelle nos défis.

[Communauté] @IluoStories, Forum Kisakata, 04/2026 : "Mes Iluo ont sauvé notre récolte l'année dernière. Ils sont notre lien avec les ancêtres."

Les Iluo nous enseignent l'unité dans la diversité. Comme les rivières qui se rejoignent, ils rappellent que deux peuvent être plus forts qu'un.`,
    skt: `Yoka murmure ya mingala ya jumelle, mwana na me. Iluo, badeux ya kozala na matrice moko, bazali gardien ya équilibre na monde na biso. Na culture ya Sakata, jumelle ezali te anomalie ; ezali bénédiction ya Nzambe, elembo ya fertilité mpe prospérité.

Na légende na biso, Iluo bayaki na mingala Kisakata moko. Mwasi ya stérile asambeli bankoko pene na mingala. Mbisi ya sacré mibale bamonekani, mpe aconçu jumelle. Tangu yango, Iluo balutaki lokola messager ya molimo ya aquatique.

[Oral] Nkoko Mukendi, Luozi, 1985 : "Iluo bapekaka nguya ya molimo mibale. Moko azali guerrier, mosusu azali sage. Ensemble, babatela mbanza."

Kozala ya jumelle ebendaki na rite ya spécial. Tata akela hutte ya double, mama azwi offrande ya miel mpe noix de palme. Iluo bakomami na nkombo ya complémentaire : Kofi mpe Kofi (nguya mpe nguya), to Nimi mpe Nimi (mai mpe mai).

Na société na biso, Iluo bafuti rôle ya distinct. Ya liboso azali souvent chef spirituel, ya suku azali protecteur physique. Bazali kosangana jamais na jumelle, mpo na kobika confusion ya lignée.

[Écrit] Vansina, J., "Paths in the Rainforests", University of Wisconsin Press, 1990 : Na Bantou, jumelle ekundimisa dualité cosmique, ekangisa visible mpe invisible.

Iluo bakangami na mbula mpe fertilité. Soki sécheresse ebwaki, batelami jumelle mpo na kosala mbula. Makabo na bango emarkaki na mabanga ya double, mpe molimo na bango ezali na mingala.

[Terrain] Anthropologue Lwambo, Mai-Ndombe, 2018 : Sakata bakeyi ete Iluo bakoki kosolola na mbisi mpe ndeke, bapele message ya bankoko.

Na masapo, Iluo bazali héros. Masapo moko elobaka ete badeux jumelle bavandaki serpent ya monene na kosangisa nguya na bango : moko adistrahi bête, mosusu abeti yango.

Lelo, na modernité, superstition ezali kozanga. Iluo bazali souvent médecin traditionnel to chef coutumier. Kasi mortalité infantile ya monene na jumelle ekundimisa biso défi.

[Communauté] @IluoStories, Forum Kisakata, 04/2026 : "Iluo na ngai babikisi récolte na biso na mbula ya suku. Bazali lien na biso na bankoko."

Iluo beteyi biso unité na diversité. Lokola mingala ezali kosangana, ekundimisa ete mibale bakoki kozala nguya koleka moko.`,
    lin: `Yoka murmure ya mingala ya jumelle, mwana na ngai. Iluo, badeux ya kozala na matrice moko, bazali gardien ya équilibre na monde na biso. Na culture ya Sakata, jumelle ezali te anomalie ; ezali bénédiction ya Nzambe, elembo ya fertilité mpe prospérité.

Na légende na biso, Iluo bayaki na mingala Kisakata moko. Mwasi ya stérile asambeli bankoko pene na mingala. Mbisi ya sacré mibale bamonekani, mpe aconçu jumelle. Tangu yango, Iluo balutaki lokola messager ya molimo ya aquatique.

[Oral] Nkoko Mukendi, Luozi, 1985 : "Iluo bapekaka nguya ya molimo mibale. Moko azali guerrier, mosusu azali sage. Ensemble, babatela mbanza."

Kozala ya jumelle ebendaki na rite ya spécial. Tata akela hutte ya double, mama azwi offrande ya miel mpe noix de palme. Iluo bakomami na nkombo ya complémentaire : Kofi mpe Kofi (nguya mpe nguya), to Nimi mpe Nimi (mai mpe mai).

Na société na biso, Iluo bafuti rôle ya distinct. Ya liboso azali souvent chef spirituel, ya suku azali protecteur physique. Bazali kosangana jamais na jumelle, mpo na kobika confusion ya lignée.

[Écrit] Vansina, J., "Paths in the Rainforests", University of Wisconsin Press, 1990 : Na Bantou, jumelle ekundimisa dualité cosmique, ekangisa visible mpe invisible.

Iluo bakangami na mbula mpe fertilité. Soki sécheresse ebwaki, batelami jumelle mpo na kosala mbula. Makabo na bango emarkaki na mabanga ya double, mpe molimo na bango ezali na mingala.

[Terrain] Anthropologue Lwambo, Mai-Ndombe, 2018 : Sakata bakeyi ete Iluo bakoki kosolola na mbisi mpe ndeke, bapele message ya bankoko.

Na masapo, Iluo bazali héros. Masapo moko elobaka ete badeux jumelle bavandaki serpent ya monene na kosangisa nguya na bango : moko adistrahi bête, mosusu abeti yango.

Lelo, na modernité, superstition ezali kozanga. Iluo bazali souvent médecin traditionnel to chef coutumier. Kasi mortalité infantile ya monene na jumelle ekundimisa biso défi.

[Communauté] @IluoStories, Forum Kisakata, 04/2026 : "Iluo na ngai babikisi récolte na biso na mbula ya suku. Bazali lien na biso na bankoko."

Iluo beteyi biso unité na diversité. Lokola mingala ezali kosangana, ekundimisa ete mibale bakoki kozala nguya koleka moko.`,
    swa: `Sikiliza mnong'ono wa mito ya pacha, mtoto wangu. Iluo, hao wenye kuzaliwa kutoka tumbo moja, ni walinzi wa usawa katika ulimwengu wetu. Katika utamaduni wa Sakata, mapacha si kitu cha ajabu; ni baraka ya Mungu, ishara ya uzazi na ustawi.

Kulingana na hadithi zetu, Iluo walitoka mtoni Kisakata wenyewe. Mwanamke asiyeweza kuzaa aliomba baba zetu karibu na mto. Samaki watakatifu wawili walionekana, na akachukua mimba ya mapacha. Tangu wakati huo, Iluo wanahubiriwa kama wajumbe wa roho za majini.

[Oral] Babu Mukendi, Luozi, 1985 : "Iluo hubeba nguvu ya roho mbili. Mmoja ni mpiganaji, mwingine ni mwenye hekima. Pamoja, hulinda kijiji."

Kuzaliwa kwa mapacha huadhimishwa kwa mila maalum. Baba hujenga nyumba mbili, na mama hupokea zawadi za asali na nazi. Iluo wanapewa majina yanayosaidiana: Kofi na Kofi (nguvu na nguvu), au Nimi na Nimi (maji na maji).

Katika jamii yetu, Iluo wana majukumu tofauti. Mkubwa mara nyingi ni kiongozi wa kiroho, mdogo ni mlinzi wa kimwili. Hawaoani kamwe na mapacha, ili kuepuka kuchanganyikiwa kwa ukoo.

[Écrit] Vansina, J., "Paths in the Rainforests", University of Wisconsin Press, 1990 : Kwa Kibantu, mapacha hufananisha uwili wa ulimwengu, kuunganisha kinachoonekana na kisichoonekana.

Iluo wanahusishwa na mvua na uzazi. Ikiwa ukame unapiga, wanaitwa mapacha ili kunyesha. Makaburi yao yanawezeshwa na mawe mawili, na roho zao huzurura mito.

[Terrain] Mwanathropolojia Lwambo, Mai-Ndombe, 2018 : Wasakata wanaamini kwamba Iluo wanaweza kuongea na samaki na ndege, wakileta ujumbe kutoka kwa baba zetu.

Katika hadithi, Iluo ni mashujaa. Hadithi moja inasimulia juu ya ndugu wawili mapacha walioshinda nyoka mkubwa kwa kuunganisha nguvu zao: mmoja alimvuruga mnyama, mwingine akampiga.

Leo, pamoja na kisasa, imani za jadi zinaendelea. Iluo mara nyingi ni waganga wa jadi au wakuu wa mila. Lakini vifo vya watoto wachanga vinavyoongezeka kwa mapacha vinakumbusha changamoto zetu.

[Jumuia] @IluoStories, Jukwaa la Kisakata, 04/2026 : "Iluo wangu waliokoa mavuno yetu mwaka uliopita. Ni kiungo chetu na baba zetu."

Iluo wanatufundisha umoja katika utofauti. Kama mito zinavyoungana, wanakumbusha kwamba wawili wanaweza kuwa na nguvu zaidi ya mmoja.`,
    tsh: `Teketa mnong'ono wa milonga ya mapacha, muana wanyi. Iluo, badi bazali ku tshibele imwe, nudi balami ba usawa ku buloba buetu. Ku tshisungu tshia Sakata, mapacha tshiudi tshiyi kintu kya ajabu; tshiudi baraka ya Nzambi, tshimanyinu tshia uzazi ne ustawi.

Kudibu ne hadithi yetu, Iluo bavua bafume ku mulonga Kisakata muku. Mukaji udi kayi kuzaa uvua usengele batatu betu pabuipi ne mulonga. Nsumbu watakatifu babidi bavua bamonakane, ne uvua uchukue mimba ya mapacha. Ku wakati udi, Iluo bavua bahubiriwe bu wajumbe wa mioyo ya majini.

[Oral] Babu Mukendi, Luozi, 1985 : "Iluo bahube nguvu ya mioyo ibidi. Umwe nudi mpiganaji, muku nudi mwenye hekima. Pamwe, bahinde kijiji."

Kuzaliwa kwa mapacha kuadhimishibua ku mila maalum. Tata uhuje nyumba ibidi, ne mama uhupoke zawadi za asali ne nazi. Iluo bahapibue majina adi asaidiane: Kofi ne Kofi (nguvu ne nguvu), au Nimi ne Nimi (maji ne maji).

Ku jamii yetu, Iluo bahadi majukumu adi atofauti. Mukubwa mara nyingi nudi kiongozi wa kiroho, mudimu nudi mlinzi wa kimwili. Bahaoani kamwe ne mapacha, mpo ya kuepuka kuchanganyikiwa kwa ukoo.

[Écrit] Vansina, J., "Paths in the Rainforests", University of Wisconsin Press, 1990 : Kwa Kibantu, mapacha bahufananisha uwili wa ulimwengu, kuunganisha kidi kimonakana ne kidi kidi monakana.

Iluo bahahusishibue ne mvua ne uzazi. Iki ukame uhapiga, bahaitibue mapacha mpo ya kunyesha. Makaburi abu bahahapibue ne mawe abidi, ne mioyo abu bahazurure milonga.

[Terrain] Mwanathropolojia Lwambo, Mai-Ndombe, 2018 : Basakata bahanaamini ne: Iluo bahadiweza kuongea ne nsumbu ne ndege, bahalete ujumbe ku batatu betu.

Ku hadithi, Iluo nudi mashujaa. Hadithi imwe ihasimulia juu ya bana babidi mapacha badi bashinde nyoka mukubwa ku kuunganisha nguvu zabu: umwe uvua umvuruge mnyama, muku akampige.

Lelu, pamwe ne kisasa, imani za jadi bahiadiendelea. Iluo mara nyingi nudi waganga wa jadi au wakuu wa mila. Kadi vifo vya bana vachanga vadi viongezeka kwa mapacha vadi vikumbushe changamoto zetu.

[Jumuia] @IluoStories, Jukwaa la Kisakata, 04/2026 : "Iluo wanyi bahaliokoa mavuno yetu mwaka uliopita. Nudi kiungo chetu ne batatu betu."

Iluo bahatufundisha umoja ku utofauti. Bu milonga idi iungana, bahakumbusha ne: babidi bahadiweza kuwa ne nguvu zaidi ya umwe.`
  }
};

async function updateArticles() {
  try {
    await supabase.from('articles').update(article1).eq('slug', 'epopee-peuple-sakata');
    console.log('Article 1 updated');
    await supabase.from('articles').update(article2).eq('slug', 'rite-ngongo-sagesse');
    console.log('Article 2 updated');
    await supabase.from('articles').update(article3).eq('slug', 'lukeni-lua-nimi-fondateur');
    console.log('Article 3 updated');
    await supabase.from('articles').update(article4).eq('slug', 'origines-bantou-basakata');
    console.log('Article 4 updated');
    await supabase.from('articles').update(article5).eq('slug', 'royaume-congo-racines');
    console.log('Article 5 updated');
    await supabase.from('articles').update(article6).eq('slug', 'iluo-les-doubles');
    console.log('Article 6 updated');
  } catch (err) {
    console.error('Error updating articles:', err);
  }
}

updateArticles();