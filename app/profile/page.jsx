"use client";
import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db, auth } from "@utils/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";

const YourComponent = () => {
  const [isLogged, setIsLogged] = useState(null);
  const [userData, setUserData] = useState({
    username: "",
    email: "",
    verification: "",
    profileImg: "",
  });
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        const uid = user.uid;
        console.log(uid);
        const documentRef = doc(db, "users", uid);

        const unsubscribeFirestore = onSnapshot(documentRef, (docSnapshot) => {
          if (docSnapshot.exists()) {
            const data = docSnapshot.data();
            setIsLogged(data.verified);
            console.log(data);
            setUserData({
              username: data.username,
              email: data.email,
              verified: data.verified,
              profileImg: data.profileimg,
            });
          } else {
            console.log("document don't exist");
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
  }, []);

  return (
    <section className="bg-orange-600 w-full h-full rounded-lg">
      {isLogged ? (
        <div>
          <h1>User Data:</h1>
          <p>Username: {userData.username}</p>
          <p>Email: {userData.email}</p>
          <p>Verified: {userData.verified ? "Yes" : "No"}</p>
          <img
            src={userData.profileImg}
            width={400}
            height={400}
            alt="image here"
          />
        </div>
      ) : (
        <div>You're not Logged in!</div>
      )}
    </section>
  );
};

export default YourComponent;
