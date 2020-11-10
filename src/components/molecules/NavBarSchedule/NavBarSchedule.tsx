import { useSelector } from "hooks/useSelector";
import React from "react";

interface PropTypes {
  isVisible: boolean;
}

const NavBarSchedule = ({ isVisible }: PropTypes) => {
  const { venueEvents } = useSelector((state) => ({
    venueEvents: state.firestore.ordered.venueEvents,
  }));

  return (
    <div className={`schedule-dropdown-body ${isVisible ? "show" : ""}`}>
      <div className="partyinfo-container">
        <div className="partyinfo-main">
          <div
            className="partyinfo-pic"
            style={{ backgroundImage: `url(./jam-logo.png)` }}
          ></div>
          <div className="partyinfo-title">
            <h2>Jam Online</h2>
            <h3>The best online party</h3>
          </div>
        </div>
        <div className="partyinfo-desc">
          <p>
            Nullam quis risus eget urna mollis ornare vel eu leo. Fusce dapibus,
            tellus ac cursus commodo, tortor mauris condimentum nibh, ut
            fermentum massa justo sit amet risus.
          </p>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis
            mollis, est non commodo luctus, nisi erat porttitor ligula, eget
            lacinia odio sem nec elit. Donec id elit non mi porta gravida at
            eget metus. Aenean lacinia bibendum nulla sed consectetur.
          </p>
        </div>
      </div>

      <div className="schedule-container">
        <ul className="schedule-tabs">
          <li className="active">Today</li>
          <li>Wed</li>
          <li>Thu</li>
          <li>Fri</li>
          <li>Sat</li>
          <li>Sun</li>
        </ul>
        <div className="schedule-day-container">
          <div className="schedule-event-container">
            <div className="schedule-event-time">
              <div className="schedule-event-time-start">12:00 PM</div>
              <div className="schedule-event-time-end">1:00 AM</div>
            </div>
            <div className="schedule-event-info">
              <div className="schedule-event-info-title">Urban Jazz</div>
              <div className="schedule-event-info-description">
                Lean back, relax, and feel the magic wash over you. Perfect soft
                landing & after party.
              </div>
              <div className="schedule-event-info-room">
                <a href="#">Camp Opemikon</a>
              </div>
            </div>
          </div>

          <div className="schedule-event-container">
            <div className="schedule-event-time">
              <div className="schedule-event-time-start">11:00 PM</div>
              <div className="schedule-event-time-end">12:00 AM</div>
            </div>
            <div className="schedule-event-info">
              <div className="schedule-event-info-title">
                Deep Tribal, Techno, Trancy, Trippy Vibes
              </div>
              <div className="schedule-event-info-description">
                Come dance with us in the Funk in the Trunk. Make sure to mute
                your microphone and grab the Twitch link to hear the music!
              </div>
              <div className="schedule-event-info-room">
                <a href="#">Tent McKenzy</a>
              </div>
            </div>
          </div>

          <div className="schedule-event-container schedule-event-container_live">
            <div className="schedule-event-time">
              <div className="schedule-event-time-start">12:00 PM</div>
              <div className="schedule-event-time-end">1:00 AM</div>
              <span className="schedule-event-time-live">Live</span>
            </div>
            <div className="schedule-event-info">
              <div className="schedule-event-info-title">Urban Jazz</div>
              <div className="schedule-event-info-description">
                Lean back, relax, and feel the magic wash over you. Perfect soft
                landing & after party.
              </div>
              <div className="schedule-event-info-room">
                <a href="#">Camp Opemikon</a>
              </div>
            </div>
          </div>

          <div className="schedule-event-container">
            <div className="schedule-event-time">
              <div className="schedule-event-time-start">12:00 PM</div>
              <div className="schedule-event-time-end">1:00 AM</div>
            </div>
            <div className="schedule-event-info">
              <div className="schedule-event-info-title">Midnight Ritual</div>
              <div className="schedule-event-info-description">
                Discover your origins. Explore light's restless journey from
                stars to chlorophyll, told through the lens of wild edible &
                medicinal plants.
              </div>
              <div className="schedule-event-info-room">
                <a href="#">Center Camp Cafe</a>
              </div>
            </div>
          </div>

          <div className="schedule-event-container">
            <div className="schedule-event-time">
              <div className="schedule-event-time-start">12:00 PM</div>
              <div className="schedule-event-time-end">1:00 AM</div>
            </div>
            <div className="schedule-event-info">
              <div className="schedule-event-info-title">Urban Jazz</div>
              <div className="schedule-event-info-description">
                Lean back, relax, and feel the magic wash over you. Perfect soft
                landing & after party.
              </div>
              <div className="schedule-event-info-room">
                <a href="#">Camp Opemikon</a>
              </div>
            </div>
          </div>

          <div className="schedule-event-container">
            <div className="schedule-event-time">
              <div className="schedule-event-time-start">12:00 PM</div>
              <div className="schedule-event-time-end">1:00 AM</div>
            </div>
            <div className="schedule-event-info">
              <div className="schedule-event-info-title">Urban Jazz</div>
              <div className="schedule-event-info-description">
                Lean back, relax, and feel the magic wash over you. Perfect soft
                landing & after party.
              </div>
              <div className="schedule-event-info-room">
                <a href="#">Camp Opemikon</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavBarSchedule;
