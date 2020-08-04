import React, { useCallback } from "react";
import { useForm } from "react-hook-form";
import "firebase/functions";
import { useUser } from "hooks/useUser";
import { VenueInput, createUrlSafeName, createVenue } from "api/admin";
import { WizardPage } from "./VenueWizard";
import "./Venue.scss";
import * as Yup from "yup";
import { ImageInput } from "components/molecules/ImageInput";
import { validationSchema } from "./DetailsValidationSchema";
import { Accordion, useAccordionToggle } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown } from "@fortawesome/free-solid-svg-icons";

const LONG_DESCRIPTION_PLACEHOLDER =
  "Describe what is unique and wonderful and sparkling about your venue";

export const DetailsForm: React.FC<WizardPage> = ({ previous, state }) => {
  const { register, handleSubmit, errors, watch, formState } = useForm<
    Partial<Yup.InferType<typeof validationSchema>> // bad typing. If not partial, react-hook-forms should force defaultValues to conform to FormInputs but it doesn't
  >({
    mode: "onSubmit",
    reValidateMode: "onChange",
    validationSchema,
    validationContext: state.templatePage,
    defaultValues: {},
  });
  const { user } = useUser();
  const { isSubmitting } = formState;
  const values = watch();
  const onSubmit = useCallback(
    async (vals: Partial<VenueInput>) => {
      if (!user) return;
      const values = vals as VenueInput; // unfortunately the typing is off for react-hook-forms.
      try {
        await createVenue(values, user);
      } catch (e) {
        console.error(e);
      }
    },
    [user]
  );

  if (!state.templatePage) previous && previous();

  // would be nice to access this from the form context but can't find a way
  const isNonMapTemplate =
    state.templatePage?.template.type === "ZOOM_ROOM" ||
    state.templatePage?.template.type === "PERFORMANCE_VENUE";

  const urlSafeName = values.name ? createUrlSafeName(values.name) : undefined;
  const disable = isSubmitting;

  return (
    <div id="admin-venue" className="container form-container">
      <h3 className="title">
        Create your space in{" "}
        <span className="title-adornment">The Sparkleverse</span>
      </h3>
      <form className="form" onSubmit={handleSubmit(onSubmit)}>
        <div className="input-container">
          <div className="input-title">Name your space</div>
          <input
            disabled={disable}
            name="name"
            ref={register}
            className="wide-input-block"
            placeholder="This can't be changed in the future"
          />
          {errors.name ? (
            <span className="input-error">{errors.name.message}</span>
          ) : (
            <div className="input-subtext">
              {`The URL of your space will be: ${urlSafeName}`}
            </div>
          )}
        </div>
        {isNonMapTemplate && (
          <div className="input-container">
            <div className="input-title">
              {`Choose how you'd like your venue to appear on the map`}
            </div>
            <ImageInput
              disabled={disable}
              name={"mapIconImageFile"}
              containerClassName="input-square-container"
              imageClassName="input-square-image"
              image={values.mapIconImageFile}
              ref={register}
              error={errors.mapIconImageFile}
            />
          </div>
        )}
        <div className="input-container">
          <div className="input-title">Upload a banner page photo</div>
          <ImageInput
            disabled={disable}
            name={"bannerImageFile"}
            image={values.bannerImageFile}
            ref={register}
            error={errors.bannerImageFile}
          />
        </div>
        <div className="input-container">
          <div className="input-title">Upload a square logo</div>
          <ImageInput
            disabled={disable}
            ref={register}
            image={values.logoImageFile}
            name={"logoImageFile"}
            containerClassName="input-square-container"
            imageClassName="input-square-image"
            error={errors.logoImageFile}
          />
        </div>
        <div className="input-container">
          <div className="input-title">Tagline</div>
          <input
            disabled={disable}
            name={"tagline"}
            ref={register}
            className="wide-input-block"
            placeholder="Briefly say what people will find here"
          />
          {errors.tagline && (
            <span className="input-error">{errors.tagline.message}</span>
          )}
        </div>
        <div className="input-container">
          <div className="input-title">Long description</div>
          <textarea
            disabled={disable}
            name={"longDescription"}
            ref={register}
            className="wide-input-block input-centered align-left"
            placeholder={LONG_DESCRIPTION_PLACEHOLDER}
          />
          {errors.longDescription && (
            <span className="input-error">
              {errors.longDescription.message}
            </span>
          )}
        </div>
        <Accordion>
          <AccordionButton eventKey="0" />
          <Accordion.Collapse eventKey="0">
            <div>ello</div>
          </Accordion.Collapse>
        </Accordion>
        <div className="between-flex input-container">
          <div className="wizard-nav-button">
            <button className="btn btn-primary nav-btn" onClick={previous}>
              Go Back
            </button>
          </div>
          <div>
            <SubmitButton isSubmitting={isSubmitting} />
          </div>
        </div>
      </form>
    </div>
  );
};

interface AccordionButtonProps {
  eventKey: string;
}

const AccordionButton: React.FC<AccordionButtonProps> = ({ eventKey }) => {
  const decoratedOnClick = useAccordionToggle(eventKey, () => {});
  return (
    <div className="advanced-toggle centered-flex" onClick={decoratedOnClick}>
      <FontAwesomeIcon icon={faCaretDown} size="lg" />
      <span className="toggle-title">Advanced Options</span>
    </div>
  );
};

interface SubmitButtonProps {
  isSubmitting: boolean;
}

const SubmitButton: React.FC<SubmitButtonProps> = ({ isSubmitting }) => {
  return isSubmitting ? (
    <div className="spinner-border">
      <span className="sr-only">Loading...</span>
    </div>
  ) : (
    <input className="btn btn-primary" type="submit" value="Create venue" />
  );
};
