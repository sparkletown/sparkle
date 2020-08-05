import { Purchase } from "types/Purchase";
import { ParsedQs } from "qs";

export const hasUserBoughtTicketForEvent = (
  userPurchaseHistory: Purchase[] | undefined,
  eventId: string | ParsedQs | string[] | ParsedQs[]
) =>
  userPurchaseHistory &&
  !!userPurchaseHistory.find(
    (purchase) => purchase.eventId === eventId && purchase.status === "COMPLETE"
  );
