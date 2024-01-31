"use client";
import React, { useState, useEffect } from "react";
import { db } from "@utils/firebaseConfig"; // Assuming db is the Firestore instance
import { collection, doc, getDoc } from "firebase/firestore";
import { AddCircle, LocationOn, Work } from "@mui/icons-material";
import { useRouter } from "next/navigation";

const Button = ({ id, name, onClick }) => {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/recruiter/profile/${id}`);
  };

  return (
    <button onClick={handleClick} className="cyan_btn">
      {name}
    </button>
  );
};

const PostedJobs = ({ jobIds }) => {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        // Convert the jobIds object keys to an array of IDs
        const idsArray = Object.values(jobIds);

        // Fetch each document individually using its ID
        const fetchedJobs = await Promise.all(
          idsArray.map(async (id) => {
            const userDocRef = doc(collection(db, "job_postings"), id);
            const docSnapshot = await getDoc(userDocRef);
            if (docSnapshot.exists()) {
              return docSnapshot.data();
            } else {
              return null;
            }
          })
        );

        // Filter out null values (documents that don't exist)
        const filteredJobs = fetchedJobs.filter((job) => job !== null);

        // Update the state with the fetched jobs
        setJobs(filteredJobs);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      }
    };

    fetchJobs();
  }, [jobIds]);

  return (
    <div className="px-5">
      <div className="flex flex-row items-center">
        <div className="flex flex-row mt-2 items-center w-1/2">
          <Work className="text-cyan-500" />
          <p className="pl-3 font-bold">Posted Jobs</p>
        </div>
      </div>

      <div className="flex flex-row gap-4 mt-3">
        {jobs.map((job, index) => (
          <div className="w-1/2 bg-gray-100 my-2" key={index}>
            <div
              id="header"
              className="bg-gradient-to-r from-blue-600 to-cyan-500  rounded-t-lg p-2 h-3/12 flex flex-col"
            >
              <h1 className="data-card-title">{job.job_title}</h1>
              <p className="data-card-company">{job.job_company}</p>
            </div>

            <div id="Body" className="h-7/12 border border-x-blue-400 p-3 h-32">
              <p className="text-xs ms-1 my-1 text-cyan-800 font-semibold">
                {job.job_location}
                <LocationOn
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
              {/* <button className="cyan_btn">Apply</button> */}
              <Button id={jobIds[index]} name={"View"} />
              <button className="cyan_btn">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PostedJobs;
