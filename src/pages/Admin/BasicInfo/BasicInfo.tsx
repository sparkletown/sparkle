import React from "react";
import { Button, Form } from "react-bootstrap";

import { useForm } from "react-hook-form";
import { Venue_v2 } from "types/venues";
import * as S from "../Admin.styles";

import ImageInput from "components/atoms/ImageInput";
import { useUser } from "hooks/useUser";
import { updateVenue_v2 } from "api/admin";
import { validationSchema_v2 } from "../Details/ValidationSchema";
import { FormValues } from "../Venue/DetailsForm";

interface BasicInfoProps {
  venue: Venue_v2;
  onSave: () => void;
}

const BasicInfo: React.FC<BasicInfoProps> = ({ venue, onSave }) => {
  const {
    formState: { isSubmitting },
    register,
    errors,
    handleSubmit,
  } = useForm<FormValues>({
    mode: "onSubmit",
    reValidateMode: "onChange",
    validationSchema: validationSchema_v2,
    validationContext: {
      editing: true,
    },
    defaultValues: {
      name: venue.name,
      subtitle: venue.config.landingPageConfig.subtitle,
      description: venue.config.landingPageConfig.description,
    },
  });

  const { user } = useUser();

  const onSubmit = (data: FormValues) => {
    if (!user) return;

    updateVenue_v2(
      {
        name: data.name!,
        ...data,
      },
      user
    );

    onSave();
  };

  const renderNameInput = () => (
    <S.ItemWrapper>
      <S.ItemHeader>
        <S.TitleWrapper>
          <S.ItemTitle>Party name</S.ItemTitle>
        </S.TitleWrapper>
      </S.ItemHeader>

      <S.ItemBody>
        <Form.Control name="name" ref={register} custom type="text" disabled />
        {errors.name && (
          <span className="input-error">{errors.name.message}</span>
        )}
      </S.ItemBody>
    </S.ItemWrapper>
  );

  const renderSubtitleInput = () => (
    <S.ItemWrapper>
      <S.ItemHeader>
        <S.TitleWrapper>
          <S.ItemTitle>Party subtitle</S.ItemTitle>
        </S.TitleWrapper>
      </S.ItemHeader>

      <S.ItemBody>
        <Form.Control
          name="subtitle"
          placeholder="Enter your party subtitle"
          ref={register}
          custom
          type="text"
        />
        {errors.subtitle && (
          <span className="input-error">{errors.subtitle.message}</span>
        )}
      </S.ItemBody>
    </S.ItemWrapper>
  );

  const renderDescriptionInput = () => (
    <S.ItemWrapper>
      <S.ItemHeader>
        <S.TitleWrapper>
          <S.ItemTitle>Party description</S.ItemTitle>
        </S.TitleWrapper>
      </S.ItemHeader>

      <S.ItemBody>
        <Form.Control
          name="description"
          placeholder="Enter your party description"
          ref={register}
          custom
          type="textarea"
        />
        {errors.description && (
          <span className="input-error">{errors.description.message}</span>
        )}
      </S.ItemBody>
    </S.ItemWrapper>
  );

  const renderBannerInput = () => (
    <S.ItemWrapper>
      <S.ItemHeader>
        <S.TitleWrapper>
          <S.ItemTitle>Upload a banner photo</S.ItemTitle>
        </S.TitleWrapper>
      </S.ItemHeader>

      <S.ItemBody>
        <ImageInput
          name="bannerImage"
          error={errors.bannerImageFile || errors.bannerImageUrl}
          forwardRef={register}
          imgUrl={venue.config.landingPageConfig.coverImageUrl}
        />
      </S.ItemBody>
    </S.ItemWrapper>
  );

  const renderLogoInput = () => (
    <S.ItemWrapper>
      <S.ItemHeader>
        <S.TitleWrapper>
          <S.ItemTitle>Upload a banner photo</S.ItemTitle>
        </S.TitleWrapper>
      </S.ItemHeader>

      <S.ItemBody>
        <ImageInput
          name="logoImage"
          error={errors.logoImageFile || errors.logoImageUrl}
          forwardRef={register}
          imgUrl={venue.host.icon}
        />
      </S.ItemBody>
    </S.ItemWrapper>
  );

  return (
    <div>
      <h1>Basic info</h1>

      <Form onSubmit={handleSubmit(onSubmit)}>
        {renderNameInput()}
        {renderSubtitleInput()}
        {renderDescriptionInput()}
        {renderBannerInput()}
        {renderLogoInput()}

        <Button disabled={isSubmitting} type="submit">
          Save
        </Button>
      </Form>
    </div>
  );
};

export default BasicInfo;
