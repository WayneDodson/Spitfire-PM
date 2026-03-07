import { describe, it, expect } from "vitest";

describe("Google Client ID configuration", () => {
  it("VITE_GOOGLE_CLIENT_ID should be set and valid format", () => {
    // The Google Client ID is a VITE_ variable, so it's exposed at build time
    // We test the ENV config instead
    const googleClientId = process.env.GOOGLE_CLIENT_ID ?? process.env.VITE_GOOGLE_CLIENT_ID ?? "";
    // Google Client IDs follow the pattern: numbers-alphanumeric.apps.googleusercontent.com
    expect(googleClientId).toBeTruthy();
    if (googleClientId) {
      expect(googleClientId).toMatch(/\.apps\.googleusercontent\.com$/);
    }
  });

  it("GOOGLE_CLIENT_ID server env should be set", () => {
    const googleClientId = process.env.GOOGLE_CLIENT_ID ?? "";
    expect(googleClientId).toBeTruthy();
    expect(googleClientId).toMatch(/\.apps\.googleusercontent\.com$/);
  });
});
