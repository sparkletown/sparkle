import React, { useEffect, useState } from "react";

// Components
import VenueHero from "components/molecules/VenueHero";
import { Button } from "components/atoms/Button/Button.styles";

// Pages
import BackgroundSelect from "pages/Admin/BackgroundSelect";

// Hooks

// Typings
import { VenueDetailsProps } from "./VenueDetails.types";

// Styles
import * as S from "./VenueDetails.styles";
import firebase from "firebase";

type Owner = {
  id: string;
  data: any;
  partyName: string;
  pictureUrl: string;
};

const VenueDetails: React.FC<VenueDetailsProps> = ({ venue }) => {
  const { name, owners } = venue;
  const {
    subtitle,
    description,
    coverImageUrl,
  } = venue.config.landingPageConfig;
  const { icon } = venue.host;
  const [ownersData, setOwnersData] = useState<Owner[]>([]);

  useEffect(() => {
    async function getOwnersData() {
      for (const owner of owners) {
        const user = (
          await firebase.functions().httpsCallable("venue-getOwnerData")({
            userId: owner,
          })
        ).data;

        setOwnersData((prevState) => [
          ...prevState,
          {
            id: owner,
            ...user,
          },
        ]);
      }
    }

    try {
      getOwnersData();
    } catch (error) {
      console.error(error);
    }
  }, [owners]);

  return (
    <S.Container>
      <S.Header>
        <VenueHero
          bannerImageUrl={coverImageUrl}
          logoImageUrl={icon}
          name={name}
          subtitle={subtitle}
          description={description}
          large
        />

        <S.HeaderActions>
          <Button gradient>Go to your space</Button>
          <Button>Preview landing page</Button>

          <S.AdminList>
            <S.AdminListTitle>Party admins</S.AdminListTitle>

            {ownersData &&
              ownersData.map((owner: Owner) => (
                <S.AdminItem key={owner.id}>
                  <S.AdminPicture backgroundImage={owner.pictureUrl} />
                  <S.AdminItemTitle>{owner.partyName}</S.AdminItemTitle>
                </S.AdminItem>
              ))}

            <span>Invite admin s</span>
          </S.AdminList>
        </S.HeaderActions>
      </S.Header>

      <S.Main>
        <BackgroundSelect venueName={name} />
      </S.Main>
    </S.Container>
  );
};

export default VenueDetails;
