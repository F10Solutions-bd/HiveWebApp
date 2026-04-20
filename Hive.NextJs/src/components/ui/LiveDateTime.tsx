'use client';

import React, { useEffect, useState } from 'react';

function LiveDateTime() {
    const [currentDateTime, setCurrentDateTime] = useState<Date | null>(null);

    useEffect(() => {
        // Set initial value and start timer after client mounts
        setCurrentDateTime(new Date());

        const intervalId = setInterval(() => {
            setCurrentDateTime(new Date());
        }, 1000);

        return () => clearInterval(intervalId);
    }, []);

    if (!currentDateTime) {
        // Don't render anything on the server
        return null;
    }

    const formattedDateTime = currentDateTime.toLocaleString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    });

    return <div>{formattedDateTime}</div>;
}

export default LiveDateTime;
