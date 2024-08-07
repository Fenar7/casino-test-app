"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import './historybutton.css';

function HistoryButton() {
  const router = useRouter();

  const handleClick = () => {
    router.push('/user-history');
  };

  return (
    <>
      <button className="history-btn" onClick={handleClick}>History</button>
    </>
  );
}

export default HistoryButton;
