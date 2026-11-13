const articleKey = new URLSearchParams(window.location.search).get('article');
const pageSelect = document.querySelector('#page-select');
const image = document.querySelector('#reader-image');
const viewport = document.querySelector('#reader-viewport');
const previous = document.querySelector('#previous-page');
const next = document.querySelector('#next-page');
const zoom = document.querySelector('#reader-zoom');
const continuation = document.querySelector('#continuation');
const positions = {
  aliyar: [0, 0.13], cabinet: [0.52, 0.32], city: [0.39, 0.39],
  council: [0, 0.52], space: [0.52, 0.55], markets: [0, 0.31],
  rice: [0.15, 0.36], rail: [0, 0.62], davis: [0.39, 0.71],
  rhodesia: [0.89, 0.57], bpcc: [0.77, 0.45], sabotage: [0.27, 0.83],
  robbery: [0.15, 0.93], overseas: [0.89, 0.32]
};
const continuations = { city: 3, council: 6, space: 7 };
let currentPage = 1;
let enlarged = true;
let focusArticle = true;

for (let page = 1; page <= 16; page += 1) {
  const option = document.createElement('option');
  option.value = String(page);
  option.textContent = `Page ${page}`;
  pageSelect.append(option);
}

function sourceForPage(page) {
  return page === 1 ? 'assets/sunday-standard-1966-11-13.png' : `assets/sunday-standard-page-${page}.png`;
}

function positionScan() {
  const position = currentPage === 1 && focusArticle ? positions[articleKey] : null;
  viewport.scrollTo({ left: position ? position[0] * image.clientWidth : 0, top: position ? position[1] * image.clientHeight : 0 });
}

function showPage(page) {
  currentPage = Math.max(1, Math.min(16, page));
  pageSelect.value = String(currentPage);
  previous.disabled = currentPage === 1;
  next.disabled = currentPage === 16;
  const source = sourceForPage(currentPage);
  image.src = source;
  image.alt = `Original newspaper page ${currentPage}, The Sunday Standard, November 13, 1966`;
  document.querySelector('#open-scan').href = source;
  document.querySelector('#external-source').href = `https://books.google.com/books?id=f5FlAAAAIBAJ&pg=PA${currentPage}`;
  document.querySelector('#page-status').textContent = `Page ${currentPage} of 16 · Original archive scan`;
}

image.addEventListener('load', positionScan);
image.addEventListener('error', () => {
  document.querySelector('#page-status').textContent = 'The scan could not load. Open the Google Books archive above to read this page.';
});
pageSelect.addEventListener('change', () => showPage(Number(pageSelect.value)));
previous.addEventListener('click', () => showPage(currentPage - 1));
next.addEventListener('click', () => showPage(currentPage + 1));
zoom.addEventListener('click', () => {
  enlarged = !enlarged;
  image.classList.toggle('fit-page', !enlarged);
  zoom.setAttribute('aria-pressed', String(enlarged));
  zoom.textContent = enlarged ? 'Fit page' : 'Enlarge to read';
  focusArticle = enlarged;
  positionScan();
});

async function loadArticle() {
  try {
    const response = await fetch('index.html');
    if (!response.ok) throw new Error('Front page unavailable');
    const documentSource = new DOMParser().parseFromString(await response.text(), 'text/html');
    const story = [...documentSource.querySelectorAll('.story')].find((section) => section.id === articleKey || section.classList.contains(articleKey));
    if (!story) {
      document.querySelector('#article-title').textContent = 'The complete newspaper';
      focusArticle = false;
      return;
    }
    const title = story.querySelector('h2').innerHTML.replace(/<br\s*\/?\s*>/gi, ' ');
    const plainTitle = new DOMParser().parseFromString(title, 'text/html').body.textContent;
    document.querySelector('#article-title').textContent = plainTitle;
    document.title = `${plainTitle} · The Sunday Standard`;
    document.querySelector('#article-byline').textContent = story.querySelector('.byline').textContent;
    document.querySelector('#back-link').href = `index.html#${story.id || 'front-page'}`;
    if (continuations[articleKey]) {
      continuation.hidden = false;
      continuation.append('This report continues on ');
      const button = document.createElement('button');
      button.textContent = `page ${continuations[articleKey]} →`;
      button.addEventListener('click', () => showPage(continuations[articleKey]));
      continuation.append(button);
      continuation.append('.');
    }
    if (image.complete) positionScan();
  } catch {
    document.querySelector('#article-title').textContent = 'Original newspaper article';
  }
}

showPage(1);
loadArticle();
