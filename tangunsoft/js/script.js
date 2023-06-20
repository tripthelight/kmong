/**
 * swiper
 */
const SWIPER_INIT = (_swiper) => {
  for (let i = 0; i < _swiper.slides.length; i++) {
    _swiper.slides[i].style.height = `${_swiper.slides[i].clientWidth}px`;
    const DT_EL = _swiper.slides[i].querySelector("dt");
    if (DT_EL) {
      const IMG_EL = DT_EL.querySelector("img");
      if (IMG_EL) {
        if (IMG_EL.clientWidth > DT_EL.clientWidth) {
          IMG_EL.style.width = "100%";
          IMG_EL.style.height = "auto";
        }
      }
    }
  }
};
const SWIPER = new Swiper(".slide", {
  freeMode: true,
  slidesPerView: 3,
  spaceBetween: 10,
  scrollbar: {
    el: ".swiper-scrollbar",
    hide: true,
  },
  on: {
    init: (swiper) => {
      setTimeout(SWIPER_INIT, 1, swiper);
    },
  },
});

/**
 * resize
 */
const SWIPER_RESIZE = () => {
  const SWIPER_EL = document.querySelector(".swiper");
  if (!SWIPER_EL) return;
  const SWIPER_WRAPPER = SWIPER_EL.querySelector(".swiper-wrapper");
  if (!SWIPER_WRAPPER) return;
  const SWIPER_SLIDE = SWIPER_WRAPPER.querySelectorAll(".swiper-slide");
  if (SWIPER_SLIDE.length < 1) return;

  for (let i = 0; i < SWIPER_SLIDE.length; i++) {
    SWIPER_SLIDE[i].style.height = `${SWIPER_SLIDE[i].clientWidth}px`;
    const DT_EL = SWIPER_SLIDE[i].querySelector("dt");
    if (DT_EL) {
      const IMG_EL = DT_EL.querySelector("img");
      if (IMG_EL) {
        if (IMG_EL.clientWidth > DT_EL.clientWidth) {
          IMG_EL.style.width = "100%";
          IMG_EL.style.height = "auto";
        }
      }
    }
  }
};
window.addEventListener("resize", () => {
  SWIPER_RESIZE();
});
