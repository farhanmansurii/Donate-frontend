import React, { useEffect, useState } from 'react';

const Loading = ({ isLoading }) => {
  const overlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(15, 20, 25, 0.8)', // Dark background with transparency
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999, // Ensure it appears above other content
    opacity: isLoading ? 1 : 0,
    transition: 'opacity 0.3s ease',
  };

  return (
    <div style={overlayStyle}>
      {isLoading && <ProgressBar />}
    </div>
  );
};

const ProgressBar = () => {
  const [progress, setProgress] = useState(0);
  const [amount, setAmount] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => (prev < 100 ? prev + 1 : prev));
      setAmount((prev) => (prev < 100 ? prev + Math.random() * 2 : prev));
    }, 20); // Adjust the speed of progress and amount increment

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ textAlign: 'center' }}>
      <div style={styles.amount}>${amount.toFixed(2)}</div>
      <div style={styles.progressContainer}>
        <div style={{ ...styles.progressBar, width: `${progress}%` }} />
      </div>
    </div>
  );
};

const styles = {
  amount: {
    fontSize: '24px',
    color: '#fff',
    marginBottom: '10px',
  },
  progressContainer: {
    width: '300px',
    height: '30px',
    backgroundColor: '#eee',
    borderRadius: '5px',
    overflow: 'hidden',
    position: 'relative',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#4CAF50', // Green color for the progress bar
    transition: 'width 0.2s ease-in-out', // Smooth transition for the filling effect
  },
};

export default Loading;