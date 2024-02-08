"use client";
import React from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

const ApprovalModal = ({ isOpen, onClose, isApproved }) => {
  const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };
  const handleOkay = () => {
    onClose();
  };

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      aria-labelledby="approval-modal-title"
      aria-describedby="approval-modal-description"
    >
      <Box sx={modalStyle}>
        <Typography id="approval-modal-title" variant="h6" component="h2">
          {isApproved ? "Approved" : "Not Approved"}
        </Typography>
        <Typography id="approval-modal-description" sx={{ mt: 2 }}>
          {isApproved
            ? "You have been approved for this opportunity. Best of luck!"
            : "While your credentials are impressive, we believe your skills could be better aligned with other opportunities. Keep exploring and don’t be discouraged!"}
        </Typography>
        <div className="w-full flex flex-row justify-end">
          <button className="blue_btn" onClick={handleOkay}>
            Got it!
          </button>
        </div>
      </Box>
    </Modal>
  );
};

export default ApprovalModal;
