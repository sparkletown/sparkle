import React, { ChangeEvent } from "react";
import Form from "react-bootstrap/Form";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

import { InputField } from "components/atoms/InputField";

import "./Search.scss";

export interface SearchProps {
  titleFilterValue?: string;
  setTitleValue: (title: string) => void;

  liveFilterValue: boolean;
  setLiveValue: (isLive: boolean) => void;
}

export const Search: React.FC<SearchProps> = ({
  titleFilterValue,
  setTitleValue,

  liveFilterValue,
  setLiveValue,
}) => {
  const onTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTitleValue(e.target.value);
  };

  return (
    <div className="posterhall-search">
      <InputField
        containerClassName="posterhall-search__input-container"
        inputClassName="posterhall-search__input"
        iconStart={faSearch}
        placeholder="Search Posters/Demos"
        value={titleFilterValue}
        onChange={onTitleChange}
      />
      <Form>
        <Form.Check
          className="posterhall-search__checkbox"
          type="checkbox"
          label="Presenter is online"
          checked={liveFilterValue}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setLiveValue(e.target.checked)
          }
        />
      </Form>
    </div>
  );
};
