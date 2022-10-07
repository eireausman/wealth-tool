import React from "react";
import "./Shimmer.css";

interface ShimmerProps {
  height: number;
  width: number;
  borderRadiusPX: number;
}

const Shimmer: React.FC<ShimmerProps> = ({ height, width, borderRadiusPX }) => {
  const style = {
    height: height,
    width: width,
    borderRadius: `${borderRadiusPX}px`,
  };
  return (
    <div className="shimmerWrapper">
      <div className="shimmerInternal animate" style={style}></div>
    </div>
  );
};

export default Shimmer;
