"use client";
// Import necessary modules and components
import React, { useState } from "react";
import { TextField } from "@mui/material";
import { auth } from "@utils/firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";

// Functional component for the login page
const LoginPage = () => {
  // Router instance
  const router = useRouter();

  // State variables for email, password, and error handling
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showError, setShowError] = useState(false);

  // Function to handle the login process
  const handleLogin = async () => {
    try {
      // Attempt to sign in with the provided email and password
      await signInWithEmailAndPassword(auth, email, password);

      // Redirect to the home page upon successful login
      router.push("/");
    } catch (error) {
      console.error("Error during login:", error);

      // Set showError to true based on specific error conditions
      setShowError(
        error.code === "auth/invalid-credential" ||
          error.code === "auth/missing-email" ||
          error.code === "auth/invalid-email"
      );
    }
  };

  return (
    <section className="lg:mt-24 w-full flex justify-center">
      <div className="w-5/12 flex flex-col gap-3 rounded-lg px-10 pb-10 pt-3 border border-orange-300">
        <h3 className="desc text-center mb-2">
          <span className="text-orange-600">Login Account</span>
        </h3>
        <div className="flex flex-col gap-5">
          {/* TextField for Email */}
          <TextField
            id="email"
            label="Email"
            variant="outlined"
            onChange={(event) => setEmail(event.target.value)}
          />
          {/* TextField for Password */}
          <TextField
            id="password"
            label="Password"
            type="password"
            variant="outlined"
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>
        {/* Display error message if showError is true */}
        {showError && <p className="text-red-600">Invalid email or password</p>}
        <div className="flex flex-col gap-2">
          {/* Button to trigger login */}
          <button className="orangelg_btn" onClick={handleLogin}>
            <span className="text-lg flex">
              <span className="ps-1">Login</span>
            </span>
          </button>
        </div>
      </div>
    </section>
  );
};

// Export the LoginPage component
export default LoginPage;
