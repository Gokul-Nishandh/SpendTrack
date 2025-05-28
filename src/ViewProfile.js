import React, { useEffect, useState } from 'react';

const ViewProfile = ({ userId }) => {
  const [userDetails, setUserDetails] = useState(null);
  const [error, setError] = useState('');

  const fetchUserProfile = async () => {
    try {
      const response = await fetch("http://localhost:8000/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ user_id: parseInt(userId) })
      });

      if (!response.ok) {
        throw new Error("Failed to fetch user profile");
      }

      const data = await response.json();
      setUserDetails(data);
    } catch (error) {
      console.error("Error fetching profile:", error);
      setError("Could not fetch user data. Try again later.");
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, [userId]);

  return (
    <main className="home" style={styles.container}>
      <h2 style={styles.heading}>👤 Your Profile</h2>

      {error && <p style={styles.error}>{error}</p>}

      {userDetails ? (
        <div style={styles.card}>
          <p style={styles.field}><strong>Name:</strong> {userDetails.name}</p>
          <p style={styles.field}><strong>Phone:</strong> {userDetails.phone}</p>
          <p style={styles.field}><strong>Date of Birth:</strong> {userDetails.dob}</p>
        </div>
      ) : (
        !error && <p style={styles.loading}>Loading your profile...</p>
      )}
    </main>
  );
};

const styles = {
  container: {
    padding: '40px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    backgroundColor: '#f8f9fa',
    minHeight: '100vh'
  },
  heading: {
    marginBottom: '20px',
    color: '#343a40',
    fontSize: '32px'
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    padding: '30px',
    boxShadow: '0 8px 20px rgba(0, 0, 0, 0.1)',
    width: '100%',
    maxWidth: '500px'
  },
  field: {
    fontSize: '18px',
    marginBottom: '15px',
    color: '#495057'
  },
  error: {
    color: '#e63946',
    fontWeight: 'bold',
    fontSize: '16px'
  },
  loading: {
    fontSize: '16px',
    color: '#6c757d'
  }
};

export default ViewProfile;
