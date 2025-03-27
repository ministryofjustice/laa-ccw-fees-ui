
//TODO could be api call in future?

const lawCategories = [
    {
        id: "family",
        description: "Family"
    },
    {
        id: "immigration",
        description: "Immigration"
    }
]

/**
 * Gets the valid law categories
 * @returns {Array[]} the valid law categories
 */
export function getLawCategories(){
    return lawCategories
}

/**
 * Check an entered category is valid
 * @param {string} enteredCategory - category user selected
 * @returns {boolean} true if category is valid, false otherwise
 */
export function isValidLawCategory(enteredCategory){
    return lawCategories.some(category => category.id === enteredCategory);
}