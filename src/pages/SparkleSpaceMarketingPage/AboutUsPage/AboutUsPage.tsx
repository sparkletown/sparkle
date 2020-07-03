import React from "react";
import "./AboutUsPage.scss";

const AboutUsPage: React.FunctionComponent = () => {
  return (
    <div className="about-us-container">
      <div>
        <p className="hero-text">About the SparkleVerse team</p>
        <p>
          We’re an ever-expanding group of Burners and enthusiasts for
          avant-garde online experiences. We met each other at criss-crossing
          online parties, <a href="https://co-reality.co/">collectivised</a>,
          and we’ve shared adventures, became friends, and have been organising
          and helping others organise parties throughout the lockdown.
        </p>
        <p>
          We invite you to join a fresh, and expanding SparkleVerse community as
          we build our contribution to the virtual burn ready the beginning of
          September..
        </p>
        <p>Leading on this project are Ed and Chris:</p>
        <p>
          <strong>Ed</strong> is a UK based tech entrepreneur, student of memory
          palaces and amateur philosopher of parties. You can hear some of his
          thoughts on Burning Man in{" "}
          <a href="https://www.youtube.com/watch?v=CMuZ0pV1Vdk">
            this fragment
          </a>{" "}
          of a podcast recorded with Tim Ferriss. He’s helping with the product
          and community sides of the project.
        </p>
        <p>
          <strong>Chris</strong> is an Australian computer scientist who has
          spent 15 years in tech, and has for the last seven years been working
          as an Engineering Manager at two of Silicon Valley’s fastest growing
          private startups. A serial burner and enthusiast for fun, he’s looking
          after the tech platform.
        </p>
      </div>
      <button
        className="btn btn-primary btn-block btn-centered help-build-button"
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

export default AboutUsPage;
