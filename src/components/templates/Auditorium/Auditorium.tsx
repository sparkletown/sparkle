import React, { useState } from "react";
import { Route, Switch, useRouteMatch } from "react-router";

import { AuditoriumSeatedUser } from "types/auditorium";
import { Reaction } from "types/reactions";
import { AuditoriumVenue } from "types/venues";

import { WithId } from "utils/id";

import { useCommonAuditoriumSection } from "hooks/auditorium/useAuditoriumSection";
import { ReactionsContext } from "hooks/reactions";
import { RelatedVenuesContext } from "hooks/useRelatedVenues";

import { AllSectionPreviews } from "./components/AllSectionPreviews";
import { Section } from "./components/Section";

export interface AuditoriumProps {
  venue: WithId<AuditoriumVenue>;
}

export const Auditorium: React.FC<AuditoriumProps> = ({ venue }) => {
  const match = useRouteMatch();

  return (
    <Switch>
      <Route path={`${match.path}/section/:sectionId`}>
        <Section venue={venue} />
      </Route>
      <Route path={`${match.path}`}>
        <AllSectionPreviews venue={venue} />
      </Route>
    </Switch>
  );
};

const generateUsers = (
  rows: number,
  cols: number
): WithId<AuditoriumSeatedUser>[] => {
  const SEAT_FILL_RATE = 0.9;
  const users: WithId<AuditoriumSeatedUser>[] = [];
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      // Gross hard-coded numbers for this specific demo scenario.
      // Avoids users being seated *inside* the video
      if (x > 2 && x < 20) {
        continue;
      }
      if (Math.random() > SEAT_FILL_RATE) {
        // Skip this seat and leave it empty
        continue;
      }

      const seed = Math.random();

      const user = {
        id: `user-${y}-${x}`,
        path: {
          venueId: "some-demo-venue",
          sectionId: "some-section",
        },
        position: {
          row: y,
          column: x,
        },
        partyName: "Badger",
        pictureUrl: `https://avatars.dicebear.com/api/pixel-art/${seed}.svg`,
      };
      users.push(user);
    }
  }
  return users;
};

export const AuditoriumDemo: React.FC = () => {
  // I apologise for the quality of this code. I was hacking this together for
  // a PoC to see if we could easily create a demo mode for different venues.
  // I think the answer is "not really".
  const fakeVenue = {
    iframeUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1",
    autoPlay: true,
    id: "some-demo-venue",
    auditoriumColumns: 23,
    auditoriumRows: 12,
  } as WithId<AuditoriumVenue>;

  const [users] = useState(
    generateUsers(
      fakeVenue.auditoriumRows ?? 0,
      fakeVenue.auditoriumColumns ?? 0
    )
  );

  const relatedVenuesState = {
    parentVenue: null,
    isLoading: false,
    relatedVenues: [],
    descendantVenues: [],
    relatedVenueIds: [],
    findVenueInRelatedVenues: () => undefined,
  };

  const useAuditoriumSectionFake = () => {
    return useCommonAuditoriumSection({
      venue: fakeVenue,
      sectionId: "some-section",
      section: {
        id: "some-section",
      },
      status: "loaded", // TODO Check this value
      seatedUsers: users,
    });
  };

  const [reactions, setReactions] = useState([] as Reaction[]);

  React.useEffect(() => {
    const updateReactions = () => {
      const nowInMs = new Date().getTime();
      // Generate a random reaction if desired
      if (Math.random() < 0.1) {
        const reactingUser = users[Math.floor(Math.random() * users.length)];
        const reaction: Reaction = {
          reaction: "messageToTheBand",
          text: "Lorem Ipsum!!",
          created_at: nowInMs,
          created_by: {
            id: reactingUser.id,
          },
        };
        setReactions((currReactions) => currReactions.concat([reaction]));
      } else {
        const cutOff = nowInMs - 4.5 * 1000;
        if (reactions.length > 0 && reactions[0].created_at < cutOff) {
          setReactions((currReactions) =>
            currReactions.filter((r) => r.created_at > cutOff)
          );
        }
      }
    };

    const intervalId = setInterval(updateReactions, 100);
    return () => {
      clearInterval(intervalId);
    };
  }, [reactions, users]);

  const reactionsArg = {
    reactions,
    reactionsById: {},
  };

  return (
    <ReactionsContext.Provider value={reactionsArg}>
      <RelatedVenuesContext.Provider value={relatedVenuesState}>
        <Section
          venue={fakeVenue}
          useAuditoriumSection={useAuditoriumSectionFake}
        />
      </RelatedVenuesContext.Provider>
    </ReactionsContext.Provider>
  );
};
