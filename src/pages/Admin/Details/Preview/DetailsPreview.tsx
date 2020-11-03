import React from 'react';

// Typings
import { DetailsPreviewProps } from './DetailsPreview.types';

// Styles
import * as S from './DetailsPreview.styles';

const DetailsPreview: React.FC<DetailsPreviewProps> = ({ bannerURL, logoURL, name, subtitle, description }) => {

  const renderLogo = () => (
    <S.Logo backgroundImage={logoURL} />
  )

  const renderName = () => (
    <S.TitleWrapper>
      <S.Title>{name}</S.Title>
      <S.Subtitle>{subtitle}</S.Subtitle>
    </S.TitleWrapper>
  )

  const renderDescription = () => (
    <p>{description}</p>
  )

  return (
    <S.Wrapper>
      <S.PreviewCard backgroundImage={bannerURL}>
        {renderLogo()}
        {renderName()}
        {renderDescription()}
      </S.PreviewCard>
    </S.Wrapper>
  )
}

DetailsPreview.defaultProps = {
  name: 'Party name',
  subtitle: 'Party subtitle',
  description: 'Description'
}

export default DetailsPreview;
