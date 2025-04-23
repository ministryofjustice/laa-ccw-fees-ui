/**
 * Tell the DOM to do browser back when back button clicked
 */
export function setupBackLink() {
  let backButton = document.getElementById("backLinkDefault");

  if (backButton) {
    backButton.addEventListener("click", function () {
      window.history.back();
    });
  }
}

/**
 * Ensure reloads page content when go back to avoid caching issues where old data is shown
 * @param {Event} event - pageshow event that has triggered this
 */
export function forceReloadOnBack(event) {
  let navEntry = performance.getEntriesByType("navigation")[0];
  let navType = navEntry && navEntry.type;

  if (event.persisted || navType === "back_forward") {
    window.location.reload();
  }
}

document.addEventListener("DOMContentLoaded", setupBackLink);
window.addEventListener("pageshow", forceReloadOnBack);
