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

// Edit Profile Modal
const editProfileButton = document.querySelector(".profile__edit-button");
const editProfileModal = document.querySelector(".modal");
const closeModalButtons = document.querySelectorAll(".modal__close-button");
const profileFormElement = document.querySelector(".modal__form");

// Edit profile form inputs
const nameInput = document.querySelector(".modal__input_type_name");
const jobInput = document.querySelector(".modal__input_type_description");
const profileNameElement = document.querySelector(".profile__name");
const profileJobElement = document.querySelector(".profile__description");

// New Post Modal
const addPostButton = document.querySelector(".profile__add-button");
const newPostModal = document.querySelector(".modal_type_new-post");
const newPostForm = newPostModal.querySelector(".modal__form");
const imageLinkInput = newPostModal.querySelector(
  ".modal__input_type_image-link"
);
const captionInput = newPostModal.querySelector(".modal__input_type_caption");

// Image Preview Modal
const imageModal = document.querySelector(".modal_type_image");
const imagePreview = imageModal.querySelector(".modal__image");
const imageCaption = imageModal.querySelector(".modal__caption");

function openModal(modal) {
  modal.classList.add("modal_opened");
}

function closeModal(modal) {
  modal.classList.remove("modal_opened");
}

function openEditProfileModal() {
  nameInput.value = profileNameElement.textContent;
  jobInput.value = profileJobElement.textContent;
  openModal(editProfileModal);
}

function openNewPostModal() {
  imageLinkInput.value = "";
  captionInput.value = "";
  openModal(newPostModal);
}

editProfileButton.addEventListener("click", openEditProfileModal);
addPostButton.addEventListener("click", openNewPostModal);

closeModalButtons.forEach((button) => {
  const modal = button.closest(".modal");
  button.addEventListener("click", () => closeModal(modal));
});

// Handles profile form submission
function handleProfileFormSubmit(evt) {
  evt.preventDefault();
  profileNameElement.textContent = nameInput.value;
  profileJobElement.textContent = jobInput.value;
  closeModal(editProfileModal);
}

// Handles new post form submission
function handleNewPostFormSubmit(evt) {
  evt.preventDefault();
  const newCard = {
    name: captionInput.value,
    link: imageLinkInput.value,
  };
  const cardElement = getCardElement(newCard);
  cardList.prepend(cardElement);
  closeModal(newPostModal);
  newPostForm.reset();
}

profileFormElement.addEventListener("submit", handleProfileFormSubmit);
newPostForm.addEventListener("submit", handleNewPostFormSubmit);

const cardTemplate = document.querySelector("#card-template").content;
const cardList = document.querySelector(".gallery__cards");

function handleCardClick(cardImage, cardTitle) {
  imagePreview.src = cardImage.src;
  imagePreview.alt = cardImage.alt;
  imageCaption.textContent = cardTitle.textContent;
  openModal(imageModal);
}

function getCardElement(data) {
  const cardElement = cardTemplate.querySelector(".card").cloneNode(true);
  const cardImage = cardElement.querySelector(".card__image");
  const cardTitle = cardElement.querySelector(".card__title");
  const likeButton = cardElement.querySelector(".card__like-button");
  const deleteButton = cardElement.querySelector(".card__delete-button");

  // Set card content
  cardImage.src = data.link;
  cardImage.alt = data.name;
  cardTitle.textContent = data.name;

  likeButton.addEventListener("click", () => {
    likeButton.classList.toggle("card__like-button_active");
  });

  deleteButton.addEventListener("click", () => {
    cardElement.remove();
  });

  cardImage.addEventListener("click", () =>
    handleCardClick(cardImage, cardTitle)
  );

  return cardElement;
}

initialCards.forEach((cardData) => {
  const cardElement = getCardElement(cardData);
  cardList.append(cardElement);
});
