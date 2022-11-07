import React from "react";
import styles from "./Shimmer.module.css";

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
    <div className={styles.shimmerWrapper}>
      <div
        className={`${styles.shimmerInternal} ${styles.animate}`}
        style={style}
      ></div>
    </div>
  );
};

export default Shimmer;
