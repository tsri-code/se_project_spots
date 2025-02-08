// these are the base measurements we need for desktop
const desktopBase = {
  container: {
    height: 415,
    padding: {
      top: 32,
      bottom: 40,
      horizontal: 50,
    },
  },
  content: {
    height: 272,
    gap: 32,
  },
  fieldWrapper: {
    height: 78,
    gap: 8,
    marginBottom: 32,
  },
  error: {
    spacing: 2,
  },
};

// get the total height of all visible error messages
function getDesktopErrorHeight(formElement, settings) {
  const visibleErrors = formElement.querySelectorAll(`.${settings.errorClass}`);
  let totalErrorHeight = 0;

  visibleErrors.forEach((error) => {
    const errorRect = error.getBoundingClientRect();
    totalErrorHeight += errorRect.height + desktopBase.error.spacing;
  });

  return totalErrorHeight;
}

// handles moving the form elements when errors appear
// moves each element after an error message down
// moves the save button a tiny bit for polish
function adjustDesktopFieldWrapperPositions(formElement, settings) {
  const fieldWrappers = formElement.querySelectorAll(".modal__field-wrapper");
  let currentOffset = 0;
  let lastErrorHeight = 0;
  const isEditProfile = formElement.closest(".modal_type_edit");
  const errorCount = formElement.querySelectorAll(
    `.${settings.errorClass}`
  ).length;

  fieldWrappers.forEach((wrapper) => {
    const error = wrapper.querySelector(`.${settings.errorClass}`);
    if (error && error.classList.contains(settings.errorClass)) {
      const errorHeight = error.getBoundingClientRect().height;
      // edit profile needs less space when it has multiple errors
      const spacing =
        isEditProfile && errorCount > 1 ? 1 : desktopBase.error.spacing;
      currentOffset += errorHeight + spacing;
      lastErrorHeight = errorHeight;
    }

    const nextWrapper = wrapper.nextElementSibling;
    if (nextWrapper && currentOffset > 0) {
      nextWrapper.style.transform = `translateY(${currentOffset}px)`;
    }
  });

  const saveButton = formElement.querySelector(".modal__button");
  if (saveButton && lastErrorHeight > 0) {
    let buttonOffset;
    if (isEditProfile) {
      // edit profile needs the save button to move less, especially with multiple errors
      buttonOffset =
        errorCount > 1
          ? Math.floor(lastErrorHeight / 16)
          : Math.floor(lastErrorHeight / 8);
    } else {
      buttonOffset = Math.floor(lastErrorHeight / 8);
    }
    saveButton.style.transform = `translateY(${buttonOffset}px)`;
  }

  return currentOffset;
}

// main function that handles desktop modal growth
// first resets everything, then:
// 1. moves the elements down
// 2. grows the modal to fit
// 3. maintains the bottom gap
function adjustDesktopModalHeight(formElement, settings) {
  if (window.innerWidth <= 720) return;

  const modalContainer = formElement.closest(".modal__container");
  const contentWrapper = formElement.closest(".modal__content-wrapper");

  requestAnimationFrame(() => {
    // clean slate - reset all positions
    const allElements = formElement.querySelectorAll(
      ".modal__field-wrapper, .modal__button"
    );
    allElements.forEach((element) => {
      element.style.transform = "none";
    });
    modalContainer.style.height = "";
    contentWrapper.style.height = "";

    const totalOffset = adjustDesktopFieldWrapperPositions(
      formElement,
      settings
    );

    if (totalOffset > 0) {
      const containerHeight = modalContainer.offsetHeight;
      const contentHeight = contentWrapper.offsetHeight;

      // keep the gap at the bottom consistent
      const saveButton = formElement.querySelector(".modal__button");
      const saveButtonRect = saveButton.getBoundingClientRect();
      const modalRect = modalContainer.getBoundingClientRect();
      const currentBottomSpacing = modalRect.bottom - saveButtonRect.bottom;
      const additionalHeight = Math.max(0, totalOffset - currentBottomSpacing);

      // edit profile needs to grow less with multiple errors
      const isEditProfile = formElement.closest(".modal_type_edit");
      const errorCount = formElement.querySelectorAll(
        `.${settings.errorClass}`
      ).length;
      const growthFactor = isEditProfile && errorCount > 1 ? 0.75 : 1;

      modalContainer.style.height = `${
        containerHeight + (totalOffset + additionalHeight) * growthFactor
      }px`;
      contentWrapper.style.height = `${
        contentHeight + (totalOffset + additionalHeight) * growthFactor
      }px`;
    }
  });
}

// make this available to validation.js
window.adjustDesktopModalHeight = adjustDesktopModalHeight;
