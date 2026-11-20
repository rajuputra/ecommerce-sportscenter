const encoder = new TextEncoder();

// Java's isBlank uses this set of whitespace characters, while Size counts UTF-16 units.
// eslint-disable-next-line no-control-regex -- Java treats these control characters as whitespace.
const javaBlank = /^[\u0009-\u000d\u001c-\u0020\u1680\u2000-\u2006\u2008-\u200a\u2028\u2029\u205f\u3000]*$/u;

export const passwordRules = [
  { label: "At least 8 characters", check: (value: string) => value.length >= 8 },
  { label: "Contains a non-space character", check: (value: string) => !javaBlank.test(value) },
  { label: "No more than 72 UTF-8 bytes", check: (value: string) => encoder.encode(value).length <= 72 },
];

export function validatePassword(value: string) {
  return passwordRules.every(rule => rule.check(value)) || "Your password must meet all requirements below.";
}
