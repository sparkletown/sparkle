import React from "react";

import "./PrettyLink.scss";

interface PrettyLinkProps {
  title: string;
  onClick: () => void;
}

export const PrettyLink: React.FC<PrettyLinkProps> = ({ title, onClick }) => {
  return (
    <div className="PrettyLink">
      <span title={title} onClick={onClick}>
        {title}
      </span>
    </div>
  );
};
