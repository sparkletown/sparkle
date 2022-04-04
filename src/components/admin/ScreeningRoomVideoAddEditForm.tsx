import React, { useEffect, useMemo } from "react";
import { useForm, useFormState } from "react-hook-form";
import { useAsyncFn } from "react-use";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button } from "components/admin/Button";
import { ImageInput } from "components/admin/ImageInput";
import { Input } from "components/admin/Input";
import { InputGroup } from "components/admin/InputGroup";
import omit from "lodash/omit";

import { deleteScreeningRoomVideo, upsertScreeningRoomVideo } from "api/admin";

import { ScreeningRoomVideo } from "types/screeningRoom";

import { uploadFile } from "utils/file";
import { WithId } from "utils/id";
import { isTruthy } from "utils/types";

import { screeningRoomVideoSchema } from "forms/screeningRoomVideoSchema";

import { useWorldAndSpaceByParams } from "hooks/spaces/useWorldAndSpaceByParams";
import { useUserId } from "hooks/user/useUserId";

import { ModalTitle } from "components/molecules/Modal/ModalTitle";
import { SubmitError } from "components/molecules/SubmitError";

export interface ScreeningRoomVideoAddEditFormProps {
  onDone: () => void;
  video?: WithId<ScreeningRoomVideo>;
}

export const ScreeningRoomVideoAddEditForm: React.FC<ScreeningRoomVideoAddEditFormProps> = ({
  video,
  onDone,
}) => {
  const { userId } = useUserId();
  const { spaceId: currentSpaceId } = useWorldAndSpaceByParams();

  const isEditMode = isTruthy(video);
  const title = isEditMode ? "Edit video" : "Add video";

  const defaultValues = useMemo(
    () => ({
      title: video?.title ?? "",
      category: video?.category ?? "",
      authorName: video?.authorName ?? "",
      videoSrc: video?.videoSrc ?? "",
      subCategory: video?.subCategory ?? "",
      thumbnailSrcUrl: video?.thumbnailSrc ?? "",
      introduction: video?.introduction ?? "",
    }),
    [
      video?.title,
      video?.category,
      video?.authorName,
      video?.videoSrc,
      video?.subCategory,
      video?.thumbnailSrc,
      video?.introduction,
    ]
  );

  const {
    register,
    getValues,
    handleSubmit,
    setValue,
    reset,
    control,
  } = useForm({
    reValidateMode: "onChange",
    resolver: yupResolver(screeningRoomVideoSchema),
    defaultValues,
  });

  const { errors } = useFormState({ control });

  useEffect(() => reset(defaultValues), [defaultValues, reset]);

  const [
    { loading: isLoading, error: submitError },
    addVideo,
  ] = useAsyncFn(async () => {
    if (!userId || !currentSpaceId) return;

    const {
      title,
      category,
      authorName,
      videoSrc,
      subCategory,
      introduction,
      // @debt this needs resolving properly
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      thumbnailSrcFile,
    } = getValues();

    const videoSource = video ? omit(video, ["id"]) : {};
    const fileDirectory = `users/${userId}/venues/${currentSpaceId}`;
    const thumbnailSrc = thumbnailSrcFile
      ? await uploadFile(fileDirectory, thumbnailSrcFile)
      : video?.thumbnailSrc;

    const videoData: ScreeningRoomVideo = {
      ...videoSource,
      title,
      category: category.toLocaleLowerCase(),
      authorName,
      thumbnailSrc: thumbnailSrc ?? "",
      videoSrc,
      subCategory,
      introduction,
    };

    if (video) {
      await upsertScreeningRoomVideo(videoData, currentSpaceId, video.id);
    } else {
      await upsertScreeningRoomVideo(videoData, currentSpaceId);
    }

    await onDone();
  }, [currentSpaceId, getValues, onDone, video, userId]);

  const [{ loading: isDeleting, error: deleteError }, deleteVideo] = useAsyncFn(
    async () => {
      if (!currentSpaceId || !video) return;

      await deleteScreeningRoomVideo(video.id, currentSpaceId);
      await onDone();
    }
  );

  return (
    <form
      className="ScreeningRoomVideoAddEditModal ScreeningRoomVideoAddEditForm__form"
      onSubmit={handleSubmit(addVideo)}
    >
      <ModalTitle>{title}</ModalTitle>

      <InputGroup title="Title" isRequired>
        <Input
          type="text"
          autoComplete="off"
          placeholder="Name your video"
          errors={errors}
          name="title"
          register={register}
          disabled={isLoading}
        />
      </InputGroup>

      <InputGroup title="Author of video" isRequired>
        <Input
          type="text"
          autoComplete="off"
          placeholder="Esmerelda Diamond"
          errors={errors}
          name="authorName"
          register={register}
          disabled={isLoading}
        />
      </InputGroup>

      <InputGroup title="Embed URL" isRequired>
        <Input
          type="text"
          autoComplete="off"
          placeholder="https://"
          errors={errors}
          name="videoSrc"
          register={register}
          disabled={isLoading}
        />
      </InputGroup>

      <InputGroup title="Category" isRequired>
        <Input
          type="text"
          autoComplete="off"
          placeholder="Add category"
          errors={errors}
          name="category"
          register={register}
          disabled={isLoading}
        />
      </InputGroup>

      <ImageInput
        name="thumbnailSrc"
        setValue={setValue}
        register={register}
        imgUrl={video?.thumbnailSrc}
        error={errors?.thumbnailSrcUrl}
        buttonLabel="Change thumbnail"
      />

      <InputGroup title="Subcategory">
        <Input
          type="text"
          autoComplete="off"
          placeholder="Add subcategory"
          errors={errors}
          name="subCategory"
          register={register}
          disabled={isLoading}
        />
      </InputGroup>

      <InputGroup title="Introduction">
        <Input
          type="text"
          autoComplete="off"
          placeholder="Add introduction"
          errors={errors}
          name="introduction"
          register={register}
          disabled={isLoading}
        />
      </InputGroup>

      <SubmitError error={submitError || deleteError} />

      <div className="mt-5 sm:mt-4 sm:flex justify-end">
        <div className="ScreeningRoomVideoAddEditForm__buttons">
          {isEditMode && (
            <Button
              variant="danger"
              disabled={isLoading || isDeleting}
              onClick={deleteVideo}
            >
              Delete
            </Button>
          )}

          <Button
            variant="primary"
            disabled={isLoading || isDeleting}
            title={title}
            type="submit"
          >
            Save
          </Button>
        </div>
      </div>
    </form>
  );
};
