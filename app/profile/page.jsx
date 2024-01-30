"use client";
import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db, auth } from "@utils/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { Avatar } from "@mui/material";
import { Email, LocationOn, Person, Phone } from "@mui/icons-material";
import Link from "next/link";

const InformationFormat = ({ icon, data }) => {
  return (
    <div className="flex flex-row mt-2 items-center">
      <p className="text-cyan-500">{icon}</p>
      <p className="pl-3 text-sm">{data}</p>
    </div>
  );
};

const OtherInformation = ({ icon, label, value }) => {
  return (
    <div className="px-5 w-1/2">
      <div className="flex flex-row mt-2 items-center">
        <p className="text-cyan-500">{icon}</p>
        <p className="font-bold pl-3">{label}</p>
      </div>

      <div className="mt-2 ml-10 bg-cyan-500 p-2 rounded-md">
        <p className="text-white text-sm">{value}</p>
      </div>
    </div>
  );
};

const OtherInformationArray = ({ icon, label, value }) => {
  return (
    <div className="px-5 w-1/2">
      <div className="flex flex-row mt-2 items-center">
        <p className="text-cyan-500">{icon}</p>
        <p className="font-bold pl-3">{label}</p>
      </div>

      <div className="mt-2 ml-10 bg-cyan-500 p-2 rounded-md">
        {value.map((item, index) => (
          <li key={index} className="list-none text-white text-sm">
            {item}
          </li>
        ))}
      </div>
    </div>
  );
};

function checkData(data, set) {
  if (data) {
    set(!false);
  } else {
    false;
  }
}

const YourComponent = () => {
  const [isLogged, setIsLogged] = useState(null);
  const [skills, setSkills] = useState(null);
  const [address, setAddress] = useState(null);
  const [contact, setContact] = useState(null);
  const [fullName, setFullName] = useState(null);
  const [userData, setUserData] = useState({
    username: "",
    email: "",
    verification: "",
    profileImg: "",
    contactNo: "",
    address: "",
    fullname: "",
    skills: [],
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
              contactNo: data.contactNo,
              address: data.address,
              fullname: data.fullname,
              skills: data.skills,
            });

            checkData(data.skills, setSkills);
            checkData(data.fullname, setFullName);
            checkData(data.contactNo, setContact);
            checkData(data.address, setAddress);
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
    <section className="w-full h-full rounded-lg">
      {isLogged ? (
        <div className="flex flex-row justify-around">
          <div className="flex flex-col m-3 py-10 width-27 items-center rounded-md shadow-md bg-white h-full">
            <Avatar
              className="border-4 border-cyan-500 text-cyan-500"
              src={userData.profileImg}
              sx={{ width: 144, height: 144 }}
            />
            <div className="mt-3 flex flex-col">
              <p className="text-center font-bold">{`@${userData.username}`}</p>
              <InformationFormat icon={<Email />} data={userData.email} />
              {contact && (
                <InformationFormat icon={<Phone />} data={userData.contactNo} />
              )}
            </div>
          </div>

          <div className="m-3 py-3 width-73 rounded-md shadow-md bg-white h-screen">
            {fullName && (
              <OtherInformation
                icon={<Person />}
                label={"Full Name"}
                value={userData.fullname}
              />
            )}
            {address && (
              <OtherInformation
                icon={<LocationOn />}
                label={"Address"}
                value={userData.address}
              />
            )}

            {skills && (
              <OtherInformationArray
                icon={<LocationOn />}
                label={"Skills"}
                value={userData.skills}
              />
            )}
          </div>
        </div>
      ) : (
        <div className="w-full text-center">
          You're not logged in!{" "}
          <Link href="/login">
            <span className="text-blue-500 text-center">
              Click here to login
            </span>
          </Link>
        </div>
      )}
    </section>
  );
};

export default YourComponent;
