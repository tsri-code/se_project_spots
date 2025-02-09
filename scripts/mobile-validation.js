// Base measurements for mobile modals
const mobileBase = {
  error: {
    spacing: 4, // Space between error and next field
  },
  field: {
    gap: 24, // Default gap between form fields
  },
};

// Store base heights and margins when modal opens
function recordBaseHeightsMobile(formElement, settings) {
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
function adjustMobileFields(formElement, settings) {
  const fieldWrappers = formElement.querySelectorAll(
    settings.fieldWrapperSelector
  );

  fieldWrappers.forEach((wrapper) => {
    // Reset to base measurements first
    const baseHeight =
      parseFloat(wrapper.dataset.baseHeight) ||
      settings.defaultHeights.mobile.fieldWrapper;
    const baseMargin =
      parseFloat(wrapper.dataset.baseMarginBottom) || mobileBase.field.gap;

    wrapper.style.height = `${baseHeight}px`;
    wrapper.style.marginBottom = `${baseMargin}px`;

    // Check for visible error
    const error = wrapper.querySelector(`.${settings.errorClass}`);
    if (error && error.classList.contains(settings.errorClass)) {
      const errorHeight = error.offsetHeight;
      const errorMargin = mobileBase.error.spacing;

      // Adjust wrapper height to include error
      wrapper.style.height = `${baseHeight + errorHeight + errorMargin}px`;
    }
  });
}

// Main function to handle mobile modal height adjustments
function adjustMobileModalHeight(formElement, settings) {
  if (window.innerWidth <= settings.mobileBreakpoint) {
    const modalContainer = formElement.closest(settings.modalContainerSelector);
    const contentWrapper = modalContainer.querySelector(
      settings.modalContentWrapperSelector
    );

    // Reset container heights to measure natural size
    modalContainer.style.height = "";
    contentWrapper.style.height = "";

    // Adjust fields for errors
    adjustMobileFields(formElement, settings);

    // Let the modal grow naturally based on content
    const newContainerHeight = modalContainer.offsetHeight;
    const newContentHeight = contentWrapper.offsetHeight;

    // Only set explicit heights if they differ from defaults
    if (newContainerHeight > settings.defaultHeights.mobile.container) {
      modalContainer.style.height = `${newContainerHeight}px`;
    }
    if (newContentHeight > settings.defaultHeights.mobile.content) {
      contentWrapper.style.height = `${newContentHeight}px`;
    }
  }
}

// Make these functions available to validation.js
window.adjustMobileModalHeight = adjustMobileModalHeight;
window.recordBaseHeightsMobile = recordBaseHeightsMobile;
