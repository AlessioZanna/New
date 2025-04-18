/* PAGINA CON TRASCINAMENTO ------------------------------------------------------------------------------------------------------- */

// Selezioniamo gli elementi HTML che useremo
const shape = document.getElementById('add-chat'); // Il cerchio
let startX = 0;  // Variabile per tenere traccia della posizione di inizio del drag
let isDragging = false;  // Indica se il cerchio è in fase di trascinamento

const maxWidth = 345; // Larghezza massima del rettangolo
const maxDistance = 70; // Distanza massima di trascinamento

// Funzione che viene chiamata all'inizio del trascinamento
const startDrag = (x) => {
  isDragging = true;
  startX = x; // Salva la posizione iniziale
  document.body.style.cursor = 'grabbing'; // Cambia il cursore per indicare il drag
};

// Funzione che calcola l'effetto del trascinamento
const drag = (x) => {
  if (!isDragging) return; // Se non stiamo trascinando, non fare nulla

  const deltaX = Math.abs(x - startX); // Calcola la distanza trascinata

  if (deltaX > 100) { //se trascino pr piu di 50 parte l'effetto sennò no

    // Calcola la proporzione di espansione del cerchio
    const scaleX = Math.min(deltaX / maxDistance, 1); // Limitato a 1 per evitare dimensioni troppo grandi

    // Aggiorna la larghezza in base alla proporzione
    const newWidth = 100 + scaleX * (maxWidth - 100);

    shape.style.width = `${newWidth}px`; // Imposta la nuova larghezza

    // Riduci il border-radius in base alla proporzione per ottenere un rettangolo
    shape.style.borderRadius = `${Math.max(50 - scaleX * 50, 0)}%`;

    // Se la larghezza ha raggiunto il massimo, cambia pagina
    if (newWidth >= maxWidth) {
      window.location.href = "musica.html"; // Reindirizza alla pagina 'musica.html'
    }

  }
};

// Funzione che viene chiamata quando il trascinamento finisce
const endDrag = () => {
  if (isDragging) {
    isDragging = false;
    document.body.style.cursor = 'default'; // Ripristina il cursore
  }
};

// Eventi per mouse
shape.addEventListener('mousedown', (e) => startDrag(e.clientX)); // Inizio del drag
document.addEventListener('mousemove', (e) => drag(e.clientX)); // Movimento del mouse
document.addEventListener('mouseup', endDrag); // Fine del drag

// Eventi per touch
shape.addEventListener('touchstart', (e) => {
  const touch = e.touches[0];
  startDrag(touch.clientX);
});
document.addEventListener('touchmove', (e) => {
  const touch = e.touches[0];
  drag(touch.clientX);
});
document.addEventListener('touchend', endDrag);