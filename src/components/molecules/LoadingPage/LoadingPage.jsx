import React from "react";

import "./loading.scss";

export const LoadingPage = () => {
  return (
    <div className="loading-screen">
      <div className="loading-content">
        <div className="burningman-loading-container">
          <span className="loading-sparkle-1"></span>
          <span className="loading-sparkle-2"></span>
          <div className="burningman-loading">
            <div className="burningman-loading-anim"></div>
          </div>
        </div>
        <span className="loading-randomquote"></span>
      </div>
    </div>
  );
};
