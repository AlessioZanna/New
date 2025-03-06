// Configurazione IndexedDB
const dbName = "musicNotesApp";
let db;

const request = indexedDB.open(dbName, 1);

request.onerror = function (event) {
  console.log("Errore nell'aprire il database IndexedDB:", event);
};

request.onsuccess = function (event) {
  db = event.target.result;
  loadChats(); // Carica le chat appena il database è pronto
};

request.onupgradeneeded = function (event) {
  db = event.target.result;
  if (!db.objectStoreNames.contains("chats")) {
    db.createObjectStore("chats", { keyPath: "name" });
  }
};

// Funzione per salvare una chat nel database
function saveChat(chat) {
    const transaction = db.transaction(["chats"], "readwrite");
    const objectStore = transaction.objectStore("chats");
  
    const request = objectStore.put(chat);
  
    request.onsuccess = function () {
      console.log("Chat salvata con successo");
    };
  
    request.onerror = function (event) {
      console.log("Errore nel salvataggio della chat:", event);
    };
  }
  
  // Funzione per salvare le note della chat corrente
  function saveNotes() {
    const notes = [];
    const noteBlocks = noteContainer.getElementsByClassName("note-block");
  
    Array.from(noteBlocks).forEach(block => {
      const noteTitle = block.querySelector(".note-title").textContent.trim();
      const noteText = block.querySelector(".note-text").textContent.trim();
  
      if (noteTitle || noteText) {
        notes.push({ title: noteTitle, text: noteText });
      }
    });
  
    // Aggiornare le note nella chat corrente
    const transaction = db.transaction(["chats"], "readwrite");
    const objectStore = transaction.objectStore("chats");
    const request = objectStore.get(currentChatName);
  
    request.onsuccess = function (event) {
      const chatData = event.target.result;
      chatData.notes = notes;
      objectStore.put(chatData);
    };
  
    request.onerror = function (event) {
      console.log("Errore nel salvataggio delle note:", event);
    };
  }