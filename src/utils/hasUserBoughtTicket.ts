import { Purchase } from "types/Purchase";
import { ParsedQs } from "qs";

export const hasUserBoughtTicketForEvent = (
  userPurchaseHistory: Purchase[] | null,
  eventId: string | ParsedQs | string[] | ParsedQs[]
) =>
  userPurchaseHistory &&
  !!userPurchaseHistory.find((purchase) => purchase.eventId === eventId);
