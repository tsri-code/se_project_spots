import "./index.css";
import Api from "../utils/Api.js";
import { setButtonText } from "../utils/helpers.js";
import {
  enableValidation,
  resetValidation,
  disableButton,
  settings,
} from "../scripts/validation.js";

const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "a02b3a56-2aeb-4c2c-8ac4-78ecf247f130",
    "Content-Type": "application/json",
  },
});

// Profile elements
const profileNameElement = document.querySelector(".profile__name");
const profileDescriptionElement = document.querySelector(
  ".profile__description"
);
const avatarImage = document.querySelector(".profile__image");
const avatarModalButton = document.querySelector(".profile__avatar-button");
const editProfileButton = document.querySelector(".profile__edit-button");
const newPostButton = document.querySelector(".profile__add-button");

// Modal windows
const modals = document.querySelectorAll(".modal");
const editProfileModal = document.querySelector("#edit-profile-modal");
const newPostModal = document.querySelector("#new-post-modal");
const avatarModal = document.querySelector("#edit-avatar-modal");
const previewModal = document.querySelector("#view-photo");
const deleteModal = document.querySelector("#delete-card-modal");
const closeButtons = document.querySelectorAll(".modal__close-btn");

// Forms and inputs
const profileForm = document.forms["edit-profile-form"];
const nameInput = document.querySelector("#name-input");
const descriptionInput = document.querySelector("#description-input");
const cardForm = document.forms["new-post-form"];
const cardNameInput = newPostModal.querySelector("#caption-input");
const cardLinkInput = newPostModal.querySelector("#image-link");
const avatarForm = document.forms["edit-avatar"];
const avatarLinkInput = document.querySelector("#avatar-link");
const deleteForm = deleteModal.querySelector("form");
const deleteButton = deleteForm.querySelector('button[type="submit"]');
const cancelButton = deleteForm.querySelector('button[type="button"]');

// Form submit buttons
const avatarFormSubmitButton = avatarForm.querySelector(".modal__submit-btn");
const cardFormSubmitButton = cardForm.querySelector(".modal__submit-btn");
const profileFormSubmitButton = profileForm.querySelector(".modal__submit-btn");

// Card elements
const cardTemplate = document.querySelector("#card-template").content;
const cardList = document.querySelector(".gallery__cards");
const previewModalImageEl = previewModal.querySelector(".modal__image");
const previewModalCaptionEl = previewModal.querySelector(".modal__caption");

// Store the current selected card and its ID
let selectedCard;
let selectedCardId;

api
  .getAppInfo()
  .then(([cardsData, userData]) => {
    avatarImage.src = userData.avatar;
    profileNameElement.textContent = userData.name;
    profileDescriptionElement.textContent = userData.about;

    cardsData.forEach((cardData) => {
      const cardElement = getCardElement(cardData);
      cardList.append(cardElement);
    });
  })
  .catch(console.error);

// Opens a modal
function openModal(modal) {
  modal.classList.add("modal_opened");
  document.addEventListener("keydown", handleEscClose);
}

// Closes a modal
function closeModal(modal) {
  modal.classList.remove("modal_opened");
  document.removeEventListener("keydown", handleEscClose);
}

// Opens profile edit modal
function openEditProfileModal() {
  nameInput.value = profileNameElement.textContent;
  descriptionInput.value = profileDescriptionElement.textContent;
  resetValidation(profileForm, [nameInput, descriptionInput], settings);
  openModal(editProfileModal);
  disableButton(profileFormSubmitButton, settings);
}

// Opens new post modal
function openNewPostModal() {
  openModal(newPostModal);
}

// Opens avatar edit modal
function openAvatarModal() {
  resetValidation(avatarForm, [avatarLinkInput], settings);
  openModal(avatarModal);
  disableButton(avatarFormSubmitButton, settings);
}

// Submits profile form
function handleProfileFormSubmit(evt) {
  evt.preventDefault();
  const submitButton = evt.submitter;
  setButtonText(submitButton, true);

  api
    .editUserInfo({
      name: nameInput.value,
      about: descriptionInput.value,
    })
    .then((userInfo) => {
      profileNameElement.textContent = userInfo.name;
      profileDescriptionElement.textContent = userInfo.about;
      closeModal(editProfileModal);
    })
    .catch(console.error)
    .finally(() => {
      setButtonText(submitButton, false);
    });
}

// Submits new post form
function handleNewPostFormSubmit(evt) {
  evt.preventDefault();
  const submitButton = evt.submitter;
  setButtonText(submitButton, true);

  const cardData = {
    name: cardNameInput.value,
    link: cardLinkInput.value,
  };

  api
    .addCard(cardData)
    .then((newCardData) => {
      const cardElement = getCardElement(newCardData);
      cardList.prepend(cardElement);
      evt.target.reset();
      disableButton(cardFormSubmitButton, settings);
      closeModal(newPostModal);
    })
    .catch(console.error)
    .finally(() => {
      setButtonText(submitButton, false);
    });
}

// Submits avatar form
function handleAvatarFormSubmit(evt) {
  evt.preventDefault();
  const submitButton = evt.submitter;
  setButtonText(submitButton, true);

  api
    .setUserAvatar({
      avatar: avatarLinkInput.value,
    })
    .then((userData) => {
      document.querySelector(".profile__image").src = userData.avatar;
      closeModal(avatarModal);
      evt.target.reset();
    })
    .catch(console.error)
    .finally(() => {
      setButtonText(submitButton, false);
    });
}

// Opens delete confirmation modal
function handleDeleteCard(cardElement, data) {
  selectedCard = cardElement;
  selectedCardId = data._id;
  openModal(deleteModal);
}

// Handles delete card submission
function handleDeleteSubmit(evt) {
  evt.preventDefault();
  const submitButton = evt.submitter;
  setButtonText(submitButton, true, "Delete", "Deleting...");

  api
    .deleteCard(selectedCardId)
    .then(() => {
      selectedCard.remove();
      closeModal(deleteModal);
    })
    .catch(console.error)
    .finally(() => {
      setButtonText(submitButton, false, "Delete", "Deleting...");
    });
}

// Handles like card submission
function handleLike(evt, cardId) {
  const likeButton = evt.target.closest(".card__like-button");
  const isLiked = likeButton.classList.contains("card__like-button_active");

  api
    .changeLikeStatus(cardId, isLiked)
    .then((updatedCard) => {
      if (updatedCard.isLiked) {
        likeButton.classList.add("card__like-button_active");
      } else {
        likeButton.classList.remove("card__like-button_active");
      }
    })
    .catch(console.error);
}

// Add event listeners
editProfileButton.addEventListener("click", openEditProfileModal);
newPostButton.addEventListener("click", openNewPostModal);
avatarModalButton.addEventListener("click", openAvatarModal);
avatarForm.addEventListener("submit", handleAvatarFormSubmit);
deleteForm.addEventListener("submit", handleDeleteSubmit);
profileForm.addEventListener("submit", handleProfileFormSubmit);
cardForm.addEventListener("submit", handleNewPostFormSubmit);
cancelButton.addEventListener("click", () => closeModal(deleteModal));

// Set up modal close functionality
modals.forEach((modal) => {
  modal.addEventListener("mousedown", (evt) => {
    if (evt.target.classList.contains("modal_opened")) {
      closeModal(modal);
    }
  });
});

// Closes modal on Escape key
function handleEscClose(evt) {
  if (evt.key === "Escape") {
    const openedModal = document.querySelector(".modal_opened");
    if (openedModal) {
      closeModal(openedModal);
    }
  }
}

closeButtons.forEach((button) => {
  const modal = button.closest(".modal");
  button.addEventListener("click", () => closeModal(modal));
});

// Creates a card element
function getCardElement(data) {
  const cardElement = cardTemplate.querySelector(".card").cloneNode(true);
  const cardImage = cardElement.querySelector(".card__image");
  const cardTitle = cardElement.querySelector(".card__title");
  const cardLikeBtn = cardElement.querySelector(".card__like-button");
  const cardDeleteBtn = cardElement.querySelector(".card__delete-button");

  // Set card content
  cardImage.src = data.link;
  cardImage.alt = data.name;
  cardTitle.textContent = data.name;

  // Set initial like state based on the isLiked property directly
  if (data.isLiked) {
    cardLikeBtn.classList.add("card__like-button_active");
  }

  // Add event listeners
  cardLikeBtn.addEventListener("click", (evt) => handleLike(evt, data._id));
  cardDeleteBtn.addEventListener("click", () =>
    handleDeleteCard(cardElement, data)
  );

  cardImage.addEventListener("click", () => {
    openModal(previewModal);
    previewModalImageEl.src = data.link;
    previewModalCaptionEl.textContent = data.name;
    previewModalCaptionEl.alt = data.name;
  });
  return cardElement;
}

// Initialize validation with settings
enableValidation(settings);
