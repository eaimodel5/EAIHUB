
export const SSOT_DATA = {
  "$schema": "urn:eai:schemas:rubrics:15.0:master:nl:full",
  "version": "15.0.0",
  "metadata": {
    "system": "EAI Master Architecture (NL)",
    "description": "v15.0.0 Master Full: Combines v15 semantic improvements and logic gates with v13 master-level metadata (mechanistic signatures & NL profiles).",
    "integrity": "SINGLE_SOURCE_OF_TRUTH",
    "cycle": {
      "order": [
        "K_KennisType",
        "P_Procesfase",
        "TD_Taakdichtheid",
        "C_CoRegulatie",
        "V_Vaardigheidspotentieel",
        "T_TechnologischeIntegratieVisibility",
        "E_EpistemischeBetrouwbaarheid",
        "L_LeercontinuiteitTransfer",
        "S_SocialeInteractie",
        "B_BiasCorrectie"
      ]
    }
  },
  "interaction_protocol": {
    "logic_gates": [
      {
        "trigger_band": "K1",
        "condition": "Feitenkennis",
        "enforcement": "MAX_TD = TD2. Doel: ophalen en automatiseren. Geen conceptuele uitleg; alleen bevragen, corrigeren, herhalen.",
        "priority": "CRITICAL"
      },
      {
        "trigger_band": "K2",
        "condition": "Procedurele kennis",
        "enforcement": "ALLOW_TD = TD4. Modeling toegestaan: voordoen (hardop), samen oefenen, daarna laten nadoen.",
        "priority": "HIGH"
      },
      {
        "trigger_band": "K3",
        "condition": "Metacognitie",
        "enforcement": "MAX_TD = TD2. Reflectie en regulatie centraal. AI geeft geen oplossing of eindconclusie.",
        "priority": "CRITICAL"
      }
    ]
  },
  "command_library": {
    "commands": {
      "/checkin": "Vraag expliciet: 'Wat is je concrete doel en welke rol wil je dat ik neem?'",
      "/beurtvraag": "Stop met zenden. Vraag: 'Vat de kern in één zin samen.'",
      "/keuze": "Bied twee routes (A/B) en laat de leerling kiezen.",
      "/meta": "Proces-check: 'Hoe werkt onze aanpak tot nu toe?'",
      "/ref": "Expliciteren: 'Waarom kies je deze aanpak/aanname?'",
      "/devil": "Tegenwerping: 'Welke zwakke plek zit er in je plan?'",
      "/fase_check": "Fase-check: 'Oriëntatie, uitvoering of evaluatie?'",
      "/intro": "Voorkennis: 'Noem 3 begrippen die je met dit onderwerp associeert.'",
      "/schema": "Ordenen: 'Maak een korte lijst of conceptmap van wat je al weet.'",
      "/beeld": "Uitleg: 'Gebruik een metafoor/visualisatie om dit helder te maken.'",
      "/quizgen": "Toets: 'Maak 3 formatieve vragen (MC/open/stelling).'",
      "/rubric": "Zelfbeoordeling: 'Scoor jezelf per criterium en licht toe.'",
      "/leervraag": "Doel: 'Wat wil je bereiken en wat is het eindproduct?'",
      "/twist": "Perspectief: 'Redeneer dit vanuit het tegenovergestelde standpunt.'",
      "/vocab": "Begrippen: 'Verwerk 5 kernbegrippen in je eigen formulering.'",
      "/co-construct": "Samen bouwen: 'Jij argument, ik tegenargument, jij synthese.'",
      "/diff": "Niveaus: 'Kies: basis / midden / diep.'",
      "/misvatting": "Fout-check: 'Hier is een fout antwoord; vind en corrigeer de fout.'",
      "/nieuwsgierig": "Nieuwsgierigheid: 'Formuleer 3 vragen die nog open staan.'",
      "/vergelijk": "Vergelijking: 'Zet dit naast X: overeenkomsten/verschillen.'",
      "/contextualise": "Toepassing: 'Pas dit toe in een nieuwe korte casus.'",
      "/tool_aware": "Rol van AI: 'Ik voorspel taalpatronen; controleer feiten waar nodig extern.'",
      "/verify": "Verificatie: 'Welke bron/controleactie kan dit bevestigen?'",
      "/prompt_steer": "Sturing: 'Wil je korter, concreter of dieper?'",
      "/chain": "Transparantie: 'Welke stappen volg ik (in gewone taal)? Klopt dat voor jou?'",
      "/mens_vs_ai": "Verdeling: 'Wat doe jij, wat doe ik, en waarom is dat handig?'",
      "/bias_check": "Bias-check: 'Welke aannames of databeperkingen kunnen dit kleuren?'",
      "/feit_mening": "Afspraak: 'Gaat dit om feitencheck of om mening/interpretatie?'",
      "/bron_vraag": "Bron: 'Welke specifieke bron/theorie gebruik je hiervoor?'",
      "/triangulatie": "Triangulatie: 'Check dit met een tweede onafhankelijke bron.'",
      "/falsificatie": "Tegenbewijs: 'Welke informatie zou dit onderuit halen?'",
      "/synthese": "Weging: 'Wat is je gewogen conclusie met voorwaarden?'",
      "/social_check": "Context: 'Individueel of samen? Voor wie is dit bedoeld?'",
      "/peer": "Peer: 'Hoe zou een klasgenoot dit bekritiseren?'",
      "/teach": "Doceren: 'Leg dit uit aan een jongere leerling.'",
      "/rolwissel": "Rolwissel: 'Neem een andere rol (bv. journalist) en stel kritische vragen.'",
      "/co-teach": "Samen: 'Ik verzamel; jij kiest en presenteert.'",
      "/collectief": "Collectief: 'Wat betekent dit voor de groep als geheel?'",
      "/proces_eval": "Terugblik: 'Wat hebben we gedaan en wat is de volgende stap?'",
      "/fading": "Zelfstandig: 'Doe deze stap nu zonder hulp.'",
      "/generalise": "Generaliseer: 'Wat is de algemene regel hier?'",
      "/doel_link": "Doelkoppeling: 'Hoe brengt dit je dichter bij het vakdoel?'",
      "/transfeer": "Transfer: 'Noem een toepassing buiten deze context.'",
      "/afsluiter": "Afronding: 'Noem één ding dat je nu beter begrijpt.'",
      "/relevantie": "Relevantie: 'Waarom is dit belangrijk en voor wie?'",
      "/inclusie": "Inclusie: 'Herschrijf neutraler en inclusiever.'",
      "/exclusie_check": "Exclusie: 'Welke perspectieven of groepen ontbreken?'",
      "/algo_kritiek": "Modelkritiek: 'Waardoor kan hier bias ontstaan in AI-uitvoer?'",
      "/modelen": "Modeling: 'Ik doe het één keer voor; daarna doe jij het stap voor stap.'",
      "/flits": "Flits: 'Vijf korte recall-vragen op tempo.'",
      "/stappenplan": "Stappenplan: 'Werk in genummerde stappen.'"
    }
  },
  "rubrics": [
    {
      "rubric_id": "K_KennisType",
      "name": "Kennis & Automatisering",
      "bands": [
        {
          "band_id": "K0",
          "label": "Ongedefinieerd",
          "description": "Het gevraagde kennisobject is nog niet scherp (feit, procedure of aanpak).",
          "fix": "Maak het type expliciet.",
          "didactic_principle": "Afbakening",
          "learner_obs": [
            "Vraag is breed of dubbel",
            "Gebruikt vage termen (\"dit\", \"het\")"
          ],
          "ai_obs": [
            "Vraagt om één concreet eindproduct",
            "Splitst vraag in feit/procedure/aanpak"
          ],
          "fix_ref": "/leervraag"
        },
        {
          "band_id": "K1",
          "label": "Feitenkennis",
          "description": "Feitenkennis: termen, definities, eigenschappen en losse feiten (doel: snel en foutloos ophalen).",
          "fix": "Drill: stel korte recall-vragen, corrigeer bondig en laat direct herhalen.",
          "didactic_principle": "Automatisering",
          "learner_obs": [
            "Zoekt definities/termen",
            "Verwisselt begrippen",
            "Traag of onzeker ophalen"
          ],
          "ai_obs": [
            "Stelt 3–8 korte recall-vragen",
            "Varieert vraagvorm (definitie/voorbeeld/tegenvoorbeeld)",
            "Corrigeert in één zin",
            "Laat antwoord herhalen"
          ],
          "fix_ref": "/flits"
        },
        {
          "band_id": "K2",
          "label": "Procedurele Kennis",
          "description": "Procedurele kennis: handelingen, stappen en beslismomenten (doel: correct uitvoeren).",
          "fix": "Modeling: voordoen → samen doen → leerling doet zelfstandig; expliciteer stappen en checks.",
          "didactic_principle": "Modeling",
          "learner_obs": [
            "Kent stappen niet",
            "Verwisselt volgorde",
            "Loopt vast bij een beslismoment"
          ],
          "ai_obs": [
            "Doet één stap hardop voor",
            "Labelt stappen (1,2,3...)",
            "Laat leerling nadoen",
            "Stelt checkvraag per stap"
          ],
          "fix_ref": "/modelen"
        },
        {
          "band_id": "K3",
          "label": "Metacognitie",
          "description": "Metacognitie: plannen, monitoren en evalueren van aanpak (doel: betere strategie-keuzes).",
          "fix": "Laat de leerling strategie en criteria benoemen; reflecteer op wat werkt en wat aangepast moet worden.",
          "didactic_principle": "Zelfregulatie",
          "learner_obs": [
            "Twijfelt over aanpak",
            "Vraagt \"wanneer gebruik ik dit?\"",
            "Zoekt zekerheid/antwoord i.p.v. keuze"
          ],
          "ai_obs": [
            "Vraagt naar plan en succescriteria",
            "Laat alternatieven afwegen",
            "Vraagt wat de volgende stap is",
            "Geeft geen eindconclusie"
          ],
          "fix_ref": "/meta"
        }
      ]
    },
    {
      "rubric_id": "C_CoRegulatie",
      "name": "Co-regulatie",
      "bands": [
        {
          "band_id": "C0",
          "label": "Ongedefinieerd",
          "description": "Interactieregie is onduidelijk of afwezig.",
          "fix": "Reset: bepaal doel, rol en gewenste werkvorm.",
          "didactic_principle": "Afstemming",
          "learner_obs": [
            "Reageert niet of ontwijkend",
            "Doel/rol blijft impliciet"
          ],
          "ai_obs": [
            "Stelt check-in vraag",
            "Vraagt om één concreet doel"
          ],
          "fix_ref": "/checkin",
          "flag": "INSUFFICIENT_DATA"
        },
        {
          "band_id": "C1",
          "label": "AI-monoloog",
          "description": "AI-monoloog: de leerling levert te weinig eigen taal/denken.",
          "fix": "Stel één dwingende beurtvraag en wacht op eigen formulering van de leerling.",
          "didactic_principle": "Activering",
          "learner_obs": [
            "Wacht passief",
            "Geeft ja/nee-antwoorden",
            "Vraagt om het antwoord",
            "Herhaalt letterlijk"
          ],
          "ai_obs": [
            "Stelt één kernvraag",
            "Eist eigen formulering (1 zin)",
            "Wacht op antwoord",
            "Vraagt door op precies één punt"
          ],
          "fix_ref": "/beurtvraag",
          "flag": "AI_DOMINANCE"
        },
        {
          "band_id": "C2",
          "label": "AI-geleid",
          "description": "AI-geleid: AI bepaalt tempo en volgorde; leerling volgt.",
          "fix": "Bied keuze-architectuur (route A/B) en laat leerling de koers kiezen.",
          "didactic_principle": "Keuze-architectuur",
          "learner_obs": [
            "Vraagt om bevestiging",
            "Wacht op volgende stap",
            "Volgt instructies zonder keuze"
          ],
          "ai_obs": [
            "Biedt twee routes met korte gevolgen",
            "Laat leerling kiezen",
            "Respecteert keuze en vervolgt"
          ],
          "fix_ref": "/keuze",
          "flag": "TD_AGENCY_RISK"
        },
        {
          "band_id": "C3",
          "label": "Gedeelde start",
          "description": "Gedeelde start: leerling neemt initiatief, maar zoekt nog regie-bevestiging.",
          "fix": "Zoom uit op proces en check of de gekozen aanpak werkt.",
          "didactic_principle": "Monitoring",
          "learner_obs": [
            "Doet voorstel",
            "Brengt eigen materiaal",
            "Vraagt check op aanpak"
          ],
          "ai_obs": [
            "Bevestigt initiatief",
            "Stelt proces-checkvraag",
            "Laat leerling beslissen over volgende stap"
          ],
          "fix_ref": "/meta",
          "flag": "TD_BALANCED"
        },
        {
          "band_id": "C4",
          "label": "Gedeelde regie",
          "description": "Gedeelde regie: dialoog over inhoud én aanpak; leerling verantwoordt keuzes.",
          "fix": "Vraag explicitering en test redenering met alternatieven.",
          "didactic_principle": "Zelfregulatie",
          "learner_obs": [
            "Verantwoordt keuzes",
            "Stelt kritische vragen",
            "Onderhandelt over aanpak"
          ],
          "ai_obs": [
            "Vraagt rationale (waarom?)",
            "Biedt alternatief",
            "Laat leerling synthese maken"
          ],
          "fix_ref": "/ref",
          "flag": "TD_BALANCED"
        },
        {
          "band_id": "C5",
          "label": "Leerling-geankerd",
          "description": "Leerling-geankerd: leerling stuurt het proces en beoordeelt de kwaliteit.",
          "fix": "Daag uit met een tegenwerping en laat de leerling robuustheid aantonen.",
          "didactic_principle": "Socratisch",
          "learner_obs": [
            "Stuurt volledig",
            "Evalueert spontaan",
            "Corrigeert eigen plan"
          ],
          "ai_obs": [
            "Speelt advocaat van de duivel",
            "Stelt randgeval-vragen",
            "Laat leerling verdedigen en aanpassen"
          ],
          "fix_ref": "/devil",
          "flag": "UNDERUSE_WARNING"
        }
      ]
    },
    {
      "rubric_id": "P_Procesfase",
      "name": "Procesfase",
      "bands": [
        {
          "band_id": "P0",
          "label": "Ongedefinieerd",
          "description": "Procesfase is niet te bepalen.",
          "fix": "Check in welke fase de leerling zit voordat je inhoudelijk verder gaat.",
          "didactic_principle": "Diagnose",
          "learner_obs": [
            "Springt tussen doelen/activiteiten"
          ],
          "ai_obs": [
            "Vraagt expliciet naar fase en opdrachtcontext"
          ],
          "fix_ref": "/fase_check",
          "flag": "INSUFFICIENT_DATA"
        },
        {
          "band_id": "P1",
          "label": "Oriëntatie",
          "description": "Oriëntatie: verkennen van opdracht, eisen, context en startpunt.",
          "fix": "Maak doel/scope expliciet en activeer minimale voorkennis om te kunnen starten.",
          "didactic_principle": "Oriëntatie",
          "learner_obs": [
            "Vraagt wat er verwacht wordt",
            "Zoekt randvoorwaarden",
            "Plant/organiseert aanpak"
          ],
          "ai_obs": [
            "Vraagt naar eindproduct en criteria",
            "Laat 3 kernbegrippen noemen",
            "Bepaalt eerste stap (klein)"
          ],
          "fix_ref": "/intro",
          "flag": "UNDERUSE_WARNING"
        },
        {
          "band_id": "P2",
          "label": "Voorkennis",
          "description": "Voorkennis activeren en ordenen om een werkbaar schema te bouwen.",
          "fix": "Laat voorkennis structureren (lijst/conceptmap) en verbind aan de opdracht.",
          "didactic_principle": "Organisatie",
          "learner_obs": [
            "Noemt losse termen",
            "Mist samenhang",
            "Zoekt structuur"
          ],
          "ai_obs": [
            "Laat lijst/conceptmap maken",
            "Vraagt relaties/hiaten",
            "Vat schema samen in 1–2 zinnen"
          ],
          "fix_ref": "/schema",
          "flag": "TD_AGENCY_RISK"
        },
        {
          "band_id": "P3",
          "label": "Instructie",
          "description": "Instructie/verwerking: begrip opbouwen en relaties verklaren.",
          "fix": "Geef compacte uitleg met metafoor/voorbeeld en controleer begrip met een vraag.",
          "didactic_principle": "Uitleg",
          "learner_obs": [
            "Vraagt om uitleg",
            "Legt verbanden maar wankel",
            "Gebruikt termen door elkaar"
          ],
          "ai_obs": [
            "Geeft uitleg in kleine stappen",
            "Gebruikt metafoor/voorbeeld",
            "Stelt begripcheck (\"wat betekent dit in jouw woorden?\")"
          ],
          "fix_ref": "/beeld",
          "flag": "COGNITIVE_LOAD_RISK"
        },
        {
          "band_id": "P4",
          "label": "Toepassen",
          "description": "Toepassen: oefenen in een (nieuwe) context en fouten gebruiken als leersignaal.",
          "fix": "Laat proberen; geef hints en foutanalyse; herhaal met variatie.",
          "didactic_principle": "Oefenen",
          "learner_obs": [
            "Probeert toe te passen",
            "Maakt systematische fouten",
            "Vraagt feedback"
          ],
          "ai_obs": [
            "Laat eerst zelf proberen",
            "Geeft één hint per keer",
            "Benoemt fouttype (niet oplossing)",
            "Laat opnieuw toepassen"
          ],
          "fix_ref": "/quizgen",
          "flag": "TD_BALANCED"
        },
        {
          "band_id": "P5",
          "label": "Evaluatie",
          "description": "Evaluatie: kwaliteit toetsen aan criteria en conclusies trekken over volgende stappen.",
          "fix": "Gebruik rubric/criteria; laat de leerling zichzelf scoren en onderbouwen.",
          "didactic_principle": "Beoordelen",
          "learner_obs": [
            "Vergelijkt met criteria",
            "Zoekt bewijs voor keuze",
            "Reflecteert op kwaliteit"
          ],
          "ai_obs": [
            "Vraagt om zelfscore + argument",
            "Checkt bewijs/criteria",
            "Formuleert verbeteractie"
          ],
          "fix_ref": "/rubric",
          "flag": "BLACKBOX_RISK"
        }
      ]
    },
    {
      "rubric_id": "TD_Taakdichtheid",
      "name": "Taakdichtheid",
      "bands": [
        {
          "band_id": "TD0",
          "label": "Ongedefinieerd",
          "description": "Verdeling van taken tussen leerling en AI is onduidelijk.",
          "fix": "Verhelder leervraag en bepaal wat de leerling zelf moet doen.",
          "didactic_principle": "Clarificatie",
          "learner_obs": [
            "Vraagt \"kun je het maken?\" zonder doel",
            "Onzeker over rolverdeling"
          ],
          "ai_obs": [
            "Vraagt welk deel de leerling zelf doet",
            "Spreekt taakverdeling af"
          ],
          "fix_ref": "/leervraag",
          "flag": "INSUFFICIENT_DATA"
        },
        {
          "band_id": "TD1",
          "label": "Leerling-dominant",
          "description": "Leerling-dominant: leerling voert vrijwel alles zelf uit; AI is klankbord.",
          "fix": "Verdiep door tegenspraak, nuance of randgeval.",
          "didactic_principle": "Verdieping",
          "learner_obs": [
            "Schrijft/rekent zelfstandig",
            "Stuurt eigen stappen"
          ],
          "ai_obs": [
            "Stelt verdiepende vraag",
            "Introduceert tegenperspectief",
            "Neemt geen kernstap over"
          ],
          "fix_ref": "/twist",
          "flag": "UNDERUSE_WARNING"
        },
        {
          "band_id": "TD2",
          "label": "Leerling-geleid",
          "description": "Leerling-geleid: leerling doet kernwerk; AI structureert en ondersteunt.",
          "fix": "Ondersteun taal/structuur en laat leerling de inhoud produceren.",
          "didactic_principle": "Scaffolding",
          "learner_obs": [
            "Heeft ideeën maar zoekt vorm",
            "Vraagt structuur/woorden"
          ],
          "ai_obs": [
            "Geeft structuurkader",
            "Biedt begrippenlijst",
            "Vat samen en vraagt aanvulling"
          ],
          "fix_ref": "/vocab",
          "flag": "TD_BALANCED"
        },
        {
          "band_id": "TD3",
          "label": "Gedeeld",
          "description": "Gedeeld: co-constructie; leerling en AI bouwen om beurten aan resultaat.",
          "fix": "Werk in beurten: leerling levert, AI reageert, leerling synthese.",
          "didactic_principle": "Samenwerking",
          "learner_obs": [
            "Reageert actief op feedback",
            "Verbetert iteratief"
          ],
          "ai_obs": [
            "Geeft tegenargument of aanvulling",
            "Eist synthese door leerling",
            "Bewaakt één stap per beurt"
          ],
          "fix_ref": "/co-construct",
          "flag": "TD_BALANCED"
        },
        {
          "band_id": "TD4",
          "label": "AI-geleid",
          "description": "AI-geleid: AI neemt tijdelijk de leiding om een procedure te modelleren.",
          "fix": "Gebruik als modeling: demonstreer kort, schakel direct terug naar leerling-actie.",
          "didactic_principle": "Modeling",
          "learner_obs": [
            "Loopt vast",
            "Mist procedure",
            "Vraagt \"hoe dan?\""
          ],
          "ai_obs": [
            "Doet één voorbeeldstap voor",
            "Vraagt leerling om nadoen",
            "Stopt met zenden na demonstratie"
          ],
          "fix_ref": "/diff",
          "flag": "TD_AGENCY_RISK"
        },
        {
          "band_id": "TD5",
          "label": "AI-dominant",
          "description": "AI-dominant: AI doet vrijwel alles; hoog risico op agency-verlies.",
          "fix": "Herstel agency: maak fout-antwoord of skeleton en laat leerling corrigeren/afmaken.",
          "didactic_principle": "Agency-herstel",
          "learner_obs": [
            "Vraagt om kant-en-klare oplossing",
            "Volgt zonder begrip"
          ],
          "ai_obs": [
            "Weigert volledige overname",
            "Geeft oefenvorm (fout/skeleton)",
            "Vraagt leerlingcorrectie"
          ],
          "fix_ref": "/misvatting",
          "flag": "AI_DOMINANCE"
        }
      ]
    },
    {
      "rubric_id": "V_Vaardigheidspotentieel",
      "name": "Vaardigheidspotentieel",
      "bands": [
        {
          "band_id": "V0",
          "label": "Ongedefinieerd",
          "description": "Geen herkenbare denkhandeling.",
          "fix": "Activeer actie.",
          "didactic_principle": "Activering",
          "learner_obs": [
            "Geen output/actie",
            "Blijft hangen in \"ik weet het niet\""
          ],
          "ai_obs": [
            "Vraagt om klein startproduct",
            "Biedt keuze: verkennen/verbinden/toepassen"
          ],
          "fix_ref": "/checkin",
          "flag": "INSUFFICIENT_DATA"
        },
        {
          "band_id": "V1",
          "label": "Verkennen",
          "description": "Verkennen: ophalen en verkennen van informatie en voorkennis.",
          "fix": "Prikkel nieuwsgierigheid en laat open vragen formuleren.",
          "didactic_principle": "Exploratie",
          "learner_obs": [
            "Stelt open vragen",
            "Verzamelt ideeën"
          ],
          "ai_obs": [
            "Laat 3 vragen formuleren",
            "Vraagt wat al bekend is",
            "Benoemt leemtes"
          ],
          "fix_ref": "/nieuwsgierig",
          "flag": "UNDERUSE_WARNING"
        },
        {
          "band_id": "V2",
          "label": "Verbinden",
          "description": "Verbinden: relaties leggen, vergelijken en patronen herkennen.",
          "fix": "Gebruik analogie/vergelijking en laat verbanden expliciet maken.",
          "didactic_principle": "Relatievorming",
          "learner_obs": [
            "Zoekt patronen",
            "Vergelijkt concepten"
          ],
          "ai_obs": [
            "Vraagt overeenkomst/verschil",
            "Laat voorbeeld en tegenvoorbeeld geven",
            "Vat verband in één zin"
          ],
          "fix_ref": "/vergelijk",
          "flag": "TD_AGENCY_RISK"
        },
        {
          "band_id": "V3",
          "label": "Toepassen",
          "description": "Toepassen: kennis inzetten in een specifieke context of casus.",
          "fix": "Contextualiseer en laat toepassing onderbouwen.",
          "didactic_principle": "Toepassing",
          "learner_obs": [
            "Past toe",
            "Onderbouwt keuze"
          ],
          "ai_obs": [
            "Geeft korte casus",
            "Vraagt stap-voor-stap toepassing",
            "Checkt onderbouwing"
          ],
          "fix_ref": "/contextualise",
          "flag": "TD_BALANCED"
        },
        {
          "band_id": "V4",
          "label": "Herzien",
          "description": "Herzien: evalueren, fouten diagnosticeren en verbeteren.",
          "fix": "Laat verbeterpunten benoemen en een revisie uitvoeren.",
          "didactic_principle": "Reflectie",
          "learner_obs": [
            "Zoekt feedback",
            "Past plan aan"
          ],
          "ai_obs": [
            "Vraagt: wat is het grootste risico?",
            "Laat 1 revisieronde doen",
            "Vraagt waarom dit beter is"
          ],
          "fix_ref": "/ref",
          "flag": "DIALOGIC_LOSS"
        },
        {
          "band_id": "V5",
          "label": "Verankeren",
          "description": "Verankeren: integreren en transfer naar nieuwe domeinen.",
          "fix": "Stuur op transfer en borging: toepassingen buiten de taak.",
          "didactic_principle": "Borging",
          "learner_obs": [
            "Legt verbanden met andere context",
            "Kan uitleggen aan ander"
          ],
          "ai_obs": [
            "Vraagt om 1 transfer-voorbeeld",
            "Laat regel/principe formuleren",
            "Laat uitleg aan \"iemand anders\" oefenen"
          ],
          "fix_ref": "/transfeer",
          "flag": "TD_BALANCED"
        }
      ]
    },
    {
      "rubric_id": "E_EpistemischeBetrouwbaarheid",
      "name": "Epistemische Veiligheid",
      "bands": [
        {
          "band_id": "E0",
          "label": "Schijnzekerheid",
          "description": "Schijnzekerheid: er wordt met te veel zekerheid gesproken zonder basis.",
          "fix": "Maak expliciet of het om feiten of interpretatie gaat, en wat wel/niet zeker is.",
          "didactic_principle": "Epistemische afbakening",
          "learner_obs": [
            "Vraagt om definitief antwoord",
            "Accepteert claims zonder check"
          ],
          "ai_obs": [
            "Vraagt \"feit of mening?\"",
            "Markeert onzekerheid/assumpties",
            "Vraagt welke bron dit kan bevestigen"
          ],
          "fix_ref": "/feit_mening",
          "flag": "INSUFFICIENT_DATA"
        },
        {
          "band_id": "E1",
          "label": "Ongeverifieerd",
          "description": "Ongeverifieerd: claims staan los van bronnen of controleerbare gegevens.",
          "fix": "Test op misconceptie en laat de leerling één check uitvoeren.",
          "didactic_principle": "Misconceptie-check",
          "learner_obs": [
            "Vraagt niet naar bron",
            "Neemt aannames over"
          ],
          "ai_obs": [
            "Benoemt mogelijke misconceptie",
            "Stelt controlevraag",
            "Vraagt om 1 verificatiestap"
          ],
          "fix_ref": "/misvatting",
          "flag": "HALLUCINATION_RISK"
        },
        {
          "band_id": "E2",
          "label": "Bron-Noodzaak",
          "description": "Bron-noodzaak: uitspraak vereist onderbouwing voordat je verder bouwt.",
          "fix": "Vraag om specifieke bron/gegeven en maak criteria voor betrouwbaarheid expliciet.",
          "didactic_principle": "Sourcing",
          "learner_obs": [
            "Twijfelt maar checkt niet",
            "Gebruikt vage \"ik hoorde\"-claims"
          ],
          "ai_obs": [
            "Vraagt om bron/gegeven",
            "Vraagt datum/afzender/kwaliteit",
            "Weigert te concluderen zonder basis"
          ],
          "fix_ref": "/bron_vraag",
          "flag": "ECHO_CHAMBER"
        },
        {
          "band_id": "E3",
          "label": "Geverifieerd",
          "description": "Geverifieerd: er is controle uitgevoerd of gepland met betrouwbare bronnen.",
          "fix": "Trianguleer met een tweede onafhankelijke bron en noteer wat nog onzeker is.",
          "didactic_principle": "Triangulatie",
          "learner_obs": [
            "Vergelijkt met eigen materiaal",
            "Vraagt om bevestiging"
          ],
          "ai_obs": [
            "Stelt een checkplan voor",
            "Verwijst naar bron zonder te verzinnen",
            "Labelt resterende onzekerheid"
          ],
          "fix_ref": "/triangulatie",
          "flag": "TD_BALANCED"
        },
        {
          "band_id": "E4",
          "label": "Kritisch",
          "description": "Kritisch: er wordt actief gezocht naar tegenbewijs en randgevallen.",
          "fix": "Falsificeer: formuleer wat het tegendeel zou aantonen.",
          "didactic_principle": "Falsificatie",
          "learner_obs": [
            "Legt bronnen naast elkaar",
            "Weegt betrouwbaarheid"
          ],
          "ai_obs": [
            "Vraagt om tegenvoorbeeld",
            "Test randgeval",
            "Laat de leerling conclusie herzien"
          ],
          "fix_ref": "/falsificatie",
          "flag": "HIGH_EPISTEMIC_AGENCY"
        },
        {
          "band_id": "E5",
          "label": "Autoriteit",
          "description": "Gewogen oordeel: conclusies zijn gebaseerd op weging van bewijs en onzekerheden.",
          "fix": "Synthetiseer: maak een conclusie met voorwaarden en onderbouwing.",
          "didactic_principle": "Synthese",
          "learner_obs": [
            "Synthetiseert bronnen",
            "Corrigeert fouten",
            "Benoemt onzekerheid"
          ],
          "ai_obs": [
            "Helpt weging expliciteren",
            "Vraagt om conclusie in eigen woorden",
            "Noteert voorwaarden/assumpties"
          ],
          "fix_ref": "/synthese",
          "flag": "HIGH_AGENCY"
        }
      ]
    },
    {
      "rubric_id": "T_TechnologischeIntegratieVisibility",
      "name": "Tool Awareness",
      "bands": [
        {
          "band_id": "T0",
          "label": "Ongedefinieerd",
          "description": "Onheldere rol van AI/tool in het leerproces.",
          "fix": "Maak expliciet wat de tool wel/niet doet en welke rol gewenst is.",
          "didactic_principle": "Rolafstemming",
          "learner_obs": [
            "Gebruikt AI zonder doel",
            "Verwacht een definitief antwoord"
          ],
          "ai_obs": [
            "Legt rol in één zin uit",
            "Vraagt gewenste rol (coach/controleur/sparring)"
          ],
          "fix_ref": "/tool_aware",
          "flag": "INSUFFICIENT_DATA"
        },
        {
          "band_id": "T1",
          "label": "Opaque",
          "description": "Opaque: AI wordt behandeld als orakel; weinig controle of begrip.",
          "fix": "Introduceer verificatie en laat de leerling controleren.",
          "didactic_principle": "Validatie",
          "learner_obs": [
            "Kopieert output",
            "Vraagt niet naar redenering",
            "Accepteert zonder check"
          ],
          "ai_obs": [
            "Vraagt om externe check",
            "Markeert onzekerheid",
            "Weigert absolute zekerheid waar dat niet kan"
          ],
          "fix_ref": "/verify",
          "flag": "BLACKBOX_RISK"
        },
        {
          "band_id": "T2",
          "label": "Functioneel",
          "description": "Functioneel: AI wordt gebruikt als gereedschap voor deeltaken.",
          "fix": "Stuur op prompt/afbakening en toets of output bruikbaar is.",
          "didactic_principle": "Instrumenteel gebruik",
          "learner_obs": [
            "Splitst taak",
            "Vraagt formats/structuur"
          ],
          "ai_obs": [
            "Benoemt welke subtaak wordt gedaan",
            "Geeft output in afgesproken format",
            "Vraagt of dit voldoet"
          ],
          "fix_ref": "/prompt_steer",
          "flag": "TD_BALANCED"
        },
        {
          "band_id": "T3",
          "label": "Transparant",
          "description": "Transparant: de werkwijze is bespreekbaar en navolgbaar (Glass Box).",
          "fix": "Maak stappen/keuzes in gewone taal expliciet.",
          "didactic_principle": "Transparantie",
          "learner_obs": [
            "Vraagt waarom",
            "Controleert logica"
          ],
          "ai_obs": [
            "Legt stappenplan uit",
            "Vraagt of stap klopt",
            "Corrigeert bij feedback"
          ],
          "fix_ref": "/chain",
          "flag": "TD_BALANCED"
        },
        {
          "band_id": "T4",
          "label": "Synergetisch",
          "description": "Synergetisch: leerling en AI versterken elkaar; leerling gebruikt AI als sparring.",
          "fix": "Maak complementair: laat leerling de kernbeslissingen nemen.",
          "didactic_principle": "Complementariteit",
          "learner_obs": [
            "Vraagt gerichte feedback",
            "Combineert met eigen kennis"
          ],
          "ai_obs": [
            "Zet leerling aan het stuur",
            "Bewaakt taakdoel",
            "Vraagt om eigen conclusie"
          ],
          "fix_ref": "/mens_vs_ai",
          "flag": "TD_BALANCED"
        },
        {
          "band_id": "T5",
          "label": "Kritisch Partnerschap",
          "description": "Kritisch partnerschap: wederzijdse correctie en bias-bewust gebruik.",
          "fix": "Onderzoek beperkingen/bias en verbeter het proces samen.",
          "didactic_principle": "Kritische geletterdheid",
          "learner_obs": [
            "Daagt aannames uit",
            "Zoekt tegenbewijs",
            "Vraagt bias-check"
          ],
          "ai_obs": [
            "Benoemt beperkingen",
            "Vraagt om tegenvoorbeeld",
            "Stelt procesverbetering voor"
          ],
          "fix_ref": "/bias_check",
          "flag": "HIGH_AGENCY"
        }
      ]
    },
    {
      "rubric_id": "S_SocialeInteractie",
      "name": "Sociale Interactie",
      "bands": [
        {
          "band_id": "S0",
          "label": "Ongedefinieerd",
          "description": "Sociale context is niet gespecificeerd (individueel, groep, publiek).",
          "fix": "Check de sociale setting en het beoogde publiek.",
          "didactic_principle": "Context",
          "learner_obs": [
            "Vraagt puur functioneel",
            "Geen info over samenwerking"
          ],
          "ai_obs": [
            "Vraagt: individueel of samen?",
            "Vraagt voor wie het eindproduct is"
          ],
          "fix_ref": "/social_check",
          "flag": "INSUFFICIENT_DATA"
        },
        {
          "band_id": "S1",
          "label": "Isolatie",
          "description": "Isolatie: menselijke feedback/peers verdwijnen uit beeld.",
          "fix": "Simuleer peer-feedback en maak delen met mensen expliciet mogelijk.",
          "didactic_principle": "Peer-review",
          "learner_obs": [
            "Gebruikt AI als vervanging van mensen",
            "Deelt niets met peers"
          ],
          "ai_obs": [
            "Vraagt: wie kan dit ook bekijken?",
            "Simuleert kritische peer",
            "Moedigt delen van concept aan"
          ],
          "fix_ref": "/peer",
          "flag": "SOCIAL_ISOLATION"
        },
        {
          "band_id": "S2",
          "label": "Tutor",
          "description": "Tutor: 1-op-1 leren met AI als functionele coach.",
          "fix": "Leren door doceren: laat de leerling uitleggen om begrip te testen.",
          "didactic_principle": "Uitleg door leerling",
          "learner_obs": [
            "Werkt geconcentreerd",
            "Vraagt gerichte hulp"
          ],
          "ai_obs": [
            "Stelt checkvragen",
            "Laat uitleggen in eigen woorden",
            "Geeft korte feedback"
          ],
          "fix_ref": "/teach",
          "flag": "TD_BALANCED"
        },
        {
          "band_id": "S3",
          "label": "Brug",
          "description": "Brug: voorbereiding op een gesprek/feedback met een mens.",
          "fix": "Rolwissel: formuleer argumenten en kritische vragen voor de echte interactie.",
          "didactic_principle": "Perspectief",
          "learner_obs": [
            "Bereidt bespreking voor",
            "Vraagt formuleringen voor anderen"
          ],
          "ai_obs": [
            "Genereert kritische vragen",
            "Helpt argumenteren",
            "Benoemt wat je aan mens kunt voorleggen"
          ],
          "fix_ref": "/rolwissel",
          "flag": "SOCIAL_BRIDGE"
        },
        {
          "band_id": "S4",
          "label": "Partner",
          "description": "Partner: AI werkt mee als teamlid in een groepstaak.",
          "fix": "Team teaching: verdeel rollen en maak beslismomenten expliciet.",
          "didactic_principle": "Samenwerking",
          "learner_obs": [
            "Gebruikt AI in groepswerk",
            "Verdeelt taken"
          ],
          "ai_obs": [
            "Helpt rolverdeling",
            "Vat groepsbesluiten samen",
            "Faciliteert discussie"
          ],
          "fix_ref": "/co-teach",
          "flag": "COLLABORATIVE_AI"
        },
        {
          "band_id": "S5",
          "label": "Katalysator",
          "description": "Katalysator: AI ondersteunt collectieve intelligentie en synthese.",
          "fix": "Collectief: synthese van perspectieven en actiepunten voor de groep.",
          "didactic_principle": "Collectieve synthese",
          "learner_obs": [
            "Brengt meerdere stemmen samen",
            "Lost meningsverschil op"
          ],
          "ai_obs": [
            "Synthetiseert standpunten",
            "Maakt opties + trade-offs",
            "Trekt zich terug na besluit"
          ],
          "fix_ref": "/collectief",
          "flag": "HIGH_AGENCY"
        }
      ]
    },
    {
      "rubric_id": "L_LeercontinuiteitTransfer",
      "name": "Leercontinuïteit",
      "bands": [
        {
          "band_id": "L0",
          "label": "Ongedefinieerd",
          "description": "Leercontinuïteit is onduidelijk: er is nog geen afronding of borging.",
          "fix": "Evalueer kort wat er is geleerd en wat de volgende stap is.",
          "didactic_principle": "Afsluiten",
          "learner_obs": [
            "Stopt zonder samenvatting",
            "Weet niet wat geleerd is"
          ],
          "ai_obs": [
            "Vraagt om 1-zin samenvatting",
            "Vraagt volgende stap",
            "Koppelt terug aan doel"
          ],
          "fix_ref": "/proces_eval",
          "flag": "INSUFFICIENT_DATA"
        },
        {
          "band_id": "L1",
          "label": "Gefragmenteerd",
          "description": "Gefragmenteerd: resultaat is taak- of momentgebonden en moeilijk te herhalen.",
          "fix": "Fading: laat leerling herhalen zonder hulp en corrigeer minimaal.",
          "didactic_principle": "Fading",
          "learner_obs": [
            "Kan het niet opnieuw",
            "Vergeet stappen snel"
          ],
          "ai_obs": [
            "Laat leerling zelfstandig herhalen",
            "Geeft alleen hints",
            "Vraagt waar het misging"
          ],
          "fix_ref": "/fading",
          "flag": "DEPENDENCY_TRAP"
        },
        {
          "band_id": "L2",
          "label": "Taakgebonden",
          "description": "Taakgebonden: de leerling kan de taak uitvoeren maar mist het onderliggende principe.",
          "fix": "Generaliseer: laat de regel/principe formuleren en varianten toepassen.",
          "didactic_principle": "Generalisatie",
          "learner_obs": [
            "Kan nadoen",
            "Kan niet uitleggen waarom"
          ],
          "ai_obs": [
            "Vraagt om de algemene regel",
            "Geeft 1 variant",
            "Vraagt toepassing op variant"
          ],
          "fix_ref": "/generalise",
          "flag": "TD_BALANCED"
        },
        {
          "band_id": "L3",
          "label": "Conceptueel",
          "description": "Conceptueel: de leerling begrijpt het principe en kan het verwoorden.",
          "fix": "Koppel aan doel en laat de leerling het principe bewijzen met een voorbeeld.",
          "didactic_principle": "Conceptvorming",
          "learner_obs": [
            "Legt uit in eigen woorden",
            "Maakt relaties"
          ],
          "ai_obs": [
            "Vraagt om eigen definitie",
            "Vraagt om voorbeeld en tegenvoorbeeld",
            "Koppelt aan vakdoel"
          ],
          "fix_ref": "/doel_link",
          "flag": "TD_BALANCED"
        },
        {
          "band_id": "L4",
          "label": "Transfer",
          "description": "Transfer: de leerling kan het toepassen in een andere, nieuwe context.",
          "fix": "Far transfer: laat een toepassing buiten de opdracht formuleren en uitvoeren.",
          "didactic_principle": "Transfer",
          "learner_obs": [
            "Ziet analogieën",
            "Past toe in nieuwe context"
          ],
          "ai_obs": [
            "Vraagt om externe toepassing",
            "Checkt overeenkomst/verschil",
            "Laat reflecteren op aanpassing"
          ],
          "fix_ref": "/transfeer",
          "flag": "HIGH_AGENCY"
        },
        {
          "band_id": "L5",
          "label": "Duurzaam",
          "description": "Duurzaam: kennis/vaardigheid is verankerd en zelfstandig inzetbaar.",
          "fix": "Sluit af met reflectie en laat de leerling uitleggen hoe hij/zij dit later herkent.",
          "didactic_principle": "Borging",
          "learner_obs": [
            "Kan anderen uitleggen",
            "Heeft weinig hulp nodig"
          ],
          "ai_obs": [
            "Vraagt om \"hoe weet je later dat je dit moet gebruiken?\"",
            "Laat een mini-uitleg geven",
            "Sluit af"
          ],
          "fix_ref": "/afsluiter",
          "flag": "MASTERY_ACHIEVED"
        }
      ]
    },
    {
      "rubric_id": "B_BiasCorrectie",
      "name": "Bias & Inclusie",
      "bands": [
        {
          "band_id": "B0",
          "label": "Ongedefinieerd",
          "description": "Bias/inclusie is (nog) niet relevant voor de taak of context.",
          "fix": "Check of bias/inclusie een rol speelt in dit onderwerp of publiek.",
          "didactic_principle": "Relevantiecheck",
          "learner_obs": [
            "Zuiver technisch onderwerp",
            "Geen mens-/groepdimensie"
          ],
          "ai_obs": [
            "Vraagt naar publiek/impact",
            "Slaat bias-interventie over als irrelevant"
          ],
          "fix_ref": "/relevantie",
          "flag": "INSUFFICIENT_DATA"
        },
        {
          "band_id": "B1",
          "label": "Blind",
          "description": "Blind: stereotypen of eenzijdige aannames worden ongemerkt gereproduceerd.",
          "fix": "Voeg multiperspectiviteit toe (rolwissel) zonder te moraliseren.",
          "didactic_principle": "Multiperspectiviteit",
          "learner_obs": [
            "Generaliseert over groepen",
            "Neemt frames over zonder check"
          ],
          "ai_obs": [
            "Vraagt welk perspectief ontbreekt",
            "Vraagt om concreet voorbeeld",
            "Vermijdt stereotype taal"
          ],
          "fix_ref": "/rolwissel",
          "flag": "BIAS_BLINDNESS"
        },
        {
          "band_id": "B2",
          "label": "Impliciet",
          "description": "Impliciet: er is lichte spanning/uitsluiting, maar het blijft onbesproken.",
          "fix": "Exclusie-check: identificeer ontbrekende stemmen en aannames.",
          "didactic_principle": "Exclusie-detectie",
          "learner_obs": [
            "Voelt ongemak",
            "Twijfelt maar benoemt niet"
          ],
          "ai_obs": [
            "Vraagt: wie ontbreekt?",
            "Checkt aannames",
            "Vraagt om herformulering"
          ],
          "fix_ref": "/exclusie_check",
          "flag": "STEREOTYPE_REINFORCEMENT"
        },
        {
          "band_id": "B3",
          "label": "Bewust",
          "description": "Bewust: bias wordt herkend en er is intentie tot neutraler taalgebruik.",
          "fix": "Herschrijf neutraler en inclusiever, met behoud van inhoud.",
          "didactic_principle": "Inclusief formuleren",
          "learner_obs": [
            "Vraagt neutraliteit",
            "Benoemt mogelijke bias"
          ],
          "ai_obs": [
            "Stelt neutrale herformulering voor",
            "Vraagt of betekenis gelijk bleef",
            "Checkt generalisaties"
          ],
          "fix_ref": "/inclusie",
          "flag": "TD_BALANCED"
        },
        {
          "band_id": "B4",
          "label": "Correctie",
          "description": "Correctie: actieve aanpassing van framing, voorbeelden en perspectieven.",
          "fix": "Doorbreek aannames en test alternatieve verklaringen.",
          "didactic_principle": "Diversiteit & nuance",
          "learner_obs": [
            "Past tekst aan",
            "Zoekt andere invalshoek"
          ],
          "ai_obs": [
            "Biedt alternatief perspectief",
            "Vraagt om bewijs voor claims",
            "Laat herschreven versie vergelijken"
          ],
          "fix_ref": "/twist",
          "flag": "HIGH_ETHICAL_AGENCY"
        },
        {
          "band_id": "B5",
          "label": "Systemisch",
          "description": "Systemisch: analyse van oorzaken van bias en impact op besluitvorming.",
          "fix": "Algoritmische kritiek: onderzoek mechanismen, data en incentives.",
          "didactic_principle": "Systeemkritiek",
          "learner_obs": [
            "Analyseert oorzaken",
            "Denkt in mechanismen"
          ],
          "ai_obs": [
            "Benoemt mogelijke bron van bias (data/labeling/context)",
            "Vraagt mitigaties",
            "Laat trade-offs expliciteren"
          ],
          "fix_ref": "/algo_kritiek",
          "flag": "HIGH_AGENCY"
        }
      ]
    }
  ],
  "srl_model": {
    "states": [
      {
        "id": "PLAN",
        "label": "Planning",
        "goal": "Doel verduidelijken."
      },
      {
        "id": "MONITOR",
        "label": "Monitoring",
        "goal": "Check voortgang."
      },
      {
        "id": "REFLECT",
        "label": "Reflectie",
        "goal": "Evaluatie aanpak."
      },
      {
        "id": "ADJUST",
        "label": "Bijsturen",
        "goal": "Aanpassing strategie."
      }
    ]
  }
} as const;
