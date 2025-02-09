// Settings for form validation
const validationSettings = {
  // Form and input selectors
  formSelector: ".modal__form",
  inputSelector: ".modal__input",
  submitButtonSelector: ".modal__button",
  profileFormName: "profile-form",
  newPostFormName: "new-post-form",

  // Class names
  inactiveButtonClass: "modal__button_disabled",
  inputErrorClass: "modal__input_type_error",
  errorClass: "modal__error_visible",
  modalOpenedClass: "modal_opened",
  imageLandscapeClass: "modal__image_landscape",
  imagePortraitClass: "modal__image_portrait",

  // Modal structure selectors
  fieldWrapperSelector: ".modal__field-wrapper",
  modalContainerSelector: ".modal__container",
  modalContentWrapperSelector: ".modal__content-wrapper",
  modalSelector: ".modal",

  // Modal type selectors
  editModalSelector: ".modal_type_edit",
  newPostModalSelector: ".modal_type_new-post",
  imageModalSelector: ".modal_type_image",

  // Button selectors
  closeButtonSelector: ".modal__close-button",
  closeButtonImageSelector: ".modal__close-button_type_image",
  editButtonSelector: ".profile__edit-button",
  addButtonSelector: ".profile__add-button",

  // Input field selectors
  nameInputSelector: ".modal__input_type_name",
  descriptionInputSelector: ".modal__input_type_description",
  imageLinkInputSelector: ".modal__input_type_image-link",
  captionInputSelector: ".modal__input_type_caption",

  // Profile selectors
  profileNameSelector: ".profile__name",
  profileDescriptionSelector: ".profile__description",

  // Image modal selectors
  imageSelector: ".modal__image",
  captionSelector: ".modal__caption",

  // Gallery selectors
  cardTemplateSelector: "#card-template",
  cardListSelector: ".gallery__cards",
  cardSelector: ".card",
  cardImageSelector: ".card__image",
  cardTitleSelector: ".card__title",
  cardLikeButtonSelector: ".card__like-button",
  cardDeleteButtonSelector: ".card__delete-button",
  cardLikeActiveClass: "card__like-button_active",

  // Error selectors
  errorSelector: ".modal__error",
  errorIdTemplate: "{inputId}-error", // Template for error element IDs

  // Breakpoint and measurements
  mobileBreakpoint: 769,
  defaultHeights: {
    mobile: {
      fieldWrapper: 74,
      container: 336,
      content: 248,
    },
    desktop: {
      fieldWrapper: 78,
      container: 415,
      content: 272,
    },
  },
};

// Determine which modal needs height adjustment and apply changes
function adjustModalHeight(formElement, settings) {
  requestAnimationFrame(() => {
    if (window.innerWidth <= settings.mobileBreakpoint) {
      window.adjustMobileModalHeight(formElement, settings);
    } else {
      window.adjustDesktopModalHeight(formElement, settings);
    }
  });
}

// Display error message for invalid input
function showInputError(formElement, inputElement, errorMessage, settings) {
  const errorId = settings.errorIdTemplate.replace(
    "{inputId}",
    inputElement.id
  );
  const errorElement = formElement.querySelector(`#${errorId}`);
  inputElement.classList.add(settings.inputErrorClass);
  errorElement.textContent = errorMessage;
  errorElement.classList.add(settings.errorClass);
  adjustModalHeight(formElement, settings);
}

// Hide error message when input becomes valid
function hideInputError(formElement, inputElement, settings) {
  const errorId = settings.errorIdTemplate.replace(
    "{inputId}",
    inputElement.id
  );
  const errorElement = formElement.querySelector(`#${errorId}`);
  inputElement.classList.remove(settings.inputErrorClass);
  errorElement.classList.remove(settings.errorClass);
  errorElement.textContent = "";
  adjustModalHeight(formElement, settings);
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

  // Record base heights for mobile modals
  if (
    window.innerWidth <= settings.mobileBreakpoint &&
    window.recordBaseHeightsMobile
  ) {
    window.recordBaseHeightsMobile(formElement, settings);
  } else if (
    window.innerWidth > settings.mobileBreakpoint &&
    window.recordBaseHeightsDesktop
  ) {
    window.recordBaseHeightsDesktop(formElement, settings);
  }

  // Only clear error states, not the actual input values
  inputList.forEach((inputElement) => {
    hideInputError(formElement, inputElement, settings);
  });

  // Enable/disable submit button based on current input values
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
