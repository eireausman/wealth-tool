import React, { useEffect } from "react";
import { investmentsAPIData } from "../../../types/typeInterfaces";
import "./InvestmentsPriceChart.css";

interface InvestmentsPriceChartProps {}

const InvestmentsPriceChart: React.FC<InvestmentsPriceChartProps> = () => {
  const priceArray = [
    20, 30, 22, 24, 60, 55, 52, 51, 30, 37, 42, 44, 52, 53, 65, 67, 75, 85, 90,
    92, 91, 86, 102, 105, 107, 100, 102, 102, 103,
  ];
  const priceArrayPoints = () => {
    const maxPrice = Math.max(...priceArray);
    const minPrice = Math.min(...priceArray);
    console.log(maxPrice, minPrice);
  };
  const dataPoints =
    "1, 30 4, 1 7, 30 12, 1 16, 10 20, 11 23, 11 27, 11 31, 11 35, 12 38, 34 42, 16 46, 15 50, 15 54, 12 57, 12 60, 10 63, 32 66, 27 69, 27 73, 27 77, 17 80, 27 83, 27 87, 27 90, 27 93, 27 97, 27 99, 27 105, 27";

  const style = {
    fill: "none",
    stroke: "red",
    strokeWidth: "1",
  };
  return (
    <svg
      viewBox="37 0 30 30"
      height={20}
      width={70}
      xmlns="http://www.w3.org/2000/svg"
      className="priceChartContainer"
    >
      <polyline
        // points="1, 20 2, 10 3, 20 4, 20 5, 20 6, 20 7, 20, 8 2"
        points={dataPoints}
        style={style}
      />
    </svg>
  );
};

export default InvestmentsPriceChart;
