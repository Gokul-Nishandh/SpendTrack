import React, { useEffect, useState } from 'react';
import { IoMdClose } from 'react-icons/io';
import { Link } from 'react-router-dom';
import './ViewGroups.css';  

const ViewGroups = ({ userId }) => {
  const [groupModalVisible, setGroupModalVisible] = useState(false);
  const [expenseModalVisible, setExpenseModalVisible] = useState(false);
  const [friendModalVisible, setFriendModalVisible] = useState(false);

  const [groupName, setGroupName] = useState('');
  const [groups, setGroups] = useState([]);
  const [selectedGroupId, setSelectedGroupId] = useState(null);
  const [userFriends, setUserFriends] = useState([]);
  const [selectedFriends, setSelectedFriends] = useState([]);

  const [groupFriends, setGroupFriends] = useState([]);

  const [totalAmount, setTotalAmount] = useState('');
  const [amounts, setAmounts] = useState({}); // This will store amounts for each participant
  const [category, setCategory] = useState('');
  const [date, setDate] = useState('');
  const [paymentMode, setPaymentMode] = useState('Cash');

  useEffect(() => {
    if (userId) {
      showGroups();
      fetchFriends();
    }
  }, [userId]);

  const showGroups = () => {
    fetch("http://127.0.0.1:8000/grp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: userId })
    })
      .then(response => response.json())
      .then(data => setGroups(data))
      .catch(error => console.error("Error fetching groups:", error));
  };

  const fetchFriends = () => {
    fetch("http://127.0.0.1:8000/friends", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: userId })
    })
      .then(res => res.json())
      .then(data => {
        const allParticipants = [...data, { friend_id: userId, friend_name: "You" }];
        setUserFriends(allParticipants);
      })
      .catch(error => console.error("Error fetching friends:", error));
  };

  const fetchGroupFriends = async (grpId) => {
    try {
      const response = await fetch("http://127.0.0.1:8000/grp/friends", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ grp_id: grpId })
      });
      const data = await response.json();
      const withYou = data.map(friend => {
        const id = friend.user_id || friend.friend_id;
        const name = (id === userId) ? "You" : (friend.name || friend.friend_name);
        return { user_id: id, name };
      });
      
      const initialAmounts = {};
      withYou.forEach(friend => {
        initialAmounts[friend.user_id] = '';
      });
      setAmounts(initialAmounts);
      
      setGroupFriends(withYou);
      return withYou;
    } catch (error) {
      console.error("Error fetching group friends:", error);
      alert("Could not fetch group participants.");
      return [];
    }
  };
  const handleAmountChange = (userId, value) => {
    // Only update if the value is a valid number or empty string
    if (value === '' || !isNaN(value)) {
      setAmounts(prev => ({
        ...prev,
        [userId]: value
      }));    }
  };

  const handleGroupCreate = () => {
    if (!groupName) {
      alert("Please enter a group name.");
      return;
    }

    fetch("http://127.0.0.1:8000/add-grp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: userId, grp_name: groupName })
    })
      .then(response => response.json())
      .then(() => {
        alert("Group created successfully!");
        setGroupModalVisible(false);
        setGroupName('');
        showGroups();
      })
      .catch(err => {
        console.error("Error creating group:", err);
        alert("Something went wrong.");
      });
  };

  const handleAddFriends = async () => {
    if (!selectedGroupId || selectedFriends.length === 0) {
      alert("Please select friends to add.");
      return;
    }

    fetch("http://127.0.0.1:8000/grp/add-friends", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        grp_id: selectedGroupId,
        friends: selectedFriends
      })
    })
      .then(response => response.json())
      .then(() => {
        alert("Friends added successfully!");
        setSelectedFriends([]);
        setFriendModalVisible(false);
        showGroups();
      })
      .catch(error => {
        console.error("Error adding friends:", error);
        alert("Failed to add friends.");
      });
  };

  
  const handleAddExpense = async () => {
    const enteredTotal = parseFloat(totalAmount);
    const calculatedSum = Object.values(amounts).reduce((sum, amt) => sum + parseFloat(amt || 0), 0);

    if (isNaN(enteredTotal) || enteredTotal <= 0) {
      alert("Please enter a valid total amount.");
      return;
    }

    if (calculatedSum !== enteredTotal) {
      alert(`Split amounts must sum to ₹${enteredTotal}. Current total: ₹${calculatedSum}`);
      return;
    }

    // New validation
    const hasValidAmounts = Object.values(amounts).some(amt => parseFloat(amt || 0) > 0);
    if (!hasValidAmounts) {
      alert("Please enter amounts for at least one participant");
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:8000/grp/add-expense", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: userId,
          grp_id: selectedGroupId,
          amt: amounts,
          category: category,
          date: date || new Date().toISOString().split('T')[0],
          mode: paymentMode
        })
      });

      const data = await response.json();
      alert("Expense added successfully!");
      setExpenseModalVisible(false);
      setAmounts({});
      setTotalAmount('');
      setCategory('');
      setDate('');
      setGroupFriends([]);
    } catch (error) {
      console.error("Error adding expense:", error);
      alert("Failed to add expense.");
    }
  };

  useEffect(() => {
    if (expenseModalVisible && selectedGroupId) {
      fetchGroupFriends(selectedGroupId);
    }
  }, [expenseModalVisible, selectedGroupId]);

  const openFriendModal = async () => {
    if (!selectedGroupId) return;
    
    const currentGroupMembers = await fetchGroupFriends(selectedGroupId);
    const currentMemberIds = currentGroupMembers.map(member => member.user_id);
    setFriendModalVisible(true);
  };

  return (
    <main className="viewgroupspage">
      {expenseModalVisible && (
        <div className="modal">
        <h2>Add Expense to Group</h2>
        
        <div className="expense-form-fields">
          <div className="expense-form-field">
            <label>Total Amount</label>
            <input
              type="number"
              placeholder="₹0.00"
              value={totalAmount}
              onChange={(e) => setTotalAmount(e.target.value)}
            />
          </div>
          
          <div className="expense-form-field">
            <label>Category</label>
            <input
              type="text"
              placeholder="Dinner, Groceries, etc."
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
          </div>
          
          <div className="expense-form-field">
            <label>Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          
          <div className="expense-form-field">
            <label>Payment Mode</label>
            <select 
              value={paymentMode} 
              onChange={(e) => setPaymentMode(e.target.value)}
            >
              <option value="Cash">Cash</option>
              <option value="UPI">UPI</option>
              <option value="Card">Card</option>
            </select>
          </div>
        </div>

          <h3>Split Amounts Among Participants</h3>
          
          {groupFriends.map(friend => (
            
  <div key={friend.user_id} className="expense-input">
    <span>{friend.name}</span>
    <input
      type="number"
      placeholder="Amount"
      value={amounts[friend.user_id] || ''}
      onChange={(e) => handleAmountChange(friend.user_id, e.target.value)}
    />
  </div>
))}

          <div className="modal-buttons">
            <button
              onClick={handleAddExpense}
              disabled={!selectedGroupId || groupFriends.length === 0}
            >
              Add Expense
            </button>
            <button className="btn cancel" onClick={() => {
  setGroupFriends([]);
  setAmounts({});  // Reset amounts when closing modal
  setExpenseModalVisible(false);
}}>Cancel</button>
          </div>
        </div>
      )}

      {!groupModalVisible && (
        <div>
          <Link to="/"><div className="close"><IoMdClose /></div></Link>
          <button className="Addgroup" onClick={() => setGroupModalVisible(true)}>+ Create Group</button>
          <div className="title1">Your Groups</div>

          <div className="group-list">
            {groups.length === 0 ? (
              <p className="no-groups">No groups found.</p>
            ) : (
              groups.map(group => (
                <div
                  key={group.grp_id}
                  className={`group-item ${selectedGroupId === group.grp_id ? 'selected' : ''}`}
                  onClick={() => {
                    setSelectedGroupId(group.grp_id);
                    setSelectedFriends([]);
                  }}
                >
                  <div className="group-info">
                    <div className="group-name">{group.grp_name}</div>
                  </div>
                </div>
              ))
            )}
          </div>

          {selectedGroupId && (
            <div className="group-actions">
              <button className="btn" onClick={() => setExpenseModalVisible(true)}>Add Expense</button>
              <button className="btn" onClick={openFriendModal}>Add Friends</button>
            </div>
          )}
        </div>
      )}

      {groupModalVisible && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Create Group</h2>
            <input
              type="text"
              placeholder="Enter group name"
              className="input-field"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
            />
            <button className="btn" onClick={handleGroupCreate}>Create</button>
            <button className="btn cancel" onClick={() => setGroupModalVisible(false)}>Cancel</button>
          </div>
        </div>
      )}

{friendModalVisible && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Add Friends to Group</h2>
            <p>Select friends to add:</p>

            <div className="friend-list">
              {userFriends
                .filter(friend => friend.friend_id !== userId)
                .filter(friend => !groupFriends.some(gf => 
                  gf.user_id.toString() === friend.friend_id.toString()
                ))
                .map(friend => (
                  <div key={friend.friend_id} className="friend-checkbox">
                    <label>
                      <input
                        type="checkbox"
                        value={friend.friend_id}
                        checked={selectedFriends.includes(friend.friend_id)}
                        onChange={(e) => {
                          const friendId = friend.friend_id;
                          setSelectedFriends(prev =>
                            e.target.checked
                              ? [...prev, friendId]
                              : prev.filter(id => id !== friendId)
                          );
                        }}
                      />
                      {friend.friend_name}
                    </label>
                  </div>
                ))}
            </div>

            <button className="btn" onClick={handleAddFriends}>Add Selected Friends</button>
            <button className="btn cancel" onClick={() => {
              setSelectedFriends([]);
              setFriendModalVisible(false);
              fetchGroupFriends(selectedGroupId);
            }}>Cancel</button>
          </div>
        </div>
      )}
    </main>
  );
};

export default ViewGroups;