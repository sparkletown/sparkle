import React, { useEffect, useRef, useState } from "react";
import firebase from "firebase";

// Components
import VenueHero from "components/molecules/VenueHero";
import Button from "components/atoms/Button";
import AdminEventModal from "pages/Admin/AdminEventModal";
import RoomEdit from "pages/Admin/Room/Edit";
import RoomModal from "pages/Admin/Room/Modal";
import RoomCard from "pages/Admin/Room/Card";

// Hooks
import { Link, useHistory } from "react-router-dom";

// Typings
import { VenueDetailsProps } from "./VenueDetails.types";

// Styles
import * as S from "./VenueDetails.styles";
import MapPreview from "pages/Admin/MapPreview";
import ToggleSwitch from "components/atoms/ToggleSwitch";
import { updateRoom, updateVenue_v2 } from "api/admin";
import { useUser } from "hooks/useUser";
import { Form } from "react-bootstrap";
import { RoomData_v2 } from "types/RoomData";
import { useFirestoreConnect } from "react-redux-firebase";
import { isEqual } from "lodash";
import RoomDeleteModal from "../Rooms/RoomDeleteModal";
import { VenueOwnersModal } from "pages/Admin/VenueOwnersModal";

type Owner = {
  id: string;
  data: any;
  partyName: string;
  pictureUrl: string;
};

type EditRoomType = RoomData_v2 & {
  roomIndex: number;
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

  const [editingRoom, setEditingRoom] = useState<EditRoomType | null>(null);
  const [showEventModal, setShowEventModal] = useState(false);
  const [eventRoom, setEventRoom] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showOwnersModal, setShowOwnersModal] = useState(false);

  const history = useHistory();

  useFirestoreConnect([
    {
      collection: "venues",
      doc: venueId,
      subcollections: [{ collection: "events" }],
      orderBy: ["start_utc_seconds", "asc"],
      storeAs: "events",
    },
  ]);

  const ownersRef = useRef([]);

  useEffect(() => {
    const newOwners: any = [];

    async function getOwnersData() {
      if (!!owners) {
        for (const owner of owners) {
          const user = await firebase
            .functions()
            .httpsCallable("venue-getOwnerData")({ userId: owner });
          const userData = user.data;

          if (ownersRef.current.filter((i: Owner) => i.id !== owner)) {
            newOwners.push({
              id: owner,
              ...userData,
            });
          }
        }

        if (!isEqual(ownersData, newOwners)) {
          setOwnersData(newOwners);
        }
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

  const handleEditRoom = (room: RoomData_v2, index: number) => {
    setEditingRoom({
      ...room,
      roomIndex: index,
    });
  };

  const handleRoomEvent = (roomName: string) => {
    setEventRoom(roomName);
    setShowEventModal(true);
  };

  const handleEditRoomSave = (values: RoomData_v2, index: number) => {
    const newData = {
      ...values,
      x_percent: editingRoom?.x_percent,
      y_percent: editingRoom?.y_percent,
      width_percent: editingRoom?.width_percent,
      height_percent: editingRoom?.height_percent,
    };

    updateRoom(newData, venueId!, user, index);
  };

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
          <Link
            to={`/in/${venue.id}`}
            className="btn btn-primary"
            style={{ marginBottom: "0.5em" }}
            target="_blank"
          >
            Go to your space
          </Link>
          <Button>Preview landing page</Button>

          <S.AdminList>
            <S.AdminListTitle>Party admins</S.AdminListTitle>

            {ownersData.length > 0 &&
              ownersData.map((owner: Owner) => (
                <S.AdminItem key={owner.id}>
                  <S.AdminPicture backgroundImage={owner.pictureUrl} />
                  <S.AdminItemTitle>{owner.partyName}</S.AdminItemTitle>
                </S.AdminItem>
              ))}

            <Button onClick={() => setShowOwnersModal(true)}>
              Invite an admin
            </Button>
          </S.AdminList>
        </S.HeaderActions>
      </S.Header>

      <S.Main>
        <MapPreview
          venueId={venueId!}
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
          </>
        )}

        {!!rooms && !!mapBackgroundImageUrl && (
          <S.RoomWrapper>
            {rooms.map((room: any, index: number) => (
              <RoomCard
                key={room.title}
                {...room}
                editHandler={() => handleEditRoom(room, index)}
                onEventHandler={handleRoomEvent}
              />
            ))}
          </S.RoomWrapper>
        )}

        {!!mapBackgroundImageUrl && renderShowGrid()}
        {!!mapBackgroundImageUrl && renderRoomVisibility()}
      </S.Main>

      <RoomModal
        isVisible={modalOpen}
        venueId={venueId!}
        onSubmitHandler={() => setModalOpen(false)}
        onClickOutsideHandler={() => setModalOpen(false)}
      />

      {editingRoom && (
        <RoomEdit
          isVisible={!!editingRoom}
          onClickOutsideHandler={() => setEditingRoom(null)}
          room={editingRoom}
          submitHandler={handleEditRoomSave}
          deleteHandler={() => setShowDeleteModal(true)}
        />
      )}

      {editingRoom && (
        <RoomDeleteModal
          show={showDeleteModal}
          onHide={() => setShowDeleteModal(false)}
          venueId={venueId!}
          room={editingRoom}
          onDeleteRedirect={`/admin_v2/venue/${venueId}`}
          onDelete={() => {
            setShowDeleteModal(false);
            setEditingRoom(null);
          }}
        />
      )}

      <VenueOwnersModal
        visible={showOwnersModal}
        onHide={() => setShowOwnersModal(false)}
        venue={venue}
      />

      <AdminEventModal
        show={showEventModal}
        venueId={venueId!}
        onHide={() => setShowEventModal(false)}
        setEditedEvent={() => {}}
        setShowDeleteEventModal={() => {}}
        roomName={eventRoom}
      />
    </S.Container>
  );
};

export default VenueDetails;
