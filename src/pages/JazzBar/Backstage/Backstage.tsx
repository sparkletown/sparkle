import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useFirebase } from "react-redux-firebase";

import Room from "./components/Room";
import "./Backstage.scss";

const ROOM_NAME = "jazz-backstage";

const Backstage = () => {
  const { user, users } = useSelector((state: any) => ({
    user: state.user,
    users: state.firestore.data.users,
  }));
  const [token, setToken] = useState<string>();
  const firebase = useFirebase();

  useEffect(() => {
    (async () => {
      if (!user || !users) return;

      // @ts-ignore
      const getToken = firebase.functions().httpsCallable("video-getToken");
      const response = await getToken({
        identity: users[user.uid]?.partyName ?? "M",
        room: ROOM_NAME,
      });
      setToken(response.data.token);
    })();
  }, [user, users]);

  return (
    <div className="backstage">
      {token && <Room roomName={ROOM_NAME} token={token} />}
    </div>
  );
};

export default Backstage;
