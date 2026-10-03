/**
 * Wave 4 of Agent Reach-discovered employers.
 *
 * Discovered with **Agent Reach** by running Exa's `category:company` searches across eight
 * verticals (cybersecurity, data infrastructure, dev tools, fintech infra, digital health,
 * enterprise SaaS, supply-chain logistics, AI voice) and reading each result's official
 * website plus its `Active job postings` count. This wave deliberately covers verticals the
 * first wave did not — logistics, healthtech, security and payments — and is ordered by how
 * actively the company was hiring when it was captured.
 *
 * The trailing `// N active` comment is the posting count Exa reported at capture time, a
 * cheap "is this employer worth probing" signal; the ground truth is what `recon` resolves
 * and what `fetch-career-jobs.ts` later returns.
 *
 * No `provider`/`slug` is declared on purpose — `scripts/recon-career-sources.ts` resolves
 * each one with the same `discoverJobSource()` the production sync uses, so nothing here is
 * trusted until it has proven it has a real ATS board.
 */

import type { JobSourceCompany } from '../api/_lib/jobs/types';

export const AGENT_REACH_CANDIDATES_WAVE4: JobSourceCompany[] = [
  // ---- Most actively hiring at capture time ----
  { name: 'Nord Security', domain: 'nordsecurity.com' }, // 193 active
  { name: 'Körber Supply Chain', domain: 'koerber-supplychain.com' }, // 154 active
  { name: 'YQN Logistics', domain: 'yqn.com' }, // 108 active
  { name: 'Neko Health', domain: 'nekohealth.com' }, // 103 active
  { name: 'Stord', domain: 'stord.com' }, // 77 active
  { name: 'FORTNA', domain: 'fortna.com' }, // 76 active
  { name: 'Hinge Health', domain: 'hingehealth.com' }, // 62 active
  { name: 'Illumio', domain: 'illumio.com' }, // 57 active
  { name: 'Aegis AI Security', domain: 'aegisai.ai' }, // 46 active
  { name: 'Thought Machine', domain: 'thoughtmachine.net' }, // 38 active
  { name: 'Cogent', domain: 'cogent.com' }, // 37 active
  { name: 'Speak', domain: 'speak.com' }, // 35 active
  { name: 'Opkey', domain: 'opkey.com' }, // 33 active
  { name: 'sennder', domain: 'sennder.com' }, // 30 active
  { name: 'Rapid7', domain: 'r-7.co' }, // 29 active
  { name: 'Blitzy', domain: 'blitzy.com' }, // 27 active
  { name: 'Zafran Security', domain: 'zafran.io' }, // 25 active
  { name: 'PandaDoc', domain: 'pandadoc.com' }, // 24 active
  { name: 'Kaleris', domain: 'kaleris.com' }, // 24 active
  { name: 'Flagler Health', domain: 'flaglerhealth.io' }, // 23 active
  { name: 'FitzMark', domain: 'fitzmark.com' }, // 22 active
  { name: 'Bigship', domain: 'bigship.in' }, // 22 active
  { name: 'Sphera', domain: 'sphera.com' }, // 19 active
  { name: 'Pismo', domain: 'pismo.io' }, // 17 active
  { name: 'Foundation Health', domain: 'foundationhealth.com' }, // 16 active
  { name: 'Camber', domain: 'camber.health' }, // 16 active
  { name: 'Inworld AI', domain: 'inworld.ai' }, // 16 active
  { name: 'Artemis Security', domain: 'artemissecurity.com' }, // 15 active
  { name: 'Built', domain: 'getbuilt.com' }, // 14 active
  { name: 'TAC Security', domain: 'tacsecurity.com' }, // 12 active
  { name: 'Matia', domain: 'matia.io' }, // 12 active
  { name: 'Factored', domain: 'factored.ai' }, // 12 active
  { name: 'Convex', domain: 'convex.dev' }, // 12 active
  { name: 'leogistics GmbH', domain: 'leogistics.com' }, // 12 active
  { name: 'SoundHound AI', domain: 'soundhound.com' }, // 12 active
  { name: 'Deepwatch', domain: 'deepwatch.com' }, // 11 active
  { name: 'Arkham Technologies', domain: 'arkham.tech' }, // 10 active
  { name: 'Kreitech', domain: 'kreitech.io' }, // 10 active
  { name: 'Lorum', domain: 'lorum.com' }, // 10 active
  { name: 'Warp', domain: 'warp.co' }, // 10 active
  { name: 'Corridor', domain: 'corridor.dev' }, // 9 active
  { name: 'Kudelski Security', domain: 'kudelskisecurity.com' }, // 9 active
  { name: 'Simplesense', domain: 'simplesense.io' }, // 9 active
  { name: 'Yapily', domain: 'yapily.com' }, // 9 active
  { name: 'Hyperlayer', domain: 'hyperlayer.com' }, // 8 active
  { name: 'Intugine', domain: 'intugine.com' }, // 8 active
  { name: 'Gatik', domain: 'gatik.ai' }, // 8 active
  { name: 'Nuance Labs', domain: 'nuancelabs.ai' }, // 7 active
  { name: 'Detectify', domain: 'detectify.com' }, // 5 active
  { name: 'Imply', domain: 'imply.io' }, // 5 active
  { name: 'Itential', domain: 'itential.com' }, // 5 active
  { name: 'FULL Creative', domain: 'full.io' }, // 5 active
  { name: 'Lyric', domain: 'lyric.tech' }, // 5 active
  { name: 'Audatic', domain: 'audatic.ai' }, // 5 active
  { name: 'Lightsprint', domain: 'lightsprint.ai' }, // 3 active
  { name: 'Leap Metrics', domain: 'leapmetrics.io' }, // 3 active
  { name: 'Flume Health', domain: 'flumehealth.com' }, // 3 active
  { name: 'Kivo Health', domain: 'kivohealth.com' }, // 3 active
  { name: 'Flok Health', domain: 'flok.health' }, // 3 active
  { name: 'AGIGO', domain: 'agigo.com' }, // 3 active
  { name: 'Cygrid', domain: 'cygrid.io' }, // 2 active
  { name: 'RisingWave', domain: 'risingwave.com' }, // 2 active
  { name: 'Pantomath', domain: 'pantomath.com' }, // 2 active
  { name: 'Cosdata', domain: 'cosdata.io' }, // 2 active
  { name: 'Fourstroke', domain: 'fourstroke.io' }, // 2 active
  { name: 'GoodShip', domain: 'goodship.io' }, // 2 active
  { name: 'NCYBER', domain: 'ncyber.com' }, // 1 active
  { name: 'Weld', domain: 'weld.app' }, // 1 active
  { name: 'Datavent', domain: 'datavent.io' }, // 1 active
  { name: 'Findev', domain: 'fin.dev' }, // 1 active
  { name: 'NatWest Boxed', domain: 'nwboxed.com' }, // 1 active
  { name: 'Fluent Health', domain: 'fluentinhealth.com' }, // 1 active
  { name: 'Rappit', domain: 'rappit.io' }, // 1 active
  { name: 'Draup', domain: 'draup.com' }, // 1 active
  { name: 'Unqork', domain: 'unqork.com' }, // 1 active
  { name: 'Centiro', domain: 'centiro.com' }, // 1 active
  { name: 'Kalpa Labs', domain: 'kalpalabs.ai' }, // 1 active

  // ---- Security ----
  { name: 'PRE Security', domain: 'presecurity.ai' },
  { name: 'OpenSec', domain: 'opensec.in' },
  { name: 'Nua Security', domain: 'nuasecurity.com' },
  { name: 'Bug0', domain: 'bug0.com' },

  // ---- Data / developer tooling ----
  { name: 'Rerun', domain: 'rerun.io' },
  { name: 'Unistream', domain: 'unistream.cloud' },
  { name: 'Hub', domain: 'hub.xyz' },
  { name: 'Avihs', domain: 'avihs.ai' },
  { name: 'HashData', domain: 'hashdata.ai' },
  { name: 'Daana', domain: 'daana.dev' },
  { name: 'Spiral', domain: 'spiraldb.com' },
  { name: 'DataPebbles', domain: 'datapebbles.com' },
  { name: 'Yavda', domain: 'yavda.com' },
  { name: 'Sparkles', domain: 'sparkles.dev' },
  { name: 'Moss', domain: 'moss.dev' },
  { name: 'Helium', domain: 'tryhelium.com' },
  { name: 'ProdE AI', domain: 'prode.ai' },
  { name: 'Omni-IDE', domain: 'omniide.com' },
  { name: 'Minitap', domain: 'minitap.ai' },
  { name: 'Veengu', domain: 'veengu.com' },

  // ---- Fintech / payments ----
  { name: 'Vermiculus Financial Technology', domain: 'vermiculus.se' },
  { name: 'BHFT', domain: 'bhft.com' },
  { name: 'NimbusPay Technologies', domain: 'nimbuspay.io' },
  { name: 'IBSFINtech', domain: 'ibsfintech.com' },
  { name: 'Neonomics', domain: 'neonomics.io' },
  { name: 'NetXD', domain: 'netxd.com' },
  { name: 'Fragment', domain: 'fragment.dev' },
  { name: 'FoundryOS', domain: 'foundry-os.com' },
  { name: 'EMQ', domain: 'emq.com' },
  { name: 'Finverse Technologies', domain: 'finverse.com' },
  { name: 'Wyre', domain: 'sendwyre.com' },

  // ---- Health ----
  { name: 'Verily Health', domain: 'verily.com' },
  { name: 'Pi Health', domain: 'pihealth.ai' },
  { name: 'i3 Digital Health', domain: 'i3digitalhealth.com' },
  { name: 'Lind', domain: 'lind.care' },
  { name: 'FHIREngine', domain: 'fhirengineinc.com' },
  { name: 'PRYSM Health', domain: 'prysm.health' },
  { name: 'Hxplain', domain: 'hxplain.co' },
  { name: 'HEAPS.ai', domain: 'heaps.ai' },
  { name: 'Vard Digital Health', domain: 'vardhealth.com' },
  { name: 'Render Health Technology', domain: 'renderhealth.com' },

  // ---- Productivity / HR / logistics / voice ----
  { name: 'AWeber', domain: 'aweber.com' },
  { name: 'Aha!', domain: 'aha.io' },
  { name: 'Float', domain: 'float.com' },
  { name: 'Wobot AI', domain: 'wobot.ai' },
  { name: 'Zeero', domain: 'zeero.us' },
  { name: 'Toptal', domain: 'toptal.com' },
  { name: 'Terminal', domain: 'terminal.io' },
  { name: 'Certu Systems', domain: 'certusystems.com' },
  { name: 'Ascension Logistics', domain: 'ascensionlogistics.com' },
  { name: 'Hemut', domain: 'hemut.com' },
  { name: 'Ascend Cargo Systems', domain: 'ascendcargo.com' },
  { name: 'CloudLeap', domain: 'cloudleap.com' },
  { name: 'Carga', domain: 'carga.com' },
  { name: 'Apconic Software', domain: 'apconic.com' },
  { name: 'Modulate', domain: 'modulate.ai' },
  { name: 'Vokal.ai', domain: 'vokal.ai' },
  { name: 'Voiceops', domain: 'voiceops.com' },
  { name: 'Vozzo AI Labs', domain: 'vozzo.ai' },
  { name: 'Workbolt', domain: 'workbolt.ai' },
  { name: 'IndusLabs', domain: 'induslabs.io' },
  { name: 'SLNG', domain: 'slng.ai' },
  { name: 'KugelAudio', domain: 'kugelaudio.com' },
  { name: 'Hirevoice', domain: 'hirevoice.com' },
  { name: 'Neuphonic', domain: 'neuphonic.com' },
  { name: 'Oration AI', domain: 'oration.ai' },
  { name: 'AISpeech', domain: 'aispeech.com' },
  { name: 'Babylon Voice', domain: 'babylonvoice.com' },
  { name: 'Vox Talk AI', domain: 'voxtalkai.com' },
];
