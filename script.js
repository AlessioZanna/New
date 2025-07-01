// Elementi della pagina
const homePage = document.getElementById("home-page");
const chatPage = document.getElementById("chat-page");
const chatList = document.getElementById("chat-list");
const noteContainer = document.getElementById("note-container");
const addChatButton = document.getElementById("add-chat");
const backButton = document.getElementById("back-button");
const chatTitle = document.getElementById("chat-title");
// Variabile globale per tracciare la chat corrente
let currentChatName = "";

/* HOME PAGE & CHAT PAGE ---------------------------------------------------------------------------------------------------------- */

// Funzione per far partire l'app dalla home page
document.addEventListener("DOMContentLoaded", () => {
  homePage.style.display = "block";
  chatPage.style.display = "none";
});

// Funzione per aprire una chat
function openChat(name) {
  currentChatName = name; // Aggiorna la chat corrente
  homePage.style.display = "none";
  chatPage.style.display = "block";
  chatTitle.innerText = name;
  noteContainer.innerHTML = ""; // Pulire il contenitore delle note
  loadNotes(); // Caricare le note specifiche per questa chat
}

// Tornare alla homepage
backButton.addEventListener("click", () => {
  currentChatName = ""; // Resetta la chat corrente
  chatPage.style.display = "none";
  homePage.style.display = "block";
});

// Aggiungere una nuova chat
addChatButton.addEventListener("click", () => {
  const chatName = prompt("Titolo:");
  if (!chatName) return; // Interrompe l'esecuzione se il nome della chat non è stato inserito

  const artistName = prompt("Info:");
  if (!artistName) return; // Interrompe l'esecuzione se il nome dell'artista non è stato inserito

  // Creazione dell'elemento chat
  const chatItem = document.createElement("div");
  chatItem.classList.add("chat-item");
  chatItem.style.position = "relative"; // Per posizionare meglio gli elementi
  chatItem.style.marginTop = "25px"; // Sposta il contenuto più in basso
  chatItem.addEventListener("click", () => openChat(chatName));

  // Creazione del contenitore per il nome della canzone e l'artista
  const textContainer = document.createElement("div");
  textContainer.style.display = "flex";
  textContainer.style.flexDirection = "column";
  textContainer.style.position = "absolute";
  textContainer.style.left = "85px"; // Mantiene la posizione originale
  textContainer.innerHTML = `
      <span>${chatName}</span>
      <span class="artist-name">${artistName}</span>
  `;

  // Creazione dei tre puntini (opzioni)
  const opt = document.createElement("button");
  opt.classList.add("opt");
  opt.setAttribute("data-title", chatName);
  opt.innerHTML = `<i class="fa-solid fa-ellipsis"></i>`;
  opt.style.position = "absolute";
  opt.style.right = "0px";
  opt.style.top = "50%";
  opt.style.fontSize = "20px";
  opt.style.transform = "translateY(-50%)";
  opt.addEventListener("click", (event) => {
    event.stopPropagation();
    apriMenu(event.currentTarget);
  });

  // Creazione dell'input file (quadrato rosso)
  const foto = document.createElement("input");
  foto.type = "file";
  foto.id = "file-input";
  foto.classList.add("foto");
  foto.accept = "image/*";
  foto.style.position = "absolute";
  foto.style.left = "15px";
  foto.style.top = "50%";
  foto.style.transform = "translateY(-50%)";
  foto.addEventListener("change", previewImage);
  foto.addEventListener("click", (event) => event.stopPropagation());

  // Appendere gli elementi in ordine corretto
  chatItem.appendChild(foto);
  chatItem.appendChild(textContainer);
  chatItem.appendChild(opt);
  chatList.appendChild(chatItem);

  // Crea la chat vuota e salva
  const newChat = {
    name: chatName,
    artist: artistName,
    notes: [{ title: "Sezione", text: "Testo" }]
  };

  saveChat(newChat);
  openChat(chatName);
});

// Aggiungere un nuovo blocco di note
function addNoteBlock(title = "Sezione", text = "Testo") {
  const noteBlock = document.createElement("div"); // Creiamo un nuovo blocco di nota
  noteBlock.classList.add("note-block"); // Aggiungiamo la classe per il blocco di nota

  const noteTitle = document.createElement("div"); // Creiamo il titolo della nota
  noteTitle.classList.add("note-title"); // Aggiungiamo la classe per il titolo
  noteTitle.contentEditable = true; // Impostiamo il titolo come modificabile
  noteTitle.textContent = title; // Impostiamo il titolo iniziale

  const noteText = document.createElement("div");
  noteText.classList.add("note-text");
  noteText.contentEditable = true;
  noteText.textContent = text;

  // Crea il pulsante di trascinamento per spostare il blocco
  const dragHandle = document.createElement("div");
  dragHandle.classList.add("drag-handle");
  dragHandle.innerHTML = ` 
<div class="contai"><i class="fa-solid fa-grip-lines"></i></div> 
`;

  // Aggiungiamo il pulsante di trascinamento al blocco
  noteBlock.appendChild(dragHandle);

  // Disabilitiamo il drag nativo del blocco
  noteBlock.setAttribute("draggable", false);

  // Aggiungiamo il supporto touch per il drag handle
  dragHandle.addEventListener("touchstart", (event) => {
    event.preventDefault();

    const touch = event.touches[0];
    const startX = touch.clientX;
    const startY = touch.clientY;

    const blockRect = noteBlock.getBoundingClientRect();
    const offsetX = startX - blockRect.left;
    const offsetY = startY - blockRect.top;

    // Aggiungiamo uno stile temporaneo al blocco durante il trascinamento
    noteBlock.classList.add("dragging");

    const containerRect = noteContainer.getBoundingClientRect();

    const moveHandler = (moveEvent) => {
      const moveTouch = moveEvent.touches[0];
      const newX = moveTouch.clientX - offsetX;
      const newY = moveTouch.clientY - offsetY;

      // Mantieni il blocco entro i limiti del contenitore
      const boundedX = Math.max(containerRect.left, Math.min(newX, containerRect.right - blockRect.width));
      const boundedY = Math.max(containerRect.top, Math.min(newY, containerRect.bottom - blockRect.height));

      // Aggiorna posizione visiva del blocco
      noteBlock.style.left = `${boundedX - containerRect.left}px`;
      noteBlock.style.top = `${boundedY - containerRect.top}px`;

      // Calcola la posizione e inserisce dinamicamente il blocco
      const afterElement = getDragAfterElement(noteContainer, moveTouch.clientY);
      if (afterElement == null) {
        noteContainer.appendChild(noteBlock); // Se nessun elemento trovato, aggiungi alla fine
      } else {
        noteContainer.insertBefore(noteBlock, afterElement); // Inserisci prima del blocco target
      }
    };

    const endHandler = () => {
      // Ripristina stile iniziale
      noteBlock.classList.remove("dragging");
      noteBlock.style.position = "static";
      noteBlock.style.zIndex = "";

      // Rimuovi gli eventi di trascinamento
      document.removeEventListener("touchmove", moveHandler);
      document.removeEventListener("touchend", endHandler);

      // Salva la nuova disposizione (funzione da implementare)
      saveNotes();
    };

    // Aggiungi eventi per movimento e rilascio
    document.addEventListener("touchmove", moveHandler, { passive: false });
    document.addEventListener("touchend", endHandler);
  }, { passive: false });

  // Funzione per trovare l'elemento dopo il quale inserire il blocco
  function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll(".note-block:not(.dragging)")];

    console.log(draggableElements); // Debug: vedi gli altri blocchi di note

    let closest = null;
    let closestOffset = Number.POSITIVE_INFINITY;

    draggableElements.forEach((child) => {
      const box = child.getBoundingClientRect();
      const offset = y - (box.top + box.height / 2);

      if (offset < 0 && Math.abs(offset) < closestOffset) {
        closestOffset = Math.abs(offset);
        closest = child;
      }
    });

    console.log(closest); // Debug: vedi quale blocco è più vicino
    return closest;
  }





















  /* ----------------------------------------------------------------------------------------------------------------------------- */
  const DB_NAME = "musicNotesApp2";
  const STORE_NAME = "audios";
  let db2;
  
  let currentAudio = null;
  const rec = document.createElement("div");
  rec.classList.add("rec");
  noteBlock.appendChild(rec);
  
  let isRecording = false;
  let recorder;
  let audioContext;
  
  const initDB = () => {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, 1);
      request.onupgradeneeded = (event) => {
        db2 = event.target.result;
        if (!db2.objectStoreNames.contains(STORE_NAME)) {
          db2.createObjectStore(STORE_NAME, { keyPath: "id", autoIncrement: true });
        }
      };
      request.onsuccess = (event) => resolve(event.target.result);
      request.onerror = (event) => reject("Errore database: " + event.target.errorCode);
    });
  };
  
  const saveAudio = (audioBlob) => {
    return new Promise((resolve, reject) => {
      const transaction = db2.transaction(STORE_NAME, "readwrite");
      const store = transaction.objectStore(STORE_NAME);
      store.clear().onsuccess = () => {
        store.add({ audio: audioBlob, timestamp: new Date() })
          .onsuccess = (e) => resolve(e.target.result);
      };
    });
  };
  
  const loadAudios = () => {
    return new Promise((resolve) => {
      const transaction = db2.transaction(STORE_NAME, "readonly");
      const store = transaction.objectStore(STORE_NAME);
      store.getAll().onsuccess = (e) => resolve(e.target.result);
    });
  };
  
  const deleteAudio = (id) => {
    return new Promise((resolve) => {
      const transaction = db2.transaction(STORE_NAME, "readwrite");
      transaction.objectStore(STORE_NAME).delete(id).onsuccess = () => resolve();
    });
  };
  
  const startEvent = "ontouchstart" in window ? "touchstart" : "click";
  
  (async function initApp() {
    try {
      db2 = await initDB();
      const audios = await loadAudios();
      if (audios.length > 0) {
        const lastAudio = audios[audios.length - 1];
        const audioUrl = URL.createObjectURL(new Blob([lastAudio.audio], { type: 'audio/wav' }));
        rec.setAttribute("data-audio", audioUrl);
        rec.setAttribute("data-id", lastAudio.id);
      }
    } catch (error) {
      console.error("Errore inizializzazione:", error);
    }
  })();
  
  // Registrazione
  rec.addEventListener(startEvent, (event) => {
    if (rec.getAttribute("data-audio")) return;
    event.cancelable && event.preventDefault();
    
    !isRecording ? checkMicrophonePermission().then(has => has && startRecording())
                : stopRecording();
  });
  
  // Gestione touch
  let pressTimer, wasLongPress = false;
  
  rec.addEventListener("touchstart", (event) => {
    if (!rec.getAttribute("data-audio")) {
      event.cancelable && event.preventDefault();
      return;
    }
    pressTimer = setTimeout(() => {
      confirm("Cancellare la registrazione?") && resetButton();
      wasLongPress = true;
    }, 1000);
  });
  
  rec.addEventListener("touchend", (event) => {
    clearTimeout(pressTimer);
    if (!rec.getAttribute("data-audio") || isRecording) return;
    
    event.preventDefault();
    setTimeout(() => wasLongPress = false, 100);
    
    if (!wasLongPress) playRecording(rec);
  });
  
  // Gestione desktop
  rec.addEventListener("click", (event) => {
    if ('ontouchstart' in window || !rec.getAttribute("data-audio") || isRecording) return;
    playRecording(rec);
  });
  
  function playRecording(rec) {
    if (currentAudio && !currentAudio.paused) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
      rec.classList.remove("playing");
      return;
    }
    
    currentAudio = new Audio(rec.getAttribute("data-audio"));
    currentAudio.play();
    currentAudio.onended = () => rec.classList.remove("playing");
    rec.classList.add("playing");
  }
  
  // Resto delle funzioni rimane invariato
  function checkMicrophonePermission() {
    return navigator.permissions.query({ name: "microphone" })
      .then(permission => permission.state === "granted" || permission.state === "prompt")
      .catch(() => false);
  }
  
  function startRecording() {
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        recorder = new Recorder(audioContext.createMediaStreamSource(stream));
        recorder.record();
        isRecording = true;
        rec.classList.add("lampeggia");
      })
      .catch(err => alert(`Errore microfono: ${err.message}`));
  }
  
  function stopRecording() {
    if (recorder) {
      recorder.stop();
      isRecording = false;
      rec.classList.remove("lampeggia");
      recorder.exportWAV(async blob => {
        try {
          await initDB();
          const audioId = await saveAudio(blob);
          const audioUrl = URL.createObjectURL(blob);
          rec.setAttribute("data-audio", audioUrl);
          rec.setAttribute("data-id", audioId);
        } catch (error) { console.error("Salvataggio fallito:", error); }
      });
    }
  }
  
  async function resetButton() {
    const audioId = rec.getAttribute("data-id");
    if (audioId) {
      await deleteAudio(Number(audioId));
      URL.revokeObjectURL(rec.getAttribute("data-audio"));
      rec.removeAttribute("data-audio");
      rec.removeAttribute("data-id");
    }
    isRecording && (recorder.stop(), isRecording = false, rec.classList.remove("lampeggia"));
  }
  
  function stopAudio() {
    document.querySelectorAll("audio").forEach(audio => audio.pause());
  }

  /* ----------------------------------------------------------------------------------------------------------------------------- */













  // Aggiungere il pulsante di cancellazione (X)
  const deleteButton = document.createElement("button");
  deleteButton.classList.add("delete-btn");
  deleteButton.innerHTML = '<i class="fas fa-times"></i>'; // Icona "X" di Font Awesome
  /*   deleteButton.innerHTML = "&#10006;"; */
  deleteButton.addEventListener("click", () => {
    const allNoteBlocks = document.querySelectorAll(".note-block");

    if (allNoteBlocks.length > 1) {
      if (confirm("Sei sicuro di voler eliminare questo paragrafo?")) {
        noteBlock.remove();
        saveNotes();
      }
    } else {
      if (confirm("Non puoi eliminare l'unica nota. Vuoi svuotarla e ripristinare i placeholder?")) {
        const noteTitle = noteBlock.querySelector(".note-title");
        const noteText = noteBlock.querySelector(".note-text");
        noteTitle.textContent = "Sezione";
        noteText.textContent = "Testo";
        saveNotes();
      }
    }
  });

  // Posiziona la X all'estremità destra del titolo
  const titleWrapper = document.createElement("div");
  titleWrapper.classList.add("note-title-wrapper");
  titleWrapper.appendChild(noteTitle);
  titleWrapper.appendChild(deleteButton);

  // Appendi il titolo, X e testo
  noteBlock.appendChild(titleWrapper);
  noteBlock.appendChild(noteText);
  noteContainer.appendChild(noteBlock);
  noteBlock.appendChild(dragHandle);

  // Salvare le modifiche sui cambiamenti
  const saveOnChange = () => saveNotes();
  noteTitle.addEventListener("input", saveOnChange);
  noteText.addEventListener("input", saveOnChange);

  // Funzionalità 1: il titolo può avere solo una riga
  noteTitle.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      noteText.focus(); // Passa al testo
    }
  });

  // Funzionalità 2: gestione di invio multiplo nella nota
  let enterCount = 0;

  noteText.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      enterCount++;
      if (enterCount === 3) {
        // Cancella gli ultimi due invii e aggiunge un nuovo blocco
        noteText.textContent = noteText.textContent.replace(/\n{2}$/, "");
        const newNoteBlock = addNoteBlock();
        saveNotes();
        enterCount = 0;

        // Passa al titolo del nuovo blocco
        newNoteBlock.querySelector(".note-title").focus();
      } else {
        document.execCommand("insertLineBreak");
      }
    } else {
      enterCount = 0;
    }
  });

  // Gestire il placeholder per noteTitle
  noteTitle.addEventListener("focus", () => {
    if (noteTitle.textContent === "Sezione") {
      noteTitle.textContent = "";
    }
  });

  // Gestire il placeholder per noteText
  noteText.addEventListener("focus", () => {
    if (noteText.textContent === "Testo") {
      noteText.textContent = "";
    }
  });

  noteText.addEventListener("blur", () => {
    if (noteText.textContent.trim() === "") {
      noteText.textContent = "Testo";
    }
  });

  // Gestione del placeholder per il paragrafo di default
  if (noteTitle.textContent === "Sezione") {
    noteTitle.addEventListener("focus", () => {
      if (noteTitle.textContent === "Sezione") {
        noteTitle.textContent = "";
      }
    });
    noteTitle.addEventListener("blur", () => {
      if (noteTitle.textContent.trim() === "") {
        noteTitle.textContent = "Sezione";
      }
    });
  }

  if (noteText.textContent === "Testo") {
    noteText.addEventListener("focus", () => {
      if (noteText.textContent === "Testo") {
        noteText.textContent = "";
      }
    });
    noteText.addEventListener("blur", () => {
      if (noteText.textContent.trim() === "") {
        noteText.textContent = "Testo";
      }
    });
  }

  // Funzionalità per modificare la nota con un solo click
  noteTitle.addEventListener("click", () => {
    noteTitle.contentEditable = true; // Permette di modificare il titolo
    noteTitle.focus();
  });

  noteText.addEventListener("click", () => {
    noteText.contentEditable = true; // Permette di modificare il testo
    noteText.focus();
  });

  return noteBlock;
}

// Caricare le note della chat corrente
function loadNotes() {
  const transaction = db.transaction(["chats"], "readonly");
  const objectStore = transaction.objectStore("chats");

  const request = objectStore.get(currentChatName);

  request.onsuccess = function (event) {
    const chatData = event.target.result;

    if (chatData) {
      chatData.notes.forEach(note => addNoteBlock(note.title, note.text));
    } else {
      addNoteBlock("Sezione", "Testo");
      saveNotes();
    }
  };

  request.onerror = function (event) {
    console.log("Errore nel caricamento delle note:", event);
  };
}

/* -------------------------------------------------------------------------------------------------------------------------------- carica le chat nella lista */

function loadChats() {
  const transaction = db.transaction(["chats"], "readonly");
  const objectStore = transaction.objectStore("chats");

  const request = objectStore.getAll();

  request.onsuccess = function (event) {
    const chats = event.target.result;
    chatList.innerHTML = ""; // Pulisce la lista esistente

    chats.forEach(chat => {
      const chatItem = document.createElement("div");
      chatItem.classList.add("chat-item");
      chatItem.addEventListener("click", () => openChat(chat.name));

      // Creazione del nome della canzone e artista
      const textContainer = document.createElement("div");
      textContainer.style.display = "flex";
      textContainer.style.flexDirection = "column";
      textContainer.style.left = "85px";
      textContainer.style.position = "absolute";
      textContainer.innerHTML = `
        <span>${chat.name}</span>
        <div class="artist-name">${chat.artist}</div>
      `;

      // Creazione dei tre puntini (opzioni)
      const opt = document.createElement("button");
      opt.classList.add("opt");
      opt.setAttribute("data-title", chat.name);
      opt.innerHTML = `<i class="fa-solid fa-ellipsis"></i>`;
      opt.style.fontSize = "20px";
      opt.addEventListener("click", (event) => {
        event.stopPropagation();
        apriMenu(event.currentTarget);
      });

      // Creazione dell'input file (quadrato rosso)
      const foto = document.createElement("input");
      foto.type = "file";
      foto.id = "file-input";
      foto.classList.add("foto");
      foto.accept = "image/*";
      foto.addEventListener("change", previewImage);
      foto.addEventListener("click", (event) => event.stopPropagation());

      // Appendere gli elementi in ordine
      chatItem.appendChild(textContainer);
      chatItem.appendChild(foto);
      chatItem.appendChild(opt);
      chatList.appendChild(chatItem);
    });
  };

  request.onerror = function (event) {
    console.log("Errore nel caricamento delle chat:", event);
  };
}