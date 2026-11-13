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
let currentPage = 1;
let startingPage = 1;
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
  const position = currentPage === startingPage && focusArticle ? positions[articleKey] : null;
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

function loadArticle() {
  try {
    const entries = [...document.querySelectorAll('.transcript-entry')];
    const selected = entries.find((entry) => entry.id === articleKey);
    if (!selected) {
      if (['chinthamani', 'cabinet', 'space', 'brighter', 'nehru', 'economy', 'temples'].includes(articleKey)) {
        window.location.replace(`articles/${encodeURIComponent(articleKey)}.html`);
        return;
      }
      document.querySelector('#transcription-note').textContent = 'Choose an article from the front page, or read the transcriptions below.';
      showPage(1);
      return;
    }
    const article = {
      title: selected.dataset.title,
      byline: selected.dataset.byline,
      page: Number(selected.dataset.page),
      continuation: Number(selected.dataset.continuation)
    };
    entries.forEach((entry) => { entry.hidden = entry !== selected; });
    document.querySelector('#article-title').textContent = article.title;
    document.title = `${article.title} · The Sunday Standard`;
    document.querySelector('#article-byline').textContent = article.byline;
    document.querySelector('#transcription-note').textContent = selected.querySelector('.transcript-note').textContent;
    selected.querySelector('h2').hidden = true;
    selected.querySelector('.transcript-byline').hidden = true;
    selected.querySelector('.transcript-note').hidden = true;
    document.querySelector('#back-link').href = `index.html#${articleKey === 'brighter' || articleKey === 'beatles' || articleKey === 'aliyar' ? articleKey : 'front-page'}`;
    startingPage = article.page;
    if (articleKey === 'brighter') positions.brighter = [0, 0.25];
    if (articleKey === 'beatles') positions.beatles = [0.5, 0.65];
    if (article.continuation) {
      continuation.hidden = false;
      continuation.append('Original continuation: ');
      const button = document.createElement('button');
      button.textContent = `page ${article.continuation} →`;
      button.addEventListener('click', () => showPage(article.continuation));
      continuation.append(button);
    }
    showPage(article.page);
  } catch {
    document.querySelectorAll('.transcript-entry').forEach((entry) => { entry.hidden = false; });
    document.querySelector('#transcription-note').textContent = 'The original transcriptions are included below.';
  }
}

loadArticle();
