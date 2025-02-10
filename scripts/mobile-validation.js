// Base spacing for mobile modals
const mobileBase = {
  error: {
    spacing: 4, // Space between error and field
  },
  field: {
    gap: 24, // Gap between form fields
  },
};

// Save the original heights when modal first opens
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

// Adjust field heights when errors appear/disappear
function adjustMobileFields(formElement, settings) {
  const fieldWrappers = formElement.querySelectorAll(
    settings.fieldWrapperSelector
  );

  fieldWrappers.forEach((wrapper) => {
    // Go back to original size first
    const baseHeight =
      parseFloat(wrapper.dataset.baseHeight) ||
      settings.defaultHeights.mobile.fieldWrapper;
    const baseMargin =
      parseFloat(wrapper.dataset.baseMarginBottom) || mobileBase.field.gap;

    wrapper.style.height = `${baseHeight}px`;
    wrapper.style.marginBottom = `${baseMargin}px`;

    // Make room for error if needed
    const error = wrapper.querySelector(`.${settings.errorClass}`);
    if (error && error.classList.contains(settings.errorClass)) {
      const errorHeight = error.offsetHeight;
      const errorMargin = mobileBase.error.spacing;

      // Add error height to wrapper
      wrapper.style.height = `${baseHeight + errorHeight + errorMargin}px`;
    }
  });
}

// Handle mobile modal height changes
function adjustMobileModalHeight(formElement, settings) {
  if (window.innerWidth <= settings.mobileBreakpoint) {
    const modalContainer = formElement.closest(settings.modalContainerSelector);
    const contentWrapper = modalContainer.querySelector(
      settings.modalContentWrapperSelector
    );

    // Let everything flow naturally first
    modalContainer.style.height = "";
    contentWrapper.style.height = "";

    // Fix field heights for any errors
    adjustMobileFields(formElement, settings);

    // See how tall everything needs to be
    const newContainerHeight = modalContainer.offsetHeight;
    const newContentHeight = contentWrapper.offsetHeight;

    // Only set heights if they need to be bigger than default
    if (newContainerHeight > settings.defaultHeights.mobile.container) {
      modalContainer.style.height = `${newContainerHeight}px`;
    }
    if (newContentHeight > settings.defaultHeights.mobile.content) {
      contentWrapper.style.height = `${newContentHeight}px`;
    }
  }
}

// Make these available to validation.js
window.adjustMobileModalHeight = adjustMobileModalHeight;
window.recordBaseHeightsMobile = recordBaseHeightsMobile;
