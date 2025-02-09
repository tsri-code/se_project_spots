// these are the base measurements we need for desktop
const desktopBase = {
  container: {
    padding: {
      top: 32,
      bottom: 40,
      horizontal: 50,
    },
  },
  content: {
    gap: 32,
  },
  fieldWrapper: {
    height: 78,
    gap: 8,
    marginBottom: 32,
  },
  error: {
    spacing: 8,
  },
};

// Store base heights and margins when modal opens
function recordBaseHeightsDesktop(formElement, settings) {
  const fieldWrappers = formElement.querySelectorAll(
    settings.fieldWrapperSelector
  );
  fieldWrappers.forEach((wrapper) => {
    wrapper.dataset.baseHeight = wrapper.offsetHeight;
    const style = window.getComputedStyle(wrapper);
    wrapper.dataset.baseMarginBottom = style.marginBottom.replace("px", "");
  });
}

// Calculate and adjust field heights based on errors
function adjustDesktopFields(formElement, settings) {
  const fieldWrappers = formElement.querySelectorAll(
    settings.fieldWrapperSelector
  );

  fieldWrappers.forEach((wrapper) => {
    // Reset to base measurements first
    const baseHeight =
      parseFloat(wrapper.dataset.baseHeight) ||
      settings.defaultHeights.desktop.fieldWrapper;
    const baseMargin =
      parseFloat(wrapper.dataset.baseMarginBottom) ||
      desktopBase.fieldWrapper.marginBottom;

    wrapper.style.height = `${baseHeight}px`;
    wrapper.style.marginBottom = `${baseMargin}px`;

    // Check for visible error
    const error = wrapper.querySelector(`.${settings.errorClass}`);
    if (error && error.classList.contains(settings.errorClass)) {
      const errorHeight = error.offsetHeight;
      const errorMargin = desktopBase.error.spacing;

      // Adjust wrapper height to include error
      wrapper.style.height = `${baseHeight + errorHeight + errorMargin}px`;
    }
  });
}

// Main function to handle desktop modal height adjustments
function adjustDesktopModalHeight(formElement, settings) {
  if (window.innerWidth > settings.mobileBreakpoint) {
    const modalContainer = formElement.closest(settings.modalContainerSelector);
    const contentWrapper = modalContainer.querySelector(
      settings.modalContentWrapperSelector
    );

    // Clear inline heights to allow natural flow
    modalContainer.style.height = "";
    contentWrapper.style.height = "";

    // Expand each field wrapper for any errors
    adjustDesktopFields(formElement, settings);

    // Now measure the new needed height
    const expandedHeight = modalContainer.offsetHeight;
    const expandedContentHeight = contentWrapper.offsetHeight;

    // Force the container and content wrapper to the new size
    modalContainer.style.height = `${expandedHeight}px`;
    contentWrapper.style.height = `${expandedContentHeight}px`;
  }
}

// Make these functions available to validation.js
window.adjustDesktopModalHeight = adjustDesktopModalHeight;
window.recordBaseHeightsDesktop = recordBaseHeightsDesktop;
