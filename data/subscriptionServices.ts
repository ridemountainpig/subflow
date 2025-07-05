import * as Svgl from "@ridemountainpig/svgl-react";
import { ComponentType } from "react";

export type SubscriptionServices = {
    uuid: string;
    name: string;
    icon: string | ComponentType;
};

export const subscriptionServices: SubscriptionServices[] = [
    {
        uuid: "7467d36b-9698-4573-bd04-7ff4c1afeeb4",
        name: "Windsurf",
        icon: Svgl.Windsurf,
    },
    {
        uuid: "6170c679-505c-482a-8855-e5e9672f580b",
        name: "Mattermost",
        icon: Svgl.MattermostDark,
    },
    {
        uuid: "c32c02d2-4775-442d-a8de-c3ac3e4da88b",
        name: "Inngest",
        icon: Svgl.InngestDark,
    },
    {
        uuid: "76d745de-4b9d-4c0a-9dc6-bdc35277d8d9",
        name: "Google Drive",
        icon: Svgl.GoogleDrive,
    },
    {
        uuid: "d7e22fc2-616f-48f1-a79d-e550acd2d693",
        name: "Suno",
        icon: Svgl.Suno,
    },
    {
        uuid: "da83444e-6596-4305-8a23-8d1725478624",
        name: "Cohere",
        icon: Svgl.Cohere,
    },
    {
        uuid: "9bec05cc-3b11-4f2d-a02b-92b846f432c1",
        name: "Animate",
        icon: Svgl.Animate,
    },
    {
        uuid: "57f8f133-df2a-46f1-a084-1cde8a17cd28",
        name: "Apollo.io",
        icon: Svgl.Apolloio,
    },
    {
        uuid: "a5df1ce2-0ff2-430f-b90f-b0fcacfc1613",
        name: "Basewell",
        icon: Svgl.Basewell,
    },
    {
        uuid: "95d8bec9-ea31-4746-b9a6-f05a7d03adf9",
        name: "Discord",
        icon: Svgl.Discord,
    },
    {
        uuid: "19334d5a-7da2-48d1-9450-200cf07d56c2",
        name: "Locofy",
        icon: Svgl.Locofy,
    },
    {
        uuid: "5987ff03-039d-492e-80ea-bba93504d1f5",
        name: "Strapi",
        icon: Svgl.Strapi,
    },
    {
        uuid: "8365ca04-abc0-462a-b251-3db93e16fcb8",
        name: "Figma",
        icon: Svgl.Figma,
    },
    {
        uuid: "8ed6b9ac-66b9-45b0-b746-6a64314595d4",
        name: "Spotify",
        icon: Svgl.Spotify,
    },
    {
        uuid: "0567ec98-e27f-4905-89fd-384d47012362",
        name: "WorkOS",
        icon: Svgl.WorkOSDark,
    },
    {
        uuid: "6babcce3-0155-4869-9f3f-0edd3a4f49a8",
        name: "Whop",
        icon: Svgl.WhopDark,
    },
    {
        uuid: "577db79b-1a66-4b81-a19d-17446b5fd919",
        name: "Postman",
        icon: Svgl.Postman,
    },
    {
        uuid: "37eb1db3-3d5d-413c-a599-836e09185037",
        name: "Algolia",
        icon: Svgl.Algolia,
    },
    {
        uuid: "cec37603-19a0-4439-bde8-9e392b860176",
        name: "YouTube",
        icon: Svgl.YouTube,
    },
    {
        uuid: "69275407-6961-414b-b207-d24f510407df",
        name: "Framer",
        icon: Svgl.FramerDark,
    },
    {
        uuid: "0756469e-5346-4570-9eb1-df978a4e2df3",
        name: "Netflix",
        icon: Svgl.Netflix,
    },
    {
        uuid: "c02d35b4-1165-4baa-8f86-b0461e46a2ff",
        name: "LinkedIn",
        icon: Svgl.LinkedIn,
    },
    {
        uuid: "df70f451-6626-4b18-b59e-650ce3bc207a",
        name: "Netlify",
        icon: Svgl.Netlify,
    },
    {
        uuid: "ab686a46-81f1-4854-b5ba-93769968f5d5",
        name: "MongoDB",
        icon: Svgl.MongoDB,
    },
    {
        uuid: "b1783a81-b9d8-48cc-970c-f7307e2c3ba3",
        name: "Fly",
        icon: Svgl.Fly,
    },
    {
        uuid: "6843f8cb-8553-4bad-9a28-64159f33c47f",
        name: "Rapid API",
        icon: Svgl.RapidAPI,
    },
    {
        uuid: "19517059-df35-4192-ae1a-a35fd0af0d57",
        name: "BuildShip",
        icon: Svgl.BuildShip,
    },
    {
        uuid: "d575efb7-eb33-4bbb-baf6-929cf492680a",
        name: "Twilio",
        icon: Svgl.Twilio,
    },
    {
        uuid: "a30c9d4d-17c1-4151-bf57-7551d9aa4c06",
        name: "Arc",
        icon: Svgl.ArcDarkSoftware,
    },
    {
        uuid: "4e7647ae-8d30-4b34-9029-6ea37d82417f",
        name: "GitHub Copilot",
        icon: Svgl.GitHubCopilotDark,
    },
    {
        uuid: "e9d67e23-9142-4c6b-a0ad-77896cad4a7f",
        name: "Railway",
        icon: Svgl.RailwayDark,
    },
    {
        uuid: "18ff69ad-56fc-46b8-8d27-660e6d400d63",
        name: "Twitch",
        icon: Svgl.Twitch,
    },
    {
        uuid: "34064314-d26c-4375-b8ec-a64f8692e8a0",
        name: "GoDaddy",
        icon: Svgl.GoDaddyDark,
    },
    {
        uuid: "90e89537-e8d2-4d77-bf0a-fda80a6b9fa7",
        name: "Grok",
        icon: Svgl.GrokDark,
    },
    {
        uuid: "bea8a48e-dc24-43dd-8c06-b9e3132afe5c",
        name: "GitLab",
        icon: Svgl.GitLab,
    },
    {
        uuid: "31da397e-907a-408f-97af-966b7005e83e",
        name: "Prisma",
        icon: Svgl.PrismaDark,
    },
    {
        uuid: "6f5056e7-54d0-475c-998f-c41f1fb26205",
        name: "Amazon Web Services",
        icon: Svgl.AmazonWebServicesDark,
    },
    {
        uuid: "876d4325-62d6-4b51-ac49-abda8aa82b67",
        name: "Microsoft Azure",
        icon: Svgl.MicrosoftAzure,
    },
    {
        uuid: "5ec73615-40ab-4128-aaa6-a51cb477828e",
        name: "Heroku",
        icon: Svgl.Heroku,
    },
    {
        uuid: "85e3cf88-5f31-4983-b37b-8f62d872a668",
        name: "JetBrains",
        icon: Svgl.JetBrainsColorful,
    },
    {
        uuid: "ae761593-d26f-4821-b7f4-38f2d0739cf7",
        name: "PlanetScale",
        icon: Svgl.PlanetScaleDark,
    },
    {
        uuid: "b90c46e1-17cd-4eba-925a-1962df745ed6",
        name: "Discourse",
        icon: Svgl.Discourse,
    },
    {
        uuid: "f7947716-b1c7-4ac2-8063-b5306eda1f52",
        name: "Expo",
        icon: Svgl.Expo,
    },
    {
        uuid: "a02d995d-8d40-4630-8885-fff3644971a4",
        name: "Auth0",
        icon: Svgl.Auth0,
    },
    {
        uuid: "e00b60b9-b189-4760-833c-b6ac5ee7de4c",
        name: "Hostgator",
        icon: Svgl.Hostgator,
    },
    {
        uuid: "cd8b5352-5a28-445c-8b61-df773d4e68b6",
        name: "IntelliJ IDEA",
        icon: Svgl.IntelliJIDEA,
    },
    {
        uuid: "65765796-4eef-484d-8b67-b3b64d71c313",
        name: "Material UI",
        icon: Svgl.MaterialUI,
    },
    {
        uuid: "43964553-c18e-4a1e-867b-709178d2065b",
        name: "PM2",
        icon: Svgl.PM2,
    },
    {
        uuid: "70ef9115-d896-486c-b6fb-2534155f5d3c",
        name: "Redis",
        icon: Svgl.Redis,
    },
    {
        uuid: "1c643ddc-64ba-4041-bfdb-af9c085878fa",
        name: "Unity",
        icon: Svgl.UnityDark,
    },
    {
        uuid: "0fd2ab95-99ae-4ee3-8c98-1dd1b6a037bd",
        name: "Digital Ocean",
        icon: Svgl.DigitalOcean,
    },
    {
        uuid: "2f00f1d0-9ef0-43f8-9133-856fb0420b7c",
        name: "Disney+",
        icon: Svgl.DisneyPlus,
    },
    {
        uuid: "b51c4c9e-619c-44d6-a694-e78ae4579f09",
        name: "Surrealdb",
        icon: Svgl.Surrealdb,
    },
    {
        uuid: "64cb3384-a279-49d6-b7b5-e70fa2eea2a7",
        name: "Cloudflare",
        icon: Svgl.Cloudflare,
    },
    {
        uuid: "5cbf31a4-030d-4423-98d2-effc781f2a4d",
        name: "Cloudinary",
        icon: Svgl.Cloudinary,
    },
    {
        uuid: "f5ffa8fe-0ba2-433e-ba61-ce30bf044582",
        name: "hCaptcha",
        icon: Svgl.HCaptcha,
    },
    {
        uuid: "78a72c59-2d16-441c-816f-ebd02cbdc600",
        name: "Appwrite",
        icon: Svgl.Appwrite,
    },
    {
        uuid: "1c317e12-ab26-49a1-b0cd-7a1bd9ea9e9f",
        name: "Loom",
        icon: Svgl.Loom,
    },
    {
        uuid: "b1075991-5d43-4b31-9cfa-c785d1caac0c",
        name: "Hulu",
        icon: Svgl.HuluDark,
    },
    {
        uuid: "ea010a14-a129-4956-bd41-abebc83f8166",
        name: "NHost",
        icon: Svgl.NHost,
    },
    {
        uuid: "49daf6bc-b4b6-4958-a215-0801d7cf0593",
        name: "Microsoft",
        icon: Svgl.Microsoft,
    },
    {
        uuid: "c3249781-f1bb-4925-ba4f-9d2a8ed081d2",
        name: "Elementor",
        icon: Svgl.Elementor,
    },
    {
        uuid: "9a3b0468-0998-4c5e-927e-fae776f2ef64",
        name: "Prime video",
        icon: Svgl.PrimeVideo,
    },
    {
        uuid: "b97bd52a-8b80-4d28-b379-d02bd1a21538",
        name: "Linear",
        icon: Svgl.Linear,
    },
    {
        uuid: "a8c1286f-c6db-4841-9d69-683f630e84a4",
        name: "Codesandbox",
        icon: Svgl.Codesandbox,
    },
    {
        uuid: "f2c325cd-5cc2-4088-a3b7-f5f0b5504102",
        name: "Obsidian",
        icon: Svgl.Obsidian,
    },
    {
        uuid: "3010cc77-0ce1-48b6-ac5c-45312ae1e082",
        name: "Dreamweaver",
        icon: Svgl.Dreamweaver,
    },
    {
        uuid: "1f5cf876-8cd5-4ba6-b3db-e4ab5a117ef5",
        name: "OpenAI",
        icon: Svgl.OpenAIDark,
    },
    {
        uuid: "6ade42fd-ed8d-4fa6-ac9c-0dfc39947936",
        name: "Codium",
        icon: Svgl.Codium,
    },
    {
        uuid: "7e7f0f48-ebcd-496d-b041-d26f70d03cbb",
        name: "Volta",
        icon: Svgl.VoltaDark,
    },
    {
        uuid: "f559883b-5f8a-4650-bb04-5a448d79c6ea",
        name: "X",
        icon: Svgl.XDark,
    },
    {
        uuid: "076a968a-6f5a-47ab-8e62-84cad42feb82",
        name: "Adobe",
        icon: Svgl.Adobe,
    },
    {
        uuid: "00c65db3-35fd-494a-93b9-3ba39052db50",
        name: "Canva",
        icon: Svgl.Canva,
    },
    {
        uuid: "1d78e370-0b89-4bab-8688-b1ebe528190d",
        name: "Hoppscotch",
        icon: Svgl.Hoppscotch,
    },
    {
        uuid: "f5b52159-6072-402a-836e-6bc320b15a71",
        name: "Datadog",
        icon: Svgl.Datadog,
    },
    {
        uuid: "027777fb-a12a-415a-b126-4696d7356370",
        name: "Beacon",
        icon: Svgl.Beacon,
    },
    {
        uuid: "49fd26f5-f2d3-4375-9f35-01839069e049",
        name: "Stately.ai",
        icon: Svgl.StatelyaiDark,
    },
    {
        uuid: "9fe7609e-38a3-498a-90f2-ce905517b707",
        name: "Hashnode",
        icon: Svgl.Hashnode,
    },
    {
        uuid: "2f5ed3e5-d3f2-43bc-8a89-e9ca19813a97",
        name: "Rowy",
        icon: Svgl.Rowy,
    },
    {
        uuid: "add71102-1241-4696-b8d7-714cb3b22b37",
        name: "Cal.com",
        icon: Svgl.CalcomDark,
    },
    {
        uuid: "c0a5e3c8-0fb4-49ae-bf1b-441047435570",
        name: "Calendly",
        icon: Svgl.Calendly,
    },
    {
        uuid: "60ce1df6-feb1-464e-9fbf-024a03413dbf",
        name: "Mintlify",
        icon: Svgl.Mintlify,
    },
    {
        uuid: "6f6da6c0-f6b2-44d1-9acc-b098e4521b66",
        name: "Patreon",
        icon: Svgl.PatreonDark,
    },
    {
        uuid: "0527c7aa-f805-408c-8306-964e80cd350d",
        name: "Warp",
        icon: Svgl.Warp,
    },
    {
        uuid: "d30c601b-1a2f-4a0d-9e44-fd90cbb3c49c",
        name: "Documenso",
        icon: Svgl.DocumensoDark,
    },
    {
        uuid: "4ba6dda8-3731-4632-abb7-8ccad223812b",
        name: "Instatus",
        icon: Svgl.InstatusDark,
    },
    {
        uuid: "28788d46-622a-4b26-afe7-7d30d1a75e82",
        name: "Front",
        icon: Svgl.Front,
    },
    {
        uuid: "ada1795b-094f-4798-b8a5-0a0017092266",
        name: "Axiom",
        icon: Svgl.AxiomDark,
    },
    {
        uuid: "a9f2c98b-e819-48e1-bc6b-969bc375c1e1",
        name: "Zeabur",
        icon: Svgl.ZeaburDark,
    },
    {
        uuid: "9efe1ce3-039b-42de-b821-f8f2f4bd0309",
        name: "putio",
        icon: Svgl.Putio,
    },
    {
        uuid: "de839d78-5cf9-4f78-9a5c-063844a705d3",
        name: "Pinterest",
        icon: Svgl.Pinterest,
    },
    {
        uuid: "c02b9d78-8898-406f-8c30-f14bbeaccd8c",
        name: "Reflex",
        icon: Svgl.ReflexDark,
    },
    {
        uuid: "33c3b9e5-2a06-483f-beaa-f225ce3739ce",
        name: "Axure",
        icon: Svgl.Axure,
    },
    {
        uuid: "2a22bc06-b7bf-4bb2-85c5-6fdede093a6b",
        name: "Penpot",
        icon: Svgl.PenpotDark,
    },
    {
        uuid: "86297804-4670-4950-a321-20382750f6e5",
        name: "Sketch",
        icon: Svgl.SketchDark,
    },
    {
        uuid: "0aebcd86-f3b7-4775-ba41-07bd9029e9d8",
        name: "Cypress",
        icon: Svgl.Cypress,
    },
    {
        uuid: "b042e033-282a-41a4-af78-b678e508046f",
        name: "Shopify",
        icon: Svgl.Shopify,
    },
    {
        uuid: "33734f51-98ff-49d4-abd9-40019b8b065d",
        name: "Webflow",
        icon: Svgl.Webflow,
    },
    {
        uuid: "86566661-9ee1-442a-bd41-56ae59e6d0da",
        name: "Sanity",
        icon: Svgl.Sanity,
    },
    {
        uuid: "fae9e32a-eb3a-4ecb-bcf4-a36a65229088",
        name: "Uber",
        icon: Svgl.UberDark,
    },
    {
        uuid: "36e57c07-49f4-4777-8fe9-a3460572c35c",
        name: "Slack",
        icon: Svgl.Slack,
    },
    {
        uuid: "3766b255-6f47-40e0-933e-8a238ba313de",
        name: "Raycast",
        icon: Svgl.Raycast,
    },
    {
        uuid: "ff480522-9834-4dde-b6d4-b83c2abe9241",
        name: "Cody",
        icon: Svgl.Cody,
    },
    {
        uuid: "3aae1151-530f-46f8-9886-7f03fe337776",
        name: "Sourcegraph",
        icon: Svgl.Sourcegraph,
    },
    {
        uuid: "b973afc2-ea99-4ea7-bf24-c96d2eca6623",
        name: "Perplexity AI",
        icon: Svgl.PerplexityAI,
    },
    {
        uuid: "90490260-a8a6-4157-a4a8-50d729ec3f5c",
        name: "Directus",
        icon: Svgl.Directus,
    },
    {
        uuid: "03ec0a09-4048-4084-9f90-329a6f70f9e3",
        name: "1Password",
        icon: Svgl.OnePasswordDark,
    },
    {
        uuid: "7ae5dcd3-cd43-40db-abfe-8ddc97253a22",
        name: "Bitwarden",
        icon: Svgl.Bitwarden,
    },
    {
        uuid: "ada03053-1c84-4ef9-b2a6-5f86d308941b",
        name: "Sentry",
        icon: Svgl.Sentry,
    },
    {
        uuid: "dd5e7f09-12a8-420b-9da8-7f65677239a2",
        name: "Grafana",
        icon: Svgl.Grafana,
    },
    {
        uuid: "49273826-170b-4f3e-85f0-5f065ee7054f",
        name: "Notion",
        icon: Svgl.Notion,
    },
    {
        uuid: "c108b01b-e0e6-4c0f-82bf-ed505d477aab",
        name: "Midday",
        icon: Svgl.Midday,
    },
    {
        uuid: "696cf6ed-c32f-46a1-b25c-14435ebd0ff6",
        name: "Youtube Music",
        icon: Svgl.YoutubeMusic,
    },
    {
        uuid: "ed835fda-3999-4ffc-8a02-68791dd4fe07",
        name: "TIDAL",
        icon: Svgl.TIDALDark,
    },
    {
        uuid: "413cc6cf-8520-46f1-8faa-44d976aae05a",
        name: "Ngrok",
        icon: Svgl.NgrokDark,
    },
    {
        uuid: "cab581ca-a1b7-4769-b0a0-4814c1cc2fe3",
        name: "Asana",
        icon: Svgl.Asana,
    },
    {
        uuid: "842a3faf-f7cc-4f22-85e7-b9d70f7ca8a6",
        name: "Zoom",
        icon: Svgl.Zoom,
    },
    {
        uuid: "fdc7d24b-a363-4619-8cd3-b9e5e8df2121",
        name: "Mistral AI",
        icon: Svgl.MistralAI,
    },
    {
        uuid: "65a8dc48-01e1-40f8-b176-6446a133dae5",
        name: "Raindrop.io",
        icon: Svgl.Raindropio,
    },
    {
        uuid: "0b350eb4-28b8-4a45-b8c0-f0129cf7d31a",
        name: "Supabase",
        icon: Svgl.Supabase,
    },
    {
        uuid: "ec60c4c0-602d-41b4-b1d5-25967a27f20d",
        name: "Hume AI",
        icon: Svgl.HumeAI,
    },
    {
        uuid: "6c1d710e-cd34-4409-8593-ca32e8cc0b4f",
        name: "Resend",
        icon: Svgl.ResendDark,
    },
    {
        uuid: "1d948c22-267d-488a-9dfa-f74b19906c5d",
        name: "Poper",
        icon: Svgl.Poper,
    },
    {
        uuid: "78981702-c7b5-4f21-a753-df5a7ad2826c",
        name: "Dub",
        icon: Svgl.DubDark,
    },
    {
        uuid: "9b8151eb-6099-41e9-8082-e4f17a2d440f",
        name: "Turso",
        icon: Svgl.TursoDark,
    },
    {
        uuid: "a6561bae-b322-4ba6-bd31-78e0d0884dfa",
        name: "Apple Music",
        icon: Svgl.AppleMusic,
    },
    {
        uuid: "d285d58b-9874-4af1-b867-d9158bb89ae6",
        name: "Todoist",
        icon: Svgl.Todoist,
    },
    {
        uuid: "517fa0fa-89f6-4e92-aa15-336285abae42",
        name: "Apidog",
        icon: Svgl.Apidog,
    },
    {
        uuid: "7dacdc24-dc89-40d4-aa26-f8048e5c46e1",
        name: "v0",
        icon: Svgl.V0Dark,
    },
    {
        uuid: "910f4803-5afb-4c10-ad77-b5c2c3c7c0b0",
        name: "Firebase",
        icon: Svgl.Firebase,
    },
    {
        uuid: "e2b7bf94-159d-4330-bca8-a42176b57085",
        name: "Nx",
        icon: Svgl.NxDark,
    },
    {
        uuid: "90e9f55b-70b6-4373-88c5-9c574b7c75c3",
        name: "Google Colaboratory",
        icon: Svgl.GoogleColaboratory,
    },
    {
        uuid: "64301111-97de-479c-9b4b-3cfd19e03e75",
        name: "Claude AI",
        icon: Svgl.ClaudeAI,
    },
    {
        uuid: "701207e8-5d60-4e85-a79c-482d6b267cdd",
        name: "Zed",
        icon: Svgl.ZedDark,
    },
    {
        uuid: "d4299c52-828c-40b2-9a8e-c541493c9cf2",
        name: "bolt",
        icon: Svgl.BoltDark,
    },
    {
        uuid: "a82dcee0-0c9e-4548-9e41-8776f1afa852",
        name: "Lottielab",
        icon: Svgl.Lottielab,
    },
    {
        uuid: "eb7990d4-4090-4408-a955-00c4003020ab",
        name: "Dropbox",
        icon: Svgl.Dropbox,
    },
    {
        uuid: "453b6167-6f2d-4fe6-8144-dd855577343d",
        name: "Vercel",
        icon: Svgl.VercelDark,
    },
    {
        uuid: "73e869c1-7c0d-4824-820f-831194f121b7",
        name: "Gemini",
        icon: Svgl.Gemini,
    },
    {
        uuid: "01d612ef-fd3c-48ef-a134-1104e6cf8e24",
        name: "Grok",
        icon: Svgl.GrokDark,
    },
    {
        uuid: "e2ff3305-51db-42a6-8290-cf9609ba8ed1",
        name: "Replit",
        icon: Svgl.Replit,
    },
    {
        uuid: "227e3afe-ea46-45b5-8a30-e2f7c5bd0de3",
        name: "Cursor",
        icon: Svgl.CursorDark,
    },
    {
        uuid: "b739bd4f-6826-4a69-8b3e-08532887f79d",
        name: "GitHub",
        icon: Svgl.GitHubDark,
    },
    {
        uuid: "75bbabf3-adb9-4ee0-953e-cd2bf0bf4b9e",
        name: "Firebase Studio",
        icon: Svgl.FirebaseStudio,
    },
    {
        uuid: "64e980ce-7868-410b-855f-a12c97c49e40",
        name: "Convex",
        icon: Svgl.Convex,
    },
    {
        uuid: "e79ce0fe-c585-48a8-9245-908dae3c5cc9",
        name: "Clerk",
        icon: Svgl.ClerkDark,
    },
    {
        uuid: "a8c6e199-1001-47c5-b4cb-d77ba7ba709e",
        name: "Perspective",
        icon: Svgl.PerspectiveDark,
    },
    {
        uuid: "b3ab066f-f4be-4342-94f1-e581f77d864c",
        name: "Lovable",
        icon: Svgl.Lovable,
    },
    {
        uuid: "87cb6bc0-acfd-48b8-a30c-57489b13cc0b",
        name: "Mocha",
        icon: Svgl.MochaDark,
    },
];
