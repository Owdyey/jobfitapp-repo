"use client";
import SelectComponent from "./SelectComponent";
const Filter = () => {
  return (
    <section className="mt-5">
      <div className="flex flex-row justify-between">
        <div className="w-1/2 flex justify-around items-center">
          <div className="w-1/3 flex flex-row justify-center">
            <SelectComponent
              title={"Job Type"}
              choices={["Full-Time", "Part-Time"]}
            />
          </div>
          <div className="w-1/3 flex flex-row justify-center">
            <SelectComponent
              title={"Date Posted"}
              choices={["Newest", "This Week"]}
            />
          </div>
          <div className="w-1/3 flex flex-row justify-center">
            <SelectComponent
              title={"Shift"}
              choices={["Day-Shift", "Night-Shift"]}
            />
          </div>
        </div>
        <div className="w-1/2 flex flex-row justify-end items-center gap-1 me-10">
          <input type="text" className="search_input" />
          <button className="rounded-lg border bg-cyan-600 py-2.5 px-5 text-center text-sm font-inter flex items-center justify-center text-white hover:bg-cyan-500">
            Search
          </button>
        </div>
      </div>
    </section>
  );
};

export default Filter;
