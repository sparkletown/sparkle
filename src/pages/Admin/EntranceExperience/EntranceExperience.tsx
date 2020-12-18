import React from "react";
import EntranceInput from "pages/Admin/Venue/EntranceInput";
import QuestionInput from "pages/Admin/Venue/QuestionInput";

import * as S from "../Admin.styles";
import { useForm } from "react-hook-form";
import { Button, Form } from "react-bootstrap";

const EntranceExperience: React.FC<any> = ({ venue }) => {
  const {
    watch,
    formState: { dirty },
    register,
    handleSubmit,
  } = useForm<any>({
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: {
      code_of_conduct_questions: venue.code_of_conduct_questions,
      profile_questions: venue.profile_questions,
      entrance: venue.entrance,
    },
  });

  const values = watch();
  const onSubmit = () => console.log("- Submitting - ", values);

  return (
    <div>
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
            />
          </S.ItemBody>
        </S.ItemWrapper>

        <S.ItemWrapper>
          <S.ItemHeader>
            <S.ItemTitle>Venue Entrance</S.ItemTitle>
          </S.ItemHeader>
          <S.ItemBody>
            <EntranceInput register={register} fieldName="entrance" showTitle={false} />
          </S.ItemBody>
        </S.ItemWrapper>

        <Button type="submit" disabled={!dirty}>
          Save
        </Button>
      </Form>
    </div>
  );
};

export default EntranceExperience;
