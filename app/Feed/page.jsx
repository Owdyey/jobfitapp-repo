"use client";

import { db } from "@utils/firebaseConfig";
import { collection, onSnapshot } from "firebase/firestore";

const fetch = async () => {
  const jobCollection = collection(db, "job_postings");
  let fetched_data = [];
  const unsubscribe = onSnapshot(jobCollection, (snapshot) => {
    fetched_data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    console.log(fetched_data);
  });

  return { data: fetched_data, unsubscribe };
};

const page = async () => {
  const data = fetch();
  console.log(data);
  return <div>hello</div>;
};

export default page;
