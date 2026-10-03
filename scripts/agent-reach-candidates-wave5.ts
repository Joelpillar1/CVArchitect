/**
 * Wave 5 of Agent Reach-discovered employers.
 *
 * Found with **Agent Reach** by running Exa's `category:company` search across twelve
 * verticals the earlier waves never touched: manufacturing/industrial software, construction
 * tech, agtech, legal tech, climate/energy, retail & ecommerce platforms, travel & hospitality,
 * robotics, lab & biotech tooling, edtech, real estate tech and telecom/networking.
 *
 * The thesis is deliberately unglamorous: an e-discovery platform with 950 open roles, a legal
 * practice-management tool with 290, an industrial-robotics fabricator, a dairy-farm telemetry
 * vendor. These are employers an aggregator buries under the big brands.
 *
 * The trailing `// N` comment is the `Active job postings` count Exa reported at capture time
 * (omitted when Exa returned no count); entries with no count are kept because a missing count
 * is not evidence of no jobs. Ground truth is what `recon` resolves and what the full fetch
 * returns.
 *
 * No `provider`/`slug` is declared — `scripts/recon-career-sources.ts` resolves each one with
 * the same `discoverJobSource()` the production sync uses, so nothing here is trusted until it
 * proves it has a real ATS board.
 */

import type { JobSourceCompany } from '../api/_lib/jobs/types';

export const AGENT_REACH_CANDIDATES_WAVE5: JobSourceCompany[] = [
  // ---- Actively hiring at capture time (Exa reported a live posting count) ----
  { name: 'Relativity', domain: 'relativity.com' }, // 951
  { name: 'Clio', domain: 'clio.com' }, // 290
  { name: 'Klook', domain: 'klook.com' }, // 191
  { name: 'Powell', domain: 'powellind.com' }, // 172
  { name: 'Engine', domain: 'engine.com' }, // 80
  { name: 'Constructor Tech', domain: 'constructor.tech' }, // 56
  { name: 'BCE Global Tech', domain: 'bceglobaltech.com' }, // 53
  { name: 'Energy Exemplar', domain: 'energyexemplar.com' }, // 50
  { name: 'GC AI', domain: 'gc.ai' }, // 39
  { name: 'Path Robotics', domain: 'path-robotics.com' }, // 36
  { name: 'Higharc', domain: 'higharc.com' }, // 32
  { name: 'Octasic', domain: 'octasic.com' }, // 31
  { name: 'Isomorphic Labs', domain: 'isomorphiclabs.com' }, // 27
  { name: 'Landeed', domain: 'landeed.com' }, // 26
  { name: 'TravClan', domain: 'travclan.com' }, // 23
  { name: 'Orchard', domain: 'orchard-robotics.com' }, // 22
  { name: 'Alkira', domain: 'alkira.com' }, // 22
  { name: 'Etraveli Group', domain: 'etraveligroup.com' }, // 20
  { name: 'Intrinsic', domain: 'intrinsic.ai' }, // 18
  { name: 'Monumental', domain: 'monumental.co' }, // 18
  { name: 'Phaidra', domain: 'phaidra.ai' }, // 17
  { name: 'Amla Commerce', domain: 'amla.io' }, // 17
  { name: 'Gecko Robotics', domain: 'geckorobotics.com' }, // 16
  { name: 'Crexi', domain: 'crexi.com' }, // 16
  { name: 'LEAP Legal Software', domain: 'leaplegalsoftware.com' }, // 15
  { name: 'eLaw', domain: 'elaw.com.br' }, // 15
  { name: 'ARi', domain: 'arigs.com' }, // 14
  { name: 'AIM', domain: 'aim.vision' }, // 14
  { name: 'Instaleap', domain: 'instaleap.io' }, // 14
  { name: 'Blue J', domain: 'bluej.com' }, // 13
  { name: 'EDMO', domain: 'goedmo.com' }, // 13
  { name: 'Neev', domain: 'neeviq.com' }, // 12
  { name: 'August', domain: 'august.law' }, // 12
  { name: 'Scispot', domain: 'scispot.com' }, // 12
  { name: 'Critical Manufacturing', domain: 'criticalmanufacturing.com' }, // 11
  { name: 'Deposco', domain: 'deposco.com' }, // 11
  { name: 'Cradle', domain: 'cradle.bio' }, // 11
  { name: 'Mainstay', domain: 'mainstay.io' }, // 11
  { name: 'Paperless Parts', domain: 'paperlessparts.com' }, // 10
  { name: 'Mews', domain: 'mews.com' }, // 10
  { name: 'Tamarind Bio', domain: 'tamarind.bio' }, // 10
  { name: 'Logicbroker', domain: 'logicbroker.com' }, // 9
  { name: 'M3', domain: 'm3as.com' }, // 9
  { name: 'Gravis Robotics', domain: 'gravisrobotics.com' }, // 9
  { name: 'Vantaca', domain: 'vantaca.com' }, // 9
  { name: 'ECRS', domain: 'ecrs.com' }, // 8
  { name: 'IDeaS Revenue Solutions', domain: 'ideas.com' }, // 8
  { name: 'OffWorld', domain: 'offworld.ai' }, // 8
  { name: 'Outsmart', domain: 'joinoutsmart.com' }, // 8
  { name: 'Lone Wolf Technologies', domain: 'lwolf.com' }, // 8
  { name: 'Fello', domain: 'fello.ai' }, // 8
  { name: 'Finch', domain: 'finchlegal.com' }, // 7
  { name: 'MS Shift', domain: 'msshift.com' }, // 7
  { name: 'Dash Bio', domain: 'dash.bio' }, // 7
  { name: 'Manifest OS', domain: 'manifestos.com' }, // 6
  { name: 'Discernis', domain: 'discernis.ai' }, // 6
  { name: 'Spread Group', domain: 'spreadgroup.com' }, // 6
  { name: 'Lodgify', domain: 'lodgify.com' }, // 6
  { name: 'Cambium Learning Group', domain: 'cambiumlearning.com' }, // 6
  { name: 'UNLOCKLAND', domain: 'unlock.land' }, // 6
  { name: 'Ishan Technologies', domain: 'ishantechnologies.com' }, // 6
  { name: 'Krones Digital Solutions India', domain: 'krones.com' }, // 5
  { name: 'Nova-Tech Engineering', domain: 'nteglobal.com' }, // 5
  { name: 'Noibu', domain: 'noibu.com' }, // 5
  { name: 'MyTravaly', domain: 'mytravaly.com' }, // 5
  { name: 'Emerald Cloud Lab', domain: 'emeraldcloudlab.com' }, // 5
  { name: 'Vegayan Systems', domain: 'vegayan.com' }, // 5
  { name: 'Sercomm', domain: 'sercomm.com' }, // 5
  { name: 'DPS Telecom', domain: 'dpstele.com' }, // 5
  { name: 'OpenSpace', domain: 'openspace.ai' }, // 4
  { name: 'xFarm Technologies', domain: 'xfarm.ag' }, // 4
  { name: 'Pattern Data', domain: 'patterndata.ai' }, // 4
  { name: 'Open Legal', domain: 'openlegal.com' }, // 4
  { name: 'Nira Energy', domain: 'niraenergy.com' }, // 4
  { name: 'YGO', domain: 'ygo.ai' }, // 4
  { name: 'Realtime Robotics', domain: 'rtr.ai' }, // 4
  { name: 'Asimov', domain: 'asimov.com' }, // 4
  { name: 'Helical', domain: 'helical.bio' }, // 4
  { name: 'Verustruct', domain: 'verustruct.com' }, // 3
  { name: 'Moray', domain: 'moray.ai' }, // 3
  { name: 'Undocked', domain: 'undocked.net' }, // 3
  { name: 'SCAYLE Commerce Engine', domain: 'scayle.com' }, // 3
  { name: 'Svaya Robotics', domain: 'svayarobotics.com' }, // 3
  { name: 'Almond Robotics', domain: 'almond.bot' }, // 3
  { name: 'Portal Biotech', domain: 'portalbiotech.com' }, // 3
  { name: 'Degreed', domain: 'degreed.com' }, // 3
  { name: 'Clever', domain: 'clever.com' }, // 3
  { name: '8020REI', domain: '8020rei.com' }, // 3
  { name: 'Hexagon R&D India', domain: 'hexagon.com' }, // 2
  { name: 'Mechademy', domain: 'mechademy.com' }, // 2
  { name: 'Lexamica', domain: 'lexamica.com' }, // 2
  { name: 'LawConnect', domain: 'lawconnect.com' }, // 2
  { name: 'Saga', domain: 'sagalegal.io' }, // 2
  { name: 'Skye', domain: 'skye.energy' }, // 2
  { name: 'Enerzyz', domain: 'enerzyz.com' }, // 2
  { name: 'Atica Global', domain: 'aticaglobal.com' }, // 2
  { name: 'Perchwell', domain: 'perchwell.com' }, // 2
  { name: 'IP Infusion', domain: 'ipinfusion.com' }, // 2
  { name: 'Tekton Dynamics', domain: 'tekton-dynamics.com' }, // 1
  { name: 'RedViking', domain: 'redviking.com' }, // 1
  { name: 'Drishti Works', domain: 'drishti.works' }, // 1
  { name: 'AgriRobot', domain: 'agrirobot.ai' }, // 1
  { name: 'Lexagle', domain: 'lexagle.com' }, // 1
  { name: 'Clairvolex', domain: 'clairvolex.com' }, // 1
  { name: 'Open Energy Transition', domain: 'openenergytransition.org' }, // 1
  { name: 'Codem', domain: 'codem.com' }, // 1
  { name: 'TPConnects Technologies', domain: 'tpconnects.com' }, // 1
  { name: 'Trossen Robotics', domain: 'trossenrobotics.com' }, // 1
  { name: 'Mimic Robotics', domain: 'mimicrobotics.com' }, // 1
  { name: 'Edpuzzle', domain: 'edpuzzle.com' }, // 1
  { name: 'NxGenComm', domain: 'nxgencomm.com' }, // 1
  { name: 'Skyline Communications', domain: 'skyline.be' }, // 1

  // ---- No posting count returned by Exa; probed anyway ----
  { name: 'Apiphany', domain: 'apiphany.ai' },
  { name: 'SigmaNEST', domain: 'sigmanest.com' },
  { name: 'Flosync', domain: 'flosync.io' },
  { name: 'CITRIOT', domain: 'citriot.ai' },
  { name: 'UGX.AI', domain: 'ugx.ai' },
  { name: 'Enphiniti Engineering', domain: 'enphiniti.com' },
  { name: 'Janus Automation', domain: 'janusautomation.com' },
  { name: 'MAJiK Systems', domain: 'majik.io' },
  { name: 'Fargo Engineering', domain: 'fargoengineering.com' },
  { name: 'wailand', domain: 'wailand.io' },
  { name: 'ERLEtek', domain: 'erletek.io' },
  { name: 'Strata Robotics', domain: 'stratarobot.com' },
  { name: 'ONESTRUCTION', domain: 'onestruction.com' },
  { name: 'Bedrock Robotics', domain: 'bedrockrobotics.com' },
  { name: 'Cambium Build', domain: 'cambiumbuild.com' },
  { name: 'MOCS', domain: 'mocs.nl' },
  { name: 'Klutch AI', domain: 'klutch.ai' },
  { name: 'Building Engineering & Design Co', domain: 'bedc.ai' },
  { name: 'Planso', domain: 'planso.co' },
  { name: 'DAERO', domain: 'daerogroup.com' },
  { name: 'Ironsite', domain: 'ironsite.ai' },
  { name: 'Kea Construction Technology', domain: 'keatec.co.nz' },
  { name: 'Farmdar', domain: 'farmdar.ai' },
  { name: 'FarmRobo Technologies', domain: 'farmrobo.in' },
  { name: 'Fasal', domain: 'fasal.co' },
  { name: 'Fyllo', domain: 'fyllo.in' },
  { name: 'OneRoot', domain: 'oneroot.farm' },
  { name: 'Navariti Innovation', domain: 'heliot.ai' },
  { name: 'Agricul', domain: 'agricul.in' },
  { name: 'AgroKisan', domain: 'agrokisan.com' },
  { name: 'Kanan', domain: 'kananpark.com' },
  { name: 'Revin Krishi', domain: 'revinkrishi.com' },
  { name: 'GroRobotics Innovations', domain: 'grorobotics.com' },
  { name: 'MyEasyFarm', domain: 'myeasyfarm.com' },
  { name: 'AgCareers', domain: 'agcareers.com' },
  { name: 'FILAHI', domain: 'filahi.com' },
  { name: 'Eeki', domain: 'eeki.com' },
  { name: 'IDGeo', domain: 'idgeo.farm' },
  { name: 'AI AgriRover', domain: 'aiagrirover.com' },
  { name: 'Froots Technologies', domain: 'agriq.ai' },
  { name: 'Legal Tech Jobs', domain: 'legaltechjobs.com' },
  { name: 'Pirical', domain: 'pirical.com' },
  { name: 'Infodash', domain: 'getinfodash.com' },
  { name: 'ELTEMATE', domain: 'eltemate.com' },
  { name: 'Lawdger', domain: 'lawdger.com' },
  { name: 'Gridfuse', domain: 'gridfuse.com' },
  { name: 'ExpectAI', domain: 'expectai.com' },
  { name: 'Quantile Energy', domain: 'quantileenergy.com' },
  { name: 'Kinewell', domain: 'kinewell.co.uk' },
  { name: 'Truxel', domain: 'truxel.ai' },
  { name: 'EnergyAI', domain: 'energyai.berlin' },
  { name: 'APEXION', domain: 'apexion.co' },
  { name: 'green.ai', domain: 'green.ai' },
  { name: 'Squid', domain: 'squid.energy' },
  { name: 'Pythia Energy Intelligence', domain: 'pythia-energy.nl' },
  { name: 'Renewex', domain: 'renewex.co' },
  { name: 'NASH Renewables', domain: 'nash-renewables.com' },
  { name: 'ClimateTechCareers', domain: 'climatetechcareers.com' },
  { name: 'Elio', domain: 'elio.earth' },
  { name: 'Virtwin-Energy', domain: 'virtwin-energy.se' },
  { name: 'Fyndiq', domain: 'cdon.com' },
  { name: 'Zeekit', domain: 'zeekit.me' },
  { name: 'Tailor', domain: 'tailor.tech' },
  { name: 'Storepecker', domain: 'storepecker.com' },
  { name: 'Boozt Technology Baltics', domain: 'booztgroup.com' },
  { name: 'Store No. 8', domain: 'storeno8.com' },
  { name: 'Flomerz', domain: 'flomerz.com' },
  { name: 'ZopSmart', domain: 'zopsmart.com' },
  { name: 'EASYECOM', domain: 'easyecom.io' },
  { name: 'Soul of Pluto', domain: 'soulofpluto.com' },
  { name: 'Travelgate', domain: 'travelgate.com' },
  { name: 'Inntopia', domain: 'inntopia.com' },
  { name: 'TLC DigiTech', domain: 'tlcgroup.com' },
  { name: 'Freetime Hospitality India', domain: 'vipspms.com' },
  { name: 'Zaplox', domain: 'zaplox.com' },
  { name: 'NetSemantics', domain: 'netsemantics.gr' },
  { name: 'Travel Software', domain: 'travelsoftware.it' },
  { name: 'Lume', domain: 'lume-cxm.com' },
  { name: 'Athenyx Robotics', domain: 'athenyxrobotics.com' },
  { name: 'Maven Robotics', domain: 'mavenrobotics.ai' },
  { name: 'Carnegie Robotics', domain: 'carnegierobotics.com' },
  { name: 'Orbital Robotics', domain: 'orbital-robots.com' },
  { name: 'Avea Robotics', domain: 'avearobotics.com' },
  { name: 'Omotenashi Robotics', domain: 'omotenashi-robotics.com' },
  { name: 'Neya Systems', domain: 'neyarobotics.com' },
  { name: 'Humatics', domain: 'humatics.com' },
  { name: 'Strider Robotics', domain: 'strider-robotics.in' },
  { name: 'SE4BIO', domain: 'se4.bio' },
  { name: 'ADLIN Science', domain: 'adlin-science.com' },
  { name: 'Bifrost Biosystems', domain: 'bifrost.bio' },
  { name: 'Biosero', domain: 'biosero.com' },
  { name: 'Nabla Bio', domain: 'nabla.bio' },
  { name: 'Ligo Biosciences', domain: 'ligo.bio' },
  { name: 'Feanix', domain: 'feanixbio.com' },
  { name: 'LabKey', domain: 'labkey.com' },
  { name: 'Numerion Labs', domain: 'numerionlabs.ai' },
  { name: 'InSpek', domain: 'inspek-solutions.com' },
  { name: 'Teckro', domain: 'teckro.com' },
  { name: 'Synthio Labs', domain: 'synthiolabs.com' },
  { name: 'Unity', domain: 'unityedu.ai' },
  { name: 'NoRedInk', domain: 'noredink.com' },
  { name: 'Edtech.com', domain: 'edtech.com' },
  { name: 'Dizvik Technologies', domain: 'dizviktech.com' },
  { name: 'Leepfrog Technologies', domain: 'courseleaf.com' },
  { name: '1EQ Tech', domain: '1eq.in' },
  { name: 'BNED LoudCloud', domain: 'bnedloudcloud.com' },
  { name: 'Knewton Alta', domain: 'knewton.com' },
  { name: 'Brainly', domain: 'brainly.com' },
  { name: 'Atom Learning', domain: 'atomlearning.com' },
  { name: 'Illuminate Education', domain: 'illuminateed.com' },
  { name: 'AccelerEd', domain: 'accelered.com' },
  { name: 'Concentric Sky', domain: 'concentricsky.com' },
  { name: 'Education Media Company', domain: 'educationmedia.ma' },
  { name: 'IDXExchange', domain: 'idxexchange.com' },
  { name: 'Indigo', domain: 'indigo.app' },
  { name: 'snapland', domain: 'snapland.ai' },
  { name: 'Maisonette Real Estate Software', domain: 'gomaisonette.com' },
  { name: 'OMRT', domain: 'omrt.tech' },
  { name: 'CREx', domain: 'crexsoftware.com' },
  { name: 'Bryckel AI', domain: 'bryckel.ai' },
  { name: 'Pillar', domain: 'pillarcre.com' },
  { name: 'WiSig Networks', domain: 'wisig.com' },
  { name: 'Centillion Networks', domain: 'centillionnetworks.com' },
  { name: 'AXON Networks', domain: 'axon-networks.com' },
  { name: 'Router Architects', domain: 'routerarchitects.com' },
  { name: 'HIGHRE Software', domain: 'highre.com' },
  { name: 'Coriant', domain: 'coriant.com' },
  { name: 'Onnet Systems India', domain: 'onnetsystems.net' },
  { name: 'Eridu', domain: 'eridu.ai' },
  { name: 'BITCOMM Technologies', domain: 'bitcommtechnologies.com' },
  { name: 'Nextspan Engineering', domain: 'nextspanengineering.com' },
  { name: 'MBIT Wireless', domain: 'mbitwireless.com' },
  { name: 'Ionos Networks', domain: 'ionosnetworks.com' },
];
