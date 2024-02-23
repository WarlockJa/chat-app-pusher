// regex for alphanumericals with dash
export const regexAlphanumericWithDash = /^[A-Za-z0-9-]+$/;
export const regexDigitsWithDot = /^[0-9.]+$/;
// name regex may contain numbers, underscores, dashes, spaces, letters in any language, and starts with such a letter
export const regexStartLetterContainsLettersNumbersUnderscore =
  /^[a-zA-Z\u00C0-\u024F\u0400-\u04FF\u0500-\u052F\u0531-\u058F\u0591-\u05F4\u0600-\u06FF\u0700-\u074F\u0750-\u077F][a-zA-Z\u00C0-\u024F\u0400-\u04FF\u0500-\u052F\u0531-\u058F\u0591-\u05F4\u0600-\u06FF\u0700-\u074F\u0750-\u077F0-9_-\s]*$/;
