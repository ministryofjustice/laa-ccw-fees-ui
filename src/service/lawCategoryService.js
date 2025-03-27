
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

export function getLawCategories(){
    return lawCategories
}

export function isValidLawCategory(expectedCategory){
    return lawCategories.some(category => category.id === expectedCategory);
}