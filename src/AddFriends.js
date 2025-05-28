import React, { useState } from 'react';

const AddFriends = ({ userId }) => {
    const [friendUsername, setFriendUsername] = useState("");
    const [message, setMessage] = useState("");
    const [isSuccess, setIsSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (friendUsername.trim() === "") {
            setMessage("Please enter a phone number");
            setIsSuccess(false);
            return;
        }

        try {
            const response = await fetch("http://127.0.0.1:8000/add-friend", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    user_id: userId,
                    phone: friendUsername
                })
            });

            const data = await response.json();

            if (response.ok) {
                setMessage(`✅ ${data.message || `Successfully added ${friendUsername} as your friend!`}`);
                setIsSuccess(true);
                setFriendUsername("");
            } else {
                setMessage(`❌ ${data.message || "Failed to add friend"}`);
                setIsSuccess(false);
            }

        } catch (error) {
            console.error("Error:", error);
            setMessage("❌ An error occurred while sending the request.");
            setIsSuccess(false);
        }
    };

    return (
        <main className="addfriendspage">
            <div className="addfriends-container">
                <h2>Add Friends</h2>
                <p className="instructions">
                    Enter your friend's phone number to send them a friend request.
                </p>
                
                <form onSubmit={handleSubmit} className="addfriends-form">
                    <input 
                        type="text" 
                        value={friendUsername}
                        onChange={(e) => setFriendUsername(e.target.value)}
                        placeholder="Enter friend's phone number" 
                        className="usernameinput" 
                    />
                    <button type="submit" className="submit-btn">
                        Send Request
                    </button>
                </form>
                
                {message && (
                    <p className={`message ${isSuccess ? 'success' : 'error'}`}>
                        {message}
                    </p>
                )}
            </div>
        </main>
    );
};

export default AddFriends;
