import { DesignVersionContext } from "hooks/useDesignVersion";

import "scss/global.scss";

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
};

export const globalTypes = {
  designVersion: {
    name: "Design version",
    description: "Design version to be used for rendering",
    defaultValue: "disco",
    toolbar: {
      icon: "flag",
      // Array of plain string values or MenuItem shape (see below)
      items: ["disco", "original"],
      // Property that specifies if the name of the item will be displayed
      showName: true,
    },
  },
};

export const decorators = [
  (Story, context) => (
    <DesignVersionContext.Provider value={context.globals.designVersion}>
      <Story />
    </DesignVersionContext.Provider>
  ),
];
