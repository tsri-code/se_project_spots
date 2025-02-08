// Get all the DOM elements we need to work with
const editProfileButton = document.querySelector(".profile__edit-button");
const editProfileModal = document.querySelector(".modal_type_edit");
const closeModalButtons = document.querySelectorAll(".modal__close-button");
const profileFormElement = document.forms["profile-form"];
const nameInput = profileFormElement.querySelector(".modal__input_type_name");
const jobInput = profileFormElement.querySelector(
  ".modal__input_type_description"
);
const profileNameElement = document.querySelector(".profile__name");
const profileJobElement = document.querySelector(".profile__description");
const addPostButton = document.querySelector(".profile__add-button");
const newPostModal = document.querySelector(".modal_type_new-post");
const newPostForm = document.forms["new-post-form"];
const imageLinkInput = newPostForm.querySelector(
  ".modal__input_type_image-link"
);
const captionInput = newPostForm.querySelector(".modal__input_type_caption");
const imageModal = document.querySelector(".modal_type_image");
const imagePreview = imageModal.querySelector(".modal__image");
const imageCaption = imageModal.querySelector(".modal__caption");
const cardTemplate = document.querySelector("#card-template").content;
const cardList = document.querySelector(".gallery__cards");

// Sample cards to show when the page loads
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

// Close modal when Escape key is pressed
function handleEscClose(evt) {
  if (evt.key === "Escape") {
    const openedModal = document.querySelector(".modal_opened");
    if (openedModal) {
      closeModal(openedModal);
    }
  }
}

// Show modal and set up escape key listener
function openModal(modal) {
  modal.classList.add("modal_opened");
  document.addEventListener("keydown", handleEscClose);
}

// Hide modal and remove escape key listener
function closeModal(modal) {
  modal.classList.remove("modal_opened");
  document.removeEventListener("keydown", handleEscClose);
}

// Open Edit Profile modal and fill in current values
function openEditProfileModal() {
  nameInput.value = profileNameElement.textContent;
  jobInput.value = profileJobElement.textContent;
  resetValidation(profileFormElement, validationSettings);
  openModal(editProfileModal);
}

// Open New Post modal with empty form
function openNewPostModal() {
  newPostForm.reset();
  resetValidation(newPostForm, validationSettings);
  openModal(newPostModal);
}

// Save profile changes and close modal
function handleProfileFormSubmit(evt) {
  evt.preventDefault();
  profileNameElement.textContent = nameInput.value;
  profileJobElement.textContent = jobInput.value;
  closeModal(editProfileModal);
}

// Create new card and close modal
function handleNewPostFormSubmit(evt) {
  evt.preventDefault();
  const newCard = {
    name: captionInput.value,
    link: imageLinkInput.value,
  };
  renderCard(newCard, "prepend");
  closeModal(newPostModal);
  newPostForm.reset();
}

// Open image modal with clicked card's image
function handleCardClick(cardImage, cardTitle) {
  imagePreview.src = cardImage.src;
  imagePreview.alt = cardImage.alt;
  imageCaption.textContent = cardTitle.textContent;

  // Position elements after image loads
  imagePreview.onload = () => {
    const closeButton = imageModal.querySelector(
      ".modal__close-button_type_image"
    );

    // Set image orientation class
    if (imagePreview.naturalWidth > imagePreview.naturalHeight) {
      imagePreview.classList.add("modal__image_landscape");
      imagePreview.classList.remove("modal__image_portrait");
    } else {
      imagePreview.classList.add("modal__image_portrait");
      imagePreview.classList.remove("modal__image_landscape");
    }

    // Position close button and caption after image dimensions are known
    requestAnimationFrame(() => {
      const imageRect = imagePreview.getBoundingClientRect();
      const buttonSize = 40;
      const gap = 16;

      // Adjust close button position based on screen size
      if (window.innerWidth > 720) {
        closeButton.style.top = "30px";
        closeButton.style.right = "0";
        closeButton.style.left = "auto";
      } else {
        closeButton.style.top = "-48px";
        closeButton.style.right = "-8px";
        closeButton.style.left = "auto";
      }

      // Position caption relative to image
      const imageHeight = imageRect.height;
      if (window.innerWidth > 720) {
        imageCaption.style.top = `${imageHeight + 24}px`;
        imageCaption.style.left = "50px";
      } else {
        imageCaption.style.top = `${imageHeight - 10}px`;
        imageCaption.style.left = "0";
      }
    });
  };

  openModal(imageModal);
}

// Create a new card element from template
function getCardElement(data) {
  const cardElement = cardTemplate.querySelector(".card").cloneNode(true);
  const cardImage = cardElement.querySelector(".card__image");
  const cardTitle = cardElement.querySelector(".card__title");
  const likeButton = cardElement.querySelector(".card__like-button");
  const deleteButton = cardElement.querySelector(".card__delete-button");

  // Set up card content
  cardImage.src = data.link;
  cardImage.alt = data.name;
  cardTitle.textContent = data.name;

  // Add card interactions
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

// Add card to gallery
function renderCard(cardData, method = "prepend") {
  const cardElement = getCardElement(cardData);
  cardList[method](cardElement);
}

// Set up event listeners
editProfileButton.addEventListener("click", openEditProfileModal);
addPostButton.addEventListener("click", openNewPostModal);
profileFormElement.addEventListener("submit", handleProfileFormSubmit);
newPostForm.addEventListener("submit", handleNewPostFormSubmit);

// Set up close button listeners for all modals
closeModalButtons.forEach((button) => {
  const modal = button.closest(".modal");
  button.addEventListener("click", () => closeModal(modal));
});

// Close modal by clicking overlay
const modals = document.querySelectorAll(".modal");
modals.forEach((modal) => {
  modal.addEventListener("mousedown", (evt) => {
    if (evt.target.classList.contains("modal")) {
      closeModal(modal);
    }
  });

  modal.addEventListener("touchstart", (evt) => {
    if (evt.target.classList.contains("modal")) {
      closeModal(modal);
    }
  });
});

// Load initial cards
initialCards.forEach((cardData) => {
  renderCard(cardData, "append");
});
