import React from "react";

// API
import { updateVenue_v2 } from "api/admin";

// Components
import FileButton from "components/atoms/FileButton";

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

  const handleUpload = (url: string, file?: FileList) => {
    if (!user) return;

    if (file && file.length) {
      return updateVenue_v2(
        {
          name: venueName,
          mapBackgroundImageFile: file,
          mapBackgroundImageUrl: url,
        },
        user
      );
    }

    return updateVenue_v2(
      {
        name: venueName,
        mapBackgroundImageUrl: url,
      },
      user
    );
  };

  return (
    <>
    <S.Wrapper hasImage={!!mapBackground}>
      {!mapBackground && (
        <>
          <FileButton onChange={handleUpload} />

          <div>
              Or select one of our map backgrounds
            </div>

        </>
      )}

      {mapBackground && <S.Image src={mapBackground} />}
    </S.Wrapper>
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
  );
};

export default BackgroundSelect;
