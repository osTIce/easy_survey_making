const slides = document.querySelector(".slides");
const slideImages = document.querySelectorAll(".slides img");
const prevBtn = document.querySelector(".prev");
const nextBtn = document.querySelector(".next");
const indicatorsContainer = document.querySelector(".indicators");

const totalSlides = slideImages.length;
let index = 0;

// 인디케이터 생성
for (let i = 0; i < totalSlides; i++) {
  const dot = document.createElement("button");
  if (i === 0) dot.classList.add("active");
  dot.addEventListener("click", () => moveToSlide(i));
  indicatorsContainer.appendChild(dot);
}
const indicators = document.querySelectorAll(".indicators button");

function updateIndicators() {
  indicators.forEach(dot => dot.classList.remove("active"));
  indicators[index].classList.add("active");
}

function moveToSlide(n) {
  if (n < 0) index = totalSlides - 1;
  else if (n >= totalSlides) index = 0;
  else index = n;

  slides.style.transform = `translateX(-${index * 100}%)`;
  updateIndicators();
}

prevBtn.addEventListener("click", () => moveToSlide(index - 1));
nextBtn.addEventListener("click", () => moveToSlide(index + 1));

// 자동 슬라이드 (7초마다)
setInterval(() => {
  moveToSlide(index + 1);
}, 7000);