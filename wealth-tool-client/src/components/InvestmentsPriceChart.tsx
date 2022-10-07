import React, { useEffect, useState } from "react";
import { investmentsAPIData } from "../../../types/typeInterfaces";
import "./InvestmentsPriceChart.css";

interface InvestmentsPriceChartProps {
  data: investmentsAPIData;
}

const InvestmentsPriceChart: React.FC<InvestmentsPriceChartProps> = ({
  data,
}) => {
  const [pricePointData, setpricePointData] = useState<string>();

  useEffect(() => {
    const priceArray = data.investment_price_histories.map((priceEntry) => {
      return parseFloat(priceEntry.holding_current_price);
    });

    const maxPrice = Math.max(...priceArray);

    let chartXPoints = 1;
    let chartData: string = "";
    const maxChartYPoints: number = 105;
    const maxChartXPoints: number = 30;

    priceArray.forEach((price) => {
      const priceInRangePcent = price / maxPrice;
      const mapPriceToThisChartPoint = maxChartXPoints * priceInRangePcent;
      chartData += `${chartXPoints},${mapPriceToThisChartPoint} `;

      chartXPoints += maxChartYPoints / priceArray.length;
    });
    setpricePointData(chartData);
  }, []);

  const style = {
    fill: "none",
    stroke: "red",
    strokeWidth: "1.25",
  };

  if (pricePointData === undefined) {
    return null;
  }
  return (
    <svg
      viewBox="37 0 30 30"
      height={20}
      width={70}
      xmlns="http://www.w3.org/2000/svg"
      className="priceChartContainer"
    >
      <polyline points={pricePointData} style={style} />
    </svg>
  );
};

export default InvestmentsPriceChart;
