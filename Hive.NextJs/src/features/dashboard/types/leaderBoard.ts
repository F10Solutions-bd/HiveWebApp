
export type LeaderboardType = "sales" | "operator" | "office";
export interface LeaderboardItem {
    id: number;
    fullName: string;
    rank: number;
    loadCount: number;
    revenue: number;
    grossMargin: number;
    grossMarginPercent: number;
    type?: LeaderboardType;
}

export type LeaderboardFilter = {
    type?: LeaderboardType | null;
    dateFilterType?: string;
};