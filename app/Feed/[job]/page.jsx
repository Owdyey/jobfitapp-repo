import React from "react";

const page = ({ params }) => {
  console.log(params, "asdasd");
  return <div>{params}</div>;
};

export default page;
