import accessibleAutocomplete from "accessible-autocomplete";

/**
 * Tell the DOM to turn elements with class "autocomplete-select" to behave as such
 */
export function setupAutocomplete() {
    let selectElements = document.querySelectorAll('.autocomplete-select')
    let placeholder = ''
    
    selectElements.forEach((selectElement) => {
      if (selectElement.length) {
        if (selectElement.getAttribute('autocomplete-placeholder')) {
            placeholder = selectElement.getAttribute('autocomplete-placeholder')
          }
        
        accessibleAutocomplete.enhanceSelectElement({
          defaultValue: '',
          placeholder: placeholder,
          minLength: 1,
          showNoOptionsFound: true,
          showAllValues: false,
          autoselect: false,
          selectElement: selectElement,
        })
      }
    
    })
    
}

// Tell page to listen out for any accessible-autocompletes
document.addEventListener("DOMContentLoaded",setupAutocomplete)
