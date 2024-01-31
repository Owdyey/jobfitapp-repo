"use client";
import React, { useState, useEffect } from "react";
import { db } from "@utils/firebaseConfig"; // Assuming db is the Firestore instance
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import {
  AddCircle,
  LocationOn,
  VisibilityOutlined,
  Work,
} from "@mui/icons-material";
import { useRouter } from "next/navigation";

const Button = ({ id, name }) => {
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
const handleDelete = async (jobId, uid) => {
  try {
    const jobDocRef = doc(db, "job_postings", jobId);
    const userDocRef = doc(db, "recruiters", uid);

    // Get the user document data synchronously
    const userDocSnapshot = await getDoc(userDocRef);
    if (userDocSnapshot.exists()) {
      const userData = userDocSnapshot.data();
      const updatedArray = userData["job_posted"].filter(
        (item) => item !== jobId
      );

      // Update the job_posted array in the user document
      await updateDoc(userDocRef, { job_posted: updatedArray });
    }

    console.log("Item deleted from array successfully!");

    // Delete the job document
    await deleteDoc(jobDocRef);
  } catch (error) {
    console.error("Error deleting:", error.message);
  }
};

const PostedJobs = ({ jobIds, uid }) => {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const idsArray = Object.values(jobIds);
        const fetchedJobs = await Promise.all(
          idsArray.map(async (id) => {
            const userDocRef = doc(collection(db, "job_postings"), id);
            const docSnapshot = await getDoc(userDocRef);
            if (docSnapshot.exists()) {
              const jobData = docSnapshot.data();
              return { id, ...jobData, viewers: jobData.viewers || [] }; // Include viewers array, default to empty array if not present
            } else {
              return null;
            }
          })
        );
        const filteredJobs = fetchedJobs.filter((job) => job !== null);
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

      <div className="grid grid-cols-2 gap-3 mt-3 w-full">
        {jobs.map((job, index) => (
          <div className=" bg-gray-100 my-2" key={index}>
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
              className="p-2 h-2/12 rounded-b-lg flex gap-1 flex-row justify-between border border-t-0 border-x-blue-400 border-b-blue-400"
            >
              {/* <button className="cyan_btn">Apply</button> */}
              <div className="pl-2">
                <VisibilityOutlined className="text-cyan-800" fontSize="14" />
                <span className="text-cyan-800 text-xs pl-1">
                  {job.viewers.length}
                </span>
              </div>
              <div className="flex flex-row gap-1">
                <Button id={jobIds[index]} name={"View"} />
                <button
                  className="cyan_btn"
                  onClick={() => handleDelete(job.id, uid)}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PostedJobs;
