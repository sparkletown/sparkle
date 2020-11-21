import React from "react";

interface NavBarLoginProps {
  openAuthenticationModal: () => void;
}

export const NavBarLogin: React.FC<NavBarLoginProps> = ({
  openAuthenticationModal,
}) => (
  <div
    className="log-in-button"
    style={{ marginTop: "20px" }}
    onClick={openAuthenticationModal}
  >
    Log in
  </div>
);
