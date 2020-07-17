export interface Purchase {
  eventId: string;
  userId: string;
  status: "PENDING" | "COMPLETE";
  venueId: string;
}
