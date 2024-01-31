"use client";
import PostedJobs from "@app/components/PostedJobs";
import { Email, Person, Phone, Work } from "@mui/icons-material";
import { Avatar } from "@mui/material";
import { auth, db } from "@utils/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import Popup from "@app/components/Popup";

const InformationFormat = ({ icon, data }) => {
  return (
    <div className="flex flex-row mt-2 items-center">
      <p className="text-cyan-500">{icon}</p>
      <p className="pl-3 text-sm">{data}</p>
    </div>
  );
};

const page = () => {
  const [isLogged, setIsLogged] = useState(null);
  const [popup, setPopup] = useState(false);
  const [userData, setUserData] = useState({
    companyName: "",
    email: "",
    contactNo: "",
    job_posted: [],
  });
  const handlePopup = (status) => {
    setPopup(status);
  };
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        const uid = user.uid;
        const documentRef = doc(db, "recruiters", uid);
        setIsLogged(true);
        const unsubscribeFirestore = onSnapshot(documentRef, (docSnapshot) => {
          if (docSnapshot.exists()) {
            const data = docSnapshot.data();
            setUserData({
              companyName: data.company_name,
              email: data.email,
              contactNo: data.contact_no,
              job_posted: data.job_posted,
            });
          } else {
            console.log("Document doesn't exist.");
          }
        });

        return () => {
          unsubscribeFirestore();
        };
      }
    });

    return () => {
      unsubscribeAuth();
    };
  }, []);

  return (
    <section className="w-full h-full rounded-lg">
      {popup && <Popup handlePopup={handlePopup} show={true} />}
      {isLogged ? (
        <div className="flex flex-row justify-around">
          <div className="flex flex-col m-3 py-10 width-27 items-center rounded-md shadow-md bg-white h-full">
            <Avatar
              className="border-4 border-cyan-500 text-cyan-500"
              src={userData.profileImg}
              sx={{ width: 144, height: 144 }}
            />
            <div className="mt-3 flex flex-col">
              <p className="text-center font-bold">{userData.companyName}</p>
              <InformationFormat icon={<Email />} data={userData.email} />
              {userData.contactNo && (
                <InformationFormat icon={<Phone />} data={userData.contactNo} />
              )}
            </div>
            <button onClick={() => setPopup(true)}>
              <AddIcon className="mt-6" />
              <p className="text-xs mt-2">Post Job</p>
            </button>
          </div>
          <div className="m-3 py-3 width-73 rounded-md shadow-md bg-white h-screen">
            {userData.job_posted ? (
              <PostedJobs jobIds={userData.job_posted} />
            ) : (
              <p className="text-center mt-8 text-slate-600 align-middle font-semibold">
                No job posted
              </p>
            )}
          </div>
        </div>
      ) : (
        <div className="w-full text-center">
          You're not logged in!{" "}
          <Link href="/login">
            <span className="text-blue-500 text-center">
              Click here to login
            </span>
          </Link>
        </div>
      )}
    </section>
  );
};

export default page;
