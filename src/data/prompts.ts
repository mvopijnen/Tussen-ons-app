import { PromptItem, RelationshipType } from '../types';

export const PROMPTS_DATABASE: PromptItem[] = [
  // ==========================================
  // FIRST DATE - 1. ASK (Various intensities)
  // ==========================================
  {
    id: 'date-ask-1',
    category: 'Eerste Date',
    subcategory: 'Eerste Indruk',
    interactionType: 'ask',
    intensity: 1,
    relationshipType: ['date', 'surprise'],
    tags: ['ijsbreker', 'eerste-indruk', 'luchtig'],
    premium: false,
    prompt: 'Wat was jouw allereerste gedachte toen je me vanavond aan zag komen lopen?',
    subtitle: 'Wees eerlijk – zelfs als het ging over mijn jas of haastige pas.',
    tip: 'Lach erom, er is geen fout antwoord.'
  },
  {
    id: 'date-ask-2',
    category: 'Eerste Date',
    subcategory: 'Leven & Gewoontes',
    interactionType: 'ask',
    intensity: 2,
    relationshipType: ['date', 'partner', 'surprise'],
    tags: ['gewoontes', 'passie', 'persoonlijkheid'],
    premium: false,
    prompt: 'Wat is iets waar jij buitensporig enthousiast over kan raken, waar de meeste mensen weinig om geven?',
    subtitle: 'Een niche hobby, een specifiek onderwerp of een vreemde obsessie.',
    tip: 'Vraag door naar het waarom.'
  },
  {
    id: 'date-ask-3',
    category: 'Eerste Date',
    subcategory: 'Onpopulaire Meningen',
    interactionType: 'ask',
    intensity: 2,
    relationshipType: ['date', 'friends', 'surprise'],
    tags: ['humor', 'mening', 'debat'],
    premium: false,
    prompt: 'Wat is een uitgesproken mening van jou waar bijna niemand het mee eens is?',
    subtitle: 'Van pizza met ananas tot het afschaffen van verjaardagen.',
    tip: 'Geen oordeel, luister met nieuwsgierigheid.'
  },
  {
    id: 'date-ask-4',
    category: 'Eerste Date',
    subcategory: 'Kwetsbaarheid',
    interactionType: 'ask',
    intensity: 4,
    relationshipType: ['date', 'partner'],
    tags: ['diepgang', 'emotie', 'waarden'],
    premium: true,
    prompt: 'Wanneer heb je je voor het laatst écht eenzaam gevoeld, zelfs toen er mensen om je heen waren?',
    subtitle: 'Een moment waarop je dacht: begrijpt iemand mij eigenlijk?',
    tip: 'Neem even de tijd voor stilte na het antwoord.'
  },
  {
    id: 'date-ask-5',
    category: 'Eerste Date',
    subcategory: 'Toekomst & Dromen',
    interactionType: 'ask',
    intensity: 3,
    relationshipType: ['date', 'partner', 'surprise'],
    tags: ['dromen', 'toekomst', 'ambitie'],
    premium: false,
    prompt: 'Als geld en andermans verwachtingen geen enkele rol speelden, hoe zou jouw gemiddelde dinsdag er over vijf jaar uitzien?',
    subtitle: 'Beschrijf de geur, het uitzicht en wat je als eerste doet na het opstaan.'
  },

  // ==========================================
  // FIRST DATE - 2. BOTH ANSWER
  // ==========================================
  {
    id: 'date-both-1',
    category: 'Eerste Date',
    subcategory: 'Ongemak',
    interactionType: 'both_answer',
    intensity: 1,
    relationshipType: ['date', 'friends', 'surprise'],
    tags: ['blunder', 'humor', 'openheid'],
    premium: false,
    prompt: 'Wat is de meest gênante situatie waarin je het afgelopen jaar belandde?',
    subtitle: 'Persoon 1 vertelt eerst, daarna is Persoon 2 aan de beurt.',
    tip: 'Hoe knulliger, hoe leuker het gesprek wordt.'
  },
  {
    id: 'date-both-2',
    category: 'Eerste Date',
    subcategory: 'Romantiek & Daten',
    interactionType: 'both_answer',
    intensity: 3,
    relationshipType: ['date', 'partner'],
    tags: ['flirten', 'connectie', 'romantiek'],
    premium: false,
    prompt: 'Wat vind jij het meest aantrekkelijke aan iemand als diegene volkomen zichzelf is?',
    subtitle: 'Niet uiterlijk, maar een bepaalde energie, blik of trekje.'
  },
  {
    id: 'date-both-3',
    category: 'Eerste Date',
    subcategory: 'Levenslessen',
    interactionType: 'both_answer',
    intensity: 4,
    relationshipType: ['date', 'partner'],
    tags: ['diepgang', 'groei', 'reflectie'],
    premium: true,
    prompt: 'Welke overtuiging over de liefde die je vroeger had, heb je moeten herzien?',
    subtitle: 'Iets wat je dacht dat waar was, maar waar de realiteit je verraste.'
  },

  // ==========================================
  // FIRST DATE - 3. GUESS (Raad elkaars antwoord)
  // ==========================================
  {
    id: 'date-guess-1',
    category: 'Eerste Date',
    subcategory: 'Intuïtie',
    interactionType: 'guess',
    intensity: 2,
    relationshipType: ['date', 'friends', 'surprise'],
    tags: ['spel', 'intuïtie', 'observatie'],
    premium: false,
    prompt: 'Raad elkaars guilty pleasure liedje of snack.',
    subtitle: 'Persoon A doet een voorspelling over B. Daarna onthult B de waarheid!',
    guessDetails: {
      targetPrompt: 'Wat eet of luister ik in het geheim als niemand meekijkt?',
      hint: 'Kijk naar elkaars kledingstijl en uitstraling voor hints.'
    }
  },
  {
    id: 'date-guess-2',
    category: 'Eerste Date',
    subcategory: 'Karakter',
    interactionType: 'guess',
    intensity: 3,
    relationshipType: ['date', 'partner'],
    tags: ['karakter', 'inzicht', 'verrassing'],
    premium: false,
    prompt: 'Was de ander vroeger op de middelbare school de rebel, de perfectionist, de clown of de stille observeerder?',
    subtitle: 'Bespreek jullie aanname over elkaar vóórdat de ander vertelt wie die echt was.',
    guessDetails: {
      targetPrompt: 'Mijn rol in de klas vroeger was...',
      hint: 'Mensen veranderen vaak minder dan ze denken.'
    }
  },

  // ==========================================
  // FIRST DATE - 4. POINT (Wijs iemand aan)
  // ==========================================
  {
    id: 'date-point-1',
    category: 'Eerste Date',
    subcategory: 'Dynamiek',
    interactionType: 'point',
    intensity: 1,
    relationshipType: ['date', 'friends', 'surprise'],
    tags: ['interactie', 'ijsbreker', 'lach'],
    premium: false,
    prompt: 'Wie van jullie twee zou als eerste verdwalen in een vreemde stad zonder Google Maps?',
    subtitle: 'Tel samen af tot 3 en wijs tegelijk naar degene die het is!',
    tip: 'Geen twijfel, direct wijzen.'
  },
  {
    id: 'date-point-2',
    category: 'Eerste Date',
    subcategory: 'Nachtleven',
    interactionType: 'point',
    intensity: 2,
    relationshipType: ['date', 'friends', 'partner'],
    tags: ['humor', 'avontuur'],
    premium: false,
    prompt: 'Wie van jullie twee belt het eerst een taxi als een feestje net iets te chaotisch wordt?',
    subtitle: 'Op drie... 1, 2, 3: Wijs!'
  },
  {
    id: 'date-point-3',
    category: 'Eerste Date',
    subcategory: 'Flirten',
    interactionType: 'point',
    intensity: 3,
    relationshipType: ['date', 'partner'],
    tags: ['flirten', 'spanning'],
    premium: true,
    prompt: 'Wie van jullie twee zou de eerste move maken voor een zoen vanavond als de sfeer perfect is?',
    subtitle: 'Tel af: 1... 2... 3... Wijs naar jezelf of naar de ander.'
  },

  // ==========================================
  // FIRST DATE - 5. WOULD YOU RATHER (Dilemma's)
  // ==========================================
  {
    id: 'date-wyr-1',
    category: 'Eerste Date',
    subcategory: 'Dilemma',
    interactionType: 'would_you_rather',
    intensity: 1,
    relationshipType: ['date', 'friends', 'surprise'],
    tags: ['dilemma', 'humor', 'filosofie'],
    premium: false,
    prompt: 'Wat zou je liever hebben?',
    subtitle: 'Kies jouw optie en beargumenteer waarom met hand en tand.',
    options: [
      { id: 'a', text: 'Altijd exact moeten zeggen wat je op dat moment denkt', subtext: 'Geen filters, absolute eerlijkheid' },
      { id: 'b', text: 'Nooit meer spontaan mogen spreken, alleen na 5 seconden pauze', subtext: 'Iedere zin vooraf afwegen' }
    ]
  },
  {
    id: 'date-wyr-2',
    category: 'Eerste Date',
    subcategory: 'Reizen & Avontuur',
    interactionType: 'would_you_rather',
    intensity: 2,
    relationshipType: ['date', 'partner', 'surprise'],
    tags: ['reizen', 'levensstijl'],
    premium: false,
    prompt: 'Voor jullie ideale weekend weg, wat kies je?',
    subtitle: 'Ontdek of jullie reisstijlen botsen of matchen.',
    options: [
      { id: 'a', text: 'Een strak geplande stedentrip vol musea, restaurants en reserveringen', subtext: 'Geen minuut verspild' },
      { id: 'b', text: 'Een afgelegen boshuisje zonder bereik en zonder enig plan', subtext: 'Wandelen, koken en muziek' }
    ]
  },
  {
    id: 'date-wyr-3',
    category: 'Eerste Date',
    subcategory: 'Relatiewaarden',
    interactionType: 'would_you_rather',
    intensity: 4,
    relationshipType: ['date', 'partner'],
    tags: ['diepgang', 'kwetsbaar'],
    premium: true,
    prompt: 'Wat vind je enger in een beginnende romance?',
    subtitle: 'Kies het antwoord dat jou het diepst raakt.',
    options: [
      { id: 'a', text: 'Iemand té leuk vinden en bang zijn om gekwetst te raken', subtext: 'Controleverlies en overgave' },
      { id: 'b', text: 'Merken dat de ander verliefder is op jou dan jij op hen', subtext: 'Schuldgevoel en verwachtingen' }
    ]
  },

  // ==========================================
  // FIRST DATE - 6. CHALLENGE (Sociale opdracht)
  // ==========================================
  {
    id: 'date-chal-1',
    category: 'Eerste Date',
    subcategory: 'Aanwezigheid',
    interactionType: 'challenge',
    intensity: 2,
    relationshipType: ['date', 'partner'],
    tags: ['opdracht', 'spanning', 'connectie'],
    premium: false,
    prompt: 'Kijk elkaar 20 seconden stil in de ogen.',
    subtitle: 'Niet praten, niet wegkijken. Glimlachen mag, lachen waarschijnlijk ook.',
    challengeAction: 'Start de timer van 20 seconden en houd oogcontact.',
    challengeDurationSec: 20
  },
  {
    id: 'date-chal-2',
    category: 'Eerste Date',
    subcategory: 'Compliment',
    interactionType: 'challenge',
    intensity: 3,
    relationshipType: ['date', 'partner', 'surprise'],
    tags: ['opdracht', 'waardering', 'warmte'],
    premium: false,
    prompt: 'Geef elkaar een oprecht compliment over iets dat níet over uiterlijk gaat.',
    subtitle: 'Bijvoorbeeld een manier van praten, humor, luisterhouding of nieuwsgierigheid.',
    challengeAction: 'Neem 10 seconden om na te denken en spreek het dan direct uit.'
  },
  {
    id: 'date-chal-3',
    category: 'Eerste Date',
    subcategory: 'Speelsheid',
    interactionType: 'challenge',
    intensity: 3,
    relationshipType: ['date', 'friends', 'surprise'],
    tags: ['opdracht', 'speels', 'observatie'],
    premium: false,
    prompt: 'Bedenk samen in 30 seconden een compleet fictief verhaal over de tafel naast jullie.',
    subtitle: 'Wie zijn ze, hoe kennen ze elkaar en wat verbergen ze?',
    challengeAction: 'Vertel om beurten één zin om het verhaal te bouwen.'
  },

  // ==========================================
  // FIRST DATE - 7. FINISH THE SENTENCE
  // ==========================================
  {
    id: 'date-fts-1',
    category: 'Eerste Date',
    subcategory: 'Eerlijkheid',
    interactionType: 'finish_the_sentence',
    intensity: 2,
    relationshipType: ['date', 'partner', 'surprise'],
    tags: ['zinsafmaker', 'spontaan'],
    premium: false,
    prompt: 'Maak de zin af zonder langer dan drie seconden na te denken:',
    sentenceStarter: 'Als ik echt eerlijk ben over dates, dan...',
    subtitle: 'Spreek het eerste uit wat in je opkomt.'
  },
  {
    id: 'date-fts-2',
    category: 'Eerste Date',
    subcategory: 'Zelfbeeld',
    interactionType: 'finish_the_sentence',
    intensity: 3,
    relationshipType: ['date', 'partner'],
    tags: ['zinsafmaker', 'authenticiteit'],
    premium: false,
    prompt: 'Vul allebei aan:',
    sentenceStarter: 'De snelste manier om mij rustig te krijgen als ik gestrest ben, is...',
    subtitle: 'Nuttige informatie voor de toekomst.'
  },
  {
    id: 'date-fts-3',
    category: 'Eerste Date',
    subcategory: 'Verlangen',
    interactionType: 'finish_the_sentence',
    intensity: 4,
    relationshipType: ['date', 'partner'],
    tags: ['diepgang', 'kwetsbaar'],
    premium: true,
    prompt: 'Maak deze zin af:',
    sentenceStarter: 'Iets wat weinig mensen over mij weten omdat ik het goed verstop, is...',
    subtitle: 'Een zacht stukje van jezelf.'
  },

  // ==========================================
  // FIRST DATE - 8. RAPID FIRE (Snelle keuzes)
  // ==========================================
  {
    id: 'date-rf-1',
    category: 'Eerste Date',
    subcategory: 'Snelvuur',
    interactionType: 'rapid_fire',
    intensity: 1,
    relationshipType: ['date', 'partner', 'friends', 'surprise'],
    tags: ['snelvuur', 'energie', 'ijsbreker'],
    premium: false,
    prompt: '5 Snelle Keuzes: Tik direct wat bij jou past.',
    subtitle: 'Niet nadenken, binnen één seconde kiezen. Vergelijk daarna jullie matches!',
    rapidFirePairs: [
      { id: 'rf-1', optionA: 'Koffie in bed', optionB: 'Koffie to go' },
      { id: 'rf-2', optionA: 'Spontaan op pad', optionB: 'Plan tot in detail' },
      { id: 'rf-3', optionA: 'Bellen', optionB: 'Voice note sturen' },
      { id: 'rf-4', optionA: 'Directe waarheid', optionB: 'Voorzichtige tact' },
      { id: 'rf-5', optionA: 'Grote feesten', optionB: 'Kleine huiskamerborrels' }
    ]
  },
  {
    id: 'date-rf-2',
    category: 'Eerste Date',
    subcategory: 'Daten & Chemie',
    interactionType: 'rapid_fire',
    intensity: 2,
    relationshipType: ['date', 'partner'],
    tags: ['snelvuur', 'daten', 'dynamiek'],
    premium: false,
    prompt: '5 Snelle Date Vragen:',
    subtitle: 'Wie reageert sneller? Tik om jullie keuzes te vergelijken.',
    rapidFirePairs: [
      { id: 'rf-6', optionA: 'Drankjes aan de bar', optionB: 'Wandeling in het park' },
      { id: 'rf-7', optionA: 'Eerste kus op date 1', optionB: 'Spanning opbouwen' },
      { id: 'rf-8', optionA: 'Zelf koken voor de ander', optionB: 'Uit eten gaan' },
      { id: 'rf-9', optionA: 'Ochtendmens', optionB: 'Nachtvlinder' },
      { id: 'rf-10', optionA: 'Gedeeld toetje', optionB: 'Eigen toetje opeisen' }
    ]
  },

  // ==========================================
  // FIRST DATE - 9. REVEAL (Blind antwoorden, samen onthullen)
  // ==========================================
  {
    id: 'date-rev-1',
    category: 'Eerste Date',
    subcategory: 'Geheime Keuze',
    interactionType: 'reveal',
    intensity: 2,
    relationshipType: ['date', 'partner', 'surprise'],
    tags: ['onthulling', 'spanning', 'spel'],
    premium: false,
    prompt: 'Hoe schat je de klik van vanavond tot nu toe in?',
    subtitle: 'Kies beiden blind een antwoord op het scherm. Druk daarna op "Onthul Samen"!',
    revealQuestion: {
      instruction: 'Selecteer stiekem jouw antwoord en geef de telefoon niet door tot jullie beiden gekozen hebben:',
      options: [
        'Verrassend leuker dan ik had verwacht',
        'Gezellig en ontspannen',
        'Ik ben vooral heel nieuwsgierig naar meer',
        'Er hangt zeker een fijne vonk in de lucht'
      ]
    }
  },
  {
    id: 'date-rev-2',
    category: 'Eerste Date',
    subcategory: 'Afsluiting van de avond',
    interactionType: 'reveal',
    intensity: 3,
    relationshipType: ['date', 'partner'],
    tags: ['onthulling', 'afsluiting', 'flirten'],
    premium: true,
    prompt: 'Wat zou je het liefst doen als deze date over een uur voorbij is?',
    subtitle: 'Beide kiezen in het geheim één optie en onthullen die tegelijk.',
    revealQuestion: {
      instruction: 'Kies stiekem jouw verlangen:',
      options: [
        'Nog één drankje ergens anders halen',
        'Een wandeling maken door de stille stad',
        'Afspreken voor een tweede date',
        'Een oprechte, iets te lange knuffel geven'
      ]
    }
  },

  // ==========================================
  // PARTNER & RELATIE PROMPTS (Rich multi-pack)
  // ==========================================
  {
    id: 'partner-ask-1',
    category: 'Partner',
    subcategory: 'Dankbaarheid',
    interactionType: 'ask',
    intensity: 2,
    relationshipType: ['partner'],
    tags: ['dankbaarheid', 'aandacht'],
    premium: false,
    prompt: 'Wat is een klein gebaar van mij van de afgelopen week dat je erg waardeerde, maar waar je niets over zei?',
    subtitle: 'Soms glippen de mooiste momenten stilletjes voorbij.',
    tip: 'Luister zonder jezelf te verdedigen of te relativeren.'
  },
  {
    id: 'partner-wyr-1',
    category: 'Partner',
    subcategory: 'Toekomst',
    interactionType: 'would_you_rather',
    intensity: 3,
    relationshipType: ['partner'],
    tags: ['toekomst', 'dilemma'],
    premium: false,
    prompt: 'Als we samen een sabbatjaar kregen met behoud van salaris, wat zouden we doen?',
    options: [
      { id: 'a', text: 'Een camper kopen en kriskras door Europa reizen', subtext: 'Vrijheid, wisselende uitzichten en eenvoud' },
      { id: 'b', text: 'Een halfjaar wonen in een appartement in Rome of Kyoto', subtext: 'Lokale routine, diepe rust en cultuur' }
    ]
  },
  {
    id: 'partner-chal-1',
    category: 'Partner',
    subcategory: 'Herbeleven',
    interactionType: 'challenge',
    intensity: 2,
    relationshipType: ['partner'],
    tags: ['herinnering', 'romantiek'],
    premium: false,
    prompt: 'Vertel elkaar in 60 seconden hoe onze allereerste zoen voelde.',
    subtitle: 'Wie herinnert zich de meeste details?',
    challengeAction: 'Vertel het met de blik van toen.'
  },

  // ==========================================
  // CATEGORIE: VRIENDSCHAP (Minimaal 10 prompts)
  // ==========================================
  {
    id: 'vriendschap-ask-1',
    category: 'Vriendschap',
    subcategory: 'Nostalgie & Begin',
    interactionType: 'ask',
    intensity: 2,
    relationshipType: ['friends', 'surprise'],
    tags: ['vriendschap', 'nostalgie', 'connectie'],
    premium: false,
    prompt: 'Wat is het moment waarop je wist: met deze persoon ga ik jarenlang vrienden blijven?',
    subtitle: 'Herinner je je nog waar we waren, wie erbij waren en wat er gebeurde?',
    tip: 'Haal zo specifiek mogelijke herinneringen op.'
  },
  {
    id: 'vriendschap-point-1',
    category: 'Vriendschap',
    subcategory: 'Chaos & Nachtleven',
    interactionType: 'point',
    intensity: 1,
    relationshipType: ['friends', 'group', 'surprise'],
    tags: ['humor', 'chaos', 'vriendschap'],
    premium: false,
    prompt: 'Wie van jullie twee heeft de meest onvoorspelbare, chaotische beslissingen genomen in het leven?',
    subtitle: 'Tel samen af tot 3 en wijs tegelijk naar degene die het meeste spektakel veroorzaakt.'
  },
  {
    id: 'vriendschap-both-1',
    category: 'Vriendschap',
    subcategory: 'Open Kaart',
    interactionType: 'both_answer',
    intensity: 3,
    relationshipType: ['friends', 'surprise'],
    tags: ['vriendschap', 'reflectie', 'groei'],
    premium: false,
    prompt: 'Op welk gebied van je leven heb je momenteel het gevoel dat je een beetje vastzit?',
    subtitle: 'Persoon 1 deelt eerst, daarna Persoon 2. Geen ongevraagd advies, eerst alleen écht luisteren.',
    tip: 'Vraag door met "hoe voelt dat voor je?" in plaats van meteen oplossingen aan te dragen.'
  },
  {
    id: 'vriendschap-guess-1',
    category: 'Vriendschap',
    subcategory: 'Karakterkennis',
    interactionType: 'guess',
    intensity: 2,
    relationshipType: ['friends', 'surprise'],
    tags: ['inzicht', 'spel', 'humor'],
    premium: false,
    prompt: 'Raad wat de ander zou doen als die morgen 50.000 euro wint maar het binnen 24 uur móét uitgeven.',
    subtitle: 'Persoon A doet een gedurfde voorspelling, waarna B de waarheid onthult!',
    guessDetails: {
      targetPrompt: 'Mijn ultieme 24-uurs impulsieve uitgave zou zijn...',
      hint: 'Denk aan reizen, absurde gadgets of overdreven etentjes.'
    }
  },
  {
    id: 'vriendschap-wyr-1',
    category: 'Vriendschap',
    subcategory: 'Vakantiedilemma',
    interactionType: 'would_you_rather',
    intensity: 1,
    relationshipType: ['friends', 'group', 'surprise'],
    tags: ['dilemma', 'reizen', 'vriendschap'],
    premium: false,
    prompt: 'Als we samen twee weken moeten reizen op een extreem budget, wat kiezen we?',
    options: [
      { id: 'a', text: 'Wildkamperen in Noorwegen met rugzak, instant noedels en koude meren', subtext: 'Fysiek zwaar, maar epische stilte en natuur' },
      { id: 'b', text: 'Slapen in lawaaierige 12-persoons hostels in Oost-Europa en elke avond op stap', subtext: 'Weinig slaap, maar maximale sociale chaos' }
    ]
  },
  {
    id: 'vriendschap-chal-1',
    category: 'Vriendschap',
    subcategory: 'Waardering',
    interactionType: 'challenge',
    intensity: 3,
    relationshipType: ['friends', 'surprise'],
    tags: ['warmte', 'waardering', 'opdracht'],
    premium: false,
    prompt: 'Benoem drie specifieke kwaliteiten van de ander die jou inspireren om een beter mens te zijn.',
    subtitle: 'Niet algemeen ("je bent gezellig"), maar heel concreet over hun karakter of loyaliteit.',
    challengeAction: 'Kijk elkaar aan en spreek je bewondering rustig uit.'
  },
  {
    id: 'vriendschap-fts-1',
    category: 'Vriendschap',
    subcategory: 'Eerlijkheid',
    interactionType: 'finish_the_sentence',
    intensity: 2,
    relationshipType: ['friends', 'surprise'],
    tags: ['zinsafmaker', 'authenticiteit'],
    premium: false,
    prompt: 'Vul allebei aan zonder te filteren:',
    sentenceStarter: 'De grootste verandering die ik in jou heb gezien sinds we elkaar kennen is...',
    subtitle: 'Kijk naar zelfvertrouwen, rust of levenskeuzes.'
  },
  {
    id: 'vriendschap-rf-1',
    category: 'Vriendschap',
    subcategory: 'Vriendschapsgewoontes',
    interactionType: 'rapid_fire',
    intensity: 1,
    relationshipType: ['friends', 'group', 'surprise'],
    tags: ['snelvuur', 'gewoontes', 'humor'],
    premium: false,
    prompt: '5 Snelle Vrienden Dilemma’s:',
    subtitle: 'Direct tikken, niet overleggen!',
    rapidFirePairs: [
      { id: 'v-rf-1', optionA: 'Uren bellen over niks', optionB: '100 memes per dag sturen' },
      { id: 'v-rf-2', optionA: 'Altijd 10 minuten te laat', optionB: 'Pijnlijk stipt op tijd' },
      { id: 'v-rf-3', optionA: 'Kroegavond tot sluiting', optionB: 'Katerontbijt en wandeling' },
      { id: 'v-rf-4', optionA: 'Recht voor z’n raap', optionB: 'Liefdevol verzachtend' },
      { id: 'v-rf-5', optionA: 'Spontaan aanwaaien', optionB: 'Drie weken van tevoren datumprikker' }
    ]
  },
  {
    id: 'vriendschap-rev-1',
    category: 'Vriendschap',
    subcategory: 'Geheime Bekentenis',
    interactionType: 'reveal',
    intensity: 3,
    relationshipType: ['friends', 'surprise'],
    tags: ['onthulling', 'loyaliteit'],
    premium: true,
    prompt: 'Waarover vraag jij de ander het minst vaak om hulp, terwijl je het eigenlijk wel zou willen?',
    subtitle: 'Beide kiezen blind hun kwetsbare plek en onthullen die tegelijk.',
    revealQuestion: {
      instruction: 'Selecteer stiekem wat jou het meeste bezighoudt:',
      options: [
        'Financiële onzekerheid of geldzorgen',
        'Liefdesverdriet of relationele twijfels',
        'Eenzaamheid of stress op het werk',
        'Zorgen over mijn gezondheid of mentale rust'
      ]
    }
  },
  {
    id: 'vriendschap-ask-2',
    category: 'Vriendschap',
    subcategory: 'Levenspad',
    interactionType: 'ask',
    intensity: 4,
    relationshipType: ['friends', 'surprise'],
    tags: ['diepgang', 'waarden', 'toekomst'],
    premium: true,
    prompt: 'Wat is iets waar je je vroeger voor schaamde, maar wat je nu juist als een kracht van jezelf ziet?',
    subtitle: 'Iets waardoor je je anders voelde dan de rest van de groep.',
    tip: 'Geef elkaar alle tijd om na te denken.'
  },

  // ==========================================
  // CATEGORIE: FAMILIE (Minimaal 10 prompts)
  // ==========================================
  {
    id: 'familie-ask-1',
    category: 'Familie',
    subcategory: 'Generaties & Gewoontes',
    interactionType: 'ask',
    intensity: 2,
    relationshipType: ['family', 'surprise'],
    tags: ['familie', 'herinnering', 'waarden'],
    premium: false,
    prompt: 'Wat is een eigenschap van onze familie die je ontzettend koestert, en eentje die je liever loslaat?',
    subtitle: 'Kijk naar onze gewoontes rond eten, humor, geld of hoe we met spanning omgaan.',
    tip: 'Houd het warm en nieuwsgierig, zonder beschuldigingen.'
  },
  {
    id: 'familie-fts-1',
    category: 'Familie',
    subcategory: 'Opgroeien',
    interactionType: 'finish_the_sentence',
    intensity: 2,
    relationshipType: ['family', 'surprise'],
    tags: ['begrip', 'verbinding', 'jeugd'],
    premium: false,
    prompt: 'Maak de zin af zonder lang na te denken:',
    sentenceStarter: 'Toen ik kind was dacht ik altijd dat volwassenen alles wisten, totdat...',
    subtitle: 'Deel een ontwapenend moment waarop het volwassen masker afviel.'
  },
  {
    id: 'familie-both-1',
    category: 'Familie',
    subcategory: 'Jeugdherinnering',
    interactionType: 'both_answer',
    intensity: 1,
    relationshipType: ['family', 'surprise'],
    tags: ['familie', 'herinnering', 'lach'],
    premium: false,
    prompt: 'Wat was de meest legendarische familievakantie of verjaardag waarbij álles misging?',
    subtitle: 'Persoon 1 vertelt hun perspectief, waarna Persoon 2 aanvult met details die de ander vergeten was.',
    tip: 'Lach om de chaos van toen.'
  },
  {
    id: 'familie-point-1',
    category: 'Familie',
    subcategory: 'Familierollen',
    interactionType: 'point',
    intensity: 1,
    relationshipType: ['family', 'group', 'surprise'],
    tags: ['dynamiek', 'humor', 'rollen'],
    premium: false,
    prompt: 'Wie van ons heeft de koppigste trekjes geërfd van de (groot)ouders?',
    subtitle: 'Tel af: 1, 2, 3... Wijs tegelijk naar degene die het hardst weigert toe te geven!'
  },
  {
    id: 'familie-guess-1',
    category: 'Familie',
    subcategory: 'Verleden',
    interactionType: 'guess',
    intensity: 2,
    relationshipType: ['family', 'surprise'],
    tags: ['verrassing', 'historie'],
    premium: false,
    prompt: 'Wat was volgens jou de grootste droom van de ander toen die 16 jaar oud was?',
    subtitle: 'Raad elkaars tienerdromen, muzikale idolen of carrièredoelen.',
    guessDetails: {
      targetPrompt: 'Mijn grootste droom als 16-jarige was...',
      hint: 'Kijk naar oude posters of hobbies die intussen verwaterd zijn.'
    }
  },
  {
    id: 'familie-wyr-1',
    category: 'Familie',
    subcategory: 'Tradities',
    interactionType: 'would_you_rather',
    intensity: 2,
    relationshipType: ['family', 'surprise'],
    tags: ['traditie', 'keuzes'],
    premium: false,
    prompt: 'Wat zou je liever doen voor het volgende grote familiefeest?',
    options: [
      { id: 'a', text: 'Samen drie dagen koken voor een gigantisch traditioneel familiediner aan een lange tafel', subtext: 'Warme gezelligheid, hectiek en recepten van vroeger' },
      { id: 'b', text: 'Met z’n allen een weekend naar een bungalowpark met spelletjesavonden en boswandelingen', subtext: 'Weg van huis, ongedwongen en lekker buiten' }
    ]
  },
  {
    id: 'familie-chal-1',
    category: 'Familie',
    subcategory: 'Dankbaarheid',
    interactionType: 'challenge',
    intensity: 3,
    relationshipType: ['family', 'surprise'],
    tags: ['waardering', 'ontroering', 'opdracht'],
    premium: false,
    prompt: 'Bedank de ander voor een herinnering of les uit je jeugd die je nooit bent vergeten.',
    subtitle: 'Iets kleins dat de ander misschien allang vergeten is, maar jou heeft gevormd.',
    challengeAction: 'Vertel wat het met jou deed en waarom het je is bijgebleven.'
  },
  {
    id: 'familie-rf-1',
    category: 'Familie',
    subcategory: 'Huishouden & DNA',
    interactionType: 'rapid_fire',
    intensity: 1,
    relationshipType: ['family', 'surprise'],
    tags: ['snelvuur', 'herkenning'],
    premium: false,
    prompt: '5 Snelle Familie DNA Vragen:',
    subtitle: 'Herken elkaars gewoontes:',
    rapidFirePairs: [
      { id: 'f-rf-1', optionA: 'Kliekjes 3 dagen bewaren', optionB: 'Alles vers weggooien/opmaken' },
      { id: 'f-rf-2', optionA: 'Spanning weglachen', optionB: 'Meteen uitpraten aan tafel' },
      { id: 'f-rf-3', optionA: 'Bordjes leegeten tot de laatste kruimel', optionB: 'Stoppen als je vol zit' },
      { id: 'f-rf-4', optionA: 'Verjaardag groots vieren', optionB: 'Liever stilletjes ontvluchten' },
      { id: 'f-rf-5', optionA: 'Koffie met koekje om 10:00 stipt', optionB: 'Wanneer het maar uitkomt' }
    ]
  },
  {
    id: 'familie-rev-1',
    category: 'Familie',
    subcategory: 'Verwachtingen',
    interactionType: 'reveal',
    intensity: 3,
    relationshipType: ['family', 'surprise'],
    tags: ['onthulling', 'diepgang'],
    premium: true,
    prompt: 'Welke familietraditie of verwachting vind jij stiekem het meest vermoeiend?',
    subtitle: 'Kies blind en onthul samen met een knipoog.',
    revealQuestion: {
      instruction: 'Kies eerlijk jouw minst favoriete familie-aspect:',
      options: [
        'Verplichte feestdagen en strakke eetschema’s',
        'Steeds dezelfde oude verhalen moeten aanhoren',
        'Vragen over relaties, carrière of kinderen',
        'De onuitgesproken druk om altijd vrolijk te doen'
      ]
    }
  },
  {
    id: 'familie-ask-2',
    category: 'Familie',
    subcategory: 'Wijsheid',
    interactionType: 'ask',
    intensity: 4,
    relationshipType: ['family', 'surprise'],
    tags: ['diepgang', 'generaties', 'liefde'],
    premium: true,
    prompt: 'Wat is de belangrijkste les over het leven die je hebt geleerd door naar onze ouders of grootouders te kijken?',
    subtitle: 'Zowel in wat ze wél deden, als wat je zelf juist bewust heel anders aanpakt.',
    tip: 'Luister met mildheid en respect.'
  },

  // ==========================================
  // CATEGORIE: GROEPSIJSBREKERS (Minimaal 10 prompts)
  // ==========================================
  {
    id: 'groep-point-1',
    category: 'Groepsijsbrekers',
    subcategory: 'Tafelstemming',
    interactionType: 'point',
    intensity: 1,
    relationshipType: ['group', 'surprise', 'friends'],
    tags: ['ijsbreker', 'groep', 'lach'],
    premium: false,
    prompt: 'Wie aan deze tafel heeft de meest bizarre slaapgewoonte of ochtendritueel?',
    subtitle: 'Iedereen telt samen af tot 3 en wijst tegelijk naar degene die het meest excentriek is!'
  },
  {
    id: 'groep-point-2',
    category: 'Groepsijsbrekers',
    subcategory: 'Overlevingsdrang',
    interactionType: 'point',
    intensity: 2,
    relationshipType: ['group', 'surprise', 'friends'],
    tags: ['groep', 'humor', 'avontuur'],
    premium: false,
    prompt: 'Als deze hele groep op een onbewoond eiland strandt, wie overleeft er dan als allerlaatste?',
    subtitle: 'Tel af: 3, 2, 1... Wijs de ultieme survivor van de groep aan!'
  },
  {
    id: 'groep-rf-1',
    category: 'Groepsijsbrekers',
    subcategory: 'Groepsstemming',
    interactionType: 'rapid_fire',
    intensity: 1,
    relationshipType: ['group', 'surprise', 'friends'],
    tags: ['snelvuur', 'groep', 'tempo'],
    premium: false,
    prompt: '5 Snelle Groepskeuzes: Laat de stemmen horen!',
    subtitle: 'Iedereen roept tegelijk hun keuze!',
    rapidFirePairs: [
      { id: 'g-rf-1', optionA: 'Karaoke tot 04:00', optionB: 'Bordspellen met borrelplank' },
      { id: 'g-rf-2', optionA: 'Friet met mayonaise', optionB: 'Pizza met knoflooksaus' },
      { id: 'g-rf-3', optionA: 'Festival in de modder', optionB: 'Luxe strandbedje' },
      { id: 'g-rf-4', optionA: 'Rechttoe rechtaan praten', optionB: 'Diplomatieke vrede bewaren' },
      { id: 'g-rf-5', optionA: 'Groepsapp met 500 berichten', optionB: 'Groepsapp op stil voor altijd' }
    ]
  },
  {
    id: 'groep-wyr-1',
    category: 'Groepsijsbrekers',
    subcategory: 'Tafeldilemma',
    interactionType: 'would_you_rather',
    intensity: 2,
    relationshipType: ['group', 'surprise', 'friends'],
    tags: ['dilemma', 'debat', 'groep'],
    premium: false,
    prompt: 'Iedereen aan tafel kiest één kant en probeert de rest te overtuigen:',
    options: [
      { id: 'a', text: 'Elke dag wakker worden om 05:00 uur met oneindige energie en focus', subtext: 'De ultieme ochtendheld, maar nooit meer uitslapen' },
      { id: 'b', text: 'Nooit meer een kater of vermoeidheid na een wilde avond stappen', subtext: 'Altijd fit de dag erna, ongeacht het tijdstip' }
    ]
  },
  {
    id: 'groep-chal-1',
    category: 'Groepsijsbrekers',
    subcategory: 'Improvisatie',
    interactionType: 'challenge',
    intensity: 2,
    relationshipType: ['group', 'surprise', 'friends'],
    tags: ['opdracht', 'groep', 'lach'],
    premium: false,
    prompt: 'Tafeluitdaging: Vertel in 60 seconden om de beurt één woord om samen een bizar verhaal te maken.',
    subtitle: 'Wie hapert of dubbel praat moet een slok van zijn drankje nemen!',
    challengeAction: 'Start met "Er was eens een verwarde pinguïn die..." en ga met de klok mee.'
  },
  {
    id: 'groep-guess-1',
    category: 'Groepsijsbrekers',
    subcategory: 'Tafelgeheimen',
    interactionType: 'guess',
    intensity: 2,
    relationshipType: ['group', 'surprise', 'friends'],
    tags: ['raadsel', 'observatie'],
    premium: false,
    prompt: 'Kies één persoon aan tafel. De rest raadt gezamenlijk wat diens allereerste bijbaantje ooit was.',
    subtitle: 'Was het vakkenvullen, krantenwijk, afwas of iets totaal onverwachts?',
    guessDetails: {
      targetPrompt: 'Mijn allereerste betaalde baantje was...',
      hint: 'Let op handigheid, geduld en verhalen van vroeger.'
    }
  },
  {
    id: 'groep-both-1',
    category: 'Groepsijsbrekers',
    subcategory: 'Bekentenissen',
    interactionType: 'both_answer',
    intensity: 1,
    relationshipType: ['group', 'surprise', 'friends'],
    tags: ['blunder', 'ijsbreker', 'groep'],
    premium: false,
    prompt: 'Wat is de slechtste aankoop van onder de €50 die je ooit hebt gedaan?',
    subtitle: 'Ga de tafel rond. Degene met de domste miskoop wint de ronde.',
    tip: 'Denk aan Tell Sell artikelen, kleding die je nooit droeg of rare keukenspullen.'
  },
  {
    id: 'groep-fts-1',
    category: 'Groepsijsbrekers',
    subcategory: 'Groepsstemming',
    interactionType: 'finish_the_sentence',
    intensity: 2,
    relationshipType: ['group', 'surprise', 'friends'],
    tags: ['zinsafmaker', 'groep'],
    premium: false,
    prompt: 'Ga de tafel rond en maak deze zin af in maximaal 5 woorden:',
    sentenceStarter: 'De ultieme sfeerbreker op een feestje is wanneer iemand...',
    subtitle: 'Deel je allergrootste party-pet-peeve.'
  },
  {
    id: 'groep-rev-1',
    category: 'Groepsijsbrekers',
    subcategory: 'Blind Stemmen',
    interactionType: 'reveal',
    intensity: 2,
    relationshipType: ['group', 'surprise', 'friends'],
    tags: ['onthulling', 'spanning', 'groep'],
    premium: false,
    prompt: 'Hoe energiek voelt deze tafel zich op dit moment?',
    subtitle: 'Laat twee tegenpolen aan tafel blind kiezen en onthul de energie!',
    revealQuestion: {
      instruction: 'Selecteer stiekem jouw huidige batterijpercentage:',
      options: [
        '100% - Klaar om door te feesten tot het ochtendgloren',
        '70% - Heerlijk ontspannen en genietend van het gesprek',
        '40% - Een beetje rozig van het eten en drinken',
        '15% - Houd me gezellig vast maar breng me bijna naar bed'
      ]
    }
  },
  {
    id: 'groep-ask-1',
    category: 'Groepsijsbrekers',
    subcategory: 'Reisverhalen',
    interactionType: 'ask',
    intensity: 3,
    relationshipType: ['group', 'surprise', 'friends'],
    tags: ['verhalen', 'groep', 'avontuur'],
    premium: false,
    prompt: 'Wat is het vreemdste toeval dat iemand aan deze tafel ooit op reis heeft meegemaakt?',
    subtitle: 'Een bekende tegenkomen aan de andere kant van de wereld, of een wonderbaarlijke redding.',
    tip: 'Laat iedereen even kort nadenken en geef het woord aan de beste anekdote.'
  },
  {
    id: 'groep-ask-2',
    category: 'Groepsijsbrekers',
    subcategory: 'Diepere Connectie',
    interactionType: 'ask',
    intensity: 4,
    relationshipType: ['group', 'surprise', 'friends'],
    tags: ['diepgang', 'waardering', 'groep'],
    premium: true,
    prompt: 'Als we over 20 jaar als groep terugkijken op vanavond, wat hopen we dat er dan nog exact hetzelfde is?',
    subtitle: 'Onze vriendschap, de humor, de manier waarop we praten of hoe we elkaar vasthouden.',
    tip: 'Een mooi moment om even stil te staan bij het gezelschap.'
  },

  // ==========================================
  // SECRET PICK INTERACTIONS (Game Mechanic)
  // ==========================================
  {
    id: 'secret-pick-1',
    category: 'Eerste Date & Chemie',
    subcategory: 'Secret Pick',
    interactionType: 'secret_pick',
    intensity: 2,
    relationshipType: ['date', 'partner', 'surprise'],
    relationshipStages: ['date_first', 'date_few', 'date_flirty', 'partner_datenight'],
    tags: ['spel', 'chemie', 'flirten', 'verrassend'],
    premium: false,
    prompt: 'Wie van jullie zou eerder halsoverkop verliefd worden?',
    subtitle: 'Kies eerst in het geheim jouw antwoord zonder dat de ander meekijkt. Pas na het aftellen onthullen we jullie keuzes tegelijk!',
    tip: 'Geef de telefoon rustig door aan de ander.',
    secretPickDetails: {
      question: 'Wie van jullie zou eerder halsoverkop verliefd worden?',
      options: ['De ander', 'Ikzelf', 'Echt precies gelijk']
    }
  },
  {
    id: 'secret-pick-2',
    category: 'Partner & Dynamiek',
    subcategory: 'Secret Pick',
    interactionType: 'secret_pick',
    intensity: 2,
    relationshipType: ['partner', 'date', 'surprise'],
    relationshipStages: ['partner_datenight', 'partner_reconnect', 'date_flirty', 'date_awhile'],
    tags: ['humor', 'spel', 'herkenning', 'verrassend'],
    premium: false,
    prompt: 'Wat zou onze perfecte spontane date zijn als we nu direct de deur uit liepen?',
    subtitle: 'Kies beiden blind één optie. Hebben jullie dezelfde chemie of juist een leuke verrassing?',
    secretPickDetails: {
      question: 'Wat zou onze perfecte spontane date zijn als we nu de deur uit liepen?',
      options: ['Cocktails in een schemerige bar', 'Late night wandeling & diepe gesprekken', 'Snacks halen en samen op de bank kruipen']
    }
  },
  {
    id: 'secret-pick-3',
    category: 'Vriendschap & Spel',
    subcategory: 'Secret Pick',
    interactionType: 'secret_pick',
    intensity: 2,
    relationshipType: ['friends', 'group', 'surprise'],
    relationshipStages: ['friends_new', 'friends_good', 'friends_best', 'friends_group'],
    tags: ['lachen', 'spel', 'humor'],
    premium: false,
    prompt: 'Wie van jullie zou in een noodsituatie de rust bewaren en wie raakt meteen in paniek?',
    subtitle: 'Kies beiden eerlijk over wie de absolute rots in de branding is.',
    secretPickDetails: {
      question: 'Wie is de ultieme rots in de branding?',
      options: ['Persoon 1 bewaart de rust', 'Persoon 2 bewaart de rust', 'We raken allebei in paniek']
    }
  },
  {
    id: 'secret-pick-4',
    category: 'Chemie & Aantrekkingskracht',
    subcategory: 'Secret Pick',
    interactionType: 'secret_pick',
    intensity: 3,
    relationshipType: ['date', 'partner'],
    relationshipStages: ['date_flirty', 'date_few', 'partner_datenight'],
    tags: ['flirten', 'chemie', 'aantrekkingskracht'],
    premium: false,
    prompt: 'Wat trok jou bij de allereerste ontmoeting het meest aan in de ander?',
    subtitle: 'Kies jouw favoriete detail in stilte. 3... 2... 1... onthul tegelijkertijd!',
    secretPickDetails: {
      question: 'Wat trok jou als eerste het meeste aan?',
      options: ['De ogen en blik', 'De lach en stemgeluid', 'De zelfverzekerde energie & stijl']
    }
  },

  // ==========================================
  // POSITIVE LANDINGS (Ending Curve Mastery)
  // ==========================================
  {
    id: 'positive-landing-1',
    category: 'Positieve Afsluiting',
    subcategory: 'Compliment & Blik Vooruit',
    interactionType: 'ask',
    intensity: 2,
    relationshipType: ['date', 'partner', 'friends', 'surprise'],
    relationshipStages: ['any'],
    tags: ['waardering', 'afsluiting', 'positief', 'compliment'],
    emotionalTone: 'positive_landing',
    premium: false,
    prompt: 'Wat is iets subtiels dat de ander tijdens dit gesprek deed of zei, dat je een warm of fijn gevoel gaf?',
    subtitle: 'Een blik, een openhartig antwoord, of een moment waarop jullie samen moesten lachen.',
    tip: 'Kijk elkaar aan tijdens het antwoord en neem de tijd.'
  },
  {
    id: 'positive-landing-2',
    category: 'Positieve Afsluiting',
    subcategory: 'Lichte Toekomst',
    interactionType: 'both_answer',
    intensity: 2,
    relationshipType: ['date', 'partner', 'friends', 'surprise'],
    relationshipStages: ['any'],
    tags: ['toekomst', 'energie', 'positief'],
    emotionalTone: 'positive_landing',
    premium: false,
    prompt: 'Welk gevoel of welk woord beschrijft de energie tussen ons vanavond het allerbeste?',
    subtitle: 'Beide noemen binnen 5 seconden één woord.',
    tip: 'Zonder te overpeinzen; ga op je allereerste gevoel af.'
  },
  {
    id: 'positive-landing-3',
    category: 'Positieve Afsluiting',
    subcategory: 'Samen Vieren',
    interactionType: 'challenge',
    intensity: 1,
    relationshipType: ['date', 'partner', 'friends', 'family', 'surprise'],
    relationshipStages: ['any'],
    tags: ['speels', 'proost', 'afsluiting', 'warmte'],
    emotionalTone: 'positive_landing',
    premium: false,
    prompt: 'Sluit deze ronde af met een toast of blik: hef samen het glas op één specifiek ding van vandaag.',
    subtitle: 'Of geef elkaar een high five / knuffel voor de eerlijke en leuke antwoorden.',
    challengeAction: 'Hef het glas of wissel een glimlach uit en spreek één kleine wens uit voor de rest van de avond.'
  }
];

// Helper to filter prompts for session logic
export function getFilteredPrompts(
  relationship: string,
  vibe: string,
  includePremium: boolean = false
): PromptItem[] {
  return PROMPTS_DATABASE.filter((item) => {
    // Relationship match
    const relMatch =
      relationship === 'surprise' ||
      item.relationshipType.includes(relationship as RelationshipType) ||
      item.relationshipType.includes('surprise');

    if (!relMatch) return false;

    // Premium gate check
    if (item.premium && !includePremium) {
      return false;
    }

    return true;
  });
}
