import React, { useState, useEffect } from 'react';
import { Pie, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title
);

// Replace this with the actual logged-in user's ID

const TrackExpense = ({userId,total,setTotal}) => {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [expenseData, setExpenseData] = useState([]);
  const user_Id = userId; 

  useEffect(() => {
    getExpense();
  }, [selectedMonth, selectedYear]);

  const getExpense = () => {
    console.log(user_Id);
    fetch("http://127.0.0.1:8000/expense", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: user_Id })
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        console.log("Fetched data:", data); // Check what the backend actually returns
  
        // Handle if data is not an array
        if (!Array.isArray(data)) {
          console.error("Expected an array, but got:", data);
          setExpenseData([]); // Set to empty to avoid crashing
          return;
        }
  
        const filteredData = data
          .map((expense, index) => {
            const dateObj = new Date(expense.date);
            return {
              id: index,
              date: new Date(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate()).toISOString(),
              category: expense.category,
              amount: parseFloat(expense.amt),
              description: expense.description
            };
          });
  
        setExpenseData(filteredData);
        console.log(filteredData)
      })
      .catch(error => console.error("Error fetching expenses:", error));
  };
  
  const preparePieChartData = () => {
    const categories = {};
    expenseData.forEach(expense => {
      categories[expense.category] = (categories[expense.category] || 0) + expense.amount;
    });

    const categoryNames = Object.keys(categories);
    const categoryAmounts = Object.values(categories);

    return {
      labels: categoryNames,
      datasets: [
        {
          label: 'Spending by Category',
          data: categoryAmounts,
          backgroundColor: [
            'rgba(255, 99, 132, 0.7)',
            'rgba(54, 162, 235, 0.7)',
            'rgba(255, 206, 86, 0.7)',
            'rgba(75, 192, 192, 0.7)',
            'rgba(153, 102, 255, 0.7)',
            'rgba(255, 159, 64, 0.7)',
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)',
          ],
          borderWidth: 1,
        },
      ],
    };
  };

  const prepareLineChartData = () => {
    const dailyExpenses = {};
    expenseData.forEach(expense => {
      const date = new Date(expense.date);
      const day = date.getDate();
      dailyExpenses[day] = (dailyExpenses[day] || 0) + expense.amount;
    });

    const daysInMonth = new Date(selectedYear, selectedMonth, 0).getDate();
    const labels = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    const data = labels.map(day => dailyExpenses[day] || 0);

    return {
      labels,
      datasets: [
        {
          label: 'Daily Spending',
          data,
          fill: false,
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          tension: 0.1,
        },
      ],
    };
  };

  const pieData = preparePieChartData();
  const lineData = prepareLineChartData();

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

  const totalSpending = expenseData.reduce((sum, expense) => sum + expense.amount, 0);
  setTotal(totalSpending.toFixed(2));
  console.log(total);

  return (
    <main className="trackexpenses">
      <div className="header">
        <h1>Expense Tracking</h1>
        <div className="date-selectors">
          <select 
            value={selectedMonth} 
            onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
            className="month-selector"
          >
            {months.map((month, index) => (
              <option key={month} value={index + 1}>
                {month}
              </option>
            ))}
          </select>
          <select 
            value={selectedYear} 
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            className="year-selector"
          >
            {years.map(year => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="summary-card">
        <h3>Monthly Summary</h3>
        <p>Total Spending: <span className="amount">Rs. {totalSpending.toFixed(2)}</span></p>
        <p>Number of Transactions: <span className="count">{expenseData.length}</span></p>
      </div>

      <div className="charts-container">
        <div className="chart-section">
          <h2>Spending by Category</h2>
          <div className="chart-wrapper">
            <Pie 
              data={pieData} 
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: 'right',
                  },
                  tooltip: {
                    callbacks: {
                      label: function(context) {
                        const label = context.label || '';
                        const value = context.raw || 0;
                        const total = context.dataset.data.reduce((a, b) => a + b, 0);
                        const percentage = Math.round((value / total) * 100);
                        return `${label}: $${value.toFixed(2)} (${percentage}%)`;
                      }
                    }
                  }
                }
              }}
            />
          </div>
        </div>

        <div className="chart-section">
          <h2>Daily Spending</h2>
          <div className="chart-wrapper">
            <Line 
              data={lineData} 
              options={{
                responsive: true,
                scales: {
                  y: {
                    beginAtZero: true,
                    title: {
                      display: true,
                      text: 'Amount ($)'
                    }
                  },
                  x: {
                    title: {
                      display: true,
                      text: 'Day of Month'
                    }
                  }
                },
                plugins: {
                  tooltip: {
                    callbacks: {
                      label: function(context) {
                        return `$${context.raw.toFixed(2)}`;
                      }
                    }
                  }
                }
              }}
            />
          </div>
        </div>
      </div>
    </main>
  );
};

export default TrackExpense;
