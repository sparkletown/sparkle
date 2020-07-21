import { Purchase } from "types/Purchase";
import { ParsedQs } from "qs";

export const hasUserBoughtTicketForEvent = (
  userPurchaseHistory: Purchase[],
  eventId: string | ParsedQs | string[] | ParsedQs[]
) => !!userPurchaseHistory.find((purchase) => purchase.eventId === eventId);
