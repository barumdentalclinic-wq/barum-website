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

// ===== 이달의 휴진 달력 (자동 생성) =====
(function () {
  const wrap = document.getElementById('clinicCalendar');
  if (!wrap) return;

  // ✏️ 공휴일 목록 — 새해가 되면 다음 해 공휴일을 추가해 주세요 (YYYY-MM-DD)
  //    설날·추석 연휴, 대체공휴일은 달력을 확인해서 넣어주세요
  const HOLIDAYS = [
    '2026-12-25', // 성탄절
    '2027-01-01', // 신정
    '2027-03-01', // 삼일절
    '2027-05-05', // 어린이날
    '2027-06-06', // 현충일
    '2027-08-15', // 광복절
    '2027-10-03', // 개천절
    '2027-10-09', // 한글날
    '2027-12-25', // 성탄절
  ];

  // ✏️ 임시 휴진일 — 병원 사정으로 쉬는 날을 여기에 추가 (예: '2026-12-31')
  const EXTRA_CLOSED = [
  ];

  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth(); // 0~11

  const title = document.getElementById('noticeTitle');
  if (title) title.textContent = (month + 1) + '월 휴진 안내';

  const pad = (n) => (n < 10 ? '0' + n : '' + n);
  const key = (d) => year + '-' + pad(month + 1) + '-' + pad(d);

  const firstDay = new Date(year, month, 1).getDay(); // 0=일
  const lastDate = new Date(year, month + 1, 0).getDate();

  let html = '<table class="cal-table"><thead><tr>';
  ['일', '월', '화', '수', '목', '금', '토'].forEach((d, i) => {
    html += '<th class="' + (i === 0 ? 'cal-sun' : i === 6 ? 'cal-sat' : '') + '">' + d + '</th>';
  });
  html += '</tr></thead><tbody><tr>';

  for (let i = 0; i < firstDay; i++) html += '<td></td>';

  for (let d = 1; d <= lastDate; d++) {
    const dow = (firstDay + d - 1) % 7;
    if (dow === 0 && d !== 1) html += '</tr><tr>';
    const isClosed = dow === 0 || HOLIDAYS.indexOf(key(d)) !== -1 || EXTRA_CLOSED.indexOf(key(d)) !== -1;
    let cls = isClosed ? 'cal-closed' : dow === 6 ? 'cal-satday' : '';
    if (d === today.getDate()) cls += ' cal-today';
    html += '<td class="' + cls.trim() + '"><span>' + d + '</span></td>';
  }
  html += '</tr></tbody></table>';
  wrap.innerHTML = html;
})();
