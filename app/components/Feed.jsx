"use client";
import React, { useEffect, useState } from "react";
import Cards from "./Cards";
import { useRouter } from "next/navigation";

const Feed = () => {
  const router = useRouter();
  const [description, setDescription] = useState([]);
  const [id, setID] = useState(null);
  const onCardClick = (data) => {
    console.log(data);
    router;
    setID(data);
  };

  return (
    <section className="flex flex-row w-full justify-center mt-5 relative">
      <div className="w-full border">
        <Cards onCardClick={onCardClick} />
      </div>
    </section>
  );
};

export default Feed;
