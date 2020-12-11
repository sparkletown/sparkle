const { readFileSync } = require("fs");
const _ = require("lodash");

describe("package-lock.json", () => {
  const packageLockJson = JSON.parse(
    readFileSync("./package-lock.json", "utf8")
  );

  /**
   * This test allows us to failfast when npm v7 is used, until we are ready for it
   */
  test("has lockfileVersion 1", () => {
    expect(packageLockJson.lockfileVersion).toBe(1);
  });

  /**
   * Ensure that fontawesome deps requirements are kept in alignment to avoid weird breakages.
   */
  describe("@fortawesome/fontawesome-*", () => {
    test("all use a common version of @fortawesome/fontawesome-common-types", () => {
      const faCommonTypes =
        packageLockJson.dependencies[`@fortawesome/fontawesome-common-types`];

      const extractRequiredCommonTypesVersion = (dependencyKey) => {
        const requiresObj =
          packageLockJson.dependencies[dependencyKey].requires || {};

        return requiresObj["@fortawesome/fontawesome-common-types"];
      };

      const requiredCommonTypes = Object.keys(packageLockJson.dependencies)
        .filter((key) => key.startsWith("@fortawesome"))
        .map(extractRequiredCommonTypesVersion)
        .filter((key) => !!key);

      expect(_.uniq(requiredCommonTypes)).toEqual(
        expect.arrayContaining([`^${faCommonTypes.version}`])
      );
    });
  });
});
