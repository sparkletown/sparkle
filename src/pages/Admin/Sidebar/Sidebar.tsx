import { useSelector } from "hooks/useSelector";
import { useVenueId } from "hooks/useVenueId";
import React from "react";
import { Button, Form, Nav } from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";
import { VenueTemplate } from "types/venues";
import { SidebarOption } from "../Admin_v2";

import * as S from "./Sidebar.styles";

// String constants
const selectVenue = "select_venue";

interface AdminSidebarProps {
  sidebarOptions: SidebarOption[];
  selected: string;
  onClick: (item: string) => void;
}
const AdminSidebar: React.FC<AdminSidebarProps> = ({
  sidebarOptions,
  selected,
  onClick,
}) => {
  const venueId = useVenueId();
  const history = useHistory();

  const venues = useSelector((state) => state.firestore.ordered.venues);
  const partyVenues = venues?.filter(
    (venue) => venue.template === VenueTemplate.partymap
  );
  const handleVenueChange = (event: React.ChangeEvent<HTMLSelectElement>) =>
    history.push(`/admin_v2/${event.target.value}`);

  const initialVenue = venueId ?? selectVenue;

  return (
    <S.Wrapper>
      <Button as={Link} to="/admin_v2/venue/creation">
        Create new venue
      </Button>

      <S.InnerWrapper>
        <Form.Control
          as="select"
          custom
          onChange={handleVenueChange}
          defaultValue={initialVenue}
        >
          <option disabled aria-disabled value={selectVenue}>
            - Select Venue-
          </option>
          {partyVenues?.map((venue) => (
            <option key={venue.id!} value={venue.id!}>
              {venue.name}
            </option>
          ))}
        </Form.Control>

        {initialVenue !== selectVenue && (
          <Nav activeKey={selected} onSelect={onClick}>
            {sidebarOptions.map((option: SidebarOption) => {
              if (option.redirectTo)
                return (
                  <Nav.Item key={option.id}>
                    <Nav.Link href={`${option.redirectTo}/${venueId}`}>
                      {option.text}
                    </Nav.Link>
                  </Nav.Item>
                );

              return (
                <Nav.Item key={option.id}>
                  <Nav.Link eventKey={option.id}>{option.text}</Nav.Link>
                </Nav.Item>
              );
            })}
          </Nav>
        )}
      </S.InnerWrapper>
    </S.Wrapper>
  );
};

export default AdminSidebar;
