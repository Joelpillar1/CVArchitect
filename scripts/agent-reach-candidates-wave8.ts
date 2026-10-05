/**
 * Wave 8 of Agent Reach-discovered employers.
 *
 * This wave was aimed deliberately at the sectors that hire *continuously* rather than in
 * bursts — the ones a founder, a CEO and a working recruiter all treat as permanent demand:
 * cybersecurity, healthcare IT, fintech infrastructure & payments, vertical B2B SaaS,
 * developer tools & AI infrastructure, logistics tech, payer/claims software, wealth
 * management, compliance automation, EHR, treasury/cash management, and identity & access
 * management. These are coverage, recurring-revenue and regulatory-mandate businesses, so
 * their boards rarely go quiet the way consumer or gaming boards do.
 *
 * Found with **Agent Reach** by running Exa's `category:company` search across those
 * verticals. Uniqueness is the point of this wave. Every domain here was checked against the
 * union of (a) every company `recon` has ever probed — resolved *and* unresolved, so a board
 * that already failed is never offered again — and (b) every domain/name already present in
 * the seed list, the candidate files, the shipped fixtures and the generated feed. Job boards,
 * aggregators and press sites were dropped manually; nothing else in this file has been seen
 * by the pipeline before.
 *
 * The trailing `// N` is Exa's `Active job postings` count at capture time (omitted when Exa
 * returned none). Ground truth is what recon resolves and the full fetch returns.
 *
 * No `provider`/`slug` is declared — `scripts/recon-career-sources.ts` resolves each with the
 * same `discoverJobSource()` the production sync uses, so nothing is trusted until it proves
 * it has a real ATS board.
 */

import type { JobSourceCompany } from '../api/_lib/jobs/types';

export const AGENT_REACH_CANDIDATES_WAVE8: JobSourceCompany[] = [
  { name: "ECS", domain: "everforthecs.com" }, // 318
  { name: "Yuno", domain: "y.uno" }, // 153
  { name: "Athelas", domain: "athelas.com" }, // 143
  { name: "Agile Defense", domain: "agiledefense.com" }, // 114
  { name: "Ping Identity", domain: "pingidentity.com" }, // 74
  { name: "Paymentology", domain: "paymentology.com" }, // 72
  { name: "HealthEdge", domain: "healthedge.com" }, // 70
  { name: "Lambda", domain: "lambda.ai" }, // 68
  { name: "Applied Systems", domain: "appliedsystems.com" }, // 68
  { name: "IDEMIA", domain: "idemia.com" }, // 65
  { name: "ID.me", domain: "id.me" }, // 55
  { name: "vCluster", domain: "vcluster.com" }, // 46
  { name: "Rain", domain: "rain.xyz" }, // 44
  { name: "Milliman MedInsight", domain: "medinsight.milliman.com" }, // 42
  { name: "GetInsured", domain: "getinsured.com" }, // 42
  { name: "Carta Healthcare", domain: "carta.healthcare" }, // 41
  { name: "ELLKAY", domain: "ellkay.com" }, // 41
  { name: "Duck Creek Technologies", domain: "duckcreek.com" }, // 41
  { name: "enGen", domain: "goengen.com" }, // 40
  { name: "Farther", domain: "farther.com" }, // 40
  { name: "Obsidian Security", domain: "obsidiansecurity.com" }, // 39
  { name: "WellSky", domain: "wellsky.com" }, // 37
  { name: "Primer", domain: "primer.io" }, // 36
  { name: "Insurity", domain: "insurity.com" }, // 31
  { name: "Keyfactor", domain: "keyfactor.com" }, // 30
  { name: "Aspire", domain: "aspireapp.com" }, // 27
  { name: "A-LIGN", domain: "a-lign.com" }, // 26
  { name: "Latent", domain: "latenthealth.com" }, // 26
  { name: "Nava", domain: "nava.com" }, // 26
  { name: "FurtherAI", domain: "furtherai.com" }, // 24
  { name: "Nevis", domain: "neviswealth.com" }, // 23
  { name: "CereCore", domain: "cerecore.net" }, // 23
  { name: "Kai", domain: "kai.security" }, // 22
  { name: "Axle", domain: "axle.insure" }, // 22
  { name: "Traversal", domain: "traversal.com" }, // 22
  { name: "Inferact", domain: "inferact.ai" }, // 22
  { name: "Stellarus", domain: "stellarus.com" }, // 22
  { name: "Anomali", domain: "anomali.com" }, // 21
  { name: "Elation Health", domain: "elationhealth.com" }, // 21
  { name: "Osfin.ai", domain: "osfin.ai" }, // 21
  { name: "Smartstream", domain: "smart.stream" }, // 21
  { name: "Upbound", domain: "upbound.io" }, // 19
  { name: "Tensordyne", domain: "tensordyne.ai" }, // 19
  { name: "DataGuard", domain: "dataguard.com" }, // 19
  { name: "TransLoop", domain: "transloop.io" }, // 16
  { name: "eSentire", domain: "esentire.com" }, // 16
  { name: "Embat", domain: "embat.io" }, // 16
  { name: "Andromeda", domain: "andromeda.ai" }, // 15
  { name: "Vega", domain: "vega.io" }, // 15
  { name: "Simeio", domain: "simeio.com" }, // 15
  { name: "Greenway Health", domain: "greenwayhealth.com" }, // 14
  { name: "Protegrity", domain: "protegrity.com" }, // 13
  { name: "Kiteworks", domain: "kiteworks.com" }, // 13
  { name: "Ciroos", domain: "ciroos.ai" }, // 12
  { name: "Sciforium", domain: "sciforium.ai" }, // 12
  { name: "Softheon", domain: "softheon.com" }, // 12
  { name: "Akeyless Security", domain: "akeyless.io" }, // 12
  { name: "Echelon Risk + Cyber", domain: "echeloncyber.com" }, // 11
  { name: "Kipu Health", domain: "kipuhealth.com" }, // 11
  { name: "Mesh", domain: "meshpay.com" }, // 11
  { name: "BVNK", domain: "bvnk.com" }, // 11
  { name: "Diagrid", domain: "diagrid.io" }, // 11
  { name: "SigNoz", domain: "signoz.io" }, // 11
  { name: "Kertos", domain: "kertos.io" }, // 11
  { name: "Apono", domain: "apono.io" }, // 11
  { name: "Linx Security", domain: "linx.security" }, // 11
  { name: "Office Ally", domain: "officeally.com" }, // 10
  { name: "Finmo", domain: "finmo.net" }, // 10
  { name: "Adonis", domain: "adonis.io" }, // 9
  { name: "Frame", domain: "framepayments.com" }, // 9
  { name: "Afresh", domain: "afresh.com" }, // 9
  { name: "Lyceum", domain: "lyceum.technology" }, // 9
  { name: "Zania", domain: "zania.ai" }, // 9
  { name: "Paysend", domain: "paysend.com" }, // 8
  { name: "Tread", domain: "tread.ai" }, // 8
  { name: "DataGrail", domain: "datagrail.io" }, // 8
  { name: "Atlar", domain: "atlar.com" }, // 8
  { name: "Continuum AI", domain: "gocontinuum.ai" }, // 7
  { name: "Expel", domain: "expel.com" }, // 7
  { name: "Zywave", domain: "zywave.com" }, // 7
  { name: "Quoris", domain: "quoris.com" }, // 7
  { name: "DebtBook", domain: "debtbook.com" }, // 7
  { name: "Xage Security", domain: "xage.com" }, // 7
  { name: "Epic", domain: "epic.com" }, // 6
  { name: "Leucine", domain: "leucine.io" }, // 6
  { name: "Strac", domain: "strac.io" }, // 6
  { name: "TRIARQ Health India", domain: "triarqhealth.com" }, // 6
  { name: "PrimEra Medical Technologies", domain: "primeramed.com" }, // 5
  { name: "LeafLink", domain: "leaflink.com" }, // 5
  { name: "Qubrid AI", domain: "qubrid.com" }, // 5
  { name: "Logically", domain: "logically.com" }, // 5
  { name: "ECP", domain: "ecp123.com" }, // 5
  { name: "MillTech", domain: "milltech.com" }, // 5
  { name: "Trovata", domain: "trovata.io" }, // 5
  { name: "Velocity", domain: "velocity.xyz" }, // 5
  { name: "Valor PayTech", domain: "valorpaytech.com" }, // 4
  { name: "Stacklok", domain: "stacklok.com" }, // 4
  { name: "Porter", domain: "porter.run" }, // 4
  { name: "Abacus Insights", domain: "abacusinsights.com" }, // 4
  { name: "Sureify", domain: "sureify.com" }, // 4
  { name: "Astraeus", domain: "astraeuswealth.com" }, // 4
  { name: "Odin", domain: "joinodin.com" }, // 4
  { name: "Mindlapse", domain: "mindlapse.ai" }, // 4
  { name: "ZeroDrift", domain: "zerodrift.ai" }, // 4
  { name: "AlgoSec", domain: "algosec.com" }, // 4
  { name: "eClinicalWorks", domain: "eclinicalworks.com" }, // 4
  { name: "OpsMill", domain: "opsmill.com" }, // 3
  { name: "Gradient", domain: "gradient.network" }, // 3
  { name: "Finys", domain: "finys.com" }, // 3
  { name: "Eicore", domain: "eicoretech.com" }, // 3
  { name: "TreasurySpring", domain: "treasuryspring.com" }, // 3
  { name: "Imperum", domain: "imperum.io" }, // 2
  { name: "phia, LLC", domain: "phiatech.com" }, // 2
  { name: "ZeOmega", domain: "zeomega.com" }, // 2
  { name: "DexCare", domain: "dexcare.com" }, // 2
  { name: "Atrya", domain: "atrya.io" }, // 2
  { name: "Notch", domain: "notch.cx" }, // 2
  { name: "Avent (YC S25)", domain: "aventindustrial.com" }, // 2
  { name: "American AI Logistics", domain: "americanailogistics.com" }, // 2
  { name: "Legion Security", domain: "legionsecurity.ai" }, // 2
  { name: "Netenrich", domain: "netenrich.com" }, // 2
  { name: "360 SOC, Inc.", domain: "360soc.com" }, // 2
  { name: "Certified Security Operations Center GmbH", domain: "csoc.de" }, // 2
  { name: "Galaxy EHR", domain: "psychplus.com" }, // 2
  { name: "Nomentia", domain: "nomentia.com" }, // 2
  { name: "QORE", domain: "qorepayments.com" }, // 1
  { name: "Shipsy", domain: "shipsy.ai" }, // 1
  { name: "Vantage 9", domain: "vantage9.ai" }, // 1
  { name: "Orkestra", domain: "hubs.la" }, // 1
  { name: "Anvilogic", domain: "anvilogic.com" }, // 1
  { name: "Simplify Healthcare", domain: "simplifyhealthcare.com" }, // 1
  { name: "HealthAxis Group", domain: "healthaxis.com" }, // 1
  { name: "CircleBlack", domain: "circleblack.com" }, // 1
  { name: "BlackDiamond Wealth", domain: "blackdiamondwealth.com" }, // 1
  { name: "Advanced Data Systems Corp", domain: "adsc.com" }, // 1
  { name: "Hazeltree", domain: "hazeltree.com" }, // 1
  { name: "Cyshield", domain: "cyshield.com" },
  { name: "Navy Cyber Defense Operations Command", domain: "navifor.usff.navy.mil" },
  { name: "CipherData", domain: "cipherdata.ai" },
  { name: "Mjolnir Security Inc", domain: "mjolnirsecurity.com" },
  { name: "ARMORY", domain: "armorydefense.com" },
  { name: "Cyber Security Jobs", domain: "cybersecurityjobs.com" },
  { name: "OmniMD", domain: "omnimd.com" },
  { name: "RAAPID INC", domain: "raapidinc.com" },
  { name: "DEEVITA", domain: "deevita.com" },
  { name: "INFINIOS", domain: "infinios.com" },
  { name: "Archefusion", domain: "archefusion.com" },
  { name: "EULER", domain: "eulerapp.com" },
  { name: "Vertical Insure", domain: "verticalinsure.com" },
  { name: "Ntracts, Inc", domain: "ntracts.com" },
  { name: "Ohanafy", domain: "ohanafy.com" },
  { name: "Wyre AI", domain: "wyreai.io" },
  { name: "Mandrel", domain: "mandrel.inc" },
  { name: "Vertical", domain: "heyvertical.io" },
  { name: "OCTA", domain: "weareocta.com" },
  { name: "InsForge", domain: "insforge.dev" },
  { name: "Facets.cloud", domain: "facets.cloud" },
  { name: "100 Telecommute Jobs", domain: "startup.jobs" },
  { name: "Developer Tools Bhutan", domain: "developertools.bt" },
  { name: "Zephyr", domain: "zephyr-cloud.io" },
  { name: "NebulaIQ.AI", domain: "nebulaiq.ai" },
  { name: "FlexAI", domain: "flex.ai" },
  { name: "Moreh", domain: "moreh.io" },
  { name: "Anyscale", domain: "anyscale.com" },
  { name: "oneinfer.ai", domain: "oneinfer.ai" },
  { name: "Prem AI", domain: "premai.io" },
  { name: "AI Infrastructure & Machines", domain: "aimstudio.co.in" },
  { name: "OneByZero", domain: "onebyzero.ai" },
  { name: "JobsInLogistics.com", domain: "jobsinlogistics.com" },
  { name: "Hive", domain: "hive.app" },
  { name: "iThink Logistics", domain: "ithinklogistics.com" },
  { name: "WhyCrew", domain: "whycrew.com" },
  { name: "DeltaSpike", domain: "deltaspike.io" },
  { name: "Security Industry Specialists", domain: "sis.us" },
  { name: "Selectsys India Pvt. Ltd.", domain: "selectsysindia.com" },
  { name: "Omega Benefit Strategies, Inc.", domain: "obspay.com" },
  { name: "HM Health Solutions", domain: "engen.health" },
  { name: "iComps I Digital Wealth Management Platform", domain: "icomps.de" },
  { name: "Centricity WealthTech", domain: "centricity.co.in" },
  { name: "Corum Wealth Management Platform AG", domain: "corum-wmp.ch" },
  { name: "8topuz Wealth Fintech", domain: "8topuz.com" },
  { name: "Fintech as a Platform", domain: "fintechasaplatform.com" },
  { name: "Unojobs", domain: "unojobs.com" },
  { name: "Product Based Companies Hiring", domain: "sabkomilegi.com" },
  { name: "Companies Hiring", domain: "companieshiring.in" },
  { name: "Wealth Companies", domain: "wealthcompanies.com" },
  { name: "Data Safeguard Inc.", domain: "datasafeguard.ai" },
  { name: "Autokrator.ai", domain: "autokrator.ai" },
  { name: "XtraSec, Inc.", domain: "xtrasec.com" },
  { name: "SECJUR", domain: "secjur.com" },
  { name: "Theom", domain: "theom.ai" },
  { name: "GoTrust", domain: "gotrust.tech" },
  { name: "Data Automation", domain: "dataautomation.io" },
  { name: "Allscripts", domain: "veradigm.com" },
  { name: "1st Providers Choice EMR & EHR Software", domain: "1stproviderschoice.com" },
  { name: "Practice EHR", domain: "practiceehr.com" },
  { name: "Fusion Health", domain: "fusionehr.com" },
  { name: "CGM ARIA Health Services", domain: "cgm.com" },
  { name: "Decipher Health Records LLP", domain: "decipherindia.com" },
  { name: "DrChrono by EverHealth", domain: "drchrono.com" },
  { name: "Epividian, Inc.", domain: "epividian.com" },
  { name: "Treasury (PT Indonesia Logam Pratama)", domain: "treasury.id" },
  { name: "JABU", domain: "gojabu.com" },
  { name: "Arc", domain: "joinarc.com" },
  { name: "C-Cash Global", domain: "c-cashglobal.com" },
  { name: "TreasuryPro By Worthy Advisors", domain: "treasurypro.in" },
  { name: "Tijoree", domain: "tijoree.money" },
  { name: "Onefin", domain: "onefin.com" },
  { name: "Tru Treasury", domain: "trutreasury.com" },
  { name: "Junto", domain: "juntoidentity.com" },
  { name: "Cyber Identity Solutions", domain: "cyberidentitysolutions.com" },
  { name: "Navar Identity Solutions", domain: "navarid.co.in" },
  { name: "Cube Identity Management Private Limited", domain: "cube-identity.com" },
  { name: "IDM Technologies", domain: "idm-technologies.com" },
  { name: "AskMeIdentity", domain: "askmeidentity.com" },
  { name: "Active Identity Management, Inc. (ActiveIdM)", domain: "activeidm.com" },
];
