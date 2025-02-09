// Get all the DOM elements we need to work with
const editProfileButton = document.querySelector(
  validationSettings.editButtonSelector
);
const editProfileModal = document.querySelector(
  validationSettings.editModalSelector
);
const closeModalButtons = document.querySelectorAll(
  validationSettings.closeButtonSelector
);
const profileFormElement = document.forms[validationSettings.profileFormName];
const nameInput = profileFormElement.querySelector(
  validationSettings.nameInputSelector
);
const jobInput = profileFormElement.querySelector(
  validationSettings.descriptionInputSelector
);
const profileNameElement = document.querySelector(
  validationSettings.profileNameSelector
);
const profileJobElement = document.querySelector(
  validationSettings.profileDescriptionSelector
);
const addPostButton = document.querySelector(
  validationSettings.addButtonSelector
);
const newPostModal = document.querySelector(
  validationSettings.newPostModalSelector
);
const newPostForm = document.forms[validationSettings.newPostFormName];
const imageLinkInput = newPostForm.querySelector(
  validationSettings.imageLinkInputSelector
);
const captionInput = newPostForm.querySelector(
  validationSettings.captionInputSelector
);
const imageModal = document.querySelector(
  validationSettings.imageModalSelector
);
const imagePreview = imageModal.querySelector(validationSettings.imageSelector);
const imageCaption = imageModal.querySelector(
  validationSettings.captionSelector
);
const cardTemplate = document.querySelector(
  validationSettings.cardTemplateSelector
).content;
const cardList = document.querySelector(validationSettings.cardListSelector);

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

// Store the last entered values
let lastEnteredName = "";
let lastEnteredJob = "";
let lastEnteredCaption = "";
let lastEnteredImageLink = "";

// Close modal when Escape key is pressed
function handleEscClose(evt) {
  if (evt.key === "Escape") {
    const openedModal = document.querySelector(
      `.${validationSettings.modalOpenedClass}`
    );
    if (openedModal) {
      closeModal(openedModal);
    }
  }
}

// Show modal and set up escape key listener
function openModal(modal) {
  modal.classList.add(validationSettings.modalOpenedClass);
  document.addEventListener("keydown", handleEscClose);
}

// Hide modal and remove escape key listener
function closeModal(modal) {
  // Store the current values before closing modals
  if (modal === editProfileModal) {
    lastEnteredName = nameInput.value;
    lastEnteredJob = jobInput.value;
  } else if (modal === newPostModal) {
    lastEnteredCaption = captionInput.value;
    lastEnteredImageLink = imageLinkInput.value;
  }
  modal.classList.remove(validationSettings.modalOpenedClass);
  document.removeEventListener("keydown", handleEscClose);
}

// Open Edit Profile modal and fill in current values
function openEditProfileModal() {
  // Use last entered values if they exist, otherwise use saved profile values
  if (lastEnteredName || lastEnteredJob) {
    nameInput.value = lastEnteredName;
    jobInput.value = lastEnteredJob;
  } else {
    nameInput.value = profileNameElement.textContent.trim();
    jobInput.value = profileJobElement.textContent.trim();
  }

  // Check validity of the form with current values
  const inputList = [nameInput, jobInput];
  const buttonElement = profileFormElement.querySelector(
    validationSettings.submitButtonSelector
  );
  toggleButtonState(inputList, buttonElement, validationSettings);

  openModal(editProfileModal);
}

// Open New Post modal and fill in last entered values if they exist
function openNewPostModal() {
  if (lastEnteredCaption || lastEnteredImageLink) {
    captionInput.value = lastEnteredCaption;
    imageLinkInput.value = lastEnteredImageLink;
  } else {
    newPostForm.reset();
  }

  // Check validity of the form with current values
  const inputList = [captionInput, imageLinkInput];
  const buttonElement = newPostForm.querySelector(
    validationSettings.submitButtonSelector
  );
  toggleButtonState(inputList, buttonElement, validationSettings);

  openModal(newPostModal);
}

// Save profile changes and close modal
function handleProfileFormSubmit(evt) {
  evt.preventDefault();
  profileNameElement.textContent = nameInput.value;
  profileJobElement.textContent = jobInput.value;
  // Clear the stored values since we've saved them
  lastEnteredName = "";
  lastEnteredJob = "";
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
  // Clear the stored values since we've saved them
  lastEnteredCaption = "";
  lastEnteredImageLink = "";
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
      validationSettings.closeButtonImageSelector
    );

    // Set image orientation class
    if (imagePreview.naturalWidth > imagePreview.naturalHeight) {
      imagePreview.classList.add(validationSettings.imageLandscapeClass);
      imagePreview.classList.remove(validationSettings.imagePortraitClass);
    } else {
      imagePreview.classList.add(validationSettings.imagePortraitClass);
      imagePreview.classList.remove(validationSettings.imageLandscapeClass);
    }

    // Position close button and caption after image dimensions are known
    requestAnimationFrame(() => {
      const imageRect = imagePreview.getBoundingClientRect();
      const buttonSize = 40;
      const gap = 10;

      // Adjust close button position based on screen size
      if (window.innerWidth > 769) {
        closeButton.style.top = "0";
        closeButton.style.left = `${imageRect.width + gap}px`;
        closeButton.style.right = "auto";
      } else {
        closeButton.style.top = "-48px";
        closeButton.style.right = "-8px";
        closeButton.style.left = "auto";
      }

      // Position caption relative to image
      const imageHeight = imageRect.height;
      if (window.innerWidth > 769) {
        imageCaption.style.top = `${imageHeight + gap}px`;
        imageCaption.style.left = "0";
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
  const cardElement = cardTemplate
    .querySelector(validationSettings.cardSelector)
    .cloneNode(true);
  const cardImage = cardElement.querySelector(
    validationSettings.cardImageSelector
  );
  const cardTitle = cardElement.querySelector(
    validationSettings.cardTitleSelector
  );
  const likeButton = cardElement.querySelector(
    validationSettings.cardLikeButtonSelector
  );
  const deleteButton = cardElement.querySelector(
    validationSettings.cardDeleteButtonSelector
  );

  // Set up card content
  cardImage.src = data.link;
  cardImage.alt = data.name;
  cardTitle.textContent = data.name;

  // Add card interactions
  likeButton.addEventListener("click", () => {
    likeButton.classList.toggle(validationSettings.cardLikeActiveClass);
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
  const modal = button.closest(validationSettings.modalSelector);
  button.addEventListener("click", () => closeModal(modal));
});

// Close modal by clicking overlay
const modals = document.querySelectorAll(validationSettings.modalSelector);
modals.forEach((modal) => {
  modal.addEventListener("mousedown", (evt) => {
    if (
      evt.target.classList.contains(validationSettings.modalSelector.slice(1))
    ) {
      closeModal(modal);
    }
  });

  modal.addEventListener("touchstart", (evt) => {
    if (
      evt.target.classList.contains(validationSettings.modalSelector.slice(1))
    ) {
      closeModal(modal);
    }
  });
});

// Load initial cards
initialCards.forEach((cardData) => {
  renderCard(cardData, "append");
});
