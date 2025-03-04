import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const PropertyForm = ({ onPredict, onChange, inputs, onFeedbackSubmit }) => {
    const [feedback, setFeedback] = useState("");
    const [errors, setErrors] = useState({});

    const validateInputs = () => {
        let errors = {};
        if (inputs.area <= 0) errors.area = "Area must be greater than 0";
        if (inputs.bedrooms <= 0) errors.bedrooms = "Bedrooms must be greater than 0";
        if (inputs.bathrooms <= 0) errors.bathrooms = "Bathrooms must be greater than 0";
        if (inputs.age < 0) errors.age = "Age must be 0 or greater";
        if (!inputs.location) errors.location = "Location must be selected";
        return errors;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const errors = validateInputs();
        if (Object.keys(errors).length > 0) {
            setErrors(errors);
            return;
        }
        onPredict();
    };

    const handleFeedbackChange = (e) => {
        setFeedback(e.target.value);
    };

    const handleFeedbackSubmit = (e) => {
        e.preventDefault();
        onFeedbackSubmit(feedback);
        setFeedback("");
    };

    return (
        <div className="d-flex justify-content-center align-items-center vh-100">
            <div className="card p-4 shadow" style={{ width: "400px" }}>
                <h3 className="text-center mb-3">Real Estate Price Prediction</h3>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <input
                            type="number"
                            name="area"
                            placeholder="Area (sq ft)"
                            className="form-control"
                            value={inputs.area}
                            onChange={onChange}
                            required
                        />
                        {errors.area && <p className="text-danger">{errors.area}</p>}
                    </div>
                    <div className="mb-3">
                        <input
                            type="number"
                            name="bedrooms"
                            placeholder="Bedrooms"
                            className="form-control"
                            value={inputs.bedrooms}
                            onChange={onChange}
                            required
                        />
                        {errors.bedrooms && <p className="text-danger">{errors.bedrooms}</p>}
                    </div>
                    <div className="mb-3">
                        <input
                            type="number"
                            name="bathrooms"
                            placeholder="Bathrooms"
                            className="form-control"
                            value={inputs.bathrooms}
                            onChange={onChange}
                            required
                        />
                        {errors.bathrooms && <p className="text-danger">{errors.bathrooms}</p>}
                    </div>
                    <div className="mb-3">
                        <input
                            type="number"
                            name="age"
                            placeholder="Age of Property"
                            className="form-control"
                            value={inputs.age}
                            onChange={onChange}
                            required
                        />
                        {errors.age && <p className="text-danger">{errors.age}</p>}
                    </div>
                    <div className="mb-3">
                        <select
                            name="location"
                            className="form-control"
                            value={inputs.location}
                            onChange={onChange}
                            required
                        >
                            <option value="">Select Location</option>
                            <option value="Toronto">Toronto</option>
                            <option value="Scarborough">Scarborough</option>
                            <option value="Markham">Markham</option>
                        </select>
                        {errors.location && <p className="text-danger">{errors.location}</p>}
                    </div>
                    <button type="submit" className="btn btn-primary w-100">Predict Price</button>
                </form>
                <form onSubmit={handleFeedbackSubmit} className="mt-3">
                    <textarea
                        className="form-control"
                        placeholder="Provide feedback on the predicted price"
                        value={feedback}
                        onChange={handleFeedbackChange}
                    />
                    <button type="submit" className="btn btn-secondary w-100 mt-2">Submit Feedback</button>
                </form>
            </div>
        </div>
    );
};

export default PropertyForm;
