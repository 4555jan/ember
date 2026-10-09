import type { Brief } from "@/types/brief";
import type { Category, Creator } from "@/types/creator";
import type { PortfolioItem, WorkflowStep } from "@/types/portfolio";

export const TOOLS = [
  "Midjourney", "Flux", "Stable Diffusion", "ComfyUI", "Runway", "Pika",
  "Claude", "ChatGPT", "ElevenLabs", "Suno", "Blender", "n8n",
];

export const creators: Creator[] = [
  { id: "c1", name: "Aria Voss", handle: "@ariavoss", headline: "Neon product shots that stop the scroll", bio: "Ex-packshot photographer turned prompt nerd. I build lighting rigs in ComfyUI and ship campaign-ready stills in a day.", category: "Image", tools: ["Midjourney", "Flux", "ComfyUI"], verified: true, commercialUse: true, rating: 4.9, jobs: 240, startingRate: 120, responseHours: 4, location: "Lisbon", score: 9840 },
  { id: "c2", name: "Kenji Mori", handle: "@kenjimori", headline: "Prompt-to-reel edits with real rhythm", bio: "Music-video editor who treats video models like a camera crew. Cuts to the beat, every time.", category: "Video", tools: ["Runway", "Pika", "ComfyUI"], verified: true, commercialUse: true, rating: 4.8, jobs: 186, startingRate: 300, responseHours: 8, location: "Osaka", score: 9610 },
  { id: "c3", name: "Priya Nair", handle: "@priyawrites", headline: "Brand voice that sounds like a person", bio: "Copywriter who trains models on your best old emails, then edits like a human. Ads, launch pages, email flows.", category: "Copy", tools: ["Claude", "ChatGPT"], verified: true, commercialUse: true, rating: 4.9, jobs: 312, startingRate: 80, responseHours: 3, location: "Mumbai", score: 9320 },
  { id: "c4", name: "Leo Fischer", handle: "@leoflows", headline: "Content pipelines that run while you sleep", bio: "I wire up generation, review and publishing so your team approves instead of produces.", category: "Automation", tools: ["n8n", "Claude", "ComfyUI"], verified: true, commercialUse: true, rating: 4.7, jobs: 98, startingRate: 250, responseHours: 12, location: "Berlin", score: 8990 },
  { id: "c5", name: "Sofia Reyes", handle: "@sofiadraws", headline: "Character art with a consistent face", bio: "Custom-trained styles so your mascot looks the same in poster one and poster fifty.", category: "Image", tools: ["Stable Diffusion", "Midjourney"], verified: false, commercialUse: true, rating: 4.8, jobs: 154, startingRate: 150, responseHours: 6, location: "Mexico City", score: 8760 },
  { id: "c6", name: "Omar Haddad", handle: "@omarvoice", headline: "Voiceovers in 30 languages, zero robot", bio: "Directing synthetic voices like a studio engineer. Podcasts, trailers, explainers.", category: "Voice", tools: ["ElevenLabs"], verified: true, commercialUse: false, rating: 4.6, jobs: 121, startingRate: 90, responseHours: 30, location: "Cairo", score: 8420 },
  { id: "c7", name: "Maya Chen", handle: "@mayamakes3d", headline: "Product renders without the render farm", bio: "Blender plus diffusion for turntables, packaging mockups and AR-ready assets.", category: "3D", tools: ["Blender", "ComfyUI", "Flux"], verified: true, commercialUse: true, rating: 4.9, jobs: 87, startingRate: 220, responseHours: 10, location: "Taipei", score: 8100 },
  { id: "c8", name: "Jonas Berg", handle: "@jonassound", headline: "Jingles, beds and sound logos", bio: "Short, catchy and cleared for ads. Stems included.", category: "Voice", tools: ["Suno", "ElevenLabs"], verified: false, commercialUse: true, rating: 4.7, jobs: 133, startingRate: 110, responseHours: 5, location: "Stockholm", score: 7790 },
];

const PROMPTS: Record<Category, string[]> = {
  Image: ["neon sneaker on wet asphalt, 35mm, rim light", "chrome koi fish in a vaporwave pond", "perfume bottle floating in pink smoke", "holographic soda can, pastel void", "street-style portrait, flash photography"],
  Video: ["15s launch reel, whip pans, beat-synced", "product orbit shot, golden hour", "anime-style intro for a podcast", "looping lava-lamp background", "teaser cut with kinetic type"],
  Copy: ["launch email sequence in a dry, funny voice", "five ad hooks for a sleep app", "landing page hero + FAQ", "founder story for an About page", "product descriptions for 40 SKUs"],
  Voice: ["warm narrator for a 3-minute explainer", "trailer voice, low and cinematic", "bilingual IVR greeting set", "8-second sound logo", "lo-fi jingle, 30 seconds"],
  "3D": ["turntable of a matte ceramic mug", "packaging mockup, holographic foil", "AR-ready sneaker model", "floating UI cards, isometric", "tiny diorama of a ramen shop"],
  Automation: ["daily social posts from one blog URL", "brief-to-draft pipeline with review gate", "auto-resize campaign art to 12 formats", "weekly newsletter from RSS + notes", "caption + alt-text batch tool"],
};

function workflowFor(c: Creator, i: number): WorkflowStep[] {
  const [t1, t2 = t1] = c.tools;
  return [
    { title: "Read the brief", detail: "Pulled mood, audience and must-haves into a one-page style sheet." },
    { title: "First pass", detail: `Generated ${12 + i * 4} options and shortlisted the strongest three.`, tool: t1 },
    { title: "Refine", detail: "Fixed hands, text and colour by hand, then upscaled.", tool: t2 },
    { title: "Deliver", detail: "Exported final files with the prompt log and licence note." },
  ];
}

export const portfolioItems: PortfolioItem[] = creators.flatMap((c, ci) =>
  PROMPTS[c.category].map((prompt, i) => ({
    id: `${c.id}-w${i + 1}`,
    creatorId: c.id,
    title: prompt.split(",")[0].replace(/^\w/, (m) => m.toUpperCase()),
    category: c.category,
    prompt,
    tools: c.tools.slice(0, 1 + ((i + ci) % c.tools.length)),
    artIndex: (ci + i) % 6,
    commercialUse: c.commercialUse,
    workflow: workflowFor(c, i),
    createdAt: new Date(2026, 5, 1 + i * 6 + ci).toISOString(),
  })),
);

export const briefs: Brief[] = [
  { id: "b1", ownerId: "seed", title: "Diwali sneaker drop", category: "Image", budget: 400, deadline: "3 days", description: "Six hero shots of a limited sneaker. Warm festival lights, wet street, shallow depth of field.", needsCommercialUse: true, status: "in_progress", progress: 55, hiredCreatorId: "c1", createdAt: "2026-10-01T10:00:00.000Z" },
  { id: "b2", ownerId: "seed", title: "Launch reel for Lumo lamp", category: "Video", budget: 900, deadline: "1 week", description: "20-second reel for social. Soft glow, slow orbit, ends on the logo. Needs a licensed track.", needsCommercialUse: true, status: "open", progress: 10, createdAt: "2026-10-05T10:00:00.000Z" },
];
