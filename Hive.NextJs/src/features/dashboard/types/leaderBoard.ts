export interface LeaderboardItem {
    id: number;
    fullName: string;
    rank: number;
    loadCount: number;
    revenue: number;
    grossMargin: number;
    grossMarginPercent: number;
}

export type LeaderboardFilter = {
    type?: string | null;
    dateFilterType?: string;
};

export interface OfficeLeaderboardItem {
    id: number;
    fullName: string;
    rank: number;
    loadCount: number;
    revenue: number;
    grossMargin: number;
    grossMarginPercent: number;
}