"use client";
import { useState } from "react";
import axios from "axios";
import Report from "@app/components/Report";

const PredictComponent = () => {
  const [inputDocument, setInputDocument] = useState("");
  const [prediction, setPrediction] = useState(null);

  const handlePredict = async () => {
    try {
      const response = await axios.post("http://localhost:5000/predict", {
        document: inputDocument,
      });
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
    <div>
      <textarea
        className="border w-full "
        value={inputDocument}
        onChange={(e) => setInputDocument(e.target.value)}
        placeholder="Enter document for prediction"
      />
      <button className="cyan_btn" onClick={handlePredict}>
        Predict
      </button>

      {prediction && (
        <div className="border p-5 border-cyan-500 rounded-lg">
          <h2>Top 3 Predictions:</h2>
          <ul className="flex flex-row">
            {getTopThreePredictions().map(([label, value]) => (
              <div
                key={label}
                className="flex flex-col justify-center items-center"
              >
                <Report value={value} />
                <p>{label}</p>
              </div>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default PredictComponent;
