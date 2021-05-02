import { useState, useCallback, useEffect, useMemo } from "react";
import debounce from "lodash/debounce";

const SEARCH_DEBOUNCE_TIME = 200; // ms

export const useDebounceSearch = () => {
  const [searchInputValue, setSearchInputValue] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const clearSearchInput = useCallback(() => {
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

    return () => {
      debouncedSearch.cancel();
    };
  }, [searchInputValue, debouncedSearch]);

  return {
    searchQuery,

    searchInputValue,
    setSearchInputValue,

    clearSearchInput,
  };
};
