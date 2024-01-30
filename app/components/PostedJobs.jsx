"use client";
import React, { useState, useEffect } from "react";
import { db } from "@utils/firebaseConfig"; // Assuming db is the Firestore instance
import { collection, doc, getDoc } from "firebase/firestore";

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
    <div>
      <h2>Posted Jobs:</h2>
      <ul>
        {jobs.map((job, index) => (
          <li key={index}>{job.job_title}</li>
        ))}
      </ul>
    </div>
  );
};

export default PostedJobs;
