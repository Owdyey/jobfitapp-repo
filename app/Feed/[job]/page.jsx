"use client";
import {
  ArrowCircleLeft,
  LocationOn,
  Paid,
  Work,
  WorkHistory,
} from "@mui/icons-material";
import { auth, db } from "@utils/firebaseConfig";
import { doc, onSnapshot } from "firebase/firestore";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";

const DetailInfo = ({ icon, label, data }) => {
  return (
    <div className="px-5">
      <div className="flex flex-row mt-2 items-center">
        <p className="text-cyan-500 ">{icon}</p>
        <p className="font-bold pl-1">{label}</p>
      </div>

      <div className="ml-9 mt-1">
        <p className="text-sm">{data}</p>
      </div>
    </div>
  );
};

const DetailInfoArray = ({ icon, label, data }) => {
  return (
    <div className="px-5">
      <div className="flex flex-row mt-2 items-center">
        <p className="text-cyan-500">{icon}</p>
        <p className="font-bold pl-1">{label}</p>
      </div>

      <div className="mt-1 ml-9 flex flex-row gap-3">
        {data.map((item, index) => (
          <li key={index} className="list-none text-sm underline">
            {item}
          </li>
        ))}
      </div>
    </div>
  );
};

const DetailBody = ({ label, data }) => {
  return (
    <div className="px-5 mt-5">
      <p className="font-bold pl-1 blue_gradient">{label}</p>
      <div className="mx-9 mt-1">
        <p className="text-sm text-justify">{data}</p>
      </div>
    </div>
  );
};

const DetailBodyArray = ({ label, data }) => {
  return (
    <div className="px-5 mt-5">
      <p className="font-bold blue_gradient">{label}</p>

      <div className="mt-1 mx-9">
        {data.map((item, index) => (
          <li key={index} className="text-sm text-justify">
            {item}
          </li>
        ))}
      </div>
    </div>
  );
};

const Page = ({ params }) => {
  const [id, setId] = useState(null);
  const [details, setDetails] = useState([]);
  const router = useRouter();
  const [uid, setUid] = useState(null);
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
      const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
        if (user) {
          setUid(user.uid);
        }
      });
    });

    // Unsubscribe from Firestore changes when the component unmounts
    return () => {
      unsubscribeFirestore();
    };
  }, [params]);
  const handleBack = () => {
    router.back();
    console.log("back");
  };
  return (
    <section className="w-full rounded-lg flex flex-col h-screen">
      <div className="w-2/3 self-center">
        <div className="bg_blue_gradient flex flex-row w-full rounded-t-md p-5 sticky top-0 items-center">
          <div className="w-5/6 flex flex-row items-center gap-4">
            <button onClick={handleBack}>
              <ArrowCircleLeft className="text-white text-3xl" />
            </button>

            <div className="items-start">
              <p className="desc_title">{details.job_title}</p>
              <p className="desc_small">{details.job_company}</p>
            </div>
          </div>
          <div className="w-1/6 flex flex-row justify-end">
            <button className="white_btn">Apply</button>
          </div>
        </div>
        <div className="bg-white pb-8">
          <div className="shadow-md py-3 flex flex-row">
            <div className="w-1/2">
              <DetailInfo
                icon={<LocationOn />}
                label={"Location"}
                data={details.job_location}
              />
              <DetailInfo
                icon={<Paid />}
                label={"Salary"}
                data={details.salary}
              />
            </div>
            <div className="w-1/2">
              {details.shift_and_schedule && (
                <DetailInfoArray
                  icon={<WorkHistory />}
                  label={"Shift and Schedule"}
                  data={details.shift_and_schedule}
                />
              )}

              {details.job_type && (
                <DetailInfoArray
                  icon={<Work />}
                  label={"Job Type"}
                  data={details.job_type}
                />
              )}
            </div>
          </div>

          <DetailBody label={"Job Description"} data={details.description} />
          {details.responsibility_items && (
            <DetailBodyArray
              label={"Duties and Responsibilities"}
              data={details.responsibility_items}
            />
          )}
          {details.qualifications && (
            <DetailBodyArray
              label={"Qualifications"}
              data={details.qualifications}
            />
          )}
        </div>
      </div>
    </section>
  );
};

export default Page;
