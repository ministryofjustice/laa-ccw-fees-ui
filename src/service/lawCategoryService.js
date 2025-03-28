//TODO could be api call in future?

const lawCategories = [
  {
    id: "family",
    description: "Family",
  },
  {
    id: "immigration",
    description: "Immigration",
  },
];

/**
 * Gets the valid law categories
 * @returns {Array[]} - the valid law categories
 */
export function getLawCategories() {
  return lawCategories;
}

/**
 * Check an entered category is valid
 * @param {string} enteredCategory - category user selected
 * @returns {boolean} - true if category is valid, false otherwise
 */
export function isValidLawCategory(enteredCategory) {
  return lawCategories.some((category) => category.id === enteredCategory);
}

/**
 * Find description of law category from given id
 * @param {string} categoryToLookup - category to get description for
 * @returns {string | null} Description if available, null if not
 */
export function getLawCategoryDescription(categoryToLookup) {
  const categoryObject = lawCategories.find(
    (category) => category.id === categoryToLookup,
  );
  return categoryObject ? categoryObject.description : null;
}
