import { AdminRoomsLabelOption } from "components/molecules/AdminRoomsLabelOption";
import React, { useCallback, useState } from "react";
import "./AdminRoomsLabelOptions.scss";
export interface AdminRoomsLabelOptionsPropsType {}

export const AdminRoomsLabelOptions: React.FunctionComponent<AdminRoomsLabelOptionsPropsType> = () => {
  const items = [
    {
      title: "No label",
      value: "no-label",
      image: "/admin/roomsLabelOptions/nolabel.png",
    },
    {
      title: "Show label on hover",
      value: "hover",
      image: "/admin/roomsLabelOptions/hover.png",
    },
    {
      title: "Show people count",
      value: "count",
      image: "/admin/roomsLabelOptions/count.png",
    },
    {
      title: "Show label and people count",
      value: "count/name",
      image: "/admin/roomsLabelOptions/count-name.png",
    },
  ];

  const [selectedOption, setSelectedOption] = useState("");

  const handleOptionSelection = useCallback(
    (value) => setSelectedOption(value),
    []
  );

  return (
    <div className="admin-rooms-label-options">
      {items.map((item) => (
        <AdminRoomsLabelOption
          key={item.value}
          item={item}
          optionSelected={selectedOption === item.value}
          enableLabelOption={() => handleOptionSelection(item.value)}
        />
      ))}
    </div>
  );
};
