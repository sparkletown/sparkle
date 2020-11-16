import styled from "styled-components";

import { Container as VenueHeroContainer } from "components/molecules/VenueHero/VenueHero.styles";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding-right: 15%;

  overflow: hidden;

  background-color: #000000;
`;

export const Header = styled.header`
  display: grid;
  grid-template-columns: 70% 30%;
  grid-column-gap: 2rem;

  ${VenueHeroContainer} {
    position: relative;

    border-radius: 0;
  }
`;

export const HeaderActions = styled.div`
  display: flex;
  flex-direction: column;
`;

export const Main = styled.main`
  padding-left: 4.4em;
  margin-top: 2rem;
`;
// ---------------- ADMIN LIST
export const AdminList = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1em;

  border-radius: 28px;

  background-color: #1a1d24;
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
