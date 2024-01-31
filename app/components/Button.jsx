import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  arrayUnion,
  collection,
  doc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { db } from "@utils/firebaseConfig";

const Button = ({ id, name, uid }) => {
  const router = useRouter();

  const handleClick = async () => {
    if (uid) {
      const documentRef = doc(db, "job_postings", id);

      await updateDoc(documentRef, {
        viewers: arrayUnion(uid),
      });

      console.log("User added as a viewer!");
    }

    router.push(`/Feed/${id}`);
  };

  return (
    <button onClick={handleClick} className="cyan_btn">
      {name}
    </button>
  );
};

export default Button;
