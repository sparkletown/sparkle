import React, { useMemo } from "react";
import { useAsyncFn } from "react-use";

import { updateVenue_v2 } from "api/admin";

import { useUser } from "hooks/useUser";

import { FileButton } from "components/atoms/FileButton";

import "./BackgroundSelect.scss";

export interface BackgroundSelectProps {
  venueName: string;
  mapBackground?: string;
  mapBackgrounds: string[];
  isLoadingBackgrounds: boolean;
  error: Error | undefined;
}

export const BackgroundSelect: React.FC<BackgroundSelectProps> = ({
  venueName,
  mapBackgrounds,
  isLoadingBackgrounds,
  error,
}) => {
  const { user } = useUser();

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
        {isLoadingBackgrounds && <div>Loading maps...</div>}

        <div className="BackgroundSelect__map-grid">
          {hasBackgrounds && renderMapBackgrounds}
        </div>

        {error && (
          <>
            <div>
              The preset map backgrounds could not be fetched. Please, refresh
              the page or upload a custom map background.
            </div>
            <div>Error: {error.message}</div>
          </>
        )}
      </>
    </div>
  );
};
