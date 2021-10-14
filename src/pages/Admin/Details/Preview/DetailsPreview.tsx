import React from "react";

import { DEFAULT_VENUE_BANNER_COLOR, DEFAULT_VENUE_LOGO } from "settings";

import { RenderMarkdown } from "components/organisms/RenderMarkdown";

// Styles
import * as S from "./DetailsPreview.styles";
// Typings
import { DetailsPreviewProps } from "./DetailsPreview.types";

const DetailsPreview: React.FC<DetailsPreviewProps> = ({
  bannerImageUrl,
  logoImageUrl,
  name,
  subtitle,
  description,
}) => {
  const renderLogo = () => (
    <S.Logo
      backgroundImage={logoImageUrl ? logoImageUrl : DEFAULT_VENUE_LOGO}
    />
  );

  const renderName = () => (
    <S.TitleWrapper>
      <S.Title>{name}</S.Title>
      <S.Subtitle>{subtitle}</S.Subtitle>
    </S.TitleWrapper>
  );

  const renderDescription = () => (
    <S.Description>
      <RenderMarkdown text={description} />
    </S.Description>
  );

  const previewImage = bannerImageUrl ?? DEFAULT_VENUE_BANNER_COLOR;

  return (
    <S.Wrapper>
      <S.PreviewCard backgroundImage={previewImage}>
        {renderLogo()}
        {renderName()}
        {renderDescription()}
      </S.PreviewCard>
    </S.Wrapper>
  );
};

export default DetailsPreview;
