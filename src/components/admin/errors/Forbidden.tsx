import React from "react";
import * as TW from "components/admin/errors/BlankPage.tailwind";

import { BlankPage } from "./BlankPage";

export const Forbidden: React.FC = () => (
  <BlankPage>
    <h1 data-bem="Forbidden__title" data-side="adm" className={TW.title}>
      403 Not authorised
    </h1>
    <p data-bem="Forbidden__message" data-side="adm" className={TW.message}>
      You don’t have permission to access this page.
    </p>
  </BlankPage>
);
