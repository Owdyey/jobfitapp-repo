import React from "react";
import { useRouter } from "next/navigation";

const Button = ({ id, name, onClick }) => {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/Feed/${id}`);
  };

  return (
    <button onClick={handleClick} className="cyan_btn">
      {name}
    </button>
  );
};

export default Button;
