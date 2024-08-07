"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import './style.css';

function HistoryPage() {
    const router = useRouter();
    const [historyData, setHistoryData] = useState([]);
    const [loading, setLoading] = useState(true); // Loading state

    useEffect(() => {
        const isAuthenticated = Cookies.get('admin-auth');
        if (!isAuthenticated) {
            router.push('/admin');
        } else {
            fetchHistoryData();
        }
    }, [router]);

    const fetchHistoryData = async () => {
        try {
            const response = await fetch('/api/history', {
                method: 'POST',
            });
            if (response.ok) {
                const data = await response.json();
                setHistoryData(data);
            } else {
                console.error('Failed to fetch history data');
            }
        } catch (error) {
            console.error('Error fetching history data:', error);
        } finally {
            setLoading(false); // Set loading to false after fetching is complete
        }
    };

    const handleLogout = () => {
        Cookies.remove('admin-auth');
        router.push('/admin');
    };

    const formatNumber = (number) => {
        return number ? String(number).padStart(4, '0') : 'N/A';
    };

    return (
        <>
            <section className="dashboard-container-main container">
                <div className="heading d-flex align-items-center justify-content-between text-center margin-top margin-bottom">
                    <h1>History</h1>
                    <div className="sidebar d-flex align-items-center">
                        <a href="/admin/dashboard/">Dashboard</a>
                        <button onClick={handleLogout} className="btnn">Logout</button>
                    </div>
                </div>

                <div className="history-list d-flex flex-column">
                    {loading ? (
                        <p>Loading...</p> // Display loading text while fetching data
                    ) : historyData.length > 0 ? (
                        historyData.map((item, index) => {
                            const formattedDate = new Date(item.date).toISOString().split('T')[0];
                            return (
                                <div key={index} className="history-item">
                                    <h2>Date: {formattedDate}</h2>
                                    <p className="time1">12 PM: {formatNumber(item.time1number)}</p>
                                    <p className="time2">2 PM: {formatNumber(item.time2number)}</p>
                                    <p className="time3">5 PM: {formatNumber(item.time3number)}</p>
                                    <p className="time4">7 PM: {formatNumber(item.time4number)}</p>
                                </div>
                            );
                        })
                    ) : (
                        <p>No history data available.</p>
                    )}
                </div>
            </section>
        </>
    );
}

export default HistoryPage;
