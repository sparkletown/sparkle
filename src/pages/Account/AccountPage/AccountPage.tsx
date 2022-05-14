import React from "react";

import { UserWithId } from "types/id";

import styles from "./AccountPage.module.scss";

type AccountPageProps = {
  user: UserWithId;
};

export const AccountPage: React.FC<AccountPageProps> = ({ user }) => {
  return (
    <div className={styles.Container}>
      <h1>Here is a list of onboarded worlds:</h1>
    </div>
  );
};
