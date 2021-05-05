import { useState, useCallback, useEffect, useMemo } from "react";
import debounce from "lodash/debounce";

import { SEARCH_DEBOUNCE_TIME } from "settings";

export const useDebounceSearch = () => {
  const [searchInputValue, setSearchInputValue] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const clearSearch = useCallback(() => {
    setSearchInputValue("");
    // To instantly remove the options
    setSearchQuery("");
  }, []);

  const debouncedSearch = useMemo(
    () =>
      debounce((value: string) => {
        setSearchQuery(value.toLowerCase());
      }, SEARCH_DEBOUNCE_TIME),
    []
  );

  useEffect(() => {
    debouncedSearch(searchInputValue);
  }, [searchInputValue, debouncedSearch]);

  return {
    searchQuery,

    searchInputValue,
    setSearchInputValue,

    clearSearch,
  };
};
