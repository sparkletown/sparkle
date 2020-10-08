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
import { Venue, VenuePlacement, VenuePlacementState } from "types/Venue";
import { useSelector } from "hooks/useSelector";
import {
  DEFAULT_MAP_ICON_URL,
  PLAYA_TEMPLATES,
  PLAYA_WIDTH_AND_HEIGHT,
  PLAYA_VENUE_SIZE,
  PLAYA_VENUE_NAME,
  REFETCH_SCHEDULE_MS,
  DEFAULT_PARTY_NAME,
} from "settings";
import VenuePreview from "./VenuePreview";
import { WithId } from "utils/id";
import { updateLocationData } from "utils/useLocationUpdateEffect";
import { useUser } from "hooks/useUser";
import { useParams } from "react-router-dom";
import { throttle } from "lodash";
import AvatarLayer from "./AvatarLayer";

import "./Playa.scss";
import { peopleAttending, peopleByLastSeenIn } from "utils/venue";
import ChatDrawer from "components/organisms/ChatDrawer";
import SparkleFairiesPopUp from "components/molecules/SparkleFairiesPopUp/SparkleFairiesPopUp";
import { DonatePopUp } from "components/molecules/DonatePopUp/DonatePopUp";
import { DustStorm } from "components/organisms/DustStorm/DustStorm";
import firebase from "firebase/app";
import { User } from "types/User";
import UserProfileModal from "components/organisms/UserProfileModal";
import VideoChatLayer from "./VideoChatLayer";
import { SchedulePageModal } from "components/organisms/SchedulePageModal/SchedulePageModal";
import { UserVideoState } from "types/RelayMessage";
import { unstable_batchedUpdates } from "react-dom";
import { useSynchronizedRef } from "hooks/useSynchronizedRef";
import CreateEditPopUp from "components/molecules/CreateEditPopUp/CreateEditPopUp";
import { getLinkFromText } from "utils/getLinkFromText";
import ifvisible from "ifvisible.js";
import { OnlineStatsData } from "types/OnlineStatsData";
import { PlayaBackground } from "./PlayaBackground";
import { PlayaIconComponent } from "./PlayaIcon";
import { IS_BURN } from "secrets";

export type MenuConfig = {
  prompt?: string;
  choices?: MenuChoice[];
  onHide?: () => void;
};

type MenuChoice = {
  text: JSX.Element | string;
  onClick: () => void;
};

export type Shout = {
  created_at: number;
  created_by: string;
  text: string;
};

const ZOOM_INCREMENT = 1.2;
const DOUBLE_CLICK_ZOOM_INCREMENT = 1.5;
const WHEEL_ZOOM_INCREMENT_DELTA = 0.05;
const TRACKPAD_ZOOM_INCREMENT_DELTA = 0.02;
const ZOOM_MAX = 3;
const GATE_X = 1416;
const GATE_Y = 3689;
const VENUE_NEARBY_DISTANCE = 250;
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
// Let the playa scroll out from under the left donate button, left ranger button, and right chat bar
const PLAYA_MARGIN_X = 75;
// Let the playa scroll out from under the top banners
const PLAYA_MARGIN_TOP = 60;
// Let the playa scroll at the bottom, accounting for navbar padding and zooming the avatar
const PLAYA_MARGIN_BOTTOM = 180;
const VIDEO_CHAT_MIN_HEIGHT = 180;

const isPlaced = (venue: Venue) => {
  return (
    venue &&
    venue.placement &&
    venue.placement.x &&
    venue.placement.y &&
    (venue.placement.state === VenuePlacementState.AdminPlaced ||
      venue.placement.state === VenuePlacementState.SelfPlaced)
  );
};

const minZoom = () =>
  (window.innerWidth - 2 * PLAYA_MARGIN_X) / PLAYA_WIDTH_AND_HEIGHT;

const Playa = () => {
  useFirestoreConnect("venues");
  const [showModal, setShowModal] = useState(false);
  const [selectedUserProfile, setSelectedUserProfile] = useState<
    WithId<User>
  >();
  const [showEventSchedule, setShowEventSchedule] = useState(false);
  const [selectedVenue, setSelectedVenue] = useState<WithId<Venue>>();
  const [zoom, setZoom] = useState(minZoom());
  const [centerX, setCenterX] = useState(GATE_X);
  const [centerY, setCenterY] = useState(GATE_Y);
  const [myX, setMyX] = useState<number>();
  const [myY, setMyY] = useState<number>();
  const [centeredOnMe, setCenteredOnMe] = useState<boolean>();
  const [meIsLocated, setMeIsLocated] = useState(false);
  const [atEdge, setAtEdge] = useState<boolean>();
  const [atEdgeMessage, setAtEdgeMessage] = useState<string>();
  const playaRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = React.useState({
    height: window.innerHeight,
    width: window.innerWidth,
  });
  const [videoChatHeight, setVideoChatHeight] = useState(
    Math.max(VIDEO_CHAT_MIN_HEIGHT, window.innerHeight / 4)
  );
  const [autoAdjustVideoChatHeight, setAutoAdjustVideoChatHeight] = useState(
    true
  );
  const sliderRef = useRef<HTMLDivElement>(null);
  const [bikeMode, setBikeMode] = useState<boolean | undefined>(true);
  const [videoState, setVideoState] = useState<string>();
  const [away, setAway] = useState(false);
  const [heartbeat, setHeartbeat] = useState<number>();

  const toggleBikeMode = useCallback(() => {
    setBikeMode(!bikeMode);
  }, [bikeMode]);
  const toggleVideoState = useCallback(() => {
    setVideoState((prev) =>
      prev === UserVideoState.Open ? UserVideoState.Locked : UserVideoState.Open
    );
  }, []);

  const [movingUp, setMovingUp] = useState(false);
  const [movingDown, setMovingDown] = useState(false);
  const [movingLeft, setMovingLeft] = useState(false);
  const [movingRight, setMovingRight] = useState(false);

  const myXRef = useSynchronizedRef(myX);
  const myYRef = useSynchronizedRef(myY);

  const { user, profile } = useUser();

  useEffect(() => {
    const idle = () => {
      setAway(true);
    };
    const heartbeat = () => {
      setAway(false);
      setHeartbeat(new Date().getTime());
    };
    ifvisible.on("idle", idle);
    ifvisible.on("focus", heartbeat);
    ifvisible.on("wakeup", heartbeat);
    const loop = ifvisible.onEvery(2, heartbeat);
    return () => {
      ifvisible.off("idle", idle);
      ifvisible.off("focus", heartbeat);
      ifvisible.off("wakeup", heartbeat);
      if (loop && loop.stop) {
        loop.stop();
      }
    };
  });

  useEffect(() => {
    const updateDimensions = () => {
      setDimensions({
        height: playaRef?.current
          ? playaRef.current.clientHeight
          : window.innerHeight,
        width: playaRef?.current
          ? playaRef.current.clientWidth
          : window.innerWidth,
      });
      setZoom((zoom) => Math.max(minZoom(), zoom));
      if (autoAdjustVideoChatHeight) {
        setVideoChatHeight(
          Math.max(VIDEO_CHAT_MIN_HEIGHT, window.innerHeight / 4)
        );
      }
    };
    window.addEventListener("resize", updateDimensions);
    return () => {
      window.removeEventListener("resize", updateDimensions);
    };
  });

  const loadedInitialState = useRef(false);
  useEffect(() => {
    if (!loadedInitialState.current) {
      try {
        const storedState = localStorage.getItem(PLAYA_VENUE_NAME);
        if (storedState) {
          const state = JSON.parse(storedState);
          setZoom(Math.max(minZoom(), Math.min(state.zoom, ZOOM_MAX)));
          setCenterX(state.x);
          setCenterY(state.y);
          loadedInitialState.current = true;
        }
      } catch {}
    }
    localStorage.setItem(
      PLAYA_VENUE_NAME,
      JSON.stringify({ zoom, x: centerX, y: centerY })
    );
  }, [zoom, centerX, centerY, setZoom]);

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

  const { venue, venues } = useSelector((state) => ({
    venue: state.firestore.data.currentVenue,
    venues: state.firestore.ordered.venues,
  }));

  const showVenue = useCallback(
    (venue: WithId<Venue>) => {
      setSelectedVenue(venue);
      setShowModal(true);
    },
    [setShowModal, setSelectedVenue]
  );

  const hideVenue = useCallback(() => {
    setShowModal(false);
    user && updateLocationData(user, PLAYA_VENUE_NAME);
  }, [setShowModal, user]);

  const distanceToVenue = (
    x: number,
    y: number,
    venuePlacement: VenuePlacement | undefined
  ) => {
    if (
      !venuePlacement ||
      venuePlacement.state === VenuePlacementState.Hidden
    ) {
      return;
    }
    return Math.hypot(venuePlacement.x - x, venuePlacement.y - y);
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

  const [openVenues, setOpenVenues] = useState<OnlineStatsData["openVenues"]>();
  useEffect(() => {
    const getOnlineStats = firebase
      .functions()
      .httpsCallable("stats-getLiveAndFutureEvents");
    const updateStats = () => {
      getOnlineStats()
        .then((result) => {
          const { openVenues } = result.data as OnlineStatsData;
          setOpenVenues(
            profile?.kidsMode
              ? openVenues.filter((v) => !v.venue.adultContent)
              : openVenues
          );
          //setOpenVenues(openVenues);
        })
        .catch(() => {}); // REVISIT: consider a bug report tool
    };
    updateStats();
    const id = setInterval(() => {
      updateStats();
    }, REFETCH_SCHEDULE_MS);
    return () => clearInterval(id);
  }, [profile]);

  const [showVenueTooltip, setShowVenueTooltip] = useState(false);
  const [hoveredVenue, setHoveredVenue] = useState<Venue>();
  const venueRef = useRef<HTMLDivElement | null>(null);
  const [showUserTooltip, setShowUserTooltip] = useState(false);
  const [hoveredUser, setHoveredUser] = useState<User | null>();
  const userRef = useRef<HTMLDivElement | null>(null);
  const [showMenu, setShowMenu] = useState(false);
  const [menu, setMenu] = useState<MenuConfig>();
  const menuRef = useRef<HTMLDivElement | null>(null);
  const [, setRerender] = useState(0);
  const [shoutText, setShoutText] = useState("");

  const shout = useCallback(() => {
    if (!user || !shoutText || !shoutText.length) return;
    const shout: Shout = {
      created_at: new Date().getTime(),
      created_by: user.uid,
      text: shoutText,
    };
    firebase.firestore().collection(`experiences/playa/shouts`).add(shout);
    setShoutText("");
  }, [user, shoutText]);

  // Forces a rerender after `hoveredVenue` and `venueRef` changed
  // Otherwise changing the ref does not trigger a rerender
  // And the Overlay position is always one tick late
  // (next to the previously hovered venue)
  useEffect(() => {
    setRerender((c) => c + 1);
  }, [hoveredVenue]);

  const partygoers = useSelector((state) => state.firestore.ordered.partygoers);
  // Removed for now as attendance counting is inaccurate and is confusing people
  // const users = useMemo(
  //   () => hoveredVenue && peopleAttending(partygoers, hoveredVenue),
  //   [partygoers, hoveredVenue]
  // );

  useEffect(() => {
    setCenteredOnMe(myX === centerX && myY === centerY);
    setAtEdge((atEdge) => {
      const newAtEdge =
        myX !== undefined &&
        myY !== undefined &&
        (myX <= 0 ||
          myX >= PLAYA_WIDTH_AND_HEIGHT - 1 ||
          myY <= 0 ||
          myY >= PLAYA_WIDTH_AND_HEIGHT - 1);
      if (!atEdge && newAtEdge) {
        setAtEdgeMessage(
          EDGE_MESSAGES[Math.floor(Math.random() * EDGE_MESSAGES.length)]
        );
      }
      return newAtEdge;
    });
  }, [centerX, centerY, myX, myY]);

  useEffect(() => {
    if (!sliderRef.current) return;

    let dragStartY = 0;
    let movedSoFarY = 0;
    let dragging = false;
    const sliderDragStart = (event: MouseEvent) => {
      setAutoAdjustVideoChatHeight(false);
      dragStartY = event.clientY;
      movedSoFarY = 0;
      dragging = true;
      event.preventDefault();
    };
    const sliderDrag = throttle((event: MouseEvent) => {
      if (!dragging) return;
      const diffY = dragStartY - event.clientY;
      setVideoChatHeight((prev) => {
        const next = Math.max(
          VIDEO_CHAT_MIN_HEIGHT,
          prev + diffY - movedSoFarY
        );
        return next;
      });
      movedSoFarY = diffY;
    }, 25);
    const sliderDragMove = (event: MouseEvent) => {
      if (dragging) {
        event.preventDefault();
        sliderDrag(event);
      }
    };
    const sliderDragEnd = () => {
      dragging = false;
      window.dispatchEvent(new Event("resize"));
    };
    sliderRef.current.addEventListener("mousedown", sliderDragStart);
    window.addEventListener("mousemove", sliderDragMove);
    window.addEventListener("mouseup", sliderDragEnd);

    const sliderRefCurrent = sliderRef.current;
    return () => {
      sliderRefCurrent.removeEventListener("mousedown", sliderDragStart);
      window.removeEventListener("mousemove", sliderDrag);
      window.removeEventListener("mouseup", sliderDragEnd);
    };
  }, [sliderRef]);

  const recenter = useCallback(() => {
    unstable_batchedUpdates(() => {
      if (myXRef.current === undefined || myYRef.current === undefined) return;
      setCenterX(myXRef.current);
      setCenterY(myYRef.current);
    });
  }, [myXRef, myYRef]);

  const getNearbyVenue = useCallback(
    (x: number, y: number) => {
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
      unstable_batchedUpdates(() => {
        setCenterX(x);
        setCenterY(y);
        setMyX(x);
        setMyY(y);
        setMeIsLocated(true);
        const nearbyVenue = getNearbyVenue(x, y);
        if (nearbyVenue) {
          setHoveredVenue(nearbyVenue);
        }
        setShowVenueTooltip(!!nearbyVenue);
      });
    },
    [getNearbyVenue]
  );

  const isUserVenueOwner = user && venue?.owners?.includes(user.uid);

  const inVideoChat = profile && profile.video?.inRoomOwnedBy !== undefined;
  const dustStorm = venue?.dustStorm;

  const changeDustStorm = useCallback(async () => {
    return await firebase.functions().httpsCallable("venue-toggleDustStorm")();
  }, []);

  // const numberOfUsers = users?.length ?? 0;
  const selectedVenueId = selectedVenue?.id;

  const playaContent = useMemo(() => {
    const now = new Date().getTime();
    const peopleByLastSeen = peopleByLastSeenIn(partygoers);
    return (
      <>
        <PlayaBackground
          nightCycle={venue?.nightCycle}
          backgroundImage={venue?.mapBackgroundImageUrl}
        />
        {venues?.filter(isPlaced).map((venue, idx) => (
          <div
            className={`venue ${
              (peopleAttending(peopleByLastSeen, venue)?.length || 0) > 0 ||
              !!openVenues?.find(
                (ov) =>
                  ov.venue.id === venue.id &&
                  !!ov.currentEvents.find(
                    (ve) =>
                      now / 1000 >= ve.start_utc_seconds &&
                      now / 1000 <
                        60 * ve.duration_minutes + ve.start_utc_seconds
                  )
              )
                ? "live"
                : ""
            }`}
            style={{
              top: venue.placement?.y || 0 - PLAYA_VENUE_SIZE / 2,
              left: venue.placement?.x || 0 - PLAYA_VENUE_SIZE / 2,
              position: "absolute",
            }}
            onClick={() => showVenue(venue)}
            key={idx}
            onMouseOver={(event: React.MouseEvent) => {
              setHoveredVenue(venue);
              venueRef.current = event.target as HTMLDivElement;
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
            {selectedVenueId === venue.id && <div className="selected" />}
          </div>
        ))}
        <PlayaIconComponent
          playaIcon={venue?.playaIcon}
          venues={venues}
          showVenue={showVenue}
        />
        <PlayaIconComponent
          playaIcon={venue?.playaIcon2}
          venues={venues}
          showVenue={showVenue}
        />
        <Overlay
          target={venueRef.current}
          show={showVenueTooltip && !showUserTooltip && !showMenu}
        >
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
                  <div className="playa-venue-title">{hoveredVenue?.name}</div>
                  {/* <div className="playa-venue-people">{numberOfUsers}</div> */}
                </div>
              </div>
            </div>
          )}
        </Overlay>
        <Overlay
          target={userRef.current}
          show={!showVenueTooltip && showUserTooltip && !showMenu}
        >
          {({ placement, arrowProps, show: _show, popper, ...props }) => (
            // @ts-expect-error
            <div {...props} style={{ ...props.style, padding: "10px" }}>
              <div className="playa-venue-text">
                <div className="playa-venue-maininfo">
                  <div className="playa-user-title">
                    {hoveredUser?.anonMode
                      ? DEFAULT_PARTY_NAME
                      : hoveredUser?.partyName}
                  </div>
                </div>
              </div>
            </div>
          )}
        </Overlay>
        <Overlay
          target={menuRef.current}
          show={showMenu}
          rootClose
          onHide={() => {
            if (menu?.onHide) {
              menu.onHide();
            }
            setShowMenu(false);
          }}
        >
          {({ placement, arrowProps, show: _show, popper, ...props }) => (
            // @ts-expect-error
            <div {...props} style={{ ...props.style, padding: "10px" }}>
              <div className="playa-menu">
                <div className="prompt">{menu?.prompt}</div>
                <ul className="choices">
                  {menu?.choices?.map((choice, index) => (
                    <li
                      className="choice"
                      onClick={() => {
                        if (choice.onClick) choice.onClick();
                        document.body.click();
                      }}
                      key={index}
                    >
                      {choice.text}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </Overlay>
      </>
    );
  }, [
    hoveredUser,
    hoveredVenue,
    menu,
    // numberOfUsers, // Removed for now as it is inaccurate
    selectedVenueId,
    showMenu,
    showUserTooltip,
    showVenueTooltip,
    venue,
    venues,
    openVenues,
    showVenue,
    partygoers,
  ]);

  const avatarLayer = useMemo(
    () => (
      <AvatarLayer
        useProfilePicture={venue?.profileAvatars ?? false}
        bikeMode={bikeMode}
        setBikeMode={setBikeMode}
        videoState={videoState}
        setVideoState={setVideoState}
        toggleVideoState={toggleVideoState}
        away={away}
        setAway={setAway}
        heartbeat={heartbeat}
        setHeartbeat={setHeartbeat}
        movingUp={movingUp}
        movingDown={movingDown}
        movingLeft={movingLeft}
        movingRight={movingRight}
        setMyLocation={setMyLocation}
        setSelectedUserProfile={setSelectedUserProfile}
        setShowUserTooltip={setShowUserTooltip}
        setHoveredUser={setHoveredUser}
        setShowMenu={setShowMenu}
        setMenu={setMenu}
        userRef={userRef}
        menuRef={menuRef}
      />
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      bikeMode,
      videoState,
      away,
      heartbeat,
      movingUp,
      movingDown,
      movingLeft,
      movingRight,
      setMyLocation,
      toggleVideoState,
    ]
  );

  const mapContainer = useMemo(() => {
    const translateX = Math.min(
      PLAYA_MARGIN_X / zoom,
      -1 *
        Math.min(
          (centerX * zoom - dimensions.width / 2) / zoom,
          PLAYA_WIDTH_AND_HEIGHT -
            dimensions.width / zoom +
            PLAYA_MARGIN_X / zoom
        )
    );
    const translateY = Math.min(
      PLAYA_MARGIN_TOP / zoom,
      -1 *
        Math.min(
          (centerY * zoom - dimensions.height / 2) / zoom,
          PLAYA_WIDTH_AND_HEIGHT -
            dimensions.height / zoom +
            PLAYA_MARGIN_BOTTOM / zoom
        )
    );

    return (
      <div
        className="map-container"
        ref={mapRef}
        style={{
          transform: `scale(${zoom}) translate3d(${translateX}px, ${translateY}px, 0)`,
        }}
      >
        {playaContent}
        {avatarLayer}
      </div>
    );
  }, [
    avatarLayer,
    centerX,
    centerY,
    dimensions.width,
    dimensions.height,
    playaContent,
    zoom,
  ]);

  return useMemo(() => {
    return (
      <>
        {venue?.bannerMessage && (
          <div className="playa-banner split-words">
            <>
              <strong>
                {venue.name.charAt(0).toUpperCase() + venue.name.slice(1)}{" "}
                Announcement:
              </strong>{" "}
              {getLinkFromText(venue.bannerMessage)}
            </>
          </div>
        )}
        {atEdge && (
          <div className="playa-banner">
            <>
              <strong>You're at the edge of the map.</strong> {atEdgeMessage}
            </>
          </div>
        )}

        {IS_BURN && dustStorm && <DustStorm />}
        <div className="playa-container" ref={playaRef}>
          {mapContainer}
          {meIsLocated && (
            <div className="avatar-controls">
              <div
                className="up"
                onMouseDown={(event) => {
                  setMovingUp(true);
                  event.preventDefault();
                }}
                onTouchStart={(event) => {
                  setMovingUp(true);
                  event.preventDefault();
                }}
                onMouseUp={() => setMovingUp(false)}
                onTouchEnd={() => setMovingUp(false)}
              >
                <div className="btn" />
              </div>
              <div
                className="down"
                onMouseDown={(event) => {
                  setMovingDown(true);
                  event.preventDefault();
                }}
                onTouchStart={(event) => {
                  setMovingDown(true);
                  event.preventDefault();
                }}
                onMouseUp={() => setMovingDown(false)}
                onTouchEnd={() => setMovingDown(false)}
              >
                <div className="btn" />
              </div>
              <div
                className="left"
                onMouseDown={(event) => {
                  setMovingLeft(true);
                  event.preventDefault();
                }}
                onTouchStart={(event) => {
                  setMovingLeft(true);
                  event.preventDefault();
                }}
                onMouseUp={() => setMovingLeft(false)}
                onTouchEnd={() => setMovingLeft(false)}
              >
                <div className="btn" />
              </div>
              <div
                className="right"
                onMouseDown={(event) => {
                  setMovingRight(true);
                  event.preventDefault();
                }}
                onTouchStart={(event) => {
                  setMovingRight(true);
                  event.preventDefault();
                }}
                onMouseUp={() => setMovingRight(false)}
                onTouchEnd={() => setMovingRight(false)}
              >
                <div className="btn" />
              </div>
            </div>
          )}
          <div className="playa-controls">
            {IS_BURN && isUserVenueOwner && (
              <div
                className={`playa-controls-recenter show`}
                onClick={changeDustStorm}
              >
                <div
                  className={`playa-dust-storm-btn${
                    dustStorm ? "-activated" : ""
                  }`}
                />
              </div>
            )}
            <div
              className={`playa-controls-recenter ${
                centeredOnMe === false ? "show" : ""
              }`}
              onClick={recenter}
            >
              <div className="playa-controls-recenter-btn" />
            </div>
            <div className={"playa-controls-bikemode"} onClick={toggleBikeMode}>
              <div
                className={`playa-controls-bikemode-btn ${
                  bikeMode ? "bike" : ""
                }`}
              />
            </div>
            <div className="playa-controls-zoom">
              <div
                className={`playa-controls-zoom-in ${
                  zoom >= ZOOM_MAX ? "disabled" : ""
                }`}
                onClick={() =>
                  setZoom((zoom) => Math.min(zoom * ZOOM_INCREMENT, ZOOM_MAX))
                }
              ></div>
              <div
                className={`playa-controls-zoom-out ${
                  zoom <= minZoom() ? "disabled" : ""
                }`}
                onClick={() =>
                  setZoom((zoom) => Math.max(zoom / ZOOM_INCREMENT, minZoom()))
                }
              ></div>
            </div>
            <div className="playa-controls-shout" onClick={() => shout()}>
              <div className="playa-controls-shout-btn"></div>
            </div>
            <form
              onSubmit={(event) => {
                shout();
                event.preventDefault();
              }}
            >
              <input
                type="text"
                className="playa-controls-shout-text"
                placeholder={`Shout across ${PLAYA_VENUE_NAME}...`}
                value={shoutText}
                onChange={(event) => setShoutText(event.target.value)}
              />
            </form>
          </div>
          <div className="chat-pop-up">
            <ChatDrawer
              roomName={"PLAYA"}
              title={`${PLAYA_VENUE_NAME} Chat`}
              chatInputPlaceholder="Chat"
            />
          </div>
          {IS_BURN && (
            <>
              <div className="donate-pop-up">
                <DonatePopUp />
              </div>
              <div className="create-edit-pop-up">
                <CreateEditPopUp />
              </div>
              <div className="sparkle-fairies">
                <SparkleFairiesPopUp
                  setShowEventSchedule={setShowEventSchedule}
                />
              </div>
            </>
          )}
        </div>
        <div
          className={`playa-slider ${inVideoChat ? "show" : ""}`}
          ref={sliderRef}
        />
        <div
          className={`playa-videochat ${inVideoChat ? "show" : ""}`}
          style={{ height: videoChatHeight }}
        >
          <VideoChatLayer setSelectedUserProfile={setSelectedUserProfile} />
        </div>
        <Modal show={showModal} onHide={hideVenue}>
          {selectedVenue && user && (
            <VenuePreview
              user={user}
              venue={selectedVenue}
              allowHideVenue={isUserVenueOwner === true}
            />
          )}
        </Modal>
        <UserProfileModal
          show={selectedUserProfile !== undefined}
          onHide={() => setSelectedUserProfile(undefined)}
          userProfile={selectedUserProfile}
        />
        <Modal
          show={showEventSchedule}
          onHide={() => setShowEventSchedule(false)}
          dialogClassName="custom-dialog"
        >
          <Modal.Body>
            <SchedulePageModal />
          </Modal.Body>
        </Modal>
      </>
    );
  }, [
    hideVenue,
    selectedVenue,
    showModal,
    user,
    bikeMode,
    toggleBikeMode,
    centeredOnMe,
    meIsLocated,
    recenter,
    shout,
    shoutText,
    atEdge,
    atEdgeMessage,
    zoom,
    isUserVenueOwner,
    dustStorm,
    changeDustStorm,
    selectedUserProfile,
    showEventSchedule,
    inVideoChat,
    videoChatHeight,
    mapContainer,
    venue,
  ]);
};

export default Playa;
