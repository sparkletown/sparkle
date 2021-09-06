export enum VenueAccessMode {
  Emails = "Emails",
  Codes = "Codes",
  Password = "Password",
}

export type VenueAccessPassword = {
  password?: string;
};

export type VenueAccessCodes = {
  codes?: string[];
};

export type VenueAccessEmails = {
  emails?: string[];
};
