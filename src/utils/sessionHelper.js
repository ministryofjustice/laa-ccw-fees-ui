/**
 * Check if session has the data object setup and throw error if not
 * Lack of session.data suggests they've been skipping pages, there's been an error in the server, etc
 * @param {import('express').Request} req - Express request object
 * @returns {object} session data if exists
 */
export function getSessionData(req) {
  const data = req.session?.data;
  if (data == null) {
    //TODO custom error??
    throw new Error("No session data found");
  }

  return data;
}
