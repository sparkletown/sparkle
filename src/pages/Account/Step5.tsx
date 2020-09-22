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
  { name: "Welcome", text: "", video: "", type: VideoType.Entrance, thumb: "" },
  {
    name: "Greeter",
    text: "",
    video: "https://vimeo.com/459967747",
    type: VideoType.Greeter,
    thumb: "https://i.vimeocdn.com/video/960929780_200x150.jpg",
  },
  {
    name: "Consent",
    text: "",
    video: "https://vimeo.com/459967697",
    type: VideoType.Principle,
    thumb: "https://i.vimeocdn.com/video/960929633_200x150.jpg",
  },
  {
    name: "Decommodification",
    text:
      "In order to preserve the spirit of gifting, our community seeks to create social environments that are unmediated by commercial sponsorships, transactions, or advertising. We stand ready to protect our culture from such exploitation. We resist the substitution of consumption for participatory experience.",
    video: "https://vimeo.com/459967711",
    type: VideoType.Principle,
    thumb: "https://i.vimeocdn.com/video/960929692_200x150.jpg",
  },
  {
    name: "Communal Effort",
    text:
      "Our community values creative cooperation and collaboration. We strive to produce, promote and protect social networks, public spaces, works of art, and methods of communication that support such interaction.",
    video: "https://vimeo.com/459967678",
    type: VideoType.Principle,
    thumb: "https://i.vimeocdn.com/video/960929634_200x150.jpg",
  },
  {
    name: "Gifting",
    text:
      "Burning Man is devoted to acts of gift giving. The value of a gift is unconditional. Gifting does not contemplate a return or an exchange for something of equal value.",
    video: "https://vimeo.com/459967726",
    type: VideoType.Principle,
    thumb: "https://i.vimeocdn.com/video/960929707_200x150.jpg",
  },
  {
    name: "Immediacy",
    text:
      "Immediate experience is, in many ways, the most important touchstone of value in our culture. We seek to overcome barriers that stand between us and a recognition of our inner selves, the reality of those around us, participation in society, and contact with a natural world exceeding human powers. No idea can substitute for this experience.",
    video: "https://vimeo.com/459967734",
    type: VideoType.Principle,
    thumb: "https://i.vimeocdn.com/video/960929719_200x150.jpg",
  },
  {
    name: "Leave No Trace",
    text:
      "Our community respects the environment. We are committed to leaving no physical trace of our activities wherever we gather. We clean up after ourselves and endeavor, whenever possible, to leave such places in a better state than when we found them.",
    video: "https://vimeo.com/459967754",
    type: VideoType.Principle,
    thumb: "https://i.vimeocdn.com/video/960929778_200x150.jpg",
  },
  {
    name: "Participation",
    text:
      "Our community is committed to a radically participatory ethic. We believe that transformative change, whether in the individual or in society, can occur only through the medium of deeply personal participation. We achieve being through doing. Everyone is invited to work. Everyone is invited to play. We make the world real through actions that open the heart.",
    video: "https://vimeo.com/459967761",
    type: VideoType.Principle,
    thumb: "https://i.vimeocdn.com/video/960929796_200x150.jpg",
  },
  {
    name: "Radical Inclusion",
    text:
      "Anyone may be a part of Burning Man. We welcome and respect the stranger. No prerequisites exist for participation in our community.",
    video: "https://vimeo.com/459967771",
    type: VideoType.Principle,
    thumb: "https://i.vimeocdn.com/video/960929873_200x150.jpg",
  },
  {
    name: "Radical Self Reliance",
    text:
      "Burning Man encourages the individual to discover, exercise and rely on his or her inner resources.",
    video: "https://vimeo.com/459972981",
    type: VideoType.Principle,
    thumb: "https://i.vimeocdn.com/video/960940437_200x150.jpg",
  },
  {
    name: "Civic Responsibility",
    text:
      "We value civil society. Community members who organize events should assume responsibility for public welfare and endeavor to communicate civic responsibilities to participants. They must also assume responsibility for conducting events in accordance with local, state and federal laws.",
    video: "https://vimeo.com/459967279",
    type: VideoType.Principle,
    thumb: "https://i.vimeocdn.com/video/960928879_200x150.jpg",
  },
  {
    name: "Radical Self Expression",
    text:
      "Radical self-expression arises from the unique gifts of the individual. No one other than the individual or a collaborating group can determine its content. It is offered as a gift to others. In this spirit, the giver should respect the rights and liberties of the recipient.",
    video: "https://vimeo.com/459972989",
    type: VideoType.Principle,
    thumb: "https://i.vimeocdn.com/video/960940416_200x150.jpg",
  },
  {
    name: "Temple Etiquette",
    text: "",
    video: "https://vimeo.com/459972976",
    type: VideoType.Principle,
    thumb: "https://i.vimeocdn.com/video/960940429_200x150.jpg",
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
