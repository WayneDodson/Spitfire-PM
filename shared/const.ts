export const COOKIE_NAME = "app_session_id";

/** Password policy — enforced on registration, reset, and profile password change */
export const PASSWORD_MIN_LENGTH = 8;
export const PASSWORD_MAX_LENGTH = 128;
export const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~])/;
export const PASSWORD_REGEX_MSG =
  "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (e.g. !@#$%)";
export const ONE_YEAR_MS = 1000 * 60 * 60 * 24 * 365;
export const AXIOS_TIMEOUT_MS = 30_000;
export const UNAUTHED_ERR_MSG = 'Please login (10001)';
export const NOT_ADMIN_ERR_MSG = 'You do not have required permission (10002)';
