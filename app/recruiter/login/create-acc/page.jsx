"use client";
import React, { useState } from "react";
import { TextField } from "@mui/material";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { db, auth } from "@utils/firebaseConfig";
import { setDoc, doc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import Link from "next/link";

const SignupPage = () => {
  const [formData, setFormData] = useState({
    company_name: "",
    contact_no: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [isNotMatch, setIsNotMatch] = useState(false);
  const [credentialsNotValid, setCredentialsNotValid] = useState(false);
  const [notLogin, setNotLogin] = useState(true);
  const router = useRouter();
  const [showError, setShowError] = useState(false);

  const addUserToFirestore = async (uid) => {
    const userDocRef = doc(db, "recruiters", uid);
    await setDoc(userDocRef, {
      company_name: formData.company_name,
      contact_no: formData.contact_no,
      email: formData.email,
    });
  };

  const handleSignup = async () => {
    try {
      if (
        formData.email.trim() === "" ||
        formData.contact_no.trim() === "" ||
        formData.company_name.trim() === "" ||
        formData.password.trim() === "" ||
        formData.confirmPassword.trim() === ""
      ) {
        setShowError(true);
        return;
      }

      if (formData.password !== formData.confirmPassword) {
        setIsNotMatch(true);
        return;
      }

      const { email, password } = formData;
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const uid = userCredential.user.uid;
      await addUserToFirestore(uid);
      router.push("/recruiter");
    } catch (error) {
      console.error("Error signing up:", error.message);
      if (error.code === "auth/invalid-credential") {
        setCredentialsNotValid(true);
      }
    }
  };

  const handleChange = (event) => {
    const { id, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleConfirmPasswordChange = (event) => {
    const { value } = event.target;
    setIsNotMatch(value !== formData.password);
    setFormData((prevData) => ({
      ...prevData,
      confirmPassword: value,
    }));
  };

  return (
    <section className="w-full flex justify-center mt-5">
      {notLogin && (
        <div className="w-5/12 flex flex-col gap-3 rounded-lg px-10 pb-10 pt-3 border-2 border-blue-300">
          <h3 className="text-2xl text-gray-700 text-center mb-2">
            Create Recruiter Account
          </h3>
          {credentialsNotValid && (
            <div>
              <p className="text-red-600">Credentials Invalid!</p>
            </div>
          )}
          <div className="flex flex-col gap-5">
            <TextField
              id="company_name"
              label="Company name"
              variant="outlined"
              onChange={handleChange}
            />
            <TextField
              id="contact_no"
              label="Contact No."
              variant="outlined"
              onChange={handleChange}
            />
            <TextField
              id="email"
              label="Email"
              variant="outlined"
              onChange={handleChange}
            />
            <TextField
              id="password"
              label="Password"
              variant="outlined"
              type="password"
              onChange={handleChange}
            />
            <TextField
              id="confirmPassword"
              label="Confirm Password"
              variant="outlined"
              type="password"
              onChange={handleConfirmPasswordChange}
            />
            {showError && (
              <p className="text-red-600">All fields must be filled!</p>
            )}
            {isNotMatch && (
              <p className="text-red-600">Passwords don't match</p>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <button
              className="orangelg_btn text-lg"
              type="button"
              onClick={handleSignup}
            >
              <span className="text-lg">Create Account</span>
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default SignupPage;
