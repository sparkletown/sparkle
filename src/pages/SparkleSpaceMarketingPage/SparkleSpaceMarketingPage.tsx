import React from "react";
import WithNavigationBar from "components/organisms/WithNavigationBar";

const SparkleSpaceMarketingPage = () => (
  <WithNavigationBar>
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
        <p>
          The SparkleVerse is a platform for co-creating an experiencing an epic
          online Burning Man. Build your performance, theme camp or art-car with
          our fabulous tools, and put it on our virtual Playa.
        </p>
        <iframe
          title="SparkleVerse Presentation"
          width="100%"
          height="100%"
          className="marketing-video"
          src="https://www.youtube.com/embed/4Ku4E2MXp-k"
          frameBorder="0"
          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture;"
        />
        <form action="https://docs.google.com/forms/d/e/1FAIpQLSeGGsafBOnO63GOiPjBhIdFaEqoM0xBSERdkTEqh3DrPteQvw/viewform">
          <input
            type="submit"
            className="btn btn-primary btn-block btn-centered"
            value="Register your interest"
          />
        </form>
      </div>
      <div className="detail-alt">
        <p className="detail-hero-text">1. The Vision</p>
        <p>We believe online Burning Man can be as good as the real thing.</p>
        <ul>
          <li>Scarcity.</li>
          <li>Context.</li>
          <li>Commitment.</li>
          <li>Co-invention.</li>
          <li>Non-commercial.</li>
          <li>Fun</li>
        </ul>
      </div>
      <div className="detail">
        <p className="detail-hero-text">2. The Map</p>
        <p>The SparkleVerse map is a 2D navigable map with:</p>
        <ul>
          <li>A singular identity.</li>
          <li>Singular location in space-time.</li>
          <li>Ambient audio.</li>
          <li>Navigability.</li>
          <li>Video avatars.</li>
          <li>Art cars.</li>
        </ul>
      </div>
      <div className="detail-alt">
        <p className="detail-hero-text">3. The Venues</p>
        <p>
          Plugging into the map are venues. Anyone can add and customize a venue
          of which we have templates. These provide context, and social
          interaction at many scales:
        </p>
        <ul>
          <li>Theme camps.</li>
          <li>Bars.</li>
          <li>Mutant art cars.</li>
          <li>Art pieces.</li>
        </ul>
        <form action="https://docs.google.com/forms/d/e/1FAIpQLSeGGsafBOnO63GOiPjBhIdFaEqoM0xBSERdkTEqh3DrPteQvw/viewform">
          <input
            type="submit"
            className="btn btn-primary btn-block btn-centered"
            value="Register your interest"
          />
        </form>
      </div>
    </div>
  </WithNavigationBar>
);

export default SparkleSpaceMarketingPage;
