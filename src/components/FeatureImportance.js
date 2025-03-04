import React from "react";
import { Bar } from "react-chartjs-2";

const FeatureImportance = ({ importance }) => {
    const data = {
        labels: ["Area", "Bedrooms", "Bathrooms", "Age"],
        datasets: [
            {
                label: "Feature Importance",
                data: importance,
                backgroundColor: ["rgba(255, 99, 132, 0.2)"],
                borderColor: ["rgba(255, 99, 132, 1)"],
                borderWidth: 1,
            },
        ],
    };

    return (
        <div style={{ width: "600px", margin: "20px auto" }}>
            <h3>Feature Importance</h3>
            <Bar data={data} />
        </div>
    );
};

export default FeatureImportance;
