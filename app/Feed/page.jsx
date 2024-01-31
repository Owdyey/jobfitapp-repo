"use client";
import React, { useEffect, useState } from "react";
import { auth, db } from "@utils/firebaseConfig";
import { collection, onSnapshot } from "firebase/firestore";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import Filter from "@app/components/Filter";
import { useRouter } from "next/navigation";
import Button from "@app/components/Button";
import { onAuthStateChanged } from "firebase/auth";

const Cards = ({ onCardClick }) => {
  const [jobs, setJobs] = useState([]);
  const router = useRouter();
  const [uid, setUid] = useState(null);

  useEffect(() => {
    const jobCollection = collection(db, "job_postings");
    const unsubscribe = onSnapshot(jobCollection, (snapshot) => {
      const fetched_data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setJobs(fetched_data);
    });

    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUid(user.uid);
      }
    });

    return () => unsubscribe();
  }, []);
  return (
    <div className="w-full flex flex-col justify-center items-center">
      <div className="w-full mb-5">
        <Filter />
      </div>
      <div className="justify-self-center flex flex-col w-full items-center justify-center">
        {jobs.map((job) => (
          <div className="w-3/4 bg-gray-100 my-2" key={job.id}>
            <div
              id="header"
              className="bg-gradient-to-r from-blue-600 to-cyan-500  rounded-t-lg p-2 h-3/12 flex flex-col"
            >
              <h1 className="data-card-title">{job.job_title}</h1>
              <p className="data-card-company">{job.job_company}</p>
            </div>

            <div id="Body" className="h-7/12 border border-x-blue-400 p-3">
              <p className="text-xs ms-1 my-1 text-cyan-800 font-semibold">
                {job.job_location}
                <LocationOnIcon
                  className="text-cyan-600"
                  style={{ fontSize: 15 }}
                />
              </p>
              {job.job_type.map((type, index) => (
                <p
                  className="text-xs ms-1 my-1 text-cyan-800 font-semibold"
                  key={index}
                >
                  {type}
                </p>
              ))}
              {job.shift_and_schedule.map((shift, index) => (
                <p
                  className="text-xs ms-1 my-1 text-cyan-800 font-semibold"
                  key={index}
                >
                  {shift}
                </p>
              ))}
              <p className="text-xs ms-1 text-cyan-800 font-semibold m-1">
                {job.salary}
              </p>
            </div>

            <div
              id="footer"
              className="p-2 h-2/12 rounded-b-lg flex gap-1 flex-row justify-end border border-t-0 border-x-blue-400 border-b-blue-400"
            >
              <button className="cyan_btn">Apply</button>
              <Button id={job.id} name={"View"} uid={uid} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Cards;
