// Base spacing for desktop modals
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

// Save the original heights when modal first opens
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

// Adjust field heights when errors appear/disappear
function adjustDesktopFields(formElement, settings) {
  const fieldWrappers = formElement.querySelectorAll(
    settings.fieldWrapperSelector
  );

  fieldWrappers.forEach((wrapper) => {
    // Go back to original size first
    const baseHeight =
      parseFloat(wrapper.dataset.baseHeight) ||
      settings.defaultHeights.desktop.fieldWrapper;
    const baseMargin =
      parseFloat(wrapper.dataset.baseMarginBottom) ||
      desktopBase.fieldWrapper.marginBottom;

    wrapper.style.height = `${baseHeight}px`;
    wrapper.style.marginBottom = `${baseMargin}px`;

    // Make room for error if needed
    const error = wrapper.querySelector(`.${settings.errorClass}`);
    if (error && error.classList.contains(settings.errorClass)) {
      const errorHeight = error.offsetHeight;
      const errorMargin = desktopBase.error.spacing;

      // Add error height to wrapper
      wrapper.style.height = `${baseHeight + errorHeight + errorMargin}px`;
    }
  });
}

// Handle desktop modal height changes
function adjustDesktopModalHeight(formElement, settings) {
  if (window.innerWidth > settings.mobileBreakpoint) {
    const modalContainer = formElement.closest(settings.modalContainerSelector);
    const contentWrapper = modalContainer.querySelector(
      settings.modalContentWrapperSelector
    );

    // Let everything flow naturally first
    modalContainer.style.height = "";
    contentWrapper.style.height = "";

    // Fix field heights for any errors
    adjustDesktopFields(formElement, settings);

    // See how tall everything needs to be
    const expandedHeight = modalContainer.offsetHeight;
    const expandedContentHeight = contentWrapper.offsetHeight;

    // Set the final heights
    modalContainer.style.height = `${expandedHeight}px`;
    contentWrapper.style.height = `${expandedContentHeight}px`;
  }
}

// Make these available to validation.js
window.adjustDesktopModalHeight = adjustDesktopModalHeight;
window.recordBaseHeightsDesktop = recordBaseHeightsDesktop;
