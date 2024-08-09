export const ErrorList: keyString = {
  required: "FIELD_IS_REQUIRED",
  email: "INVALID_EMAIL_ADDRESS",
  maxlength: "MAXLENGTH_REQUIRED",
  minlength: "MINLENGTH_REQUIRED",
  min: "MIN_REQUIRED",
  max: "MAX_REQUIRED",
  pattern: "PATTERN_REQUIRED",
  invalidIpAdress: "IP_NOT_VALID",
  invalidPinfl: "PINFL_NOT_VALID",
  invalidMax: "DIGIT_COUNTER_NOT_CORRECT",
  invalidMinKwt: "MINIMUM_LIMIT",
  invalidDivision: "VALUE_MUST_DIVISIBLE",
  invalidMaxKwt: "OUT_OF_LIMIT",
  maxDay: "LAST_DAY_OF_MONTH",
  uniqueError: "UNIQUE_ERROR",
  rangeError: "RANGE_ERROR",
  confirmPasswordError: "CONFIRM_PASSWORD_ERROR",
  numeric: "NUMERIC",
  lowercase: "LOWERCASE",
  uppercase: "UPPERCASE",
  invalidLength: "INVALID_LENGTH",
  maxFileSize: "MAX_FILE_SIZE",
  oneUppercase: "ONE_UPPERCASE",
  oneLowercase: "ONE_LOWERCASE",
  oneSpecialCharacter: "ONE_SPECIAL_CHARACTER",
  oneNumber: "ONE_NUMBER",
};

interface keyString {
  [key: string]: string;
}
