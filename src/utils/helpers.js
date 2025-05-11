export function renderLoading(
  button,
  isLoading,
  defaultText = "Save",
  loadingText = "Saving..."
) {
  if (isLoading) {
    button.textContent = loadingText;
  } else {
    button.textContent = defaultText;
  }
}

// Universal form submit handler
export function handleSubmit(request, evt, loadingText = "Saving...") {
  evt.preventDefault();

  const submitButton = evt.submitter;
  const initialText = submitButton.textContent;

  renderLoading(submitButton, true, initialText, loadingText);

  request()
    .then(() => {
      evt.target.reset();
    })
    .catch(console.error)
    .finally(() => {
      renderLoading(submitButton, false, initialText);
    });
}
