/**
 * Wave 7 of Agent Reach-discovered employers.
 *
 * Found with **Agent Reach** by running Exa's `category:company` search across fourteen
 * verticals earlier waves never covered: veterinary & animal health, utility grid & nuclear
 * power, water/waste/environmental, mining & geoscience, satellite & space, drones/UAV,
 * building automation & HVAC, nonprofit & civic tech, wealth & portfolio management,
 * mortgage & lending, ticketing & events, localization & translation, LMS/corporate training,
 * and subscription billing/CPQ.
 *
 * Uniqueness is the point of this wave. Every domain here was checked against the union of
 * (a) every company `recon` has ever probed — resolved *and* unresolved, so a board that
 * already failed is never offered again — and (b) every domain/name already present in the
 * seed list, the candidate files, the shipped fixtures and the generated feed. Job boards,
 * aggregator subdomains and hosted career-page hosts were dropped manually; nothing else in
 * this file has been seen by the pipeline before.
 *
 * The trailing `// N` is Exa's `Active job postings` count at capture time (omitted when Exa
 * returned none). Ground truth is what recon resolves and the full fetch returns.
 *
 * No `provider`/`slug` is declared — `scripts/recon-career-sources.ts` resolves each with the
 * same `discoverJobSource()` the production sync uses, so nothing is trusted until it proves
 * it has a real ATS board.
 */

import type { JobSourceCompany } from '../api/_lib/jobs/types';

export const AGENT_REACH_CANDIDATES_WAVE7: JobSourceCompany[] = [
  { name: "SUEZ", domain: "suez.com" }, // 723
  { name: "Chewy", domain: "chewy.com" }, // 250
  { name: "NextEra Energy Resources", domain: "nexteraenergy.com" }, // 163
  { name: "Huspy", domain: "huspy.com" }, // 111
  { name: "VetEvolve", domain: "vetevolve.com" }, // 103
  { name: "Addepar", domain: "addepar.com" }, // 98
  { name: "Astranis Space Technologies", domain: "astranis.com" }, // 93
  { name: "X-energy", domain: "x-energy.com" }, // 89
  { name: "E-Space", domain: "e-space.com" }, // 82
  { name: "AppDirect", domain: "appdirect.com" }, // 74
  { name: "FNZ", domain: "fnz.com" }, // 67
  { name: "Charles River Development", domain: "crd.com" }, // 55
  { name: "Loft Orbital", domain: "loftorbital.com" }, // 53
  { name: "Valon", domain: "valon.ai" }, // 46
  { name: "Infinity Systems Engineering", domain: "infinity.aero" }, // 44
  { name: "Watershed", domain: "watershed.com" }, // 43
  { name: "Alpha Financial Software", domain: "alphafsw.com" }, // 36
  { name: "InvestCloud, Inc.", domain: "investcloud.com" }, // 31
  { name: "ReOrbit", domain: "reorbit.space" }, // 29
  { name: "Future Group Language Solutions", domain: "f-g.com" }, // 29
  { name: "Acclaro", domain: "acclaro.com" }, // 29
  { name: "Fermi America", domain: "fermiamerica.com" }, // 28
  { name: "PDW", domain: "pdw.ai" }, // 28
  { name: "Gemino - Language Services & Solutions", domain: "gemino.de" }, // 27
  { name: "Orb", domain: "withorb.com" }, // 25
  { name: "Paddle", domain: "paddle.com" }, // 25
  { name: "Vetcove", domain: "vetcove.com" }, // 24
  { name: "MeridianLink", domain: "meridianlink.com" }, // 22
  { name: "WeVote", domain: "wevote.us" }, // 21
  { name: "Advyzon", domain: "advyzon.com" }, // 21
  { name: "Easygenerator", domain: "easygenerator.com" }, // 19
  { name: "Teal Drones", domain: "tealdrones.com" }, // 16
  { name: "Sunbelt Controls", domain: "sunbeltcontrols.com" }, // 16
  { name: "Unify Energy Solutions", domain: "unifytexas.com" }, // 16
  { name: "LearningMate", domain: "learningmate.com" }, // 16
  { name: "IMDEX", domain: "imdex.com" }, // 15
  { name: "Performativ", domain: "performativ.com" }, // 15
  { name: "Croesus", domain: "croesus.com" }, // 14
  { name: "OnTheGoSystems", domain: "onthegosystems.com" }, // 14
  { name: "Translated", domain: "translated.com" }, // 14
  { name: "Litmos", domain: "litmos.com" }, // 14
  { name: "Edvance", domain: "edvance.fr" }, // 12
  { name: "Sedron Technologies", domain: "sedron.com" }, // 12
  { name: "Micromine", domain: "micromine.com" }, // 12
  { name: "Recidiviz", domain: "recidiviz.org" }, // 12
  { name: "KnowledgeCity", domain: "knowledgecity.com" }, // 12
  { name: "Relias", domain: "relias.com" }, // 12
  { name: "LearnUpon", domain: "learnupon.com" }, // 12
  { name: "PetDesk", domain: "petdesk.com" }, // 11
  { name: "Nuclear Promise X", domain: "npxinnovation.ca" }, // 11
  { name: "Skyroot Aerospace", domain: "skyroot.in" }, // 11
  { name: "Sequence", domain: "sequencehq.com" }, // 11
  { name: "National e-Governance Division", domain: "negd.gov.in" }, // 9
  { name: "Lower", domain: "lower.com" }, // 9
  { name: "Fourvenues", domain: "fourvenues.com" }, // 9
  { name: "TodayTix Group (TTG)", domain: "todaytixgroup.com" }, // 9
  { name: "Lupa", domain: "lupapets.com" }, // 8
  { name: "ELIQUO HYDROK", domain: "eliquohydrok.co.uk" }, // 8
  { name: "KPI Mining Solutions", domain: "kpimining.com" }, // 8
  { name: "Civitech", domain: "civitech.io" }, // 8
  { name: "Orenco Systems, Inc.", domain: "orenco.com" }, // 7
  { name: "Elroy Air", domain: "elroyair.com" }, // 7
  { name: "CivicPlus", domain: "civicplus.com" }, // 7
  { name: "JazzX AI", domain: "jazzx.ai" }, // 7
  { name: "vFairs", domain: "vfairs.com" }, // 7
  { name: "Reservix GmbH", domain: "reservix.net" }, // 7
  { name: "SortMyScene", domain: "sortmyscene.com" }, // 7
  { name: "Samara Aerospace", domain: "samaraaerospace.com" }, // 6
  { name: "ADITUS", domain: "aditus.com" }, // 6
  { name: "Epignosis learning technologies", domain: "epignosishq.com" }, // 6
  { name: "Recurly", domain: "recurly.com" }, // 6
  { name: "Phagos", domain: "phagos.com" }, // 5
  { name: "LEICOM AG", domain: "leicom.ch" }, // 5
  { name: "LanguageWire", domain: "languagewire.com" }, // 5
  { name: "Lingsoft", domain: "lingsoft.ai" }, // 5
  { name: "Carley Corporation", domain: "carleycorp.com" }, // 5
  { name: "Lithosquare", domain: "lithosquare.com" }, // 4
  { name: "Argo Space", domain: "argospace.com" }, // 4
  { name: "Ursa Space Systems", domain: "ursaspace.com" }, // 4
  { name: "VisionSpace", domain: "visionspace.com" }, // 4
  { name: "StashAway", domain: "stashaway.com" }, // 4
  { name: "Homeward", domain: "homeward.com" }, // 4
  { name: "Fanz", domain: "fanz.so" }, // 4
  { name: "vetevo", domain: "vetevo.de" }, // 3
  { name: "pivio", domain: "pivio.ai" }, // 3
  { name: "Qatium", domain: "qatium.com" }, // 3
  { name: "Waterworth", domain: "waterworth.net" }, // 3
  { name: "GeologicAI", domain: "geologicai.com" }, // 3
  { name: "Enigma Aerospace", domain: "enigma.aero" }, // 3
  { name: "Flanks", domain: "flanks.io" }, // 3
  { name: "Knock", domain: "knock.com" }, // 3
  { name: "Toppan Digital Language", domain: "toppandigital.com" }, // 3
  { name: "Moodle", domain: "moodle.com" }, // 3
  { name: "Opus Training", domain: "opus.so" }, // 3
  { name: "HydroPoint Data Systems", domain: "hydropoint.com" }, // 2
  { name: "AQUALIS", domain: "aqualisco.com" }, // 2
  { name: "VRIFY", domain: "vrify.com" }, // 2
  { name: "Odysseus Space", domain: "odysseus.space" }, // 2
  { name: "Spacebackend", domain: "spacebackend.com" }, // 2
  { name: "GoodParty.org", domain: "goodparty.org" }, // 2
  { name: "Pave Finance", domain: "pavefinance.com" }, // 2
  { name: "Plutus", domain: "runplutus.com" }, // 2
  { name: "GeoWealth", domain: "geowealth.com" }, // 2
  { name: "U.S. Financial Technology", domain: "usfintech.com" }, // 2
  { name: "Etix", domain: "etix.com" }, // 2
  { name: "Clorian Ticketing", domain: "clorian.com" }, // 2
  { name: "Ludus", domain: "ludus.com" }, // 2
  { name: "Lokalise", domain: "lokalise.com" }, // 2
  { name: "Schoox", domain: "schoox.com" }, // 2
  { name: "ExpertusONE", domain: "expertusone.com" }, // 2
  { name: "CRM PipeRun", domain: "crmpiperun.com" }, // 2
  { name: "VetNow Kenya", domain: "vetnow.com" }, // 1
  { name: "SignalPET", domain: "signalpet.com" }, // 1
  { name: "EIRIS", domain: "eiris.com" }, // 1
  { name: "KCI Engineering Consultants", domain: "kciconsultants.com" }, // 1
  { name: "Sonic Systems", domain: "sonicsystems.com" }, // 1
  { name: "Aquatic Informatics", domain: "aquaticinformatics.com" }, // 1
  { name: "DigitalPaani", domain: "digitalpaani.com" }, // 1
  { name: "Shayp", domain: "shayp.com" }, // 1
  { name: "Climatec, LLC", domain: "climatec.com" }, // 1
  { name: "Envision Financial Systems, Inc.", domain: "enfs.com" }, // 1
  { name: "Sherpas", domain: "sherpaswealth.com" }, // 1
  { name: "Ticketure", domain: "ticketure.com" }, // 1
  { name: "Weglot", domain: "weglot.com" }, // 1
  { name: "Mantra Inc.", domain: "mantra.co.jp" }, // 1
  { name: "NovoEd", domain: "novoed.com" }, // 1
  { name: "Learnosity", domain: "learnosity.com" }, // 1
  { name: "FydoDx", domain: "fydodx.com" },
  { name: "AnyVet", domain: "anyvet.ai" },
  { name: "Vetintelligence", domain: "vetintelligence.nl" },
  { name: "INDICAL BIOSCIENCE", domain: "indical.com" },
  { name: "HapiVet AI", domain: "hapivet.com" },
  { name: "Nest Veterinary", domain: "nestveterinary.com" },
  { name: "Trace First", domain: "tracefirst.com" },
  { name: "Farmvet Systems Ltd", domain: "vetimpress.com" },
  { name: "PreVet", domain: "prevet.se" },
  { name: "VetVise GmbH", domain: "vetvise.com" },
  { name: "Vetlyf Pet Healthcare & Clinic", domain: "vetlyf.com" },
  { name: "GridAxon, Inc.", domain: "gridaxon.io" },
  { name: "Karman", domain: "utilidata.com" },
  { name: "ElectrifiedGrid - A Wonder by Deloitte Business", domain: "electrifiedgrid.com" },
  { name: "Nelumbo Technologies Pvt Ltd", domain: "nelumbo.in" },
  { name: "INS Engineering", domain: "ins-engineering.com" },
  { name: "EnergoNuclear SA", domain: "energonuclear.ro" },
  { name: "Emirates Nuclear Energy Company", domain: "enec.ae" },
  { name: "TealWaters", domain: "tealwaters.com" },
  { name: "Noria", domain: "noriawater.com" },
  { name: "SUEZ Digital Solutions ANZ Limited", domain: "suezsmartsolutions.com" },
  { name: "Eaos", domain: "eaos.ai" },
  { name: "LeakZon", domain: "leakzon.com" },
  { name: "Aquasys", domain: "aquasys.fr" },
  { name: "Dryp", domain: "drypdata.com" },
  { name: "Environmental Services and Water Treatment Company (ESWTCO)", domain: "eswtco.com" },
  { name: "Waterfy", domain: "waterfy.com.br" },
  { name: "AQS by Aliaxis", domain: "aqs-systems.com" },
  { name: "Enviro Infra Engineers Ltd.", domain: "eiel.in" },
  { name: "KORE Geosystems", domain: "koregeosystems.com" },
  { name: "Quminex", domain: "quminex.com" },
  { name: "Geopyora", domain: "geopyora.com" },
  { name: "MinersAI", domain: "minersai.com" },
  { name: "Pacific GeoTech Systems Ltd.", domain: "pacificgeotech.com" },
  { name: "Maptek", domain: "maptek.com" },
  { name: "Masa Geosciences", domain: "joinmasa.ai" },
  { name: "Terranigma Solutions GmbH", domain: "terranigma-solutions.com" },
  { name: "Apeiron", domain: "apeiron.technology" },
  { name: "Durin", domain: "durin.com" },
  { name: "RockSigma", domain: "rocksigma.com" },
  { name: "OKAPI:Orbits", domain: "okapiorbits.space" },
  { name: "SpaceNav", domain: "space-nav.com" },
  { name: "GRAVITON SPACE", domain: "gravitonspace.com" },
  { name: "Constellation Space (YC26)", domain: "constellation.space" },
  { name: "AADYAH Space", domain: "aadyah.com" },
  { name: "Space Individuals", domain: "spaceindividuals.com" },
  { name: "Orbital Sidekick", domain: "orbitalsidekick.com" },
  { name: "Deimos Engenharia", domain: "deimos.pt" },
  { name: "Kawa Space", domain: "kawaspace.com" },
  { name: "Skytex Unmanned Aerial Solutions", domain: "theskytex.com" },
  { name: "VECROS", domain: "vecros.com" },
  { name: "optim.Aero", domain: "optim.aero" },
  { name: "DroneLeaf AI Solutions", domain: "droneleaf.io" },
  { name: "Lycan Aerospace", domain: "lyar.io" },
  { name: "COMRADO Aerospace", domain: "comradoaerospace.com" },
  { name: "REDWING", domain: "redwinglabs.in" },
  { name: "Swarm", domain: "swarm124.com" },
  { name: "Daloft Aerospace Private Limited", domain: "daloftaerospace.in" },
  { name: "Delhivery Robotics", domain: "drl.aero" },
  { name: "Voltair", domain: "voltairlabs.com" },
  { name: "Skeye", domain: "skeye.eu" },
  { name: "Blip Industries", domain: "blipindustries.ai" },
  { name: "NAVRobotec", domain: "navrobotec.com" },
  { name: "Airios", domain: "airios.eu" },
  { name: "Delta Building Automation", domain: "deltaba.com.au" },
  { name: "Synchronous Building Automation", domain: "syncba.com.au" },
  { name: "Building Automation Services", domain: "basllco.com" },
  { name: "Pulse Building Automation", domain: "pulsebas.com" },
  { name: "Smart Building Energies", domain: "smart-building-energies.com" },
  { name: "Smart Building Solutions", domain: "sbs-algeria.com" },
  { name: "SWYCS", domain: "swycs.com" },
  { name: "Green Building Automation", domain: "gbautomation.com" },
  { name: "beyonnex.io", domain: "beyonnex.io" },
  { name: "Automation Integrated", domain: "ai-sys.com" },
  { name: "Building and Industrial Control System (BICSYS)", domain: "bicsys.com" },
  { name: "Open Function (OpenFn)", domain: "openfn.org" },
  { name: "Exygy", domain: "exygy.com" },
  { name: "Code for the Community", domain: "cftc-us.org" },
  { name: "Public Tech Studio", domain: "publictechstudio.com" },
  { name: "Digital Public Works", domain: "digitalpublicworks.org" },
  { name: "Craftsman Technology Group", domain: "craftsmantech.com" },
  { name: "Center for Tech and Civic Life", domain: "techandciviclife.org" },
  { name: "DataMade", domain: "datamade.us" },
  { name: "KarmaSuite", domain: "karmasuitesoftware.com" },
  { name: "CivicReach", domain: "civicreach.ai" },
  { name: "Public Democracy", domain: "publicdemocracy.io" },
  { name: "Impactful", domain: "weareimpactful.org" },
  { name: "Ascendant", domain: "ascendantapp.com" },
  { name: "CODE PDX", domain: "codepdx.org" },
  { name: "Bluenumber", domain: "bluenumber.org" },
  { name: "Stirlingshire", domain: "stirlingshire.com" },
  { name: "Wealthdoor", domain: "wealthdoor.com" },
  { name: "Alloq Portfolio Management", domain: "alloq.com" },
  { name: "Wint Wealth", domain: "wintwealth.com" },
  { name: "Wealthcome", domain: "wealthcome.fr" },
  { name: "KairosWealth", domain: "kairoswealth.com" },
  { name: "Polly", domain: "polly.io" },
  { name: "Bizzy Labs", domain: "bizzylabs.tech" },
  { name: "CoreLogic - FNC", domain: "fncinc.com" },
  { name: "Score. (formerly Acre)", domain: "acresoftware.com" },
  { name: "Homesite Mortgage", domain: "homesitedirect.com" },
  { name: "Lendesk", domain: "lendesk.com" },
  { name: "NextGen", domain: "nextgen.net" },
  { name: "Neat Capital", domain: "neatlabs.com" },
  { name: "Liquid Logics", domain: "liquidlogics.com" },
  { name: "Lodasoft", domain: "lodasoft.com" },
  { name: "Balerion AI", domain: "balerion.ai" },
  { name: "Certain Lending", domain: "certainlending.com" },
  { name: "Artifax Software", domain: "artifax.com" },
  { name: "Stager", domain: "stager.co" },
  { name: "ACME Technologies Inc.", domain: "acmeticketing.com" },
  { name: "Red61", domain: "red61.com" },
  { name: "Optimal Ticketing", domain: "optimalticketing.com" },
  { name: "Ticketbutler", domain: "ticketbutler.io" },
  { name: "Spektrix", domain: "spektrix.com" },
  { name: "Blueticket", domain: "blueticket.com.br" },
  { name: "Perfect System, s. r. o. (Colosseum Ticket)", domain: "colosseum.eu" },
  { name: "TICKAMORE / IACPOS", domain: "tickamore.com" },
  { name: "Prekindle", domain: "prekindle.com" },
  { name: "Milengo", domain: "milengo.com" },
  { name: "Translate.One", domain: "translate.one" },
  { name: "Locpick - Game Localization & Audio", domain: "locpick.com" },
  { name: "Bilingual", domain: "bilingualglobal.com" },
  { name: "BURG Translations, Inc.", domain: "burgtranslations.com" },
  { name: "ES Localization Services Jsc.", domain: "estr.com" },
  { name: "Kreato Global - BPO and Language Solutions", domain: "kreatoglobal.com" },
  { name: "Reviver Global", domain: "reviver.global" },
  { name: "Interpretation and Translation", domain: "usinterpretation.com" },
  { name: "IOLAR", domain: "iolar.com" },
  { name: "Articulate", domain: "articulate.com" },
  { name: "Excelsoft Technologies", domain: "excelsoftcorp.com" },
  { name: "Edvanta", domain: "edvanta.com" },
  { name: "Arlo Training Management Software", domain: "arlo.co" },
  { name: "i-Context Pty Limited", domain: "i-context.io" },
  { name: "Zenskar", domain: "zenskar.com" },
  { name: "Expedite Commerce", domain: "expeditecommerce.com" },
  { name: "OneBill", domain: "onebillsoftware.com" },
  { name: "Evergent Technologies Inc.", domain: "evergent.com" },
  { name: "Frisbii", domain: "frisbii.com" },
  { name: "Perigeon Software", domain: "perigeon.com" },
  { name: "RecVue", domain: "recvue.com" },
  { name: "Stax Bill", domain: "staxbill.com" },
  { name: "Kilmist", domain: "kilmist.com" },
  { name: "ONEngine", domain: "onengine.ai" },
  { name: "OroCommerce", domain: "oroinc.com" },
  { name: "FastSpring", domain: "fastspring.com" },
];
