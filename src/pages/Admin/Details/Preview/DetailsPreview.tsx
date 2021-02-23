import React from "react";

import { DEFAULT_VENUE_BANNER, DEFAULT_VENUE_LOGO } from "settings";

import { DetailsPreviewProps } from "./DetailsPreview.types";

import "./DetailsPreview.scss";
import * as S from "./DetailsPreview.styles";

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

  const renderDescription = () => <S.Description>{description}</S.Description>;

  return (
    <S.Wrapper>
      <div className="preview-info">
        <h3>Preview:</h3>
        <div className="preview-info__description">
          This is how the landing page for your Sparkle Space will appear to
          visitors.
        </div>
      </div>
      <div className="preview-container">
        <S.PreviewCard
          backgroundImage={
            !!bannerImageUrl ? bannerImageUrl : DEFAULT_VENUE_BANNER
          }
        >
          {renderLogo()}
          {renderName()}
          {renderDescription()}
        </S.PreviewCard>
      </div>
    </S.Wrapper>
  );
};

export default DetailsPreview;
