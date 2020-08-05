import React, { useState } from "react";
import "./Venue.scss";
import { WizardPage } from "./VenueWizard";
import { VENUE_TEMPLATES, Template, TemplateType } from "settings";

const templateImageMap: Record<TemplateType, string> = {
  ZOOM_ROOM: "/venues/venue-zoom.jpg",
  ART_PIECE: "/venues/venue-art.jpg",
  PERFORMANCE_VENUE: "/venues/venue-performance.jpg",
  THEME_CAMP: "/venues/venue-camp.jpg",
  ART_CAR: "/venues/venue-artcar.jpg",
};

const templateThumbImageMap: Record<TemplateType, string> = {
  ZOOM_ROOM: "/venues/pickspace-thumbnail_zoom.png",
  ART_PIECE: "/venues/pickspace-thumbnail_art.png",
  PERFORMANCE_VENUE: "/venues/pickspace-thumbnail_performance.png",
  THEME_CAMP: "/venues/pickspace-thumbnail_camp.png",
  ART_CAR: "/venues/pickspace-thumbnail_artcar.png",
};

export const TemplateForm: React.FC<WizardPage> = ({ next, state }) => {
  const [selectedTemplate, setSelectedTemplate] = useState<
    Template | undefined
  >(state.templatePage?.template);
  return (
    <div className="page">
      <div className="page-side">
        <div className="page-container-left">
          <div className="page-container-left-content">
            <TemplateFormLeft
              selectedTemplate={selectedTemplate}
              setSelectedTemplate={setSelectedTemplate}
              next={next}
            />
          </div>
        </div>
      </div>
      <div className="page-side">
        {selectedTemplate && (
          <img
            src={templateImageMap[selectedTemplate.type]}
            alt="venue"
            className="venue-art"
          />
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
          {VENUE_TEMPLATES.map((template) => (
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

const TemplateCard: React.FC<TemplateCardProps> = (props) => {
  const {
    template: { type, name, description },
    onClick,
    selected,
  } = props;
  return (
    <div
      className={`pickspace-component-container pickspace-component-container_zoom ${
        selected ? "selected" : ""
      }`}
      onClick={onClick}
    >
      <div className="centered-flex">
        <div className="pickspace-thumbnail">
          <img src={templateThumbImageMap[type]} alt="venue thumb" />
        </div>
        <div className="flex-one">
          <h3>{name}</h3>
          <ul>
            {description.map((bullet, idx) => (
              <li key={idx}>{bullet}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
