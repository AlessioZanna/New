
function apriMenu(optButton) {
/*   document.getElementById("songTitle").innerText = titoloCanzone; // Imposta il titolo della canzone
  document.getElementById("songMenu").classList.add("show"); // Mostra il menu
  document.getElementById("home-overlay").style.display = "block"; // Mostra l'overlay
  document.getElementById("home-page").classList.add("blur"); // Applica la classe di opacità */
  
  
   optButton.style.display = "none";

   const plusButton = document.createElement("button");
plusButton.classList.add("plus-menu");
plusButton.innerHTML = `<i class="fa-solid fa-heart"></i>`;
plusButton.style.position = "absolute";
plusButton.style.right = "100px"; // Più a sinistra di closeButton (che è a 30px)
plusButton.style.top = "50%";
plusButton.style.transform = "translateY(-50%)";
plusButton.style.background = "none";
plusButton.style.outline = "none";
plusButton.style.color = "white";
plusButton.style.border = "none";
plusButton.style.fontSize = "20px";


  const closeButton = document.createElement("button");
  closeButton.classList.add("close-menu");
  closeButton.innerHTML = '<i class="fa-solid fa-shuffle"></i>';
  closeButton.style.position = "absolute";
  closeButton.style.right = "60px";
  closeButton.style.top = "50%";
  closeButton.style.transform = "translateY(-50%)";
  closeButton.style.background = "none";
  closeButton.style.outline = "none";
  closeButton.style.color = "white";
  closeButton.style.border = "none";
  closeButton.style.fontSize = "18px";

  const addButton = document.createElement("button");
  addButton.classList.add("add-menu");
  addButton.innerHTML = `<i class="fa-solid fa-xmark"></i>`; // NUOVA ICONA
  addButton.style.position = "absolute";
  addButton.style.right = "20px";
  addButton.style.top = "50%";
  addButton.style.transform = "translateY(-50%)";
  addButton.style.background = "none";
  addButton.style.outline = "none";
  addButton.style.color = "white";
  addButton.style.border = "none";
  addButton.style.fontSize = "25px";

  

  const parent = optButton.parentElement;

  const chiudiMenu = () => {
    plusButton.remove();
    closeButton.remove();
    addButton.remove();
    optButton.style.display = "block";
    document.removeEventListener("click", clickOutsideHandler);
    document.removeEventListener("touchmove", closeOnMove);
    document.removeEventListener("mousemove", closeOnMove);
  };

closeButton.addEventListener("click", (e) => {
  e.stopPropagation();

  const oldName = optButton.getAttribute("data-title");
  const titleSpan = parent.querySelector("span");
  const artistSpan = parent.querySelector(".artist-name");

  const newName = prompt("Nuovo titolo:", titleSpan?.textContent || oldName);
  const newArtist = prompt("Info:", artistSpan?.textContent || "");

  if (newName && newArtist && (newName !== oldName || newArtist !== artistSpan?.textContent)) {
    // Aggiorna visivamente
    if (titleSpan) titleSpan.textContent = newName;
    if (artistSpan) artistSpan.textContent = newArtist;
    optButton.setAttribute("data-title", newName);

    const transaction = db.transaction(["chats"], "readwrite");
    const store = transaction.objectStore("chats");

    const getRequest = store.get(oldName);

    getRequest.onsuccess = function (event) {
      const chatData = event.target.result;
      if (chatData) {
        // Rimuovi la vecchia voce
        store.delete(oldName);

        // Salva con i nuovi dati
        chatData.name = newName;
        chatData.artist = newArtist;
        store.add(chatData);
      }
    };

    getRequest.onerror = function () {
      alert("Errore durante la rinomina.");
    };
  }
});



addButton.addEventListener("click", (e) => {
  e.stopPropagation();

  const chatName = optButton.getAttribute("data-title");
  if (confirm(`Vuoi eliminare "${chatName}"?`)) {
    deleteChat(chatName); // Assicurati di avere una funzione che la elimina
    parent.remove(); // Rimuove visivamente l'elemento
  }
});


const isInsideMenu = (el) => {
  return el === optButton || el === closeButton || el === addButton || parent.contains(el);
};

const clickOutsideHandler = (e) => {
  if (!isInsideMenu(e.target)) {
    chiudiMenu();
  }
};

const closeOnMove = (e) => {
  // Serve a ignorare i movimenti *iniziali* su + o X
  if (e.target && !isInsideMenu(e.target)) {
    chiudiMenu();
  }
};


  // Aggiunge gli eventi globali con delay
  setTimeout(() => {
    document.addEventListener("click", clickOutsideHandler);
    document.addEventListener("touchmove", closeOnMove, { passive: true });
    document.addEventListener("mousemove", closeOnMove);
  }, 0);

  parent.appendChild(plusButton);
  parent.appendChild(closeButton);
  parent.appendChild(addButton);
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


function deleteChat(chatName) {
  const transaction = db.transaction(["chats"], "readwrite");
  const objectStore = transaction.objectStore("chats");

  const deleteRequest = objectStore.delete(chatName);

  deleteRequest.onsuccess = () => {
    console.log(`Chat "${chatName}" eliminata con successo.`);
    loadChats(); // Ricarica la lista aggiornata
  };

  deleteRequest.onerror = (event) => {
    console.error("Errore durante l'eliminazione della chat:", event);
    alert("Si è verificato un errore durante l'eliminazione della chat.");
  };
}
