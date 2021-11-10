import React, { useCallback } from "react";
import { Form } from "react-bootstrap";
import { useForm } from "react-hook-form";
import * as Yup from "yup";

import { updateVenue_v2 } from "api/admin";

import { Venue_v2_EntranceConfig } from "types/venues";

import { useUser } from "hooks/useUser";

import EntranceInput from "pages/Admin/Venue/EntranceInput";

import { ButtonNG } from "components/atoms/ButtonNG";

import * as S from "../Admin.styles";

import { EntranceExperienceProps } from "./EntranceExperience.types";

import "./EntranceExperience.scss";

const validationSchema = Yup.object().shape({
  entrance: Yup.array(
    Yup.object().shape({
      // template: Yup.string().matches(/welcomevideo/).required('Template is required'),
      videoUrl: Yup.string().required("Video url is required."),
      autoplay: Yup.boolean().notRequired(),
      buttons: Yup.array(
        Yup.object().shape({
          isProceed: Yup.boolean().required(),
          text: Yup.string().notRequired(),
          href: Yup.string().notRequired(),
        })
      ),
    })
  ),
});

const EntranceExperience: React.FC<EntranceExperienceProps> = ({
  venue,
  onSave,
}) => {
  const {
    register,
    handleSubmit,
    errors,
    formState: { dirty, isSubmitting },
  } = useForm<Venue_v2_EntranceConfig>({
    mode: "onSubmit",
    reValidateMode: "onChange",
    validationSchema: validationSchema,
    defaultValues: {
      entrance: venue.entrance,
    },
  });

  const { user } = useUser();

  const onSubmit = useCallback(
    async (data: Venue_v2_EntranceConfig) => {
      if (!user) return;

      const entranceData = {
        entrance: data.entrance ?? [],
      };

      await updateVenue_v2(
        {
          name: venue.name,
          slug: venue.slug,
          worldId: venue.worldId,
          ...entranceData,
        },
        user
      );

      onSave();
    },
    [onSave, user, venue.name, venue.slug, venue.worldId]
  );

  return (
    <div>
      <h1>Entrance Experience</h1>

      <Form onSubmit={handleSubmit(onSubmit)}>
        <S.ItemWrapper>
          <S.ItemHeader>
            <S.ItemTitle>Venue Entrance</S.ItemTitle>
          </S.ItemHeader>
          <S.ItemBody>
            <EntranceInput
              register={register}
              fieldName="entrance"
              showTitle={false}
              editing={venue.entrance}
              errors={errors.entrance}
            />
          </S.ItemBody>
        </S.ItemWrapper>

        <ButtonNG
          className="EntranceExperience__save-button"
          type="submit"
          variant="primary"
          disabled={!dirty || isSubmitting}
          loading={isSubmitting}
        >
          Save
        </ButtonNG>
      </Form>
    </div>
  );
};

export default EntranceExperience;
