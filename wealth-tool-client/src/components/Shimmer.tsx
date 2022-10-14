import React from "react";
import "./Shimmer.css";

interface ShimmerProps {
  height: string;
  width?: string;
  borderRadiusPX: string;
}

const Shimmer: React.FC<ShimmerProps> = ({ height, width, borderRadiusPX }) => {
  const style = {
    width: width,
    height: height,
    borderRadius: borderRadiusPX,
  };

  return (
    <div className="shimmerWrapper">
      <div className="shimmerInternal animate" style={style}></div>
    </div>
  );
};

export default Shimmer;
