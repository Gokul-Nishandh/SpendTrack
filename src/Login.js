import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = ({userId,setUserId,userName,setUserName,isLoggedIn,setIsLoggedIn }) => {
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState("");
  const [dob, setDob] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (mobile && password) {
      try {

        const response = await fetch("http://127.0.0.1:8000/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            phone: mobile,
            password: password,
          }),
        });

        const data=await response.json();
        const user=data.name;
        setUserName(user);
        setUserId(data.user_id);

        
        if (response.ok) { 
            setIsLoggedIn(true);
            console.log("success login")
            navigate("/");
        } else {
          console.error("Login Request Failed:", data);
          alert("Login Request Failed: " + JSON.stringify(data));
        }
      } catch (error) {
        console.error("Login Error:", error);
        alert("An error occurred. Please try again.");
      }
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (name && dob && mobile && password) {
      try {
        const response = await fetch("http://127.0.0.1:8000/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: name,
            phone: mobile,
            password: password,
            dob: dob,
          }),
        });
        const data = await response.json();
        console.log(name, dob, mobile, password);
  
        if (response.ok) {
          setUserName(name);
          setUserId(data.user_id);
          setIsLoggedIn(true);
          navigate("/");
        } else if (response.status === 409) {
          alert("User already exists. Try logging in instead.");
        } else {
          console.error("Signup Request Failed:", data);
          alert("Signup Request Failed: " + JSON.stringify(data));
        }
      } catch (error) {
        console.error("Signup Error:", error);
        alert("An error occurred. Please try again.");
      }
    }
  };
  

  return (
    <div className="login-container">
      <div className="login-left">
        <h1>Spend Track</h1>
        <p>Optimize your personal finances</p>
      </div>

      <div className="login-form-container">
        <div className="profilebar1">
          <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
            {isSignUp ? "Sign Up" : "Login"}
          </h2>

          <form onSubmit={isSignUp ? handleSignUp : handleLogin}>
            {isSignUp && (
              <>
                <div className="form-group">
                  <label>User Name:</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Date of Birth:</label>
                  <input
                    type="date"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    required
                  />
                </div>
              </>
            )}

            <div className="form-group">
              <label>Mobile Number:</label>
              <input
                type="tel"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Password:</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              style={{
                width: "100%",
                padding: "12px 16px",
                borderRadius: "8px",
                cursor: "pointer",
                transition: "background 0.3s, color 0.3s",
                marginTop: "20px",
                background: "#443461",
                color: "white",
                border: "none",
                fontSize: "16px",
              }}
            >
              {isSignUp ? "Sign Up" : "Login"}
            </button>
          </form>

          <div
            onClick={() => setIsSignUp(!isSignUp)}
            style={{
              textAlign: "center",
              marginTop: "20px",
              cursor: "pointer",
              color: "#443461",
              textDecoration: "underline",
            }}
          >
            {isSignUp ? "Already have an account? Login" : "Need an account? Sign up"}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
