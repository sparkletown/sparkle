export const isUserAMember = (
  email: string | null,
  memberEmails?: string[]
) => {
  if (email && memberEmails) {
    const emailLower = email.toLowerCase();
    for (const memberEmail of memberEmails) {
      if (memberEmail.toLowerCase() === emailLower) {
        return true;
      }
    }
  }
  return false;
};
