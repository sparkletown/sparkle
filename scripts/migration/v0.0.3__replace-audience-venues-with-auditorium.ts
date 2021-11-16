import { MigrateOptions } from "fireway";

export const migrate = async ({ firestore }: MigrateOptions) => {
  const { docs: venueDocs } = await firestore
    .collection("venues")
    .where("template", "==", "audience")
    .get();

  await Promise.all(
    venueDocs.map(async (venueDoc) => {
      const destVenueSectionRef = venueDoc.ref.collection("sections").doc();
      destVenueSectionRef.set({ isVip: false });

      await venueDoc.ref.update({ template: "auditorium" });
    })
  );

  console.log(
    "Successfully transormed the following venues to auditorium:",
    venueDocs.map((doc) => doc.id)
  );
};
