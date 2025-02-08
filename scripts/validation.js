// Settings for form validation
const validationSettings = {
  formSelector: ".modal__form",
  inputSelector: ".modal__input",
  submitButtonSelector: ".modal__button",
  inactiveButtonClass: "modal__button_disabled",
  inputErrorClass: "modal__input_type_error",
  errorClass: "modal__error_visible",
};

// Calculate total height of visible error messages to adjust modal size
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

// Move form fields down when errors appear to prevent overlap
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

// Adjust Edit Profile modal height to fit error messages
function adjustEditProfileModal(
  modalContainer,
  contentWrapper,
  totalErrorHeight
) {
  const mobileBase = {
    container: 336,
    content: 248,
  };

  if (window.innerWidth <= 720) {
    const newContainerHeight = mobileBase.container + totalErrorHeight;
    const newContentHeight = mobileBase.content + totalErrorHeight;

    modalContainer.style.height = `${newContainerHeight}px`;
    contentWrapper.style.height = `${newContentHeight}px`;
  } else {
    window.adjustDesktopModalHeight(
      contentWrapper.querySelector(".modal__form"),
      validationSettings
    );
  }
}

// Adjust New Post modal height to fit error messages
function adjustNewPostModal(modalContainer, contentWrapper, totalErrorHeight) {
  const mobileBase = {
    container: 336,
    content: 248,
  };

  if (window.innerWidth <= 720) {
    const newContainerHeight = mobileBase.container + totalErrorHeight;
    const newContentHeight = mobileBase.content + totalErrorHeight;

    modalContainer.style.height = `${newContainerHeight}px`;
    contentWrapper.style.height = `${newContentHeight}px`;
  } else {
    window.adjustDesktopModalHeight(
      contentWrapper.querySelector(".modal__form"),
      validationSettings
    );
  }
}

// Determine which modal needs height adjustment and apply changes
function adjustModalHeight(formElement, settings) {
  const modalContainer = formElement.closest(".modal__container");
  const contentWrapper = formElement.closest(".modal__content-wrapper");
  const totalErrorHeight = getErrorHeight(formElement, settings);

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

// Display error message for invalid input
function showInputError(formElement, inputElement, errorMessage, settings) {
  const errorElement = formElement.querySelector(`#${inputElement.id}-error`);
  inputElement.classList.add(settings.inputErrorClass);
  errorElement.textContent = errorMessage;
  errorElement.classList.add(settings.errorClass);

  requestAnimationFrame(() => {
    adjustModalHeight(formElement, settings);
  });
}

// Hide error message when input becomes valid
function hideInputError(formElement, inputElement, settings) {
  const errorElement = formElement.querySelector(`#${inputElement.id}-error`);
  inputElement.classList.remove(settings.inputErrorClass);
  errorElement.classList.remove(settings.errorClass);
  errorElement.textContent = "";

  requestAnimationFrame(() => {
    adjustModalHeight(formElement, settings);
  });
}

// Check if input is valid and show/hide error accordingly
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

// Enable/disable submit button based on form validity
function toggleButtonState(inputList, buttonElement, settings) {
  const hasInvalidInput = inputList.some(
    (inputElement) => !inputElement.validity.valid
  );

  if (hasInvalidInput) {
    buttonElement.classList.add(settings.inactiveButtonClass);
    buttonElement.disabled = true;
  } else {
    buttonElement.classList.remove(settings.inactiveButtonClass);
    buttonElement.disabled = false;
  }
}

// Clear validation state when form is reset or reopened
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

// Set up validation listeners for all inputs in a form
function setEventListeners(formElement, settings) {
  const inputList = Array.from(
    formElement.querySelectorAll(settings.inputSelector)
  );
  const buttonElement = formElement.querySelector(
    settings.submitButtonSelector
  );

  toggleButtonState(inputList, buttonElement, settings);

  inputList.forEach((inputElement) => {
    inputElement.addEventListener("input", function () {
      checkInputValidity(formElement, inputElement, settings);
      toggleButtonState(inputList, buttonElement, settings);
    });
  });
}

// Initialize validation for all forms
function enableValidation(settings) {
  const formList = Array.from(document.querySelectorAll(settings.formSelector));
  formList.forEach((formElement) => {
    formElement.addEventListener("submit", function (evt) {
      evt.preventDefault();
    });

    setEventListeners(formElement, settings);
  });
}

// Start form validation
enableValidation(validationSettings);
