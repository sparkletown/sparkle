import React from "react";
import "./FAQPage.scss";

const FAQPage: React.FunctionComponent = () => {
  return (
    <div className="faq-container">
      <p className="hero-text">This is our continuously updated FAQ section</p>
      <div>
        <h2>Tickets</h2>
        <p>
          <strong>How can I buy tickets for the SparkleVerse?</strong>
        </p>
        <p>
          This information will be available in the near future. Please
          subscribe for updates so we may notify you.
        </p>

        <h2>Technology &amp; Compatibility</h2>
        <p>
          <strong>How does the SparkleVerse work?</strong>
        </p>
        <p>
          The core of the SparkleVerse is web-based - like a cross between
          Google Maps and a computer game. You’ll be able to wander through a 2D
          map of a digital player, interact with other burners who are in close
          proximity through audio, video and messaging - and along your
          adventures - interact with all kinds of places and performances that
          are created. Our approach combines ease-of-use - so all participants
          will be able to move around and create experiences for others - as
          well as flexibility and extensibility for those who are more
          technically proficient. In this way, you can create a simple camp
          using our templates and tools, or you can build your own experience
          realms for other burners.
        </p>
        <p>
          <strong>What are the requirements to access the Sparkleverse?</strong>
        </p>
        <p>
          <i>Minimum:</i>
          <br />
          The SparkleVerse is intended to be highly compatible for everyone with
          a computer or laptop that is less than 5 years old or is capable of
          running up to date browsers and is on a good internet connection. We
          also recommend headphones and find bluetooth wireless headphones
          provide most freedom.
        </p>
        <p>
          <i>Recommended:</i>
          <br />A more recent computer, with a larger monitor or even projector,
          two pairs of bluetooth headphones (so you can charge one while using
          the other) and a fast connection will help you make the most of the
          experience. If you have a VR headset, this may allow you to access art
          that requires it in a different way.
        </p>
        <h2>Creating in the Sparkleverse</h2>
        <p>
          We are building tools to integrate almost any experience you can think
          of, as well as templates that allow you to focus on art or
          performances
        </p>
        <h2>Artists</h2>
        <p>
          <strong>How can I create art in the SparkleVerse?</strong>
        </p>
        <p>
          Your unique offering will be located on the map, and burners will be
          able to interact with this through audio, video or multimedia - and
          where more appropriate, extended through VR. We ask that experiences
          are highly compatible for everyone, but can be enhanced through VR
          integration for those with appropriate technology.
        </p>
        <h2>Camps</h2>
        <p>
          <strong>
            Can I create, find and join camps in the SparkleVerse?
          </strong>
        </p>
        <p>
          Absolutely - the SparkleVerse is intended to empower groups of people
          to create their own camps and the magic of the experience is as real
          as you make it. We encourage you to create your own virtual spaces to
          share with each other. Your creative make believe is key to making
          this magic real for others.
        </p>
        <h2>Mutant Art Vehicles</h2>
        <p>
          <strong>
            Can I create a mutant art vehicle for the SparkleVerse?
          </strong>
        </p>
        <p>
          Absolutely - Art Cars will exist on the 2D map and move around like
          they do in BRC. We’ll provide templates and tools so you can build
          one.
        </p>
        <h2>Gifting</h2>
        <p>
          <strong>What kinds of gifts can I give in the SparkleVerse?</strong>
        </p>
        <p>
          The art you create and the experiences you share are a primary form of
          gift. We will also allow you to give different kinds of digital gifts
          within a structure.
        </p>
        <h2>Immersion</h2>
        <p>
          <strong>How can I get the most out of this experience?</strong>
        </p>
        <p>
          We have structured the SparkleVerse to be an immersive adventure.
          <br />
          To get the most out of this, your commitment is highly recommended.
          <br />
          You’ll go through different stages to experience this - preparation -
          arriving - and then setting up camp in the digital playa. From here,
          your magic begins.
        </p>
        <p>
          <strong>
            How do I get involved? What kind of support is available?
          </strong>
        </p>
        <p>
          We will provide tools to make this easy, tutorials to show you how,
          and do all we can to help you co-create your part of the multiverse in
          Sparkle.
        </p>
      </div>

      <button
        className="btn btn-primary btn-block btn-centered help-build-button"
        id="marketing-page-enter-faq-tab"
        onClick={() =>
          window.open(
            "https://docs.google.com/forms/d/e/1FAIpQLSeGGsafBOnO63GOiPjBhIdFaEqoM0xBSERdkTEqh3DrPteQvw/viewform"
          )
        }
      >
        Help build the SparkleVerse
      </button>
    </div>
  );
};

export default FAQPage;
