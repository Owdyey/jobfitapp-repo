"use client";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { auth } from "@utils/firebaseConfig";
import { useRouter } from "next/navigation";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

const Nav = () => {
  const router = useRouter();
  const [loginStatus, setLoginStatus] = useState(null);
  const [toggleUser, setToggleUser] = useState(false);

  const handleToggle = () => {
    setToggleUser(!toggleUser);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log("User is Logged Out:");
      setLoginStatus(false);
      setToggleUser(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleGoToProfile = () => {
    setToggleUser(!toggleUser);
    router.push("/profile");
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setLoginStatus(user);
      } else {
        setLoginStatus(null);
      }
    });
    return () => unsubscribe();
  }, []);
  return (
    <nav className="w-full flex flex-between p-5">
      <Link href="/">
        <Image src={"/jobfitlogo.svg"} width={100} height={100} alt="logo" />
      </Link>
      {loginStatus ? (
        <div className="relative">
          <button onClick={handleToggle}>
            <AccountCircleIcon
              className="text-orange-600"
              style={{ fontSize: 40 }}
            />
          </button>
          {toggleUser && (
            <div className="border relative dropdown">
              <button className="dropdown_link" onClick={handleGoToProfile}>
                Profile
              </button>
              <button className="orange_btn w-full" onClick={handleLogout}>
                Logout
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-row gap-3">
          <Link href="/login">
            <button className="orange_btn">Login</button>
          </Link>
          <Link href="/login/create-acc">
            <button className="white_btn">Create an Account</button>
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Nav;
