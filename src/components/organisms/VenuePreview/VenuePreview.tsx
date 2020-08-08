import React, { useMemo, useCallback } from "react";
import { Venue } from "types/Venue";
import { VenueTemplate } from "types/VenueTemplate";

interface VenuePreviewProps {
  values: FormValues;
  templateName?: string;
  state: WizardPage["state"];
}

export const VenuePreview: React.FC<VenuePreviewProps> = ({
  values,
  state,
  templateName,
}) => {
  const urlFromImage = useCallback((filesOrUrl?: FileList | string) => {
    if (typeof filesOrUrl === "string") return filesOrUrl;
    return filesOrUrl && filesOrUrl.length > 0
      ? URL.createObjectURL(filesOrUrl[0])
      : undefined;
  }, []);

  const remoteBannerImageUrl =
    state.detailsPage?.venue.config.landingPageConfig.coverImageUrl;
  const remoteLogoImageUrl = state.detailsPage?.venue.host.icon;

  const previewVenue: Venue = useMemo(
    () => ({
      template: VenueTemplate.jazzbar,
      name: values.name || `My ${templateName} name`,
      config: {
        theme: venueDefaults.config.theme,
        landingPageConfig: {
          coverImageUrl:
            urlFromImage(values.bannerImageFile) ??
            remoteBannerImageUrl ??
            venueDefaults.config.landingPageConfig.coverImageUrl,
          subtitle:
            values.tagline || venueDefaults.config.landingPageConfig.subtitle,
          description:
            values.longDescription ||
            venueDefaults.config.landingPageConfig.description,
          presentation: [],
          checkList: [],
          joinButtonText: venueDefaults.config.landingPageConfig.joinButtonText,
          quotations: [],
        },
      },
      host: {
        icon:
          urlFromImage(values.logoImageFile) ??
          remoteLogoImageUrl ??
          venueDefaults.host.icon,
      },
      owners: [],
      profile_questions:
        values.profileQuestions ?? venueDefaults.profile_questions,
      code_of_conduct_questions: venueDefaults.code_of_conduct_questions,
    }),
    [
      values,
      urlFromImage,
      remoteBannerImageUrl,
      remoteLogoImageUrl,
      templateName,
    ]
  );

  return (
    <div className="venue-preview">
      <EntranceExperiencePreviewProvider
        venueRequestStatus
        venue={previewVenue}
      />
    </div>
  );
};
