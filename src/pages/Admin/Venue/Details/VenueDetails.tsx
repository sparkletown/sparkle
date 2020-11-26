import React, { useEffect, useState } from "react";
import firebase from "firebase";

// Components
import VenueHero from "components/molecules/VenueHero";
import Button from "components/atoms/Button";
import AdminEventModal from "pages/Admin/AdminEventModal";
import RoomModal from "pages/Admin/Room/Modal";
import RoomCard from "pages/Admin/Room/Card";

// Pages
import BackgroundSelect from "pages/Admin/BackgroundSelect";

// Hooks
import { useHistory } from "react-router-dom";

// Typings
import { VenueDetailsProps } from "./VenueDetails.types";

// Styles
import * as S from "./VenueDetails.styles";
import EventModal from "pages/Admin/Event";

type Owner = {
  id: string;
  data: any;
  partyName: string;
  pictureUrl: string;
};

const VenueDetails: React.FC<VenueDetailsProps> = ({ venue }) => {
  const { name, owners, id, rooms, mapBackgroundImageUrl } = venue;
  const {
    subtitle,
    description,
    coverImageUrl,
  } = venue.config.landingPageConfig;
  const { icon } = venue.host;
  const [ownersData, setOwnersData] = useState<Owner[]>([]);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const history = useHistory();

  useEffect(() => {
    const newOwners: any = [];

    async function getOwnersData() {
      if (!!owners) {
        for (const owner of owners) {
          const user = await firebase
            .functions()
            .httpsCallable("venue-getOwnerData")({ userId: owner });
          const userData = user.data;

          if (ownersData.filter((i) => i.id !== owner)) {
            newOwners.push({
              id: owner,
              ...userData,
            });
          }
        }

        // setOwnersData(newOwners);
      }
    }

    try {
      getOwnersData();
    } catch (error) {
      console.error(error);
    }
  }, [owners, ownersData]);

  const toggleRoomModal = () => setModalOpen(!modalOpen);

  return (
    <S.Container>
      <S.Header>
        <VenueHero
          bannerImageUrl={coverImageUrl}
          logoImageUrl={icon}
          name={name}
          subtitle={subtitle}
          description={description}
          large
          showEdit
          editClickHandler={() =>
            history.push(`/admin_v2/venue/edit/${venue.id}`)
          }
        />

        <S.HeaderActions>
          <Button gradient>Go to your space</Button>
          <Button>Preview landing page</Button>

          <S.AdminList>
            <S.AdminListTitle>Party admins</S.AdminListTitle>

            {ownersData &&
              ownersData.map((owner: Owner) => (
                <S.AdminItem key={owner.id}>
                  <S.AdminPicture backgroundImage={owner.pictureUrl} />
                  <S.AdminItemTitle>{owner.partyName}</S.AdminItemTitle>
                </S.AdminItem>
              ))}

            <span>Invite admin s</span>
          </S.AdminList>
        </S.HeaderActions>
      </S.Header>

      <S.Main>
        <BackgroundSelect
          venueName={name}
          mapBackground={mapBackgroundImageUrl}
        />

        <S.RoomCounter>{rooms ? rooms.length : "0"} Rooms</S.RoomCounter>
        <Button onClick={() => toggleRoomModal()} gradient>
          Add a room
        </Button>

        {!!rooms && (
          <S.RoomWrapper>
            {rooms.map((room: any, index) => (
              <RoomCard key={index} {...room} />
            ))}
          </S.RoomWrapper>
        )}
      </S.Main>

      <RoomModal
        isVisible={modalOpen}
        venueId={id!}
        onSubmitHandler={() => setModalOpen(false)}
        onClickOutsideHandler={() => setModalOpen(false)}
      />

      <EventModal isVisible />

      {/* <AdminEventModal

      /> */}
    </S.Container>
  );
};

export default VenueDetails;
