"use client";
import React, { useState } from "react";
import { TextField, useRadioGroup } from "@mui/material";
import { auth, db } from "@utils/firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Mistake from "@app/components/Mistake";
import { collection, doc, getDoc } from "firebase/firestore";

const LoginPage = () => {
  const router = useRouter();

  const checkIfDocumentExists = async (collectionName, documentId) => {
    try {
      const collectionRef = collection(db, collectionName);
      const userDocRef = doc(collectionRef, documentId);
      const userDocSnapshot = await getDoc(userDocRef);
      return userDocSnapshot.exists();
    } catch (error) {
      console.error("Error checking document existence:", error);
      return false;
    }
  };

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showError, setShowError] = useState(false);
  const [loginMistake, setLoginMistake] = useState(false);

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const userId = userCredential.user.uid;
      const documentExists = await checkIfDocumentExists("recruiters", userId);
      if (documentExists) {
        router.push("/recruiter");
      } else {
        setLoginMistake(true);
      }
    } catch (error) {
      console.error("Error during login:", error);
      setShowError(
        error.code === "auth/invalid-credential" ||
          error.code === "auth/user-not-found" ||
          error.code === "auth/wrong-password"
      );
    }
  };

  return (
    <section className="mt-16 w-full flex justify-center">
      {loginMistake ? (
        <Mistake />
      ) : (
        <div className="w-5/12 flex flex-col gap-3 rounded-lg px-10 pb-10 pt-3 border-2 border-blue-300">
          <h3 className="desc text-center mb-2">
            <span className="text-blue-600">Login Account</span>
          </h3>
          <div className="flex flex-col gap-5">
            <TextField
              id="email"
              label="Email"
              variant="outlined"
              onChange={(event) => setEmail(event.target.value)}
            />
            <TextField
              id="password"
              label="Password"
              type="password"
              variant="outlined"
              onChange={(event) => setPassword(event.target.value)}
            />
          </div>
          {showError && (
            <p className="text-red-600">Invalid email or password</p>
          )}
          <div className="flex flex-col gap-2">
            <button className="orangelg_btn mt-2" onClick={handleLogin}>
              <span className="text-lg flex">
                <span className="ps-1">Login</span>
              </span>
            </button>
            <p className="text-normal mt-5">
              Don't have an account?
              <Link href={"/recruiter/login/create-acc"}>
                <span className="text-blue-700"> Create an Account</span>
              </Link>
            </p>
          </div>
        </div>
      )}
    </section>
  );
};

export default LoginPage;
