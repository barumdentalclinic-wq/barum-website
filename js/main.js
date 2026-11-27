// 모바일 햄버거 메뉴 토글
const menuToggle = document.getElementById('menuToggle');
const gnb = document.getElementById('gnb');

if (menuToggle && gnb) {
  menuToggle.addEventListener('click', () => {
    const isOpen = gnb.classList.toggle('open');
    menuToggle.classList.toggle('open', isOpen);
    menuToggle.setAttribute('aria-expanded', isOpen);
    menuToggle.setAttribute('aria-label', isOpen ? '메뉴 닫기' : '메뉴 열기');
  });

  // 메뉴 항목 클릭 시 자동 닫힘
  gnb.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      gnb.classList.remove('open');
      menuToggle.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

// ===== 히어로 배경 슬라이드쇼 =====
// images/clinic-1.jpg ~ clinic-6.jpg 중 실제 존재하는 사진만 골라 자동 전환합니다.
(function () {
  const slidesWrap = document.getElementById('heroSlides');
  if (!slidesWrap) return;

  const SLIDE_INTERVAL = 5000; // 전환 간격 (밀리초) — 5000 = 5초
  const paths = [1, 2, 3, 4, 5, 6].map((n) => 'images/clinic-' + n + '.jpg');
  const loaded = [];

  let checked = 0;
  paths.forEach((src) => {
    const img = new Image();
    img.onload = () => { loaded.push(src); done(); };
    img.onerror = done;
    img.src = src;
  });

  function done() {
    checked++;
    if (checked === paths.length) start();
  }

  function start() {
    if (loaded.length === 0) return; // 사진 없으면 그라데이션 배경 유지

    loaded.forEach((src, i) => {
      const slide = document.createElement('div');
      slide.className = 'hero-slide' + (i === 0 ? ' active' : '');
      slide.style.backgroundImage = 'url("' + src + '")';
      slidesWrap.appendChild(slide);
    });

    // 사진이 1장뿐이거나, 사용자가 모션 감소를 설정했으면 전환 없이 고정
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (loaded.length < 2 || reduceMotion) return;

    const slides = slidesWrap.querySelectorAll('.hero-slide');
    let current = 0;
    setInterval(() => {
      slides[current].classList.remove('active');
      current = (current + 1) % slides.length;
      slides[current].classList.add('active');
    }, SLIDE_INTERVAL);
  }
})();
