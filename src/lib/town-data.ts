/** Demo civic data for Millbrook — replace with Convex tables when wiring live sources. */

export const fiscalYear = 'FY 2026'

export const budgetSummary = {
  fiscalYear,
  totalAppropriations: 18_420_000,
  totalRevenue: 17_960_000,
  propertyTaxShare: 0.54,
  lastUpdated: '2026-03-12',
}

export const budgetDepartments = [
  {
    name: 'Public Works',
    appropriation: 4_820_000,
    spent: 2_910_000,
    notes: 'Roads, water mains, and winter operations.',
  },
  {
    name: 'Police',
    appropriation: 3_640_000,
    spent: 2_205_000,
    notes: 'Patrol, dispatch, and school resource officers.',
  },
  {
    name: 'Schools transfer',
    appropriation: 5_100_000,
    spent: 2_550_000,
    notes: 'Town contribution to the regional school district.',
  },
  {
    name: 'Fire & EMS',
    appropriation: 1_980_000,
    spent: 1_120_000,
    notes: 'Career staff, apparatus lease, and mutual aid.',
  },
  {
    name: 'Library & recreation',
    appropriation: 890_000,
    spent: 410_000,
    notes: 'Branch hours, summer programs, park maintenance.',
  },
  {
    name: 'General government',
    appropriation: 1_990_000,
    spent: 980_000,
    notes: 'Clerk, assessor, planning, and town hall operations.',
  },
] as const

export const staffDirectory = [
  {
    name: 'Elena Vargas',
    title: 'Town Manager',
    department: 'Administration',
    email: 'evargas@millbrook.example',
    phone: '(555) 014-2100',
  },
  {
    name: 'Marcus Hill',
    title: 'Finance Director',
    department: 'Finance',
    email: 'mhill@millbrook.example',
    phone: '(555) 014-2112',
  },
  {
    name: 'Priya Desai',
    title: 'Town Clerk',
    department: 'Clerk',
    email: 'pdesai@millbrook.example',
    phone: '(555) 014-2104',
  },
  {
    name: 'James Okafor',
    title: 'Police Chief',
    department: 'Police',
    email: 'jokafor@millbrook.example',
    phone: '(555) 014-2201',
  },
  {
    name: 'Sara Nguyen',
    title: 'Public Works Director',
    department: 'Public Works',
    email: 'snguyen@millbrook.example',
    phone: '(555) 014-2308',
  },
  {
    name: 'Tom Reese',
    title: 'Fire Chief',
    department: 'Fire & EMS',
    email: 'treese@millbrook.example',
    phone: '(555) 014-2402',
  },
] as const

export const debtIssues = [
  {
    name: 'Water treatment upgrade',
    principal: 6_400_000,
    rate: 0.032,
    maturity: 2041,
    annualService: 412_000,
    purpose: 'Plant modernization and PFAS filtration.',
  },
  {
    name: 'Fire station renovation',
    principal: 2_150_000,
    rate: 0.028,
    maturity: 2036,
    annualService: 186_000,
    purpose: 'Bay expansion and crew quarters.',
  },
  {
    name: 'Road bond 2022',
    principal: 3_800_000,
    rate: 0.035,
    maturity: 2037,
    annualService: 298_000,
    purpose: 'Arterial resurfacing and culvert replacement.',
  },
] as const

export const communityPosts = [
  {
    id: 'post-1',
    author: 'Helen Cho',
    neighborhood: 'West Mill',
    title: 'Can we get a crosswalk at Maple & 4th?',
    body: 'School traffic is heavy at drop-off. Would the board consider a painted crosswalk and signage before fall?',
    createdAt: '2026-03-28',
    replies: 12,
    status: 'open' as const,
  },
  {
    id: 'post-2',
    author: 'Public Works',
    neighborhood: 'Town-wide',
    title: 'Hydrant flushing schedule — April 7–11',
    body: 'Expect temporary discoloration. Run cold taps until clear. Map of zones is attached to the agenda packet.',
    createdAt: '2026-03-26',
    replies: 4,
    status: 'official' as const,
  },
  {
    id: 'post-3',
    author: 'Derek Ames',
    neighborhood: 'Riverside',
    title: 'Library Sunday hours restored?',
    body: 'Glad to see the budget draft includes Sunday hours again. Is that locked in for FY26?',
    createdAt: '2026-03-22',
    replies: 8,
    status: 'answered' as const,
  },
] as const

export function formatUsd(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatPct(ratio: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    maximumFractionDigits: 1,
  }).format(ratio)
}
