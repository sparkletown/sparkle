import React from "react";
import classNames from "classnames";

import { HIDDEN_BURN_VENUE_TEMPLATES, Template } from "settings";

import "./TemplateCard.scss";

export interface TemplateCardProps {
  selected: boolean;
  template: Template;
  onClick: () => void;
  thumbnail?: string;
}

export const TemplateCard: React.FC<TemplateCardProps> = ({
  template: { template, name, description },
  onClick,
  selected,
  thumbnail,
}) => {
  const containerClass = classNames({
    TemplateCard: true,
    // To help with "...so that a savvy admin can still create said venues..." @see https://github.com/sparkletown/internal-sparkle-issues/issues/1075#issue-974665804
    [`TemplateCard__${template}`]: template,
    "TemplateCard--hidden": HIDDEN_BURN_VENUE_TEMPLATES.includes(template),
    "TemplateCard--selected": selected,
  });

  return (
    <div className={containerClass} onClick={onClick}>
      <div className="TemplateCard__thumbnail-wrapper">
        <div className="TemplateCard__thumbnail">
          {thumbnail && <img src={thumbnail} alt="venue thumb" />}
        </div>
        <div className="TemplateCard__description">
          <h3>{name}</h3>
          {description.length === 1 ? (
            <div>{description[0]}</div>
          ) : (
            <ul>
              {description.map((bullet, key) => (
                <li key={key}>{bullet}</li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};
