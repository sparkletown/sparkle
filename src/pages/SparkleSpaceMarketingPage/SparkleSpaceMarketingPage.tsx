import React from "react";
import WithNavigationBar from "components/organisms/WithNavigationBar";

const SparkleSpaceMarketingPage = () => (
  <WithNavigationBar>
    <div className="full-page-container marketing-page">
      <div className="hero">
        <p className="hero-text">
          Welcome to the SparkleVerse.{" "}
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
      </div>
      <div className="detail-alt">
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
      </div>
    </div>
  </WithNavigationBar>
);

export default SparkleSpaceMarketingPage;
