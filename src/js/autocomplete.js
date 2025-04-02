import accessibleAutocomplete from "accessible-autocomplete";

export function setupAutocomplete() {
    let selectElements = document.querySelectorAll('.autocomplete-select')
    let placeholder = ''
    
    selectElements.forEach((selectElement, _index) => {
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
