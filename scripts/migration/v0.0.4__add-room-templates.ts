import { MigrateOptions } from "fireway";
import { isEqual } from "lodash";

import { getVenueId } from "../../functions/src/utils/venue";
import { Room } from "../../src/types/rooms";

const isVenueRegex = /\/in\/(\w+)$/;

interface CreateVenueFromPortalProps {
  firestore: FirebaseFirestore.Firestore;
  portal: Room;
  parentVenueId: string;
  parentWorldId: string;
}

const createVenueFromPortal = async ({
  firestore,
  portal,
  parentVenueId,
  parentWorldId,
}: CreateVenueFromPortalProps) => {
  const venueData = {
    name: portal.title,
    template: "zoomroom",
    zoomUrl: portal.url ?? "",
    parentId: parentVenueId,
    worldId: parentWorldId,
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
            const [, targetVenueId] = room.url.match(isVenueRegex);

            const targetVenueDoc = await firestore
              .collection("venues")
              .doc(targetVenueId)
              .get();

            if (targetVenueDoc.exists) {
              room.template = targetVenueDoc.data().template;
            } else {
              const externalExperienceUrl = await createVenueFromPortal({
                firestore,
                portal: room,
                parentVenueId: venueDoc.id,
                parentWorldId: venueDoc.data().worldId,
              });
              room.template = "zoomroom";
              room.url = externalExperienceUrl;
            }
          } else {
            const externalExperienceUrl = await createVenueFromPortal({
              firestore,
              portal: room,
              parentVenueId: venueDoc.id,
              parentWorldId: venueDoc.data().worldId,
            });

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
