import React, { useCallback, useMemo, useRef, useState } from "react";
import { OverlayTrigger, Popover } from "react-bootstrap";

import { RadioModal } from "components/organisms/RadioModal/RadioModal";

import "./NavbarRadio.scss";
import { useSelector } from "hooks/useSelector";
import {
  currentVenueSelectorData,
  radioStationsSelector,
} from "utils/selectors";
import { hasElements } from "utils/types";
import { useRadio } from "hooks/useRadio";

export const NavbarRadio = () => {
  const venue = useSelector(currentVenueSelectorData);

  const radioStations = useSelector(radioStationsSelector);
  const [isRadioPlaying, setIsRadioPlaying] = useState(false);
  const hasRadioStations = radioStations && radioStations.length;
  const radioStation = !!hasRadioStations && radioStations![0];
  const isSoundCloud =
    !!hasRadioStations && RegExp("soundcloud").test(radioStations![0]);

  const sound = useMemo(
    () =>
      radioStations && hasElements(radioStations) && !isSoundCloud
        ? new Audio(radioStations[0])
        : undefined,
    [isSoundCloud, radioStations]
  );
  const handleRadioEnable = useCallback(() => setIsRadioPlaying(true), []);

  const [showRadioPopover, setShowRadioPopover] = useState(false);

  const toggleShowRadioPopover = useCallback(
    () => setShowRadioPopover((prevState) => !prevState),
    []
  );
  const { volume, setVolume } = useRadio(isRadioPlaying, sound);
  const showNormalRadio = (venue?.showRadio && !isSoundCloud) ?? false;
  const showSoundCloudRadio = (venue?.showRadio && isSoundCloud) ?? false;

  const radioFirstPlayStateLoaded = useRef(false);
  const showRadioOverlay = useMemo(() => {
    if (!radioFirstPlayStateLoaded.current) {
      const radioFirstPlayStorageKey = "radioFirstPlay";
      const radioFirstPlayState = localStorage.getItem(
        radioFirstPlayStorageKey
      );
      if (!radioFirstPlayState) {
        localStorage.setItem(radioFirstPlayStorageKey, JSON.stringify(true));
        return true;
      }
      radioFirstPlayStateLoaded.current = true;
    }
    return false;
  }, [radioFirstPlayStateLoaded]);

  return (
    <>
      {showNormalRadio && (
        <OverlayTrigger
          trigger="click"
          placement="bottom-end"
          overlay={
            <Popover id="radio-popover">
              <Popover.Content>
                <RadioModal
                  {...{
                    volume,
                    setVolume,
                    title: venue?.radioTitle,
                  }}
                  onEnableHandler={handleRadioEnable}
                  isRadioPlaying={isRadioPlaying}
                />
              </Popover.Content>
            </Popover>
          }
          rootClose={true}
          defaultShow={showRadioOverlay}
        >
          <div
            className={`profile-icon navbar-link-radio ${
              volume === 0 && "off"
            }`}
          />
        </OverlayTrigger>
      )}

      {showSoundCloudRadio && (
        <div className="radio-trigger">
          <div
            className={`profile-icon navbar-link-radio ${
              volume === 0 && "off"
            }`}
            onClick={toggleShowRadioPopover}
          />

          <div
            className="radio-wrapper"
            style={{
              visibility: showRadioPopover ? "visible" : "hidden",
              userSelect: showRadioPopover ? "auto" : "none",
            }}
          >
            <iframe
              title="venueRadio"
              id="sound-cloud-player"
              scrolling="no"
              allow="autoplay"
              src={`https://w.soundcloud.com/player/?url=${radioStation}&amp;start_track=0&amp;single_active=true&amp;show_artwork=false`}
            />
          </div>
        </div>
      )}
    </>
  );
};
