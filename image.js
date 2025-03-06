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