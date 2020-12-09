export enum VenueAccessType {
  EmailList = "emaillist",
  CodeList = "codelist",
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
