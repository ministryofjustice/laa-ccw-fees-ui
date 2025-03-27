
export function getSessionData(req) {
    const data = req.session?.data
    if (data == null){
      //TODO custom error??
      throw new Error("No session data found");
    }

    return data
}