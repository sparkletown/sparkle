import React from "react";
import { faPen, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { format } from "date-fns";

import { SpaceWithId } from "types/id";
import { WorldEvent } from "types/venues";

import { eventEndTime, eventStartTime } from "utils/event";
import { formatTimeLocalised } from "utils/time";

import { useShowHide } from "hooks/useShowHide";

import { TimingDeleteModal } from "../TimingDeleteModal";
import { TimingEventModal } from "../TimingEventModal";

export type TimingEventProps = {
  event: WorldEvent;
  space?: SpaceWithId;
};

export const TimingEvent: React.FC<TimingEventProps> = ({ event, space }) => {
  const {
    isShown: showDeleteEventModal,
    show: setShowDeleteEventModal,
    hide: setHideDeleteEventModal,
  } = useShowHide();

  const {
    isShown: isShownCreateEventModal,
    show: showCreateEventModal,
    hide: hideCreateEventModal,
  } = useShowHide();

  return (
    <>
      <div key={event.id} className="">
        <div className="bg-white divide-y divide-gray-200">
          <div className="flex justify-start items-start">
            <div className="px-6 py-4 w-96">
              <div className="text-sm font-medium text-gray-900">
                {format(eventStartTime({ event }), "do MMM")}
              </div>
              <div className="text-sm text-gray-500">
                {formatTimeLocalised(eventStartTime({ event }))} -{" "}
                {formatTimeLocalised(eventEndTime({ event }))}
              </div>
            </div>
            <div className="px-6 py-4 grow w-full flex flex-col flex-auto">
              <div className="text-sm text-gray-900">
                <span className="font-medium">{event.name}</span> by{" "}
                <span className="font-medium">{event.host}</span>
              </div>
              {/* <p className="TimingEvent__details-description">{event.description}</p> */}
              <p className="TimingEvent__details-room">
                in{" "}
                <span className="event-details-room-name">{space?.name}</span>
              </p>
            </div>
            <div className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium flex justify-end items-center gap-x-5">
              <button
                className="flex"
                onClick={() => {
                  showCreateEventModal();
                }}
              >
                <FontAwesomeIcon icon={faPen} className="px-1" size="lg" />

                <div>Edit</div>
              </button>
            </div>
            <div className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium flex justify-end items-center gap-x-5">
              <button
                className="flex"
                onClick={() => {
                  setShowDeleteEventModal();
                }}
              >
                <FontAwesomeIcon
                  icon={faTrash}
                  className="px-1 text-warning-red"
                  size="lg"
                />
                <div className="text-warning-red">Delete</div>
              </button>
            </div>
          </div>
        </div>
      </div>
      {showDeleteEventModal && (
        <TimingDeleteModal
          show={showDeleteEventModal}
          onHide={() => {
            setHideDeleteEventModal();
          }}
          event={event}
        />
      )}
      {isShownCreateEventModal && space && (
        <TimingEventModal
          show={isShownCreateEventModal}
          onHide={() => {
            hideCreateEventModal();
          }}
          template={space.template}
          venueId={space.id}
          venue={space}
          event={event}
          worldId={space.worldId}
        />
      )}
    </>
  );
};
