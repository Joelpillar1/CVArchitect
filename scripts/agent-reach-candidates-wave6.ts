/**
 * Wave 6 of Agent Reach-discovered employers.
 *
 * Found with **Agent Reach** by running Exa's `category:company` search across fourteen
 * verticals earlier waves never covered: insurtech, accounting/ERP, payroll/HR, freight &
 * maritime logistics, restaurant tech, adtech & martech, gaming, automotive & aerospace,
 * medical devices & diagnostics, sourcing/procurement/warehouse, core banking, sports tech,
 * music & creator tools, and fashion/apparel tech.
 *
 * Uniqueness is the point of this wave. Every domain here was checked against the union of
 * (a) every company `recon` has ever probed — resolved *and* unresolved, so a board that
 * already failed is never offered again — and (b) every domain/name already present in the
 * seed list, the candidate files, the shipped fixtures and the generated feed. A handful of
 * household consumer brands and one job board were dropped manually; nothing else in this file
 * has been seen by the pipeline before.
 *
 * The trailing `// N` is Exa's `Active job postings` count at capture time (omitted when Exa
 * returned none). Ground truth is what recon resolves and the full fetch returns.
 *
 * No `provider`/`slug` is declared — `scripts/recon-career-sources.ts` resolves each with the
 * same `discoverJobSource()` the production sync uses, so nothing is trusted until it proves
 * it has a real ATS board.
 */

import type { JobSourceCompany } from '../api/_lib/jobs/types';

export const AGENT_REACH_CANDIDATES_WAVE6: JobSourceCompany[] = [
  // ---- Actively hiring at capture time ----
  { name: 'Vensure Employer Solutions', domain: 'vensure.com' }, // 214
  { name: 'Kaigan Games Entertainment', domain: 'kaigangames.com' }, // 121
  { name: 'Avaloq', domain: 'avaloq.com' }, // 111
  { name: 'Paycor', domain: 'paycor.com' }, // 108
  { name: 'DualEntry', domain: 'dualentry.com' }, // 102
  { name: 'Suno', domain: 'suno.com' }, // 84
  { name: 'Welltech', domain: 'welltech.com' }, // 66
  { name: 'Keka HR', domain: 'keka.com' }, // 64
  { name: 'PubMatic', domain: 'pubmatic.com' }, // 64
  { name: 'Chowbus', domain: 'chowbus.com' }, // 63
  { name: 'Aptean', domain: 'aptean.com' }, // 60
  { name: 'Paycom', domain: 'paycom.com' }, // 59
  { name: 'Portcast', domain: 'portcast.io' }, // 57
  { name: 'Prenuvo', domain: 'prenuvo.com' }, // 52
  { name: 'VALD', domain: 'vald.com' }, // 48
  { name: 'iRhythm Technologies', domain: 'irhythm.com' }, // 44
  { name: 'Cloud Imperium Games', domain: 'cloudimperiumgames.com' }, // 40
  { name: 'GreyOrange', domain: 'greyorange.com' }, // 40
  { name: 'Backbase', domain: 'backbase.com' }, // 40
  { name: 'PrismHR', domain: 'prismhr.com' }, // 39
  { name: 'Hudl', domain: 'hudl.com' }, // 39
  { name: 'Finomnia', domain: 'finomnia.com' }, // 36
  { name: 'BambooHR', domain: 'bamboohr.com' }, // 34
  { name: 'DoubleVerify', domain: 'doubleverify.com' }, // 34
  { name: 'Tarro', domain: 'tarro.com' }, // 33
  { name: 'Nucleus Software', domain: 'nucleussoftware.com' }, // 32
  { name: 'Beyond Sports', domain: 'beyondsports.nl' }, // 30
  { name: 'Cloud Chamber', domain: 'cloudchamberstudios.com' }, // 26
  { name: 'Tillster', domain: 'tillster.com' }, // 23
  { name: 'Astronautics Corporation of America', domain: 'astronautics.com' }, // 23
  { name: 'Safran Engineering Services', domain: 'safran-group.com' }, // 23
  { name: 'Employer.com', domain: 'employer.com' }, // 22
  { name: 'Otter', domain: 'tryotter.com' }, // 22
  { name: 'Infosys Finacle', domain: 'finacle.com' }, // 21
  { name: 'FUJIFILM Sonosite', domain: 'sonosite.com' }, // 19
  { name: 'Quantcast', domain: 'quantcast.com' }, // 18
  { name: 'Avionyx', domain: 'avionyx.com' }, // 18
  { name: 'Temenos', domain: 'temenos.com' }, // 18
  { name: 'Bankdata', domain: 'bankdata.dk' }, // 17
  { name: 'Flam', domain: 'flamapp.ai' }, // 16
  { name: 'Embark Studios', domain: 'embark-studios.com' }, // 16
  { name: 'Bracco Medical Technologies', domain: 'braccomedtech.com' }, // 16
  { name: 'Fazz', domain: 'fazz.com' }, // 16
  { name: 'Snke', domain: 'snke.com' }, // 15
  { name: 'FEV North America', domain: 'fev.com' }, // 14
  { name: 'april', domain: 'getapril.com' }, // 14
  { name: 'GumGum', domain: 'gumgum.com' }, // 13
  { name: 'Aurora Flight Sciences', domain: 'aurora.aero' }, // 13
  { name: 'ProLiant', domain: 'proliant.com' }, // 12
  { name: 'Paradox Interactive', domain: 'paradoxinteractive.com' }, // 12
  { name: 'iFIT', domain: 'ifit.com' }, // 12
  { name: 'Z1 Tech', domain: 'z1tech.com' }, // 11
  { name: 'Aviya Aerospace Systems', domain: 'aviyatech.com' }, // 11
  { name: 'Tonal', domain: 'tonal.com' }, // 11
  { name: 'Veson Nautical', domain: 'veson.com' }, // 10
  { name: 'Integral Ad Science', domain: 'integralads.com' }, // 10
  { name: 'Nekki', domain: 'nekki.com' }, // 10
  { name: 'Red Canyon Engineering & Software', domain: 'redcanyonsoftware.com' }, // 10
  { name: 'Procure Ai', domain: 'procure.ai' }, // 9
  { name: 'Optimum Media', domain: 'optimum.media' }, // 8
  { name: 'Kendago', domain: 'kendago.com' }, // 8
  { name: 'ACRELEC', domain: 'acrelec.com' }, // 7
  { name: 'Element Science', domain: 'elementscience.com' }, // 7
  { name: 'Isourse', domain: 'isourse.com' }, // 7
  { name: 'Aptitude Software', domain: 'aptitudesoftware.com' }, // 6
  { name: 'Flipdish', domain: 'flipdish.com' }, // 6
  { name: 'Stellar Entertainment Software', domain: 'stellarentertainment.software' }, // 6
  { name: 'ESPRiT Engineering', domain: 'esprit-engineering.de' }, // 6
  { name: 'IAV Automotive Engineering', domain: 'iav.com' }, // 6
  { name: 'Clarius Mobile Health', domain: 'clarius.com' }, // 6
  { name: 'SonoScape', domain: 'sonoscape.com.cn' }, // 6
  { name: 'Tempo', domain: 'tempo.fit' }, // 6
  { name: 'JiBe ERP', domain: 'jibe.com.sg' }, // 5
  { name: 'Lavu', domain: 'lavu.com' }, // 5
  { name: 'Pankl Aerospace Systems', domain: 'pankl.com' }, // 5
  { name: 'SongPush', domain: 'songpush.com' }, // 5
  { name: 'FlixStock', domain: 'flixstock.com' }, // 5
  { name: 'VesselBot', domain: 'vesselbot.com' }, // 4
  { name: 'Bigabid', domain: 'bigabid.com' }, // 4
  { name: 'JASCI Software', domain: 'jascicloud.com' }, // 4
  { name: 'INFINIT', domain: 'infinit.com' }, // 4
  { name: 'Hook', domain: 'hookmusic.com' }, // 4
  { name: 'Ciphr', domain: 'ciphr.com' }, // 3
  { name: 'Dominion Payroll', domain: 'dominionpayroll.com' }, // 3
  { name: 'Zelt', domain: 'zelt.app' }, // 3
  { name: 'Fudo', domain: 'fu.do' }, // 3
  { name: 'Tenzo', domain: 'gotenzo.com' }, // 3
  { name: 'Prospeum', domain: 'prospeum.com' }, // 3
  { name: 'Finanz Informatik Solutions Plus', domain: 'f-i-solutions-plus.de' }, // 3
  { name: 'BOLT6', domain: 'bolt6.ai' }, // 3
  { name: 'Mirelo', domain: 'mirelo.ai' }, // 3
  { name: 'Udio', domain: 'udio.com' }, // 3
  { name: 'IK Multimedia', domain: 'ikmultimedia.com' }, // 3
  { name: 'Krotos', domain: 'krotos.studio' }, // 3
  { name: 'Clothing Tech', domain: 'clothingtech.com' }, // 3
  { name: 'High Moon Studios', domain: 'highmoonstudios.com' }, // 2
  { name: 'Near Earth Autonomy', domain: 'nearearth.aero' }, // 2
  { name: 'Glacis', domain: 'glacis.com' }, // 2
  { name: 'BuchhaltungsButler', domain: 'buchhaltungsbutler.de' }, // 2
  { name: 'Anton Paar SportsTec', domain: 'skills-lab.com' }, // 2
  { name: 'Xentral ERP Software', domain: 'xentral.com' }, // 1
  { name: 'Lensing.ai', domain: 'everest-systems.com' }, // 1
  { name: 'Leuwint Technologies', domain: 'leuwint.com' }, // 1
  { name: 'Ahola Payroll & HR Solutions', domain: 'ahola.com' }, // 1
  { name: '4Shipping', domain: '4shipping.com' }, // 1
  { name: 'inline', domain: 'inline.app' }, // 1
  { name: 'RDS', domain: 'rdsdiag.com' }, // 1
  { name: 'Optellum', domain: 'optellum.com' }, // 1
  { name: 'SupplyWhy.ai', domain: 'supplywhy.ai' }, // 1
  { name: 'ElasticRun', domain: 'elastic.run' }, // 1
  { name: 'Finto', domain: 'gofinto.com' }, // 1

  // ---- No posting count returned by Exa; probed anyway ----
  { name: 'Rillet', domain: 'rillet.com' },
  { name: 'BlackLine India', domain: 'blackline.com' },
  { name: 'Frappe', domain: 'frappe.io' },
  { name: 'ASIR Technologies', domain: 'asirtech.in' },
  { name: 'Zerp Labs', domain: 'zirius.in' },
  { name: 'SISCOM ERP Software', domain: 'siscom.co.id' },
  { name: 'K2 SOFTWARE', domain: 'k2software.com.br' },
  { name: 'Onfinity ERP', domain: 'viennaadvantage.com' },
  { name: 'Enhanzer', domain: 'enhanzer.com' },
  { name: 'KagamiERP', domain: 'kagamierp.com' },
  { name: 'Quarto ERP', domain: 'quarto-erp.com' },
  { name: 'C-TRON Erp', domain: 'ctronsystem.com' },
  { name: 'Zeymo', domain: 'zeymo.com' },
  { name: 'Delight ERP', domain: 'delighterp.com' },
  { name: 'VAYUXI', domain: 'vayuxierp.com' },
  { name: 'TriNet Zenefits', domain: 'zenefits.com' },
  { name: 'OnePayHR', domain: 'onepayhr.com' },
  { name: 'Adams Keegan', domain: 'adamskeegan.com' },
  { name: 'APS Payroll', domain: 'apspayroll.com' },
  { name: 'Eddy', domain: 'eddy.com' },
  { name: 'Nexroll Corp', domain: 'nexroll.io' },
  { name: 'TGI Maritime Software', domain: 'tgims.com' },
  { name: 'CERTUS Automation', domain: 'certusautomation.com' },
  { name: 'heyport', domain: 'heyport.io' },
  { name: 'Sealytix', domain: 'sealytix.com' },
  { name: 'SeaVantage', domain: 'seavantage.com' },
  { name: 'CargoSphere', domain: 'cargosphere.com' },
  { name: 'VesselFront', domain: 'vesselfront.com' },
  { name: 'ConnectSea', domain: 'connectsea.com.br' },
  { name: 'Fleet Logistics', domain: 'tryfleet.com' },
  { name: 'CargoSoft GmbH', domain: 'cargosoft.de' },
  { name: 'The Feast', domain: 'thefeast.ai' },
  { name: 'Adoria', domain: 'adoria.com' },
  { name: 'Avocado', domain: 'avocadopos.com' },
  { name: 'Dot', domain: 'dot.sa' },
  { name: 'Alfred Technologies', domain: 'alfredtechnologies.com' },
  { name: 'Clave', domain: 'tryclave.ai' },
  { name: 'Restolution', domain: 'restolution.eu' },
  { name: 'Foodo AI', domain: 'foodo.ai' },
  { name: 'CloudX', domain: 'cloudx.ai' },
  { name: 'adjoe', domain: 'adjoe.io' },
  { name: 'Intango', domain: 'intango.com' },
  { name: 'GoWit Technology', domain: 'gowit.com' },
  { name: 'Dstillery', domain: 'dstillery.com' },
  { name: 'Kritter Software Technology', domain: 'kritter.in' },
  { name: 'adtechnacity', domain: 'adtechnacity.com' },
  { name: 'Proxima', domain: 'proxima.ai' },
  { name: 'Mindstorm Studios', domain: 'mindstormstudios.com' },
  { name: 'Nukebox Studios', domain: 'nukeboxstudios.com' },
  { name: 'Jetpack Interactive', domain: 'jetpackinteractive.ca' },
  { name: 'Snowman', domain: 'builtbysnowman.com' },
  { name: 'Gardens Interactive', domain: 'gardens.dev' },
  { name: 'CARIAD', domain: 'cariad.us' },
  { name: 'Qubist Solutions', domain: 'qubistsolutions.com' },
  { name: 'tenics', domain: 'tenics.de' },
  { name: 'NSS Aerospace', domain: 'nssaerospace.com' },
  { name: 'AerX Labs', domain: 'aerxlabs.com' },
  { name: 'Aeron Systems', domain: 'aeronsystems.com' },
  { name: 'Kepler Aviation', domain: 'kepler.aero' },
  { name: 'Xitadel', domain: 'xitadel.com' },
  { name: 'RSEngineering', domain: 'rsengineering.org' },
  { name: 'LSP GmbH', domain: 'lsp-ias.com' },
  { name: 'MSK Engineering & IT Service', domain: 'mskengineering.de' },
  { name: 'Fluxus', domain: 'fluxus.bio' },
  { name: 'Digital Diagnostics', domain: 'digitaldiagnostics.com' },
  { name: 'Adiuvo Diagnostics', domain: 'adiuvodiagnostics.com' },
  { name: 'Healium Intelliscan', domain: 'healiumintelliscan.com' },
  { name: 'Leuko', domain: 'leuko.com' },
  { name: 'Poccet Labs', domain: 'poccetlabs.com' },
  { name: 'Sera Prognostics', domain: 'seraprognostics.com' },
  { name: '52North', domain: '52north.health' },
  { name: 'Sentinel Diagnostics', domain: 'sentineldiagnostics.com' },
  { name: 'SpinChip Diagnostics', domain: 'spinchip.no' },
  { name: 'Novus Diagnostics', domain: 'novus-dx.com' },
  { name: 'Diagon Diagnostics', domain: 'diagon.com' },
  { name: 'Startoon Labs', domain: 'startoonlabs.com' },
  { name: 'Slooze', domain: 'slooze.xyz' },
  { name: 'EXPERIDIUM', domain: 'experidium.com' },
  { name: 'ProSessed AI', domain: 'prosessed.ai' },
  { name: 'Globis Software', domain: 'globis-software.com' },
  { name: 'Picqer', domain: 'picqer.com' },
  { name: 'Sophus Technology', domain: 'sophus.ai' },
  { name: 'NewStar Sourcing and Service', domain: 'newstarsourcing.com' },
  { name: 'IFGlobal', domain: 'ifglobal.com' },
  { name: 'Jungheinrich PROFISHOP', domain: 'jh-profishop.de' },
  { name: 'FinOS', domain: 'finos.tech' },
  { name: 'Akkuro', domain: 'akkuro.com' },
  { name: 'Incore', domain: 'incore.ch' },
  { name: 'Axxiome', domain: 'axxiome.com' },
  { name: 'Panax', domain: 'panax.com' },
  { name: 'Smartan FitTech', domain: 'smartan.ai' },
  { name: 'Fort', domain: 'fort.cx' },
  { name: 'Garmin Jyvaskyla', domain: 'firstbeatanalytics.com' },
  { name: 'Runverve', domain: 'runverve.tech' },
  { name: 'BEPRO', domain: 'bepro11.com' },
  { name: 'Feldspar', domain: 'feldsparsport.com' },
  { name: 'Sequoia Fitness', domain: 'fitness365.me' },
  { name: 'Sportz Interactive', domain: 'sportzinteractive.net' },
  { name: 'Netrin Sports Technologies', domain: 'netrin.tech' },
  { name: 'Vitruve', domain: 'vitruve.fit' },
  { name: 'Morla Moves', domain: 'morlamoves.com' },
  { name: 'FANPLAY IoT', domain: 'fanplayiot.com' },
  { name: 'Toontrack Music', domain: 'toontrack.com' },
  { name: 'Zoundio', domain: 'zoundio.com' },
  { name: 'Reason Studios', domain: 'reasonstudios.com' },
  { name: 'PatchXR', domain: 'patchxr.com' },
  { name: 'Soundverse AI', domain: 'soundverse.ai' },
  { name: 'BeatStars', domain: 'beatstars.com' },
  { name: 'sonible', domain: 'sonible.com' },
  { name: 'nowon AG', domain: 'nowon.io' },
  { name: 'Amuse', domain: 'amuse.io' },
  { name: 'Ircam Amplify', domain: 'ircamamplify.com' },
  { name: 'inMusic', domain: 'inmusicbrands.com' },
  { name: 'Neutune', domain: 'mix.audio' },
  { name: 'Visulon', domain: 'visulon.com' },
  { name: 'The F Word', domain: 'thefword.ai' },
  { name: 'FRINGUANT', domain: 'fringuant.com' },
  { name: 'Shoppin', domain: 'shoppin.app' },
  { name: 'Vetir', domain: 'vetirapp.com' },
  { name: 'Apprel', domain: 'apprel.ai' },
  { name: 'Onbrand', domain: 'onbrandplm.com' },
  { name: 'JOOR', domain: 'joor.com' },
  { name: 'Doris', domain: 'doris.ai' },
  { name: 'VVEAVE', domain: 'vveave.com' },
  { name: 'StyleCareers', domain: 'stylecareers.com' },
  { name: 'DAITA', domain: 'daitalabs.com' },
  { name: 'MOIRAI 3', domain: 'moirai3.com' },
  { name: 'SXD', domain: 'sxd-ai.com' },
];
