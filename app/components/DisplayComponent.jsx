import React from "react";
import Report from "@app/components/Report";

const DisplayComponent = ({ label, value }) => {
  return (
    <div className="border border-blue-600 rounded-lg flex flex-col justify-center items-center p-10">
      <Report value={value} />
      <p>{label}</p>
    </div>
  );
};

export default DisplayComponent;
