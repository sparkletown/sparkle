import React, { useState } from "react";
import "firebase/storage";
import "./Account.scss";
import { PLAYA_IMAGE } from "settings";
import { useHistory } from "react-router-dom";
import VideoModal from "components/organisms/VideoModal";

enum VideoType {
  Entrance,
  Greeter,
  Principle,
}

interface VideoDefinition {
  name: string;
  text: string;
  video: string;
  type: VideoType;
  thumb: string;
}

const videos: VideoDefinition[] = [
  {
    name: "Welcome",
    text: "",
    video: "https://www.youtube.com/watch?v=eNY7ldlCWXQ",
    type: VideoType.Entrance,
    thumb: "https://img.youtube.com/vi/eNY7ldlCWXQ/default.jpg",
  },
  {
    name: "Tree Wizard",
    text: "",
    video: "https://www.youtube.com/watch?v=goqrRjpylC4",
    type: VideoType.Greeter,
    thumb: "https://img.youtube.com/vi/goqrRjpylC4/default.jpg",
  },
  {
    name: "Hippy Chick",
    text: "",
    video: "https://www.youtube.com/watch?v=qi4ijDQVnoU",
    type: VideoType.Greeter,
    thumb: "https://img.youtube.com/vi/qi4ijDQVnoU/default.jpg",
  },
  {
    name: "Steampunker",
    text: "",
    video: "https://www.youtube.com/watch?v=tpGI17uGfGs",
    type: VideoType.Greeter,
    thumb: "https://img.youtube.com/vi/tpGI17uGfGs/default.jpg",
  },
  {
    name: "Ringmaster",
    text: "",
    video: "https://www.youtube.com/watch?v=PeeqO8tYOpU",
    type: VideoType.Greeter,
    thumb: "https://img.youtube.com/vi/PeeqO8tYOpU/default.jpg",
  },
  {
    name: "Radical Inclusion",
    text:
      "Anyone may be a part of Burning Man. We welcome and respect the stranger. No prerequisites exist for participation in our community.",
    video: "https://www.youtube.com/watch?v=Bjqmu9WVYdo",
    type: VideoType.Principle,
    thumb: "https://img.youtube.com/vi/Bjqmu9WVYdo/default.jpg",
  },
  {
    name: "Gifting",
    text:
      "Burning Man is devoted to acts of gift giving. The value of a gift is unconditional. Gifting does not contemplate a return or an exchange for something of equal value.",
    video: "https://www.youtube.com/watch?v=QqJ7UPLLVA0",
    type: VideoType.Principle,
    thumb: "",
  },
  {
    name: "Decommodification",
    text:
      "In order to preserve the spirit of gifting, our community seeks to create social environments that are unmediated by commercial sponsorships, transactions, or advertising. We stand ready to protect our culture from such exploitation. We resist the substitution of consumption for participatory experience.",
    video: "https://www.youtube.com/watch?v=SQHJKV-ids8",
    type: VideoType.Principle,
    thumb: "",
  },
  {
    name: "Radical Self-reliance",
    text:
      "Burning Man encourages the individual to discover, exercise and rely on his or her inner resources.",
    video: "https://www.youtube.com/watch?v=jT4-tZp_sL0",
    type: VideoType.Principle,
    thumb: "",
  },
  {
    name: "Radical Self-expression",
    text:
      "Radical self-expression arises from the unique gifts of the individual. No one other than the individual or a collaborating group can determine its content. It is offered as a gift to others. In this spirit, the giver should respect the rights and liberties of the recipient.",
    video: "https://www.youtube.com/watch?v=JddlH_43sBc",
    type: VideoType.Principle,
    thumb: "",
  },
  {
    name: "Communal Effort",
    text:
      "Our community values creative cooperation and collaboration. We strive to produce, promote and protect social networks, public spaces, works of art, and methods of communication that support such interaction.",
    video: "https://www.youtube.com/watch?v=yYmEh8gB00w",
    type: VideoType.Principle,
    thumb: "",
  },
  {
    name: "Civic Responsibility",
    text:
      "We value civil society. Community members who organize events should assume responsibility for public welfare and endeavor to communicate civic responsibilities to participants. They must also assume responsibility for conducting events in accordance with local, state and federal laws.",
    video: "https://www.youtube.com/watch?v=4AL9RFsjrvk",
    type: VideoType.Principle,
    thumb: "",
  },
  {
    name: "Leaving No Trace",
    text:
      "Our community respects the environment. We are committed to leaving no physical trace of our activities wherever we gather. We clean up after ourselves and endeavor, whenever possible, to leave such places in a better state than when we found them.",
    video: "https://www.youtube.com/watch?v=APCs7t8LdqQ",
    type: VideoType.Principle,
    thumb: "",
  },
  {
    name: "Participation",
    text:
      "Our community is committed to a radically participatory ethic. We believe that transformative change, whether in the individual or in society, can occur only through the medium of deeply personal participation. We achieve being through doing. Everyone is invited to work. Everyone is invited to play. We make the world real through actions that open the heart.",
    video: "https://www.youtube.com/watch?v=APCs7t8LdqQ",
    type: VideoType.Principle,
    thumb: "",
  },
  {
    name: "Immediacy",
    text:
      "Immediate experience is, in many ways, the most important touchstone of value in our culture. We seek to overcome barriers that stand between us and a recognition of our inner selves, the reality of those around us, participation in society, and contact with a natural world exceeding human powers. No idea can substitute for this experience.",
    video: "https://www.youtube.com/watch?v=APCs7t8LdqQ",
    type: VideoType.Principle,
    thumb: "",
  },
];

const Step5 = () => {
  const history = useHistory();

  const [videoType, setVideoType] = useState(VideoType.Entrance);

  const [videoDef, setVideoDef] = useState<VideoDefinition | undefined>(
    videos.filter((v) => v.type === videoType)[0] // get first video of type
  );

  return (
    <div className="splash-page-container">
      <img className="playa-img" src={PLAYA_IMAGE} alt="Playa Background Map" />
      <div className="step-container ten-principles-burning">
        {videoDef && (
          <VideoModal
            show={videoDef !== undefined}
            url={videoDef?.video}
            caption={videoDef?.name}
            autoplay={true}
            onHide={() => {
              setVideoDef(undefined);
              switch (videoType) {
                case VideoType.Entrance:
                  setVideoType(VideoType.Greeter);
                  break;
                case VideoType.Greeter:
                  setVideoType(VideoType.Principle);
                  break;
                case VideoType.Principle:
                  break;
              }
            }}
          ></VideoModal>
        )}
        {videos
          .filter((v) => v.type === videoType)
          .map((q) => (
            <div className="form" key={q.name} onClick={() => setVideoDef(q)}>
              <div className="principle-name" onClick={() => setVideoDef(q)}>
                {q.name}
              </div>
              <div
                className="principle-description"
                onClick={() => setVideoDef(q)}
              >
                {q.text}
              </div>
              {q.thumb && <img src={q.thumb} alt={q.name + " video"}></img>}
            </div>
          ))}
        <button
          className={`btn btn-primary btn-block btn-centered`}
          onClick={() => {
            switch (videoType) {
              case VideoType.Entrance:
                setVideoType(VideoType.Greeter);
                break;
              case VideoType.Greeter:
                setVideoType(VideoType.Principle);
                break;
              case VideoType.Principle:
                history.push(`/enter/step6`);
                break;
            }
          }}
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default Step5;
