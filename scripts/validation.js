// Validation settings object
const validationSettings = {
  formSelector: ".modal__form",
  inputSelector: ".modal__input",
  submitButtonSelector: ".modal__button",
  inactiveButtonClass: "modal__button_disabled",
  inputErrorClass: "modal__input_type_error",
  errorClass: "modal__error_visible",
};

// Shared helper function to calculate total error height
function getErrorHeight(formElement, settings) {
  const visibleErrors = formElement.querySelectorAll(`.${settings.errorClass}`);
  let totalErrorHeight = 0;
  const errorSpacing = window.innerWidth > 720 ? 8 : 4;

  visibleErrors.forEach((error) => {
    const computedStyle = window.getComputedStyle(error);
    const errorMargin = parseFloat(computedStyle.marginBottom) || errorSpacing;
    const errorRect = error.getBoundingClientRect();
    totalErrorHeight += errorRect.height + errorMargin;
  });

  return totalErrorHeight;
}

// Shared function to adjust field wrapper positions
function adjustFieldWrapperPositions(formElement, settings) {
  const fieldWrappers = formElement.querySelectorAll(".modal__field-wrapper");
  let currentOffset = 0;

  fieldWrappers.forEach((wrapper) => {
    const error = wrapper.querySelector(`.${settings.errorClass}`);
    if (error && error.classList.contains(settings.errorClass)) {
      const errorHeight = error.getBoundingClientRect().height;
      const errorSpacing = window.innerWidth > 720 ? 8 : 4;
      currentOffset += errorHeight + errorSpacing;
    }

    if (currentOffset > 0) {
      wrapper.style.transform = `translateY(${currentOffset}px)`;
    } else {
      wrapper.style.transform = "none";
    }
  });

  return currentOffset;
}

// Specific adjustment function for Edit Profile modal
function adjustEditProfileModal(
  modalContainer,
  contentWrapper,
  totalErrorHeight
) {
  const mobileBase = {
    container: 336,
    content: 248,
  };

  const desktopBase = {
    container: 415,
    content: 299,
  };

  if (window.innerWidth <= 720) {
    const newContainerHeight = mobileBase.container + totalErrorHeight;
    const newContentHeight = mobileBase.content + totalErrorHeight;

    modalContainer.style.height = `${newContainerHeight}px`;
    contentWrapper.style.height = `${newContentHeight}px`;
  } else {
    const formElement = contentWrapper.querySelector(".modal__form");
    const offset = adjustFieldWrapperPositions(formElement, validationSettings);

    modalContainer.style.minHeight = `${desktopBase.container + offset}px`;
    contentWrapper.style.minHeight = `${desktopBase.content + offset}px`;
    modalContainer.style.height = "auto";
    contentWrapper.style.height = "auto";
  }
}

// Specific adjustment function for New Post modal
function adjustNewPostModal(modalContainer, contentWrapper, totalErrorHeight) {
  const mobileBase = {
    container: 336,
    content: 248,
  };

  const desktopBase = {
    container: 415,
    content: 299,
  };

  if (window.innerWidth <= 720) {
    const newContainerHeight = mobileBase.container + totalErrorHeight;
    const newContentHeight = mobileBase.content + totalErrorHeight;

    modalContainer.style.height = `${newContainerHeight}px`;
    contentWrapper.style.height = `${newContentHeight}px`;
  } else {
    const formElement = contentWrapper.querySelector(".modal__form");
    const offset = adjustFieldWrapperPositions(formElement, validationSettings);

    modalContainer.style.minHeight = `${desktopBase.container + offset}px`;
    contentWrapper.style.minHeight = `${desktopBase.content + offset}px`;
    modalContainer.style.height = "auto";
    contentWrapper.style.height = "auto";
  }
}

// Main adjustment function that determines which modal to adjust
function adjustModalHeight(formElement, settings) {
  const modalContainer = formElement.closest(".modal__container");
  const contentWrapper = formElement.closest(".modal__content-wrapper");
  const totalErrorHeight = getErrorHeight(formElement, settings);

  // Determine which modal we're in
  const isEditModal = formElement.closest(".modal_type_edit");
  const isNewPostModal = formElement.closest(".modal_type_new-post");

  requestAnimationFrame(() => {
    if (isEditModal) {
      adjustEditProfileModal(modalContainer, contentWrapper, totalErrorHeight);
    } else if (isNewPostModal) {
      adjustNewPostModal(modalContainer, contentWrapper, totalErrorHeight);
    }
  });
}

// Show input error message
function showInputError(formElement, inputElement, errorMessage, settings) {
  const errorElement = formElement.querySelector(`#${inputElement.id}-error`);
  inputElement.classList.add(settings.inputErrorClass);
  errorElement.textContent = errorMessage;
  errorElement.classList.add(settings.errorClass);

  requestAnimationFrame(() => {
    adjustModalHeight(formElement, settings);
  });
}

// Hide input error message
function hideInputError(formElement, inputElement, settings) {
  const errorElement = formElement.querySelector(`#${inputElement.id}-error`);
  inputElement.classList.remove(settings.inputErrorClass);
  errorElement.classList.remove(settings.errorClass);
  errorElement.textContent = "";

  requestAnimationFrame(() => {
    adjustModalHeight(formElement, settings);
  });
}

// Check input validity
function checkInputValidity(formElement, inputElement, settings) {
  if (!inputElement.validity.valid) {
    showInputError(
      formElement,
      inputElement,
      inputElement.validationMessage,
      settings
    );
  } else {
    hideInputError(formElement, inputElement, settings);
  }
}

// Check if any input is invalid
function hasInvalidInput(inputList) {
  return inputList.some((inputElement) => !inputElement.validity.valid);
}

// Toggle button state based on form validity
function toggleButtonState(inputList, buttonElement, settings) {
  if (hasInvalidInput(inputList)) {
    buttonElement.classList.add(settings.inactiveButtonClass);
    buttonElement.disabled = true;
  } else {
    buttonElement.classList.remove(settings.inactiveButtonClass);
    buttonElement.disabled = false;
  }
}

// Reset form validation state
function resetValidation(formElement, settings) {
  const inputList = Array.from(
    formElement.querySelectorAll(settings.inputSelector)
  );
  const buttonElement = formElement.querySelector(
    settings.submitButtonSelector
  );

  inputList.forEach((inputElement) => {
    hideInputError(formElement, inputElement, settings);
  });

  // Ensure button is disabled by default for new post form
  if (formElement.id === "new-post-form") {
    buttonElement.classList.add(settings.inactiveButtonClass);
    buttonElement.disabled = true;
  } else {
    toggleButtonState(inputList, buttonElement, settings);
  }
}

// Set event listeners for a form
function setEventListeners(formElement, settings) {
  const inputList = Array.from(
    formElement.querySelectorAll(settings.inputSelector)
  );
  const buttonElement = formElement.querySelector(
    settings.submitButtonSelector
  );

  // Initial button state
  if (formElement.id === "new-post-form") {
    buttonElement.classList.add(settings.inactiveButtonClass);
    buttonElement.disabled = true;
  } else {
    toggleButtonState(inputList, buttonElement, settings);
  }

  // Add reset listener to handle form resets
  formElement.addEventListener("reset", () => {
    // setTimeout ensures this runs after the form reset
    setTimeout(() => {
      resetValidation(formElement, settings);
    }, 0);
  });

  inputList.forEach((inputElement) => {
    inputElement.addEventListener("input", () => {
      checkInputValidity(formElement, inputElement, settings);
      toggleButtonState(inputList, buttonElement, settings);
    });
  });
}

// Enable validation for all forms
function enableValidation(settings) {
  const formList = Array.from(document.querySelectorAll(settings.formSelector));
  formList.forEach((formElement) => {
    formElement.addEventListener("submit", (evt) => {
      evt.preventDefault();
    });
    setEventListeners(formElement, settings);
  });
}

// Make functions and settings globally available
window.enableValidation = enableValidation;
window.resetValidation = resetValidation;
window.validationSettings = validationSettings;

// Initialize validation with settings
enableValidation(validationSettings);
