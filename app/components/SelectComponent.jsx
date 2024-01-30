"use client";
import { useState } from "react";

const SelectComponent = ({ title, choices }) => {
  const [toggle, setToggle] = useState(false);
  const [selected, setSelected] = useState(title);

  const handleChange = (event) => {
    setSelected(event.target.value);
    setToggle(!toggle);
  };

  const handleToggle = () => {
    setToggle(!toggle);
  };

  return (
    <div className="relative">
      <button onClick={handleToggle} className="blue_btn">
        {selected}
      </button>
      {toggle && (
        <div className="dropdown relative">
          {choices.map((choice) => (
            <button
              value={choice}
              className="dropdown_link"
              onClick={handleChange}
            >
              {choice}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SelectComponent;

// (<div className="dropdown">
//     <button
//       onClick={handleChange}
//       className="dropdown_link"
//       value={"one"}
//     >
//       One
//     </button>
//   </div>
// )
