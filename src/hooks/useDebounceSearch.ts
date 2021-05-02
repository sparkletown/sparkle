import { useState, useCallback, useEffect } from "react";
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

  useEffect(() => {
    const debouncedSearch = debounce((value: string) => {
      setSearchQuery(value.toLowerCase());
    }, SEARCH_DEBOUNCE_TIME);

    debouncedSearch(searchInputValue);

    return () => {
      debouncedSearch.cancel();
    };
  }, [searchInputValue]);

  return {
    searchQuery,

    searchInputValue,
    setSearchInputValue,

    clearSearchInput,
  };
};
