import React, { useCallback } from "react";
import { useHistory } from "react-router-dom";
import "firebase/storage";
import "./Account.scss";
import { PLAYA_IMAGE, PLAYA_VENUE_NAME, PLAYA_VENUE_ID } from "settings";
import { venueInsideUrl } from "utils/url";
import { useUser } from "hooks/useUser";
import { useQuery } from "hooks/useQuery";
import { Modal } from "react-bootstrap";
import { SchedulePageModal } from "components/organisms/SchedulePageModal/SchedulePageModal";

export interface ProfileFormData {
  partyName: string;
  pictureUrl: string;
}

const SplashPage = () => {
  const history = useHistory();
  const { user } = useUser();
  const queryParams = useQuery();
  const showSchedule = !!queryParams.get("schedule");

  const onSubmit = () => {
    history.push(user ? venueInsideUrl(PLAYA_VENUE_ID) : "/enter/step1");
  };

  const onHideSchedule = useCallback(() => {
    history.replace(history.location.pathname);
  }, [history]);

  const onShowSchedulePress = useCallback(() => {
    history.replace({ search: "schedule=true" });
  }, [history]);

  return (
    <>
      <div className="splash-page-container">
        <img
          className="playa-img"
          src={PLAYA_IMAGE}
          alt={`${PLAYA_VENUE_NAME} Background Map`}
        />
        <div className="welcome-to-the-burn">WELCOME TO THE ONLINE BURN</div>
        <div className="step-container step0-container">
          Join us to build Virtual Burning Seed. Sparkleverse is a giant
          interactive map that puts your creativity on the virtual{" "}
          {PLAYA_VENUE_NAME} in minutes. We share our knowledge of hosting
          online experiences in SparkleVersity.
          <button
            className="btn btn-primary btn-block btn-centered enter-button"
            onClick={() => onSubmit()}
          >
            Enter the burn
          </button>
          <button
            className="btn btn-secondary btn-block btn-centered enter-button"
            onClick={onShowSchedulePress}
          >
            Show event schedule
          </button>
        </div>
      </div>
      <Modal
        show={showSchedule}
        onHide={onHideSchedule}
        dialogClassName="custom-dialog"
      >
        <Modal.Body>
          <SchedulePageModal venueId={PLAYA_VENUE_ID} />
        </Modal.Body>
      </Modal>
    </>
  );
};

export default SplashPage;
