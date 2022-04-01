import React, { useCallback, useMemo, useState } from "react";
import { UseFormRegister } from "react-hook-form";
import { useAsyncFn } from "react-use";
import { ImageInput } from "components/admin/ImageInput";
import { ImageInputChangeProps } from "components/admin/ImageInput/ImageInput";
import { InputGroup } from "components/admin/InputGroup";
import { noop } from "lodash/fp";

import { DEFAULT_BACKGROUNDS } from "settings";

import { updateMapBackground } from "api/admin";

import { WorldId } from "types/id";
import { AnyForm } from "types/utility";

import { useUserId } from "hooks/user/useUserId";

import { Loading } from "components/molecules/Loading";
import { SubmitError } from "components/molecules/SubmitError";

interface BackgroundSelectProps {
  venueId: string;
  venueName: string;
  spaceSlug: string;
  worldId: string;
  mapBackgrounds: string[];
  isLoadingBackgrounds: boolean;
  register: UseFormRegister<AnyForm>;
  imageUrl?: string;
}

export const BackgroundSelect: React.FC<BackgroundSelectProps> = ({
  venueId,
  venueName,
  spaceSlug,
  mapBackgrounds,
  isLoadingBackgrounds,
  worldId,
  register,
  imageUrl,
}) => {
  const { userId } = useUserId();
  const [selected, setSelected] = useState("");

  const [{ loading: isUploading, error }, uploadMapBackground] = useAsyncFn(
    async (url: string, file?: FileList) => {
      setSelected(url);

      if (!userId) return;

      return await updateMapBackground(
        {
          id: venueId,
          worldId: worldId as WorldId,
          name: venueName,
          slug: spaceSlug,
          mapBackgroundImageFile: file,
          mapBackgroundImageUrl: url,
        },
        userId
      );
    },
    [userId, venueName, spaceSlug, worldId, venueId]
  );

  const hasBackgrounds = !!mapBackgrounds.length && !isLoadingBackgrounds;

  const renderedBackground = useCallback(
    (mapBackground, key) => (
      <div
        key={key}
        className="ml-1 mr-1 rounded-md mb-2 h-10 w-16 bg-cover"
        style={{
          backgroundImage: `url(${mapBackground})`,
        }}
        onClick={() => !isUploading && uploadMapBackground(mapBackground)}
      >
        {isUploading && mapBackground === selected && (
          <Loading containerClassName="w-full h-full flex justify-center items-center" />
        )}
      </div>
    ),
    [isUploading, selected, uploadMapBackground]
  );

  const renderedMapBackgrounds = useMemo(
    () => mapBackgrounds.map(renderedBackground),
    [mapBackgrounds, renderedBackground]
  );

  const renderedDefaultBackgrounds = useMemo(
    () => DEFAULT_BACKGROUNDS.map(renderedBackground),
    [renderedBackground]
  );

  const onImageChange: (props: ImageInputChangeProps) => void = useCallback(
    ({ url, extra }) => {
      // @debt use a compressed image here
      uploadMapBackground(url, extra.files);
    },
    [uploadMapBackground]
  );

  return (
    <div data-bem="BackgroundSelect">
      <>
        <InputGroup
          title="Import a map background"
          subtitle="Recommended size: 2000px / 1200px"
        >
          <ImageInput
            name="imageUrl"
            // @debt use form for background map upload (not separately)
            setValue={noop}
            onChange={onImageChange}
            register={register}
            imgUrl={imageUrl}
            disabled={isUploading}
          />
        </InputGroup>

        <InputGroup title="Or select one of our map backgrounds">
          <div className="flex flex-wrap">
            {renderedDefaultBackgrounds}
            {hasBackgrounds && renderedMapBackgrounds}
          </div>
        </InputGroup>

        {isLoadingBackgrounds && <Loading label="Loading maps..." />}
        <SubmitError error={error} />
      </>
    </div>
  );
};
