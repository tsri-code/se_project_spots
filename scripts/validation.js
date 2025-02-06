// Validation settings object
const validationSettings = {
  formSelector: ".modal__form",
  inputSelector: ".modal__input",
  submitButtonSelector: ".modal__button",
  inactiveButtonClass: "modal__button_disabled",
  inputErrorClass: "modal__input_type_error",
  errorClass: "modal__error_visible",
};

function getErrorHeight(formElement) {
  const errorElements = formElement.querySelectorAll(".modal__error_visible");
  let totalErrorHeight = 0;

  errorElements.forEach((error) => {
    const errorHeight = error.getBoundingClientRect().height;
    totalErrorHeight += errorHeight + 12; // Increased from 8px to 12px for more bottom spacing
  });

  return totalErrorHeight;
}

function adjustDesktopNewPostModal(formElement) {
  if (window.innerWidth <= 720) return;

  const modalContainer = formElement.closest(".modal__container");
  const contentWrapper = formElement.closest(".modal__content-wrapper");
  const errorHeight = getErrorHeight(formElement);

  // Base heights for desktop new post modal
  const baseContainerHeight = 415;
  const baseContentHeight = 299;

  // Calculate new heights with less spacing
  const newContainerHeight = baseContainerHeight + errorHeight * 0.7; // Reduce the growth
  const newContentHeight = baseContentHeight + errorHeight * 0.7;

  requestAnimationFrame(() => {
    modalContainer.style.height = `${newContainerHeight}px`;
    contentWrapper.style.height = `${newContentHeight}px`;
  });
}

function adjustDesktopEditModal(formElement) {
  if (window.innerWidth <= 720) return;

  const modalContainer = formElement.closest(".modal__container");
  const contentWrapper = formElement.closest(".modal__content-wrapper");
  const errorHeight = getErrorHeight(formElement);

  // Base heights for desktop edit modal
  const baseContainerHeight = 415;
  const baseContentHeight = 299;

  // Calculate new heights with same growth factor as new post modal
  const newContainerHeight = baseContainerHeight + errorHeight * 0.7;
  const newContentHeight = baseContentHeight + errorHeight * 0.7;

  requestAnimationFrame(() => {
    modalContainer.style.height = `${newContainerHeight}px`;
    contentWrapper.style.height = `${newContentHeight}px`;
  });
}

function adjustModalHeight(formElement) {
  if (window.innerWidth > 720) return;

  const modalContainer = formElement.closest(".modal__container");
  const contentWrapper = formElement.closest(".modal__content-wrapper");
  const errorHeight = getErrorHeight(formElement);
  const isNewPostModal = formElement.closest(".modal_type_new-post");
  const isEditModal = formElement.closest(".modal_type_edit");

  // Different base heights for each modal type
  let baseContainerHeight, baseContentHeight;

  if (isNewPostModal) {
    baseContainerHeight = 336; // Base height without padding
    baseContentHeight = 216; // Base content height without padding
  } else if (isEditModal) {
    baseContainerHeight = 336;
    baseContentHeight = 220;
  } else {
    baseContainerHeight = 336;
    baseContentHeight = 220;
  }

  // Calculate new heights
  const newContainerHeight = baseContainerHeight + errorHeight;
  const newContentHeight = baseContentHeight + errorHeight;

  requestAnimationFrame(() => {
    modalContainer.style.height = `${newContainerHeight}px`;
    contentWrapper.style.height = `${newContentHeight}px`;
  });
}

// Show input error message
function showInputError(formElement, inputElement, errorMessage, settings) {
  const errorElement = formElement.querySelector(`#${inputElement.id}-error`);

  if (!inputElement.validity.valid) {
    inputElement.classList.add(settings.inputErrorClass);
    errorElement.textContent = errorMessage;
    errorElement.classList.add(settings.errorClass);

    requestAnimationFrame(() => {
      if (window.innerWidth <= 720) {
        adjustModalHeight(formElement);
      } else {
        // Check modal type and use appropriate function
        if (formElement.closest(".modal_type_new-post")) {
          adjustDesktopNewPostModal(formElement);
        } else if (formElement.closest(".modal_type_edit")) {
          adjustDesktopEditModal(formElement);
        }
      }
    });
  }
}

// Hide input error message
function hideInputError(formElement, inputElement, settings) {
  const errorElement = formElement.querySelector(`#${inputElement.id}-error`);

  if (inputElement.validity.valid) {
    inputElement.classList.remove(settings.inputErrorClass);
    errorElement.classList.remove(settings.errorClass);
    errorElement.textContent = "";

    const hasVisibleErrors = formElement.querySelector(".modal__error_visible");
    if (hasVisibleErrors) {
      if (window.innerWidth <= 720) {
        adjustModalHeight(formElement);
      } else {
        // Check modal type and use appropriate function
        if (formElement.closest(".modal_type_new-post")) {
          adjustDesktopNewPostModal(formElement);
        } else if (formElement.closest(".modal_type_edit")) {
          adjustDesktopEditModal(formElement);
        }
      }
    } else {
      const modalContainer = formElement.closest(".modal__container");
      const contentWrapper = formElement.closest(".modal__content-wrapper");

      if (window.innerWidth <= 720) {
        const isNewPostModal = formElement.closest(".modal_type_new-post");
        if (isNewPostModal) {
          modalContainer.style.height = "336px";
          contentWrapper.style.height = "216px";
        } else {
          modalContainer.style.height = "336px";
          contentWrapper.style.height = "220px";
        }
      } else {
        // Reset desktop heights
        modalContainer.style.height = "415px";
        contentWrapper.style.height = "299px";
      }
    }
  }
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

// Set event listeners for a form
function setEventListeners(formElement, settings) {
  const inputList = Array.from(
    formElement.querySelectorAll(settings.inputSelector)
  );
  const buttonElement = formElement.querySelector(
    settings.submitButtonSelector
  );

  // Initial button state
  toggleButtonState(inputList, buttonElement, settings);

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

  toggleButtonState(inputList, buttonElement, settings);
}

// Make functions and settings globally available
window.enableValidation = enableValidation;
window.resetValidation = resetValidation;
window.validationSettings = validationSettings;

// Initialize validation with settings
enableValidation(validationSettings);
