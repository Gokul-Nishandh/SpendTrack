import React, { useEffect, useState } from "react";
import { IoMdHappy, IoMdSad, IoMdAlert } from "react-icons/io";

const SetBudget = ({ userId, total }) => {
  const [budget, setBudget] = useState(""); 
  const [tempBudget, setTempBudget] = useState(""); 
  const [status, setStatus] = useState("normal");

  // Fetch budget from backend
  useEffect(() => {
    const fetchBudget = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/budget", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user_id: userId }),
        });

        const data = await response.json();
        if (data.budget) {
          setBudget(data.budget);
        }
      } catch (error) {
        console.error("Error fetching budget:", error);
      }
    };

    fetchBudget();
  }, [userId]);

  // Update status when budget or total changes
  useEffect(() => {
    if (budget) {
      const budgetVal = parseFloat(budget);
      if (total > budgetVal) {
        setStatus("over");
      } else if (total >= 0.9 * budgetVal) {
        setStatus("near");
        alert("⚠️ You're nearing your budget limit!");
      } else {
        setStatus("normal");
      }
    }
  }, [budget, total]);

  const currentDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  const daysLeft = () => {
    const today = new Date();
    const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    return lastDay.getDate() - today.getDate();
  };

  const handleEmoji = () => {
    if (status === "over") return <IoMdSad color="red" size={24} />;
    if (status === "near") return <IoMdAlert color="orange" size={24} />;
    return <IoMdHappy color="green" size={24} />;
  };

  const addBudget = async () => {
    if (!tempBudget) {
      alert("Please enter a budget amount.");
      return;
    }

    const budgetAmount = parseFloat(tempBudget);
    if (isNaN(budgetAmount) || budgetAmount <= 0) {
      alert("Please enter a valid budget amount.");
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:8000/add-budget", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: userId,
          amt: budgetAmount,
        }),
      });

      const data = await response.json();

      setBudget(budgetAmount);
      setTempBudget("");
      alert(`Budget Set: ₹${budgetAmount}`);
    } catch (error) {
      console.error("Error setting budget:", error);
      alert("Failed to set budget. Please try again.");
    }
  };

  return (
    <main className="set-budget-page">
      <div className="set-budget-page1">
        <div className="day-info">
          <p className="cur-date">📅 Current Date: {currentDate()}</p>
          <p className="days-left">⏳ Days Left: {daysLeft()}</p>
        </div>

        <div className="budget-info">
          <p>
            Your Budget:{" "}
            <span style={{ color: status === "over" ? "red" : "black" }}>
              {budget ? `₹${budget}` : "Not Set"}
            </span>
          </p>
          <p>Status: {handleEmoji()}</p>
        </div>

        <div className="set-budget">
          <input
            type="number"
            placeholder="Enter your budget"
            value={tempBudget}
            onChange={(e) => setTempBudget(e.target.value)}
          />
          <button type="button" onClick={addBudget}>
            Set Budget
          </button>
        </div>
      </div>
    </main>
  );
};

export default SetBudget;
