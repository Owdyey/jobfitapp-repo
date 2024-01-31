"use client";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { db, auth } from "@utils/firebaseConfig";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, signOut } from "firebase/auth";
import Avatar from "@mui/material/Avatar";
import { collection, doc, onSnapshot, getDoc } from "firebase/firestore";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

// ... (import statements)

const Nav = () => {
  const router = useRouter();
  const [loginStatus, setLoginStatus] = useState(null);
  const [toggleUser, setToggleUser] = useState(false);
  const [profileimg, setProfileImg] = useState("");
  const [hasProfile, setHasProfile] = useState(false);
  const [profileLink, setProfileLink] = useState(null);
  const [homeLink, setHomeLink] = useState("/");
  const [col, setCol] = useState(null);

  const handleToggle = () => {
    setToggleUser(!toggleUser);
  };

  const checkIfDocumentExists = async (collectionName, documentId) => {
    try {
      const collectionRef = collection(db, collectionName);
      const userDocRef = doc(collectionRef, documentId);
      const userDocSnapshot = await getDoc(userDocRef);
      return userDocSnapshot.exists();
    } catch (error) {
      console.error("Error checking document existence:", error);
      return false;
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log("User is Logged Out:");
      setLoginStatus(false);
      setToggleUser(false);
      setHomeLink("/");
      router.push("/");
    } catch (error) {
      console.error(error);
    }
  };

  const handleGoToProfile = () => {
    setToggleUser(false);
    router.push(profileLink);
  };

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        setLoginStatus(user);
        const uid = user.uid;

        (async () => {
          const exist = await checkIfDocumentExists("users", uid);
          if (exist) {
            setCol("users");
            setProfileLink("/profile");
            setHomeLink("/");
          } else {
            setCol("recruiters");
            setHomeLink("/recruiter"); // Update to point to the recruiter's home page
            setProfileLink("/recruiter/profile");
          }
        })();

        if (col && uid) {
          const documentRef = doc(db, col, uid);

          const unsubscribeFirestore = onSnapshot(
            documentRef,
            (docSnapshot) => {
              if (docSnapshot.exists()) {
                const data = docSnapshot.data();
                setHasProfile(data.profileimg ? true : false);
                setProfileImg(data.profileimg || ""); // Set an empty string if profileimg is not present
              } else {
                console.log("Document doesn't exist");
              }
            }
          );

          return () => {
            unsubscribeFirestore();
          };
        }
      } else {
        setLoginStatus(null);
      }
    });

    return () => {
      unsubscribeAuth();
    };
  }, [col]);

  return (
    <nav className="w-full flex flex-between p-5 relative z-50 border-blue-400">
      <Link href={homeLink}>
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
            <button className="cyan_login_btn">Login</button>
          </Link>
          <Link href="/recruiter/login">
            <button className="white_login_btn">Post Jobs</button>
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Nav;
