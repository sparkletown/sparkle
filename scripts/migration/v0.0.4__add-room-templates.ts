import { MigrateOptions } from "fireway";
import { isEqual } from "lodash";

import { getVenueId } from "../../functions/src/utils/venue";
import { Room } from "../../src/types/rooms";
import { AnyVenue } from "../../src/types/venues";

const isVenueRegex = /\/in\/(\w+)$/;

/**
 * Transformation of rooms in partymaps. The script:
 * - changes template of all the 'themecamp' venues to 'partymap' (themecamp is an outdated venue template)
 * - assignes the room template based on the room URL
 * - replaces "audience" room template with "auditorium" (audience is an outdated template)
 */
export const migrate = async ({ firestore }: MigrateOptions) => {
  // Replace "themecamp"s -> "partymap"s
  const { docs: thememaps } = await firestore
    .collection("venues")
    .where("template", "==", "themecamp")
    .get();

  console.log(
    "thememaps: ",
    thememaps.map((doc) => doc.id)
  );

  await Promise.all(
    thememaps.map(
      async (doc) =>
        await doc.ref.update({
          template: "partymap",
        })
    )
  );

  // Fetch all the "partymap"s
  const { docs: venueDocs } = await firestore
    .collection("venues")
    .where("template", "==", "partymap")
    .get();

  // Update the rooms of the partymaps
  await Promise.all(
    venueDocs.map(async (venueDoc) => {
      const rooms: Room[] = venueDoc.data().rooms ?? [];
      await Promise.all(
        rooms?.map((room) =>
          transformRoomAndCreateVenues({
            firestore,
            venueDoc,
            room,
          })
        )
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

const transformRoomAndCreateVenues = async ({ firestore, venueDoc, room }) => {
  if (room.template === "audience") {
    room.template = "auditorium";
  }

  if (room.template === "themecamp") {
    room.template = "partymap";
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
    }
  }

  if (!room.template) {
    const externalExperienceVenueId = await createVenueFromPortal({
      firestore,
      portal: room,
      parentVenueId: venueDoc.id,
      parentVenue: venueDoc.data(),
    });

    room.template = "zoomroom";
    room.url = `/in/${externalExperienceVenueId}`;
  }
};

interface CreateVenueFromPortalProps {
  firestore: FirebaseFirestore.Firestore;
  portal: Room;
  parentVenueId: string;
  parentVenue: AnyVenue;
}

const createVenueFromPortal = async ({
  firestore,
  portal,
  parentVenueId,
  parentVenue,
}: CreateVenueFromPortalProps) => {
  const venueData = {
    name: portal.title,
    template: "zoomroom",
    zoomUrl: portal.url ?? "",
    parentId: parentVenueId,
    worldId: parentVenue.worldId,
    owners: parentVenue.owners,
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

  return venueId;
};
