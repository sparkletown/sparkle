// import React from "react";
// import { useParams, Redirect } from "react-router-dom";
// import useConnectCurrentVenue from "hooks/useConnectCurrentVenue";
// import { VenueTemplate } from "types/VenueTemplate";
// import PartyMap from "components/templates/PartyMap";
// import { ChatContextWrapper } from "components/context/ChatContext";
// import { useUser } from "hooks/useUser";
// import { useSelector } from "hooks/useSelector";
// import VenuePage from "pages/VenuePage";
// import WithNavigationBar from "components/organisms/WithNavigationBar";

// const TemplateRouter = () => {
//   useConnectCurrentVenue();
//   const { venueId } = useParams();

//   const { user } = useUser();
//   const { venue } = useSelector((state) => ({
//     venue: state.firestore.data.currentVenue,
//   }));

//   if (!venue) {
//     return <>Loading...</>;
//   }

//   if (!user) {
//     return <Redirect to={`/v/${venueId}`} />;
//   }

//   switch (venue.template) {
//     case VenueTemplate.jazzbar:
//     case VenueTemplate.artpiece:
//       return <VenuePage />;
//     case VenueTemplate.partymap:
//       return (
//         <ChatContextWrapper>
//           <PartyMap />
//         </ChatContextWrapper>
//       );
//   }
//   return <>Error loading venue {venueId}</>;
// };

// export default TemplateRouter;
