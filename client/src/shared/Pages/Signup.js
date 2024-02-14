import React, { useState } from "react";
import axios from "axios";
import "../style/Signup.css";
import { useNavigate } from "react-router-dom";
const Signup = () => {
  const navigate = useNavigate();
  const [values, setValues] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
  });
  const handleInput = (event) => {
    setValues((prev) => ({
      ...prev,
      [event.target.name]: [event.target.value],
    }));
  };
  const handleSubmit = (event) => {
    event.preventDefault();
    axios
      .post("http://localhost:4000/signup", values)
      .then((res) => {
        navigate("/");
      })
      .catch((err) => alert("this Email address is already registed"));
  };

  return (
    <div className="signupContainer">
      <form className="form" onSubmit={handleSubmit}>
        <span className="signup">Sign Up</span>
        <input
          type="text"
          placeholder="Full name"
          className="form--input"
          name="name"
          onChange={handleInput}
          required
        />
        <input
          type="tel"
          placeholder="Your Phone"
          className="form--input"
          id="phone"
          name="phone"
          pattern="[0-9]{11}"
          onChange={handleInput}
          required
        />
        <input
          type="email"
          placeholder="Email address"
          className="form--input"
          name="email"
          onChange={handleInput}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="form--input"
          name="password"
          onChange={handleInput}
          required
        />
        <div className="form--marketing">
          <input id="okayToEmail" type="checkbox" required />
          <label htmlFor="okayToEmail" className="checkbox">
            I agree to the privacy policy.
          </label>
        </div>
        <button className="signupForm--submit">Sign Up</button>
      </form>
    </div>
  );
};

export default Signup;
