import React from "react";

const TableFooter = ({ isVideoFocused, setIsVideoFocused }: any) => (
  <div className="table-footer">
    <div className="actions">
      <div className="action">
        {/* <div className="full-screen-checkbox"> */}
        <div className="focus">Focus on:</div>
        <div className="focus-option">Jazz</div>
        <label className="switch">
          <input
            type="checkbox"
            checked={!isVideoFocused}
            onChange={() => setIsVideoFocused(!isVideoFocused)}
          />
          <span className="slider" />
        </label>
        <div className="focus-option">Friends</div>
        {/* </div> */}
      </div>
    </div>
  </div>
);

export default TableFooter;
