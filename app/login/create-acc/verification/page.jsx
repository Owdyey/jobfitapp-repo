"use client";
import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db, auth } from "@utils/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";

const YourComponent = () => {
  const [isFieldTrue, setIsFieldTrue] = useState(false);
  const [userData, setUserData] = useState({
    username: "",
    email: "",
    verification: "",
  });
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        const uid = user.uid;
        const documentRef = doc(db, "user", uid);

        const unsubscribeFirestore = onSnapshot(documentRef, (docSnapshot) => {
          if (docSnapshot.exists()) {
            const data = docSnapshot.data();
            setUserData({
              ...data,
            });
          }
        });

        // Unsubscribe from Firestore changes when the component unmounts
        return () => {
          unsubscribeFirestore();
        };
      }
    });

    // Unsubscribe from Auth changes when the component unmounts
    return () => {
      unsubscribeAuth();
    };
  }, []); // Empty dependency array means the effect runs once after the initial render

  useEffect(() => {
    // This effect will run whenever isFieldTrue changes
    console.log(isFieldTrue);
  }, [isFieldTrue]);

  return <div>{console.log(...userData)}</div>;
};

export default YourComponent;
