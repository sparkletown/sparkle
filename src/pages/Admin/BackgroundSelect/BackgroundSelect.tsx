import React, { useCallback, useMemo, useState } from "react";
import { useAsyncFn } from "react-use";

import { DEFAULT_BACKGROUNDS } from "settings";

import { updateMapBackground } from "api/admin";

import { useUser } from "hooks/useUser";

import { Loading } from "components/molecules/Loading";
import { SubmitError } from "components/molecules/SubmitError";

import { ButtonNG } from "components/atoms/ButtonNG";
import { FileButton } from "components/atoms/FileButton";

import "./BackgroundSelect.scss";

export interface BackgroundSelectProps {
  venueName: string;
  venueSlug: string;
  worldId: string;
  mapBackgrounds: string[];
  isLoadingBackgrounds: boolean;
}

export const BackgroundSelect: React.FC<BackgroundSelectProps> = ({
  venueName,
  venueSlug,
  mapBackgrounds,
  isLoadingBackgrounds,
  worldId,
}) => {
  const { user } = useUser();
  const [selected, setSelected] = useState("");

  const [{ loading: isUploading, error }, uploadMapBackground] = useAsyncFn(
    async (url: string, file?: FileList) => {
      setSelected(url);

      if (!user) return;

      return await updateMapBackground(
        {
          worldId: worldId,
          name: venueName,
          slug: venueSlug,
          mapBackgroundImageFile: file,
          mapBackgroundImageUrl: url,
        },
        user
      );
    },
    [user, venueName, venueSlug, worldId]
  );

  const hasBackgrounds = !!mapBackgrounds.length && !isLoadingBackgrounds;

  const renderedBackground = useCallback(
    (mapBackground, key) => (
      <ButtonNG
        className="BackgroundSelect__map"
        disabled={isUploading}
        loading={isUploading && mapBackground === selected}
        style={{ backgroundImage: `url(${mapBackground})` }}
        key={key}
        onClick={() => uploadMapBackground(mapBackground)}
      />
    ),
    [isUploading, uploadMapBackground, selected]
  );

  const renderedMapBackgrounds = useMemo(
    () => mapBackgrounds.map(renderedBackground),
    [mapBackgrounds, renderedBackground]
  );

  const renderedDefaultBackgrounds = useMemo(
    () => DEFAULT_BACKGROUNDS.map(renderedBackground),
    [renderedBackground]
  );

  return (
    <div className="BackgroundSelect">
      <>
        <FileButton
          disabled={isUploading}
          loading={isUploading}
          title="Import a map background"
          description="Recommended size: 2000px / 1200px"
          onChange={uploadMapBackground}
        />

        <h3 className="BackgroundSelect__maps-header">
          Or select one of our map backgrounds
        </h3>

        <div className="BackgroundSelect__map-grid">
          {renderedDefaultBackgrounds}
          {hasBackgrounds && renderedMapBackgrounds}
        </div>

        {isLoadingBackgrounds && <Loading label="Loading maps..." />}
        <SubmitError error={error} />
      </>
    </div>
  );
};
