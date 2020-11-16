import React from "react";

// Typings
import { DetailsPreviewProps } from "./VenueHero.types";

// Styles
import * as S from "./VenueHero.styles";

const VenueHero: React.FC<DetailsPreviewProps> = ({
  bannerImageUrl,
  logoImageUrl,
  name,
  subtitle,
  description,
  large = false,
}) => {
  const renderLogo = () => <S.Logo backgroundImage={logoImageUrl} />;

  const renderName = () => (
    <S.TitleWrapper>
      <S.Title>{name}</S.Title>
      <S.Subtitle>{subtitle}</S.Subtitle>
    </S.TitleWrapper>
  );

  const renderDescription = () => <S.Description>{description}</S.Description>;

  return (
    <S.Container backgroundImage={bannerImageUrl} large={large}>
      {renderLogo()}
      {renderName()}
      {renderDescription()}
    </S.Container>
  );
};

export default VenueHero;
