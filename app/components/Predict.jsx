import { useState } from "react";
import axios from "axios";
import Report from "@app/components/Report";

const PredictComponent = () => {
  const [inputFile, setInputFile] = useState(null);
  const [prediction, setPrediction] = useState(null);

  const handleFileChange = (e) => {
    setInputFile(e.target.files[0]);
  };

  const handlePredict = async () => {
    try {
      const formData = new FormData();
      formData.append("file", inputFile);

      const response = await axios.post(
        "http://localhost:5000/predict/resume",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setPrediction(response.data);
    } catch (error) {
      console.error("Error predicting:", error);
    }
  };

  const getTopThreePredictions = () => {
    if (!prediction) return [];

    // Sort the predictions by value in descending order
    const sortedPredictions = Object.entries(prediction).sort(
      (a, b) => b[1] - a[1]
    );

    // Take the top 3 predictions
    const topThreePredictions = sortedPredictions.slice(0, 3);

    return topThreePredictions;
  };

  return (
    <div className="w-full">
      <div className="flex flex-row">
        <input
          type="file"
          onChange={handleFileChange}
          accept=".txt, .pdf, .doc, .docx"
          className=" w-full"
        />
        <button className="cyan_btn" onClick={handlePredict}>
          Upload
        </button>
      </div>

      {prediction && (
        <div className="border p-5 border-cyan-500 rounded-lg mt-20">
          <p className="font-bold text-center ">
            Top 3 Job Categories Suggested For You
          </p>
          <ul className="flex flex-row ">
            {getTopThreePredictions().map(([label, value]) => (
              <div
                key={label}
                className="w-full p-10 flex flex-col justify-between items-center"
              >
                <Report value={value} />
                <p className="text-sm">{label}</p>
              </div>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default PredictComponent;
