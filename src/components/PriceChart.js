import React from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend } from "chart.js";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend);

const PriceChart = ({ actualPrices, predictedPrices }) => {
    const data = {
        labels: actualPrices.map((_, index) => `House ${index + 1}`),
        datasets: [
            {
                label: "Actual Prices",
                data: actualPrices,
                borderColor: "blue",
                backgroundColor: "rgba(0, 0, 255, 0.2)",
                tension: 0.4,
            },
            {
                label: "Predicted Prices",
                data: predictedPrices,
                borderColor: "red",
                backgroundColor: "rgba(255, 0, 0, 0.2)",
                tension: 0.4,
            },
        ],
    };

    return (
        <div style={{ width: "600px", margin: "20px auto" }}>
            <h3>Predicted vs. Actual Prices</h3>
            <Line data={data} />
        </div>
    );
};

export default PriceChart;
