import { useEffect, useState } from 'react';
import { getLoads } from '../services/dashboard';
import { LoadFilter } from '../types';

export const useLoads = (filter: LoadFilter) => {
    const [data, setData] = useState([]);
    const [totalCount, setTotalCount] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetch = async () => {
            setLoading(true);
            try {
                const res = await getLoads(filter);
                setData(res.data?.items || []);
                setTotalCount(res.data?.totalCount || 0);
            } catch (error) {
                console.error("Failed to fetch loads:", error);
            } finally {
                setLoading(false);
            }
        };
        fetch();
    }, [filter]);

    return { data, totalCount, loading };
};