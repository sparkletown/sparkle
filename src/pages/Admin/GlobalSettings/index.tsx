import { Toggler } from "components/atoms/Toggler";
import React, { useEffect } from "react";
import { useAsyncFn } from "react-use";
import { updateVenue } from "api/admin";
import { useForm } from "react-hook-form";
import { useUser } from "hooks/useUser";
import { WithId } from "utils/id";
import { AnyVenue } from "types/venues";
import * as Yup from "yup";
import { Button } from "react-bootstrap";

import "./index.scss";

interface GlobalSettingsShape {
  showBadges?: boolean;
}
const validationSchema = Yup.object().shape<GlobalSettingsShape>({
  showBadges: Yup.boolean(),
});
export type FormValues = Yup.InferType<typeof validationSchema>;

const GlobalSettings = ({
  isShowBadgesGlobal,
  ownedVenues,
}: {
  isShowBadgesGlobal: boolean;
  ownedVenues: WithId<AnyVenue>[];
}) => {
  const { register, setValue, handleSubmit } = useForm<GlobalSettingsShape>({
    mode: "onChange",
  });

  const { user } = useUser();
  const [{ loading: isUpdating }, handleUpdate] = useAsyncFn(
    async ({ venue, values, user }) =>
      updateVenue(
        {
          subtitle: venue?.config?.landingPageConfig.subtitle ?? "",
          description: venue?.config?.landingPageConfig.description ?? "",
          adultContent: venue?.adultContent ?? false,
          showBadges: values?.showBadges ?? false,
          profile_questions: venue.profile_questions,
          code_of_conduct_questions: venue.code_of_conduct_questions,
          name: venue?.name ?? "",
          template: venue.template,
          id: venue.id,
        },
        user
      )
  );

  const onSubmit = async (values: GlobalSettingsShape) => {
    if (!user) return;

    ownedVenues.map((venue) => {
      return handleUpdate({ venue, values, user });
    });
  };

  useEffect(() => {
    if (isShowBadgesGlobal) {
      setValue("showBadges", true);
    }
  }, [isShowBadgesGlobal, setValue]);

  // @debt pass the header into Toggler's 'label' prop instead of being external like this
  const renderShowBadgesToggle = () => (
    <div className="global-venue-settings-controls">
      <h4 className="italic input-header">Show badges</h4>
      <Toggler
        name="showBadges"
        forwardedRef={register}
        disabled={isUpdating}
      />
    </div>
  );

  return (
    <form
      className="global-venue-settings"
      onSubmit={handleSubmit((vals) => onSubmit(vals))}
    >
      {renderShowBadgesToggle()}
      <Button
        className="global-venue-settings-btn"
        type="submit"
        disabled={isUpdating}
      >
        Save
      </Button>
    </form>
  );
};

export default GlobalSettings;
