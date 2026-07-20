// Hand-built mock data for the Customers page (Phase 2 — static UI, no DB yet).
// Field names/enums mirror docs/data-model.md so this maps cleanly onto the
// real schema later. Consistency rules from that doc are enforced by
// construction, not filtered after the fact: FREE customers always have
// monthlyPrice 0, CANCELLED customers have a lastActive date well before
// today (they stopped engaging before they left, not the day they left).

export type Plan = "FREE" | "STARTER" | "PRO" | "ENTERPRISE";
export type SubscriptionStatus = "TRIALING" | "ACTIVE" | "PAST_DUE" | "CANCELLED";

export interface Customer {
  id: string;
  name: string;
  email: string;
  company: string;
  country: string;
  plan: Plan;
  status: SubscriptionStatus;
  monthlyPrice: number;
  signupDate: string;
  lastActive: string;
}

const PLAN_PRICE: Record<Plan, number> = {
  FREE: 0,
  STARTER: 29,
  PRO: 79,
  ENTERPRISE: 299,
};

// [name, email, company, country, plan, status, signupDate, lastActive]
const rows: Array<
  [string, string, string, string, Plan, SubscriptionStatus, string, string]
> = [
  ["Ava Thompson", "ava@brightlane.io", "Brightlane", "United States", "ENTERPRISE", "ACTIVE", "2025-01-14", "2026-07-10"],
  ["Liam Chen", "liam@forgeworks.co", "Forgeworks", "Canada", "PRO", "ACTIVE", "2025-02-02", "2026-07-11"],
  ["Sofia Rossi", "sofia@vetraio.it", "Vetraio Studio", "Italy", "PRO", "ACTIVE", "2025-02-20", "2026-07-09"],
  ["Noah Müller", "noah@kettlecraft.de", "Kettlecraft", "Germany", "STARTER", "TRIALING", "2026-06-28", "2026-07-11"],
  ["Isabella García", "isabella@puentelab.mx", "Puente Lab", "Mexico", "FREE", "ACTIVE", "2026-05-12", "2026-07-08"],
  ["Ethan Walker", "ethan@northstake.com", "Northstake", "United States", "ENTERPRISE", "ACTIVE", "2024-11-03", "2026-07-11"],
  ["Mia Dubois", "mia@atelierdub.fr", "Atelier Dub", "France", "PRO", "PAST_DUE", "2025-04-18", "2026-06-30"],
  ["Lucas Silva", "lucas@raizdigital.br", "Raiz Digital", "Brazil", "STARTER", "ACTIVE", "2025-06-09", "2026-07-10"],
  ["Charlotte Evans", "charlotte@millhouse.co.uk", "Millhouse", "United Kingdom", "PRO", "ACTIVE", "2025-01-27", "2026-07-11"],
  ["Yuki Tanaka", "yuki@kaerulabs.jp", "Kaeru Labs", "Japan", "ENTERPRISE", "ACTIVE", "2024-09-15", "2026-07-11"],
  ["Oliver Brown", "oliver@dunefield.au", "Dunefield", "Australia", "STARTER", "CANCELLED", "2025-03-11", "2026-05-02"],
  ["Emma Larsen", "emma@nordveil.no", "Nordveil", "Norway", "PRO", "ACTIVE", "2025-05-06", "2026-07-09"],
  ["Daniel Kim", "daniel@haneulsoft.kr", "Haneul Soft", "South Korea", "FREE", "ACTIVE", "2026-04-22", "2026-07-05"],
  ["Amelia Novak", "amelia@sklopraha.cz", "Sklo Praha", "Czechia", "STARTER", "ACTIVE", "2025-07-19", "2026-07-08"],
  ["James Carter", "james@ledgerline.com", "Ledgerline", "United States", "PRO", "ACTIVE", "2025-03-30", "2026-07-11"],
  ["Zara Ahmed", "zara@duneworks.ae", "Duneworks", "United Arab Emirates", "ENTERPRISE", "ACTIVE", "2024-12-08", "2026-07-10"],
  ["Henrik Berg", "henrik@fjordkit.se", "Fjordkit", "Sweden", "PRO", "PAST_DUE", "2025-04-02", "2026-06-25"],
  ["Chloe Martin", "chloe@papeterieco.fr", "Papeterie Co", "France", "FREE", "ACTIVE", "2026-06-01", "2026-07-11"],
  ["Ben Nguyen", "ben@lotusframe.vn", "Lotusframe", "Vietnam", "STARTER", "ACTIVE", "2025-08-14", "2026-07-07"],
  ["Grace Kelly", "grace@harborside.ie", "Harborside", "Ireland", "PRO", "ACTIVE", "2025-02-11", "2026-07-11"],
  ["Marco Bianchi", "marco@fontanella.it", "Fontanella", "Italy", "STARTER", "CANCELLED", "2025-05-23", "2026-04-14"],
  ["Priya Patel", "priya@indralabs.in", "Indra Labs", "India", "ENTERPRISE", "ACTIVE", "2024-10-19", "2026-07-11"],
  ["Lukas Wagner", "lukas@birkenhof.at", "Birkenhof", "Austria", "PRO", "ACTIVE", "2025-06-30", "2026-07-10"],
  ["Nora Eriksson", "nora@tallgrove.fi", "Tallgrove", "Finland", "FREE", "ACTIVE", "2026-03-09", "2026-06-28"],
  ["Adam Nowak", "adam@srebrnastal.pl", "Srebrna Stal", "Poland", "STARTER", "TRIALING", "2026-07-04", "2026-07-11"],
  ["Ines Alves", "ines@marfimstudio.pt", "Marfim Studio", "Portugal", "PRO", "ACTIVE", "2025-01-05", "2026-07-09"],
  ["Ryan O'Connell", "ryan@stonebridge.com", "Stonebridge", "United States", "ENTERPRISE", "PAST_DUE", "2024-08-27", "2026-07-01"],
  ["Hana Ito", "hana@shirokumaco.jp", "Shirokuma Co", "Japan", "STARTER", "ACTIVE", "2025-09-16", "2026-07-06"],
];

export const customers: Customer[] = rows.map(
  ([name, email, company, country, plan, status, signupDate, lastActive], i) => ({
    id: `cust_${String(i + 1).padStart(3, "0")}`,
    name,
    email,
    company,
    country,
    plan,
    status,
    monthlyPrice: PLAN_PRICE[plan],
    signupDate,
    lastActive,
  }),
);
