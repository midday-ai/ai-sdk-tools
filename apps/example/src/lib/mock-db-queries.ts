// Mock database queries that mirror your real @db/queries
export interface BurnRateData {
  value: number;
  date: string;
}

export interface SpendingData {
  name: string;
  slug: string;
  amount: number;
  percentage: number;
}

export async function getBurnRate(
  db: any,
  params: { teamId: string; from: string; to: string; currency?: string }
): Promise<BurnRateData[]> {
  console.log(`[MockDB] getBurnRate called for team ${params.teamId}`);
  
  // Simulate database delay
  await new Promise(resolve => setTimeout(resolve, 100));
  
  // Generate realistic burn rate data
  const data: BurnRateData[] = [];
  const startDate = new Date(params.from);
  const endDate = new Date(params.to);
  
  let current = new Date(startDate);
  while (current <= endDate) {
    data.push({
      value: Math.floor(Math.random() * 50000) + 15000, // 15k-65k burn rate
      date: current.toISOString().slice(0, 7), // YYYY-MM format
    });
    current.setMonth(current.getMonth() + 1);
  }
  
  return data;
}

export async function getRunway(
  db: any,
  params: { teamId: string; from: string; to: string; currency?: string }
): Promise<number> {
  console.log(`[MockDB] getRunway called for team ${params.teamId}`);
  
  // Simulate database delay
  await new Promise(resolve => setTimeout(resolve, 80));
  
  return Math.floor(Math.random() * 18) + 6; // 6-24 months runway
}

export async function getSpending(
  db: any,
  params: { teamId: string; from: string; to: string; currency?: string }
): Promise<SpendingData[]> {
  console.log(`[MockDB] getSpending called for team ${params.teamId}`);
  
  // Simulate database delay
  await new Promise(resolve => setTimeout(resolve, 120));
  
  return [
    { name: "Engineering", slug: "engineering", amount: 35000, percentage: 45 },
    { name: "Marketing", slug: "marketing", amount: 20000, percentage: 26 },
    { name: "Operations", slug: "operations", amount: 12000, percentage: 15 },
    { name: "Sales", slug: "sales", amount: 8000, percentage: 10 },
    { name: "Other", slug: "other", amount: 3000, percentage: 4 },
  ];
}
