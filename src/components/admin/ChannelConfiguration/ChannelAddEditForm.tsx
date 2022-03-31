import React, { useEffect, useMemo } from "react";
import { useForm, useFormState } from "react-hook-form";
import { useAsyncFn } from "react-use";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button } from "components/admin/Button";
import { Input } from "components/admin/Input";

import { Channel } from "types/venues";

import { isTruthy } from "utils/types";

import { SubmitError } from "components/molecules/SubmitError";

import { channelSchema } from "./channelSchema";

interface PortalAddEditFormProps {
  onDone: () => void;
  channel?: Channel;
  saveChannel: (channelData: Channel) => Promise<void>;
}

export const ChannelAddEditForm: React.FC<PortalAddEditFormProps> = ({
  channel,
  saveChannel: saveChannelCb,
  onDone,
}) => {
  const defaultValues = useMemo(
    () => ({
      name: channel?.name ?? "",
      iframeUrl: channel?.iframeUrl ?? "",
    }),
    [channel?.name, channel?.iframeUrl]
  );

  const { register, getValues, handleSubmit, reset, control } = useForm({
    reValidateMode: "onChange",
    resolver: yupResolver(channelSchema),
    defaultValues,
  });

  const isEditMode = isTruthy(channel);
  const modalTitle = isEditMode ? "Edit channel" : "Add new channel";

  const { errors } = useFormState({ control });

  useEffect(() => reset(defaultValues), [defaultValues, reset]);

  const [
    { loading: isLoading, error: submitError },
    saveChannel,
  ] = useAsyncFn(async () => {
    await saveChannelCb(getValues());
    onDone();
    return false;
  }, [getValues, onDone, saveChannelCb]);

  return (
    <div>
      <form className="bg-white" onSubmit={handleSubmit(saveChannel)}>
        <div className="text-lg leading-6 font-medium text-gray-900 mb-6">
          {modalTitle}
        </div>
        <Input
          type="text"
          autoComplete="off"
          placeholder={`Add a title`}
          errors={errors}
          name="name"
          register={register}
          disabled={isLoading}
          label="Title"
        />
        <Input
          type="text"
          autoComplete="off"
          placeholder={`https://`}
          errors={errors}
          name="iframeUrl"
          register={register}
          disabled={isLoading}
          label="Embed URL"
        />

        <SubmitError error={submitError} />
        <div className="mt-5 sm:mt-4 sm:flex justify-end">
          <Button variant="secondary" disabled={isLoading} onClick={onDone}>
            Cancel
          </Button>
          <Button
            variant="primary"
            disabled={isLoading}
            title={modalTitle}
            type="submit"
          >
            {isEditMode ? "Save" : "Add"}
          </Button>
        </div>
      </form>
    </div>
  );
};
