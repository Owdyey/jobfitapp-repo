import * as React from "react";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { TextField } from "@mui/material";
import { useState } from "react";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "80vw",
  height: "80vh",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export default function TransitionsModal({ handlePopup, show }) {
  const [open, setOpen] = React.useState(show);
  const handleClose = () => {
    handlePopup(false);
    setOpen(false);
  };

  const [formData, setFormData] = useState({
    description: "",
    job_company: "",
    job_location: "",
    job_title: "",
    job_type: [],
    qualifications: [],
    responsibility_items: [],
    salary: "",
    shift_and_schedule: [],
  });

  const handleChange = (event) => {
    const { id, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  return (
    <div>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={open}>
          <Box sx={style} className="flex flex-col border">
            <Typography id="transition-modal-title" variant="h6" component="h2">
              Post a job
            </Typography>
            <div className="w-full mt-5 flex flex-row gap-5">
              <TextField
                className="w-1/2"
                id="job_title"
                label="Job Title"
                variant="outlined"
                onChange={handleChange}
              />
              <TextField
                className="w-1/2"
                id="job_company"
                label="Job Company"
                variant="outlined"
                onChange={handleChange}
              />
              <TextField
                className="w-1/2"
                id="job_location"
                label="Job Location"
                variant="outlined"
                onChange={handleChange}
              />
            </div>
            <div className="w-full mt-5 flex flex-row gap-5">
              <TextField
                className="w-1/2"
                id="salary"
                label="Salary"
                variant="outlined"
                onChange={handleChange}
              />
              <TextField
                className="w-1/2"
                id="job_company"
                label="Job Company"
                variant="outlined"
                onChange={handleChange}
              />
              <TextField
                className="w-1/2"
                id="job_location"
                label="Job Location"
                variant="outlined"
                onChange={handleChange}
              />
            </div>
            <div className="self-end flex flex-row gap-1 mt-5">
              <button className="cyan_btn" onClick={handleClose}>
                submit
              </button>
              <button className="cyan_btn" onClick={handleClose}>
                close
              </button>
            </div>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
}
