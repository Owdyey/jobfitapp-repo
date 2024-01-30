"use client";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { db, auth } from "@utils/firebaseConfig";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, signOut } from "firebase/auth";
import Avatar from "@mui/material/Avatar";
import { doc, onSnapshot } from "firebase/firestore";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

const Nav = () => {
  const router = useRouter();
  const [loginStatus, setLoginStatus] = useState(null);
  const [toggleUser, setToggleUser] = useState(false);
  const [profileimg, setProfileImg] = useState("");
  const [hasProfile, setHasProfile] = useState(false);
  const handleToggle = () => {
    setToggleUser(!toggleUser);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log("User is Logged Out:");
      setLoginStatus(false);
      setToggleUser(false);
      router.push("/");
    } catch (error) {
      console.log(error);
    }
  };

  const handleGoToProfile = () => {
    setToggleUser(!toggleUser);
    router.push("/profile");
  };

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        setLoginStatus(user);
        const uid = user.uid;
        console.log(uid);
        const documentRef = doc(db, "users", uid);

        const unsubscribeFirestore = onSnapshot(documentRef, (docSnapshot) => {
          if (docSnapshot.exists()) {
            const data = docSnapshot.data();
            if (data.profileimg) {
              setProfileImg(data.profileimg);
              setHasProfile(true);
            } else {
              setHasProfile(false);
            }
          } else {
            console.log("document don't exist");
          }
        });

        // Unsubscribe from Firestore changes when the component unmounts
        return () => {
          unsubscribeFirestore();
        };
      } else {
        setLoginStatus(null);
      }
    });

    // Unsubscribe from Auth changes when the component unmounts
    return () => {
      unsubscribeAuth();
    };
  }, []);

  return (
    <nav className="w-full flex flex-between p-5 relative z-50 border-blue-400">
      <Link href="/">
        <Image src={"/jobfitlogo.svg"} width={100} height={100} alt="logo" />
      </Link>
      {loginStatus ? (
        <div className="relative">
          <button onClick={handleToggle}>
            {hasProfile ? (
              <Avatar alt="Profile Image" src={profileimg} />
            ) : (
              <AccountCircleIcon
                className="text-cyan-600"
                style={{ fontSize: 40 }}
              />
            )}
          </button>
          {toggleUser && (
            <div className="border relative dropdown">
              <button className="dropdown_link" onClick={handleGoToProfile}>
                Profile
              </button>
              <button className="blue_btn w-full" onClick={handleLogout}>
                Logout
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-row gap-3">
          <Link href="/login">
            <button className="blue_login_btn">Login</button>
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Nav;
