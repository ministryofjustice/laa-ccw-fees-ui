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

document.addEventListener("DOMContentLoaded", setupBackLink);
