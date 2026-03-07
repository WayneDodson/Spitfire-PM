export { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";

// Point to our custom login page instead of Manus OAuth portal
export const getLoginUrl = () => {
  return "/login";
};
