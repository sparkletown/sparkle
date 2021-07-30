import React from "react";

import InformationCard from "components/molecules/InformationCard";
import { InformationLeftColumn } from "components/organisms/InformationLeftColumn";

import { useSelector } from "hooks/useSelector";

import { currentVenueSelectorData } from "utils/selectors";

import { RenderMarkdown } from "components/organisms/RenderMarkdown";

import "./JazzBarSkeletonPage.scss";

interface PropsType {
  children: React.ReactNode;
}

const JazzBarSkeletonPage: React.FunctionComponent<PropsType> = ({
  children,
}) => {
  const venue = useSelector(currentVenueSelectorData);

  return (
    <div className="jazz-bar-container">
      <InformationLeftColumn iconNameOrPath={venue?.host?.icon}>
        <InformationCard title="About the venue">
          <p>
            {venue?.name ? (
              venue.name
            ) : (
              <>
                Kansas Smitty’s
                <br />
                It&apos;s a band and it&apos;s a bar.
              </>
            )}
          </p>

          <p>
            {venue?.config?.landingPageConfig.subtitle
              ? venue.config.landingPageConfig.subtitle
              : "Choose your table, invite your friends to join you and listen to the sounds of our House band."}
          </p>
          {venue?.config?.landingPageConfig.description ? (
            <RenderMarkdown
              text={venue.config?.landingPageConfig.description}
            />
          ) : (
            <>
              <p>
                Saturdays at Kansas Smitty&apos;s have always been about having
                a great time. The band for this evenings performance features
                Giacomo Smith on clarinet and alto, Ferg Ireland on double bass,
                Joe Webb on piano, Alec Harper on tenor sax and Will Cleasby on
                drums.
              </p>
              <p>Performing tonight at Kansas Smitty&apos;s:</p>
              <ul>
                <li>Giacomo Smith - alto/clarinet</li>
                <li>Ferg Ireland - Double Bass</li>
                <li>Joe Webb - Piano</li>
                <li>Alec harper - Tenor Sax</li>
                <li>Will Cleasby - Drums</li>
              </ul>
              <p>
                If you enjoy the music why not join the Patreon community. Our
                Patreons get access to all sorts of additional musical content
                and updates on all new shows, performances and events we run.
                https://www.patreon.com/kansassmittys
              </p>
              <p>
                Kansas Smitty&apos;s have just released their new album
                &apos;Things Happened Here&apos; available on all good streaming
                platforms and vinyl/CD
                https://ever-records.lnk.to/ThingsHappenedHere
              </p>
              <p>We&apos;ll see you in the bar...</p>
            </>
          )}
        </InformationCard>
      </InformationLeftColumn>
      {children}
    </div>
  );
};

export default JazzBarSkeletonPage;
