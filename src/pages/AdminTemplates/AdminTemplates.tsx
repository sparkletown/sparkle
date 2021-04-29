import classNames from "classnames";
import React, { useState } from "react";

import { DEFAULT_MAP_BACKGROUND } from "settings";

import { Room } from "types/rooms";

import { PartyMapContainer } from "pages/Account/Venue/VenueMapEdition";

import "./AdminTemplates.scss";

interface TemplateType {
  title: string;
  description: string;
  background: string;
}

interface RecipeType {
  title: string;
  rooms: Room[];
}

const templates: TemplateType[] = [
  {
    title: "Title",
    description: "Description",
    background: DEFAULT_MAP_BACKGROUND,
  },
  {
    title: "Title",
    description: "Description",
    background: DEFAULT_MAP_BACKGROUND,
  },
  {
    title: "Title",
    description: "Description",
    background: DEFAULT_MAP_BACKGROUND,
  },
  {
    title: "Title",
    description: "Description",
    background: DEFAULT_MAP_BACKGROUND,
  },
];

const recipes: RecipeType[] = [
  { title: "Recipe 1", rooms: [] },
  { title: "Recipe 2", rooms: [] },
  { title: "Recipe 3", rooms: [] },
  { title: "Blank Canvas", rooms: [] },
];

export const AdminTemplates: React.FC = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateType>();
  const [selectedRecipe, setSelectedRecipe] = useState<RecipeType>(recipes[0]);
  const [isLoading, setLoading] = useState<boolean>(false);

  const selectTemplate = (template: TemplateType) => {
    if (isLoading) return;

    setLoading(true);

    setTimeout(() => {
      setSelectedTemplate(template);
      setLoading(false);
    }, 2000);
  };

  return (
    <div className="templates-page">
      {selectedTemplate && (
        <>
          <div className="templates-page__nav-buttons">
            <button
              className="templates-page__nav-buttons--cancel"
              onClick={() => setSelectedTemplate(undefined)}
            >
              Back to the templates
            </button>
            <button
              className="templates-page__nav-buttons--confirm"
              onClick={() => console.log("asd")}
            >
              Choose this template
            </button>
          </div>
          <div className="templates-page__title">{selectedTemplate.title}</div>
          <div className="templates-page__subtitle">
            {selectedTemplate.description}
          </div>
          <div className="templates-page__recipes">
            {recipes.map((recipe, index) => (
              <button
                key={`${recipe.title}-${index}`}
                onClick={() => setSelectedRecipe(recipe)}
                className={classNames("templates-page__recipe", {
                  "templates-page__recipe--selected": recipe === selectedRecipe,
                })}
              >
                {recipe.title}
              </button>
            ))}
          </div>
          <div className="templates-page__template-preview">
            <PartyMapContainer
              rooms={[]}
              iconsMap={{}}
              coordinatesBoundary={{ width: 60, height: 60 }}
              interactive={false}
              resizable={false}
              backgroundImage={selectedTemplate.background}
            />
          </div>
        </>
      )}
      {!selectedTemplate && (
        <>
          <div className="templates-page__title">Choose a Template</div>
          <div className="templates-page__subtitle">
            You can edit it during the next steps
          </div>
          <button
            disabled={isLoading}
            className={classNames("templates-page__header-button", {
              "templates-page__header-button--disabled": isLoading,
            })}
          >{`I'd rather start from scratch`}</button>
          <div className="templates-page__templates-section">
            {templates.map((template, index) => (
              <div
                key={`${template.title}-${index}`}
                className={classNames("templates-page__template", {
                  "templates-page__template--disabled": isLoading,
                })}
                onClick={() => selectTemplate(template)}
              >
                <div
                  style={{ backgroundImage: `url(${template.background})` }}
                  className="templates-page__template-background"
                />
                <div className="templates-page__template-title">
                  {template.title}
                </div>
                <div className="templates-page__template-description">
                  {template.description}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};
