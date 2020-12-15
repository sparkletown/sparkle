export enum VenueAccessType {
  Emails = "emails",
  Codes = "codes",
  Password = "password",
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
