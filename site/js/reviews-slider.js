// Reviews carousel — crossfades between pages of review cards
const rSlides = document.querySelectorAll('.reviews-slide');
const rDots = document.querySelectorAll('.reviews-dot');
const rPrev = document.querySelector('.reviews-arrow.prev');
const rNext = document.querySelector('.reviews-arrow.next');
const rTotal = rSlides.length;
let rCurrent = 0;

function reviewsGoTo(i){
  const to = (i + rTotal) % rTotal;
  if(to === rCurrent) return;
  rSlides[rCurrent].classList.remove('active');
  rDots[rCurrent].classList.remove('active');
  rCurrent = to;
  rSlides[rCurrent].classList.add('active');
  rDots[rCurrent].classList.add('active');
}

if(rTotal > 1){
  rDots.forEach((dot, i) => {
    dot.addEventListener('click', () => reviewsGoTo(i));
  });
  if(rPrev) rPrev.addEventListener('click', () => reviewsGoTo(rCurrent - 1));
  if(rNext) rNext.addEventListener('click', () => reviewsGoTo(rCurrent + 1));
}
