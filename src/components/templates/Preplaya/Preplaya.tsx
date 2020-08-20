import React, { useCallback, useEffect, useState, useRef } from "react";
import { useFirestoreConnect } from "react-redux-firebase";
import { Modal } from "react-bootstrap";
import { Venue } from "types/Venue";
import { useSelector } from "hooks/useSelector";
import { DEFAULT_MAP_ICON_URL, PLAYA_WIDTH_AND_HEIGHT } from "settings";
import VenuePreview from "./VenuePreview";
import { WithId } from "utils/id";
import useLocationUpdateEffect, {
  updateLocationData,
} from "utils/useLocationUpdateEffect";
import { useUser } from "hooks/useUser";
import { useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faMinus } from "@fortawesome/free-solid-svg-icons";
import { throttle } from "lodash";
import AvatarLayer from "./AvatarLayer";

import "./Preplaya.scss";

const isPlaced = (venue: Venue) => {
  return venue && venue.placement && venue.placement.x && venue.placement.y;
};

const Preplaya = () => {
  useFirestoreConnect("venues");
  const [showModal, setShowModal] = useState(false);
  const [selectedVenue, setSelectedVenue] = useState<WithId<Venue>>();
  const [scale, setScale] = useState(
    window.innerWidth / PLAYA_WIDTH_AND_HEIGHT
  );
  const [zoom, setZoom] = useState(1.0);
  const [translateX, setTranslateX] = useState(0);
  const [translateY, setTranslateY] = useState(0);
  const mapRef = useRef<HTMLDivElement>(null);

  const { user } = useUser();

  useLocationUpdateEffect(user, "Playa");

  useEffect(() => {
    const rescale = () => {
      setScale(window.innerWidth / PLAYA_WIDTH_AND_HEIGHT);
    };

    let dragging = false;
    const translateX = 0;
    const translateY = 0;
    let dragStartX = 0;
    let dragStartY = 0;
    const dragStartListener = (event: MouseEvent | TouchEvent) => {
      if (event.which !== 1) {
        return;
      }
      event.preventDefault();
      dragging = true;
      if (event instanceof TouchEvent) {
        dragStartX = event.touches[0].clientX;
        dragStartY = event.touches[0].clientY;
      } else {
        dragStartX = event.clientX;
        dragStartY = event.clientY;
      }
    };
    const pan = throttle((event: MouseEvent | TouchEvent) => {
      if (event instanceof TouchEvent) {
        setTranslateX(
          translateX + (event.touches[0].clientX - dragStartX) / zoom
        );
        setTranslateY(
          translateY + (event.touches[0].clientY - dragStartY) / zoom
        );
      } else {
        setTranslateX(translateX + (event.clientX - dragStartX) / zoom);
        setTranslateY(translateY + (event.clientY - dragStartY) / zoom);
      }
    }, 25);
    const moveListener = (event: MouseEvent | TouchEvent) => {
      if (dragging && mapRef.current) {
        event.preventDefault();
        pan(event);
      }
    };
    const dragEndListener = (event: MouseEvent | TouchEvent) => {
      if (dragging && mapRef.current) {
        event.preventDefault();
        pan(event);
      }
      dragging = false;
    };

    if (mapRef.current) {
      mapRef.current.addEventListener("mousedown", dragStartListener);
      mapRef.current.addEventListener("touchstart", dragStartListener, {
        passive: true,
      });
      window.addEventListener("mousemove", moveListener);
      window.addEventListener("touchmove", moveListener);
      window.addEventListener("mouseup", dragEndListener);
      window.addEventListener("touchend", dragEndListener);
    }
    const mapRefCurrent = mapRef.current;

    window.addEventListener("resize", rescale);
    return () => {
      window.removeEventListener("resize", rescale);
      if (mapRefCurrent) {
        mapRefCurrent.removeEventListener("mousedown", dragStartListener);
        mapRefCurrent.removeEventListener("touchstart", dragStartListener);
        window.removeEventListener("mousemove", moveListener);
        window.removeEventListener("touchmove", moveListener);
        window.removeEventListener("mouseup", dragEndListener);
        window.addEventListener("touchend", dragEndListener);
      }
    };
  }, [zoom]);

  const venues = useSelector((state) => state.firestore.ordered.venues);

  const showVenue = useCallback(
    (venue: WithId<Venue>) => {
      setSelectedVenue(venue);
      setShowModal(true);
    },
    [setShowModal, setSelectedVenue]
  );

  const hideVenue = useCallback(() => {
    setShowModal(false);
    user && updateLocationData(user, "playa");
  }, [setShowModal, user]);

  const { camp } = useParams();
  useEffect(() => {
    if (camp) {
      const campVenue = venues?.find((venue) => venue.id === camp);
      if (campVenue) {
        const campY = (campVenue.placement?.y || 0) * scale;
        const scrollY = campY - window.innerHeight / 2;
        window.scrollTo(0, scrollY);
        showVenue(campVenue);
      }
    }
  }, [camp, venues, showVenue, scale]);

  return (
    <>
      <div className="preplaya-container">
        <div
          className="map-container"
          ref={mapRef}
          style={{
            transform: `scale(${zoom}) translate3d(${translateX}px, ${translateY}px, 0)`,
          }}
        >
          <div className="demo-message">
            This is a demo of how camps and art will look on the final,
            fully-interactive playa.
          </div>
          <img
            className="playa-background"
            src="/maps/playa2d.jpg"
            alt="Playa Background Map"
          />
          {venues?.filter(isPlaced).map((venue, idx) => (
            <div
              className="venue"
              style={{
                top: (venue.placement?.y || 0) * scale,
                left: (venue.placement?.x || 0) * scale,
                position: "absolute",
              }}
              onClick={() => showVenue(venue)}
              key={idx}
            >
              <img
                className="venue-icon"
                src={venue.mapIconImageUrl || DEFAULT_MAP_ICON_URL}
                alt={`${venue.name} Icon`}
              />
              {selectedVenue?.id === venue.id && <div className="selected" />}
            </div>
          ))}
          <AvatarLayer />
        </div>
        <div className="button-bar">
          <div className="button" onClick={() => setZoom(zoom + 0.1)}>
            <FontAwesomeIcon icon={faPlus} className="icon" />
          </div>
          <div className="button" onClick={() => setZoom(zoom - 0.1)}>
            <FontAwesomeIcon icon={faMinus} className="icon" />
          </div>
        </div>
      </div>
      <Modal show={showModal} onHide={hideVenue}>
        {selectedVenue && user && (
          <VenuePreview user={user} venue={selectedVenue} />
        )}
      </Modal>
    </>
  );
};

export default Preplaya;
