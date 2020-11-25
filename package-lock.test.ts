const { readFileSync } = require("fs");

describe("package-lock.json", () => {
  test("has lockfileVersion 1", () => {
    const packageLockJson = JSON.parse(
      readFileSync("./package-lock.json", "utf8")
    );

    // This test allows us to failfast when npm v7 is used, until we are ready for it
    expect(packageLockJson.lockfileVersion).toBe(1);
  });
});
