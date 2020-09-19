import React, { useState } from "react";
import "firebase/storage";
import "./Account.scss";
import { PLAYA_IMAGE } from "settings";
import { useHistory } from "react-router-dom";
//import { TEN_PRINCIPLES_LIST } from "./Step3";
import VideoModal from "components/organisms/VideoModal";
import { getThumbnailURL } from "utils/GetVideoThumbnailImage";

interface VideoDefinition {
  name: string;
  text: string;
  video: string;
  type: string;
  thumb: string;
}

const videos: VideoDefinition[] = [
  {
    name: "Radical Inclusion",
    text:
      "Anyone may be a part of Burning Man. We welcome and respect the stranger. No prerequisites exist for participation in our community.",
    video: "https://vimeo.com/201990344",
    type: "Principle",
    thumb: "",
  },
  {
    name: "Gifting",
    text:
      "Burning Man is devoted to acts of gift giving. The value of a gift is unconditional. Gifting does not contemplate a return or an exchange for something of equal value.",
    video: "https://www.youtube.com/watch?v=APCs7t8LdqQ",
    type: "Principle",
    thumb: "",
  },
  {
    name: "Decommodification",
    text:
      "In order to preserve the spirit of gifting, our community seeks to create social environments that are unmediated by commercial sponsorships, transactions, or advertising. We stand ready to protect our culture from such exploitation. We resist the substitution of consumption for participatory experience.",
    video: "https://www.youtube.com/watch?v=APCs7t8LdqQ",
    type: "Principle",
    thumb: "",
  },
  {
    name: "Radical Self-reliance",
    text:
      "Burning Man encourages the individual to discover, exercise and rely on his or her inner resources.",
    video: "https://www.youtube.com/watch?v=APCs7t8LdqQ",
    type: "Principle",
    thumb: "",
  },
  {
    name: "Radical Self-expression",
    text:
      "Radical self-expression arises from the unique gifts of the individual. No one other than the individual or a collaborating group can determine its content. It is offered as a gift to others. In this spirit, the giver should respect the rights and liberties of the recipient.",
    video: "https://www.youtube.com/watch?v=APCs7t8LdqQ",
    type: "Principle",
    thumb: "",
  },
  {
    name: "Communal Effort",
    text:
      "Our community values creative cooperation and collaboration. We strive to produce, promote and protect social networks, public spaces, works of art, and methods of communication that support such interaction.",
    video: "https://www.youtube.com/watch?v=APCs7t8LdqQ",
    type: "Principle",
    thumb: "",
  },
  {
    name: "Civic Responsibility",
    text:
      "We value civil society. Community members who organize events should assume responsibility for public welfare and endeavor to communicate civic responsibilities to participants. They must also assume responsibility for conducting events in accordance with local, state and federal laws.",
    video: "https://www.youtube.com/watch?v=APCs7t8LdqQ",
    type: "Principle",
    thumb: "",
  },
  {
    name: "Leaving No Trace",
    text:
      "Our community respects the environment. We are committed to leaving no physical trace of our activities wherever we gather. We clean up after ourselves and endeavor, whenever possible, to leave such places in a better state than when we found them.",
    video: "https://www.youtube.com/watch?v=APCs7t8LdqQ",
    type: "Principle",
    thumb: "",
  },
  {
    name: "Participation",
    text:
      "Our community is committed to a radically participatory ethic. We believe that transformative change, whether in the individual or in society, can occur only through the medium of deeply personal participation. We achieve being through doing. Everyone is invited to work. Everyone is invited to play. We make the world real through actions that open the heart.",
    video: "https://www.youtube.com/watch?v=APCs7t8LdqQ",
    type: "Principle",
    thumb: "",
  },
  {
    name: "Immediacy",
    text:
      "Immediate experience is, in many ways, the most important touchstone of value in our culture. We seek to overcome barriers that stand between us and a recognition of our inner selves, the reality of those around us, participation in society, and contact with a natural world exceeding human powers. No idea can substitute for this experience.",
    video: "https://www.youtube.com/watch?v=APCs7t8LdqQ",
    type: "Principle",
    thumb: "",
  },
  {
    name: "Tree Wizard",
    text: "",
    video: "https://www.youtube.com/watch?v=APCs7t8LdqQ",
    type: "Greeter",
    thumb: "",
  },
  {
    name: "Hippy Chick",
    text: "",
    video: "https://www.youtube.com/watch?v=APCs7t8LdqQ",
    type: "Greeter",
    thumb: "",
  },
  {
    name: "Steampunker",
    text: "",
    video: "https://www.youtube.com/watch?v=APCs7t8LdqQ",
    type: "Greeter",
    thumb: "",
  },
  {
    name: "Ringmaster",
    text: "",
    video: "https://www.youtube.com/watch?v=APCs7t8LdqQ",
    type: "Greeter",
    thumb: "",
  },
  {
    name: "Driveway",
    text: "",
    video: "https://www.youtube.com/watch?v=APCs7t8LdqQ",
    type: "Entrance",
    thumb: "",
  },
];

const Step5 = () => {
  const history = useHistory();

  const [videoType, setVideoType] = useState("Entrance");

  const [videoUrl, setVideoUrl] = useState(
    videos.filter((v) => v.type === videoType)[0].video
  ); // get first vide of type

  return (
    <div className="splash-page-container">
      <img className="playa-img" src={PLAYA_IMAGE} alt="Playa Background Map" />
      <div className="step-container ten-principles-burning">
        <VideoModal
          show={videoUrl !== ""}
          url={videoUrl}
          onHide={() => setVideoUrl("")}
        ></VideoModal>
        {videos
          .filter((v) => v.type === videoType)
          .map((q) => (
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
              {/* <div
                className="principle-description"
                onClick={() => setVideoUrl(q.video)}
              >
                {q.text}
              </div> */}
              {q.thumb && <img src={q.thumb} alt={q.name + " video"}></img>}
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
