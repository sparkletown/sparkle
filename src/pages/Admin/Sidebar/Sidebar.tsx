import React from "react";
import { Button, Nav } from "react-bootstrap";
import { Link } from "react-router-dom";

import { useVenueId } from "hooks/useVenueId";

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

  const initialVenue = venueId ?? selectVenue;

  return (
    <S.Wrapper>
      <Button as={Link} to="/admin_v2/venue">
        Back
      </Button>

      <S.InnerWrapper>
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
