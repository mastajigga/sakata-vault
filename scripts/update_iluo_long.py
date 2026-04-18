import os
from supabase import create_client, Client
from dotenv import load_dotenv

# Load env vars from .env.local
load_dotenv('c:/Users/Fortuné/Projects/Sakata/.env.local')

url = os.environ.get("NEXT_PUBLIC_SUPABASE_URL")
# Use service role key if available for higher permissions, else anon key
key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY") or os.environ.get("NEXT_PUBLIC_SUPABASE_ANON_KEY")

supabase: Client = create_client(url, key)

ARTICLE_ID = "4eb5c192-bca8-47dd-a9d0-1b5630df7535"

content_fr = """# ILUO : LE SOUFFLE DE L'INVISIBLE ET LE COMMANDEMENT DES DOUBLES
*Récit de sagesse pour les enfants de la Lukenie*

## INTRODUCTION : LA PAROLE QUI VIENT DE LOIN

### *Nkundi ya bakoko : "Mpi ya nzoto, elimo ya nzoto ; kasi Iluo, elimo ya mokili mobimba."*
— Proverbe de nos anciens : Le souffle du corps est pour le corps ; mais l'Iluo est le souffle qui embrasse le monde entier.

Approche, mon enfant. Assieds-toi plus près du feu, là où la fumée danse avant de monter se perdre dans la couronne des grands arbres. Tu vois cette fumée ? Elle est comme nous. Elle naît d'un bois solide, mais elle finit par devenir invisible, tout en restant capable de piquer les yeux ou de porter l'odeur du foyer jusqu'à l'autre bout du village.

Aujourd'hui, je vais te parler de l'**Iluo**. Pas ce que les étrangers en disent, eux qui ne voient que des ombres et de la peur, mais ce que nos ancêtres nous ont murmuré à l'oreille depuis que le premier Sakata a appris à écouter battre le cœur de l'invisible. L'Iluo n'est pas une simple "chose" que l'on possède ; c'est un état de l'être, c'est l'art de vivre en harmonie avec son propre double pour que la vie ne s'arrête pas à la peau de nos mains.

---

## CHAPITRE I : LE SOUFFLE ET LE MYSTÈRE DU DOUBLE

### La Dualité Créatrice
Dans notre culture, l'homme ne marche jamais sur une seule jambe spirituelle. Quand le Créateur a façonné le premier homme, il n'a pas seulement modelé de l'argile. Il a soufflé. Et ce souffle n'est pas resté prisonnier de la poitrine. Il s'est divisé en deux, comme une rivière qui rencontre une île.

Il y a le *Biongé*, ce corps qui a besoin de *foufou*, de poisson et de sommeil. C'est l'outil qui nous permet de travailler la terre et de porter nos bébés. Mais le *Biongé* est lourd. Il ne peut pas traverser la forêt en un clin d'œil. Il ne peut pas savoir ce qui se passe dans le village voisin avant que le messager n'arrive.

C'est pour cela qu'il y a l'**Elimo**, le principe vital, et sa manifestation la plus mystérieuse : l'**Iluo**. L'Iluo, c'est ton "double". Ce n'est pas un fantôme, c'est toi, mais dans une dimension où les murs n'existent plus, où l'eau ne mouille pas et où le temps ne pèse rien. 

### La Métaphore du Piroguier
Imagine une pirogue sur la Lukenie. Le piroguier, c'est ton corps. La pirogue, c'est ton existence sociale. Mais le reflet de la pirogue dans l'eau, limpide et parfait, c'est ton Iluo. Tant que l'eau est agitée, le reflet est brisé, on ne le voit pas. Mais quand l'eau devient calme, le reflet devient aussi réel que la pirogue. 

Le secret de nos ancêtres était de stabiliser l'eau de leur cœur pour que le reflet — l'Iluo — puisse agir. Un homme sans Iluo conscient est comme un piroguier qui ignore son propre reflet : il est incomplet. Il subit le courant sans jamais comprendre la force qui le porte.

### Le Silence du Souffle
Certains nous demandent : "Où se cache l'Iluo dans le corps ?" 
Le Sage te répondra par une question : "Où se cache le vent dans l'arbre ?" On ne voit pas le vent, on voit les feuilles qui bougent. L'Iluo circule avec le sang, il vibre dans la moëlle des os, mais son siège est dans le *souffle*. C'est pour cela que lors des grandes émotions, ton cœur bat fort et ta respiration change : ton double essaie de s'échapper ou de se protéger. 

Comprendre son Iluo, c'est d'abord réapprendre à respirer. C'est comprendre que chaque inspiration nous lie à la forêt et chaque expiration libère une part de notre secret dans l'air du village.

---

## CHAPITRE II : LA CÉRÉMONIE DE L'ILUO LE BOSIE

### L'Appel des Racines
On ne décide pas de devenir un possesseur d'Iluo comme on décide d'aller au marché. C'est l'Iluo lui-même qui, souvent, gratte à la porte de l'esprit. Cela commence par des rêves trop clairs, des sensations de déjà-vu, ou la rencontre avec un animal qui semble nous regarder avec des yeux d'homme.

Quand cet appel devient trop fort, le candidat est présenté aux *Mokambi* (les anciens). On examine ses racines. Est-il un homme de paix ? Sa famille a-t-elle une dette envers la terre ? Si les signes sont bons, le chemin vers l'initiation de l'**Iluo le Bosie** s'ouvre.

### Le Temps de la Retraite
L'initiation ne se fait pas sur la place publique. Elle demande le silence des fourrés. Le candidat est conduit dans un campement retiré, là où le bruit des querelles du village ne parvient plus. Pendant plusieurs jours, il est soumis à un régime de pureté. Il ne mange que ce que la forêt offre spontanément. Il boit l'eau des sources qui n'ont pas encore été troublées par les jarres des femmes.

C'est un temps de déconstruction. Pour recevoir le *Bosie*, il faut d'abord vider ce qui est plein. On lui raconte les récits de la création, on lui apprenait les noms secrets des arbres, et on prépare son esprit à ce qui va venir : la rencontre avec son propre double.

### La Nuit de l'Ouverture
Le moment crucial arrive souvent au milieu de la nuit, à l'heure où les esprits se promènent. Les maîtres de l'initiation, investis eux-mêmes d'un Iluo puissant, préparent les collyres sacrés. Ce sont des mélanges d'herbes broyées, de rosée récoltée sur des feuilles de bananier et parfois de cendres de bois de foudre.

On applique ces remèdes sur les paupières du candidat. C'est une sensation de brûlure légère, comme si le feu voulait dévorer le voile qui couvre ses yeux. On lui murmure : *"Ouvrir les yeux pour ne plus jamais être aveugle."*

Et soudain, le prodige se produit. Ce n'est pas que le paysage change, c'est que la vibration change. Le candidat voit une silhouette se détacher de lui. C'est lui, mais plus beau, plus fluide, entouré d'une lueur que l'on ne peut pas décrire avec des mots. C'est la naissance de l'**Iluo le Bosie**. À cet instant, il n'est plus seulement un fils de la terre, il est un citoyen de l'invisible.

### Le Sceau du Secret
On lui remet alors ses premiers attributs. Parfois une bague de fer forgé, parfois une petite calebasse contenant une substance qui servira de point d'ancrage. Le maître lui donne son nom de double, un nom que personne au village ne connaîtra jamais. Car le nom, c'est le pouvoir, et celui qui connaît ton nom de double possède une partie de ta vie.

On lui apprend alors la première règle : l'Iluo le Bosie est une semence. Si tu l'arroses avec du sang injuste, elle deviendra un roncier qui t'étouffera. Si tu l'arroses avec la sagesse, elle deviendra un grand baobab qui protégera tout ton clan.

---

## CHAPITRE III : L'EXPÉRIMENTATION ET LA VIE DU MALUO

### Les Premiers Pas du Double
Une fois que l'on a "reçu les yeux", mon enfant, le monde ne ressemble plus jamais à ce qu'il était. C'est comme si tu avais toujours vécu dans une maison sombre et que, soudain, quelqu'un ouvrait les volets. Le jeune *moluo* (possesseur), rentré au village après sa retraite, doit apprendre à marcher deux fois.

Les premières nuits sont les plus étranges. Quand le corps physique s'abandonne au sommeil, l'Iluo, désormais éveillé par la cérémonie du *Bosie*, ne s'endort pas. Il s'étire. Il commence à explorer les limites de la case, puis de la clôture, puis du village. Pour le jeune initié, c'est une expérimentation pleine de merveilles. Il découvre qu'il peut passer à travers les chaumes sans faire de bruit, qu'il peut voir la couleur de la peur ou de la joie sur le visage des dormeurs, et qu'il peut entendre la forêt parler — non pas par des bruits, mais par des intentions.

### Le Conseil des Baluo : L'Assemblée de la Nuit
L'un des moments les plus marquants de cette phase est la découverte du réseau. Un *moluo* n'est jamais seul. Dans l'invisible, il y a des chemins que nos ancêtres ont tracés depuis des millénaires. La nuit, les doubles des initiés se rejoignent dans ce que nous appelons la "Vergadering" ou l'assemblée des *baluo*.

Ces réunions ne se tiennent pas sur la place du village où l'on discute de la récolte de café ou de cacao. Elles se tiennent sur des plans de réalité que le Sage appelle les "Clairières de Lumière". Là, les doubles se reconnaissent. Ils discutent de l'équilibre de la terre, ils s'assurent que les esprits de la rivière ne sont pas en colère, et ils échangent des connaissances. C'est une école qui n'a pas de cloche, mais dont les leçons restent gravées dans l'esprit du possesseur bien après qu'il se soit réveillé dans son lit de natte.

### L'Apprentissage des Métamorphoses
L'expérimentation va plus loin. On apprend que l'Iluo n'a pas de forme fixe. S'il doit parcourir une grande distance pour aller voir un frère malade à Nioki ou à Inongo, le double peut prendre la légèreté d'un oiseau ou la puissance du vent. 

Attention, ce ne sont pas des contes pour enfants. C'est une science de la volonté. L'initié apprend que son intention est le gouvernail de son double. S'il pense "force", il devient lourd comme un rocher. S'il pense "agilité", il devient souple comme la liane. Mais cet apprentissage demande du temps et une grande discipline, car un double sans maîtrise est comme une pirogue sans rameur au milieu des rapides.

---

## CHAPITRE IV : L'OMBRE DU POUVOIR — LE PIÈGE DE L'ÉGOÏSME

### La Tentation du Miroir
Mais voilà, mon enfant, tout pouvoir porte en lui son propre poison. Comme le miel attire les abeilles, l'Iluo attire parfois l'orgueil. Quand un initié commence à se rendre compte qu'il peut influencer les choses par son double, une petite voix peut naître dans son cœur : "Je suis plus fort que les autres. Pourquoi devrais-je peiner au champ alors que je peux prendre la force de mon voisin ?"

C'est là que commence la chute. L'Iluo, qui était une fenêtre ouverte sur l'univers, se transforme peu à peu en un miroir où le *moluo* ne regarde plus que sa propre importance. Il commence à utiliser son double, non plus pour surveiller l'équilibre du clan, mais pour servir ses propres désirs, sa propre richesse, sa propre soif de domination.

### Le "Consommateur" de Force Vitale
C'est le côté sombre dont parlent les villageois avec effroi. Un *moluo* qui tourne à l'égoïsme devient ce que nos anciens appelaient un prédateur de l'invisible. Il apprend à injecter l'**ifugu** (un poison spirituel) dans le double de ceux qu'il jalouse. Il "mange" la force vitale des autres pour nourrir la sienne.

Vois-tu cet homme au marché ? Il est gros, il est riche, mais autour de lui, ses enfants sont malingres, son clan s'étiole et ses amis tombent malades. C'est le signe d'un pouvoir égoïste. Il a construit sa montagne sur les ruines de l'énergie des autres. C'est un homme qui a oublié le but premier de l'Iluo : donner la vie, et non la prendre.

### Les Conséquences : L'Isolement et la Sécheresse Intérieure
L'égoïsme dans l'invisible a un prix terrible. Celui qui prend sans donner finit par s'entourer d'une muraille de glace. Dans les assemblées nocturnes, les autres *baluo* voient son double changer de couleur. Il devient sombre, il devient visqueux, il sent l'eau croupie des marais.

Le résultat final est ce que nous appelons la "Sécheresse Fertile". Le *moluo* égoïste gagne tout sur la terre physique, mais il perd tout dans l'invisible. Il n'a plus d'amis parmi les esprits, il n'a plus la paix avec ses ancêtres. Et quand viendra le jour de la grande traversée, quand il devra quitter son corps, il n'aura aucun double de lumière pour l'accueillir. Il sera un errant, une ombre qui pleure dans la forêt parce qu'elle n'a plus de foyer où se reposer.

### L'Observation du Peuple : Le Jugement de la Terre
Tu sais, les gens du village ne sont pas dupes. Ils ne connaissent pas les rituels secrets, mais ils ont l'instinct de la terre. Ils observent ce que nous appelons les "Signes du Vent".
- S'ils voient qu'un homme réussit tout en restant généreux, ils disent : "Son Iluo porte la vie".
- S'ils voient qu'un homme réussit en écrasant les autres, ils détournent le regard. Ils savent que son pouvoir est une dette. Un jour, la forêt réclamera son dû, et ce jour-là, l'égoïste se retrouvera seul face à l'immensité de son propre vide. 

C'est pour cela, mon enfant, que nous disons que le véritable pouvoir n'est pas celui qui élève l'homme au-dessus des autres, mais celui qui le rend capable de porter les autres sur ses épaules.

---

## CHAPITRE V : LA VOIE DU GUÉRISSEUR (NGAA NE NSIMÜ)

### Le Choix de la Lumière : Osofea Iluo
Il arrive un moment dans la vie de certains possesseurs d'Iluo où ils comprennent que la puissance solitaire est une impasse. Ils ont vu les méandres de l'obscurité, ils ont senti le froid de l'égoïsme, et ils décident de faire ce que nos ancêtres appellent l'**Osofea Iluo** — l'acte de "déclarer son double".

Faire l'*Osofea Iluo*, mon enfant, c'est comme quand une rivière en crue décide de rentrer dans son lit pour fertiliser les champs au lieu de les noyer. L'initié annonce publiquement, ou devant le collège des anciens, qu'il renonce à utiliser son pouvoir pour sa propre gloire. Il met son double au service de la vie. Il devient un **Ngaa ne Nsimü**, un maître de la protection et de la restauration. À partir de ce jour, son Iluo change de fréquence : il n'est plus une arme de chasse, il devient une antenne de paix.

### L'Art du Diagnostic Invisible
Le rôle du *Ngaa ne Nsimü* est d'abord celui d'un détective de l'invisible. Quand un malade arrive, le guérisseur ne regarde pas seulement les yeux jaunes ou la peau brûlante de fièvre. Il ferme les siens et envoie son Iluo en éclaireur. 

Le double du guérisseur "scanne" la structure invisible du malade. Il cherche l'**Ifugu**. Tu te souviens de l'*ifugu*, cette flèche de poison spirituel lancée par l'égoïste ? Le guérisseur la voit comme une épine noire enfoncée dans l'énergie de la personne. Mais il cherche aussi la cause : Qui a lancé cette flèche ? Est-ce une dispute non résolue au sein de la famille ? Est-ce une offense faite à la terre ? Car chez nous, on ne guérit pas la plaie tant qu'on n'a pas retiré l'épine et demandé pardon à la main qui l'a tenue.

### Le Mystère du Keva : La Rançon de l'Harmonie
Pour guérir, il faut souvent payer une dette. C'est le **Keva**. Beaucoup de gens pensent que le *Keva* est un paiement pour le guérisseur, comme on paie un marchand au marché. Mais c'est plus profond que cela. 

Le *Keva* (souvent une poule, un morceau de tissu ou quelques perles) est une offrande de compensation. C'est le geste par lequel on rétablit l'équilibre. Le guérisseur utilise son Iluo pour porter l'intention de cette offrande aux puissances de l'invisible. "Vois, disent les esprits, l'ordre a été reconnu, l'harmonie peut revenir." Le crime de l'égoïsme est ainsi racheté par l'humilité du partage. Une fois le *Keva* accepté, l'influence du mauvais *moluo* est brisée, et le corps physique peut enfin recevoir le remède des plantes.

---

## CHAPITRE VI : LA PHARMACOPÉE SACRÉE ET LES MURMURES DE LA FORÊT

### La Forêt comme Pharmacie Vivante
Le *Ngaa ne Nsimü* ne travaille jamais seul. Sa grande alliée est la forêt. Mais attention, mon enfant : ne pense pas qu'il suffit de cueillir une feuille pour être guéri. Pour nous, une plante sans l'activation de l'Iluo est comme une lampe sans huile : elle a la forme, mais elle ne brille pas.

Quand le guérisseur entre en forêt, il n'y entre pas en conquérant. Il y entre en invité. Il demande la permission aux génies des lieux. Il cherche les écorces, les racines et les feuilles qui ont "parlé" à son double durant la nuit. Chaque plante a un esprit, une force que nous appelons parfois *Eloko*. Le secret de la guérison Sakata réside dans le mariage entre l'Iluo du guérisseur et l'esprit de la plante.

### Le Botè bo Metugu : La Cendre de la Force
L'un des remèdes les plus sacrés est le **Botè bo metugu**. C'est une cendre noire, fine comme la poussière, préparée à partir de mélanges complexes de bois calcinés, souvent d'arbres ayant survécu à la foudre. 

La foudre, c'est le feu du ciel. Un arbre qui lui survit possède une résilience extraordinaire. En préparant cette cendre, le guérisseur y transfère son intention via son Iluo. Le *Botè* sert alors de bouclier. On en trace des signes sur le corps du malade pour que les entités prédatrices ne puissent plus le toucher. C'est une barrière de lumière physique née du feu et de la sagesse.

### Le Savoir des Écorces et des Liquides Savants
Le guérisseur connaît aussi les "arbres à sang" et les "arbres à souffle". 
- **Les écorces amères** sont utilisées pour nettoyer le corps des toxines physiques, mais leur amertume sert aussi à chasser les pensées grises. 
- **Les décoctions de feuilles** cueillies à la rosée du matin servent à calmer le souffle agité des anxieux. 

Tout est une question de dosage, non pas seulement en poids de feuilles, mais en intensité de présence. Le guérisseur infuse son propre calme dans la potion. Boire le remède, c'est boire la forêt, et c'est aussi boire la paix du maître.

---

## CONCLUSION : LA TRANSMISSION ET LE DEVOIR DE MÉMOIRE

### Le Devoir de Mémoire
Le temps passe, mon enfant. Le feu s’éteint doucement et la lune est maintenant haute au-dessus de la Lukenie. Ce que je t'ai transmis aujourd'hui sur l'Iluo, sur le *Bosie*, sur le danger de l'égoïsme et sur la beauté de la guérison, c'est l'essence même de ce qui fait de nous des Sakata.

Nous ne sommes pas des êtres isolés. Nous sommes des maillons d'une chaîne immense qui remonte jusqu'au premier ancêtre. L'Iluo est le lien qui nous unit au grand Tout. Aujourd'hui, on veut vous faire croire que tout s'achète, que la puissance est dans l'argent et que la forêt n'est qu'un stock de bois. Ne les croyez pas.

### L'Appel aux Jeunes Maluo de Demain
Toi qui m'écoutes, tu es peut-être une "nouvelle pousse". Un jour, peut-être, tu sentiras ces rêves étranges, ce souffle qui veut voyager. Ce jour-là, souviens-toi de nos paroles. Ne cherche pas l'Iluo pour dominer, mais pour servir. Ne cherche pas à manger la force des autres, mais à devenir une source où les assoiffés peuvent boire.

L'article que nous avons écrit ici n'est pas seulement du texte sur un écran. C'est un **Masango** (un conte de savoir) qui voyage maintenant dans l'invisible numérique. Puisse-t-il toucher le cœur de ceux qui, loin du village, à Kinshasa ou au-delà des mers, cherchent encore le chemin de leurs racines.

Gardez votre Iluo limpide, gardez votre cœur ouvert. La forêt nous regarde, et elle ne nous oublie jamais."""

# Update the record
res = supabase.table("articles").update({"content": {"fr": content_fr}, "status": "published"}).eq("id", ARTICLE_ID).execute()

print("Long article updated successfully.")
print(res)
