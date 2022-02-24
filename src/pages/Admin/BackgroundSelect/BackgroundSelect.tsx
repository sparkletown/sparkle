import React, { useCallback, useMemo, useState } from "react";
import { useAsyncFn } from "react-use";

import { DEFAULT_BACKGROUNDS } from "settings";

import { updateMapBackground } from "api/admin";

import { WorldId } from "types/id";

import { useUser } from "hooks/useUser";

import { ButtonNG } from "components/atoms/ButtonNG";
import { FileButton } from "components/atoms/FileButton";
import { Loading } from "components/molecules/Loading";
import { SubmitError } from "components/molecules/SubmitError";

import "./BackgroundSelect.scss";

export interface BackgroundSelectProps {
  venueId: string;
  venueName: string;
  spaceSlug: string;
  worldId: string;
  mapBackgrounds: string[];
  isLoadingBackgrounds: boolean;
}

export const BackgroundSelect: React.FC<BackgroundSelectProps> = ({
  venueId,
  venueName,
  spaceSlug,
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
          id: venueId,
          worldId: worldId as WorldId,
          name: venueName,
          slug: spaceSlug,
          mapBackgroundImageFile: file,
          mapBackgroundImageUrl: url,
        },
        user
      );
    },
    [user, venueName, spaceSlug, worldId, venueId]
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
