import { LearningPath } from '../types';

export const CURRICULUM_PATHS: LearningPath[] = [
    {
        subject: 'Wiskunde B',
        level: 'VWO',
        topic: 'Differentiëren van Machtsfuncties en Samengestelde Functies',
        nodes: [
            {
                id: 'WISB_VWO_DIFF_01',
                title: 'Het Differentiequotiënt & De Raaklijn',
                description: 'De overgang van gemiddelde verandering (Δy/Δx) naar verandering in een punt (dy/dx).',
                slo_ref: 'Subdomein C1: Afgeleide functies',
                didactic_focus: 'Conceptueel begrip',
                mastery_criteria: 'De leerling kan de helling in een punt benaderen met de grafische rekenmachine (dy/dx optie) en de definitie uitleggen.',
                example_question: 'Leg uit waarom we de limiet van h->0 nemen om de snelheid op t=3 te berekenen.',
                study_load_minutes: 60,
                prerequisite_ids: [],
                micro_steps: [
                    'Het verschil begrijpen tussen een koorde (gemiddelde helling) en een raaklijn (helling in punt).',
                    'De formule voor het differentiequotiënt opstellen: (f(x+h) - f(x)) / h.',
                    'Het limietbegrip intuïtief toepassen: wat gebeurt er als h naar 0 gaat?',
                    'De notatie dy/dx en f\'(x) leren kennen en correct uitspreken.',
                    'Grafische interpretatie: Helling van de grafiek = Richtingscoëfficiënt van de raaklijn.'
                ],
                common_misconceptions: [
                    'Denken dat de afgeleide de y-waarde is (het is de helling!).',
                    'Δy/Δx verwarren met dy/dx (gemiddeld vs momentaan).',
                    'Niet begrijpen dat een horizontale raaklijn helling 0 heeft.'
                ]
            },
            {
                id: 'WISB_VWO_DIFF_02',
                title: 'De Standaardregels (Machtsfuncties)',
                description: 'Het algebraïsch bepalen van de afgeleide voor f(x) = ax^n.',
                slo_ref: 'Subdomein C1: Regels voor differentiëren',
                didactic_focus: 'Automatisering',
                mastery_criteria: 'De leerling kan foutloos de afgeleide bepalen van f(x) = 3x^4 - 2x^2 + 5.',
                example_question: 'Bepaal de afgeleide van f(x) = 4/x^3. (Hint: schrijf eerst als macht).',
                study_load_minutes: 50,
                prerequisite_ids: ['WISB_VWO_DIFF_01'],
                micro_steps: [
                    'De hoofdregel toepassen: f(x) = x^n -> f\'(x) = n*x^(n-1).',
                    'Constante regel: f(x) = 5 -> f\'(x) = 0 (want helling is 0).',
                    'Lineaire regel: f(x) = 3x -> f\'(x) = 3.',
                    'Somregel: f(x) = g(x) + h(x) mag je los van elkaar differentiëren.',
                    'Negatieve exponenten omschrijven: 1/x^2 = x^-2 differentiëren.'
                ],
                common_misconceptions: [
                    'Vergeten de exponent met 1 te verlagen (x^3 wordt 3x^3 i.p.v. 3x^2).',
                    'De afgeleide van een getal (b.v. 5) als 5 schrijven i.p.v. 0.',
                    'Niet weten dat je wortels eerst als macht moet schrijven (√x = x^0.5) vóór je differentieert.'
                ]
            },
            {
                id: 'WISB_VWO_DIFF_03',
                title: 'De Productregel',
                description: 'Differentiëren van functies die met elkaar vermenigvuldigd worden.',
                slo_ref: 'Subdomein C1: Productregel',
                didactic_focus: 'Algoritmisch denken',
                mastery_criteria: 'De leerling past de regel "afgeleide keer de gewone plus de gewone keer de afgeleide" foutloos toe.',
                example_question: 'Differentieer f(x) = (x^2 + 1)(x^3 - 4) zonder eerst de haakjes weg te werken.',
                study_load_minutes: 55,
                prerequisite_ids: ['WISB_VWO_DIFF_02'],
                micro_steps: [
                    'Herkennen wanneer de productregel nodig is (f(x) = g(x) * h(x)).',
                    'De formule toepassen: f\'(x) = g\'(x)h(x) + g(x)h\'(x).',
                    'Strategy: Eerst g, h, g\' en h\' apart opschrijven in een kladblokje.',
                    'Haakjes correct wegwerken in het eindantwoord (indien gevraagd).'
                ],
                common_misconceptions: [
                    'Denken dat (g*h)\' gelijk is aan g\' * h\' (Fataal!).',
                    'Vergeten haakjes te zetten bij samengestelde termen.',
                    'De productregel gebruiken waar het niet hoeft (b.v. bij 3 * x^2, waar 3 een constante is).'
                ]
            },
            {
                id: 'WISB_VWO_DIFF_04',
                title: 'De Kettingregel (Composite Functions)',
                description: 'Differentiëren van functies IN andere functies (f(g(x))).',
                slo_ref: 'Subdomein C1: Kettingregel',
                didactic_focus: 'Patroonherkenning',
                mastery_criteria: 'De leerling kan de kettingregel foutloos combineren met wortels en breuken.',
                example_question: 'Waarom is de afgeleide van (2x+1)^3 NIET gelijk aan 3(2x+1)^2?',
                study_load_minutes: 70,
                prerequisite_ids: ['WISB_VWO_DIFF_02'],
                micro_steps: [
                    'Herkennen van de "buitenste" en "binnenste" functie.',
                    'Het principe van de ui pellen: differentieer buitenkant, laat binnenkant staan, vermenigvuldig met afgeleide binnenkant.',
                    'Formule: f(g(x))\' = f\'(g(x)) * g\'(x).',
                    'Toepassen op wortelfuncties: f(x) = √(3x+1).',
                    'Toepassen op machtsfuncties: f(x) = (2x - 5)^4.'
                ],
                common_misconceptions: [
                    'Vergeten te vermenigvuldigen met de afgeleide van de binnenste functie (meest gemaakte fout).',
                    'De binnenste functie óók differentiëren binnen de haakjes van de buitenste functie.',
                    'Verwarring tussen productregel (keer) en kettingregel (in elkaar).'
                ]
            },
            {
                id: 'WISB_VWO_DIFF_05',
                title: 'Toepassing: Extreme Waarden & Buigpunten',
                description: 'De afgeleide gebruiken om toppen en buigpunten te vinden.',
                slo_ref: 'Subdomein C2: Analyse van functies',
                didactic_focus: 'Synthese',
                mastery_criteria: 'De leerling kan een volledig functieonderzoek uitvoeren (Nulpunten, toppen, buigpunten, bereik).',
                example_question: 'Gegeven f(x) = x^3 - 3x. Bereken exact de coördinaten van de toppen.',
                study_load_minutes: 80,
                prerequisite_ids: ['WISB_VWO_DIFF_03', 'WISB_VWO_DIFF_04'],
                micro_steps: [
                    'Stappenplan extremen: 1. f\'(x) bepalen, 2. f\'(x)=0 oplossen, 3. Schets maken of waarden invullen.',
                    'Onderscheid maken tussen lokaal maximum, lokaal minimum en randextreem.',
                    'Buigpunten vinden: Tweede afgeleide f\'\'(x) = 0.',
                    'Redeneren: Als f\'(x) > 0 dan stijgt de grafiek.'
                ],
                common_misconceptions: [
                    'Vergeten de x-waarde terug in te vullen in de *oorspronkelijke* f(x) om de y-top te vinden.',
                    'Denken dat f\'(x)=0 altijd een top is (kan ook een buigpunt zijn, zadelpunt).',
                    'Randpunten van het domein vergeten te controleren.'
                ]
            }
        ]
    },
    {
        subject: 'Economie',
        level: 'HAVO',
        topic: 'Marktwerking en Marktfalen',
        nodes: [
            {
                id: 'ECO_HAVO_MARKT_01',
                title: 'De Vraaglijn & Consumentensurplus',
                description: 'Het gedrag van consumenten en hun betalingsbereidheid.',
                slo_ref: 'Domein D: Vraag en Aanbod',
                didactic_focus: 'Grafisch & Rekenvaardig',
                mastery_criteria: 'De leerling kan uitleggen wat er met de vraaglijn van ijsjes gebeurt bij een hittegolf (verschuiving naar rechts).',
                example_question: 'Teken de nieuwe situatie als het inkomen stijgt. Schuift de lijn of bewegen we langs de lijn?',
                study_load_minutes: 45,
                prerequisite_ids: [],
                micro_steps: [
                    'De wet van de vraag: Prijzen omlaag -> Vraag omhoog (negatief verband).',
                    'Verschil tussen "verschuiving langs de lijn" (door prijs) en "verschuiving van de lijn" (door voorkeur/inkomen).',
                    'Formule opstellen: Qv = -2P + 100.',
                    'Consumentensurplus arceren in de grafiek (driehoek onder vraaglijn, boven prijs).',
                    'Consumentensurplus berekenen: 0.5 * basis * hoogte.'
                ],
                common_misconceptions: [
                    'Denken dat een prijsverandering de lijn *verplaatst* (nee, je beweegt *langs* de lijn).',
                    'Qv en P assen omdraaien (P staat verticaal in economie, maar is wiskundig de oorzaak).',
                    'Het surplus verwarren met de winst.'
                ]
            },
            {
                id: 'ECO_HAVO_MARKT_02',
                title: 'De Aanbodlijn & Producentensurplus',
                description: 'Het gedrag van producenten en kostenstructuren.',
                slo_ref: 'Domein D: Marktmechanisme',
                didactic_focus: 'Grafisch Inzicht',
                mastery_criteria: 'De leerling kan beredeneren wat een loonsverhoging doet met de aanbodlijn.',
                example_question: 'Door een mislukte oogst wordt cacao duurder. Laat in de grafiek van chocolade zien wat er gebeurt.',
                study_load_minutes: 45,
                prerequisite_ids: [],
                micro_steps: [
                    'Wet van het aanbod: Prijs omhoog -> Aanbod omhoog (positief verband).',
                    'Oorzaken verschuiving aanbodlijn: Techniek (kosten omlaag -> rechts), Grondstofprijzen (kosten omhoog -> links).',
                    'Formule Qa = 3P - 50.',
                    'Producentensurplus herkennen: Gebied boven de aanbodlijn, onder de prijs.',
                    'Koppeling met winst: PS is dekking voor vaste kosten + winst.'
                ],
                common_misconceptions: [
                    'Verschuiving naar "rechts" verwarren met "omhoog" (bij aanbod betekent rechts = meer aanbod bij zelfde prijs).',
                    'Denken dat producenten bij een lagere prijs meer gaan aanbieden om evenveel te verdienen (fout, ze stoppen juist).',
                    'Kostenstijging zien als verschuiving naar rechts (fout, naar links/omhoog).'
                ]
            },
            {
                id: 'ECO_HAVO_MARKT_03',
                title: 'Marktevenwicht (Perfecte Markt)',
                description: 'Het punt waar Vraag en Aanbod samenkomen.',
                slo_ref: 'Domein D: Marktevenwicht',
                didactic_focus: 'Algebraïsch oplossen',
                mastery_criteria: 'De leerling kan algebraïsch en grafisch het evenwicht bepalen en de totale welvaart arceren.',
                example_question: 'Bereken de evenwichtsprijs als Qv = -2P+10 en Qa = 3P-5.',
                study_load_minutes: 60,
                prerequisite_ids: ['ECO_HAVO_MARKT_01', 'ECO_HAVO_MARKT_02'],
                micro_steps: [
                    'Vergelijking opstellen: Qa = Qv.',
                    'Evenwichtsprijs (Pe) berekenen door balansmethode.',
                    'Evenwichtshoeveelheid (Qe) berekenen door Pe in te vullen.',
                    'De "onzichtbare hand": Hoe een vraagoverschot leidt tot prijsstijging en nieuw evenwicht.',
                    'Totale Welvaart berekenen (CS + PS).'
                ],
                common_misconceptions: [
                    'Stoppen na het berekenen van P (vergeten Q uit te rekenen).',
                    'Reken-fouten met mintekens bij het oplossen van -2P + 100 = 3P - 50.',
                    'Denken dat de markt altijd in evenwicht is (het is een streven/tendens).'
                ]
            },
            {
                id: 'ECO_HAVO_MARKT_04',
                title: 'Elasticiteiten (Prijsgevoeligheid)',
                description: 'Hoe sterk reageert de klant op een prijsverandering?',
                slo_ref: 'Domein D: Elasticiteiten',
                didactic_focus: 'Interpreteren van getallen',
                mastery_criteria: 'De leerling kan adviseren of een prijsverhoging slim is voor de omzet, gegeven de elasticiteit.',
                example_question: 'De prijselasticiteit is -0.5. De prijs stijgt met 10%. Met hoeveel % daalt de afzet? En wat gebeurt er met de omzet?',
                study_load_minutes: 50,
                prerequisite_ids: ['ECO_HAVO_MARKT_01'],
                micro_steps: [
                    'Formule elasticiteit: %ΔQ / %ΔP (procentuele verandering vraag gedeeld door procentuele verandering prijs).',
                    'Onderscheid elastisch (E < -1, sterke reactie) vs inelastisch (-1 < E < 0, zwakke reactie).',
                    'Segmentatie: Primaire goederen (inelastisch) vs Luxe goederen (elastisch).',
                    'Omzetgevolgen: Bij inelastische vraag leidt prijsstijging tot meer omzet.',
                    'Kruiselingse elasticiteit: Substitutiegoederen vs Complementaire goederen.'
                ],
                common_misconceptions: [
                    'De deling omdraaien: %ΔP / %ΔQ doen (fout! Oorzaak staat onder, Gevolg boven).',
                    'Vergeten dat prijselasticiteit van de vraag vrijwel altijd negatief is.',
                    'Procentuele verandering berekenen: (Nieuw-Oud)/Oud * 100% vergeten.'
                ]
            }
        ]
    },
    {
        subject: 'Biologie',
        level: 'VWO',
        topic: 'Eiwitsynthese & Mutaties',
        nodes: [
            {
                id: 'BIO_VWO_GEN_01',
                title: 'DNA-Structuur & Replicatie',
                description: 'De chemische basis en het kopieerproces.',
                slo_ref: 'Subdomein B1',
                didactic_focus: 'Structuur',
                mastery_criteria: 'De leerling kan de replicatievork tekenen met alle enzymen.',
                example_question: 'Waarom wordt de lagging strand discontinu aangemaakt?',
                study_load_minutes: 50,
                prerequisite_ids: [],
                micro_steps: [
                    'Nucleotiden (fosfaat, desoxyribose, base) en de 5\'-3\' richting.',
                    'Antiparallelle strengen & waterstofbruggen (A=T, C≡G).',
                    'Replicatie-enzymen: Helicase, Primase, DNA-polymerase, Ligase.',
                    'Leading vs Lagging strand (Okazaki-fragmenten).',
                    'Telomeren en veroudering.'
                ],
                common_misconceptions: [
                    'Denken dat DNA-polymerase beide kanten op kan werken (alleen 5\'->3\').',
                    'Vergeten dat RNA-primers nodig zijn.'
                ]
            },
            {
                id: 'BIO_VWO_GEN_02',
                title: 'Transcriptie & Splicing',
                description: 'Van DNA naar rijp mRNA in de celkern.',
                slo_ref: 'Subdomein B2',
                didactic_focus: 'Proces',
                mastery_criteria: 'De leerling kan uitleggen waarom pre-mRNA langer is dan rijp mRNA.',
                example_question: 'Wat is de functie van het spliceosoom?',
                study_load_minutes: 50,
                prerequisite_ids: ['BIO_VWO_GEN_01'],
                micro_steps: [
                    'Template streng vs Coderende streng.',
                    'Promotorregio en transcriptiefactoren.',
                    'Post-transcriptionele modificatie: Capping, Poly-A staart.',
                    'Splicing: Introns eruit, Exons aan elkaar.',
                    'Alternatieve splicing: 1 gen -> meerdere eiwitten.'
                ],
                common_misconceptions: [
                    'Denken dat transcriptie het hele DNA kopieert (alleen genen).',
                    'Introns verwarren met "junk DNA".'
                ]
            },
            {
                id: 'BIO_VWO_GEN_03',
                title: 'Translatie & Eiwitvouwing',
                description: 'Van mRNA naar functioneel eiwit.',
                slo_ref: 'Subdomein B3',
                didactic_focus: 'Code-lezen',
                mastery_criteria: 'De leerling kan een mutatie in DNA vertalen naar het effect op de tertiaire structuur.',
                example_question: 'Wat gebeurt er als een stopcodon door mutatie verdwijnt?',
                study_load_minutes: 60,
                prerequisite_ids: ['BIO_VWO_GEN_02'],
                micro_steps: [
                    'Ribosoom werking (A-P-E sites).',
                    'tRNA, anticodons en aminozuur-activatie.',
                    'Startcodon (AUG) en Stopcodons.',
                    'Vouwing: Primaire, Secundaire (alpha/beta), Tertiaire, Quaternaire structuur.',
                    'Rol van chaperonne-eiwitten.'
                ],
                common_misconceptions: [
                    'Codontabel aflezen met tRNA (moet mRNA zijn).',
                    'Denken dat een eiwit "af" is na translatie (vouwing is cruciaal).'
                ]
            },
            {
                id: 'BIO_VWO_GEN_04',
                title: 'Genregulatie (Operons & Epigenetica)',
                description: 'Het aan- en uitzetten van genen.',
                slo_ref: 'Subdomein B4',
                didactic_focus: 'Systeemdenken',
                mastery_criteria: 'De leerling kan voorspellen of een gen aan of uit staat o.b.v. methyleringsgraad.',
                example_question: 'Leg uit hoe omgevingsfactoren via epigenetica genexpressie kunnen beïnvloeden.',
                study_load_minutes: 70,
                prerequisite_ids: ['BIO_VWO_GEN_02'],
                micro_steps: [
                    'Prokaryoten: Lac-operon (repressor, inducer, operator).',
                    'Eukaryoten: Enhancers, Silencers, Transcription Factors.',
                    'Epigenetica: Methylering (slot) vs Acetylering (sleutel).',
                    'DNA-packing: Histonen en nucleosomen.'
                ],
                common_misconceptions: [
                    'Denken dat methylering de DNA-code verandert (alleen de leesbaarheid).',
                    'Verwarring tussen transcriptiefactoren (eiwitten) en promotors (DNA).'
                ]
            }
        ]
    }
];

export const getLearningPath = (subject: string | null, level: string | null): LearningPath | null => {
    if (!subject || !level) return null;
    return CURRICULUM_PATHS.find(p => 
        p.subject.toLowerCase() === subject.toLowerCase() && 
        p.level.toLowerCase().includes(level.toLowerCase())
    ) || null;
};

export const getPrerequisites = (nodeId: string): string[] => {
    for (const path of CURRICULUM_PATHS) {
        const node = path.nodes.find(n => n.id === nodeId);
        if (node && node.prerequisite_ids) {
            return node.prerequisite_ids;
        }
    }
    return [];
};