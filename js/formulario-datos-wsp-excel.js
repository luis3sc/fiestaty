// -----------------------------
// Inicializar campo de teléfono
// -----------------------------
const phoneInputField = document.getElementById("phone");
const validationMessageElement = document.getElementById("validation-message");

// -----------------------------
// Mantener color en focus/blur
// -----------------------------
function changeColorOnFocus() {
  const inputs = document.querySelectorAll(".inputhover, input, select");
  for (const input of inputs) {
    input.addEventListener("focus", () => input.classList.add("focused"));
    input.addEventListener("blur", () => input.classList.remove("focused"));
  }
}

// -----------------------------
// Validar número de teléfono
// -----------------------------
function validatePhoneNumber() {
  const fullNumber = phoneInputField.value.trim();
  const isValid = fullNumber.length >= 9; // Ajusta según tu estándar

  if (isValid) {
    validationMessageElement.textContent = "";
    phoneInputField.setCustomValidity("");
  } else {
    validationMessageElement.textContent = "Número no válido";
    phoneInputField.setCustomValidity("Número no válido");
  }
}

/// -----------------------------
// Validar longitud mínima de inputs
// -----------------------------
function validateMinLength(inputId, minLength, validationMessageId) {
  const input = document.getElementById(inputId);
  const validationMessage = document.getElementById(validationMessageId);

  if (input.value.trim().length >= minLength) {
    validationMessage.textContent = "";
    input.setCustomValidity("");
  } else {
    validationMessage.textContent = "Falta completar";
    input.setCustomValidity("Longitud mínima: " + minLength + " caracteres");
  }
}

// -----------------------------
// Validar select (tipoevento)
// -----------------------------
function validateSelect(selectId, validationMessageId) {
  const select = document.getElementById(selectId);
  const validationMessage = document.getElementById(validationMessageId);

  if (select.value.trim() !== "") {
    validationMessage.textContent = "";
    select.setCustomValidity("");
  } else {
    validationMessage.textContent = "Debes seleccionar un tipo de evento";
    select.setCustomValidity("Selecciona una opción válida");
  }
}
// -----------------------------
// Generar mensaje para WhatsApp
// -----------------------------
function generateWhatsAppMessage() {
  const fullNumber = phoneInputField.value.trim();
  const nombre = document.getElementById("nombre").value;
  const gmail = document.getElementById("gmail").value;
  const tipoevento = document.getElementById("tipoevento").value;
  const fechaevento = document.getElementById("fechaevento").value;
  const lugarevento = document.getElementById("lugarevento").value;
  const horaevento = document.getElementById("horaevento").value;

  return `¡Hola! Quiero información sobre el evento
\nDetalles del Pedido:
--------------------
*Cliente*
Nombre: *${nombre}*
Celular: *${fullNumber}*
Correo: *${gmail}*
--------------------
*Evento*
Tipo: *${tipoevento}*
Fecha: *${fechaevento}*
Lugar: *${lugarevento}*
Hora: *${horaevento}*
--------------------
¡Gracias!`;
}

// -----------------------------
// Enviar datos a WhatsApp
// -----------------------------
function sendDataToWhatsApp() {
  const fullNumber = phoneInputField.value.trim();
  const message = generateWhatsAppMessage();
  const encodedMessage = encodeURIComponent(message);
  const whatsappNumber = "51989396941"; // tu número

  if (fullNumber.length >= 9) {
    const whatsAppLink = `https://api.whatsapp.com/send?phone=${whatsappNumber}&text=${encodedMessage}`;
    window.open(whatsAppLink, "_blank");
  } else {
    alert("El número de teléfono no es válido");
  }
}

// -----------------------------
// Google Apps Script + Validación
// -----------------------------
const scriptURL = 'https://script.google.com/macros/s/AKfycbzpgiYWIBNuGXECqkmMSjs2M9TmFDh2JqKmqNHzbQHRXTMuzhzPH54eq-mmihu0Ng2SYA/exec';
const form = document.forms['google-sheet'];
const messageDiv = document.getElementById('mensaje');

form.addEventListener('submit', e => {
  e.preventDefault();

  // Validaciones
  validatePhoneNumber();
  validateMinLength("nombre", 3, "nombre-validation");
  validateMinLength("gmail", 3, "gmail-validation");
  validateSelect("tipoevento", "tipoevento-validation");
  validateMinLength("lugarevento", 3, "lugarevento-validation");

  if (
    phoneInputField.checkValidity() &&
    document.getElementById("nombre").checkValidity() &&
    document.getElementById("gmail").checkValidity() &&
    document.getElementById("tipoevento").checkValidity() &&
    document.getElementById("lugarevento").checkValidity()
  ) {
    // Enviar a Google Sheets
    fetch(scriptURL, { method: 'POST', body: new FormData(form) })
      .then(response => {
        if (response.ok) {
          form.style.display = 'none';
          messageDiv.style.display = 'block';
        } else {
          console.error('Error!', response.statusText);
          alert("Error al enviar los datos. Inténtalo nuevamente más tarde.");
        }
      })
      .catch(error => {
        console.error('Error!', error.message);
        alert("Error al enviar los datos. Inténtalo nuevamente más tarde.");
      });

    // Enviar a WhatsApp
    sendDataToWhatsApp();
  }
});

// -----------------------------
// Eventos blur/input
// -----------------------------
phoneInputField.addEventListener("input", validatePhoneNumber);
phoneInputField.addEventListener("blur", validatePhoneNumber);

document.getElementById("nombre").addEventListener("blur", () => validateMinLength("nombre", 3, "nombre-validation"));
document.getElementById("gmail").addEventListener("blur", () => validateMinLength("gmail", 3, "gmail-validation"));
document.getElementById("lugarevento").addEventListener("blur", () => validateMinLength("lugarevento", 3, "lugarevento-validation"));
document.getElementById("tipoevento").addEventListener("blur", () => validateSelect("tipoevento", "tipoevento-validation"));

// -----------------------------
// Inicializar
// -----------------------------
changeColorOnFocus();
validatePhoneNumber();