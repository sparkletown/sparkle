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

// TODO: FETCH FROM FIRESTORE AND REMOVE THIS
const defaultMaps = [
  { id: "1", url: "https://placekitten.com/g/2000/1200" },
  { id: "2", url: "https://placekitten.com/g/2000/1200" },
  { id: "3", url: "https://placekitten.com/g/2000/1200" },
  { id: "4", url: "https://placekitten.com/g/2000/1200" },
  { id: "5", url: "https://placekitten.com/g/2000/1200" },
  { id: "6", url: "https://placekitten.com/g/2000/1200" },
];

const BackgroundSelect: React.FC<BackgroundSelectProps> = ({ venueName }) => {
  const { user } = useUser();

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
        {defaultMaps.map((map) => (
          <S.MapItem
            backgroundImage={map.url}
            key={map.id}
            aspectRatio="1.6/1"
            onClick={() => handleUpload(map.url)}
          />
        ))}
      </S.MapBrowserGrid>
    </S.Wrapper>
  );
};

export default BackgroundSelect;
