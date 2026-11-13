const archive = document.querySelector('#archive');
const zoomButton = document.querySelector('#zoom-button');
const originalScan = document.querySelector('#original-scan');
let openingControl;

function openArchive(event) {
  event.preventDefault();
  openingControl = event.currentTarget;
  archive.showModal();
  document.body.classList.add('modal-open');
}

document.querySelectorAll('[data-original], #archive-button, #second-archive-button').forEach((control) => {
  control.addEventListener('click', openArchive);
});
document.querySelector('#close-archive').addEventListener('click', () => archive.close());
archive.addEventListener('close', () => {
  document.body.classList.remove('modal-open');
  openingControl?.focus();
});
archive.addEventListener('click', (event) => {
  if (event.target === archive) {
    const bounds = archive.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) archive.close();
  }
});
zoomButton.addEventListener('click', () => {
  const enlarged = originalScan.classList.toggle('enlarged');
  zoomButton.setAttribute('aria-pressed', String(enlarged));
  zoomButton.textContent = enlarged ? 'Fit page −' : 'Enlarge to read +';
});
document.querySelector('#print-button').addEventListener('click', () => window.print());
