export const showError = (input, message) => {
  input.classList.add('is-invalid');
  const errorDiv = document.createElement('div');
  errorDiv.className = 'invalid-feedback d-block';
  errorDiv.textContent = message;
  // Usamos parentNode para ser más flexibles con la estructura del HTML
  input.parentNode.appendChild(errorDiv);
};