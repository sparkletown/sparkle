import React, {
  useCallback,
  useEffect,
  useState,
  useRef,
  useMemo,
  useLayoutEffect,
} from "react";
import { useFirestoreConnect } from "react-redux-firebase";
import { Modal, Overlay } from "react-bootstrap";
import { Venue, VenuePlacement } from "types/Venue";
import { useSelector } from "hooks/useSelector";
import {
  DEFAULT_MAP_ICON_URL,
  PLAYA_TEMPLATES,
  PLAYA_IMAGE,
  PLAYA_WIDTH_AND_HEIGHT,
} from "settings";
import VenuePreview from "./VenuePreview";
import { WithId } from "utils/id";
import useLocationUpdateEffect, {
  updateLocationData,
} from "utils/useLocationUpdateEffect";
import { useUser } from "hooks/useUser";
import { useParams } from "react-router-dom";
import { throttle } from "lodash";
import AvatarLayer from "./AvatarLayer";

import "./Playa.scss";
import { peopleAttending } from "utils/venue";
import ChatDrawer from "components/organisms/ChatDrawer";
import SparkleFairiesPopUp from "components/molecules/SparkleFairiesPopUp/SparkleFairiesPopUp";
import { DonatePopUp } from "components/molecules/DonatePopUp/DonatePopUp";

const ZOOM_INCREMENT = 1.2;
const DOUBLE_CLICK_ZOOM_INCREMENT = 1.5;
const WHEEL_ZOOM_INCREMENT_DELTA = 0.05;
const TRACKPAD_ZOOM_INCREMENT_DELTA = 0.02;
const ZOOM_MAX = 3;
const GATE_X = 1416;
const GATE_Y = 3689;
const VENUE_NEARBY_DISTANCE = 80;
const EDGE_MESSAGES = [
  "Some call it the digital trash fence.",
  "Daft Punk plays in an hour!",
  "Perfect spot to watch the digital sunrise!",
  "You may get lonely out here, but you’re never really alone.",
  "The edge of the SparkleVerse, for now...",
  "If you leave there’s no refund on your free ticket! #decommodification",
  "Ask yourself: aren’t we all just MOOP; caught up in the great big trash fence called life?",
  "Tried to write Haiku; you are a brave explorer; SparkleVerse loves you",
  "Why not put up an art piece out here!",
  "Hope you’re enjoying your adventure ❤️",
];

const isPlaced = (venue: Venue) => {
  return venue && venue.placement && venue.placement.x && venue.placement.y;
};

const minZoom = () => window.innerWidth / PLAYA_WIDTH_AND_HEIGHT;

const Playa = () => {
  useFirestoreConnect("venues");
  const [showModal, setShowModal] = useState(false);
  const [selectedVenue, setSelectedVenue] = useState<WithId<Venue>>();
  const [zoom, setZoom] = useState(minZoom());
  const [centerX, setCenterX] = useState(GATE_X);
  const [centerY, setCenterY] = useState(GATE_Y);
  const [myX, setMyX] = useState<number>();
  const [myY, setMyY] = useState<number>();
  const [centeredOnMe, setCenteredOnMe] = useState<boolean>();
  const [atEdge, setAtEdge] = useState<boolean>();
  const [atEdgeMessage, setAtEdgeMessage] = useState<string>();
  const mapRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = React.useState({
    height: window.innerHeight,
    width: window.innerWidth,
  });
  const [walkMode, setWalkMode] = useState(true);

  const toggleWalkMode = useCallback(() => {
    setWalkMode(!walkMode);
  }, [walkMode]);

  const { user } = useUser();

  useLocationUpdateEffect(user, "Playa");

  useEffect(() => {
    const updateDimensions = () => {
      setDimensions({
        height: window.innerHeight,
        width: window.innerWidth,
      });
    };
    window.addEventListener("resize", updateDimensions);
    return () => {
      window.removeEventListener("resize", updateDimensions);
    };
  });

  useLayoutEffect(() => {
    let dragging = false;
    let movedSoFarX = 0;
    let movedSoFarY = 0;
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
      // since this function is asynchronous due to throttling, it's possible that dragging is false in moveListener but this is still called
      if (!dragging) return;

      let diffX: number;
      let diffY: number;

      if (event instanceof TouchEvent) {
        diffX = event.touches[0].clientX - dragStartX;
        diffY = event.touches[0].clientY - dragStartY;
      } else {
        diffX = event.clientX - dragStartX;
        diffY = event.clientY - dragStartY;
      }

      setCenterX((tx) =>
        Math.max(
          0,
          Math.min(PLAYA_WIDTH_AND_HEIGHT, tx - (diffX - movedSoFarX))
        )
      );
      setCenterY((ty) =>
        Math.max(
          0,
          Math.min(PLAYA_WIDTH_AND_HEIGHT, ty - (diffY - movedSoFarY))
        )
      );

      movedSoFarX = diffX;
      movedSoFarY = diffY;
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
      }

      // reset drag state
      dragStartX = 0;
      dragStartY = 0;
      movedSoFarX = 0;
      movedSoFarY = 0;
      dragging = false;
    };

    const doubleClickListener = (event: MouseEvent | TouchEvent) => {
      event.preventDefault();
      setZoom((z) => z * DOUBLE_CLICK_ZOOM_INCREMENT);
    };

    const zoomAction = throttle((event: WheelEvent) => {
      const trackpad = event.ctrlKey;
      const delta = Math.sign(event.deltaY) * (trackpad ? -1 : 1);
      setZoom((z) =>
        Math.min(
          Math.max(
            minZoom(),
            z +
              delta *
                (trackpad
                  ? TRACKPAD_ZOOM_INCREMENT_DELTA
                  : WHEEL_ZOOM_INCREMENT_DELTA)
          ),
          ZOOM_MAX
        )
      );
    }, 1);

    const zoomListener = (event: WheelEvent) => {
      event.preventDefault();
      event.stopPropagation();
      zoomAction(event);
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
      mapRef.current.addEventListener("dblclick", doubleClickListener);
      mapRef.current.addEventListener("wheel", zoomListener);
    }
    const mapRefCurrent = mapRef.current;

    return () => {
      if (mapRefCurrent) {
        mapRefCurrent.removeEventListener("mousedown", dragStartListener);
        mapRefCurrent.removeEventListener("touchstart", dragStartListener);
        window.removeEventListener("mousemove", moveListener);
        window.removeEventListener("touchmove", moveListener);
        window.removeEventListener("mouseup", dragEndListener);
        window.removeEventListener("touchend", dragEndListener);
        mapRefCurrent.removeEventListener("dblclick", doubleClickListener);
        mapRefCurrent.removeEventListener("wheel", zoomListener);
      }
    };
  }, []);

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

  const distanceToVenue = (
    x: number,
    y: number,
    venuePlacement: VenuePlacement | undefined
  ) => {
    if (!venuePlacement) {
      return;
    }
    return Math.sqrt(
      Math.pow(venuePlacement.x - x, 2) + Math.pow(venuePlacement.y - y, 2)
    );
  };

  const { camp } = useParams();
  useEffect(() => {
    if (camp) {
      const campVenue = venues?.find((venue) => venue.id === camp);
      if (campVenue && !PLAYA_TEMPLATES.includes(campVenue.template)) {
        if (camp.placement) {
          setCenterX(camp.placement.x);
          setCenterY(camp.placement.y);
        }
        showVenue(campVenue);
      }
    }
  }, [camp, venues, showVenue]);

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

  useEffect(() => {
    setCenteredOnMe(myX === centerX && myY === centerY);
    setAtEdge((atEdge) => {
      const newAtEdge =
        myX !== undefined &&
        myY !== undefined &&
        (myX <= 0 ||
          myX >= PLAYA_WIDTH_AND_HEIGHT - 1 ||
          myY <= 0 ||
          myY >= PLAYA_WIDTH_AND_HEIGHT);
      if (!atEdge && newAtEdge) {
        setAtEdgeMessage(
          EDGE_MESSAGES[Math.floor(Math.random() * EDGE_MESSAGES.length)]
        );
      }
      return newAtEdge;
    });
  }, [centerX, centerY, myX, myY]);

  const recenter = useCallback(() => {
    if (myX === undefined || myY === undefined) return;
    setCenterX(myX);
    setCenterY(myY);
  }, [myX, myY]);

  const getNearbyVenue = useMemo(
    () => (x: number, y: number) => {
      if (!venues) return;
      let closestVenue: WithId<Venue> | undefined;
      let distanceToClosestVenue: number;
      venues.forEach((venue) => {
        const distance = distanceToVenue(x, y, venue.placement);
        if (
          distance &&
          distance <= VENUE_NEARBY_DISTANCE &&
          (!distanceToClosestVenue || distance < distanceToClosestVenue)
        ) {
          closestVenue = venue;
          distanceToClosestVenue = distance;
        }
      });
      return closestVenue;
    },
    [venues]
  );

  const setMyLocation = useMemo(
    () => (x: number, y: number) => {
      setCenterX(x);
      setCenterY(y);
      setMyX(x);
      setMyY(y);
      const nearbyVenue = getNearbyVenue(x, y);
      if (nearbyVenue) {
        showVenue(nearbyVenue);
      } else {
        hideVenue();
      }
    },
    [getNearbyVenue, showVenue, hideVenue]
  );

  return useMemo(() => {
    const translateX = Math.min(
      0,
      -1 *
        Math.min(
          (centerX * zoom - dimensions.width / 2) / zoom,
          PLAYA_WIDTH_AND_HEIGHT - dimensions.width
        )
    );
    const translateY = Math.min(
      0,
      -1 *
        Math.min(
          (centerY * zoom - dimensions.height / 2) / zoom,
          PLAYA_WIDTH_AND_HEIGHT - dimensions.height
        )
    );

    return (
      <>
        <div className="playa-banner">
          {atEdge ? (
            <>
              <strong>You're at the edge of the map.</strong> {atEdgeMessage}
            </>
          ) : (
            <>
              PLAYA UNDER CONSTRUCTION. It’s build week: locations subject to
              alteration by placement team as we build the playa together. Have
              fun!
            </>
          )}
        </div>
        <div className="playa-container">
          <div
            className="map-container"
            ref={mapRef}
            style={{
              transform: `scale(${zoom}) translate3d(${translateX}px, ${translateY}px, 0)`,
            }}
          >
            <img
              className="playa-background"
              src={PLAYA_IMAGE}
              alt="Playa Background Map"
            />
            {venues?.filter(isPlaced).map((venue, idx) => (
              <div
                className="venue"
                style={{
                  top: venue.placement?.y || 0,
                  left: venue.placement?.x || 0,
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
                <span className="img-vcenter-helper" />
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
            <AvatarLayer
              zoom={zoom}
              walkMode={walkMode}
              setMyLocation={setMyLocation}
            />
          </div>
          <div className="playa-controls">
            <div
              className={`playa-controls-recenter ${
                centeredOnMe === false ? "show" : ""
              }`}
              onClick={recenter}
            >
              <div className="playa-controls-recenter-btn" />
            </div>
            <div className={"playa-controls-walkmode"} onClick={toggleWalkMode}>
              <div
                className={`playa-controls-walkmode-btn ${
                  walkMode ? "walk" : ""
                }`}
              />
            </div>
            <div className="playa-controls-zoom">
              <div
                className="playa-controls-zoom-in"
                onClick={() => setZoom((zoom) => zoom * ZOOM_INCREMENT)}
              ></div>
              <div
                className="playa-controls-zoom-out"
                onClick={() =>
                  setZoom((zoom) => Math.max(zoom / ZOOM_INCREMENT, minZoom()))
                }
              ></div>
            </div>
            <div className="playa-controls-shout">
              <div className="playa-controls-shout-btn"></div>
            </div>
          </div>
          <div className="chat-pop-up">
            <ChatDrawer
              roomName={"PLAYA"}
              title={"Playa Chat"}
              chatInputPlaceholder="Chat"
            />
          </div>
          <div className="donate-pop-up">
            <DonatePopUp />
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
  }, [
    hideVenue,
    hoveredVenue,
    selectedVenue,
    showModal,
    showVenue,
    showVenueTooltip,
    user,
    users,
    venues,
    walkMode,
    toggleWalkMode,
    centerX,
    centerY,
    centeredOnMe,
    recenter,
    setMyLocation,
    atEdge,
    atEdgeMessage,
    dimensions,
    zoom,
  ]);
};

export default Playa;
