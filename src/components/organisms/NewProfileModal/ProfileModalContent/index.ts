import { withPropsTransform } from "components/hocs/utility/withPropsTransform";
import { compose } from "lodash/fp";

import { convertToFirestoreKey } from "utils/id";

import {
  ProfileModalContent as _ProfileModalContent,
  ProfileModalContentProps,
} from "./ProfileModalContent";

const addWorldId = (props: Partial<ProfileModalContentProps>) => ({
  ...props,
  worldId: convertToFirestoreKey(props?.space?.worldId),
});

export const ProfileModalContent = compose(withPropsTransform(addWorldId))(
  _ProfileModalContent
);
