const londonRates = [
  {
    id: "LDN",
    description: "London",
  },
  {
    id: "NLDN",
    description: "Non-London",
  },
];

/**
 * Gets the valid London rate values
 * @returns {Array[]} - the valid London rate values
 */
export function getLondonRates() {
  return londonRates;
}

/**
 * Check an entered London rate is valid
 * @param {string} enteredRate - rate user selected
 * @returns {boolean} - true if rate is valid, false otherwise
 */
export function isValidLondonRate(enteredRate) {
  return londonRates.some((rate) => rate.id === enteredRate);
}
