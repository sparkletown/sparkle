import React, { useState } from "react";
import "firebase/storage";
import "./Account.scss";
import { PLAYA_IMAGE } from "settings";
import { useHistory } from "react-router-dom";
import { TEN_PRINCIPLES_LIST } from "./Step3";
import VideoModal from "components/organisms/VideoModal";
import { getThumbnailURL } from "utils/GetVideoThumbnailImage";
import { ConvertToEmbeddableUrl } from "utils/ConvertToEmbeddableUrl";

const Step5 = () => {
  const history = useHistory();

  //const [videoUrl, setVideoUrl] = useState("https://vimeo.com/201990344");
  const [principleNumber, setPrincipleNumber] = useState(0);

  return (
    <div>
      <div className="/modal-content /modal-content-events">
        <div style={{ display: "flex" }}>
          <div>
            <h3 className="italic">Greetings!</h3>
          </div>
          {/* {typeof openVenues !== "object" && <div className="spinner-border" />} */}
        </div>
        <div className="modal-tabs">
          {TEN_PRINCIPLES_LIST.map((principle, idx) => (
            <button
              key={principle.name}
              className={`button ${principleNumber === idx ? "selected" : ""}`}
              style={{ width: 100 }}
              onClick={() => setPrincipleNumber(idx)}
            >
              {principle.name}
            </button>
          ))}
        </div>
        <div className="events-list events-list_monday" style={{ height: 480 }}>
          {TEN_PRINCIPLES_LIST[principleNumber] && (
            <iframe
              className="youtube-video"
              title="art-piece-video"
              src={ConvertToEmbeddableUrl(
                TEN_PRINCIPLES_LIST[principleNumber].video
              )}
              frameBorder="0"
              allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          )}
        </div>
      </div>
    </div>
    //</Modal>
  );
};

export default Step5;
