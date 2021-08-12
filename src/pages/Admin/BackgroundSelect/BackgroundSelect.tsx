import React, { useCallback, useMemo } from "react";
import { useAsyncFn } from "react-use";

import { updateVenue_v2 } from "api/admin";

import { useFetchAssets } from "hooks/useFetchAssets";
import { useUser } from "hooks/useUser";

import { FileButton } from "components/atoms/FileButton";
import { FileButtonOnChangeData } from "components/atoms/FileButton/FileButton";

import "./BackgroundSelect.scss";

export interface BackgroundSelectProps {
  venueName: string;
  mapBackground?: string;
}

export const BackgroundSelect: React.FC<BackgroundSelectProps> = ({
  venueName,
  mapBackground,
}) => {
  const { user } = useUser();
  const {
    assets: mapBackgrounds,
    isLoading: isLoadingBackgrounds,
  } = useFetchAssets("mapBackgrounds");

  const [{ loading: isUploading }, uploadMapBackground] = useAsyncFn(
    async (url: string, file?: FileList) => {
      if (!user) return;

      const hasCustomBackground = !!(file && file.length);

      return await updateVenue_v2(
        {
          name: venueName,
          ...(hasCustomBackground && { mapBackgroundImageFile: file }),
          mapBackgroundImageUrl: url,
        },
        user
      );
    },
    [user, venueName]
  );

  const hasBackgrounds = !!mapBackgrounds.length && !isLoadingBackgrounds;

  const renderMapBackgrounds = useMemo(
    () =>
      mapBackgrounds.map((mapBackground, index) => (
        <button
          className="BackgroundSelect__map"
          disabled={isUploading}
          style={{ backgroundImage: `url(${mapBackground})` }}
          key={index}
          onClick={() => uploadMapBackground(mapBackground)}
        />
      )),
    [isUploading, mapBackgrounds, uploadMapBackground]
  );

  const onClick = useCallback(
    ({ url, files }: FileButtonOnChangeData) => uploadMapBackground(url, files),
    [uploadMapBackground]
  );

  return (
    <div className="BackgroundSelect">
      {!mapBackground && (
        <>
          <FileButton
            disabled={isUploading}
            title="Import a map background"
            variant="primary"
            onClick={onClick}
          >
            Import a map background
          </FileButton>
          <span className="BackgroundSelect__file-description">
            Recommended size: 2000px / 1200px
          </span>

          <h3 className="BackgroundSelect__maps-header">
            Or select one of our map backgrounds
          </h3>
          {isLoadingBackgrounds && <div>Loading maps...</div>}

          <div className="BackgroundSelect__map-grid">
            {hasBackgrounds && renderMapBackgrounds}
          </div>
        </>
      )}

      {mapBackground && (
        <img width="100%" src={mapBackground} alt="Venue map background" />
      )}
    </div>
  );
};
