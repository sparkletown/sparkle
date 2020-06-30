import React from "react";
import WithNavigationBar from "components/organisms/WithNavigationBar";

const INTRO_VIDEO = (
  <iframe
    title="SparkleVerse Presentation"
    width="100%"
    height="100%"
    className="marketing-video"
    src="https://www.youtube.com/embed/4Ku4E2MXp-k"
    frameBorder="0"
    allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture;"
  />
);
const CTA_BUTTON = (
  <button
    className="btn btn-primary btn-block btn-centered"
    onClick={() =>
      window.open(
        "https://docs.google.com/forms/d/e/1FAIpQLSeGGsafBOnO63GOiPjBhIdFaEqoM0xBSERdkTEqh3DrPteQvw/viewform"
      )
    }
  >
    Register your interest
  </button>
);

const SparkleSpaceMarketingPage = () => (
  <WithNavigationBar redirectionUrl="/SparkleVerse">
    <div className="full-page-container marketing-page">
      <div className="hero">
        <p className="hero-text">
          Welcome to the co-creation of The SparkleVerse!{" "}
          <span role="img" aria-label="sparkle emoji">
            ✨
          </span>
        </p>
      </div>
      <div className="detail">
        <p className="centered-text">
          The SparkleVerse is a platform upon which we’ll collectively co-create
          a magical sub-universe of fun within Burning Man’s online multiverse.
        </p>
        <p>
          Our tools allow any theme camp, artist, performer or art-car-mechanic
          to build elaborate virtual venues and host experiences within them on
          our virtual Playa.
        </p>
        <p>
          Watch the video for a quick introduction to our thinking and
          framework.
        </p>

        {INTRO_VIDEO}
        {CTA_BUTTON}
      </div>
      <div className="detail">
        <p className="detail-hero-text">1. The Vision</p>
        <p className="centered-text">
          We believe that Online Burning Man can have effects on consciousness
          as profound, beautiful, and rarified as those that occur every year at
          Black Rock City itself.
        </p>
        <p>
          Though this year’s Burning Man will feature participants who are
          spatially separated, it’s evident that these people (their time, their
          consciousness, their humanity) are as real as any burner of
          yesteryear, and there is no reason to believe they cannot enjoy
          experiences of equivalent magnificence.
        </p>
        <p>
          It’ll take some doing, however. The key, we believe, is to design into
          the fabric of the online burn the context, scarcity, intimacy, and
          variety that characterize experiential encounters at normal Burns.
        </p>
        <p>
          This conviction has informed the design and conception of the
          Sparkleverse, which seeks to allow two things:
        </p>
        <ol>
          <li>
            The empowerment of as wide a variety of burners as possible to
            invent intimate spaces of performance, connection, dance, music,
            camp, and so on capable of exciting intense open-ness and attention
          </li>
          <li>
            For these spaces to be arranged in a universe where you can only be
            in one place at a time, where discovery is through movement, where
            serendipity is the norm, and where participation and commitment are
            constitutive
          </li>
        </ol>
        {CTA_BUTTON}
      </div>
      <div className="detail">
        <p className="detail-hero-text">2. The Venues</p>
        <p className="centered-text">
          Burning man experiences are essentially connected to their locations:
          think of theme camps, bars, mutant vehicles, RVs, dance-parties, the
          trash fence, a curious art-work in some deep lonely corner of the
          Playa.
        </p>
        <p>
          The Burn as a whole can, therefore, be seen as a myriad of
          interconnected spaces, each providing the context and emotional
          crucible for the experiences latent within.
        </p>
        <p>
          That’s why the fundamental unit of the Sparkleverse is that of a
          venue: an immersive social space. Venues can infinitely nest, but in a
          basic form they are as simple as a clickable map, a set of rooms, and
          room in which people can connect and communicate in novel ways with
          the people around you.
        </p>
        <p>
          In the Sparkleverse, anyone can add and customize a venue, a socially
          inhabited space, in which to share their creativity- and receive
          support and help in doing so.
        </p>
        <p>
          To ease this process, we are preparing customizable venue templates to
          get space-creators up and running: including a Jazz Bar, a theme camp,
          a cocktail party, a dance floor, and a white-out... each inviting its
          own quality of inhabitation and experience, each modifiable in ways
          simple and complex.
        </p>
        <p>
          We hope, with your engagement in tinkering with and extending our
          open-source software, hundreds of further templates will soon be on
          their way.
        </p>
        {CTA_BUTTON}
      </div>
      <div className="detail">
        <p className="detail-hero-text">3. The Map</p>
        <p className="centered-text">
          Access to all the experiences and spaces in the SparkleVerse is via a
          simple 2-D map of the Playa, mirroring the blank 2-dimensional
          simplicity of IRL BM itself.
        </p>
        <p>
          Upon this map, we have reproduced some of the core scarcities of the
          burn. All burners can have but one location in spacetime; there is
          ambient audio, but only of your current location; your video avatar
          can travel at no more than 4 mph (or 8mph if on a bike).
        </p>
        <p>
          And it is through this map that burners will, in the Sparkleverse,
          encounter the myriad venues that pour forth from the creativity of our
          collective endeavor: enjoying, we hope, the kinds of experience of
          mind-expanding richness, intimacy, and creativity that characterize
          participation at spatial centralized Burns.
        </p>
        {CTA_BUTTON}
      </div>
    </div>
  </WithNavigationBar>
);

export default SparkleSpaceMarketingPage;
