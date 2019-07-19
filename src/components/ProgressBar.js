import React from "react";
import "./ProgressBar.css";

export default function ProgressBar(props) {
  const { percentage = 30, title } = props;
  return (
    <div className="Bar">
      <div className="groupScore">{title}</div>
      <div className="progressBar">
        <div className="progressBar-Bar" style={{ width: percentage + "%" }}>
          <div className="progressBar-label">{percentage}%</div>
        </div>
      </div>
    </div>
  );
}
