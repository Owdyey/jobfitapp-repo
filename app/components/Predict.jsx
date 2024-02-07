import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@utils/firebaseConfig";

const PredictComponent = ({ skill, uid }) => {
  const router = useRouter();
  const [inputFile, setInputFile] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [hasNoSkills, setHasNoSkills] = useState(true);
  const [uploadedFile, setUploadedFile] = useState("Upload File here");
  const [showPredictions, setShowPredictions] = useState(false);

  const handleOkay = () => {
    router.push("/Feed");
  };

  const handleFileChange = (e) => {
    setInputFile(e.target.files[0]);
    setUploadedFile(e.target.files[0].name);
  };

  const handlePredict = async () => {
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

      // Extract the top three predicted skills
      const topThreePredictions = predictedSkills
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([label]) => label);

      try {
        const userDocRef = doc(db, "users", uid);
        await updateDoc(userDocRef, {
          skills: topThreePredictions,
        });

        console.log("Skills field updated in Firestore");
      } catch (error) {
        console.error("Error updating skills field:", error);
      }

      setPrediction(response.data);
      setHasNoSkills(false);
      setShowPredictions(true);
    } catch (error) {
      console.error("Error predicting:", error);
    }
  };

  const handlePredictUpdate = async () => {
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

      // Extract the top three predicted skills
      const topThreePredictions = predictedSkills
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([label]) => label);

      try {
        const userDocRef = doc(db, "users", uid);
        await updateDoc(userDocRef, {
          skills: topThreePredictions,
        });

        console.log("Skills field updated in Firestore");
      } catch (error) {
        console.error("Error updating skills field:", error);
      }

      setPrediction(response.data);
      setHasNoSkills(false);
    } catch (error) {
      console.error("Error predicting:", error);
    }
  };

  useEffect(() => {
    if (skill && skill.length > 0) {
      setHasNoSkills(false);
    } else {
      setHasNoSkills(true);
    }
  }, [skill]);

  const getTopThreePredictions = () => {
    if (!prediction) return [];

    const sortedPredictions = Object.entries(prediction).sort(
      (a, b) => b[1] - a[1]
    );

    const topThreePredictions = sortedPredictions.slice(0, 3);

    return topThreePredictions;
  };

  return (
    <div className="w-full h-full">
      {!showPredictions && hasNoSkills ? (
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
          <button className="cyan_btn" onClick={handlePredict}>
            Upload
          </button>
        </div>
      ) : (
        <div className="flex flex-col w-full gap-10">
          <div className="w-full flex flex-row justify-between">
            <input id="updateFile" type="file" onChange={handleFileChange} />
            <button className="blue_btn" onClick={handlePredictUpdate}>
              Update Profile
            </button>
          </div>

          <div className=" flex  flex-col w-full">
            <p className="font-bold text-center text-3xl blue_gradient p-2">
              Job Categories Suggested For You
            </p>
            <div className="flex flex-row gap-3 mt-7">
              {skill &&
                skill.map((skill) => (
                  <div
                    key={skill}
                    className="w-full p-10 flex flex-col justify-between items-center border rounded-lg border-blue-600"
                  >
                    <p className="text-sm text-center font-bold blue_gradient w-full">
                      {skill}
                    </p>
                  </div>
                ))}
            </div>
            <button
              onClick={handleOkay}
              className="blue_btn w-1/6 self-center mt-3"
            >
              Got it!
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PredictComponent;
