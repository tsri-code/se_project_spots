import "./index.css";
import Api from "../utils/Api.js";

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

const editProfileButton = document.querySelector(".profile__edit-button");
const newPostButton = document.querySelector(".profile__add-button");
const modals = document.querySelectorAll(".modal");
const editProfileModal = document.querySelector("#edit-profile-modal");
const newPostModal = document.querySelector("#new-post-modal");
const closeButtons = document.querySelectorAll(".modal__close-btn");
const profileForm = document.forms["edit-profile-form"];
const nameInput = document.querySelector("#name-input");
const descriptionInput = document.querySelector("#description-input");
const cardModal = document.querySelector("#new-post-modal");
const cardForm = document.forms["new-post-form"];
const cardNameInput = cardModal.querySelector("#caption-input");
const cardLinkInput = cardModal.querySelector("#image-link");
const profileNameElement = document.querySelector(".profile__name");
const profileDescriptionElement = document.querySelector(
  ".profile__description"
);
const previewModal = document.querySelector("#view-photo");
const previewModalImageEl = previewModal.querySelector(".modal__image");
const previewModalCaptionEl = previewModal.querySelector(".modal__caption");
const avatarModalButton = document.querySelector(".profile__avatar-button");
const avatarModal = document.querySelector("#edit-avatar-modal");
const avatarForm = document.forms["edit-avatar"];
const avatarLinkInput = document.querySelector("#avatar-link");
const avatarFormSubmitButton = avatarForm.querySelector(".modal__submit-btn");

const cardTemplate = document.querySelector("#card-template").content;
const cardList = document.querySelector(".gallery__cards");

const cardFormSubmitButton = cardForm.querySelector(".modal__submit-btn");
const profileFormSubmitButton = profileForm.querySelector(".modal__submit-btn");

api
  .getAppInfo()
  .then(([cards, userInfo]) => {
    console.log("userInfo:", userInfo);
    cards.forEach((cardData) => {
      const cardElement = getCardElement(cardData);
      cardList.append(cardElement);
    });
    profileNameElement.textContent = userInfo.name;
    profileDescriptionElement.textContent = userInfo.about;
  })
  .catch(console.error);

function openModal(modal) {
  modal.classList.add("modal_opened");
  document.addEventListener("keydown", handleEscClose);
}

function closeModal(modal) {
  modal.classList.remove("modal_opened");
  document.removeEventListener("keydown", handleEscClose);
}

function handleEscClose(evt) {
  if (evt.key === "Escape") {
    const openedModal = document.querySelector(".modal_opened");
    if (openedModal) {
      closeModal(openedModal);
    }
  }
}

// Close modal when clicking on overlay
modals.forEach((modal) => {
  modal.addEventListener("mousedown", (evt) => {
    if (evt.target.classList.contains("modal_opened")) {
      closeModal(modal);
    }
  });
});

function openEditProfileModal() {
  nameInput.value = profileNameElement.textContent;
  descriptionInput.value = profileDescriptionElement.textContent;
  resetValidation(profileForm, [nameInput, descriptionInput], settings);
  openModal(editProfileModal);
  disableButton(profileFormSubmitButton, settings);
}

function openNewPostModal() {
  openModal(newPostModal);
}

function openAvatarModal() {
  resetValidation(avatarForm, [avatarLinkInput], settings);
  openModal(avatarModal);
  disableButton(avatarFormSubmitButton, settings);
}

// Close buttons for all modals
closeButtons.forEach((button) => {
  const modal = button.closest(".modal");
  button.addEventListener("click", () => closeModal(modal));
});

function handleProfileFormSubmit(evt) {
  evt.preventDefault();
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
    .catch(console.error);
}

profileForm.addEventListener("submit", handleProfileFormSubmit);

function handleNewPostFormSubmit(evt) {
  evt.preventDefault();
  const cardData = {
    name: cardNameInput.value,
    link: cardLinkInput.value,
  };
  const cardElement = getCardElement(cardData);
  cardList.prepend(cardElement);
  evt.target.reset();
  disableButton(cardFormSubmitButton, settings);
  closeModal(newPostModal);
}

cardForm.addEventListener("submit", handleNewPostFormSubmit);

function handleAvatarFormSubmit(evt) {
  evt.preventDefault();
  api
    .setUserAvatar({
      avatar: avatarLinkInput.value,
    })
    .then((userData) => {
      document.querySelector(".profile__image").src = userData.avatar;
      closeModal(avatarModal);
      evt.target.reset();
    })
    .catch(console.error);
}

// Add event listeners
editProfileButton.addEventListener("click", openEditProfileModal);
newPostButton.addEventListener("click", openNewPostModal);
avatarModalButton.addEventListener("click", openAvatarModal);
avatarForm.addEventListener("submit", handleAvatarFormSubmit);

function getCardElement(data) {
  const cardElement = cardTemplate.querySelector(".card").cloneNode(true);
  const cardImage = cardElement.querySelector(".card__image");
  const cardTitle = cardElement.querySelector(".card__title");
  const cardLikeBtn = cardElement.querySelector(".card__like-button");
  const cardDeleteBtn = cardElement.querySelector(".card__delete-button");

  cardImage.src = data.link;
  cardImage.alt = data.name;
  cardTitle.textContent = data.name;
  cardLikeBtn.addEventListener("click", () => {
    cardLikeBtn.classList.toggle("card__like-button_active");
  });
  cardDeleteBtn.addEventListener("click", () => {
    cardElement.remove();
  });

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
