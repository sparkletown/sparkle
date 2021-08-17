import React, { useCallback, useMemo, useState } from "react";

import { AnyVenue, VenueEvent } from "types/venues";

import { WithId } from "utils/id";
import { venueEventsNGSelector } from "utils/selectors";

import { useConnectVenueEvents } from "hooks/useConnectVenueEvents";
import { useSelector } from "hooks/useSelector";
import { useShowHide } from "hooks/useShowHide";

import { TimingDeleteModal } from "components/organisms/TimingDeleteModal";
import { TimingEvent } from "components/organisms/TimingEvent";
import { TimingEventModal } from "components/organisms/TimingEventModal";

import { ButtonNG } from "components/atoms/ButtonNG/ButtonNG";

import { CsvImportModal } from "./CsvImportModal";

import "./EventsView.scss";

export type EventsViewProps = {
  venueId: string;
  venue: WithId<AnyVenue>;
};

export const EventsView: React.FC<EventsViewProps> = ({ venueId, venue }) => {
  useConnectVenueEvents(venueId);

  const events = useSelector(venueEventsNGSelector);

  const {
    isShown: isShownCreateEventModal,
    show: showCreateEventModal,
    hide: hideCreateEventModal,
  } = useShowHide();

  const {
    isShown: isShownDeleteEventModal,
    show: showDeleteEventModal,
    hide: hideDeleteEventModal,
  } = useShowHide();

  const {
    isShown: isShownCsvImportModal,
    show: showCsvImportModal,
    hide: hideCsvImportModal,
  } = useShowHide();

  const [editedEvent, setEditedEvent] = useState<WithId<VenueEvent>>();

  const adminEventModalOnHide = useCallback(() => {
    hideCreateEventModal();
    setEditedEvent(undefined);
  }, [hideCreateEventModal]);

  const hasVenueEvents = events?.length !== 0;

  const renderedEvents = useMemo(
    () =>
      events?.map((event) => {
        return (
          <TimingEvent
            event={event}
            setShowCreateEventModal={showCreateEventModal}
            setEditedEvent={setEditedEvent}
            key={event.id}
          />
        );
      }),
    [events, showCreateEventModal, setEditedEvent]
  );

  return (
    <div className="EventsView">
      <div className="EventsView__box">
        <h4 className="EventsView__title">Events Schedule</h4>
        <div className="EventsView__content">
          {renderedEvents}
          {!hasVenueEvents && (
            <div className="EventsView__no-events">
              <p>No events yet, lets start planning!</p>
            </div>
          )}
        </div>
      </div>
      <div className="EventsView__footer">
        <CsvImportModal
          show={isShownCsvImportModal}
          onHide={hideCsvImportModal}
        />
        <ButtonNG onClick={showCsvImportModal}>Import from CSV</ButtonNG>
        <ButtonNG variant="primary" onClick={showCreateEventModal}>
          Create an Event
        </ButtonNG>
      </div>
      {isShownCreateEventModal && (
        <TimingEventModal
          show={isShownCreateEventModal}
          onHide={() => {
            hideCreateEventModal();
            adminEventModalOnHide();
          }}
          template={venue.template}
          venueId={venueId}
          venue={venue}
          event={editedEvent}
          setEditedEvent={setEditedEvent}
          setShowDeleteEventModal={showDeleteEventModal}
        />
      )}

      {isShownDeleteEventModal && (
        <TimingDeleteModal
          show={isShownDeleteEventModal}
          onHide={() => {
            hideDeleteEventModal();
            setEditedEvent && setEditedEvent(undefined);
          }}
          venueId={venue.id}
          event={editedEvent}
        />
      )}
    </div>
  );
};
