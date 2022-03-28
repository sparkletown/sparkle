import {
  BUILD_BRANCH,
  BUILD_PULL_REQUESTS,
  BUILD_REPOSITORY_URL,
  BUILD_SHA1,
  BUILD_TAG,
} from "secrets";

import { createErrorCapture } from "utils/error";

import { FIREBASE } from "./firebase";

const logout = () =>
  void FIREBASE.auth.signOut().catch(
    createErrorCapture({
      message: "Sign out failed",
      where: "SPARK.logout()",
    })
  );

const version = () => ({
  sha1: BUILD_SHA1,
  tag: BUILD_TAG,
  branch: BUILD_BRANCH,
  pullRequests: BUILD_PULL_REQUESTS,
  repositoryUrl: BUILD_REPOSITORY_URL,
});

/**
 * Handy browser global object for some Sparkle utility functions.
 */
export const SPARK = {
  logout,
  version,
};

// NOTE: the name SPARK is chosen for brevity and avoiding conflicts by being all caps
((window as unknown) as { SPARK: typeof SPARK }).SPARK ??= SPARK;
