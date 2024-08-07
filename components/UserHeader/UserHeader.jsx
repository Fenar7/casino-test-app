"use client";

import React, { useEffect, useState } from 'react';
import './userheader.css';

function UserHeader() {
  const [dateTime, setDateTime] = useState({ date: '', time: 'Loading...' });

  const fetchServerTime = async () => {
    try {
        const response = await fetch('/api/getTime', {
            method: 'POST',
        });
        if (response.ok) {
            const data = await response.json();
            return new Date(data.serverTime);
        }
        throw new Error('Failed to fetch server time');
    } catch (error) {
        console.error(error);
        // return new Date(); // Fallback to client time
    }
};

  useEffect(() => {
    // Function to get the current local date and time
    const updateDateTime = async () => {
      const date = await fetchServerTime();
      const formattedDate = date.toLocaleDateString(); // Format the date
      const formattedTime = date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit', // Include seconds
        hour12: true
      });
      setDateTime({ date: formattedDate, time: formattedTime });
    };

    updateDateTime(); // Initial fetch
    const intervalId = setInterval(updateDateTime, 1000); // Update every second

    return () => clearInterval(intervalId); // Cleanup interval on component unmount
  }, []);

  return (
    <header className="user-header">
      <div className="time">{dateTime.time}</div>
      <div className="date">{dateTime.date}</div>
    </header>
  );
}

export default UserHeader;
