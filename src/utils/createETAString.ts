export const CreateETAString = (date: Date) => {
  return [
    `${date.getUTCHours() ? `${date.getUTCHours()}h` : ""}`,
    `${date.getUTCMinutes() ? `${date.getUTCMinutes()}m` : ""}`,
    `${date.getUTCSeconds() ? `${date.getUTCSeconds()}s` : ""}`,
  ].join(" ");
};
