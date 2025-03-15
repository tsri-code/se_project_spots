// Initial cards data - array of objects containing card information
const initialCards = [
  {
    name: "Val Thorens",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/1-photo-by-moritz-feldmann-from-pexels.jpg",
  },
  {
    name: "Restaurant terrace",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/2-photo-by-ceiline-from-pexels.jpg",
  },
  {
    name: "An outdoor cafe",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/3-photo-by-tubanur-dogan-from-pexels.jpg",
  },
  {
    name: "A very long bridge, over the forest and through the trees",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/4-photo-by-maurice-laschet-from-pexels.jpg",
  },
  {
    name: "Tunnel with morning light",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/5-photo-by-van-anh-nguyen-from-pexels.jpg",
  },
  {
    name: "Mountain house",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/6-photo-by-moritz-feldmann-from-pexels.jpg",
  },
  {
    name: "Landscape view",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/7-photo-by-griffin-wooldridge-from-pexels.jpg",
  },
];

const editProfileButton = document.querySelector(".profile__edit-button");
const newPostButton = document.querySelector(".profile__add-button");
const modals = document.querySelectorAll(".modal");
const editProfileModal = modals[0]; // First modal is edit profile
const newPostModal = modals[1]; // Second modal is new post
const closeButtons = document.querySelectorAll(".modal__close-btn");
const submitButtons = document.querySelector(".modal__submit-btn");
const profileModal = document.querySelector("#edit-profile-modal");
const profileForm = profileModal.querySelector("#edit-profile-form");
const nameInput = document.querySelector("#name-input");
const descriptionInput = document.querySelector("#description-input");
const cardModal = document.querySelector("#new-post-modal");
const cardForm = cardModal.querySelector("#new-post-form");
const cardNameInput = cardModal.querySelector("#caption-input");
const cardLinkInput = cardModal.querySelector("#image-link");
const profileNameElement = document.querySelector(".profile__name");
const profileDescriptionElement = document.querySelector(
  ".profile__description"
);
const previewModal = document.querySelector("#view-photo");
const previewModalImageEl = previewModal.querySelector(".modal__image");
const previewModalCaptionEl = previewModal.querySelector(".modal__caption");

const cardTemplate = document.querySelector("#card-template").content;
const cardList = document.querySelector(".gallery__cards");

function openModal(modal) {
  modal.classList.add("modal__opened");
  document.addEventListener("keydown", handleEscClose);
}

function closeModal(modal) {
  modal.classList.remove("modal__opened");
  document.removeEventListener("keydown", handleEscClose);
}

function handleEscClose(evt) {
  if (evt.key === "Escape") {
    const openedModal = document.querySelector(".modal__opened");
    if (openedModal) {
      closeModal(openedModal);
    }
  }
}

// Close modal when clicking on overlay
modals.forEach((modal) => {
  modal.addEventListener("mousedown", (evt) => {
    if (evt.target.classList.contains("modal__opened")) {
      closeModal(modal);
    }
  });
});

function openEditProfileModal() {
  nameInput.value = profileNameElement.textContent;
  descriptionInput.value = profileDescriptionElement.textContent;
  resetValidation(profileForm, [nameInput, descriptionInput], settings);
  openModal(editProfileModal);
  disableButton(submitButtons, settings);
}

function openNewPostModal() {
  openModal(newPostModal);
  toggleButtonState(
    cardForm.querySelectorAll(".modal__input"),
    cardForm.querySelector(".modal__submit-btn"),
    settings
  );
}

// Add event listeners
editProfileButton.addEventListener("click", openEditProfileModal);
newPostButton.addEventListener("click", openNewPostModal);

// Close buttons for all modals
closeButtons.forEach((button) => {
  const modal = button.closest(".modal");
  button.addEventListener("click", () => closeModal(modal));
});

function handleProfileFormSubmit(evt) {
  evt.preventDefault();
  profileNameElement.textContent = nameInput.value;
  profileDescriptionElement.textContent = descriptionInput.value;
  closeModal(editProfileModal);
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
  disableButton(submitButtons, settings);
  closeModal(newPostModal);
}

cardForm.addEventListener("submit", handleNewPostFormSubmit);

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
  });
  return cardElement;
}

initialCards.forEach((cardData) => {
  const cardElement = getCardElement(cardData);
  cardList.append(cardElement);
});
