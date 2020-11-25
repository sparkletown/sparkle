import React from "react";

// API
import { updateVenue_v2 } from "api/admin";

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

const BackgroundSelect: React.FC<BackgroundSelectProps> = ({
  venueName,
  mapBackground,
}) => {
  const { user } = useUser();
  const mapBackgrounds = useFetchAssetImages("mapBackgrounds");

  const handleUpload = (url: string) => {
    if (!user) return;

    return updateVenue_v2(
      {
        name: venueName,
        mapBackgroundImageUrl: url,
      },
      user
    );
  };

  const handleBackgroundRemove = () => {
    if (!user) return;

    return updateVenue_v2(
      {
        name: venueName,
        mapBackgroundImageUrl: "",
      },
      user
    );
  };

  return (
    <S.Wrapper
      // backgroundUrl={mapBackground}
      hasImage={!!mapBackground}
    >
      <Legend text={`${venueName}'s Map`} />
      {!!mapBackground && (
        <Legend
          text="Remove background"
          position="right"
          onClick={() => handleBackgroundRemove()}
        />
      )}

      {!mapBackground && (
        <>
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
        </>
      )}

      {mapBackground && <S.Image src={mapBackground} />}
    </S.Wrapper>
  );
};

export default BackgroundSelect;
