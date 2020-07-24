import React from "react";
import { useSelector } from "react-redux";
import "bootstrap";
import { leaveRoom } from "utils/useLocationUpdateEffect";
import VenueRouter from "components/venues/VenueRouter";

export default function App(props) {
  const { user } = useSelector((state) => ({
    user: state.user,
  }));

  window.onbeforeunload = () => {
    if (user) {
      leaveRoom(user);
    }
  };

  return <VenueRouter />;
}
