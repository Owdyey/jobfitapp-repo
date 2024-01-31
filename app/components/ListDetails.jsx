import * as React from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";
import { TextField } from "@mui/material";
import { useState } from "react";
import { AddCircle } from "@mui/icons-material";
import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "@utils/firebaseConfig";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import axios from "axios";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 700,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3,
};

function ChildModal({ onAddItem, label }) {
  const [open, setOpen] = useState(false);
  const [item, setItem] = useState("");

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (event) => {
    setItem(event.target.value);
  };

  const handleAddItem = () => {
    if (item.trim() !== "") {
      onAddItem(item.trim());
      setItem("");
      setOpen(false);
    }
  };

  return (
    <React.Fragment>
      <button onClick={handleOpen}>
        <AddCircle className="text-cyan-500 pl-1" />
      </button>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="child-modal-title"
        aria-describedby="child-modal-description"
      >
        <Box sx={{ ...style, width: 500, height: 200 }}>
          <div className="mt-3">
            <p>{`Add ${label}`}</p>
          </div>
          <div className="mt-3">
            <TextField
              className="w-full"
              id={label}
              label={label}
              variant="outlined"
              value={item}
              onChange={handleChange}
            />
            <button onClick={handleAddItem} className="cyan_btn mt-2 mx-auto">
              Add
            </button>
          </div>
        </Box>
      </Modal>
    </React.Fragment>
  );
}

export default function NestedModal({ handlePopup, show, userData }) {
  const [open, setOpen] = React.useState(show);
  const [user, setUser] = useState(null);
  const [formData, setFormData] = React.useState({
    description: "",
    job_company: userData.companyName,
    job_location: "",
    job_title: "",
    job_type: [],
    qualifications: [],
    responsibility_items: [],
    salary: "",
    shift_and_schedule: [],
    job_category: null,
  });
  const handlePrediction = async (details) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/predict/category",
        {
          document: details,
        }
      );
      return response.data;
    } catch (error) {
      console.log(error);
    }
  };

  const getPrediction = (pred) => {
    if (!pred) return [];

    // Sort the predictions by value in descending order
    const sortedPredictions = Object.entries(pred).sort((a, b) => b[1] - a[1]);

    // Take the top 3 predictions
    const resultprediction = sortedPredictions.slice(0, 1);

    return resultprediction;
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    handlePopup(false);
    setOpen(false);
  };

  const handleChange = (event) => {
    const { id, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleAddItem = (item, field) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: [...prevData[field], item],
    }));
  };

  const addDataToFirestore = async (data, uid) => {
    try {
      const collectionRef = collection(db, "job_postings");
      const documentRef = doc(db, "recruiters", uid);

      // Add the new job postings to the "job_postings" collection
      const docRef = await addDoc(collectionRef, data);
      console.log("Document added with ID:", docRef.id);

      // Update the "job_posted" field in the recruiter document with the new job posting ID
      await updateDoc(documentRef, {
        job_posted: arrayUnion(docRef.id),
      });
      console.log("Document successfully updated with new job posting!");
    } catch (error) {
      console.error("Error adding documents:", error);
    }
  };

  const handleAddCategory = (label) => {
    setFormData((prevData) => ({
      ...prevData,
      job_category: label,
    }));
  };

  const handleSubmit = async () => {
    if (
      formData.description === "" ||
      formData.job_company === "" ||
      formData.job_location === "" ||
      formData.job_title === "" ||
      formData.job_type === null ||
      formData.qualifications === null ||
      formData.responsibility_items === null ||
      formData.salary === "" ||
      formData.shift_and_schedule === null
    ) {
      alert("Fields cannot be empty!");
    } else {
      const details =
        formData.job_title +
        " " +
        formData.description +
        formData.job_type.join(", ") +
        formData.qualifications.join(", ") +
        formData.responsibility_items.join(", ") +
        formData.shift_and_schedule.join(", ");
      try {
        console.log(details);
        const prediction = await handlePrediction(details);
        if (!prediction) return [];

        // Sort the predictions by value in descending order
        const sortedPredictions = Object.entries(prediction).sort(
          (a, b) => b[1] - a[1]
        );

        // Take the top 3 predictions
        const resultprediction = sortedPredictions.slice(0, 1);

        resultprediction.map(([label, value]) => {
          formData.job_category = label;
        });
        addDataToFirestore(formData, user.uid);

        handleClose();
      } catch (error) {
        console.log(error);
      }
    }
  };

  React.useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      // Set user state based on the authentication state change
      setUser(user);
    });

    // Clean up subscription
    return () => unsubscribe();
  }, []);

  return (
    <div>
      <Button onClick={handleOpen}>Open modal</Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
      >
        <Box sx={{ ...style, width: "70%", height: "95%" }}>
          <h2 id="parent-modal-title" className="font-bold">
            Post a job
          </h2>

          <div className="w-full mt-5 flex flex-row gap-3">
            <div className="flex flex-col w-1/2 gap-3">
              <TextField
                className="w-full"
                id="job_title"
                label="Job Title"
                variant="outlined"
                onChange={handleChange}
              />
              <TextField
                className="w-full"
                id="job_location"
                label="Job Location"
                variant="outlined"
                onChange={handleChange}
              />
              <TextField
                className="w-full"
                id="salary"
                label="Job Salary"
                variant="outlined"
                onChange={handleChange}
              />
              <TextField
                className="w-full"
                id="description"
                label="Job Description"
                variant="outlined"
                multiline
                rows={7}
                onChange={handleChange}
              />
            </div>

            <div className="flex flex-col w-1/2 gap-3">
              <div className="flex flex-row ">
                <TextField
                  className="w-full"
                  id="job_type"
                  label="Job Type"
                  variant="outlined"
                  value={formData.job_type.join(", ")} // Display job types as comma-separated string
                  InputProps={{ readOnly: true }} // Make it read-only
                />
                <ChildModal
                  onAddItem={(item) => handleAddItem(item, "job_type")}
                  label="Job Type"
                />
              </div>

              <div className="flex flex-row ">
                <TextField
                  className="w-full"
                  id="shift_and_schedule"
                  label="Shift and Schedule"
                  variant="outlined"
                  value={formData.shift_and_schedule.join(", ")} // Display shift and schedule as comma-separated string
                  InputProps={{ readOnly: true }} // Make it read-only
                />
                <ChildModal
                  onAddItem={(item) =>
                    handleAddItem(item, "shift_and_schedule")
                  }
                  label="Shift and Schedule"
                />
              </div>

              <div className="flex flex-row">
                <TextField
                  className="w-full"
                  id="qualifications"
                  label="Qualifications"
                  variant="outlined"
                  multiline
                  rows={4}
                  value={formData.qualifications.join(", ")} // Display qualifications as comma-separated string
                  InputProps={{ readOnly: true }} // Make it read-only
                />
                <ChildModal
                  onAddItem={(item) => handleAddItem(item, "qualifications")}
                  label="Qualifications"
                />
              </div>

              <div className="flex flex-row">
                <TextField
                  className="w-full"
                  id="responsibility"
                  label="Duties and Responsibilities"
                  variant="outlined"
                  multiline
                  rows={4}
                  value={formData.responsibility_items.join(", ")} // Display qualifications as comma-separated string
                  InputProps={{ readOnly: true }} // Make it read-only
                />
                <ChildModal
                  onAddItem={(item) =>
                    handleAddItem(item, "responsibility_items")
                  }
                  label="Duties and Responsibilities"
                />
              </div>
            </div>
          </div>

          <div className="justify-center flex flex-row gap-1 mt-5">
            <button className="cyan_btn" onClick={handleSubmit}>
              Submit
            </button>
            <button className="cyan_btn" onClick={handleClose}>
              Close
            </button>
          </div>
        </Box>
      </Modal>
    </div>
  );
}
