//TODO will be api call in future

const matterCode1s = [
    {
      id: "FAMA",
      description: "Divorce/Judicial Seperation/Nullity",
    },
    {
      id: "FAMB",
      description: "Dissolution of Civil Partnership",
    },
    {
        id: "FAMC",
        description: "Domestic Abuse"
    },
    {
        id: "FAMD",
        description: "Private Law Children Only"
    }
  ];
  
  /**
   * Gets the valid matter code 1s
   * @returns {Array[]} - the valid matter codes
   */
  export function getMatterCode1s() {
    return matterCode1s;
  }
  
  /**
   * Check an entered matter code 1 is valid
   * @param {string} enteredMatterCode - matter code 1 user selected
   * @returns {boolean} - true if matter code 1 is valid, false otherwise
   */
  export function isValidMatterCode1(enteredMatterCode) {
    return matterCode1s.some((matterCode) => matterCode.id === enteredMatterCode);
  }
  
  