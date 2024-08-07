"use client";

import { useEffect, useState } from 'react';
import './userhistory.css';
import { useRouter } from 'next/navigation';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function UserHistory() {
    const router = useRouter();
    const [userHistoryData, setUserHistoryData] = useState([]);
    const [loading, setLoading] = useState(true); // Loading state

    useEffect(() => {
        fetchUserHistoryData();
    }, [router]);

    const fetchUserHistoryData = async () => {
        try {
            const response = await fetch('/api/userhistory', {
                method: 'POST',
            });
            if (response.ok) {
                const data = await response.json();
                setUserHistoryData(data);
            } else {
                console.error('Failed to fetch user history data');
            }
        } catch (error) {
            console.error('Error fetching user history data:', error);
        } finally {
            setLoading(false); // Set loading to false after fetching is complete
        }
    };

    const handleHomeClick = () => {
        router.push('/'); // Redirect to the home page
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = String(date.getFullYear()).slice(-2);
        return `${day}-${month}-${year}`;
    };

    const formatNumber = (number) => {
        return number ? String(number).padStart(4, '0') : 'N/A';
    };

    return (
        <>
            <section className="user-history-container container">
                <div className="heading d-flex align-items-center justify-content-between text-center margin-top margin-bottom">
                    <h1>History</h1>
                    <div className="sidebar d-flex align-items-center">
                        <button onClick={handleHomeClick} className="home-btn">Home</button>
                    </div>
                </div>

                <div className="user-history-table">
                    {loading ? (
                        <p className="text-center">Loading...</p> // Display loading text
                    ) : (
                        <table className="table table-striped">
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th className="time1">12 PM</th>
                                    <th className="time2">2 PM</th>
                                    <th className="time3">5 PM</th>
                                    <th className="time4">7 PM</th>
                                </tr>
                            </thead>
                            <tbody>
                                {userHistoryData.length > 0 ? (
                                    userHistoryData.map((item, index) => (
                                        <tr key={index}>
                                            <td className="date">{formatDate(item.date)}</td>
                                            <td className="time1">{formatNumber(item.time1number)}</td>
                                            <td className="time2">{formatNumber(item.time2number)}</td>
                                            <td className="time3">{formatNumber(item.time3number)}</td>
                                            <td className="time4">{formatNumber(item.time4number)}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="text-center">No user history data available.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
            </section>
        </>
    );
}
