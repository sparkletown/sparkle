import React from "react";

import { DetailsPreviewProps } from "./VenueHero.types";

import * as S from "./VenueHero.styles";

const VenueHero: React.FC<DetailsPreviewProps> = ({
  bannerImageUrl,
  logoImageUrl,
  name,
  subtitle,
  description,
  large = false,
}) => (
  <S.Container backgroundImage={bannerImageUrl} large={large}>
    <S.Logo backgroundImage={logoImageUrl} />
    <S.TitleWrapper>
      <S.Title>{name}</S.Title>
      <S.Subtitle>{subtitle}</S.Subtitle>
    </S.TitleWrapper>
    <S.Description>{description}</S.Description>
  </S.Container>
);

export default VenueHero;
