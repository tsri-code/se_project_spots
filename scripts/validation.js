// All the settings for form validation in one place
const validationSettings = {
  // Basic form elements
  formSelector: ".modal__form",
  inputSelector: ".modal__input",
  submitButtonSelector: ".modal__button",
  profileFormName: "profile-form",
  newPostFormName: "new-post-form",

  // Classes for different states
  inactiveButtonClass: "modal__button_disabled",
  inputErrorClass: "modal__input_type_error",
  errorClass: "modal__error_visible",
  modalOpenedClass: "modal_opened",
  imageLandscapeClass: "modal__image_landscape",
  imagePortraitClass: "modal__image_portrait",

  // Modal structure
  fieldWrapperSelector: ".modal__field-wrapper",
  modalContainerSelector: ".modal__container",
  modalContentWrapperSelector: ".modal__content-wrapper",
  modalSelector: ".modal",

  // Different types of modals
  editModalSelector: ".modal_type_edit",
  newPostModalSelector: ".modal_type_new-post",
  imageModalSelector: ".modal_type_image",

  // Buttons
  closeButtonSelector: ".modal__close-button",
  closeButtonImageSelector: ".modal__close-button_type_image",
  editButtonSelector: ".profile__edit-button",
  addButtonSelector: ".profile__add-button",

  // Form inputs
  nameInputSelector: ".modal__input_type_name",
  descriptionInputSelector: ".modal__input_type_description",
  imageLinkInputSelector: ".modal__input_type_image-link",
  captionInputSelector: ".modal__input_type_caption",

  // Profile elements
  profileNameSelector: ".profile__name",
  profileDescriptionSelector: ".profile__description",

  // Image preview elements
  imageSelector: ".modal__image",
  captionSelector: ".modal__caption",

  // Card elements
  cardTemplateSelector: "#card-template",
  cardListSelector: ".gallery__cards",
  cardSelector: ".card",
  cardImageSelector: ".card__image",
  cardTitleSelector: ".card__title",
  cardLikeButtonSelector: ".card__like-button",
  cardDeleteButtonSelector: ".card__delete-button",
  cardLikeActiveClass: "card__like-button_active",

  // Error handling
  errorSelector: ".modal__error",
  errorIdTemplate: "{inputId}-error", // How we find error elements

  // Screen sizes and measurements
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

// Figure out if we need to adjust mobile or desktop modal height
function adjustModalHeight(formElement, settings) {
  requestAnimationFrame(() => {
    if (window.innerWidth <= settings.mobileBreakpoint) {
      window.adjustMobileModalHeight(formElement, settings);
    } else {
      window.adjustDesktopModalHeight(formElement, settings);
    }
  });
}

// Show error message when input is invalid
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

// Hide error message once input becomes valid
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

// Check if the input is valid and show/hide error message
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

// Enable/disable the submit button based on whether form is valid
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

// Reset validation state when form is reopened or reset
function resetValidation(formElement, settings) {
  const inputList = Array.from(
    formElement.querySelectorAll(settings.inputSelector)
  );
  const buttonElement = formElement.querySelector(
    settings.submitButtonSelector
  );

  // Record heights for the right screen size
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

  // Clear any error states but keep input values
  inputList.forEach((inputElement) => {
    hideInputError(formElement, inputElement, settings);
  });

  // Update submit button state
  toggleButtonState(inputList, buttonElement, settings);
}

// Set up all the validation listeners for a form
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

// Start validation on all forms
function enableValidation(settings) {
  const formList = Array.from(document.querySelectorAll(settings.formSelector));
  formList.forEach((formElement) => {
    formElement.addEventListener("submit", function (evt) {
      evt.preventDefault();
    });

    setEventListeners(formElement, settings);
  });
}

// Kick off form validation
enableValidation(validationSettings);
