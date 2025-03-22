function previewImage(event) {
    const file = event.target.files[0]; // Prende il file selezionato
    const input = event.target;
  
    if (file) {
      const reader = new FileReader();
  
      reader.onload = function (e) {
        // Imposta l'immagine selezionata come sfondo dell'input
        input.style.backgroundImage = `url(${e.target.result})`;
        input.style.backgroundColor = 'transparent'; // Rimuove il colore di sfondo predefinito
      }
  
      reader.readAsDataURL(file); // Legge il file come URL
    }
  }

  // Aggiungi il file input nascosto per caricare immagini
const fileInput = document.createElement("input");
fileInput.type = "file";
fileInput.style.opacity = "0";  // Rendi trasparente
fileInput.style.position = "absolute";  // Rimuovilo dal layout visivo
fileInput.style.width = "0";  // Impedisci che occupi spazio
fileInput.style.height = "0";

fileInput.accept = "image/*";

// Aggiungi l'evento per cambiare immagine al file input
fileInput.addEventListener("change", (event) => {
  changePhoto(event, chatItem.querySelector(".chat-square"));
});

// Aggiungi il file input all'elemento chatItem
chatItem.appendChild(fileInput);

// Funzione per simulare il clic del file input
function choosePhoto(event) {
  const chatSquare = event.target;
  const parent = chatSquare.closest(".chat-item");
  const input = parent.querySelector("input[type='file']");
  input.click();
}

function changePhoto(event, chatSquare) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      // Imposta l'immagine come sfondo del quadrato
      chatSquare.style.backgroundImage = `url('${e.target.result}')`;
      chatSquare.style.backgroundSize = "cover";
      chatSquare.style.backgroundPosition = "center";
      chatSquare.style.border = "none"; // Rimuove il bordo quando c'è un'immagine
    };
    reader.readAsDataURL(file);
  }
}
