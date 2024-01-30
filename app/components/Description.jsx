import React from "react";
import FmdGoodIcon from "@mui/icons-material/FmdGood";
import WorkHistoryIcon from "@mui/icons-material/WorkHistory";
import WorkIcon from "@mui/icons-material/Work";
import PaidIcon from "@mui/icons-material/Paid";

const Description = ({
  id,
  job_title,
  job_company,
  job_location,
  salary,
  job_type,
  description,
  shift_and_schedule,
  responsibilities,
  qualifications,
}) => {
  return (
    <div className="h-full" key={id}>
      <div id="head" className="overflow-hidden">
        <div className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 p-3">
          <p className="desc_title">{job_title}</p>
          <p className="desc_small">{job_company}</p>
        </div>
        <div className="p-3">
          <div className="p-2 m-1">
            <p className="font-semibold">
              <FmdGoodIcon /> Location:{" "}
            </p>

            <div className="ms-16">
              <label className="details_text">{job_location}</label>
            </div>
          </div>

          <div className="p-2 ">
            <p className="font-semibold mb-1">
              <WorkIcon /> Job Type:{" "}
            </p>
            <div className="ms-16">
              {job_type.map((type, index) => (
                <label key={index} className="details_text m-1">
                  {type}
                </label>
              ))}
            </div>
          </div>
          <div className="p-2">
            <p className="font-semibold">
              <WorkHistoryIcon /> Job Schedule:{" "}
            </p>
            <div className="ms-16">
              {shift_and_schedule.map((shift, index) => (
                <label key={index} className="details_text m-1">
                  {shift}
                </label>
              ))}
            </div>
          </div>
          <div className="p-2">
            <p className="font-semibold">
              <PaidIcon /> Job Pay:
            </p>
            <label className="details_text">{salary}</label>
          </div>
        </div>
      </div>
      <div id="body">
        <p>{description}</p>
        <div>
          <p>
            <strong>Responsibilities:</strong>
          </p>
          {responsibilities.map((resp, index) => (
            <p key={index}>{resp}</p>
          ))}
        </div>
        <div>
          <p>
            <strong>Qualifications:</strong>
          </p>
          {qualifications.map((qual, index) => (
            <p key={index}>{qual}</p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Description;
