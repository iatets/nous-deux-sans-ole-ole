// Mini-jeux : une partie mélange 3 jeux longs et 7 jeux courts.
//
// Jeu long, champs possibles :
//   title, type, text : le nom, l'étiquette et la phrase affichée en grand
//   hint   : les règles
//   rounds : les étapes (mots, questions, lettres…)
//   count  : nombre d'étapes tirées au hasard dans rounds (sinon toutes, dans l'ordre)
//   timer  : chrono en secondes pour chaque étape
//   secret : l'étape est cachée, seul le joueur concerné la regarde
//   alternate : les joueurs jouent chacun leur tour à chaque étape
//   canvas : ajoute une zone de dessin
//   board  : liste affichée en permanence (les catégories du petit bac)
//   stepLabel : mot affiché devant le numéro d'étape

const MINI_LONG = [
  {
    title: "PICTIONARY DE COUPLE", type: "Dessin", text: "Dessine, l'autre devine !",
    hint: "Chacun votre tour : regarde le mot sans le montrer, puis dessine-le sans écrire ni parler. Si l'autre trouve avant la fin du chrono, 1 point pour chacun.",
    timer: 60, secret: true, alternate: true, canvas: true, count: 6, stepLabel: "Dessin",
    rounds: [
      "Notre premier rendez-vous", "Un petit-déjeuner au lit", "Une dispute pour la télécommande", "Voler la couette",
      "Un câlin sur le canapé", "Une demande en mariage", "Un voyage en avion", "Faire la vaisselle",
      "S'endormir devant un film", "Se perdre en voiture", "Un pique-nique", "Cuisiner à deux",
      "Une photo de vacances", "Danser dans le salon", "Un bisou sous la pluie", "Un ronflement",
      "Les courses du samedi", "Un cadeau raté", "Une soirée pyjama", "Un message d'amour",
      "Une valise trop pleine", "Une balade main dans la main", "Un plat brûlé", "Une sieste à deux"
    ]
  },
  {
    title: "PETIT BAC DE COUPLE", type: "Rapidité", text: "Une lettre, sept catégories, une minute et demie.",
    hint: "Prenez chacun une feuille ou votre téléphone. Lancez le chrono et trouvez un mot par catégorie avec la lettre. 1 point par réponse juste, 2 si l'autre n'a pas trouvé la même.",
    timer: 90, count: 3, stepLabel: "Lettre",
    board: ["Un plat que tu adores", "Un lieu où partir à deux", "Un film ou une série", "Un surnom ou un mot doux", "Une qualité de ton ou ta partenaire", "Une activité à faire à deux", "Un objet de la maison"],
    rounds: ["Lettre A", "Lettre B", "Lettre C", "Lettre D", "Lettre F", "Lettre G", "Lettre L", "Lettre M", "Lettre N", "Lettre P", "Lettre R", "Lettre S", "Lettre T", "Lettre V"]
  },
  {
    title: "QUI DE NOUS DEUX ?", type: "Désignation", text: "Comptez jusqu'à trois et désignez-vous.",
    hint: "Lisez la question, comptez jusqu'à trois, puis montrez du doigt la bonne personne en même temps. Si vous êtes d'accord, 1 point pour chacun.",
    count: 10, stepLabel: "Question",
    rounds: [
      "Qui de nous deux s'endort le premier ?", "Qui de nous deux met le plus de temps à se préparer ?", "Qui de nous deux dit pardon en premier ?",
      "Qui de nous deux dépense le plus ?", "Qui de nous deux est le plus têtu ?", "Qui de nous deux pleure devant les films ?",
      "Qui de nous deux oublie le plus de choses ?", "Qui de nous deux est le plus jaloux ?", "Qui de nous deux est le plus drôle ?",
      "Qui de nous deux cuisine le mieux ?", "Qui de nous deux a le plus mauvais sens de l'orientation ?", "Qui de nous deux prend le plus de place dans le lit ?",
      "Qui de nous deux est le plus romantique ?", "Qui de nous deux survivrait le plus longtemps sur une île déserte ?", "Qui de nous deux regarde le plus son téléphone ?",
      "Qui de nous deux fait le plus de bêtises ?", "Qui de nous deux est le plus maniaque ?", "Qui de nous deux a dit « je t'aime » en premier ?",
      "Qui de nous deux est le plus grognon le matin ?", "Qui de nous deux serait le meilleur parent d'un chat ?"
    ]
  },
  {
    title: "TU PRÉFÈRES ?", type: "Choix simultané", text: "Répondez en même temps, sans vous concerter.",
    hint: "Lisez les deux choix, comptez jusqu'à trois et répondez en même temps. Même réponse : 1 point pour chacun. Réponse différente : expliquez-vous !",
    count: 8, stepLabel: "Choix",
    rounds: [
      "Tu préfères une soirée sur le canapé ou une soirée au restaurant ?", "Tu préfères la mer ou la montagne ?", "Tu préfères un petit-déjeuner au lit ou un dîner aux chandelles ?",
      "Tu préfères qu'on parte en vacances sans programme ou avec tout de réservé ?", "Tu préfères recevoir une lettre d'amour ou un cadeau surprise ?", "Tu préfères vivre à la campagne ou en ville ?",
      "Tu préfères te lever tôt ou te coucher tard ?", "Tu préfères un film d'amour ou un film d'action ?", "Tu préfères qu'on cuisine ensemble ou commander à manger ?",
      "Tu préfères un grand mariage ou une petite fête intime ?", "Tu préfères une semaine sans téléphone ou une semaine sans sucre ?", "Tu préfères un chien ou un chat à la maison ?",
      "Tu préfères fêter ton anniversaire à deux ou entouré(e) de tout le monde ?", "Tu préfères résoudre une dispute tout de suite ou le lendemain ?", "Tu préfères voyager loin une fois ou près plusieurs fois ?",
      "Tu préfères qu'on danse ou qu'on chante en karaoké ?"
    ]
  },
  {
    title: "LE QUIZ DE NOTRE COUPLE", type: "Mémoire", text: "Connaissez-vous vraiment votre histoire ?",
    hint: "Écrivez chacun votre réponse sur une feuille, puis comparez. Même réponse : 1 point pour chacun.",
    count: 8, stepLabel: "Question",
    rounds: [
      "Où a eu lieu notre premier rendez-vous ?", "Qui a envoyé le premier message ?", "Quelle est la date de notre rencontre ?",
      "Quel a été notre premier voyage ensemble ?", "Quel est notre restaurant préféré ?", "Quel film a-t-on regardé le plus souvent ?",
      "Quelle chanson nous représente le mieux ?", "Quelle a été notre première dispute, et pourquoi ?", "Quel cadeau a le plus compté entre nous ?",
      "Quel surnom utilise-t-on le plus ?", "Quel est notre meilleur souvenir de vacances ?", "Quelle est la plus grosse bêtise qu'on ait faite ensemble ?",
      "Quel plat cuisine-t-on le plus souvent ?", "Quel ami commun nous connaît le mieux ?", "Où aimerait-on vivre dans dix ans ?"
    ]
  },
  {
    title: "LE MOT SECRET", type: "Devinette", text: "Fais deviner le mot sans jamais le dire.",
    hint: "Chacun votre tour : regarde le mot sans le montrer, puis décris-le sans prononcer le mot ni les mots de la même famille. Si l'autre trouve à temps, 1 point pour chacun.",
    timer: 45, secret: true, alternate: true, count: 6, stepLabel: "Mot",
    rounds: [
      "Tendresse", "Jalousie", "Couette", "Lune de miel", "Dispute", "Anniversaire", "Canapé", "Confiance",
      "Valise", "Câlin", "Surprise", "Belle-famille", "Bague", "Déménagement", "Rendez-vous", "Vaisselle",
      "Fou rire", "Pardon", "Souvenir", "Week-end"
    ]
  },
  {
    title: "LE MIME DU COUPLE", type: "Mime", text: "Pas un mot : mime la scène !",
    hint: "Chacun votre tour : regarde la scène sans la montrer, puis mime-la sans parler. Si l'autre trouve à temps, 1 point pour chacun.",
    timer: 45, secret: true, alternate: true, count: 6, stepLabel: "Mime",
    rounds: [
      "Tu cherches tes clés en retard", "Tu fais semblant d'aimer un cadeau", "Tu essaies de ne pas réveiller l'autre", "Tu montes un meuble sans notice",
      "Tu danses seul(e) dans la cuisine", "Tu boudes après une dispute", "Tu demandes pardon avec des fleurs", "Tu goûtes un plat trop salé",
      "Tu vois une araignée dans la douche", "Tu prends un selfie de couple raté", "Tu refais ta valise pour la troisième fois", "Tu attends l'autre qui se prépare",
      "Tu te réveilles avec les cheveux en bataille", "Tu es perdu(e) mais tu refuses de demander ton chemin"
    ]
  },
  {
    title: "LE PORTRAIT CHINOIS", type: "Se connaître", text: "Si j'étais… qu'est-ce que je serais ?",
    hint: "Chacun votre tour : le joueur indiqué écrit sa réponse en secret, l'autre essaie de la deviner à voix haute. Bonne réponse : 1 point pour celui qui a deviné.",
    alternate: true, count: 8, stepLabel: "Portrait",
    rounds: [
      "Si j'étais un animal, lequel serais-je ?", "Si j'étais un plat, lequel serais-je ?", "Si j'étais une saison, laquelle serais-je ?", "Si j'étais une ville, laquelle serais-je ?",
      "Si j'étais une chanson, laquelle serais-je ?", "Si j'étais une couleur, laquelle serais-je ?", "Si j'étais un personnage de film, lequel serais-je ?", "Si j'étais un objet de la maison, lequel serais-je ?",
      "Si j'étais une odeur, laquelle serais-je ?", "Si j'étais un métier, lequel serais-je ?", "Si j'étais une boisson, laquelle serais-je ?", "Si j'étais un moment de la journée, lequel serais-je ?"
    ]
  },
  {
    title: "DEUX VÉRITÉS, UN MENSONGE", type: "Bluff", text: "Démasque le mensonge !",
    hint: "Le joueur indiqué donne trois affirmations sur le thème : deux vraies et une fausse. L'autre doit trouver le mensonge. Trouvé : 1 point pour lui. Raté : 1 point pour le menteur.",
    alternate: true, count: 4, stepLabel: "Thème",
    rounds: ["Thème : ton enfance", "Thème : tes goûts", "Thème : tes voyages", "Thème : ton adolescence", "Thème : ta famille", "Thème : tes anciennes passions", "Thème : tes plus grosses bêtises", "Thème : ta vie à l'école"]
  },
  {
    title: "VINGT QUESTIONS", type: "Devinette", text: "Vingt questions pour trouver à quoi je pense.",
    hint: "Le joueur indiqué pense à une chose que vous connaissez tous les deux. L'autre a 20 questions fermées pour trouver, réponse par oui ou par non. Trouvé : 1 point pour lui. Sinon : 1 point pour l'autre.",
    alternate: true, stepLabel: "Tour",
    rounds: ["Pense à un souvenir que nous avons en commun.", "Pense à une personne que nous connaissons tous les deux."]
  },
  {
    title: "LE FILM DE NOTRE VIE", type: "Imagination", text: "Votre histoire arrive au cinéma !",
    hint: "Répondez ensemble à chaque étape, en vous mettant d'accord. Si vous arrivez au générique sans dispute, 1 point pour chacun !",
    stepLabel: "Scène",
    rounds: [
      "Quel serait le titre du film de notre vie ?", "Ce serait une comédie, un film d'action ou un drame ?", "Quel acteur ou quelle actrice jouerait chacun de nous ?",
      "Quelle serait la scène de notre rencontre ?", "Quelle serait la scène la plus drôle ?", "Quel serait le pire moment, avant que tout s'arrange ?",
      "Quelle serait la musique du film ?", "Comment le film se terminerait-il ?"
    ]
  },
  {
    title: "NOS TOPS 5", type: "Comparaison", text: "Vos classements sont-ils les mêmes ?",
    hint: "Lancez le chrono et écrivez chacun votre top 5 sur une feuille, puis comparez. 1 point pour chacun par réponse commune.",
    timer: 60, count: 3, stepLabel: "Classement",
    rounds: [
      "Top 5 de nos plus beaux moments", "Top 5 de nos plus gros fous rires", "Top 5 de nos endroits préférés", "Top 5 des plats qu'on aime manger ensemble",
      "Top 5 des voyages qu'on aimerait faire", "Top 5 de nos films ou séries à deux", "Top 5 des choses qu'on devrait faire plus souvent"
    ]
  },
  {
    title: "LE BLIND TEST FREDONNÉ", type: "Musique", text: "Fredonne, l'autre devine la chanson !",
    hint: "Chacun votre tour : choisis une chanson en suivant la consigne et fredonne-la sans dire les paroles. Si l'autre trouve à temps, 1 point pour chacun.",
    timer: 30, alternate: true, count: 6, stepLabel: "Chanson",
    rounds: [
      "Une chanson qui te fait penser à nous", "Une chanson de ton adolescence", "Une chanson qu'on écoute en voiture", "Une chanson de dessin animé",
      "Une chanson que tu chantes sous la douche", "Une chanson que tu détestes mais que tu connais par cœur", "Une chanson pour danser en soirée", "Une chanson de notre première année ensemble"
    ]
  },
  {
    title: "L'INTERVIEW", type: "Se connaître", text: "Deux minutes pour tout savoir.",
    hint: "Le joueur indiqué pose à l'autre toutes les questions qu'il veut pendant le chrono, puis résume ce qu'il a appris. Une chose nouvelle apprise : 1 point.",
    timer: 120, alternate: true, stepLabel: "Interview",
    rounds: ["Interviewe l'autre sur son enfance.", "Interviewe l'autre sur ses rêves.", "Interviewe l'autre sur ses peurs.", "Interviewe l'autre sur sa vision de notre avenir."]
  }
];

const MINI_SHORT = [
  ["LE CHIFFRE COMMUN", "Comptez jusqu'à trois et dites en même temps un nombre entre 1 et 10. Essayez cinq fois : à chaque nombre identique, 1 point pour chacun.", "Télépathie"],
  ["PIERRE-FEUILLE-CISEAUX", "Jouez au meilleur des cinq. Le perdant fait un compliment sincère au gagnant.", "Duel"],
  ["LE MIROIR", "Face à face, l'un fait des gestes lents et l'autre l'imite pendant 30 secondes. Puis échangez les rôles.", "Complicité"],
  ["LE MOT DU COUPLE", "Comptez jusqu'à trois et dites en même temps un mot qui décrit votre couple. Recommencez jusqu'à dire le même.", "Choix simultané"],
  ["LA CHAÎNE DE MOTS", "À tour de rôle, dites un mot lié au précédent. Commencez par « amour ». Le premier qui hésite plus de cinq secondes perd.", "Rapidité"],
  ["RIRE INTERDIT", "Regardez-vous droit dans les yeux. Le premier qui rit ou qui détourne le regard a perdu.", "Duel"],
  ["LE DESSIN À QUATRE MAINS", "Tenez le même crayon à deux et dessinez une maison sans vous parler. Admirez ensuite votre chef-d'œuvre.", "Créativité"],
  ["DOS À DOS", "Mettez-vous dos à dos. Chacun décrit les vêtements de l'autre, sans regarder. 1 point par détail juste.", "Observation"],
  ["SPEED DATING", "Faites comme si vous veniez de vous rencontrer : vous avez chacun 30 secondes pour vous présenter et donner envie d'un deuxième rendez-vous.", "Jeu de rôle"],
  ["TROIS MOTS", "Chacun décrit l'autre en trois mots. Puis chacun dit lequel le surprend le plus, et pourquoi.", "Se connaître"],
  ["LA PHRASE CULTE", "Chacun imite une phrase que l'autre répète tout le temps. Le plus ressemblant gagne le point.", "Imitation"],
  ["LE GPS HUMAIN", "L'un ferme les yeux. L'autre le guide à la voix jusqu'à un objet de la pièce. Puis échangez les rôles.", "Confiance"],
  ["NI OUI NI NON", "Discutez pendant une minute sans jamais dire « oui » ni « non ». Le premier qui se trompe perd.", "Concentration"],
  ["LE SOUVENIR TRUQUÉ", "Raconte un souvenir commun en y glissant une erreur. L'autre doit la repérer. Puis échangez les rôles.", "Mémoire"],
  ["L'INVENTAIRE", "En 45 secondes, chacun cite ce que l'autre a dans son sac ou ses poches. Vérifiez ensuite : 1 point par objet juste.", "Observation"],
  ["LE GOÛT MYSTÈRE", "L'un ferme les yeux et l'autre lui fait goûter un aliment de la cuisine. Bonne réponse : 1 point. Puis échangez les rôles.", "Sens"]
];
