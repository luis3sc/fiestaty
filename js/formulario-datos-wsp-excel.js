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
// Validar cantidad de invitados
// -----------------------------
function validateInvitados() {
  const input = document.getElementById("invitados");
  const validationMessage = document.getElementById("invitados-validation");
  const value = parseInt(input.value);

  if (!isNaN(value) && value > 0) {
    validationMessage.textContent = "";
    input.setCustomValidity("");
  } else {
    validationMessage.textContent = "Falta completar";
    input.setCustomValidity("Número de invitados inválido");
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
    validationMessageElement.textContent = "Falta completar";
    phoneInputField.setCustomValidity("Número no válido");
  }
}

// -----------------------------
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
    validationMessage.textContent = "Falta completar";
    select.setCustomValidity("Selecciona una opción válida");
  }
}

// -----------------------------
// Función para convertir hora a AM/PM
// -----------------------------
function formatTimeToAMPM(time24) {
  if (!time24) return "";
  let [hours, minutes] = time24.split(":").map(Number);
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12; // convierte 0 -> 12 y 13-23 -> 1-11
  return `${hours}:${minutes.toString().padStart(2, "0")} ${ampm}`;
}

// -----------------------------
// Generar mensaje para WhatsApp
// -----------------------------
function generateWhatsAppMessage(horaFormateada) {
  const fullNumber = phoneInputField.value.trim();
  const nombre = document.getElementById("nombre").value;
  const gmail = document.getElementById("gmail").value;
  const tipoevento = document.getElementById("tipoevento").value;
  const fechaevento = document.getElementById("fechaevento").value;
  const lugarevento = document.getElementById("lugarevento").value;
  const invitados = document.getElementById("invitados").value;

  return `¡Hola! Quiero información sobre el servicio de decoración
\nDetalles del Pedido:
--------------------
*Cliente*
Nombre: *${nombre}*
Celular: *${fullNumber}*
Correo: *${gmail}*
--------------------
Detalles del evento
Tipo: *${tipoevento}*
Fecha: *${fechaevento}*
Lugar: *${lugarevento}*
Hora: *${horaFormateada}*
Cantidad de invitados: *${invitados}*
--------------------
¡Gracias!`;
}

// -----------------------------
// Enviar datos a WhatsApp
// -----------------------------
function sendDataToWhatsApp(horaFormateada) {
  const message = generateWhatsAppMessage(horaFormateada);
  const encodedMessage = encodeURIComponent(message);
  const whatsappNumber = "51989396941"; // tu número
  const fullNumber = phoneInputField.value.trim();

  if (fullNumber.length >= 9) {
    const whatsAppLink = `https://api.whatsapp.com/send?phone=${whatsappNumber}&text=${encodedMessage}`;
    window.open(whatsAppLink, "_blank");
  } else {
    alert("El número de teléfono no es válido");
  }
}

// -----------------------------
// Google Apps Script
// -----------------------------
const scriptURL = 'https://script.google.com/macros/s/AKfycbzK3iUmYj1AOLHP6YVzNupjc0y1q6U7PZWgcnpwy6TLal_wVtcfV98oNzNGpxf7XdnVNw/exec';
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
    // Convertir hora a AM/PM
    const horaInput = document.getElementById("horaevento").value;
    const horaConFormato = formatTimeToAMPM(horaInput);

    // Enviar a Google Sheets
    const formData = new FormData(form);
    formData.set("horaevento", horaConFormato); // reemplaza el valor con AM/PM

    for (let pair of formData.entries()) {
      console.log(pair[0] + ': ' + pair[1]);
    }

    fetch(scriptURL, { method: 'POST', body: formData })
      .then(() => {
        form.style.display = 'none';
        const nombreCompleto = document.getElementById("nombre").value.trim();
        const primeraPalabra = nombreCompleto.split(" ")[0];

        document.getElementById("nombre-usuario").textContent = primeraPalabra;

        messageDiv.style.display = 'flex';
      })
      .catch(() => {
        alert("Error al enviar los datos. Inténtalo nuevamente más tarde.");
      });

    // Enviar a WhatsApp
    sendDataToWhatsApp(horaConFormato);
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
document.getElementById("invitados").addEventListener("blur", validateInvitados);

// -----------------------------
// Inicializar
// -----------------------------
changeColorOnFocus();
validatePhoneNumber();