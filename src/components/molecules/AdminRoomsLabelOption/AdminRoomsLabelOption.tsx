import React, { useCallback, useState, useEffect } from "react";
import "./AdminRoomsLabelOption.scss";
export interface AdminRoomsLabelOptionPropsType {
  item: {
    title: string;
    value: string;
    image: string;
  };
  optionSelected: boolean;
  enableLabelOption: () => void;
}

export const AdminRoomsLabelOption: React.FunctionComponent<AdminRoomsLabelOptionPropsType> = ({
  item,
  optionSelected,
  enableLabelOption,
}) => {
  const [selected, setSelected] = useState(false);

  useEffect(() => {
    console.log("ermia");
    setSelected(optionSelected);
  }, [optionSelected]);

  const handleLabelOptionSelection = useCallback(() => {
    setSelected(true);
    enableLabelOption();
    // setVolume(volume);
  }, [enableLabelOption]);

  return (
    <div
      className={"admin-rooms-label-option " + (selected ? "active" : "")}
      onClick={handleLabelOptionSelection}
    >
      <img src={item.image} width="85px" height="94px" alt={item.title} />
      <h6>{item.title}</h6>
    </div>
  );
};
