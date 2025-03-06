
function apriMenu(titoloCanzone) {
  document.getElementById("songTitle").innerText = titoloCanzone; // Imposta il titolo della canzone
  document.getElementById("songMenu").classList.add("show"); // Mostra il menu
  document.getElementById("home-overlay").style.display = "block"; // Mostra l'overlay
  document.getElementById("home-page").classList.add("blur"); // Applica la classe di opacità
}

function chiudiMenu() {
  document.getElementById("songMenu").classList.remove("show"); // Nasconde il menu
  document.getElementById("home-overlay").style.display = "none"; // Nascondi l'overlay
  document.getElementById("home-page").classList.remove("blur"); // Rimuovi la classe di opacità
}

// Funzioni di esempio per i pulsanti
function azione1() {
  alert("Azione 1 eseguita!");
}

function azione2() {
  alert("Azione 2 eseguita!");
}

// Aggiungere event listener ai 3 puntini di ogni chat
document.querySelectorAll(".menu-button").forEach(button => {
  button.addEventListener("click", function () {
    const titolo = this.getAttribute("data-title"); // Recupera il titolo della canzone
    apriMenu(titolo);
  });
});

// Chiude il menu se si clicca fuori dal contenuto del menu
document.addEventListener("click", function (event) {
  const menu = document.getElementById("songMenu");
  const menuContent = document.querySelector(".menuSotto-content");

  // Se il menu è aperto e il click non è dentro il menu-content, chiudi il menu
  if (menu.classList.contains("show") && !menuContent.contains(event.target)) {
    chiudiMenu();
  }
});



function openFileSelector() {
  // Apre il selettore di file
  document.getElementById('file-input').click();
}

document.getElementById('file-input').addEventListener('change', function (event) {
  const file = event.target.files[0]; // Prende il file selezionato
  if (file) {
    const reader = new FileReader();

    reader.onload = function (e) {
      // Imposta l'immagine all'interno del quadrato
      const imgElement = document.getElementById('image');
      imgElement.src = e.target.result;
    }

    reader.readAsDataURL(file); // Legge il file come URL
  }
});