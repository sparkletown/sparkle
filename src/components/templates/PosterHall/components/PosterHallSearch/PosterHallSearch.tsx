import React, { ChangeEvent, useCallback } from "react";
import Form from "react-bootstrap/Form";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

import { InputField } from "components/atoms/InputField";

import "./PosterHallSearch.scss";

export interface PosterHallSearchProps {
  titleFilterValue?: string;
  setTitleValue: (title: string) => void;

  liveFilterValue: boolean;
  setLiveValue: (isLive: boolean) => void;
}

export const PosterHallSearch: React.FC<PosterHallSearchProps> = ({
  titleFilterValue,
  setTitleValue,

  liveFilterValue,
  setLiveValue,
}) => {
  const onTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTitleValue(e.target.value);
  };

  const onCheckboxChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => setLiveValue(e.target.checked),
    [setLiveValue]
  );

  return (
    <div className="PosterHallSearch">
      <InputField
        containerClassName="PosterHallSearch__input-container"
        inputClassName="PosterHallSearch__input"
        iconStart={faSearch}
        placeholder="Search Posters/Demos"
        value={titleFilterValue}
        onChange={onTitleChange}
      />
      {/* TODO: Create a generic checkbox component */}
      <Form>
        <Form.Check
          className="PosterHallSearch__checkbox"
          type="checkbox"
          label="Presenter is online"
          checked={liveFilterValue}
          onChange={onCheckboxChange}
        />
      </Form>
    </div>
  );
};
