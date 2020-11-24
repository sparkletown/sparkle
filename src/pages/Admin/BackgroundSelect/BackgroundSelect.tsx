import React from "react";

// API
import { updateVenueNew } from "api/admin";

// Components
import FileButton from "components/atoms/FileButton";
import Legend from "components/atoms/Legend";

// Hooks
import { useUser } from "hooks/useUser";

// Typings
import { BackgroundSelectProps } from "./BackgroundSelect.types";

// Styles
import * as S from "./BackgroundSelect.styles";
import { useFetchAssetImages } from "hooks/useFetchAssetImages";

const BackgroundSelect: React.FC<BackgroundSelectProps> = ({ venueName }) => {
  const { user } = useUser();
  const mapBackgrounds = useFetchAssetImages("mapBackgrounds");

  const handleUpload = (url: string) => {
    if (!user) return;

    return updateVenueNew(
      {
        name: venueName,
        mapBackgroundImageUrl: url,
      },
      user
    );
  };

  const handleBackgroundRemove = () => {
    if (!user) return;

    return updateVenueNew(
      {
        name: venueName,
        mapBackgroundImageUrl: "",
      },
      user
    );
  };

  return (
    <S.Wrapper>
      <Legend text={`${venueName}'s Map`} />
      <Legend
        text="Remove background"
        position="right"
        onClick={() => handleBackgroundRemove()}
      />
      <FileButton onChange={handleUpload} />

      <h3>Or choose a map</h3>
      <S.MapBrowserGrid>
        {mapBackgrounds.length > 0 &&
          mapBackgrounds.map((item, index) => (
            <S.MapItem
              backgroundImage={item}
              key={index}
              aspectRatio="1.6/1"
              onClick={() => handleUpload(item)}
            />
          ))}
      </S.MapBrowserGrid>
    </S.Wrapper>
  );
};

export default BackgroundSelect;
