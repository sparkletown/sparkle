import React from "react";
import "./AdminPanel.scss";
import useStage from "../../../../useStage";

const AdminPanel = () => {
  const { peopleOnStage, peopleRequesting } = useStage();

  return (
    <div className="admin-panel">
      <div className="people-on-stage">
        <p className="section-label">{peopleOnStage.length} people on stage</p>
        <div>
          {peopleOnStage.map((user) => (
            <div key={user.id} className="user">
              <div className="user-pic">
                {user.pictureUrl && <img src={user.pictureUrl} alt="profile" />}
              </div>
              {user.partyName || ""}
            </div>
          ))}
        </div>
      </div>
      <div className="requests">
        <p className="section-label">
          {peopleRequesting.length} Requests to join stage
        </p>
        <div>
          {peopleRequesting.map((user) => (
            <div key={user.id} className="user">
              <div className="user-pic">
                {user.pictureUrl && <img src={user.pictureUrl} alt="profile" />}
              </div>
              {user.partyName || ""}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
