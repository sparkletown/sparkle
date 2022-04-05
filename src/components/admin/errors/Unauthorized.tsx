import React from "react";
import { BlankPage } from "components/admin/errors/BlankPage";
import * as TW from "components/admin/errors/BlankPage.tailwind";

export const Unauthorized: React.FC = () => (
  <BlankPage>
    <h1 data-bem="Unauthorized__title" data-side="adm" className={TW.title}>
      401 Not authenticated
    </h1>
    <p data-bem="Unauthorized__message" data-side="adm" className={TW.message}>
      Please navigate to an URL that contains world and space slugs.
    </p>
  </BlankPage>
);
