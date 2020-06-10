import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import Room from "./components/Room";

const ROOM_NAME = "jazz-backstage";

const Backstage = () => {
  const { user, users } = useSelector((state: any) => ({
    user: state.user,
    users: state.firestore.data.users,
  }));
  const [token, setToken] = useState<string>();

  const handleLogout = () => alert("Logout");

  useEffect(() => {
    (async () => {
      if (!user || !users) return;

      const data = await fetch("/video/token", {
        method: "POST",
        body: JSON.stringify({
          identity: users[user.uid]?.partyName ?? "M",
          room: ROOM_NAME,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }).then((res) => res.json());
      setToken(data.token);
    })();
  }, [user, users]);

  return <>{token && <Room roomName={ROOM_NAME} token={token} />}</>;
};

export default Backstage;
