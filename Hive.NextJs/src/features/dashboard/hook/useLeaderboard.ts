import { useEffect, useRef, useState } from "react";
import { getLeaderboard, getOfficeLeaderboard } from "@/features/dashboard/services/dashboard";
import { LeaderboardItem, LeaderboardType } from "../types";

export const useLeaderboard = (
    type: LeaderboardType,
    dateRange: string
) => {
    const [data, setData] = useState<LeaderboardItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const requestIdRef = useRef(0);

    useEffect(() => {
        let isMounted = true;
        const requestId = ++requestIdRef.current;

        const fetchData = async () => {
            setLoading(true);
            setError(null);

            try {
                const res =
                    type === "office"
                        ? await getOfficeLeaderboard({
                            type,
                            dateFilterType: dateRange,
                        })
                        : await getLeaderboard({
                            type,
                            dateFilterType: dateRange,
                        });

                // prevent outdated response overwrite
                if (!isMounted || requestId !== requestIdRef.current) return;

                setData(res.data || []);
            } catch (err) {
                if (!isMounted || requestId !== requestIdRef.current) return;

                console.error(err);
                setError("Failed to fetch leaderboard");
            } finally {
                if (isMounted && requestId === requestIdRef.current) {
                    setLoading(false);
                }
            }
        };

        fetchData();

        return () => {
            isMounted = false;
        };
    }, [type, dateRange]);

    return { data, loading, error };
};