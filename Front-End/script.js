document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Mobile nav toggle ---------- */
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.querySelector('.nav-links');
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
    });
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => navLinks.classList.remove('open'));
    });
  }

  /* ---------- Generic slide-based carousel (hero) ---------- */
  function createSlideCarousel({ slideSelector, prevBtn, nextBtn, dotsContainer, autoplayMs }) {
    const slides = document.querySelectorAll(slideSelector);
    if (!slides.length) return;
    let current = 0;
    let timer;

    const dots = dotsContainer ? Array.from(dotsContainer.querySelectorAll('.dot')) : [];

    function goTo(index) {
      slides[current].classList.remove('active');
      if (dots[current]) dots[current].classList.remove('active');
      current = (index + slides.length) % slides.length;
      slides[current].classList.add('active');
      if (dots[current]) dots[current].classList.add('active');
    }

    function next() { goTo(current + 1); }
    function prev() { goTo(current - 1); }

    if (prevBtn) prevBtn.addEventListener('click', () => { next.paused = true; prev(); resetTimer(); });
    if (nextBtn) nextBtn.addEventListener('click', () => { next(); resetTimer(); });

    dots.forEach((dot, i) => {
      dot.addEventListener('click', () => { goTo(i); resetTimer(); });
    });

    function resetTimer() {
      if (!autoplayMs) return;
      clearInterval(timer);
      timer = setInterval(next, autoplayMs);
    }
    resetTimer();

    return { goTo, next, prev };
  }

  createSlideCarousel({
    slideSelector: '.hero-slider .slide',
    prevBtn: document.getElementById('heroPrev'),
    nextBtn: document.getElementById('heroNext'),
    dotsContainer: document.getElementById('heroDots'),
    autoplayMs: 6000
  });

  /* ---------- Menu banner slider (track-based, 5 banners) ---------- */
  (function bannerSlider() {
    const track = document.getElementById('bannerTrack');
    if (!track) return;
    const slides = track.querySelectorAll('.banner-slide');
    const total = slides.length;
    let current = 0;
    let timer;

    function render() {
      track.style.transform = `translateX(-${current * (100 / total)}%)`;
    }

    function goTo(index) {
      current = (index + total) % total;
      render();
    }
    function next() { goTo(current + 1); }
    function prev() { goTo(current - 1); }

    const prevBtn = document.getElementById('bannerPrev');
    const nextBtn = document.getElementById('bannerNext');
    if (prevBtn) prevBtn.addEventListener('click', () => { prev(); resetTimer(); });
    if (nextBtn) nextBtn.addEventListener('click', () => { next(); resetTimer(); });

    function resetTimer() {
      clearInterval(timer);
      timer = setInterval(next, 5500);
    }
    resetTimer();
  })();

  /* ---------- Gallery carousel (scroll-based, 3 rows x 5 cols paged) ---------- */
  (function galleryCarousel() {
    const carousel = document.getElementById('galleryCarousel');
    if (!carousel) return;
    const prevBtn = document.getElementById('galleryPrev');
    const nextBtn = document.getElementById('galleryNext');
    const dotsContainer = document.getElementById('galleryDots');
    const items = carousel.querySelectorAll('.gallery-item');

    function getItemsPerPage() {
      // rows visible depends on breakpoint (matches CSS grid-template-rows)
      const width = window.innerWidth;
      const rows = width <= 680 ? 1 : width <= 1024 ? 2 : 3;
      const cols = width <= 680 ? 1 : width <= 1024 ? 4 : 5;
      return rows * cols;
    }

    function getPageCount() {
      return Math.ceil(items.length / getItemsPerPage());
    }

    function buildDots() {
      dotsContainer.innerHTML = '';
      const pageCount = getPageCount();
      for (let i = 0; i < pageCount; i++) {
        const dot = document.createElement('button');
        dot.className = 'dot' + (i === 0 ? ' active' : '');
        dot.setAttribute('aria-label', 'Gallery page ' + (i + 1));
        dot.addEventListener('click', () => scrollToPage(i));
        dotsContainer.appendChild(dot);
      }
    }

    function scrollToPage(pageIndex) {
      const pageWidth = carousel.clientWidth;
      carousel.scrollTo({ left: pageWidth * pageIndex, behavior: 'smooth' });
    }

    function currentPage() {
      const pageWidth = carousel.clientWidth || 1;
      return Math.round(carousel.scrollLeft / pageWidth);
    }

    function updateActiveDot() {
      const dots = dotsContainer.querySelectorAll('.dot');
      const page = currentPage();
      dots.forEach((d, i) => d.classList.toggle('active', i === page));
    }

    prevBtn.addEventListener('click', () => scrollToPage(Math.max(currentPage() - 1, 0)));
    nextBtn.addEventListener('click', () => scrollToPage(Math.min(currentPage() + 1, getPageCount() - 1)));

    carousel.addEventListener('scroll', () => {
      window.requestAnimationFrame(updateActiveDot);
    }, { passive: true });

    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        buildDots();
        updateActiveDot();
      }, 200);
    });

    buildDots();
  })();

});
