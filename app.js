const archive = document.querySelector('#archive');
const archiveButton = document.querySelector('#archive-button');
const zoomButton = document.querySelector('#zoom-button');
const originalScan = document.querySelector('#original-scan');

archiveButton.addEventListener('click', () => {
  archive.showModal();
  document.body.classList.add('modal-open');
});
document.querySelector('#close-archive').addEventListener('click', () => archive.close());
archive.addEventListener('close', () => {
  document.body.classList.remove('modal-open');
  archiveButton.focus();
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
  zoomButton.textContent = enlarged ? 'Fit scan −' : 'Enlarge scan +';
});
document.querySelector('#print-button').addEventListener('click', () => window.print());
