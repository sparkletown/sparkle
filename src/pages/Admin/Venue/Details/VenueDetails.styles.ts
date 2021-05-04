import styled from "styled-components";

import { Container as VenueHeroContainer } from "components/molecules/VenueCard/VenueCard.styles";
import { Button } from "components/atoms/Button/Button.styles";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  overflow: hidden;
  scrollbar-width: thin;
  background-color: #000000;
`;

export const Header = styled.header`
  display: grid;
  grid-template-columns: repeat(10, 1fr);
  grid-column-gap: 2rem;

  ${VenueHeroContainer} {
    grid-column: 1 / span 7;
    position: relative;

    border-radius: 0;
  }
`;

// -------------------- HEADER ACTIONS
export const HeaderActions = styled.div`
  display: flex;
  padding-top: 1rem;
  grid-column: 8 / end;
  flex-direction: column;

  ${Button} {
    margin-bottom: 0.5rem;
  }
`;

// -------------------- MAIN CONTENT
export const Main = styled.main`
  display: flex;
  margin-top: 2rem;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;

  ${Button} {
    padding: 0.75em 2em;

    white-space: nowrap;
  }
`;

// ---------------- ADMIN LIST
export const AdminList = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1em;

  border-radius: 28px;

  background-color: #1a1d24;

  ${Button} {
    display: block;
    width: 100%;
    padding: 0.5em 0;
    margin-top: 0.8em;

    font-size: 0.8rem;
  }
`;

// ---------------- ADMIN LIST - TITLE
export const AdminListTitle = styled.h2`
  margin-left: 1em;

  font-size: 1rem;
  font-weight: normal;
`;

// ---------------- ADMIN LIST - ITEM
export const AdminItem = styled.div`
  display: flex;
  width: 100%;
  padding: 0.6em;
  flex-direction: row;
  align-items: center;

  border-radius: 10em;

  background-color: #14161b;
`;

// ---------------- ADMIN LIST - ITEM - TITLE
export const AdminItemTitle = styled.h3`
  margin: 0 0 0 1em;
  font-size: 1rem;
`;

// ---------------- ADMIN LIST - ITEM - PICTURE
type AdminPictureProps = {
  backgroundImage: string;
};
export const AdminPicture = styled.div<AdminPictureProps>`
  width: 2rem;
  height: 2rem;

  border-radius: 10em;

  background-image: ${({ backgroundImage }) => `url(${backgroundImage})`};
  background-size: cover;
  background-position: center;
`;

export const RoomWrapper = styled.div`
  display: grid;
  margin-top: 2rem;
  grid-gap: 2rem;
  grid-template-columns: 1fr 1fr;
`;

export const RoomCounter = styled.span`
  font-size: 1.5rem;
`;

export const RoomActions = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
`;

export const InputContainer = styled.div`
  display: flex;
  width: 100%;
  margin: 1rem 0;
  align-items: center;

  position: relative;

  input {
    &:focus {
      outline: none;
    }
  }
`;

export const GridSwitchWrapper = styled.div`
  display: flex;

  h4 {
    margin: 0 0.5em 0 0;
  }

  label {
    margin-bottom: 0;
  }
`;

export const GridInputWrapper = styled.div`
  display: flex;
  margin-left: 1rem;
  flex: 1 0 auto;
  align-items: center;

  label {
    margin-right: 1rem;
    margin-bottom: 0;

    white-space: nowrap;
  }
`;
