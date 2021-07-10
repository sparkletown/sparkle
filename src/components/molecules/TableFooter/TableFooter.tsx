import React, { useCallback } from "react";

import { Toggler } from "components/atoms/Toggler";

export interface TableFooterProps {
  isVideoFocused: boolean;
  setIsVideoFocused: (val: boolean) => void;
}

// @debt this doesn't appear to be used anywhere, can we remove it?
export const TableFooter: React.FC<TableFooterProps> = ({
  isVideoFocused,
  setIsVideoFocused,
}) => {
  const toggleVideoFocused = useCallback(
    () => setIsVideoFocused(!isVideoFocused),
    [isVideoFocused, setIsVideoFocused]
  );

  return (
    <div className="table-footer">
      <div className="actions">
        <div className="action">
          <div className="focus">Focus on:</div>
          <div className="focus-option">Jazz</div>
          {/* @debt pass the header into Toggler's 'label' prop instead of being external like this */}
          <Toggler toggled={!isVideoFocused} onChange={toggleVideoFocused} />
          <div className="focus-option">Friends</div>
        </div>
      </div>
    </div>
  );
};
