import React from "react";

interface TableFooterProps {
  isVideoFocused: boolean;
  setIsVideoFocused: (val: boolean) => void;
}

const TableFooter: React.FC<TableFooterProps> = ({
  isVideoFocused,
  setIsVideoFocused,
}) => (
  <div className="table-footer">
    <div className="actions">
      <div className="action">
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
      </div>
    </div>
  </div>
);

export default TableFooter;
