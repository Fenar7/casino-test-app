"use client";
import './dashboard.css';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

export default function AdminDashboard() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    time1number: '',
    time2number: '',
    time3number: '',
    time4number: '',
  });
  const [loading, setLoading] = useState(true); // Loading state
  const [buttonText, setButtonText] = useState('Save'); // Button text state

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setButtonText('Processing...'); // Change button text to "Processing..."
    const response = await fetch('/api/addTime1Number', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      alert('Data Added/Updated Successfully');
    } else {
      console.error('Failed to add data', response);
    }

    setButtonText('Save'); // Revert button text back to "Save"
  };

  useEffect(() => {
    const isAuthenticated = Cookies.get('admin-auth');
    if (!isAuthenticated) {
      router.push('/admin');
    } else {
      // Fetch data if authenticated
      const fetchData = async () => {
        try {
          const response = await fetch('/api/fetchData', {
            method: 'POST',
          }); // Adjust the API endpoint if necessary
          if (response.ok) {
            const data = await response.json();
            console.log('Fetched data:', data);

            // Update formData with the fetched data if needed
            setFormData({
              time1number: formatNumber(data.time1number),
              time2number: formatNumber(data.time2number),
              time3number: formatNumber(data.time3number),
              time4number: formatNumber(data.time4number),
            });
          } else {
            console.error('Failed to fetch data', response);
          }
        } catch (error) {
          console.error('Error fetching data:', error);
        } finally {
          setLoading(false); // Set loading to false after fetching is complete
        }
      };

      fetchData(); // Call the fetchData function
    }
  }, [router]);

  const handleLogout = () => {
    Cookies.remove('admin-auth');
    router.push('/admin');
  };

  const formatNumber = (number) => {
    // Return an empty string if the number is 0 or null, otherwise format it as a 4-digit string
    return (number === 0 || number === null) ? '' : String(number).padStart(4, '0');
  };

  return (
    <>
      <section className="dashboard-container-main container">
        <div className="heading d-flex align-items-center justify-content-between text-center margin-top margin-bottom">
          <h1>Admin Dashboard</h1>
          <div className="sidebar d-flex align-items-center">
            <a href="/admin/dashboard/history">History</a>
            <button onClick={handleLogout} className="btnn">Logout</button>
          </div>
        </div>

        <form className="d-flex flex-column align-items-center justify-content-center" onSubmit={handleSubmit}>
          <div className="row-main mg-top">
            <div className="form-group custom-select-wrapper">
              <label htmlFor="time1number">Time 1 Number 12:00 PM</label>
              <div className="custom-select-container">
                <input 
                  type="text" 
                  className="form-control custom-select" 
                  value={loading ? 'Loading...' : formData.time1number} 
                  onChange={handleChange} 
                  name="time1number"
                  disabled={loading} // Disable input while loading
                />
              </div>
            </div>
          </div>

          <div className="row-main mg-bottom">
            <div className="form-group custom-select-wrapper">
              <label htmlFor="time2number">Time 2 Number 2:00 PM</label>
              <div className="custom-select-container">
                <input 
                  type="text" 
                  className="form-control custom-select" 
                  value={loading ? 'Loading...' : formData.time2number} 
                  onChange={handleChange} 
                  name="time2number"
                  disabled={loading} // Disable input while loading
                />
              </div>
            </div>
          </div>

          <div className="row-main mg-bottom">
            <div className="form-group custom-select-wrapper">
              <label htmlFor="time3number">Time 3 Number 5:00 PM</label>
              <div className="custom-select-container">
                <input 
                  type="text" 
                  className="form-control custom-select" 
                  value={loading ? 'Loading...' : formData.time3number} 
                  onChange={handleChange} 
                  name="time3number"
                  disabled={loading} // Disable input while loading
                />
              </div>
            </div>
          </div>

          <div className="row-main mg-bottom">
            <div className="form-group custom-select-wrapper">
              <label htmlFor="time4number">Time 4 Number 7:00 PM</label>
              <div className="custom-select-container">
                <input 
                  type="text" 
                  className="form-control custom-select" 
                  value={loading ? 'Loading...' : formData.time4number} 
                  onChange={handleChange} 
                  name="time4number"
                  disabled={loading} // Disable input while loading
                />
              </div>
            </div>
          </div>

          <button type="submit" className="userlogin-button" disabled={loading || buttonText === 'Processing...'}>
            {buttonText}
          </button>
        </form>
      </section>
    </>
  );
}
