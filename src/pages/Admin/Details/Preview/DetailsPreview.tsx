import React from "react";

// Typings
import { DetailsPreviewProps } from "./DetailsPreview.types";

// Styles
import * as S from "./DetailsPreview.styles";

const DetailsPreview: React.FC<DetailsPreviewProps> = ({
  bannerImageUrl,
  logoImageUrl,
  name,
  subtitle,
  description,
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
    <S.Wrapper>
      <S.PreviewCard backgroundImage={bannerImageUrl}>
        {renderLogo()}
        {renderName()}
        {renderDescription()}
      </S.PreviewCard>
    </S.Wrapper>
  );
};

export default DetailsPreview;
