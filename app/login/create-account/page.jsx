"use client";
import Button from "@app/components/Button";
import {
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  TextField,
} from "@mui/material";
import { auth, db } from "@utils/firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { collection, doc, setDoc } from "firebase/firestore";
import Link from "next/link";
import React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";

const page = () => {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [field, setField] = useState(false);
  const [showError, setShowError] = useState(false);
  const [gender, setGender] = useState("Female");
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    fullName: "",
    location: "",
    contactNo: "",
    age: "",
  });

  const handleChange = (event) => {
    const { id, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleGender = (event) => {
    setGender(event.target.value);
  };

  const checkPasswordMatch = (value) => {
    if (value === "") {
      setError(false);
    } else if (value !== password) {
      setError(true);
    } else {
      setError(false);
    }
  };

  const handleCreate = async () => {
    if (
      formData.email === "" ||
      formData.fullName === "" ||
      formData.username === "" ||
      formData.location === "" ||
      formData.contactNo === "" ||
      formData.age === ""
    ) {
      setField(true);
    } else {
      setField(false);
      try {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          formData.email,
          password
        );
        const uid = userCredential.user.uid;
        console.log("Registered with: ", uid);

        const useDocRef = doc(db, "users", uid);
        await setDoc(useDocRef, {
          username: formData.username,
          email: formData.email,
          fullName: formData.fullName,
          gender: gender,
          location: formData.location,
          contactNo: formData.contactNo,
          age: formData.age,
        });

        console.log("Added to firestore ");
        router.push("/");
      } catch (error) {
        console.error("Error during registration:", error);
        setShowError(
          error.code === "auth/invalid-credential" ||
            error.code === "auth/missing-email" ||
            error.code === "auth/invalid-email"
        );
      }
    }
  };

  return (
    <section className="mt-5 pb-5 w-full flex justify-center">
      <div className="w-3/4 flex flex-col gap-3 rounded-lg px-3 pb-5 pt-3 border-2 border-blue-300 items-center">
        <h3 className="desc text-center">
          <span className="text-blue-600 font-bold">Create User Account</span>
        </h3>

        <div className="flex flex-row w-full gap-5 p-5">
          <div className="flex flex-col gap-5 w-1/2 ">
            <TextField
              id="fullName"
              label="Full name"
              variant="outlined"
              onChange={handleChange}
            />
            <TextField
              id="location"
              label="Location"
              variant="outlined"
              onChange={handleChange}
            />
            <TextField
              id="contactNo"
              label="Contact No."
              variant="outlined"
              onChange={handleChange}
            />
            <div className="flex flex-row justify-between">
              <TextField
                className="w-5/12"
                id="age"
                label="Age"
                variant="outlined"
                onChange={handleChange}
              />
              <FormControl>
                <FormLabel id="demo-controlled-radio-buttons-group">
                  Gender
                </FormLabel>
                <RadioGroup
                  aria-labelledby="demo-controlled-radio-buttons-group"
                  name="controlled-radio-buttons-group"
                  value={gender}
                  row
                  onChange={handleGender}
                >
                  <FormControlLabel
                    value="Female"
                    control={<Radio />}
                    label="Female"
                  />
                  <FormControlLabel
                    value="Male"
                    control={<Radio />}
                    label="Male"
                  />
                </RadioGroup>
              </FormControl>
            </div>
          </div>

          <div className="flex flex-col gap-5 w-1/2 ">
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
              onChange={(event) => setPassword(event.target.value)}
            />
            <TextField
              id="confirmPassword"
              label="Confirm Password"
              variant="outlined"
              type="password"
              onChange={(event) => checkPasswordMatch(event.target.value)}
            />

            {showError && (
              <p className="text-red-600">Invalid email or password</p>
            )}
          </div>
        </div>

        {showError && <p className="text-red-600">Invalid email or password</p>}
        {field && <p className="text-red-600">Field/s cannot be empty.</p>}
        {error && <p className="text-red-600">Passwords doesn't match.</p>}

        <div className="flex flex-col gap-2 w-2/5">
          <button className="orangelg_btn" onClick={handleCreate}>
            Next
          </button>
        </div>
      </div>
    </section>
  );
};

export default page;
