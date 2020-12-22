import { updateVenue_v2 } from "api/admin";
import { useUser } from "hooks/useUser";
import React from "react";
import { Button, Form } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { Venue_v2_BasicInfo } from "types/Venue";
import * as Yup from "yup";

import { BasicInfoProps } from "./BasicInfo.types";

import * as S from "../Admin.styles";

const validationSchema = Yup.object().shape({
  bannerMessage: Yup.string(),
  attendeesTitle: Yup.string(),
  chatTitle: Yup.string(),
});

const BasicInfo: React.FC<BasicInfoProps> = ({ venue, onSave }) => {
  const {
    formState: { dirty, isSubmitting },
    register,
    errors,
    handleSubmit,
  } = useForm<Venue_v2_BasicInfo>({
    mode: "onSubmit",
    reValidateMode: "onChange",
    validationSchema,
    defaultValues: {
      bannerMessage: venue.bannerMessage,
      attendeesTitle: venue.attendeesTitle,
      chatTitle: venue.chatTitle,
    },
  });
  const { user } = useUser();

  const onSubmit = (data: Venue_v2_BasicInfo) => {
    if (!user) return;

    updateVenue_v2(
      {
        name: venue.name,
        ...data,
      },
      user
    );

    onSave();
  };

  const renderAnnouncementInput = () => (
    <S.ItemWrapper>
      <S.ItemHeader>
        <S.TitleWrapper>
          <S.ItemTitle>Venue announcement</S.ItemTitle>
        </S.TitleWrapper>
        <S.ItemSubtitle>
          Show an announcement in the venue (or leave blank for none)
        </S.ItemSubtitle>
      </S.ItemHeader>

      <S.ItemBody>
        <Form.Control
          name="bannerMessage"
          placeholder="Enter your announcement"
          ref={register}
          custom
          type="text"
        />
        {errors.bannerMessage && (
          <span className="input-error">{errors.bannerMessage.message}</span>
        )}
      </S.ItemBody>
    </S.ItemWrapper>
  );

  const renderAttendeesTitleInput = () => (
    <S.ItemWrapper>
      <S.ItemHeader>
        <S.TitleWrapper>
          <S.ItemTitle>Title of your venues attendees</S.ItemTitle>
        </S.TitleWrapper>
        <S.ItemSubtitle>
          For example: guests, attendees, partygoers.
        </S.ItemSubtitle>
      </S.ItemHeader>

      <S.ItemBody>
        <Form.Control
          name="attendeesTitle"
          placeholder="Attendees title"
          ref={register}
          custom
          type="text"
        />
        {errors.attendeesTitle && (
          <span className="input-error">{errors.attendeesTitle.message}</span>
        )}
      </S.ItemBody>
    </S.ItemWrapper>
  );

  const renderChatTitleInput = () => (
    <S.ItemWrapper>
      <S.ItemHeader>
        <S.TitleWrapper>
          <S.ItemTitle>Your venue type label</S.ItemTitle>
        </S.TitleWrapper>
        <S.ItemSubtitle>For example: Party, Event, Meeting</S.ItemSubtitle>
      </S.ItemHeader>

      <S.ItemBody>
        <Form.Control
          name="chatTitle"
          placeholder="Event label"
          ref={register}
          custom
          type="text"
        />
        {errors.chatTitle && (
          <span className="input-error">{errors.chatTitle.message}</span>
        )}
      </S.ItemBody>
    </S.ItemWrapper>
  );

  return (
    <div>
      <h1>BasicInfo</h1>

      <Form onSubmit={handleSubmit(onSubmit)}>
        {renderAnnouncementInput()}
        {renderAttendeesTitleInput()}
        {renderChatTitleInput()}

        <Button type="submit" disabled={!dirty || isSubmitting}>
          Save
        </Button>
      </Form>
    </div>
  );
};

export default BasicInfo;
