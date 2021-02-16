import React from "react";

// Typings
import { DetailsPreviewProps } from "./VenueHero.types";

// Styles
import * as S from "./VenueHero.styles";
// import Button from "components/atoms/Button/Button";
import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";

const VenueHero: React.FC<DetailsPreviewProps> = ({
  bannerImageUrl,
  logoImageUrl,
  name,
  subtitle,
  description,
  large = false,
  showEdit,
  venueId,
}) => {
  const renderLogo = () => <S.Logo backgroundImage={logoImageUrl} />;

  const renderName = () => (
    <S.TitleWrapper>
      <S.Title>{name}</S.Title>
      <S.Subtitle>{subtitle}</S.Subtitle>
    </S.TitleWrapper>
  );

  const renderDescription = () => <S.Description>{description}</S.Description>;

  const renderEditButton = () => (
    <Button as={Link} to={`/admin_v2/edit/${venueId}`}>
      Edit party info
    </Button>
  );

  return (
    <S.Container backgroundImage={bannerImageUrl} large={large}>
      {renderLogo()}
      {renderName()}
      {renderDescription()}
      {showEdit && renderEditButton()}
    </S.Container>
  );
};

export default VenueHero;
