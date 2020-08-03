import React, { useState } from "react";
import "./Venue.scss";
import { WizardPage } from "./VenueWizard";
import { VENUE_TEMPLATES, Template } from "settings";

export const TemplateForm: React.FC<WizardPage> = ({ next }) => {
  const [selectedTemplate, setSelectedTemplate] = useState<Template>();
  return (
    <div className="container form-container">
      <div className="title">Venue Template</div>
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
      <div className="centered-flex wizard-buttons-container">
        <button
          disabled={!selectedTemplate}
          className="btn btn-primary"
          onClick={next}
        >
          Go to your venue
        </button>
      </div>
    </div>
  );
};

interface TemplateCardProps {
  selected: boolean;
  template: Template;
  onClick: () => void;
}

const TemplateCard: React.FC<TemplateCardProps> = (props) => {
  const {
    template: { name, description },
    onClick,
    selected,
  } = props;
  return (
    <div
      className={`template-card ${selected ? "selected" : ""}`}
      onClick={onClick}
    >
      <h3 className="title">{name}</h3>
      <ul className="template-card-list">
        {description.map((bullet, idx) => (
          <li key={idx}>{bullet}</li>
        ))}
      </ul>
    </div>
  );
};
