import React, { ChangeEvent, useEffect, useState } from "react";
import firebase from "firebase";

// Components
import VenueHero from "components/molecules/VenueHero";
import Button from "components/atoms/Button";
import AdminEventModal from "pages/Admin/AdminEventModal";
import RoomModal from "pages/Admin/Room/Modal";
import RoomCard from "pages/Admin/Room/Card";

// Hooks
import { Link, useHistory } from "react-router-dom";

// Typings
import { VenueDetailsProps } from "./VenueDetails.types";

// Styles
import * as S from "./VenueDetails.styles";
import EventModal from "pages/Admin/Event";
import MapPreview from "pages/Admin/MapPreview";
import ToggleSwitch from "components/atoms/ToggleSwitch";
import { updateVenue_v2 } from "api/admin";
import { useUser } from "hooks/useUser";
import { Form } from "react-bootstrap";

type Owner = {
  id: string;
  data: any;
  partyName: string;
  pictureUrl: string;
};

const VenueDetails: React.FC<VenueDetailsProps> = ({ venue }) => {
  const {
    name,
    owners,
    id: venueId,
    rooms,
    mapBackgroundImageUrl,
    showGrid,
  } = venue;
  const {
    subtitle,
    description,
    coverImageUrl,
  } = venue.config.landingPageConfig;
  const { icon } = venue.host;

  const { user } = useUser();
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

  if (!user) return null;

  const toggleRoomModal = () => setModalOpen(!modalOpen);

  const handleShowGridToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const venueData = {
      ...venue,
      showGrid: e.target.checked,
    };

    updateVenue_v2(venueData, user);
  };

  const handleRoomVisibilityChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const venueData = {
      name,
      roomVisibility: e.target.value,
    };

    updateVenue_v2(venueData, user);
  };

  const renderShowGrid = () => (
    <S.InputContainer>
      <S.GridSwitchWrapper>
        <h4>Show grid</h4>

        <ToggleSwitch
          name="showGrid"
          isChecked={showGrid}
          onChange={handleShowGridToggle}
        />
      </S.GridSwitchWrapper>

      {showGrid && (
        <S.GridInputWrapper>
          <label htmlFor="grid_columns">Number of columns:</label>
          <input
            name="columns"
            id="grid_columns"
            placeholder="Number of grid columns"
            type="number"
          />
        </S.GridInputWrapper>
      )}
    </S.InputContainer>
  );

  const renderRoomVisibility = () => (
    <Form style={{ width: "50%", margin: "1rem 0 0" }}>
      <Form.Group controlId="roomVisibilityControlGroup">
        <Form.Label>
          Choose how you&apos;d like your rooms to appear on the map
        </Form.Label>

        <Form.Control as="select" custom onChange={handleRoomVisibilityChange}>
          <option value="hover">Hover</option>
          <option value="count">Count</option>
          <option value="count/name">Count and names</option>
        </Form.Control>
      </Form.Group>
    </Form>
  );

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
          <Button gradient linkTo={`/in/${venue.id}`} isLink>
            Go to your space
          </Button>
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
        {renderShowGrid()}
        <MapPreview
          venueId={venueId}
          venueName={name}
          mapBackground={mapBackgroundImageUrl}
          rooms={rooms}
        />

        {!!mapBackgroundImageUrl && (
          <>
            <S.RoomActions>
              <S.RoomCounter>{rooms ? rooms.length : "0"} Rooms</S.RoomCounter>
              <Button onClick={() => toggleRoomModal()} gradient>
                Add a room
              </Button>
            </S.RoomActions>
            {renderRoomVisibility()}
          </>
        )}

        {!!rooms && !!mapBackgroundImageUrl && (
          <S.RoomWrapper>
            {rooms.map((room: any, index: number) => (
              <RoomCard key={index} {...room} />
            ))}
          </S.RoomWrapper>
        )}
      </S.Main>

      <RoomModal
        isVisible={modalOpen}
        venueId={venueId!}
        onSubmitHandler={() => setModalOpen(false)}
        onClickOutsideHandler={() => setModalOpen(false)}
      />

      <EventModal isVisible={false} />
    </S.Container>
  );
};

export default VenueDetails;
