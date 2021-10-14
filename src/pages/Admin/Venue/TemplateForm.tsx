import React, { useState } from "react";

import { BURN_VENUE_TEMPLATES, Template } from "settings";

import { VenueTemplate } from "types/venues";

import { WizardPage } from "./VenueWizard";

import "./Venue.scss";

// @debt Refactor this constant into settings, or types/templates, or similar?
const templateImageMap: Record<VenueTemplate, string | undefined> = {
  [VenueTemplate.zoomroom]: "/venues/experience.png",
  [VenueTemplate.artpiece]: "/venues/art-piece.png",
  [VenueTemplate.jazzbar]: "/venues/music-venue.png",
  [VenueTemplate.partymap]: "/venues/party-map.png",
  [VenueTemplate.animatemap]: "/venues/animate-map.png",
  [VenueTemplate.conversationspace]: "/venues/conversation-space.png",
  [VenueTemplate.firebarrel]: "/venues/fire-barrel.png",
  [VenueTemplate.embeddable]: "/venues/embeddable.jpg",
  [VenueTemplate.auditorium]: "/venues/new-auditorium.png",
  [VenueTemplate.posterhall]: undefined,
  [VenueTemplate.posterpage]: undefined,
  [VenueTemplate.screeningroom]: "/venues/screening-room.png",
  [VenueTemplate.viewingwindow]: "/venues/viewing-window.png",

  // Legacy
  [VenueTemplate.artcar]: "/venues/venue-artcar.jpg",
  [VenueTemplate.audience]: "/venues/auditorium.png",
  [VenueTemplate.avatargrid]: undefined,
  [VenueTemplate.friendship]: undefined,
  [VenueTemplate.performancevenue]: "/venues/venue-performance.jpg",
  [VenueTemplate.preplaya]: undefined,
  [VenueTemplate.playa]: undefined,
  [VenueTemplate.themecamp]: "/venues/venue-camp.jpg",
};

// @debt Refactor this constant into settings, or types/templates, or similar?
const templateThumbImageMap: Record<VenueTemplate, string | undefined> = {
  [VenueTemplate.zoomroom]: "/venues/pickspace-thumbnail_zoomroom.png",
  [VenueTemplate.artpiece]: "/venues/pickspace-thumbnail_art.png",
  [VenueTemplate.jazzbar]: "/venues/pickspace-thumbnail_bar.png",
  [VenueTemplate.partymap]: "/venues/pickspace-thumbnail_map.png",
  [VenueTemplate.animatemap]: "/venues/pickspace-thumbnail_map.png",
  [VenueTemplate.conversationspace]:
    "/venues/pickspace-thumbnail_conversation.png",
  [VenueTemplate.firebarrel]: "/venues/pickspace-thumbnail_camp.png",
  [VenueTemplate.embeddable]: "/venues/pickspace-thumbnail_art.png",
  [VenueTemplate.auditorium]: "/venues/pickspace-thumbnail_auditorium.png",
  [VenueTemplate.posterhall]: undefined,
  [VenueTemplate.posterpage]: undefined,
  [VenueTemplate.screeningroom]: undefined,
  [VenueTemplate.viewingwindow]:
    "/venues/pickspace-thumbnail_viewing-window.png",

  // Legacy
  [VenueTemplate.artcar]: "/venues/pickspace-thumbnail_artcar.png",
  [VenueTemplate.audience]: "/venues/pickspace-thumbnail_auditorium.png",
  [VenueTemplate.avatargrid]: undefined,
  [VenueTemplate.friendship]: undefined,
  [VenueTemplate.performancevenue]:
    "/venues/pickspace-thumbnail_performance.png",
  [VenueTemplate.preplaya]: undefined,
  [VenueTemplate.playa]: undefined,
  [VenueTemplate.themecamp]: "/venues/pickspace-thumbnail_camp.png",
};

export const TemplateForm: React.FC<WizardPage> = ({ next, state }) => {
  const [selectedTemplate, setSelectedTemplate] = useState<
    Template | undefined
  >(state.templatePage?.template);

  const templateImage = selectedTemplate
    ? templateImageMap[selectedTemplate.template]
    : undefined;
  const hasTemplateImage = !!templateImage;

  return (
    <div className="page">
      <div className="page-side">
        <div className="page-container-left">
          <div
            className="page-container-left-content"
            style={{ maxWidth: "680px" }}
          >
            <TemplateFormLeft
              selectedTemplate={selectedTemplate}
              setSelectedTemplate={setSelectedTemplate}
              next={next}
            />
          </div>
        </div>
      </div>
      <div className="page-side">
        {hasTemplateImage && (
          <img src={templateImage} alt="venue" className="venue-art" />
        )}
      </div>
    </div>
  );
};

interface TemplateFormLeftProps {
  selectedTemplate?: Template;
  setSelectedTemplate: (t: Template) => void;
  next: WizardPage["next"];
}

const TemplateFormLeft: React.FC<TemplateFormLeftProps> = (props) => {
  const { selectedTemplate, setSelectedTemplate, next } = props;
  return (
    <>
      <div className="scrollable-content">
        <h4 className="italic">What kind of space would you like to create?</h4>
        <div className="templates-container">
          {BURN_VENUE_TEMPLATES.map((template) => (
            <TemplateCard
              selected={template.name === selectedTemplate?.name}
              key={template.name}
              template={template}
              onClick={() => setSelectedTemplate(template)}
            />
          ))}
        </div>
      </div>
      <div className="page-container-left-bottombar">
        <div />
        <button
          disabled={!selectedTemplate}
          className={`btn btn-primary ${!selectedTemplate ? "disabled" : ""}`}
          onClick={() =>
            selectedTemplate &&
            next &&
            next({ type: "SUBMIT_TEMPLATE_PAGE", payload: selectedTemplate })
          }
        >
          Create your space
        </button>
      </div>
    </>
  );
};

interface TemplateCardProps {
  selected: boolean;
  template: Template;
  onClick: () => void;
}

const TemplateCard: React.FC<TemplateCardProps> = ({
  template: { template, name, description },
  onClick,
  selected,
}) => {
  const thumbnailImage = templateThumbImageMap[template];
  const hasThumbnail = !!thumbnailImage;

  return (
    <div
      className={`pickspace-component-container pickspace-component-container_zoom ${
        selected ? "selected" : ""
      }`}
      onClick={onClick}
    >
      <div className="centered-flex">
        <div className="pickspace-thumbnail">
          {hasThumbnail && <img src={thumbnailImage} alt="venue thumb" />}
        </div>
        <div className="flex-one">
          <h3>{name}</h3>
          {description.length === 1 ? (
            <div>{description[0]}</div>
          ) : (
            <ul>
              {description.map((bullet, idx) => (
                <li key={idx}>{bullet}</li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};
