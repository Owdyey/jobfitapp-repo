"use client";
import React from "react";
import { TextField } from "@mui/material";
import { auth } from "@utils/firebaseConfig";
import { fetchSignInMethodsForEmail } from "firebase/auth";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";
const page = () => {
  const router = useRouter();
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [emailStatus, setEmailStatus] = useState(null);
  const [heading, setHeading] = useState("Login Account!");

  const emailCheck = async () => {
    console.log(email);
    try {
      const methods = await fetchSignInMethodsForEmail(auth, email);
      if (methods.length < 0) {
        console.log("methods are:", methods);
        setEmailStatus(true);
      } else {
        setEmailStatus(false);
        setHeading("Email not registered");
        console.log(methods);
      }
    } catch (error) {
      console.error("Error checking email:", error);
    }
  };
  return (
    <section className="lg:mt-24 w-full flex justify-center">
      <div className="w-5/12 flex flex-col gap-3 rounded-lg px-10 pb-10 pt-3 border border-orange-300">
        <h3 className="desc text-center mb-2 ">
          <span className="text-orange-600">{heading}</span>
        </h3>
        <div className="  flex flex-col gap-5 ">
          <TextField
            id="username"
            label="Username"
            variant="outlined"
            onChange={(event) => {
              const userEmail = event.target.value;
              setEmail(userEmail);
            }}
          />
          {emailStatus && (
            <TextField
              id="password"
              label="Password"
              type="password"
              variant="outlined"
              onChange={(event) => {
                const userPassword = event.target.value;
                setPassword(userPassword);
              }}
            />
          )}
        </div>
        <div className="flex flex-col gap-2">
          <button className="orangelg_btn" onClick={emailCheck}>
            <span className="text-lg flex">
              <span className="ps-1">Next</span>
            </span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default page;
