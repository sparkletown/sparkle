import React from "react";
import { useSelector } from "react-redux";
import { useFirestoreConnect } from "react-redux-firebase";

import { formatUtcSeconds } from "./utils";
import { isAnnouncementValid } from "./validation";

export default function Announcements(props) {
  useFirestoreConnect("announcements");
  let { announcements } = useSelector((state) => ({
    announcements: state.firestore.ordered.announcements,
  }));

  if (announcements === undefined) {
    return "Loading announcements...";
  }

  announcements = announcements
    .filter(isAnnouncementValid)
    .concat()
    .sort((a, b) => b.ts_utc - a.ts_utc);

  return (
    <div className="card" id="announcements">
      <div className="card-header">Announcements</div>
      {announcements.length === 0 && (
        <div className="card-body text-center announcement-list">
          No announcements yet
        </div>
      )}
      <ul className="list-group announcement-list">
        {announcements.map((announcement) => (
          <li className="list-group-item" key={announcement.id}>
            <b>{announcement.announcer}</b>:{" "}
            {formatUtcSeconds(announcement.ts_utc)}
            <br />
            {announcement.text}
            {announcement.imageUrl && (
              <a
                href={announcement.imageUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  className="img-fluid"
                  src={announcement.imageUrl}
                  title={"Announcement Image: " + announcement.imageUrl}
                  alt={"Announcement Image: " + announcement.imageUrl}
                />
              </a>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
