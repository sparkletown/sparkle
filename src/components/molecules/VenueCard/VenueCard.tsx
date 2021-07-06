import React from "react";

import * as S from "./VenueCard.styles";

export interface VenueCardProps {
  bannerImageUrl?: string;
  logoImageUrl?: string;
  name?: string;
  subtitle?: string;
  description?: string;
  large?: boolean;
}

export const VenueCard: React.FC<VenueCardProps> = ({
  bannerImageUrl,
  logoImageUrl,
  name,
  subtitle,
  description,
  large: isLarge = false,
}) => (
  <S.Container backgroundImage={bannerImageUrl} large={isLarge}>
    <S.Logo backgroundImage={logoImageUrl} />
    <S.TitleWrapper>
      <S.Title>{name}</S.Title>
      <S.Subtitle>{subtitle}</S.Subtitle>
    </S.TitleWrapper>
    <S.Description>{description}</S.Description>
  </S.Container>
);
