import type { JobSourceCompany } from '../api/_lib/jobs/types';

/**
 * Seed list of companies whose **own** careers pages we read directly.
 *
 * Every entry below was verified against the provider's public board API, and the live
 * posting count at verification time is noted in the comment so a token that silently goes
 * stale is easy to spot. This list is intentionally small: the sync is designed to prove
 * out end-to-end on a few hundred boards before scaling.
 *
 * `provider` + `slug` are declared explicitly (rather than left to auto-discovery) for two
 * reasons:
 *  1. Correctness. `vercel` and `reddit` both have a stray same-named Ashby board with a
 *     single unrelated posting; declaring the provider removes that ambiguity.
 *  2. Cost. Declared sources need no discovery requests at all, so a full sync spends its
 *     network budget reading job boards instead of probing for them.
 *
 * Companies with no `provider` will be resolved by `api/lib/jobs/discovery.ts`, which
 * fingerprints the careers page and falls back to probing candidate tokens.
 */
export const JOB_SOURCE_COMPANIES: JobSourceCompany[] = [
  // ---- Greenhouse ----
  { name: 'Vercel', domain: 'vercel.com', provider: 'greenhouse', slug: 'vercel' }, // 86
  { name: 'Figma', domain: 'figma.com', provider: 'greenhouse', slug: 'figma' }, // 153
  { name: 'Stripe', domain: 'stripe.com', provider: 'greenhouse', slug: 'stripe' }, // 635
  { name: 'GitLab', domain: 'gitlab.com', provider: 'greenhouse', slug: 'gitlab' }, // 227
  { name: 'Databricks', domain: 'databricks.com', provider: 'greenhouse', slug: 'databricks' }, // 892
  { name: 'Robinhood', domain: 'robinhood.com', provider: 'greenhouse', slug: 'robinhood' }, // 126
  { name: 'Coinbase', domain: 'coinbase.com', provider: 'greenhouse', slug: 'coinbase' }, // 218
  { name: 'Airbnb', domain: 'airbnb.com', provider: 'greenhouse', slug: 'airbnb' }, // 164
  { name: 'Reddit', domain: 'reddit.com', provider: 'greenhouse', slug: 'reddit' }, // 148
  { name: 'Discord', domain: 'discord.com', provider: 'greenhouse', slug: 'discord' }, // 46
  { name: 'Dropbox', domain: 'dropbox.com', provider: 'greenhouse', slug: 'dropbox' }, // 41
  { name: 'Cloudflare', domain: 'cloudflare.com', provider: 'greenhouse', slug: 'cloudflare' }, // 358
  { name: 'MongoDB', domain: 'mongodb.com', provider: 'greenhouse', slug: 'mongodb' }, // 405
  { name: 'Twilio', domain: 'twilio.com', provider: 'greenhouse', slug: 'twilio' }, // 149
  { name: 'Affirm', domain: 'affirm.com', provider: 'greenhouse', slug: 'affirm' }, // 207
  { name: 'Chime', domain: 'chime.com', provider: 'greenhouse', slug: 'chime' }, // 70
  { name: 'Samsara', domain: 'samsara.com', provider: 'greenhouse', slug: 'samsara' }, // 262
  { name: 'Flexport', domain: 'flexport.com', provider: 'greenhouse', slug: 'flexport' }, // 179
  { name: 'Instacart', domain: 'instacart.com', provider: 'greenhouse', slug: 'instacart' }, // 106
  { name: 'Lyft', domain: 'lyft.com', provider: 'greenhouse', slug: 'lyft' }, // 183
  { name: 'Pinterest', domain: 'pinterest.com', provider: 'greenhouse', slug: 'pinterest' }, // 184
  { name: 'Squarespace', domain: 'squarespace.com', provider: 'greenhouse', slug: 'squarespace' }, // 28
  { name: 'Anthropic', domain: 'anthropic.com', provider: 'greenhouse', slug: 'anthropic' }, // 595
  { name: 'Brex', domain: 'brex.com', provider: 'greenhouse', slug: 'brex' }, // 272
  { name: 'Gusto', domain: 'gusto.com', provider: 'greenhouse', slug: 'gusto' }, // 95
  { name: 'Asana', domain: 'asana.com', provider: 'greenhouse', slug: 'asana' }, // 103
  { name: 'Duolingo', domain: 'duolingo.com', provider: 'greenhouse', slug: 'duolingo' }, // 80

  // ---- Lever ----
  { name: 'Palantir', domain: 'palantir.com', provider: 'lever', slug: 'palantir' }, // 311
  { name: 'Spotify', domain: 'spotify.com', provider: 'lever', slug: 'spotify' },

  // ---- Ashby ----
  { name: 'OpenAI', domain: 'openai.com', provider: 'ashby', slug: 'openai' }, // 795
  { name: 'Ramp', domain: 'ramp.com', provider: 'ashby', slug: 'ramp' }, // 145
  { name: 'Notion', domain: 'notion.so', provider: 'ashby', slug: 'notion' }, // 127
  { name: 'Linear', domain: 'linear.app', provider: 'ashby', slug: 'linear' }, // 30
  { name: 'Vanta', domain: 'vanta.com', provider: 'ashby', slug: 'vanta' }, // 105
  { name: 'Harvey', domain: 'harvey.ai', provider: 'ashby', slug: 'harvey' }, // 325
  { name: 'ElevenLabs', domain: 'elevenlabs.io', provider: 'ashby', slug: 'elevenlabs' }, // 246
  { name: 'Replit', domain: 'replit.com', provider: 'ashby', slug: 'replit' }, // 77
  { name: 'Supabase', domain: 'supabase.com', provider: 'ashby', slug: 'supabase' }, // 60
  { name: 'Modal', domain: 'modal.com', provider: 'ashby', slug: 'modal' }, // 31
  { name: 'Plaid', domain: 'plaid.com', provider: 'ashby', slug: 'plaid' }, // 110

  // ---- Resolved by auto-discovery ----
  // Datadog's careers page carries no ATS fingerprint and its board token does not match
  // its domain (`datadoghq.com` → board `datadog`), so it was only found by the probe
  // stage. It is declared here now that discovery has answered, to avoid re-probing it on
  // every sync — discovery remains the path for newly added companies.
  { name: 'Datadog', domain: 'datadoghq.com', provider: 'greenhouse', slug: 'datadog' },

  // ---- Mid-size employers found by the recon pass (scripts/recon-career-sources.ts) ----
  //
  // Deliberately *not* household names: vertical SaaS, payments infrastructure, dev tooling and
  // applied-AI companies whose postings an aggregator tends to bury under the big brands.
  //
  // Every entry resolved automatically (fingerprint or probe) and was then verified by a real
  // full-board fetch, so the provider/slug are declared here to skip re-discovery on each
  // sync. The trailing number is the live posting count at verification time — if a board
  // goes stale or is renamed, that count and the sync's `last_sync_error` make it obvious.
  // Companies whose board 404'd on the full fetch (Chronosphere, Mistral AI, Leapsome, Deel,
  // Nominal, Increase) are intentionally omitted rather than pinned to a dead token.
  { name: 'Abridge', domain: 'abridge.com', provider: 'ashby', slug: 'abridge' }, // 48
  { name: 'Acorns', domain: 'acorns.com', provider: 'ashby', slug: 'acorns' }, // 10
  { name: 'Airtable', domain: 'airtable.com', provider: 'greenhouse', slug: 'airtable' }, // 4
  { name: 'Alloy', domain: 'alloy.com', provider: 'greenhouse', slug: 'alloy' }, // 24
  { name: 'Alpaca', domain: 'alpaca.markets', provider: 'greenhouse', slug: 'alpaca' }, // 72
  { name: 'Amplitude', domain: 'amplitude.com', provider: 'ashby', slug: 'amplitude' }, // 32
  { name: 'Atlan', domain: 'atlan.com', provider: 'ashby', slug: 'atlan' }, // 6
  { name: 'Attentive', domain: 'attentive.com', provider: 'greenhouse', slug: 'attentive' }, // 31
  { name: 'Baseten', domain: 'baseten.co', provider: 'ashby', slug: 'baseten' }, // 103
  { name: 'Benchling', domain: 'benchling.com', provider: 'ashby', slug: 'benchling' }, // 58
  { name: 'Betterment', domain: 'betterment.com', provider: 'greenhouse', slug: 'betterment' }, // 29
  { name: 'Brightwheel', domain: 'mybrightwheel.com', provider: 'ashby', slug: 'brightwheel' }, // 11
  { name: 'Brigit', domain: 'brigit.com', provider: 'ashby', slug: 'brigit' }, // 16
  { name: 'Chroma', domain: 'trychroma.com', provider: 'ashby', slug: 'trychroma' }, // 1
  { name: 'Clay', domain: 'clay.com', provider: 'ashby', slug: 'claylabs' }, // 58
  { name: 'Clipboard Health', domain: 'clipboardhealth.com', provider: 'ashby', slug: 'clipboard' }, // 37
  { name: 'Cockroach Labs', domain: 'cockroachlabs.com', provider: 'greenhouse', slug: 'cockroachlabs' }, // 19
  { name: 'Cohere', domain: 'cohere.com', provider: 'ashby', slug: 'cohere' }, // 132
  { name: 'Column', domain: 'column.com', provider: 'ashby', slug: 'column' }, // 17
  { name: 'Cresta', domain: 'cresta.com', provider: 'greenhouse', slug: 'cresta' }, // 87
  { name: 'Dave', domain: 'dave.com', provider: 'ashby', slug: 'dave' }, // 6
  { name: 'DriveWealth', domain: 'drivewealth.com', provider: 'greenhouse', slug: 'drivewealth' }, // 15
  { name: 'Elastic', domain: 'elastic.co', provider: 'greenhouse', slug: 'elastic' }, // 392
  { name: 'Everlaw', domain: 'everlaw.com', provider: 'greenhouse', slug: 'everlaw' }, // 38
  { name: 'Fastly', domain: 'fastly.com', provider: 'greenhouse', slug: 'fastly' }, // 41
  { name: 'Fivetran', domain: 'fivetran.com', provider: 'greenhouse', slug: 'fivetran' }, // 185
  { name: 'Fly.io', domain: 'fly.io', provider: 'lever', slug: 'fly' }, // 1
  { name: 'Gorgias', domain: 'gorgias.com', provider: 'ashby', slug: 'gorgias' }, // 17
  { name: 'Grafana Labs', domain: 'grafana.com', provider: 'greenhouse', slug: 'grafanalabs' }, // 119
  { name: 'Hex', domain: 'hex.tech', provider: 'ashby', slug: 'hex' }, // 36
  { name: 'Highnote', domain: 'highnote.com', provider: 'greenhouse', slug: 'highnote' }, // 5
  { name: 'Hightouch', domain: 'hightouch.com', provider: 'greenhouse', slug: 'hightouch' }, // 82
  { name: 'Honeycomb', domain: 'honeycomb.io', provider: 'greenhouse', slug: 'honeycomb' }, // 19
  { name: 'InfluxData', domain: 'influxdata.com', provider: 'ashby', slug: 'influxdata' }, // 5
  { name: 'Ironclad', domain: 'ironcladapp.com', provider: 'ashby', slug: 'ironcladhq' }, // 31
  { name: 'Klaviyo', domain: 'klaviyo.com', provider: 'greenhouse', slug: 'klaviyo' }, // 135
  { name: 'Lattice', domain: 'lattice.com', provider: 'greenhouse', slug: 'lattice' }, // 11
  { name: 'LaunchDarkly', domain: 'launchdarkly.com', provider: 'greenhouse', slug: 'launchdarkly' }, // 59
  { name: 'Lithic', domain: 'lithic.com', provider: 'greenhouse', slug: 'lithic' }, // 11
  { name: 'Melio', domain: 'melio.com', provider: 'greenhouse', slug: 'melio' }, // 21
  { name: 'Mercury', domain: 'mercury.com', provider: 'greenhouse', slug: 'mercury' }, // 62
  { name: 'Mixpanel', domain: 'mixpanel.com', provider: 'greenhouse', slug: 'mixpanel' }, // 66
  { name: 'Modern Treasury', domain: 'moderntreasury.com', provider: 'ashby', slug: 'moderntreasury' }, // 9
  { name: 'Monte Carlo', domain: 'montecarlodata.com', provider: 'ashby', slug: 'montecarlodata' }, // 6
  { name: 'Mux', domain: 'mux.com', provider: 'ashby', slug: 'mux' }, // 1
  { name: 'Pinecone', domain: 'pinecone.io', provider: 'ashby', slug: 'pinecone' }, // 5
  { name: 'PlanetScale', domain: 'planetscale.com', provider: 'greenhouse', slug: 'planetscale' }, // 12
  { name: 'Postscript', domain: 'postscript.io', provider: 'greenhouse', slug: 'postscript' }, // 6
  { name: 'Project44', domain: 'project44.com', provider: 'greenhouse', slug: 'project44' }, // 34
  { name: 'Public', domain: 'public.com', provider: 'greenhouse', slug: 'public' }, // 2
  { name: 'Sardine', domain: 'sardine.ai', provider: 'ashby', slug: 'sardine' }, // 38
  { name: 'Semgrep', domain: 'semgrep.dev', provider: 'ashby', slug: 'semgrep' }, // 12
  { name: 'Sentry', domain: 'sentry.io', provider: 'ashby', slug: 'sentry' }, // 41
  { name: 'Sigma Computing', domain: 'sigmacomputing.com', provider: 'greenhouse', slug: 'sigmacomputing' }, // 65
  { name: 'Snyk', domain: 'snyk.io', provider: 'ashby', slug: 'snyk' }, // 13
  { name: 'Sourcegraph', domain: 'sourcegraph.com', provider: 'greenhouse', slug: 'sourcegraph91' }, // 10
  { name: 'Temporal', domain: 'temporal.io', provider: 'ashby', slug: 'temporal' }, // 64
  { name: 'Together AI', domain: 'together.ai', provider: 'greenhouse', slug: 'togetherai' }, // 77
  { name: 'Unit', domain: 'unit.co', provider: 'ashby', slug: 'unit' }, // 3
  { name: 'Wealthfront', domain: 'wealthfront.com', provider: 'lever', slug: 'wealthfront' }, // 23
  { name: 'Yotpo', domain: 'yotpo.com', provider: 'greenhouse', slug: 'yotpo' }, // 15

  // ---- Wave 2: broader mid-market employers (scripts/recon-career-sources.ts) ----
  //
  // Resolved automatically by a second recon pass and then **verified by a real full-board
  // fetch**, so every entry below returned live postings at verification time and the
  // trailing number is that posting count. The provider/slug are declared to skip re-discovery
  // on each sync. This is where the volume comes from: none of these are household names, but
  // between them they add ~5,400 postings (~90 employers) that an aggregator buries under the
  // big brands — ClickHouse, Motive, Netskope, Lyra Health, Deepgram and Perplexity alone
  // account for most of it.
  //
  // Boards that recon resolved but a full fetch proved dead or empty (Chronosphere, Mistral AI,
  // Leapsome, Nominal, Alma, Dwolla, Increase, 15Five, Prisma, Dagster Labs, Builder.io, Wiz,
  // ServiceTitan, Podium, Loom, Carbon Health, Health Gorilla) are intentionally omitted rather
  // than pinned to a token that returns nothing.
  { name: "Abnormal Security", domain: "abnormal.ai", provider: "greenhouse", slug: "abnormalsecurity" }, // 78
  { name: "Achievers", domain: "achievers.com", provider: "lever", slug: "achievers" }, // 13
  { name: "Airbyte", domain: "airbyte.com", provider: "ashby", slug: "airbyte" }, // 12
  { name: "Algolia", domain: "algolia.com", provider: "greenhouse", slug: "algolia" }, // 37
  { name: "Apollo GraphQL", domain: "apollographql.com", provider: "ashby", slug: "apollo-graphql" }, // 6
  { name: "Apollo.io", domain: "apollo.io", provider: "greenhouse", slug: "apolloio" }, // 49
  { name: "Arize AI", domain: "arize.com", provider: "greenhouse", slug: "arizeai" }, // 24
  { name: "Astra", domain: "astra.finance", provider: "ashby", slug: "astra" }, // 11
  { name: "Axonius", domain: "axonius.com", provider: "greenhouse", slug: "axonius" }, // 22
  { name: "BigID", domain: "bigid.com", provider: "greenhouse", slug: "bigid" }, // 7
  { name: "Bloomreach", domain: "bloomreach.com", provider: "greenhouse", slug: "bloomreach" }, // 77
  { name: "Buffer", domain: "buffer.com", provider: "ashby", slug: "buffer" }, // 1
  { name: "BuildOps", domain: "buildops.com", provider: "greenhouse", slug: "buildops" }, // 24
  { name: "Cato Networks", domain: "catonetworks.com", provider: "greenhouse", slug: "catonetworks" }, // 93
  { name: "Cedar", domain: "cedar.com", provider: "ashby", slug: "cedar" }, // 3
  { name: "Chainguard", domain: "chainguard.dev", provider: "greenhouse", slug: "chainguard" }, // 83
  { name: "ClickHouse", domain: "clickhouse.com", provider: "ashby", slug: "clickhouse" }, // 167
  { name: "CloudZero", domain: "cloudzero.com", provider: "ashby", slug: "cloudzero" }, // 16
  { name: "Confluent", domain: "confluent.io", provider: "ashby", slug: "confluent" }, // 17
  { name: "Constructor", domain: "constructor.io", provider: "ashby", slug: "constructor" }, // 35
  { name: "Contentful", domain: "contentful.com", provider: "greenhouse", slug: "contentful" }, // 19
  { name: "Culture Amp", domain: "cultureamp.com", provider: "greenhouse", slug: "cultureamp" }, // 32
  { name: "Cyberhaven", domain: "cyberhaven.com", provider: "ashby", slug: "cyberhaven" }, // 30
  { name: "Deepgram", domain: "deepgram.com", provider: "ashby", slug: "deepgram" }, // 92
  { name: "Descript", domain: "descript.com", provider: "greenhouse", slug: "descript" }, // 11
  { name: "Doximity", domain: "doximity.com", provider: "greenhouse", slug: "doximity" }, // 14
  { name: "Drata", domain: "drata.com", provider: "ashby", slug: "drata" }, // 36
  { name: "Dremio", domain: "dremio.com", provider: "greenhouse", slug: "dremio" }, // 5
  { name: "Endor Labs", domain: "endorlabs.com", provider: "greenhouse", slug: "endorlabs" }, // 28
  { name: "Fiddler AI", domain: "fiddler.ai", provider: "ashby", slug: "fiddler-ai" }, // 5
  { name: "Finix", domain: "finix.com", provider: "lever", slug: "finix" }, // 20
  { name: "Flatiron Health", domain: "flatiron.com", provider: "greenhouse", slug: "flatironhealth" }, // 29
  { name: "Front", domain: "front.com", provider: "ashby", slug: "frontcareers" }, // 9
  { name: "Galileo", domain: "galileo.ai", provider: "greenhouse", slug: "galileo" }, // 14
  { name: "Gladia", domain: "gladia.io", provider: "ashby", slug: "gladia" }, // 3
  { name: "Grow Therapy", domain: "growtherapy.com", provider: "ashby", slug: "grow-therapy" }, // 30
  { name: "Hawk AI", domain: "hawk.ai", provider: "ashby", slug: "hawk" }, // 18
  { name: "Headway", domain: "headway.co", provider: "ashby", slug: "headway" }, // 84
  { name: "Help Scout", domain: "helpscout.com", provider: "ashby", slug: "helpscout" }, // 7
  { name: "HeyGen", domain: "heygen.com", provider: "greenhouse", slug: "heygen" }, // 19
  { name: "Hootsuite", domain: "hootsuite.com", provider: "greenhouse", slug: "hootsuite" }, // 10
  { name: "Housecall Pro", domain: "housecallpro.com", provider: "greenhouse", slug: "housecall" }, // 53
  { name: "Intercom", domain: "intercom.com", provider: "greenhouse", slug: "intercom" }, // 105
  { name: "Jobber", domain: "getjobber.com", provider: "ashby", slug: "jobber" }, // 42
  { name: "Komodo Health", domain: "komodohealth.com", provider: "greenhouse", slug: "komodohealth" }, // 24
  { name: "Kustomer", domain: "kustomer.com", provider: "ashby", slug: "kustomer" }, // 2
  { name: "Labelbox", domain: "labelbox.com", provider: "greenhouse", slug: "labelbox" }, // 10
  { name: "Loop Returns", domain: "loopreturns.com", provider: "lever", slug: "loopreturns" }, // 8
  { name: "Lucid", domain: "lucid.co", provider: "greenhouse", slug: "lucidsoftware" }, // 27
  { name: "Lyra Health", domain: "lyrahealth.com", provider: "lever", slug: "lyrahealth" }, // 563
  { name: "Materialize", domain: "materialize.com", provider: "ashby", slug: "materialize" }, // 3
  { name: "Method Financial", domain: "methodfi.com", provider: "ashby", slug: "method" }, // 10
  { name: "Middesk", domain: "middesk.com", provider: "ashby", slug: "middesk" }, // 17
  { name: "Miro", domain: "miro.com", provider: "ashby", slug: "miro" }, // 23
  { name: "Modern Health", domain: "modernhealth.com", provider: "greenhouse", slug: "modernhealth" }, // 9
  { name: "Motive", domain: "gomotive.com", provider: "greenhouse", slug: "gomotive" }, // 155
  { name: "Mural", domain: "mural.co", provider: "ashby", slug: "mural" }, // 13
  { name: "Narvar", domain: "narvar.com", provider: "greenhouse", slug: "narvar" }, // 3
  { name: "Netlify", domain: "netlify.com", provider: "greenhouse", slug: "netlify" }, // 4
  { name: "Netskope", domain: "netskope.com", provider: "greenhouse", slug: "netskope" }, // 147
  { name: "Notable", domain: "notablehealth.com", provider: "ashby", slug: "notable" }, // 8
  { name: "Omni", domain: "omni.co", provider: "ashby", slug: "omni" }, // 26
  { name: "Orca Security", domain: "orca.security", provider: "greenhouse", slug: "orcasecurity" }, // 10
  { name: "Ordergroove", domain: "ordergroove.com", provider: "greenhouse", slug: "ordergroove" }, // 8
  { name: "Osano", domain: "osano.com", provider: "greenhouse", slug: "osano" }, // 10
  { name: "Outreach", domain: "outreach.io", provider: "lever", slug: "outreach" }, // 31
  { name: "Oyster", domain: "oysterhr.com", provider: "ashby", slug: "oyster" }, // 23
  { name: "PagerDuty", domain: "pagerduty.com", provider: "greenhouse", slug: "pagerduty" }, // 52
  { name: "Parloa", domain: "parloa.com", provider: "greenhouse", slug: "parloa" }, // 50
  { name: "Perplexity", domain: "perplexity.ai", provider: "ashby", slug: "perplexity" }, // 124
  { name: "Persona", domain: "withpersona.com", provider: "ashby", slug: "persona" }, // 16
  { name: "Pinwheel", domain: "pinwheelapi.com", provider: "greenhouse", slug: "pinwheelapi" }, // 5
  { name: "Prefect", domain: "prefect.io", provider: "ashby", slug: "prefect" }, // 9
  { name: "Rainforest", domain: "rainforestpay.com", provider: "ashby", slug: "rainforest-pay" }, // 6
  { name: "Recharge", domain: "rechargepayments.com", provider: "ashby", slug: "recharge" }, // 5
  { name: "Redox", domain: "redoxengine.com", provider: "lever", slug: "redoxengine" }, // 10
  { name: "Runway", domain: "runwayml.com", provider: "ashby", slug: "runway" }, // 4
  { name: "Salesloft", domain: "salesloft.com", provider: "greenhouse", slug: "salesloft" }, // 29
  { name: "Sanity", domain: "sanity.io", provider: "ashby", slug: "sanity" }, // 34
  { name: "Secureframe", domain: "secureframe.com", provider: "ashby", slug: "secureframe" }, // 8
  { name: "Snorkel AI", domain: "snorkel.ai", provider: "greenhouse", slug: "snorkelai" }, // 40
  { name: "Socket", domain: "socket.dev", provider: "ashby", slug: "socket" }, // 28
  { name: "Speechmatics", domain: "speechmatics.com", provider: "greenhouse", slug: "speechmatics" }, // 10
  { name: "Sprout Social", domain: "sproutsocial.com", provider: "greenhouse", slug: "sproutsocial" }, // 23
  { name: "Starburst", domain: "starburst.io", provider: "greenhouse", slug: "starburst" }, // 30
  { name: "Storyblok", domain: "storyblok.com", provider: "greenhouse", slug: "storyblok" }, // 11
  { name: "Sumo Logic", domain: "sumologic.com", provider: "greenhouse", slug: "sumologic" }, // 9
  { name: "Synthesia", domain: "synthesia.io", provider: "ashby", slug: "synthesia" }, // 50
  { name: "Sysdig", domain: "sysdig.com", provider: "lever", slug: "sysdig" }, // 29
  { name: "Tailscale", domain: "tailscale.com", provider: "greenhouse", slug: "tailscale" }, // 52
  { name: "Talkspace", domain: "talkspace.com", provider: "greenhouse", slug: "talkspace" }, // 20
  { name: "Teleport", domain: "goteleport.com", provider: "ashby", slug: "goteleport" }, // 23
  { name: "Thoropass", domain: "thoropass.com", provider: "greenhouse", slug: "thoropass" }, // 4
  { name: "Vantage", domain: "vantage.sh", provider: "ashby", slug: "vantage" }, // 5
  { name: "Webflow", domain: "webflow.com", provider: "greenhouse", slug: "webflow" }, // 27
  { name: "Zocdoc", domain: "zocdoc.com", provider: "greenhouse", slug: "zocdoc" }, // 60
  { name: "incident.io", domain: "incident.io", provider: "ashby", slug: "incident" }, // 32

  // ---- Wave 3: employers discovered with Agent Reach (Exa web search + Jina Reader) ----
  //
  // Surfaced by reading a curated "AI startups hiring in 2026" roundup and a few early-stage
  // job boards, then extracting each company's own domain and resolving its board with the
  // SAME discovery code the sync uses (scripts/agent-reach-candidates.ts →
  // scripts/recon-career-sources.ts). Every entry below returned live postings on a real
  // full-board fetch, so provider/slug are pinned to skip re-discovery on each sync. The
  // trailing number is that posting count.
  { name: "Taktile", domain: "taktile.com", provider: "ashby", slug: "taktile" }, // 39
  { name: "OpenRouter", domain: "openrouter.ai", provider: "ashby", slug: "openrouter" }, // 27
  { name: "Bolna", domain: "bolna.ai", provider: "ashby", slug: "bolna" }, // 7
  { name: "Descope", domain: "descope.com", provider: "greenhouse", slug: "descope" }, // 4
  { name: "Sarvam AI", domain: "sarvam.ai", provider: "ashby", slug: "sarvam" }, // 59
  { name: "Fal", domain: "fal.ai", provider: "ashby", slug: "fal-ai" }, // 38
  { name: "LanceDB", domain: "lancedb.com", provider: "ashby", slug: "lancedb" }, // 11
  { name: "Graphite", domain: "graphite.dev", provider: "ashby", slug: "graphite" }, // 7
  { name: "Dust", domain: "dust.tt", provider: "ashby", slug: "dust" }, // 24
  { name: "RunPod", domain: "runpod.io", provider: "ashby", slug: "runpod" }, // 26
  { name: "Hebbia", domain: "hebbia.ai", provider: "ashby", slug: "hebbia-ai" }, // 20
  { name: "Exa", domain: "exa.ai", provider: "ashby", slug: "exa" }, // 57
  { name: "Rogo", domain: "rogo.ai", provider: "ashby", slug: "rogo" }, // 85
  { name: "Maven AGI", domain: "mavenagi.com", provider: "ashby", slug: "maven-agi" }, // 18
  { name: "Corti", domain: "corti.ai", provider: "ashby", slug: "corti" }, // 4
  { name: "Observe.AI", domain: "observe.ai", provider: "greenhouse", slug: "observeai" }, // 12
  { name: "Greptile", domain: "greptile.com", provider: "ashby", slug: "greptile" }, // 17
  { name: "Reducto", domain: "reducto.ai", provider: "ashby", slug: "reducto" }, // 43
  { name: "Factory", domain: "factory.ai", provider: "ashby", slug: "factory" }, // 51
  { name: "Gumloop", domain: "gumloop.com", provider: "ashby", slug: "gumloop" }, // 11
  { name: "Harmonic Security", domain: "harmonic.security", provider: "ashby", slug: "harmonic-security-inc" }, // 8
  { name: "Deepset", domain: "deepset.ai", provider: "ashby", slug: "deepsetai" }, // 3
  { name: "Composio", domain: "composio.dev", provider: "ashby", slug: "composio" }, // 29
  { name: "Tenex.AI", domain: "tenex.ai", provider: "ashby", slug: "tenex" }, // 44
  { name: "Imbue", domain: "imbue.com", provider: "greenhouse", slug: "imbue" }, // 3
  { name: "Ema", domain: "ema.ai", provider: "ashby", slug: "ema" }, // 41
  { name: "Saviynt", domain: "saviynt.com", provider: "lever", slug: "saviynt" }, // 74
  { name: "Resolve AI", domain: "resolve.ai", provider: "ashby", slug: "resolveai" }, // 17
  { name: "Zilliz", domain: "zilliz.com", provider: "lever", slug: "zilliz" }, // 12
  { name: "You.com", domain: "you.com", provider: "greenhouse", slug: "youcom" }, // 7

  // ---- Wave 4: verticals Agent Reach's company search surfaced (logistics, health, security) ----
  //
  // Found by Exa's `category:company` search across eight verticals and read with Jina
  // Reader (scripts/agent-reach-candidates-wave4.ts). Discovery resolved each board with the
  // same code the sync uses; only boards that returned live postings on a full fetch are
  // pinned here. Trailing number = that posting count.
  { name: "AWeber", domain: "aweber.com", provider: "greenhouse", slug: "aweber" }, // 6
  { name: "Blitzy", domain: "blitzy.com", provider: "ashby", slug: "blitzy" }, // 27
  { name: "Built", domain: "getbuilt.com", provider: "greenhouse", slug: "getbuilt" }, // 15
  { name: "Camber", domain: "camber.health", provider: "ashby", slug: "camber" }, // 15
  { name: "Cogent", domain: "cogent.com", provider: "ashby", slug: "cogent-security" }, // 44
  { name: "Corridor", domain: "corridor.dev", provider: "ashby", slug: "corridor" }, // 13
  { name: "Deepwatch", domain: "deepwatch.com", provider: "greenhouse", slug: "deepwatchinc" }, // 3
  { name: "Factored", domain: "factored.ai", provider: "greenhouse", slug: "factored" }, // 12
  { name: "Findev", domain: "fin.dev", provider: "ashby", slug: "fin" }, // 8
  { name: "FitzMark", domain: "fitzmark.com", provider: "lever", slug: "fitzmark" }, // 19
  { name: "Flagler Health", domain: "flaglerhealth.io", provider: "ashby", slug: "flaglerhealth" }, // 19
  { name: "Float", domain: "float.com", provider: "ashby", slug: "float" }, // 19
  { name: "Flume Health", domain: "flumehealth.com", provider: "greenhouse", slug: "flumehealth" }, // 2
  { name: "Hinge Health", domain: "hingehealth.com", provider: "ashby", slug: "hinge-health" }, // 81
  { name: "Illumio", domain: "illumio.com", provider: "ashby", slug: "illumio" }, // 62
  { name: "Imply", domain: "imply.io", provider: "greenhouse", slug: "imply" }, // 4
  { name: "Inworld AI", domain: "inworld.ai", provider: "ashby", slug: "inworld-ai" }, // 19
  { name: "Kivo Health", domain: "kivohealth.com", provider: "ashby", slug: "kivo-health" }, // 5
  { name: "Lyric", domain: "lyric.tech", provider: "ashby", slug: "lyric" }, // 20
  { name: "Matia", domain: "matia.io", provider: "ashby", slug: "matia" }, // 10
  { name: "Modulate", domain: "modulate.ai", provider: "ashby", slug: "modulate" }, // 3
  { name: "Moss", domain: "moss.dev", provider: "ashby", slug: "moss" }, // 28
  { name: "Nuance Labs", domain: "nuancelabs.ai", provider: "greenhouse", slug: "nuancelabs" }, // 9
  { name: "PandaDoc", domain: "pandadoc.com", provider: "greenhouse", slug: "pandadoc" }, // 11
  { name: "Rerun", domain: "rerun.io", provider: "ashby", slug: "rerun" }, // 7
  { name: "Simplesense", domain: "simplesense.io", provider: "greenhouse", slug: "simplesense" }, // 7
  { name: "Speak", domain: "speak.com", provider: "ashby", slug: "speak" }, // 35
  { name: "Spiral", domain: "spiraldb.com", provider: "ashby", slug: "spiral" }, // 4
  { name: "Terminal", domain: "terminal.io", provider: "ashby", slug: "terminal" }, // 9
  { name: "Toptal", domain: "toptal.com", provider: "lever", slug: "toptal" }, // 32
  { name: "Unqork", domain: "unqork.com", provider: "greenhouse", slug: "unqork" }, // 1
  { name: "YQN Logistics", domain: "yqn.com", provider: "greenhouse", slug: "yqn" }, // 73
  { name: "Zafran Security", domain: "zafran.io", provider: "ashby", slug: "zafran-security" }, // 29

  // ---- Wave 5: untapped verticals found with Agent Reach (Exa company search) ----
  //
  // Twelve verticals the earlier waves never touched — manufacturing/industrial, construction
  // tech, agtech, legal tech, climate/energy, ecommerce platforms, travel & hospitality,
  // robotics, lab/biotech tooling, edtech, proptech and telecom/networking
  // (scripts/agent-reach-candidates-wave5.ts). Discovery resolved each board with the sync's
  // own code; only boards that returned live postings on a full fetch are pinned. Trailing
  // number = that posting count.
  { name: "AIM", domain: "aim.vision", provider: "ashby", slug: "aim" }, // 22
  { name: "Apiphany", domain: "apiphany.ai", provider: "ashby", slug: "apiphany" }, // 7
  { name: "Asimov", domain: "asimov.com", provider: "ashby", slug: "asimov" }, // 5
  { name: "August", domain: "august.law", provider: "ashby", slug: "august" }, // 12
  { name: "Brainly", domain: "brainly.com", provider: "ashby", slug: "brainly" }, // 1
  { name: "Clever", domain: "clever.com", provider: "greenhouse", slug: "clever" }, // 2
  { name: "Constructor Tech", domain: "constructor.tech", provider: "greenhouse", slug: "constructortech" }, // 53
  { name: "Cradle", domain: "cradle.bio", provider: "ashby", slug: "cradlebio" }, // 8
  { name: "Crexi", domain: "crexi.com", provider: "greenhouse", slug: "crexi" }, // 16
  { name: "Degreed", domain: "degreed.com", provider: "greenhouse", slug: "degreed" }, // 2
  { name: "Deposco", domain: "deposco.com", provider: "ashby", slug: "deposco" }, // 15
  { name: "Edpuzzle", domain: "edpuzzle.com", provider: "lever", slug: "edpuzzle" }, // 1
  { name: "Engine", domain: "engine.com", provider: "greenhouse", slug: "engine" }, // 79
  { name: "Feanix", domain: "feanixbio.com", provider: "greenhouse", slug: "feanixbiotechnologies" }, // 7
  { name: "Finch", domain: "finchlegal.com", provider: "lever", slug: "finch" }, // 12
  { name: "GC AI", domain: "gc.ai", provider: "ashby", slug: "gc-ai" }, // 25
  { name: "Gecko Robotics", domain: "geckorobotics.com", provider: "ashby", slug: "gecko-robotics" }, // 23
  { name: "Gravis Robotics", domain: "gravisrobotics.com", provider: "lever", slug: "gravisrobotics" }, // 10
  { name: "Higharc", domain: "higharc.com", provider: "ashby", slug: "higharc" }, // 17
  { name: "Indigo", domain: "indigo.app", provider: "greenhouse", slug: "indigo" }, // 2
  { name: "Intrinsic", domain: "intrinsic.ai", provider: "greenhouse", slug: "intrinsicrobotics" }, // 18
  { name: "Isomorphic Labs", domain: "isomorphiclabs.com", provider: "greenhouse", slug: "isomorphiclabs" }, // 29
  { name: "Lodgify", domain: "lodgify.com", provider: "lever", slug: "lodgify" }, // 12
  { name: "Lone Wolf Technologies", domain: "lwolf.com", provider: "lever", slug: "lwolf" }, // 18
  { name: "M3", domain: "m3as.com", provider: "greenhouse", slug: "m3" }, // 10
  { name: "Mainstay", domain: "mainstay.io", provider: "ashby", slug: "mainstay" }, // 10
  { name: "Manifest OS", domain: "manifestos.com", provider: "ashby", slug: "manifest-os" }, // 5
  { name: "Maven Robotics", domain: "mavenrobotics.ai", provider: "greenhouse", slug: "mavenrobotics" }, // 18
  { name: "Monumental", domain: "monumental.co", provider: "ashby", slug: "monumental" }, // 23
  { name: "Nabla Bio", domain: "nabla.bio", provider: "ashby", slug: "nabla" }, // 18
  { name: "Nira Energy", domain: "niraenergy.com", provider: "greenhouse", slug: "niraenergy" }, // 4
  { name: "Noibu", domain: "noibu.com", provider: "ashby", slug: "noibu" }, // 4
  { name: "Open Energy Transition", domain: "openenergytransition.org", provider: "greenhouse", slug: "openenergytransition" }, // 2
  { name: "OpenSpace", domain: "openspace.ai", provider: "greenhouse", slug: "openspace" }, // 4
  { name: "Orchard", domain: "orchard-robotics.com", provider: "greenhouse", slug: "orchard" }, // 26
  { name: "Outsmart", domain: "joinoutsmart.com", provider: "ashby", slug: "outsmart" }, // 7
  { name: "Paperless Parts", domain: "paperlessparts.com", provider: "greenhouse", slug: "paperlessparts" }, // 15
  { name: "Path Robotics", domain: "path-robotics.com", provider: "greenhouse", slug: "pathrobotics" }, // 45
  { name: "Pattern Data", domain: "patterndata.ai", provider: "greenhouse", slug: "patterndata" }, // 4
  { name: "Perchwell", domain: "perchwell.com", provider: "ashby", slug: "perchwell" }, // 5
  { name: "Phaidra", domain: "phaidra.ai", provider: "greenhouse", slug: "phaidra" }, // 8
  { name: "Relativity", domain: "relativity.com", provider: "greenhouse", slug: "relativity" }, // 343
  { name: "Tailor", domain: "tailor.tech", provider: "ashby", slug: "tailor" }, // 53
  { name: "Tamarind Bio", domain: "tamarind.bio", provider: "ashby", slug: "tamarindbio" }, // 7
  { name: "Tekton Dynamics", domain: "tekton-dynamics.com", provider: "ashby", slug: "tekton-dynamics" }, // 2
  { name: "UNLOCKLAND", domain: "unlock.land", provider: "greenhouse", slug: "unlock" }, // 2
  { name: "YGO", domain: "ygo.ai", provider: "ashby", slug: "ygo" }, // 4
  // ---- Waves 6-8: Agent Reach discovery (insurtech/ERP/payroll, veterinary/utility/space,
  // cybersecurity/health-IT/fintech-infra/vertical-SaaS). Each board below was verified live
  // by recon and returned postings in the full fetch. Trailing count = postings at pin time.
  { name: "Elastic",                              domain: "elastic.co",                     provider: "greenhouse", slug: "elastic" }, // 393
  { name: "Fivetran",                             domain: "fivetran.com",                   provider: "greenhouse", slug: "fivetran" }, // 178
  { name: "Astranis Space Technologies",          domain: "astranis.com",                   provider: "greenhouse", slug: "astranis" }, // 173
  { name: "VetEvolve",                            domain: "vetevolve.com",                  provider: "greenhouse", slug: "vetevolve" }, // 146
  { name: "Cohere",                               domain: "cohere.com",                     provider: "ashby", slug: "cohere" }, // 136
  { name: "Klaviyo",                              domain: "klaviyo.com",                    provider: "greenhouse", slug: "klaviyo" }, // 129
  { name: "Grafana Labs",                         domain: "grafana.com",                    provider: "greenhouse", slug: "grafanalabs" }, // 121
  { name: "Mercor",                               domain: "mercor.com",                     provider: "ashby", slug: "mercor" }, // 111
  { name: "E-Space",                              domain: "e-space.com",                    provider: "lever", slug: "espace" }, // 105
  { name: "Baseten",                              domain: "baseten.co",                     provider: "ashby", slug: "baseten" }, // 104
  { name: "Cognition",                            domain: "cognition.ai",                   provider: "ashby", slug: "cognition" }, // 103
  { name: "Lambda",                               domain: "lambda.ai",                      provider: "ashby", slug: "lambda" }, // 90
  { name: "Cresta",                               domain: "cresta.com",                     provider: "greenhouse", slug: "cresta" }, // 87
  { name: "Essential AI",                         domain: "essential.ai",                   provider: "greenhouse", slug: "essential" }, // 85
  { name: "Chowbus",                              domain: "chowbus.com",                    provider: "greenhouse", slug: "chowbus" }, // 81
  { name: "Together AI",                          domain: "together.ai",                    provider: "greenhouse", slug: "togetherai" }, // 77
  { name: "PubMatic",                             domain: "pubmatic.com",                   provider: "greenhouse", slug: "pubmatic" }, // 76
  { name: "DualEntry",                            domain: "dualentry.com",                  provider: "ashby", slug: "dualentry" }, // 75
  { name: "Alpaca",                               domain: "alpaca.markets",                 provider: "greenhouse", slug: "alpaca" }, // 71
  { name: "Sigma Computing",                      domain: "sigmacomputing.com",             provider: "greenhouse", slug: "sigmacomputing" }, // 69
  { name: "AppDirect",                            domain: "appdirect.com",                  provider: "greenhouse", slug: "appdirect" }, // 66
  { name: "Temporal",                             domain: "temporal.io",                    provider: "ashby", slug: "temporal" }, // 64
  { name: "Prenuvo",                              domain: "prenuvo.com",                    provider: "greenhouse", slug: "prenuvo" }, // 64
  { name: "Ping Identity",                        domain: "pingidentity.com",               provider: "greenhouse", slug: "pingidentity" }, // 64
  { name: "Mixpanel",                             domain: "mixpanel.com",                   provider: "greenhouse", slug: "mixpanel" }, // 63
  { name: "Mercury",                              domain: "mercury.com",                    provider: "greenhouse", slug: "mercury" }, // 61
  { name: "LaunchDarkly",                         domain: "launchdarkly.com",               provider: "greenhouse", slug: "launchdarkly" }, // 59
  { name: "Clay",                                 domain: "clay.com",                       provider: "ashby", slug: "claylabs" }, // 58
  { name: "Podium",                               domain: "podium.com",                     provider: "greenhouse", slug: "podium81" }, // 57
  { name: "Benchling",                            domain: "benchling.com",                  provider: "ashby", slug: "benchling" }, // 56
  { name: "ID.me",                                domain: "id.me",                          provider: "greenhouse", slug: "idme" }, // 51
  { name: "Abridge",                              domain: "abridge.com",                    provider: "ashby", slug: "abridge" }, // 50
  { name: "Writer",                               domain: "writer.com",                     provider: "ashby", slug: "writer" }, // 49
  { name: "adjoe",                                domain: "adjoe.io",                       provider: "ashby", slug: "adjoe" }, // 44
  { name: "Fastly",                               domain: "fastly.com",                     provider: "greenhouse", slug: "fastly" }, // 43
  { name: "Rain",                                 domain: "rain.xyz",                       provider: "ashby", slug: "rain" }, // 42
  { name: "Sentry",                               domain: "sentry.io",                      provider: "ashby", slug: "sentry" }, // 41
  { name: "Rillet",                               domain: "rillet.com",                     provider: "ashby", slug: "rillet" }, // 40
  { name: "Everlaw",                              domain: "everlaw.com",                    provider: "greenhouse", slug: "everlaw" }, // 39
  { name: "Sardine",                              domain: "sardine.ai",                     provider: "ashby", slug: "sardine" }, // 38
  { name: "Yuno",                                 domain: "y.uno",                          provider: "lever", slug: "yuno" }, // 38
  { name: "Clipboard Health",                     domain: "clipboardhealth.com",            provider: "ashby", slug: "clipboard" }, // 37
  { name: "Hex",                                  domain: "hex.tech",                       provider: "ashby", slug: "hex" }, // 36
  { name: "Tarro",                                domain: "tarro.com",                      provider: "ashby", slug: "tarro" }, // 36
  { name: "Amplitude",                            domain: "amplitude.com",                  provider: "ashby", slug: "amplitude" }, // 34
  { name: "Project44",                            domain: "project44.com",                  provider: "greenhouse", slug: "project44" }, // 34
  { name: "Hudl",                                 domain: "hudl.com",                       provider: "greenhouse", slug: "hudl" }, // 33
  { name: "Axle",                                 domain: "axle.insure",                    provider: "greenhouse", slug: "axle" }, // 33
  { name: "Ironclad",                             domain: "ironcladapp.com",                provider: "ashby", slug: "ironcladhq" }, // 32
  { name: "Attentive",                            domain: "attentive.com",                  provider: "greenhouse", slug: "attentive" }, // 32
  { name: "Inferact",                             domain: "inferact.ai",                    provider: "ashby", slug: "inferact" }, // 32
  { name: "FlexAI",                               domain: "flex.ai",                        provider: "greenhouse", slug: "flex" }, // 32
  { name: "Prime Intellect",                      domain: "primeintellect.ai",              provider: "ashby", slug: "primeintellect" }, // 30
  { name: "Tillster",                             domain: "tillster.com",                   provider: "ashby", slug: "tillster" }, // 30
  { name: "Farther",                              domain: "farther.com",                    provider: "greenhouse", slug: "fartherfinance" }, // 30
  { name: "Betterment",                           domain: "betterment.com",                 provider: "greenhouse", slug: "betterment" }, // 29
  { name: "Vetcove",                              domain: "vetcove.com",                    provider: "ashby", slug: "vetcove" }, // 27
  { name: "Traversal",                            domain: "traversal.com",                  provider: "ashby", slug: "traversal" }, // 27
  { name: "Primer",                               domain: "primer.io",                      provider: "ashby", slug: "primer" }, // 26
  { name: "iFIT",                                 domain: "ifit.com",                       provider: "greenhouse", slug: "ifit" }, // 25
  { name: "Valon",                                domain: "valon.ai",                       provider: "ashby", slug: "valon" }, // 25
  { name: "Orb",                                  domain: "withorb.com",                    provider: "ashby", slug: "orb" }, // 25
  { name: "Porter",                               domain: "porter.run",                     provider: "lever", slug: "porter" }, // 25
  { name: "MeridianLink",                         domain: "meridianlink.com",               provider: "ashby", slug: "meridianlink" }, // 24
  { name: "Alloy",                                domain: "alloy.com",                      provider: "greenhouse", slug: "alloy" }, // 23
  { name: "Wealthfront",                          domain: "wealthfront.com",                provider: "lever", slug: "wealthfront" }, // 23
  { name: "Tonal",                                domain: "tonal.com",                      provider: "ashby", slug: "tonal" }, // 23
  { name: "Paddle",                               domain: "paddle.com",                     provider: "ashby", slug: "paddle" }, // 23
  { name: "Latent",                               domain: "latenthealth.com",               provider: "ashby", slug: "latent" }, // 23
  { name: "Nevis",                                domain: "neviswealth.com",                provider: "ashby", slug: "nevis" }, // 23
  { name: "Otter",                                domain: "tryotter.com",                   provider: "greenhouse", slug: "otter" }, // 22
  { name: "Melio",                                domain: "melio.com",                      provider: "greenhouse", slug: "melio" }, // 21
  { name: "BVNK",                                 domain: "bvnk.com",                       provider: "greenhouse", slug: "bvnk" }, // 21
  { name: "Anyscale",                             domain: "anyscale.com",                   provider: "ashby", slug: "anyscale" }, // 21
  { name: "Honeycomb",                            domain: "honeycomb.io",                   provider: "greenhouse", slug: "honeycomb" }, // 20
  { name: "Cockroach Labs",                       domain: "cockroachlabs.com",              provider: "greenhouse", slug: "cockroachlabs" }, // 19
  { name: "Wisdom AI",                            domain: "wisdom.ai",                      provider: "ashby", slug: "wisdom-ai" }, // 19
  { name: "Kai",                                  domain: "kai.security",                   provider: "greenhouse", slug: "kaicyberinc" }, // 19
  { name: "Tensordyne",                           domain: "tensordyne.ai",                  provider: "greenhouse", slug: "tensordyne" }, // 19
  { name: "Column",                               domain: "column.com",                     provider: "ashby", slug: "column" }, // 18
  { name: "Welltech",                             domain: "welltech.com",                   provider: "ashby", slug: "welltech" }, // 18
  { name: "Kepler Aviation",                      domain: "kepler.aero",                    provider: "lever", slug: "kepler" }, // 18
  { name: "Carta Healthcare",                     domain: "carta.healthcare",               provider: "greenhouse", slug: "cartahealthcare" }, // 18
  { name: "Elation Health",                       domain: "elationhealth.com",              provider: "greenhouse", slug: "elationhealth" }, // 18
  { name: "DriveWealth",                          domain: "drivewealth.com",                provider: "greenhouse", slug: "drivewealth" }, // 17
  { name: "Easygenerator",                        domain: "easygenerator.com",              provider: "ashby", slug: "easygenerator" }, // 17
  { name: "KnowledgeCity",                        domain: "knowledgecity.com",              provider: "greenhouse", slug: "knowledgecity" }, // 17
  { name: "vCluster",                             domain: "vcluster.com",                   provider: "ashby", slug: "vclusterlabs" }, // 17
  { name: "Obsidian Security",                    domain: "obsidiansecurity.com",           provider: "greenhouse", slug: "obsidiansecurity" }, // 17
  { name: "Gorgias",                              domain: "gorgias.com",                    provider: "ashby", slug: "gorgias" }, // 16
  { name: "Z1 Tech",                              domain: "z1tech.com",                     provider: "lever", slug: "z1tech" }, // 16
  { name: "Loft Orbital",                         domain: "loftorbital.com",                provider: "greenhouse", slug: "loftfederal" }, // 16
  { name: "Andromeda",                            domain: "andromeda.ai",                   provider: "ashby", slug: "andromeda" }, // 16
  { name: "SigNoz",                               domain: "signoz.io",                      provider: "ashby", slug: "signoz" }, // 16
  { name: "Brigit",                               domain: "brigit.com",                     provider: "ashby", slug: "brigit" }, // 15
  { name: "Yotpo",                                domain: "yotpo.com",                      provider: "greenhouse", slug: "yotpo" }, // 15
  { name: "Mesh",                                 domain: "meshpay.com",                    provider: "greenhouse", slug: "mesh" }, // 15
  { name: "april",                                domain: "getapril.com",                   provider: "ashby", slug: "april" }, // 14
  { name: "Flipdish",                             domain: "flipdish.com",                   provider: "greenhouse", slug: "flipdish" }, // 14
  { name: "LearnUpon",                            domain: "learnupon.com",                  provider: "greenhouse", slug: "learnupon" }, // 14
  { name: "Mantra Inc.",                          domain: "mantra.co.jp",                   provider: "lever", slug: "mantra" }, // 14
  { name: "DataGuard",                            domain: "dataguard.com",                  provider: "ashby", slug: "dataguard" }, // 14
  { name: "DebtBook",                             domain: "debtbook.com",                   provider: "greenhouse", slug: "debtbook" }, // 14
  { name: "Semgrep",                              domain: "semgrep.dev",                    provider: "ashby", slug: "semgrep" }, // 13
  { name: "Snyk",                                 domain: "snyk.io",                        provider: "ashby", slug: "snyk" }, // 13
  { name: "Brightwheel",                          domain: "mybrightwheel.com",              provider: "ashby", slug: "brightwheel" }, // 13
  { name: "Litmos",                               domain: "litmos.com",                     provider: "greenhouse", slug: "litmos" }, // 13
  { name: "Sureify",                              domain: "sureify.com",                    provider: "greenhouse", slug: "sureify" }, // 13
  { name: "Abacus Insights",                      domain: "abacusinsights.com",             provider: "greenhouse", slug: "abacusinsights" }, // 13
  { name: "PlanetScale",                          domain: "planetscale.com",                provider: "greenhouse", slug: "planetscale" }, // 12
  { name: "Lattice",                              domain: "lattice.com",                    provider: "greenhouse", slug: "lattice" }, // 12
  { name: "Civitech",                             domain: "civitech.io",                    provider: "lever", slug: "civitech" }, // 12
  { name: "ACME Technologies Inc.",               domain: "acmeticketing.com",              provider: "ashby", slug: "peek" }, // 12
  { name: "Arlo Training Management Software",    domain: "arlo.co",                        provider: "ashby", slug: "arlo" }, // 12
  { name: "A-LIGN",                               domain: "a-lign.com",                     provider: "greenhouse", slug: "align" }, // 12
  { name: "Sciforium",                            domain: "sciforium.ai",                   provider: "ashby", slug: "sciforium" }, // 12
  { name: "Afresh",                               domain: "afresh.com",                     provider: "greenhouse", slug: "afresh" }, // 12
  { name: "Lyceum",                               domain: "lyceum.technology",              provider: "ashby", slug: "lyceum" }, // 12
  { name: "Office Ally",                          domain: "officeally.com",                 provider: "greenhouse", slug: "officeally" }, // 12
  { name: "Hive",                                 domain: "hive.app",                       provider: "greenhouse", slug: "hive" }, // 12
  { name: "Lithic",                               domain: "lithic.com",                     provider: "greenhouse", slug: "lithic" }, // 11
  { name: "Portcast",                             domain: "portcast.io",                    provider: "lever", slug: "portcast" }, // 11
  { name: "Recidiviz",                            domain: "recidiviz.org",                  provider: "greenhouse", slug: "recidiviz" }, // 11
  { name: "PetDesk",                              domain: "petdesk.com",                    provider: "lever", slug: "petdesk" }, // 11
  { name: "Sequence",                             domain: "sequencehq.com",                 provider: "ashby", slug: "sequence" }, // 11
  { name: "FurtherAI",                            domain: "furtherai.com",                  provider: "ashby", slug: "furtherai" }, // 11
  { name: "Velocity",                             domain: "velocity.xyz",                   provider: "ashby", slug: "velocity" }, // 11
  { name: "Sourcegraph",                          domain: "sourcegraph.com",                provider: "greenhouse", slug: "sourcegraph91" }, // 10
  { name: "Element Science",                      domain: "elementscience.com",             provider: "greenhouse", slug: "elementscience" }, // 10
  { name: "Aviya Aerospace Systems",              domain: "aviyatech.com",                  provider: "lever", slug: "aviyatech" }, // 10
  { name: "Paymentology",                         domain: "paymentology.com",               provider: "ashby", slug: "paymentology" }, // 10
  { name: "Adonis",                               domain: "adonis.io",                      provider: "ashby", slug: "adonis" }, // 10
  { name: "Xage Security",                        domain: "xage.com",                       provider: "lever", slug: "xage-security" }, // 10
  { name: "Modern Treasury",                      domain: "moderntreasury.com",             provider: "ashby", slug: "moderntreasury" }, // 9
  { name: "Acorns",                               domain: "acorns.com",                     provider: "ashby", slug: "acorns" }, // 9
  { name: "Browserbase",                          domain: "browserbase.com",                provider: "ashby", slug: "browserbase" }, // 9
  { name: "GumGum",                               domain: "gumgum.com",                     provider: "greenhouse", slug: "gumgum" }, // 9
  { name: "Anomali",                              domain: "anomali.com",                    provider: "lever", slug: "anomali" }, // 9
  { name: "Zania",                                domain: "zania.ai",                       provider: "ashby", slug: "zania" }, // 9
  { name: "Expel",                                domain: "expel.com",                      provider: "greenhouse", slug: "expel" }, // 9
  { name: "Red Canyon Engineering & Software",    domain: "redcanyonsoftware.com",          provider: "lever", slug: "redcanyonsoftware" }, // 8
  { name: "Mirelo",                               domain: "mirelo.ai",                      provider: "ashby", slug: "mirelo" }, // 8
  { name: "Watershed",                            domain: "watershed.com",                  provider: "greenhouse", slug: "watershed" }, // 8
  { name: "Elroy Air",                            domain: "elroyair.com",                   provider: "lever", slug: "elroyair" }, // 8
  { name: "Protegrity",                           domain: "protegrity.com",                 provider: "ashby", slug: "protegrity" }, // 8
  { name: "Ciroos",                               domain: "ciroos.ai",                      provider: "ashby", slug: "ciroos" }, // 8
  { name: "Finto",                                domain: "gofinto.com",                    provider: "ashby", slug: "finto" }, // 7
  { name: "Samara Aerospace",                     domain: "samaraaerospace.com",            provider: "greenhouse", slug: "samaraaerospace" }, // 7
  { name: "TodayTix Group (TTG)",                 domain: "todaytixgroup.com",              provider: "lever", slug: "todaytixgroup" }, // 7
  { name: "Constellation Space (YC26)",           domain: "constellation.space",            provider: "ashby", slug: "constellation" }, // 7
  { name: "Diagrid",                              domain: "diagrid.io",                     provider: "ashby", slug: "diagrid" }, // 7
  { name: "Tread",                                domain: "tread.ai",                       provider: "ashby", slug: "tread" }, // 7
  { name: "LeafLink",                             domain: "leaflink.com",                   provider: "greenhouse", slug: "leaflink" }, // 7
  { name: "Atlan",                                domain: "atlan.com",                      provider: "ashby", slug: "atlan" }, // 6
  { name: "Monte Carlo",                          domain: "montecarlodata.com",             provider: "ashby", slug: "montecarlodata" }, // 6
  { name: "Dave",                                 domain: "dave.com",                       provider: "ashby", slug: "dave" }, // 6
  { name: "Postscript",                           domain: "postscript.io",                  provider: "greenhouse", slug: "postscript" }, // 6
  { name: "Stellar Entertainment Software",       domain: "stellarentertainment.software",  provider: "ashby", slug: "stellarentertainment" }, // 6
  { name: "Tempo",                                domain: "tempo.fit",                      provider: "greenhouse", slug: "tempo" }, // 6
  { name: "Lupa",                                 domain: "lupapets.com",                   provider: "ashby", slug: "lupapets" }, // 6
  { name: "DataGrail",                            domain: "datagrail.io",                   provider: "greenhouse", slug: "datagrail" }, // 6
  { name: "InfluxData",                           domain: "influxdata.com",                 provider: "ashby", slug: "influxdata" }, // 5
  { name: "Pinecone",                             domain: "pinecone.io",                    provider: "ashby", slug: "pinecone" }, // 5
  { name: "Highnote",                             domain: "highnote.com",                   provider: "greenhouse", slug: "highnote" }, // 5
  { name: "Udio",                                 domain: "udio.com",                       provider: "greenhouse", slug: "udio" }, // 5
  { name: "Lithosquare",                          domain: "lithosquare.com",                provider: "ashby", slug: "lithosquare" }, // 5
  { name: "Upbound",                              domain: "upbound.io",                     provider: "greenhouse", slug: "upbound" }, // 5
  { name: "Gradient",                             domain: "gradient.network",               provider: "ashby", slug: "gradient" }, // 5
  { name: "Airtable",                             domain: "airtable.com",                   provider: "greenhouse", slug: "airtable" }, // 4
  { name: "Carley Corporation",                   domain: "carleycorp.com",                 provider: "greenhouse", slug: "carleycorporation" }, // 4
  { name: "Knock",                                domain: "knock.com",                      provider: "greenhouse", slug: "knock" }, // 4
  { name: "Lokalise",                             domain: "lokalise.com",                   provider: "greenhouse", slug: "lokalise" }, // 4
  { name: "Nest Veterinary",                      domain: "nestveterinary.com",             provider: "ashby", slug: "nestveterinary" }, // 4
  { name: "Kertos",                               domain: "kertos.io",                      provider: "ashby", slug: "kertos" }, // 4
  { name: "Stacklok",                             domain: "stacklok.com",                   provider: "greenhouse", slug: "stacklok" }, // 4
  { name: "Odin",                                 domain: "joinodin.com",                   provider: "ashby", slug: "odin" }, // 4
  { name: "Unit",                                 domain: "unit.co",                        provider: "ashby", slug: "unit" }, // 3
  { name: "Hook",                                 domain: "hookmusic.com",                  provider: "ashby", slug: "hookmusic" }, // 3
  { name: "CivicPlus",                            domain: "civicplus.com",                  provider: "greenhouse", slug: "civicplus" }, // 3
  { name: "FastSpring",                           domain: "fastspring.com",                 provider: "greenhouse", slug: "fastspring" }, // 3
  { name: "OpsMill",                              domain: "opsmill.com",                    provider: "ashby", slug: "opsmill" }, // 3
  { name: "Public",                               domain: "public.com",                     provider: "greenhouse", slug: "public" }, // 2
  { name: "Smallest AI",                          domain: "smallest.ai",                    provider: "ashby", slug: "smallest" }, // 2
  { name: "INFINIT",                              domain: "infinit.com",                    provider: "lever", slug: "infinit" }, // 2
  { name: "Homeward",                             domain: "homeward.com",                   provider: "greenhouse", slug: "homeward" }, // 2
  { name: "Opus Training",                        domain: "opus.so",                        provider: "ashby", slug: "opus-training" }, // 2
  { name: "GoodParty.org",                        domain: "goodparty.org",                  provider: "ashby", slug: "goodparty" }, // 2
  { name: "NovoEd",                               domain: "novoed.com",                     provider: "greenhouse", slug: "novoed" }, // 2
  { name: "ARMORY",                               domain: "armorydefense.com",              provider: "ashby", slug: "armory" }, // 2
  { name: "Mandrel",                              domain: "mandrel.inc",                    provider: "ashby", slug: "mandrel" }, // 2
  { name: "Fly.io",                               domain: "fly.io",                         provider: "lever", slug: "fly" }, // 1
  { name: "Mux",                                  domain: "mux.com",                        provider: "ashby", slug: "mux" }, // 1
  { name: "Chroma",                               domain: "trychroma.com",                  provider: "ashby", slug: "trychroma" }, // 1
  { name: "15Five",                               domain: "15five.com",                     provider: "lever", slug: "15five" }, // 1
  { name: "Patronus AI",                          domain: "patronus.ai",                    provider: "ashby", slug: "patronus" }, // 1
  { name: "Optimum Media",                        domain: "optimum.media",                  provider: "ashby", slug: "optimum" }, // 1
  { name: "CARIAD",                               domain: "cariad.us",                      provider: "greenhouse", slug: "cariadinc" }, // 1
  { name: "JOOR",                                 domain: "joor.com",                       provider: "ashby", slug: "joor" }, // 1
  { name: "Ticketure",                            domain: "ticketure.com",                  provider: "ashby", slug: "ticketure" }, // 1
  { name: "Articulate",                           domain: "articulate.com",                 provider: "lever", slug: "articulate" }, // 1
  { name: "Vega",                                 domain: "vega.io",                        provider: "greenhouse", slug: "vega" }, // 1
  { name: "DexCare",                              domain: "dexcare.com",                    provider: "lever", slug: "dexcarehealth" }, // 1
  { name: "HealthAxis Group",                     domain: "healthaxis.com",                 provider: "ashby", slug: "healthaxis" }, // 1
  { name: "ElasticRun",                           domain: "elastic.run",                    provider: "greenhouse", slug: "elastic" }, // 0
];

/**
 * Companies deliberately left for auto-discovery.
 *
 * Nothing is declared, so `discoverJobSource()` fingerprints the careers page and probes
 * candidate tokens. Kept separate from the main list so it is obvious which entries are
 * resolved on the fly and which are pinned.
 */
export const JOB_DISCOVERY_COMPANIES: JobSourceCompany[] = [];
