import React from "react";
import "./ProgressBar.css";

export default function ProgressBar(props) {
  const { percentage = 30 } = props;
  return (
    <div className="progressBar">
      <div className="prgressBar-Bar" style={{ width: percentage + "%" }}>
        <div className="prgressBar-label">{percentage}%</div>
      </div>
    </div>
  );
}
