import React, {
  useCallback,
  useEffect,
  useState,
  useRef,
  useMemo,
} from "react";
import { useFirestoreConnect } from "react-redux-firebase";
import { Modal, Overlay } from "react-bootstrap";
import { Venue } from "types/Venue";
import { useSelector } from "hooks/useSelector";
import {
  DEFAULT_MAP_ICON_URL,
  PLAYA_WIDTH_AND_HEIGHT,
  PLAYA_TEMPLATES,
  PLAYA_IMAGE,
} from "settings";
import VenuePreview from "./VenuePreview";
import { WithId } from "utils/id";
import useLocationUpdateEffect, {
  updateLocationData,
} from "utils/useLocationUpdateEffect";
import { useUser } from "hooks/useUser";
import { useParams } from "react-router-dom";
import { throttle } from "lodash";

import "./Preplaya.scss";
import { peopleAttending } from "utils/venue";
import ChatDrawer from "components/organisms/ChatDrawer";
import SparkleFairiesPopUp from "components/molecules/SparkleFairiesPopUp/SparkleFairiesPopUp";

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
      mapRef.current.addEventListener("touchstart", dragStartListener);
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
      if (campVenue && !PLAYA_TEMPLATES.includes(campVenue.template)) {
        const campY = (campVenue.placement?.y || 0) * scale;
        const scrollY = campY - window.innerHeight / 2;
        window.scrollTo(0, scrollY);
        showVenue(campVenue);
      }
    }
  }, [camp, venues, showVenue, scale]);

  const [showVenueTooltip, setShowVenueTooltip] = useState(false);
  const [hoveredVenue, setHoveredVenue] = useState<Venue>();
  const [, setRerender] = useState(0);
  const hoveredRed = useRef<HTMLDivElement>(null);

  // Forces a rerender after `hoveredVenue` and `hoveredRed` changed
  // Otherwise changing the ref does not trigger a rerender
  // And the Overlay position is always one tick late
  // (next to the previously hovered venue)
  useEffect(() => {
    setRerender((c) => c + 1);
  }, [hoveredVenue]);

  const partygoers = useSelector((state) => state.firestore.ordered.partygoers);
  const users = useMemo(
    () => hoveredVenue && peopleAttending(partygoers, hoveredVenue),
    [partygoers, hoveredVenue]
  );

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
            src={PLAYA_IMAGE}
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
              ref={hoveredVenue === venue ? hoveredRed : undefined}
              onMouseOver={() => {
                setHoveredVenue(venue);
                setShowVenueTooltip(true);
              }}
              onMouseLeave={() => setShowVenueTooltip(false)}
            >
              <img
                className="venue-icon"
                src={venue.mapIconImageUrl || DEFAULT_MAP_ICON_URL}
                alt={`${venue.name} Icon`}
              />
              {selectedVenue?.id === venue.id && <div className="selected" />}
            </div>
          ))}
          <Overlay target={hoveredRed.current} show={showVenueTooltip}>
            {({ placement, arrowProps, show: _show, popper, ...props }) => (
              // @ts-expect-error
              <div
                {...props}
                style={{
                  ...props.style,
                  padding: "10px",
                }}
              >
                <div className="playa-venue-text">
                  <div className="playa-venue-maininfo">
                    <div className="playa-venue-title">
                      {hoveredVenue?.name}
                    </div>
                    <div className="playa-venue-people">
                      {users?.length ?? 0}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </Overlay>
        </div>
        <div className="playa-controls">
          <div className="playa-controls-zoom">
            <div
              className="playa-controls-zoom-in"
              onClick={() => setZoom(zoom + 0.1)}
            ></div>
            <div
              className="playa-controls-zoom-out"
              onClick={() => setZoom(Math.max(zoom - 0.1, 1))}
            ></div>
          </div>
          <div className="playa-controls-shout">
            <div className="playa-controls-shout-btn"></div>
          </div>
        </div>
        <div className="chat-pop-up">
          <ChatDrawer roomName={"PLAYA"} chatInputPlaceholder="Chat" />
        </div>
        <div className="sparkle-fairies">
          <SparkleFairiesPopUp />
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
