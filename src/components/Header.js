import React from "react";
import "./Header.css";

function Header(props) {
  const { title, context, setStage, stage } = props;
  const isAllList = stage === "AllList";
  return (
    <div className={`header ${stage}`}>
      <div className="headerInner">
        <div className="headerMsg">{title}</div>
        <div className="headerProfileWrap">
          <div
            className="headerProfile"
            onClick={() => {
              setStage("YourList");
            }}
          >
            <div className="headerProfileImageWrap">
              <img
                className="headerProfileImage"
                src={context.pictureUrl}
                alt={context.displayName}
              />
            </div>
          </div>
          <div className="headerProfileName">
            {isAllList ? (
              <p>Hello, {context.displayName}</p>
            ) : (
              <p>
                "The price of greatness is responsibility."
                <br />
                <b>— Winston Churchill —</b>
              </p>
            )}
          </div>
        </div>
        <div
          className="headerBack"
          onClick={() => {
            setStage(isAllList ? "YourList" : "AllList");
          }}
        >
          {isAllList ? "SEE YOUR TASK" : "< BACK"}
        </div>
      </div>
    </div>
  );
}
export default Header;
