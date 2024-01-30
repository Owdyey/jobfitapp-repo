"use client";
import { db } from "@utils/firebaseConfig";
import { doc, onSnapshot } from "firebase/firestore";
import React, { useState, useEffect } from "react";

const Page = ({ params }) => {
  const [id, setId] = useState(null);
  const [details, setDetails] = useState([]);

  useEffect(() => {
    // Use the first entry from params to set the id
    const [key, value] = Object.entries(params)[0];
    const documentRef = doc(db, "job_postings", value);
    const unsubscribeFirestore = onSnapshot(documentRef, (docSnapshot) => {
      if (docSnapshot.exists()) {
        const data = docSnapshot.data();
        setDetails({
          ...data,
        });
      } else {
        console.log("document don't exist");
      }
    });

    // Unsubscribe from Firestore changes when the component unmounts
    return () => {
      unsubscribeFirestore();
    };
  }, [params]);

  return <div></div>;
};

export default Page;
