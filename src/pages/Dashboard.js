import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import jwt from "jsonwebtoken";

function Dashboard() {
  const navigate = useNavigate();

  const [quote, setQuote] = useState("");
  const [tempQuote, setTempQuote] = useState("");

  async function populateDashboard() {
    const req = await fetch("http://localhost:4000/api/quote", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": localStorage.getItem("token"),
      },
      body: JSON.stringify({
        quote: tempQuote,
      }),
    });

    const data = await req.json();
    if (data.status === "ok") {
      setQuote(data.quote);
    } else {
      alert(data.error);
    }
  }

  async function updateQuote(e) {
    e.preventDefault();
    const req = await fetch("http://localhost:4000/api/quote", {
      headers: {
        "x-access-token": localStorage.getItem("token"),
      },
    });

    const data = await req.json();
    if (data.status === "ok") {
      setQuote(tempQuote);
      setTempQuote("");
    } else {
      alert(data.error);
    }
  }

  // this checks to see if a user exists
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const user = jwt.decode(token);
      if (!user) {
        localStorage.removeItem("token");
        navigate("/login");
      } else {
        populateDashboard();
      }
    }
  }, []);

  return (
    <div>
      <h1>Your Quote: {quote || "No Quote Found!!!"}</h1>
      <form onSubmit={updateQuote}>
        <input
          type="text"
          placeholder="Quote"
          value={tempQuote}
          onChange={(e) => setTempQuote(e.target.value)}
        />
        <input type="submit" value="Update Quote" />
      </form>
    </div>
  );
}

export default Dashboard;
