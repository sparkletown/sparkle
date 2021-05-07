import classNames from "classnames";
import React, { useState } from "react";
import { useParams } from "react-router";

import { updateVenue_v2 } from "api/admin";

import { DEFAULT_MAP_BACKGROUND, DEFAULT_MAP_ICON_URL } from "settings";

import { Room, RoomData_v2, RoomTypes } from "types/rooms";
import { VenueTemplate } from "types/venues";

import { useUser } from "hooks/useUser";
import { useConnectCurrentVenueNG } from "hooks/useConnectCurrentVenueNG";

import { PartyMapContainer } from "pages/Account/Venue/VenueMapEdition";

import "./AdminTemplates.scss";

interface TemplateType {
  title: string;
  description: string;
  background: string;
}

interface RecipeType {
  title: string;
  rooms: RoomData_v2[];
}

const templates: TemplateType[] = [
  {
    title: "Template 1",
    description: "Description 1",
    background: DEFAULT_MAP_BACKGROUND,
  },
  {
    title: "Template 2",
    description: "Description 2",
    background: DEFAULT_MAP_BACKGROUND,
  },
  {
    title: "Template 3",
    description: "Description 3",
    background: DEFAULT_MAP_BACKGROUND,
  },
  {
    title: "Template 4",
    description: "Description 4",
    background: DEFAULT_MAP_BACKGROUND,
  },
];

const recipeRooms: RoomData_v2[] = [
  {
    type: RoomTypes.unclickable,
    template: VenueTemplate.jazzbar,
    isEnabled: true,
    url: window.location.host,
    title: "Jazzbar 1",
    image_url: DEFAULT_MAP_ICON_URL,
    x_percent: 10,
    y_percent: 10,
    width_percent: 100,
    height_percent: 100,
  },
  {
    type: RoomTypes.unclickable,
    isEnabled: true,
    url: window.location.host,
    title: "Room 1",
    description: "",
    image_url: DEFAULT_MAP_ICON_URL,
    x_percent: 20,
    y_percent: 10,
    width_percent: 100,
    height_percent: 100,
  },
];

const recipes: RecipeType[] = [
  { title: "Recipe 1", rooms: recipeRooms },
  { title: "Recipe 2", rooms: [] },
  { title: "Recipe 3", rooms: [] },
  { title: "Blank Canvas", rooms: [] },
];

export const AdminTemplates: React.FC = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateType>();
  const [selectedRecipe, setSelectedRecipe] = useState<RecipeType>(recipes[0]);
  const [isLoading, setLoading] = useState<boolean>(false);

  const { user } = useUser();
  const { venueId } = useParams<{ venueId: string }>();
  const { currentVenue: venue } = useConnectCurrentVenueNG(venueId);

  const selectTemplate = (template: TemplateType) => {
    if (isLoading) return;

    setLoading(true);

    setTimeout(() => {
      setSelectedTemplate(template);
      setLoading(false);
    }, 2000);
  };

  const chooseTemplate = async () => {
    if (!venue || !user) return;

    const venueInput = {
      name: venue.name,
      rooms: selectedRecipe.rooms,
    };

    setLoading(true);
    await updateVenue_v2(venueInput, user)
      .then(() => {
        //TODO: Redirect
      })
      .catch((e) => {
        //TODO: Handle error and UX
      })
      .finally(() => {
        setLoading(false);
      });
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
              onClick={chooseTemplate}
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
              rooms={selectedRecipe.rooms as Room[]}
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
