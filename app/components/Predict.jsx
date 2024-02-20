import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "@utils/firebaseConfig";
import DisplayComponent from "./DisplayComponent";

const PredictComponent = ({ uid }) => {
  const router = useRouter();
  const [inputFile, setInputFile] = useState(null);
  const [hasNoSkills, setHasNoSkills] = useState(true);
  const [uploadedFile, setUploadedFile] = useState("Upload File here");
  const [displaySkill, setDisplaySkill] = useState([]);

  // Function to handle file change
  const handleFileChange = (e) => {
    setInputFile(e.target.files[0]);
    setUploadedFile(e.target.files[0]?.name || "Upload File here");
  };

  // Common function for prediction
  const handlePredictCommon = async () => {
    try {
      if (!inputFile) {
        console.error("No file uploaded");
        return;
      }

      const formData = new FormData();
      formData.append("file", inputFile);

      const response = await axios.post(
        "http://localhost:5000/predict/resume/file",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const predictedSkills = Object.entries(response.data);
      console.log(predictedSkills);
      if (!predictedSkills) return [];

      const threshold = 0.65;

      // Filter predictions with values greater than or equal to 0.5
      const filteredPredictions = predictedSkills.filter(
        ([label, value]) => value >= threshold
      );

      // Extract the top predictions
      const topPredictions = filteredPredictions
        .sort((a, b) => b[1] - a[1])
        .map(([label, value]) => ({ label, value }));

      try {
        const userDocRef = doc(db, "users", uid);
        await updateSkillsInFirestore(userDocRef, topPredictions);
        console.log("Skills field updated in Firestore");
      } catch (error) {
        console.error("Error updating skills field:", error);
      }
      setHasNoSkills(topPredictions.length === 0);
    } catch (error) {
      console.error("Error predicting:", error);
      // Add appropriate error handling or user feedback here
    }
  };

  // Function to handle initial document fetch and set up real-time listener
  const setupSkillsListener = () => {
    const userDocRef = doc(db, "users", uid);

    // Set up real-time listener for changes to the skills field
    return onSnapshot(userDocRef, (doc) => {
      const userSkills = doc.data()?.skills || [];
      setDisplaySkill(userSkills);
      setHasNoSkills(!userSkills || userSkills.length === 0);
    });
  };

  // Function to handle skills update in Firestore
  const updateSkillsInFirestore = async (userDocRef, skills) => {
    try {
      await updateDoc(userDocRef, {
        skills,
      });
    } catch (error) {
      console.error("Error updating skills field:", error);
    }
  };

  useEffect(() => {
    // Set up the initial data fetch and real-time listener
    const unsubscribe = setupSkillsListener();

    // Clean up the listener when the component is unmounted
    return () => unsubscribe();
  }, [uid]);

  return (
    <div className="w-full h-full">
      {hasNoSkills ? (
        <div className="w-full h-full flex flex-col items-center justify-center gap-5">
          <div className="flex flex-row gap-5">
            <input
              id="file"
              type="file"
              onChange={handleFileChange}
              accept=".txt, .pdf, .doc, .docx"
              className="w-full hidden"
            />
            <label
              htmlFor="file"
              className="p-20 border border-slate-200 rounded-lg shadow-md"
            >
              {uploadedFile}
            </label>
          </div>
          <button className="cyan_btn" onClick={handlePredictCommon}>
            Upload
          </button>
        </div>
      ) : (
        <div className="flex flex-col w-full gap-10">
          <div className="w-full flex flex-row justify-between">
            <input id="updateFile" type="file" onChange={handleFileChange} />
            <button className="blue_btn" onClick={handlePredictCommon}>
              Update Profile
            </button>
          </div>
        </div>
      )}
      {!hasNoSkills && (
        <div className="flex flex-col justify-center gap-5 h-full items-center">
          <p className="text-lg">Jobs Recommended for you!</p>
          <div className="flex flex-row justify-center gap-5 items-center">
            {displaySkill.map(({ label, value }) => (
              <div key={label}>
                <DisplayComponent label={label} value={value} />
              </div>
            ))}
          </div>

          <button className="blue_btn" onClick={() => router.push("/Feed")}>
            Got it!
          </button>
        </div>
      )}
    </div>
  );
};

export default PredictComponent;
