"use client";
import { TextField } from "@mui/material";
import { useState, useEffect } from "react";
import {
  sendEmailVerification,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
} from "firebase/auth";
import { db, auth } from "@utils/firebaseConfig";
import { setDoc, doc } from "firebase/firestore";
import { useRouter } from "next/navigation";

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
  const [isEmailVerified, setIsEmailVerified] = useState(false);

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
      if (formData.email && formData.password) {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          formData.email,
          formData.password
        );

        // Send email verification
        await sendEmailVerification(userCredential.user);
        setUid(userCredential.user.uid);
      } else {
        // Handle case where email or password is missing
        console.error("Email and password are required.");
      }
    } catch (error) {
      console.error("Error signing up:", error.message);

      // Handle specific error cases
      if (error.code === "auth/invalid-credential") {
        setCredentialsNotValid(true);
      }
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUid(user.uid);
        setNotLogin(false);
        addUserToFirestore();
        router.push("/login/create-acc/verification");
      } else {
        setNotLogin(true);
      }
    });
    return () => unsubscribe();
  }, [uid]);

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
        <div className="w-5/12 flex flex-col gap-3 rounded-lg px-10 pb-10 pt-3 border border-orange-300">
          <h3 className="desc text-center mb-2">Create an Account</h3>
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
            {isNotMatch && (
              <p className="text-red-600">Password doesn't match</p>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <button
              className="orangelg_btn"
              type="button"
              onClick={handleSignup}
            >
              <span className="text-lg flex">
                <span className="pe-1">Create Account</span>
              </span>
            </button>
            <button className="bluelg_btn">
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
