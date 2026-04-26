import { useEffect, useState } from 'react';
import { getLoads } from '../services/dashboard';
import { LoadFilter } from '../types';

export const useLoads = (filter: LoadFilter) => {
    const [data, setData] = useState([]);

    useEffect(() => {
        const fetch = async () => {
            const res = await getLoads(filter);
            setData(res.data?.items || []);
        };
        fetch();
    }, [filter]);

    return data;
};