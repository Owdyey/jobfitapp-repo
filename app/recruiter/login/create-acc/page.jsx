"use client";
import { TextField } from "@mui/material";
import { useState, useEffect } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { db, auth } from "@utils/firebaseConfig";
import { setDoc, doc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import Link from "next/link";

const SignupPage = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    verified: false,
  });

  const [isNotMatch, setIsNotMatch] = useState(false);
  const [credentialsNotValid, setCredentialsNotValid] = useState(false);
  const [uid, setUid] = useState(null);
  const [notLogin, setNotLogin] = useState(true);
  const router = useRouter();
  const [showError, setShowError] = useState(false);

  const addUserToFirestore = async () => {
    if (uid) {
      const userDocRef = doc(db, "users", uid);
      await setDoc(userDocRef, {
        username: formData.username,
        email: formData.email,
        verified: formData.verified,
      });
    }
  };
  const handleSignup = async () => {
    try {
      if (
        formData.email !== "" ||
        formData.username !== "" ||
        formData.password !== "" ||
        formData.confirmPassword !== ""
      ) {
        if (formData.email && formData.password) {
          await createUserWithEmailAndPassword(
            auth,
            formData.email,
            formData.password
          );
          router.push("/login/create-acc/complete-profile");
        } else {
          console.error("Email and password are required.");
        }
      } else {
        setShowError(true);
      }
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

  const handleCreateAcc = () => {
    if (
      formData.email !== "" ||
      formData.username !== "" ||
      formData.password !== "" ||
      formData.confirmPassword !== ""
    ) {
      addUserToFirestore();
      setShowError(false);
      router.push("/login/create-acc/complete-profile");
    } else {
      setShowError(!false);
    }
  };

  return (
    <section className="w-full flex justify-center mt-5">
      {notLogin && (
        <div className="w-5/12 flex flex-col gap-3 rounded-lg px-10 pb-10 pt-3 border-2 border-blue-300">
          <h3 className="text-2xl text-gray-700 text-center mb-2">
            Create an Account
          </h3>
          {credentialsNotValid && (
            <div>
              <p className="text-red-600">Credentials Invalid!</p>
            </div>
          )}
          <div className="  flex flex-col gap-5 ">
            <TextField
              id="username"
              label="Username"
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
            {showError ? (
              <p className="text-red-600">Fields must be filled!</p>
            ) : (
              <p></p>
            )}
            {isNotMatch && (
              <p className="text-red-600">Password doesn't match</p>
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
            <button className="orangelg_btn">
              <span className="text-lg flex">
                <img
                  src="/assets/icons/google-icon.svg"
                  width={25}
                  alt="google"
                />
                <span className="ps-1">Login with Google</span>
              </span>
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default SignupPage;
