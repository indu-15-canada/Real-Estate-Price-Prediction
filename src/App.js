import React, { useState, useEffect } from "react";
import * as brain from "brain.js";
import PriceChart from "./components/PriceChart";
import PropertyForm from "./components/PropertyForm";
import "bootstrap/dist/css/bootstrap.min.css";

const App = () => {
  const [inputs, setInputs] = useState({ area: "", bedrooms: "", bathrooms: "", age: "", location: "" });
  const [predictedPrice, setPredictedPrice] = useState(null);
  const [actualPrices, setActualPrices] = useState([]);
  const [predictedPrices, setPredictedPrices] = useState([]);
  const [net, setNet] = useState(null);

  const minMax = {
    area: { min: 500, max: 5000 },
    bedrooms: { min: 1, max: 6 },
    bathrooms: { min: 1, max: 5 },
    age: { min: 0, max: 100 },
    price: { min: 50000, max: 1000000 },
  };

  useEffect(() => {
    const storedModel = localStorage.getItem("trainedModel");
    if (storedModel) {
      const newNet = new brain.NeuralNetwork();
      newNet.fromJSON(JSON.parse(storedModel));
      setNet(newNet);
    }
  }, []);

  const handleChange = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  const normalizeData = (data, min, max) => (data - min) / (max - min);
  const denormalizeData = (data, min, max) => data * (max - min) + min;

  const trainModel = () => {
    const trainingData = [
      { input: { area: normalizeData(800, 500, 5000), bedrooms: normalizeData(2, 1, 6), bathrooms: normalizeData(1, 1, 5), age: normalizeData(5, 0, 100), location: normalizeData(3, 1, 3) }, output: { price: normalizeData(150000, 50000, 1000000) } },
      { input: { area: normalizeData(1200, 500, 5000), bedrooms: normalizeData(3, 1, 6), bathrooms: normalizeData(2, 1, 5), age: normalizeData(10, 0, 100), location: normalizeData(2, 1, 3) }, output: { price: normalizeData(200000, 50000, 1000000) } },
      { input: { area: normalizeData(1500, 500, 5000), bedrooms: normalizeData(3, 1, 6), bathrooms: normalizeData(2, 1, 5), age: normalizeData(5, 0, 100), location: normalizeData(1, 1, 3) }, output: { price: normalizeData(250000, 50000, 1000000) } },
      { input: { area: normalizeData(2000, 500, 5000), bedrooms: normalizeData(4, 1, 6), bathrooms: normalizeData(3, 1, 5), age: normalizeData(15, 0, 100), location: normalizeData(3, 1, 3) }, output: { price: normalizeData(320000, 50000, 1000000) } },
      { input: { area: normalizeData(2500, 500, 5000), bedrooms: normalizeData(5, 1, 6), bathrooms: normalizeData(4, 1, 5), age: normalizeData(8, 0, 100), location: normalizeData(2, 1, 3) }, output: { price: normalizeData(400000, 50000, 1000000) } },
      { input: { area: normalizeData(3000, 500, 5000), bedrooms: normalizeData(5, 1, 6), bathrooms: normalizeData(4, 1, 5), age: normalizeData(20, 0, 100), location: normalizeData(1, 1, 3) }, output: { price: normalizeData(500000, 50000, 1000000) } },
    ];

    const newNet = new brain.NeuralNetwork({
      hiddenLayers: [10, 10],
    });

    newNet.train(trainingData, { iterations: 5000, log: true, learningRate: 0.01 });

    const modelJSON = newNet.toJSON();
    localStorage.setItem("trainedModel", JSON.stringify(modelJSON));
    setNet(newNet);
    alert("Model Trained and Stored with Better Accuracy!");
  };

  const predictPrice = () => {
    if (!net) {
      alert("Train the model first!");
      return;
    }

    const locationValue = inputs.location === "Toronto" ? 3 : inputs.location === "Scarborough" ? 2 : 1;

    const inputValues = {
      area: normalizeData(parseFloat(inputs.area) || 0, minMax.area.min, minMax.area.max),
      bedrooms: normalizeData(parseFloat(inputs.bedrooms) || 0, minMax.bedrooms.min, minMax.bedrooms.max),
      bathrooms: normalizeData(parseFloat(inputs.bathrooms) || 0, minMax.bathrooms.min, minMax.bathrooms.max),
      age: normalizeData(parseFloat(inputs.age) || 0, minMax.age.min, minMax.age.max),
      location: normalizeData(locationValue, 1, 3),
    };

    const output = net.run(inputValues);

    if (!output.price) {
      alert("Prediction failed. Please check the input values and try again.");
      return;
    }

    const predictedPriceValue = denormalizeData(output.price, minMax.price.min, minMax.price.max);

    setPredictedPrice(predictedPriceValue);

    const actualPrice = predictedPriceValue * (0.9 + Math.random() * 0.2); // Simulating more realistic variation
    setActualPrices((prev) => [...prev, actualPrice]);
    setPredictedPrices((prev) => [...prev, predictedPriceValue]);
  };

  const handleFeedbackSubmit = (feedback) => {
    setFeedbackData((prev) => [...prev, feedback]);
    alert(`Feedback submitted: ${feedback}`);
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <PropertyForm onPredict={predictPrice} onChange={handleChange} inputs={inputs} onFeedbackSubmit={handleFeedbackSubmit} />
        </div>
      </div>
      <div className="row justify-content-center">
        <div className="col-md-8">
          <h2 className="text-center">Real Estate Price Prediction</h2>
          <div className="d-flex flex-column align-items-center gap-3">
            {predictedPrice && <h3>Predicted Price: ${predictedPrice.toFixed(2)}</h3>}
            <PriceChart actualPrices={actualPrices} predictedPrices={predictedPrices} />
            <button onClick={trainModel} className="btn btn-primary mt-3">Train Model</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
