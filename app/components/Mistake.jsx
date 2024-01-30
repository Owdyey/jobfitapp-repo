import Link from "next/link";
import React from "react";

const Mistake = () => {
  return (
    <div className="text-center">
      It appears that you've logged in with an account designated for Applicant
      users. Click here to proceed to
      <Link href="/">
        <span className="text-blue-500"> applicant's dashboard.</span>
      </Link>
    </div>
  );
};

export default Mistake;
