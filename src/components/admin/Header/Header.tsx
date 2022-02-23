import { useHistory } from "react-router-dom";

import { ADMIN_IA_WORLD_PARAM_URL } from "settings";

import { spaceCreateItemSelector } from "utils/selectors";
import { generateUrl } from "utils/url";

import { useSpaceParams } from "hooks/spaces/useSpaceParams";
import { useSelector } from "hooks/useSelector";

import * as TW from "./Header.tailwind";

import CN from "./Header.module.scss";

export const Header = () => {
  const { worldSlug } = useSpaceParams();
  const history = useHistory();
  const selectedItem = useSelector(spaceCreateItemSelector);

  const navigateToWorld = () => {
    history.push(
      generateUrl({
        route: ADMIN_IA_WORLD_PARAM_URL,
        required: ["worldSlug"],
        params: { worldSlug },
      })
    );
  };

  return (
    <div className={CN.header}>
      <div className={TW.row}>
        <div className={TW.breadcrumb} onClick={navigateToWorld}>
          Spaces
        </div>
        <svg
          className="ml-2 flex-shrink-0 h-5 w-5 text-gray-400"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 20 20"
          aria-hidden="true"
        >
          <path d="M5.555 17.776l8-16 .894.448-8 16-.894-.448z" />
        </svg>
      </div>
      <div className={TW.title}>Create space</div>
      <div className={TW.subtitle}>
        {selectedItem?.text ?? "Select a template"}
      </div>
    </div>
  );
};
