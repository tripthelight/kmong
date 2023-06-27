/**
 * S : FUNCTIONS ==========================================================
 */

/**
 * newElement 바로 아래 referenceElement를 appendChild 시킴
 * @param {object} newElement : append 시킬 object의 바로 아래에 있는 element
 * @param {object} referenceElement : append 시킬 element
 * @returns : null
 */
const INSERT_AFTER = (newElement, referenceElement) => {
  newElement.parentNode.insertBefore(referenceElement, newElement);
};

/**
 * window width가 992 이하일 때 함수
 * .project-list의 dl 리스트를 받아서 li의 TEXT를 span.txt 안으로 이동
 * @param {object} _list : .project-list의 dl 리스트
 * @returns : null
 */
const RESIZE_SMALL = (_list) => {
  for (let i = 0; i < _list.length; i++) {
    const LI1 = _list[i].querySelectorAll("li")[0];
    const LI2 = _list[i].querySelectorAll("li")[1];
    if (!LI1 || !LI2) return;
    const TEXT_EL = document.createElement("span");
    TEXT_EL.classList.add("txt");
    TEXT_EL.innerText = LI2.innerText;
    const BEFORE_EL = LI1.querySelector(".inner .tags") || LI1.querySelector(".inner .btn-list");
    if (!BEFORE_EL) return;
    INSERT_AFTER(BEFORE_EL, TEXT_EL);
    LI2.remove();
  }
};

/**
 * window width가 992 초과일 때 함수
 * .project-list의 dl 리스트를 받아서 span.txt의 TEXT를 두번째 li 안으로 이동
 * @param {object} _list : .project-list의 dl 리스트
 * @returns : null
 */
const RESIZE_WIDE = (_list) => {
  for (let i = 0; i < _list.length; i++) {
    const UL_EL = _list[i].querySelector("ul");
    if (!UL_EL) return;
    const LI1 = UL_EL.querySelectorAll("li")[0];
    if (!LI1) return;
    const SPAN_EL = LI1.querySelector(".inner span.txt");
    if (!SPAN_EL) return;
    const TEXT_EL = document.createElement("li");
    TEXT_EL.innerText = SPAN_EL.innerText;
    UL_EL.appendChild(TEXT_EL);
    SPAN_EL.remove();
  }
};

/**
 * window ready event
 * window width가 992 이하일 경우 TEXT를 .inner > .tags나 .inner > .btn-list 아래로 이동
 * @returns : null
 */
const TEXT_POS = () => {
  const PROJECT_LIST = document.querySelector(".project-list");
  if (!PROJECT_LIST) return;
  const LIST = PROJECT_LIST.querySelectorAll("dl");
  if (!LIST || LIST.length < 1) return;
  if (window.innerWidth <= 992) {
    RESIZE_SMALL(LIST);
  }
};

/**
 * window resize event
 * window width가 992 이하일 경우 TEXT를 .inner > .tags나 .inner > .btn-list 아래로 이동
 * window width가 992 초과일 경우 TEXT를 두번째 li로 이동
 * @returns : null
 */
const TEXT_POS_RESIZE = () => {
  const PROJECT_LIST = document.querySelector(".project-list");
  if (!PROJECT_LIST) return;
  const LIST = PROJECT_LIST.querySelectorAll("dl");
  if (!LIST || LIST.length < 1) return;
  if (window.innerWidth <= 992) {
    RESIZE_SMALL(LIST);
  } else {
    RESIZE_WIDE(LIST);
  }
};

/* E : FUNCTIONS ========================================================== */

/**
 * DOCUMENT READY COMMON
 */
const comnInit = () => {
  TEXT_POS();
};

/**
 * DOCUMENT READY EVENT
 */
const readyComn = () => {
  if (document.readyState === "complete") comnInit();
};
document.onreadystatechange = readyComn;

/**
 * WINDOW RESIZE EVENT
 */
window.addEventListener("resize", () => {
  TEXT_POS_RESIZE();
});
