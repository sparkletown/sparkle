import React, { useCallback, useMemo } from "react";
import { useAsyncFn } from "react-use";

import { DEFAULT_BACKGROUNDS } from "settings";

import { updateMapBackground } from "api/admin";

import { useUser } from "hooks/useUser";

import { FileButton } from "components/atoms/FileButton";

import "./BackgroundSelect.scss";

export interface BackgroundSelectProps {
  venueName: string;
  worldId: string;
  mapBackgrounds: string[];
  isLoadingBackgrounds: boolean;
}

export const BackgroundSelect: React.FC<BackgroundSelectProps> = ({
  venueName,
  mapBackgrounds,
  isLoadingBackgrounds,
  worldId,
}) => {
  const { user } = useUser();

  const [{ loading: isUploading }, uploadMapBackground] = useAsyncFn(
    async (url: string, file?: FileList) => {
      if (!user) return;

      return await updateMapBackground(
        {
          worldId: worldId,
          name: venueName,
          mapBackgroundImageFile: file,
          mapBackgroundImageUrl: url,
        },
        user
      );
    },
    [user, venueName, worldId]
  );

  const hasBackgrounds = !!mapBackgrounds.length && !isLoadingBackgrounds;

  const renderBackground = useCallback(
    (mapBackground: string, index: number) => (
      <button
        className="BackgroundSelect__map"
        disabled={isUploading}
        style={{ backgroundImage: `url(${mapBackground})` }}
        key={index}
        onClick={() => uploadMapBackground(mapBackground)}
      />
    ),
    [isUploading, uploadMapBackground]
  );

  const renderMapBackgrounds = useMemo(
    () => mapBackgrounds.map(renderBackground),
    [mapBackgrounds, renderBackground]
  );

  const renderDefaultBackgrounds = useMemo(
    () => DEFAULT_BACKGROUNDS.map(renderBackground),
    [renderBackground]
  );

  return (
    <div className="BackgroundSelect">
      <>
        <FileButton
          disabled={isUploading}
          title="Import a map background"
          description="Recommended size: 2000px / 1200px"
          onChange={uploadMapBackground}
        />

        <h3 className="BackgroundSelect__maps-header">
          Or select one of our map backgrounds
        </h3>

        <div className="BackgroundSelect__map-grid">
          {renderDefaultBackgrounds}
          {hasBackgrounds && renderMapBackgrounds}
        </div>

        {isLoadingBackgrounds && <div>Loading maps...</div>}
      </>
    </div>
  );
};
