import React from "react";
import { useHistory } from "react-router-dom";
import classNames from "classnames";
import { AdminLayout } from "components/layouts/AdminLayout";

import { ADMIN_IA_WORLD_PARAM_URL } from "settings";

import { spaceCreateItemSelector } from "utils/selectors";
import { generateUrl } from "utils/url";

import { useSpaceParams } from "hooks/spaces/useSpaceParams";
import { useSelector } from "hooks/useSelector";
import { useWorldBySlug } from "hooks/worlds/useWorldBySlug";

import { PortalShowcase } from "components/organisms/PortalShowcase";
import { SpaceCreateForm } from "components/organisms/SpaceCreateForm";

import { Loading } from "components/molecules/Loading";

import { AdminRestricted } from "components/atoms/AdminRestricted";

import CN from "./SpaceCreatePage.module.scss";

export const SpaceCreatePage: React.FC = () => {
  const history = useHistory();
  const { worldSlug } = useSpaceParams();
  const { isLoaded: isWorldLoaded, worldId } = useWorldBySlug(worldSlug);
  const selectedItem = useSelector(spaceCreateItemSelector);

  const homeUrl = generateUrl({
    route: ADMIN_IA_WORLD_PARAM_URL,
    required: ["worldSlug"],
    params: { worldSlug },
  });

  const containerClassNames = classNames(CN.spaceCreatePage);

  const headerClassNames = classNames(CN.header);
  const formContainerClasses =
    "py-10 max-w-10xl grid grid-cols-1 gap-6 sm:px-6 lg:max-w-10xl lg:grid-flow-col-dense lg:grid-cols-3";

  const spaceInfoClassNames = classNames(
    "bg-white px-4 py-5 shadow sm:rounded-lg sm:px-6 w-full h-fit"
  );
  const previewClassNames = classNames(
    "space-y-6 lg:col-start-2 lg:col-span-2 px-12 sm:px-12"
  );

  const breadcrumbClasses =
    "cursor-pointer text-sm font-medium text-gray-500 hover:text-gray-700";
  const titleClasses = "mt-2 flex items-center text-sm text-gray-500";
  const subtitleClasses = "mt-2 flex items-center text-sm text-gray-500";

  return (
    <AdminLayout>
      <AdminRestricted>
        <div className={containerClassNames}>
          <div className={headerClassNames}>
            <div className="flex row">
              <div
                className={breadcrumbClasses}
                onClick={() => history.push(homeUrl)}
              >
                Spaces
              </div>
              <div className="flex items-center">
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
            </div>
            <div className={titleClasses}>Create space</div>
            <div className={subtitleClasses}>
              {selectedItem?.text ?? "Select a template"}
            </div>
          </div>
          <div className={formContainerClasses}>
            <div className={spaceInfoClassNames}>
              {isWorldLoaded ? (
                <SpaceCreateForm worldId={worldId} />
              ) : (
                <Loading />
              )}
            </div>
            <div className={previewClassNames}>
              <PortalShowcase />
            </div>
          </div>
        </div>
      </AdminRestricted>
    </AdminLayout>
  );
};
