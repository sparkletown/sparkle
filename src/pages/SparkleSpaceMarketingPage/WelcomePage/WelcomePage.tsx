import React from "react";

const WelcomePage: React.FunctionComponent = () => (
  <>
    <div className="hero">
      <p className="hero-text">
        Welcome to the SparkleVerse{" "}
        <span role="img" aria-label="sparkle emoji">
          ✨
        </span>
      </p>
      <div className="subtitle">
        Help co-create a decentralised experimental city in the Multiverse with
        fellow burners from around the world
      </div>
    </div>
    <div className="info-wrapper">
      <h3 className="card-wrapper-title">How the Sparkleverse works:</h3>
      <div className="row card-container">
        <div className="col-md-4">
          <div className="info-card">
            <h3 className="card-title">1. Digital Playa Map</h3>
            <img
              className="image-in-card"
              src="/landscape.webp"
              title="Digital Playa Map image"
            />
            <p>
              A 2-D browser-based map for roaming in shared adventures through
              an integrated patchwork quilt of places and experiences
            </p>
          </div>
        </div>
        <div className="col-md-4">
          <div className="info-card">
            <h3 className="card-title">
              2. Easy, powerful tools to create magic
            </h3>
            <img
              className="image-in-card"
              src="/landscape.webp"
              title="Powerful tools image"
            />
            <p>
              Populate the playa with your camp, art, host performances (DJs,
              talks) etc using simple yet powerful space-creation tools and
              templates
            </p>
          </div>
        </div>
        <div className="col-md-4">
          <div className="info-card">
            <h3 className="card-title">3. Community education + support</h3>
            <img
              className="image-in-card"
              src="/landscape.webp"
              title="Community education image"
            />
            <p>
              Forums, examples, templates and community support to help you add
              your magic to the Sparkleverse for others to enjoy
            </p>
          </div>
        </div>
      </div>
    </div>

    <div className="interested-contributors">
      <div className="interested-contribtors-text">
        Interested to connect, learn more or participate:
      </div>
      <input type="text" placeholder="Enter your email" />
      <input className="btn btn-primary submit-btn" type="submit" />
    </div>

    <div className="info-wrapper">
      <h3>Watch the video for a quick introduction to our approach</h3>
      <div className="video-container">
        <iframe
          title="Our approach to Burning Man"
          className="video"
          src="https://www.youtube.com/embed/4Ku4E2MXp-k"
          frameBorder="0"
          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
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
  </>
);

export default WelcomePage;
