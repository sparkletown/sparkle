import React, { useState } from "react";
import "firebase/storage";
import "./Account.scss";
import { PLAYA_IMAGE } from "settings";
import { useHistory } from "react-router-dom";
import { TEN_PRINCIPLES_LIST } from "./Step3";
import VideoModal from "components/organisms/VideoModal";
import { getThumbnailURL } from "utils/GetVideoThumbnailImage";

const Step5 = () => {
  const history = useHistory();

  const [videoUrl, setVideoUrl] = useState("https://vimeo.com/201990344");

  return (
    <div className="splash-page-container">
      <img className="playa-img" src={PLAYA_IMAGE} alt="Playa Background Map" />
      <div className="step-container ten-principles-burning">
        <VideoModal
          show={videoUrl !== ""}
          url={videoUrl}
          onHide={() => setVideoUrl("")}
        ></VideoModal>
        {TEN_PRINCIPLES_LIST.map((q) => (
          <div
            className="form"
            key={q.name}
            onClick={() => setVideoUrl(q.video)}
          >
            <div
              className="principle-name"
              onClick={() => setVideoUrl(q.video)}
            >
              {q.name}
            </div>
            <div
              className="principle-description"
              onClick={() => setVideoUrl(q.video)}
            >
              {q.text}
            </div>
            {/* <img
              src={ async () => await getThumbnailURL(q.video)}
              alt={q.name + " video"}
            ></img> */}
          </div>
        ))}
        <button
          className={`btn btn-primary btn-block btn-centered`}
          onClick={() => history.push(`/enter/step6`)}
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default Step5;
