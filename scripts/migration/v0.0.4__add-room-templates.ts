import { MigrateOptions } from "fireway";
import { isEqual } from "lodash";

import { Room } from "../../src/types/rooms";

const isVenueRegex = /\/in\/(\w+)$/;

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

            // console.log("room venue id", venueId);
            const venueDoc = await firestore
              .collection("venues")
              .doc(venueId)
              .get();

            if (venueDoc.exists) {
              // console.log(
              //   "found venue",
              //   venueId,
              //   venueDoc.data().template,
              //   venueDoc.data()
              // );
              room.template = venueDoc.data().template;
            } else {
              room.template = "external";
            }
          } else {
            room.template = "external";
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
        console.log("-------------------------------");
        console.log("venudId: ", venueDoc.id);
        console.log("now", wasRooms);
        console.log("will be", nowRooms);
      }

      // const destVenueSectionRef = venueDoc.ref.collection("sections").doc();
      // destVenueSectionRef.set({ isVip: false });

      // await venueDoc.ref.update({ template: "auditorium" });
    })
  );

  // console.log(
  //   "Successfully transormed the following venues to auditorium:",
  //   venueDocs.map((doc) => doc.id)
  // );
};
