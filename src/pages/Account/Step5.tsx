import React, { useState } from "react";
import { useHistory } from "react-router-dom";

import { PLAYA_IMAGE, PLAYA_VENUE_NAME } from "settings";

import VideoModal from "components/organisms/VideoModal";

import "firebase/storage";

import "./Account.scss";

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
    name: "Welcome to Burning Seed",
    text: "",
    video: "https://vimeo.com/460888837",
    type: VideoType.Entrance,
    thumb: "https://i.vimeocdn.com/video/962490951_100x75.jpg",
  },
  {
    name: "Purple Rain",
    text: "wants you to ring the Burgin (first time burner) Bell!",
    video: "https://vimeo.com/459967747",
    type: VideoType.Greeter,
    thumb: "https://i.vimeocdn.com/video/960929780_100x75.jpg",
  },
  {
    name: "Magic Man",
    text:
      "wants to talk about manifesting our dreams and the universal magic of Seed",
    video: "https://vimeo.com/461224611",
    type: VideoType.Greeter,
    thumb: "https://i.vimeocdn.com/video/963018060_100x75.jpg",
  },
  {
    name: "MissAppropriation",
    text:
      "wants to remind you of the importance of reflecting on our principles and setting intentions",
    video: "https://vimeo.com/461229492",
    type: VideoType.Greeter,
    thumb: "https://i.vimeocdn.com/video/963026505_100x75.jpg",
  },
  {
    name: "Virgin or veteran",
    text: "get christened with Christian!",
    video: "https://vimeo.com/461300302",
    type: VideoType.Greeter,
    thumb: "https://i.vimeocdn.com/video/963147250_100x75.jpg",
  },
  {
    name: "Consent",
    text:
      "Consent is an enthusiastic yes and must be sought in our interactions with others. This may be while entering their space or camp, or before becoming intimately acquainted. If you don't have an enthusiastic YES - you don't have consent. And of course, consent can be withdrawn at any time.",
    video: "https://vimeo.com/459967697",
    type: VideoType.Principle,
    thumb: "https://i.vimeocdn.com/video/960929633_100x75.jpg",
  },
  {
    name: "Decommodification",
    text:
      "In order to preserve the spirit of gifting, our community seeks to create social environments that are unmediated by commercial sponsorships, transactions, or advertising. We stand ready to protect our culture from such exploitation. We resist the substitution of consumption for participatory experience.",
    video: "https://vimeo.com/459967711",
    type: VideoType.Principle,
    thumb: "https://i.vimeocdn.com/video/960929692_100x75.jpg",
  },
  {
    name: "Communal Effort",
    text:
      "Our community values creative cooperation and collaboration. We strive to produce, promote and protect social networks, public spaces, works of art, and methods of communication that support such interaction.",
    video: "https://vimeo.com/459967678",
    type: VideoType.Principle,
    thumb: "https://i.vimeocdn.com/video/960929634_100x75.jpg",
  },
  {
    name: "Gifting",
    text:
      "Burning Man is devoted to acts of gift giving. The value of a gift is unconditional. Gifting does not contemplate a return or an exchange for something of equal value.",
    video: "https://vimeo.com/459967726",
    type: VideoType.Principle,
    thumb: "https://i.vimeocdn.com/video/960929707_100x75.jpg",
  },
  {
    name: "Immediacy",
    text:
      "Immediate experience is one of the most important touchstones of value in our culture. We seek to overcome barriers that stand between us and a recognition of our inner selves, the reality of those around us, participation in society, and contact with a natural world exceeding human powers. ",
    video: "https://vimeo.com/459967734",
    type: VideoType.Principle,
    thumb: "https://i.vimeocdn.com/video/960929719_100x75.jpg",
  },
  {
    name: "Leave No Trace",
    text:
      "Our community respects the environment. We are committed to leaving no physical trace of our activities wherever we gather. We clean up after ourselves and endeavor, whenever possible, to leave such places in a better state than when we found them.",
    video: "https://vimeo.com/459967754",
    type: VideoType.Principle,
    thumb: "https://i.vimeocdn.com/video/960929778_100x75.jpg",
  },
  {
    name: "Participation",
    text:
      "Our community is committed to a radically participatory ethic. We believe that transformative change, whether in the individual or in society, can occur only through the medium of deeply personal participation. We achieve being through doing. Everyone is invited to work. Everyone is invited to play.",
    video: "https://vimeo.com/459967761",
    type: VideoType.Principle,
    thumb: "https://i.vimeocdn.com/video/960929796_100x75.jpg",
  },
  {
    name: "Radical Inclusion",
    text:
      "Anyone may be a part of Burning Man. We welcome and respect the stranger. No prerequisites exist for participation in our community.",
    video: "https://vimeo.com/459967771",
    type: VideoType.Principle,
    thumb: "https://i.vimeocdn.com/video/960929873_100x75.jpg",
  },
  {
    name: "Radical Self Reliance",
    text:
      "We encourage the individual to discover, exercise and rely on their inner resources. Self-reliance means looking out for yourself and bringing everything you need.",
    video: "https://vimeo.com/459972981",
    type: VideoType.Principle,
    thumb: "https://i.vimeocdn.com/video/960940437_100x75.jpg",
  },
  {
    name: "Civic Responsibility",
    text:
      "We value civil society. Community members who organise events should assume responsibility for public welfare and endeavor to communicate civic responsibilities to participants. They must also assume responsibility for conducting events in accordance with local, state and federal laws.",
    video: "https://vimeo.com/459967279",
    type: VideoType.Principle,
    thumb: "https://i.vimeocdn.com/video/960928879_100x75.jpg",
  },
  {
    name: "Radical Self Expression",
    text:
      "Radical self-expression arises from the unique gifts of the individual. No one other than the individual or a collaborating group can determine its content. It is offered as a gift to others. In this spirit, the giver should respect the rights and liberties of the recipient.",
    video: "https://vimeo.com/459972989",
    type: VideoType.Principle,
    thumb: "https://i.vimeocdn.com/video/960940416_100x75.jpg",
  },
  {
    name: "Temple Etiquette",
    text:
      "The intent of the Temple has always been quiet and introspective - as distinct from the focus of pretty much everything else at Seed which is tipped towards self expression. The Temple Burn is a time for quiet reflection - a release from the past and a look towards the future.",
    video: "https://vimeo.com/459972976",
    type: VideoType.Principle,
    thumb: "https://i.vimeocdn.com/video/960940429_100x75.jpg",
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
      <img
        className="playa-img"
        src={PLAYA_IMAGE}
        alt={`${PLAYA_VENUE_NAME} Background Map`}
      />
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
                  const greeterVids = videos.filter(
                    (v) => v.type === VideoType.Greeter
                  );
                  if (greeterVids && greeterVids.length === 1)
                    setVideoDef(greeterVids[0]); // if there is only one, then autoplay
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
        {videoType === VideoType.Principle && (
          <div className="principle-name">
            Our community embraces the 10 Principles - they guide how we act and
            treat each other. Wanna know more? Read on and check out our 10
            Principles videos!
          </div>
        )}
        {videoType === VideoType.Greeter && (
          <div className="principle-name">
            Pick a greeter to welcome you to Burning Seed 2020!
          </div>
        )}
        {videos
          .filter((v) => v.type === videoType)
          .map((q) => (
            <div className="form" key={q.name} onClick={() => setVideoDef(q)}>
              <div className="video-name" onClick={() => setVideoDef(q)}>
                {q.name}
              </div>
              <div className="video-description" onClick={() => setVideoDef(q)}>
                {q.text}
              </div>
              {q.thumb && (
                <img
                  className="video-thumb"
                  src={q.thumb}
                  alt={q.name + " video"}
                ></img>
              )}
            </div>
          ))}
        <button
          className={`btn btn-primary btn-block btn-centered`}
          onClick={() => {
            switch (videoType) {
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
