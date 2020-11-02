import React, {
  useCallback,
  useMemo,
  useEffect,
  useState,
  useRef,
  useReducer,
} from "react";
import "firebase/functions";

// Components
import DetailsForm from "./Form";
import DetailsPreview from "./Preview";

// Utils | Settings | Constants | Helpers
import {
  createUrlSafeName,
  createVenue,
  updateVenue,
  VenueInput,
} from "api/admin";

// Hooks
import { useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";
import { useUser } from "hooks/useUser";

// Types
import { FormValues } from "./Details.types";

// Validation Schemas
import {
  editVenueCastSchema,
  validationSchema,
} from "../Venue/DetailsValidationSchema";

// Reducer
import { initialState, VenueWizardReducer } from "pages/Admin/Venue/VenueWizard/redux";

// Styles
import "../Venue/Venue.scss";
import * as S from './Details.styles';

interface DetailsProps {
  previous?: () => void;
  venueId?: string;
}

const Details: React.FC<DetailsProps> = ({
  previous,
  venueId,
}) => {
  const [state, dispatch] = useReducer(VenueWizardReducer, initialState);
  const defaultValues = useMemo(
    () =>
      !!venueId
        ? editVenueCastSchema.cast(state.detailsPage?.venue)
        : validationSchema.cast(),
    [state.detailsPage, venueId]
  );

  const { watch, formState, register, setValue, ...rest } = useForm<FormValues>(
    {
      mode: "onSubmit",
      reValidateMode: "onChange",
      validationSchema: validationSchema,
      validationContext: {
        template: state.templatePage?.template,
        editing: !!venueId,
      },
      defaultValues,
    }
  );

  const { user } = useUser();
  const history = useHistory();
  const { isSubmitting } = formState;
  const values = watch();

  const [formError, setFormError] = useState(false);

  // register the icon position data
  useEffect(() => {
    register("placement");
  }, [register]);

  const placementDivRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const clientWidth = placementDivRef.current?.clientWidth ?? 0;
    const clientHeight = placementDivRef.current?.clientHeight ?? 0;

    placementDivRef.current?.scrollTo(
      (state.detailsPage?.venue?.placement?.x ?? 0) - clientWidth / 2,
      (state.detailsPage?.venue?.placement?.y ?? 0) - clientHeight / 2
    );
  }, [state.detailsPage]);

  const onSubmit = useCallback(
    async (vals: Partial<FormValues>) => {
      if (!user) return;
      try {
        // unfortunately the typing is off for react-hook-forms.
        if (!!venueId) await updateVenue(vals as VenueInput, user);
        else await createVenue(vals as VenueInput, user);

        vals.name
          ? history.push(`/admin/venue/${createUrlSafeName(vals.name)}`)
          : history.push(`/admin`);
      } catch (e) {
        setFormError(true);
        console.error(e);
      }
    },
    [user, venueId, history]
  );

  const onFormSubmit = rest.handleSubmit(onSubmit);

  // return (
  //   <div className="page">
  //     <div className="page-side">
  //       <div className="page-container-left">
  //         <div
  //           className="page-container-left-content"
  //           style={{ maxWidth: "680px" }}
  //         >

  //         </div>
  //       </div>
  //     </div>
  //   </div>
  // );
  return (
    <S.DetailsContainer>
      <S.DetailsFormWrapper>

        <DetailsForm
          setValue={setValue}
          state={state}
          previous={previous}
          values={values}
          isSubmitting={isSubmitting}
          register={register}
          watch={watch}
          onSubmit={onFormSubmit}
          editing={!!venueId}
          formError={formError}
          dispatch={dispatch}
          {...rest}
        />
      </S.DetailsFormWrapper>

      <S.PreviewWrapper>
        <DetailsPreview
          bannerURL={state?.bannerURL}
          logoURL={state?.squareLogoURL}
          name={values?.name}
          subtitle={values?.subtitle}
          description={values?.description}
        />
      </S.PreviewWrapper>
    </S.DetailsContainer>
  )
};

export default Details;
