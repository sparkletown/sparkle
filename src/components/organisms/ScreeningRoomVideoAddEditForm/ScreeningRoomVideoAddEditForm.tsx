import React, { useEffect, useMemo } from "react";
import { useForm, useFormState } from "react-hook-form";
import { useAsyncFn } from "react-use";
import { yupResolver } from "@hookform/resolvers/yup";
import omit from "lodash/omit";

import { deleteScreeningRoomVideo, upsertScreeningRoomVideo } from "api/admin";

import { ScreeningRoomVideo } from "types/screeningRoom";

import { uploadFile } from "utils/file";
import { WithId } from "utils/id";
import { isTruthy } from "utils/types";

import { screeningRoomVideoSchema } from "forms/screeningRoomVideoSchema";

import { useWorldAndSpaceByParams } from "hooks/spaces/useWorldAndSpaceByParams";
import { useUser } from "hooks/useUser";

import { ButtonNG } from "components/atoms/ButtonNG";
import { ImageInput } from "components/atoms/ImageInput";
import { AdminInput } from "components/molecules/AdminInput";
import { SubmitError } from "components/molecules/SubmitError";

import "./ScreeningRoomVideoAddEditForm.scss";

export interface ScreeningRoomVideoAddEditFormProps {
  onDone: () => void;
  video?: WithId<ScreeningRoomVideo>;
}

export const ScreeningRoomVideoAddEditForm: React.FC<ScreeningRoomVideoAddEditFormProps> = ({
  video,
  onDone,
}) => {
  const { user } = useUser();
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
    if (!user || !currentSpaceId) return;

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
    const fileDirectory = `users/${user.uid}/venues/${currentSpaceId}`;
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
  }, [currentSpaceId, getValues, onDone, video, user]);

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
      <div className="ScreeningRoomVideoAddEditForm__title">{title}</div>
      <AdminInput
        type="text"
        autoComplete="off"
        placeholder="Name your video"
        label="Title (required)"
        errors={errors}
        name="title"
        register={register}
        disabled={isLoading}
      />

      <AdminInput
        type="text"
        autoComplete="off"
        placeholder="Esmerelda Diamond"
        label="Author of video (required)"
        errors={errors}
        name="authorName"
        register={register}
        disabled={isLoading}
      />

      <AdminInput
        type="text"
        autoComplete="off"
        placeholder="https://"
        label="Embed URL (required)"
        errors={errors}
        name="videoSrc"
        register={register}
        disabled={isLoading}
      />

      <AdminInput
        type="text"
        autoComplete="off"
        placeholder="Add category"
        label="Category (required)"
        errors={errors}
        name="category"
        register={register}
        disabled={isLoading}
      />

      <ImageInput
        name="thumbnailSrc"
        setValue={setValue}
        register={register}
        small
        imgUrl={video?.thumbnailSrc}
        error={errors?.thumbnailSrcUrl}
        text="Change thumbnail"
      />

      <AdminInput
        type="text"
        autoComplete="off"
        placeholder="Add subcategory"
        label="Subcategory"
        errors={errors}
        name="subCategory"
        register={register}
        disabled={isLoading}
      />

      <AdminInput
        type="text"
        autoComplete="off"
        placeholder="Add introduction"
        label="Introduction"
        errors={errors}
        name="introduction"
        register={register}
        disabled={isLoading}
      />

      <SubmitError error={submitError || deleteError} />
      <div className="ScreeningRoomVideoAddEditForm__buttons">
        {isEditMode && (
          <ButtonNG
            variant="danger"
            disabled={isLoading || isDeleting}
            onClick={deleteVideo}
          >
            Delete
          </ButtonNG>
        )}
        <ButtonNG
          variant="primary"
          disabled={isLoading || isDeleting}
          title={title}
          type="submit"
        >
          Save
        </ButtonNG>
      </div>
    </form>
  );
};
