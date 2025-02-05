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

function adjustDesktopModalHeight(formElement) {
  if (window.innerWidth <= 720) return;

  const modalContainer = formElement.closest(".modal__container");
  const contentWrapper = formElement.closest(".modal__content-wrapper");
  const errorHeight = getErrorHeight(formElement);

  // Base heights for desktop
  const baseContainerHeight = 415;
  const baseContentHeight = 299; // 415 - (32px top padding + 32px header margin + 52px bottom padding)

  // Calculate new heights
  const newContainerHeight = baseContainerHeight + errorHeight;
  const newContentHeight = baseContentHeight + errorHeight;

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

  // Base heights
  const baseContainerHeight = 336;
  const baseContentHeight = 220;

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

  // Only show error if the input is actually invalid
  if (!inputElement.validity.valid) {
    inputElement.classList.add(settings.inputErrorClass);
    errorElement.textContent = errorMessage;
    errorElement.classList.add(settings.errorClass);

    // Adjust modal height after error is visible
    requestAnimationFrame(() => {
      adjustModalHeight(formElement);
      adjustDesktopModalHeight(formElement);
    });
  }
}

// Hide input error message
function hideInputError(formElement, inputElement, settings) {
  const errorElement = formElement.querySelector(`#${inputElement.id}-error`);

  // Only hide if the input is actually valid
  if (inputElement.validity.valid) {
    inputElement.classList.remove(settings.inputErrorClass);
    errorElement.classList.remove(settings.errorClass);
    errorElement.textContent = "";

    // Check if any other errors are visible
    const hasVisibleErrors = formElement.querySelector(".modal__error_visible");
    if (hasVisibleErrors) {
      adjustModalHeight(formElement);
      adjustDesktopModalHeight(formElement);
    } else {
      // Reset to base heights if no errors
      const modalContainer = formElement.closest(".modal__container");
      const contentWrapper = formElement.closest(".modal__content-wrapper");

      if (window.innerWidth <= 720) {
        modalContainer.style.height = "336px";
        contentWrapper.style.height = "220px";
      } else {
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
