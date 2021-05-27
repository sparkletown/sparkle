import React from "react";

// Typings
import { DetailsPreviewProps } from "./DetailsPreview.types";

// Styles
import * as S from "./DetailsPreview.styles";
import { DEFAULT_VENUE_BANNER, DEFAULT_VENUE_LOGO } from "settings";

import { RenderMarkdown } from "components/organisms/RenderMarkdown";

const DetailsPreview: React.FC<DetailsPreviewProps> = ({
  bannerImageUrl,
  logoImageUrl,
  name,
  subtitle,
  description,
}) => {
  const renderLogo = () => (
    <S.Logo
      backgroundImage={!!logoImageUrl ? logoImageUrl : DEFAULT_VENUE_LOGO}
    />
  );

  const renderName = () => (
    <S.TitleWrapper>
      <S.Title>{name}</S.Title>
      <S.Subtitle>{subtitle}</S.Subtitle>
    </S.TitleWrapper>
  );

  const renderDescription = () => (
    <S.Description><RenderMarkdown text={description} /></S.Description>
  );

  return (
    <S.Wrapper>
      <S.PreviewCard
        backgroundImage={
          !!bannerImageUrl ? bannerImageUrl : DEFAULT_VENUE_BANNER
        }
      >
        {renderLogo()}
        {renderName()}
        {renderDescription()}
      </S.PreviewCard>
    </S.Wrapper>
  );
};

export default DetailsPreview;
