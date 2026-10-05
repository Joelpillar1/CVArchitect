/**
 * Wave 9 of Agent Reach-discovered employers.
 *
 * Found with **Agent Reach** by running Exa's `category:company` search across sixteen
 * verticals that every earlier wave left untouched: semiconductors & embedded hardware,
 * autonomous vehicles & ADAS, EV charging & energy storage, sales engagement & revenue
 * intelligence, design & creative tools, pharma/CRO clinical research, sports betting &
 * iGaming, streaming & media infrastructure, fleet & field service, wholesale distribution,
 * document management & e-signature, networking & edge compute, insurance claims & brokerage,
 * accounting practice management, warehouse robotics, and veterinary clinic software.
 *
 * Uniqueness is the point of this wave. Every domain here was checked against the union of
 * (a) every company `recon` has ever probed — resolved *and* unresolved, so a board that
 * already failed is never offered again — and (b) every domain/name already present in the
 * seed list, the candidate files, the shipped fixtures and the generated feed. Job boards,
 * listicles, household mega-brands and pure services businesses were dropped manually;
 * nothing else in this file has been seen by the pipeline before.
 *
 * The trailing `// N` is Exa's `Active job postings` count at capture time (omitted when Exa
 * returned none). Ground truth is what recon resolves and the full fetch returns.
 *
 * No `provider`/`slug` is declared — `scripts/recon-career-sources.ts` resolves each with the
 * same `discoverJobSource()` the production sync uses, so nothing is trusted until it proves
 * it has a real ATS board.
 */

import type { JobSourceCompany } from '../api/_lib/jobs/types';

export const AGENT_REACH_CANDIDATES_WAVE9: JobSourceCompany[] = [
  { name: "Crawford & Company", domain: "crawco.com" }, // 235
  { name: "Jacent", domain: "jacentretail.com" }, // 116
  { name: "42dot", domain: "42dot.ai" }, // 96
  { name: "TYLsemi", domain: "tylsemi.ai" }, // 95
  { name: "PSI CRO", domain: "psi-cro.com" }, // 94
  { name: "Dexory", domain: "dexory.com" }, // 86
  { name: "Everest Clinical Research", domain: "everestclinical.com" }, // 82
  { name: "OneStream Software", domain: "onestream.com" }, // 69
  { name: "Sunny Automotive Optech", domain: "sunnyautomotiveoptech.com" }, // 63
  { name: "Movu Robotics", domain: "movu-robotics.com" }, // 49
  { name: "Origami Risk", domain: "origamirisk.com" }, // 44
  { name: "Trew", domain: "trewautomation.com" }, // 44
  { name: "Trintech", domain: "trintech.com" }, // 42
  { name: "DSG Supply", domain: "dsgsupply.com" }, // 39
  { name: "Seismic", domain: "seismic.com" }, // 38
  { name: "Nooks", domain: "nooks.ai" }, // 38
  { name: "Anrok", domain: "anrok.com" }, // 37
  { name: "Exotec", domain: "exotec.com" }, // 37
  { name: "Exponent Energy", domain: "exponent.energy" }, // 33
  { name: "DocuWare", domain: "docuware.com" }, // 33
  { name: "AIXIAL GROUP", domain: "aixialgroup.com" }, // 32
  { name: "IFG Companies", domain: "ifgcompanies.com" }, // 32
  { name: "Kooner Fleet Management Solutions", domain: "koonerfms.com" }, // 31
  { name: "Harper", domain: "harperinsure.com" }, // 31
  { name: "6sense", domain: "6sense.com" }, // 29
  { name: "Nimble", domain: "nimble.ai" }, // 27
  { name: "Fleetio", domain: "fleetio.com" }, // 26
  { name: "Spreetail", domain: "spreetail.com" }, // 25
  { name: "Tain", domain: "tain.com" }, // 23
  { name: "Xsight Labs", domain: "xsightlabs.com" }, // 22
  { name: "Karbon", domain: "karbonhq.com" }, // 22
  { name: "Maxima", domain: "maxima.ai" }, // 21
  { name: "Fleet Repair Solutions LLC", domain: "gofleetrepair.com" }, // 19
  { name: "OLIX", domain: "olix.com" }, // 18
  { name: "Phastar", domain: "phastar.com" }, // 18
  { name: "Nutrient", domain: "nutrient.io" }, // 17
  { name: "OSOME", domain: "osome.com" }, // 17
  { name: "MAXVY Technologies Pvt Ltd", domain: "maxvytech.com" }, // 16
  { name: "Modjo", domain: "modjo.ai" }, // 16
  { name: "Betfair Romania Development", domain: "betfairromania.ro" }, // 16
  { name: "Betway Global", domain: "supergroup.com" }, // 15
  { name: "Annapolis Micro Systems", domain: "annapmicro.com" }, // 15
  { name: "Unify", domain: "unifygtm.com" }, // 14
  { name: "Saleshandy", domain: "saleshandy.com" }, // 14
  { name: "Roos Fleetservice GmbH", domain: "roos-fs.com" }, // 14
  { name: "Veoneer", domain: "veoneer.com" }, // 13
  { name: "Reevo", domain: "reevo.ai" }, // 13
  { name: "Key Risk (a Berkley Company)", domain: "keyrisk.com" }, // 13
  { name: "NetDocuments", domain: "netdocuments.com" }, // 12
  { name: "Filed", domain: "filed.com" }, // 12
  { name: "HyperLight", domain: "hyperlightcorp.com" }, // 11
  { name: "aiMotive", domain: "aimotive.com" }, // 10
  { name: "TAE Power Solutions", domain: "power-solutions.tae.com" }, // 10
  { name: "NAGRA", domain: "nagra.vision" }, // 10
  { name: "airSlate", domain: "airslate.com" }, // 10
  { name: "Micas Networks", domain: "micasnetworks.com" }, // 10
  { name: "Indy", domain: "indy.fr" }, // 10
  { name: "yondu", domain: "yondu.ai" }, // 10
  { name: "Restream", domain: "restream.io" }, // 9
  { name: "ODK Media", domain: "odkmedia.net" }, // 9
  { name: "OverIT - Field Service Management", domain: "overit.ai" }, // 9
  { name: "HubSync", domain: "hubsync.com" }, // 9
  { name: "Vetsource", domain: "vetsource.com" }, // 9
  { name: "Boam AI", domain: "boam.ai" }, // 8
  { name: "Amagi", domain: "amagi.com" }, // 8
  { name: "evertz.io", domain: "evertz.io" }, // 8
  { name: "Salience Labs", domain: "saliencelabs.ai" }, // 8
  { name: "Rocket Shippers", domain: "rocketshippers.com" }, // 7
  { name: "Mitchell International, Inc.", domain: "mitchell.com" }, // 7
  { name: "4am Robotics", domain: "4am-robotics.com" }, // 7
  { name: "Achronix Semiconductor Corporation", domain: "achronix.com" }, // 6
  { name: "Revenue.io", domain: "revenue.io" }, // 6
  { name: "Joblogic Service Management Software", domain: "joblogic.com" }, // 6
  { name: "Lytx, Inc.", domain: "lytx.com" }, // 6
  { name: "AppliedAI", domain: "opus.com" }, // 6
  { name: "Arrcus, Inc.", domain: "arrcus.com" }, // 6
  { name: "Ambi Robotics", domain: "ambirobotics.com" }, // 6
  { name: "ANSCER Robotics", domain: "anscer.com" }, // 6
  { name: "Pumpkin", domain: "pumpkin.care" }, // 6
  { name: "White Hat Gaming", domain: "whitehatgaming.com" }, // 5
  { name: "Wisconsin Distributors", domain: "wisconsindistributors.com" }, // 5
  { name: "Scrive", domain: "scrive.com" }, // 5
  { name: "edoc solutions gmbh", domain: "edoc.de" }, // 5
  { name: "Ubitium", domain: "ubitium.com" }, // 4
  { name: "BOS Semiconductors", domain: "bos-semi.com" }, // 4
  { name: "Qiscus", domain: "qiscus.com" }, // 4
  { name: "tonik", domain: "tonik.com" }, // 4
  { name: "SISU GROUP", domain: "sisugroup.com" }, // 4
  { name: "Merchants Distributors, LLC", domain: "mdi.com" }, // 4
  { name: "Inkle", domain: "inkle.ai" }, // 4
  { name: "Scoro", domain: "scoro.com" }, // 4
  { name: "Persimmons, Inc.", domain: "persimmons.ai" }, // 3
  { name: "OrbitShift AI", domain: "orbitshift.ai" }, // 3
  { name: "Oliv AI", domain: "oliv.ai" }, // 3
  { name: "PanaCRO", domain: "panacro.com" }, // 3
  { name: "Pedigree Technologies", domain: "pedigreetech.io" }, // 3
  { name: "Ingrasys", domain: "ingrasys.com" }, // 3
  { name: "InsCipher", domain: "inscipher.com" }, // 3
  { name: "RevenueWell", domain: "revenuewell.com" }, // 3
  { name: "Bookkeeper360", domain: "bookkeeper360.com" }, // 3
  { name: "Navflex Inc", domain: "navflex.com" }, // 3
  { name: "LexxPluss, Inc.", domain: "lexxpluss.com" }, // 3
  { name: "Goose", domain: "goose.pet" }, // 3
  { name: "RunLoyal: Pet Software", domain: "runloyal.com" }, // 3
  { name: "Ciliconchip", domain: "ciliconchip.ai" }, // 2
  { name: "Sevya Multimedia", domain: "sevyamultimedia.com" }, // 2
  { name: "Dataspeed Inc.", domain: "dataspeedinc.com" }, // 2
  { name: "Sony Depthsensing Solutions", domain: "sony-depthsensing.com" }, // 2
  { name: "Storio Energy", domain: "storioenergy.com" }, // 2
  { name: "Adden Energy", domain: "addenenergy.com" }, // 2
  { name: "RevSure AI", domain: "revsure.ai" }, // 2
  { name: "PointsBet Canada", domain: "pointsbet.ca" }, // 2
  { name: "Arcadian", domain: "arcadian.la" }, // 2
  { name: "Synamedia", domain: "synamedia.com" }, // 2
  { name: "Net Insight", domain: "netinsight.net" }, // 2
  { name: "Quortex", domain: "quortex.io" }, // 2
  { name: "Broadpeak", domain: "broadpeak.tv" }, // 2
  { name: "Eluvio", domain: "eluv.io" }, // 2
  { name: "fleetster", domain: "fleetster.net" }, // 2
  { name: "Opptra", domain: "opptra.com" }, // 2
  { name: "S-Docs", domain: "sdocs.com" }, // 2
  { name: "eDOC Innovations", domain: "edoclogic.com" }, // 2
  { name: "Accton", domain: "accton.com" }, // 2
  { name: "Triton CMS for Programs", domain: "tritonclaims.com" }, // 2
  { name: "Finago Group", domain: "finago.com" }, // 2
  { name: "Inspire Semiconductor, Inc.", domain: "inspiresemi.com" }, // 1
  { name: "Cepton", domain: "cepton.com" }, // 1
  { name: "Delta Charge", domain: "deltacharge.com" }, // 1
  { name: "Gridless", domain: "gridless.com" }, // 1
  { name: "Katalyst CRO", domain: "katalysthls.com" }, // 1
  { name: "Poseidon CRO", domain: "poseidoncro.com" }, // 1
  { name: "Remington-Davis, Inc. Clinical Research", domain: "remdavis.com" }, // 1
  { name: "WA.Technology", domain: "watechnology.com" }, // 1
  { name: "JWX", domain: "jwx.com" }, // 1
  { name: "Velocix", domain: "velocix.com" }, // 1
  { name: "Alpha Networks", domain: "alphanetworks.tv" }, // 1
  { name: "CINGULARITY", domain: "cingularity.tv" }, // 1
  { name: "FleetFox", domain: "fleetfox.eu" }, // 1
  { name: "OneNotary", domain: "onenotary.com" }, // 1
  { name: "Lanner Electronics Inc.", domain: "lannerinc.com" }, // 1
  { name: "Finchetto", domain: "finchetto.com" }, // 1
  { name: "Buckhill Software", domain: "buckhill.co.uk" }, // 1
  { name: "VRC Insurance Systems", domain: "vrcis.com" }, // 1
  { name: "Anyware Robotics", domain: "anyware-robotics.com" }, // 1
  { name: "Prime Robotics", domain: "primerobotics.com" }, // 1
  { name: "Anantak Robotics", domain: "anantak.com" }, // 1
  { name: "HappyDoc", domain: "happydoc.ai" }, // 1
  { name: "Kyros-Semi", domain: "kyros-semi.com" },
  { name: "InCore Semiconductors", domain: "incoresemi.com" },
  { name: "Netrasemi", domain: "netrasemi.com" },
  { name: "Intelligent HW", domain: "ihw-ai.com" },
  { name: "Cortus SAS", domain: "cortus.com" },
  { name: "LeadSoc Technologies Pvt Ltd", domain: "leadsoc.com" },
  { name: "SION Semiconductors Private Limited", domain: "sionsemi.com" },
  { name: "ZEKU Technology", domain: "zeku.com" },
  { name: "Insemi Technology Services Pvt. Ltd.", domain: "insemitech.com" },
  { name: "Vulcan Semiconductor", domain: "vulcansemi.com" },
  { name: "Maverick Semiconductor Pvt. Ltd.", domain: "mavericksemiconductor.com" },
  { name: "Unaware Sensing", domain: "unaware-sensing.com" },
  { name: "Sony Advanced Visual Sensing", domain: "sony-avs.com" },
  { name: "Starkenn Technologies", domain: "starkenn.com" },
  { name: "Copernicus Autonomous Control Systems", domain: "kopernikusauto.com" },
  { name: "Fusionride", domain: "fusionride.com" },
  { name: "ADASENS Automotive GmbH", domain: "adasens.com" },
  { name: "ADAS Service Centers", domain: "adasservicecenters.com" },
  { name: "Certified ADAS", domain: "certifiedadas.com" },
  { name: "Five AI", domain: "five.ai" },
  { name: "Derq", domain: "derq.com" },
  { name: "OptiGrid", domain: "optigridllc.com" },
  { name: "Yahhvi - EV Charging", domain: "yahhvi.com" },
  { name: "OGO Energy", domain: "ogoenergy.com" },
  { name: "Hybrid Greentech - Energy Storage Intelligence", domain: "hybridgreentech.com" },
  { name: "ReVx Energy", domain: "revxenergy.com" },
  { name: "Lithion Power", domain: "lithionpower.com" },
  { name: "Soneil Spark", domain: "soneilspark.com" },
  { name: "Stormentum", domain: "stormentum.com" },
  { name: "DuraEdge Energy Storage", domain: "duraedge.co.in" },
  { name: "Belectriq Mobility", domain: "belectriq.co" },
  { name: "Kairus Energies", domain: "kairusenergies.com" },
  { name: "ARKLE Energy Solutions", domain: "arkleenergy.com" },
  { name: "Zenthos Energy", domain: "zenthosenergy.com" },
  { name: "EV Energy (Cyprus) ltd", domain: "evenergycy.com" },
  { name: "Flockjay", domain: "flockjay.com" },
  { name: "Next Quarter", domain: "nextq.ai" },
  { name: "Leadbeam", domain: "leadbeam.ai" },
  { name: "Enzy", domain: "enzy.co" },
  { name: "Skynamo", domain: "skynamo.com" },
  { name: "Aptivio", domain: "aptiv.io" },
  { name: "Noon", domain: "noon.design" },
  { name: "Figr", domain: "figr.design" },
  { name: "Kittl", domain: "kittl.com" },
  { name: "Art. Lebedev Studio", domain: "artlebedev.com" },
  { name: "KIMP", domain: "kimp.io" },
  { name: "Atomic Digital Design", domain: "atomicdigital.design" },
  { name: "Hiroo - hiring software", domain: "usehiroo.com" },
  { name: "LANDED Hiring Software", domain: "wearelanded.com" },
  { name: "Creative Financial Design", domain: "creativefinancialdesigns.com" },
  { name: "Ardent Clinical Research Services", domain: "ardent-cro.com" },
  { name: "Dr. Vince Clinical Research", domain: "drvincecro.com" },
  { name: "AnaCipher Clinical Research Organisation", domain: "anaciphercro.com" },
  { name: "St Pancras Clinical Research", domain: "stpancrasclinicalresearch.com" },
  { name: "ICBio Clinical Research", domain: "icbiocro.com" },
  { name: "Sermes CRO", domain: "sermescro.com" },
  { name: "KV CLINICAL RESEARCH PVT LTD( Site Management Organization)", domain: "kvclinicalresearch.com" },
  { name: "Ascend Clinical Research", domain: "ascendclinical-research.com" },
  { name: "Synergen Bio Pvt. Ltd.", domain: "synergenbio.com" },
  { name: "Selene Clinical Research", domain: "seleneclinicalresearch.com" },
  { name: "Voxtur Clinical Research", domain: "voxturglobal.com" },
  { name: "Aesculape CRO", domain: "aesculape.com" },
  { name: "Cromos Pharma", domain: "cromospharma.com" },
  { name: "Infigo Clinical Research", domain: "infigoresearch.com" },
  { name: "Noah Therapeutics Pvt. Ltd.", domain: "noahtherapeutics.com" },
  { name: "betr", domain: "betr.com.au" },
  { name: "Elantil", domain: "elantil.com" },
  { name: "Scout Gaming", domain: "scoutgaminggroup.com" },
  { name: "BVGroup", domain: "betvictor.com" },
  { name: "Betmaster", domain: "betmaster.com" },
  { name: "Skandha Media Services", domain: "skandhams.com" },
  { name: "Encompass Digital Media", domain: "encompass.tv" },
  { name: "Fonn Group", domain: "fonngroup.com" },
  { name: "Innocrux", domain: "innocrux.com" },
  { name: "ENVID AI", domain: "envid.ai" },
  { name: "MOD Streaming", domain: "modstreaming.com" },
  { name: "Ascora Field Service Management", domain: "ascora.io" },
  { name: "Fieldy", domain: "getfieldy.com" },
  { name: "Velocitor Solutions", domain: "velocitor.com" },
  { name: "FLINZ", domain: "flinz.net" },
  { name: "Fleetpro, Inc.", domain: "fleetpro.com" },
  { name: "Allied eCommerce Solutions", domain: "alliedecoms.com" },
  { name: "INTEGRITY WHOLESALE DISTRIBUTION", domain: "integritywd.com" },
  { name: "Quetico Logistics, LLC", domain: "queticollc.com" },
  { name: "Retail Direct Group", domain: "retaildirectgroup.com" },
  { name: "1Commerce", domain: "1-commerce.com" },
  { name: "Robert Ross & Co. Wholesale Distribution", domain: "robertross.com" },
  { name: "JLS Trading Co.", domain: "jlstradingco.com" },
  { name: "NorthSky", domain: "northskysupply.com" },
  { name: "EAK Distribution", domain: "eakdistribution.com" },
  { name: "East West Distribution", domain: "ewt.sk" },
  { name: "Revver", domain: "revverdocs.com" },
  { name: "Docpier", domain: "docpier.com" },
  { name: "Impactsure Technologies Private Limited", domain: "impactsure.com" },
  { name: "docify", domain: "docify.eu" },
  { name: "IDM - Integra Document Management", domain: "integradm.it" },
  { name: "dox2U", domain: "dox2u.com" },
  { name: "Docly - Digital Onboarding", domain: "docly.com.br" },
  { name: "Documizers", domain: "documizers.com" },
  { name: "optoML", domain: "opto-ml.com" },
  { name: "Grovf", domain: "grovf.com" },
  { name: "Piris Labs", domain: "pirislabs.io" },
  { name: "EdgeUno", domain: "edgeuno.com" },
  { name: "Type 1 Compute", domain: "type1compute.com" },
  { name: "MPL Claims Management Ltd", domain: "mplclaims.com" },
  { name: "E-CLAIM.COM", domain: "clickclaims.com" },
  { name: "Insurfox", domain: "insurfox.com" },
  { name: "Brisc AI", domain: "brisc.ai" },
  { name: "Velonetic", domain: "velonetic.co.uk" },
  { name: "Ecliptic Technology", domain: "ecliptic.tech" },
  { name: "Corvee", domain: "corvee.com" },
  { name: "Finago Procountor", domain: "procountor.fi" },
  { name: "Gappify", domain: "gappify.com" },
  { name: "Destro", domain: "destroai.com" },
  { name: "DF Automation & Robotics", domain: "dfautomation.com" },
  { name: "Syrius Robotics", domain: "syriusrobotics.co.jp" },
  { name: "QUARKS AUTOMATION AND ROBOTICS", domain: "quarksar.com" },
  { name: "iFuture Robotics", domain: "ifuturerobotics.com" },
  { name: "Ati Motors", domain: "atirobotics.ai" },
  { name: "Servo7 (YC W26)", domain: "servo7.com" },
  { name: "Retrevr Veterinary Technology", domain: "retrevr.io" },
  { name: "Otis", domain: "otisforpets.com" },
];
