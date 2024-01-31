"use client";
import React, { useState } from "react";
import { TextField } from "@mui/material";
import { useRouter } from "next/navigation";
import { addDoc, collection, doc, setDoc } from "firebase/firestore";
import { db, auth } from "@utils/firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";

const page = () => {
  const [email, setEmail] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [fields, setFields] = useState(false);
  const [error, setError] = useState(false);
  const router = useRouter();
  const checkPasswordMatch = (value) => {
    if (value === "") {
      setError(false);
    } else if (value !== password) {
      setError(true);
    } else {
      setError(false);
    }
  };

  const handleCreateAcc = async () => {
    if (
      email === "" ||
      password === "" ||
      companyName === "" ||
      phoneNumber === ""
    ) {
      setFields(true);
    } else {
      setFields(false);
      try {
        const userCred = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        const recruiterRef = doc(db, "recruiters", userCred.user.uid);
        const dataToUpload = {
          email: email,
          companyName: companyName,
          phoneNumber: phoneNumber,
          password: password,
        };
        await setDoc(recruiterRef, dataToUpload);
        router.push("/recruiter");
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <div className="w-full flex flex-row justify-center ">
      <div className="w-4/12 flex flex-col gap-3 rounded-lg px-10 pb-10 pt-3 border-2 border-blue-300">
        <h3 className="desc text-center mb-2">
          <span className="text-slate-600 font-semibold">
            Create Recruiter Account
          </span>
        </h3>
        <div className="flex flex-col gap-5">
          <TextField
            id="company_name"
            label="Company Name"
            variant="outlined"
            onChange={(event) => setCompanyName(event.target.value)}
            size="small"
          />
          <TextField
            id="phone_number"
            label="Phone Number"
            variant="outlined"
            onChange={(event) => setPhoneNumber(event.target.value)}
            size="small"
          />
          <TextField
            id="email"
            label="Email"
            variant="outlined"
            onChange={(event) => setEmail(event.target.value)}
            size="small"
          />
          <TextField
            id="password"
            label="Password"
            variant="outlined"
            onChange={(event) => {
              setPassword(event.target.value);
            }}
            size="small"
          />
          <TextField
            id="confirm_password"
            label="Confirm Password"
            type="password"
            variant="outlined"
            onChange={(event) => checkPasswordMatch(event.target.value)}
            size="small"
          />
          {error && <p className="text-red-600">Password doesn't match</p>}
          {fields && <p className="text-red-600">Fields must not be empty!</p>}
        </div>
        <button className="orangelg_btn mt-1" onClick={handleCreateAcc}>
          Create Account
        </button>
      </div>
    </div>
  );
};

export default page;
