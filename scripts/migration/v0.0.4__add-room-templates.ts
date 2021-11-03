import { MigrateOptions } from "fireway";
import { isEqual } from "lodash";

import { getVenueId } from "../../functions/src/utils/venue";
import { Room } from "../../src/types/rooms";

const isVenueRegex = /\/in\/(\w+)$/;

const createVenueFromPortal = async (
  firestore: FirebaseFirestore.Firestore,
  portal: Room
) => {
  const venueData = {
    name: portal.title,
    template: "zoomroom",
    zoomUrl: portal.url ?? "",
  };

  let venueExists = true;
  let index = -1;
  const baseVenueId = getVenueId(portal.title);
  let venueId = baseVenueId;
  while (venueExists) {
    index += 1;
    venueId =
      (baseVenueId || "externalexperience") + (index === 0 ? "" : index);
    const venue = await firestore.collection("venues").doc(venueId).get();
    venueExists = venue.exists;
  }

  await firestore.collection("venues").doc(venueId).set(venueData);

  return `/in/${venueId}`;
};

export const migrate = async ({ firestore }: MigrateOptions) => {
  const { docs: venueDocs } = await firestore
    .collection("venues")
    .where("template", "==", "partymap")
    .get();

  await Promise.all(
    venueDocs.map(async (venueDoc) => {
      const rooms: Room[] = venueDoc.data().rooms ?? [];
      await Promise.all(
        rooms?.map(async (room) => {
          if (room.template === "audience") {
            room.template = "auditorium";
          }

          if (room.template) return;

          if (isVenueRegex.test(room.url)) {
            const [, venueId] = room.url.match(isVenueRegex);

            const venueDoc = await firestore
              .collection("venues")
              .doc(venueId)
              .get();

            if (venueDoc.exists) {
              room.template = venueDoc.data().template;
            } else {
              const externalExperienceUrl = await createVenueFromPortal(
                firestore,
                room
              );
              room.template = "zoomroom";
              room.url = externalExperienceUrl;
            }
          } else {
            const externalExperienceUrl = await createVenueFromPortal(
              firestore,
              room
            );

            room.template = "zoomroom";
            room.url = externalExperienceUrl;
          }
        })
      );

      const wasRooms = venueDoc.data().rooms?.map((room) => ({
        title: room.title,
        url: room.url,
        template: room.template,
      }));

      const nowRooms = rooms?.map((room) => ({
        title: room.title,
        url: room.url,
        template: room.template,
      }));

      if (!isEqual(wasRooms, nowRooms)) {
        // console.log("-------------------------------");
        // console.log("venudId: ", venueDoc.id);
        // console.log("now", wasRooms);
        // console.log("will be", nowRooms);
        await firestore.collection("venues").doc(venueDoc.id).update({ rooms });
      }
    })
  );
};
