import React from "react";

import { ATTENDEE_WORLD_SPLASH_URL } from "settings";

import { UserWithId } from "types/id";

import { generateUrl } from "utils/url";

import { useOnboardedWorlds } from "hooks/worlds/useOnboardedWorlds";

import styles from "./AccountPage.module.scss";

type AccountPageProps = {
  user: UserWithId;
};

export const AccountPage: React.FC<AccountPageProps> = ({ user }) => {
  const { onboardedWorlds, isLoading } = useOnboardedWorlds({
    userId: user.id,
  });

  const onboardedWorldsList = onboardedWorlds.map((onboardedWorld) => {
    const joinUrl = generateUrl({
      route: ATTENDEE_WORLD_SPLASH_URL,
      required: ["worldSlug"],
      params: { worldSlug: onboardedWorld.slug },
    });
    return (
      <h2 key={onboardedWorld.id}>
        <a href={joinUrl}>{onboardedWorld.name}</a>
      </h2>
    );
  });

  const hasOnbardedWorlds = onboardedWorldsList.length > 0;

  if (isLoading) {
    return <p>Loading worlds</p>;
  }

  return (
    <div className={styles.Container}>
      <h1>Here is a list of onboarded worlds:</h1>
      {hasOnbardedWorlds ? onboardedWorldsList : "No worlds was joined yet!"}
    </div>
  );
};
