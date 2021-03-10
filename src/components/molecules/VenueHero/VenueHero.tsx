import React from "react";

import * as S from "./VenueHero.styles";

export interface DetailsPreviewProps {
  bannerImageUrl?: string;
  logoImageUrl?: string;
  name?: string;
  subtitle?: string;
  description?: string;
  large?: boolean;
}

export const VenueHero: React.FC<DetailsPreviewProps> = ({
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
