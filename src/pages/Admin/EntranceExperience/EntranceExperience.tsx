import React, { useCallback } from "react";
import * as Yup from "yup";
import { Button, Form } from "react-bootstrap";
import { updateVenue_v2, VenueInput_v2 } from "api/admin";

// Pages
import EntranceInput from "pages/Admin/Venue/EntranceInput";
import QuestionInput from "pages/Admin/Venue/QuestionInput";

// Hooks
import { useForm } from "react-hook-form";
import { useUser } from "hooks/useUser";

// Typings
import { Question, Venue_v2_EntranceConfig } from "types/venues";
import { EntranceExperienceProps } from "./EntranceExperience.types";

// Styles
import * as S from "../Admin.styles";
import "./EntranceExperience.scss";
import { useDynamicInput } from "hooks/useDynamicInput";

type ProfileQuestion = VenueInput_v2["profile_questions"];
type CodeOfConductQuestion = VenueInput_v2["code_of_conduct_questions"];

const validationSchema = Yup.object().shape({
  code_of_conduct_questions: Yup.array<CodeOfConductQuestion>()
    .ensure()
    .defined()
    .transform((val) => val.filter((s: Question) => !!s.name && !!s.text)),
  profile_questions: Yup.array<ProfileQuestion>()
    .ensure()
    .defined()
    .transform((val) => val.filter((s: Question) => !!s.name && !!s.text)),
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
    ...rest
  } = useForm<Venue_v2_EntranceConfig>({
    mode: "onSubmit",
    reValidateMode: "onChange",
    validationSchema: validationSchema,
    defaultValues: {
      code_of_conduct_questions: venue.code_of_conduct_questions,
      profile_questions: venue.profile_questions,
      entrance: venue.entrance,
    },
  });

  const { user } = useUser();

  const onSubmit = useCallback(
    async (data: Venue_v2_EntranceConfig) => {
      if (!user) return;

      const entranceData = {
        code_of_conduct_questions: data.code_of_conduct_questions ?? [],
        profile_questions: data.profile_questions ?? [],
        entrance: data.entrance ?? [],
      };

      await updateVenue_v2(
        {
          name: venue.name,
          ...entranceData,
        },
        user
      );

      onSave();
    },
    [onSave, user, venue.name]
  );

  const codeOfConductInput = useDynamicInput(
    venue.code_of_conduct_questions?.length
  );
  const profileQuestionsInput = useDynamicInput(
    venue.profile_questions?.length
  );
  const entranceInput = useDynamicInput(venue.entrance?.length);

  const codeOfConductQuestions = rest.watch("code_of_conduct_questions") ?? [];
  const profileQuestions = rest.watch("profile_questions") ?? [];
  const entrance = rest.watch("entrance") ?? [];

  const hasCodeOfConduct = !!codeOfConductQuestions.length;
  const hasProfileQuestions = !!profileQuestions.length;
  const hasEntrance = !!entrance.length;

  return (
    <div className="entrance">
      <div className="entrance__form">
        <h1>Entrance Experience</h1>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <S.ItemWrapper>
            <S.ItemHeader>
              <S.ItemTitle>Code of conduct questions</S.ItemTitle>
            </S.ItemHeader>
            <S.ItemBody>
              <QuestionInput
                fieldName="code_of_conduct_questions"
                register={register}
                hasLink
                editing={venue.code_of_conduct_questions}
                errors={errors.code_of_conduct_questions}
                {...codeOfConductInput}
              />
            </S.ItemBody>
          </S.ItemWrapper>

          <S.ItemWrapper>
            <S.ItemHeader>
              <S.ItemTitle>Profile questions</S.ItemTitle>
            </S.ItemHeader>
            <S.ItemBody>
              <QuestionInput
                fieldName="profile_questions"
                register={register}
                editing={venue.profile_questions}
                errors={errors.profile_questions}
                {...profileQuestionsInput}
              />
            </S.ItemBody>
          </S.ItemWrapper>

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
                {...entranceInput}
              />
            </S.ItemBody>
          </S.ItemWrapper>

          <Button type="submit">Save</Button>
        </Form>
      </div>
      <div className="entrance__preview">
        {hasCodeOfConduct &&
          codeOfConductQuestions.map((question) => (
            <>
              <div>{question.name}</div>
              <div>{question.text}</div>
            </>
          ))}
        {hasProfileQuestions && (
          <>
            {profileQuestions.map((question) => (
              <>
                <div>{question.name}</div>
                <div>{question.text}</div>
              </>
            ))}
          </>
        )}
        {hasEntrance && <div>Entrance preview</div>}
      </div>
    </div>
  );
};

export default EntranceExperience;
