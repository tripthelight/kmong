require("./assets.js");
const IScroll = require("iscroll-zoom-probe");

/**
 * VARIABLES
 */
let myScroll;
let scale = 4;
let imgScale = 1;
let wrapperWidth = 0;
let startX = 0;
let posX = 0;
let posY = 0;
let realScale = 10;

/**
 * FUNCTIONS
 */
const GET_TRANSLATE_XY = (element) => {
  const style = window.getComputedStyle(element);
  const matrix = new DOMMatrixReadOnly(style.transform);
  return {
    translateX: matrix.m41,
    translateY: matrix.m42,
  };
};
const IMAGE_POS = () => {
  const IMG_LIST_WRAP = document.querySelector(".image-list");
  const IMG_LIST = IMG_LIST_WRAP.querySelectorAll(".list");
  for (let i = 0; i < IMG_LIST.length; i++) {
    let el = IMG_LIST[i].querySelector("dt img");
    let x = Number(el.dataset.x);
    let y = Number(el.dataset.y);
    let w = el.clientWidth / realScale;
    let h = el.clientHeight / realScale;
    let posX = window.innerWidth / 2 - el.clientWidth / realScale / 2 + x;
    let posY = window.innerHeight / 2 - el.clientHeight / realScale / 2 - y;
    IMG_LIST[i].style.left = `${posX}px`;
    IMG_LIST[i].style.top = `${posY}px`;
    IMG_LIST[i].style.width = `${w}px`;
    IMG_LIST[i].style.height = `${h}px`;
  }
};
const isPassive = () => {
  var supportsPassiveOption = false;
  try {
    addEventListener(
      "test",
      null,
      Object.defineProperty({}, "passive", {
        get: function () {
          supportsPassiveOption = true;
        },
      })
    );
  } catch (e) {}
  return supportsPassiveOption;
};
const ISCROLL_USE = {
  disable: () => {
    myScroll.disable();
    myScroll.options.zoom = false;
    myScroll.options.wheelAction = "";
  },
  enabled: () => {
    myScroll.enable();
    myScroll.options.zoom = true;
    myScroll.options.wheelAction = "zoom";
  },
};
const IMAGE_CLICK_COMN = (_root, _event) => {
  console.log(_event);
  if (_root.classList.contains("active")) return;
  setTimeout(() => {
    scale = Number(myScroll.scale.toFixed(2));
    const ROOT = document.getElementById("root");
    const BTN_EL = _event.target.offsetParent;
    const HALF = window.innerWidth / 2;
    console.log(BTN_EL);
    const BTN_EL_ING = BTN_EL.querySelector("dt img");
    let beforeW = BTN_EL_ING.clientWidth;
    let beforeH = BTN_EL_ING.clientHeight;
    _root.classList.add("active");
    BTN_EL.classList.add("active");
    BTN_EL.style.top = `50%`;
    BTN_EL.style.left = `50%`;
    BTN_EL.style.width = `100vw`;
    BTN_EL.style.height = `100vh`;
    BTN_EL.style.marginLeft = `${Number(0 - Number(ROOT.clientWidth / 2))}px`;
    BTN_EL.style.marginTop = `${Number(0 - Number(ROOT.clientHeight / 2))}px`;

    // let pd = (window.innerWidth / 2 - BTN_EL_ING.clientWidth) / 2;
    // BTN_EL_ING.style.padding = `0 ${pd}px`;

    const IMG_LIST = document.querySelector(".image-list");
    const SCROLLER_W = ROOT.clientWidth * scale;
    const SCROLLER_H = ROOT.clientHeight * scale;
    const TRANSLATE = GET_TRANSLATE_XY(IMG_LIST);

    let posX1 = Number(SCROLLER_W - ROOT.clientWidth);
    let posX2 = Number(posX1) / 2;
    let posX3 = Number(posX2) - Number(Math.abs(TRANSLATE.translateX));
    posX = posX3 > 0 ? 0 - Math.abs(Number(posX3 / scale)) : Math.abs(Number(posX3 / scale));

    let posY1 = Number(SCROLLER_H - ROOT.clientHeight);
    let posY2 = Number(posY1) / 2;
    let posY3 = Number(posY2) - Number(Math.abs(TRANSLATE.translateY));
    posY = posY3 > 0 ? 0 - Math.abs(Number(posY3 / scale)) : Math.abs(Number(posY3 / scale));

    // posX = 0;
    // posY = 0;
    imgScale = Number(myScroll.wrapperWidth / myScroll.scrollerWidth);
    BTN_EL.style.transform = `translate(${posX}px, ${posY}px) scale(${imgScale})`;

    const INFO_DD = document.createElement("dd");
    const INFO_EL = document.createElement("div");
    INFO_EL.classList.add("info-list");

    // 이미지 설명 문구
    const ALT_EL = document.createElement("span");
    ALT_EL.innerText = BTN_EL.querySelector("dt img").dataset.alt;
    INFO_EL.appendChild(ALT_EL);

    // 이미지 좌표값
    const COOD_EL = document.createElement("ul");
    const COOD_X = document.createElement("li");
    const COOD_Y = document.createElement("li");
    const CLOSE = document.createElement("li");
    COOD_X.innerText = `X : ${BTN_EL.querySelector("dt img").dataset.x}`;
    COOD_Y.innerText = `Y : ${BTN_EL.querySelector("dt img").dataset.y}`;
    COOD_EL.appendChild(COOD_X);
    COOD_EL.appendChild(COOD_Y);
    COOD_EL.appendChild(CLOSE);
    INFO_EL.appendChild(COOD_EL);

    // 홈으로 이동 버튼
    const BTN_CLOSE = document.createElement("a");
    BTN_CLOSE.setAttribute("alt", "홈으로 이동 버튼");
    BTN_CLOSE.setAttribute("title", "홈으로 이동");
    BTN_CLOSE.setAttribute("href", "javascript:void(0)");
    BTN_CLOSE.classList.add("btn-close");
    CLOSE.appendChild(BTN_CLOSE);

    // 클릭한 버튼에 info text 넣기
    INFO_DD.appendChild(INFO_EL);
    BTN_EL.appendChild(INFO_DD);

    // // image size
    // const INFO_DT = BTN_EL.querySelector("dt");
    // const PLR = parseInt(getComputedStyle(INFO_DT).paddingLeft) + parseInt(getComputedStyle(INFO_DT).paddingRight);
    // const PTB = parseInt(getComputedStyle(INFO_DT).paddingTop) + parseInt(getComputedStyle(INFO_DT).paddingBottom);
    // if (beforeW > beforeH) {
    //   // 가로가 길거나 같을 경우
    //   BTN_EL_ING.style.width = "100%";
    //   BTN_EL_ING.style.height = "auto";
    //   if (INFO_DT.clientWidth - PLR >= beforeW * realScale) {
    //     BTN_EL_ING.style.width = `${beforeW * realScale}px`;
    //   } else {
    //     BTN_EL_ING.style.width = `${INFO_DT.clientWidth - PLR}px`;
    //   }
    // } else if (beforeW < beforeH) {
    //   // 세로가 길 경우
    //   BTN_EL_ING.style.width = "auto";
    //   BTN_EL_ING.style.height = "100%";
    //   if (INFO_DT.clientHeight - PTB >= beforeH * realScale) {
    //     BTN_EL_ING.style.height = `${beforeH * realScale}px`;
    //   } else {
    //     BTN_EL_ING.style.height = `${INFO_DT.clientHeight - PTB}px`;
    //   }
    // } else {
    //   // 가로 세로가 같은 경우
    //   BTN_EL_ING.style.width = "100%";
    //   BTN_EL_ING.style.height = "auto";
    //   if (INFO_DT.clientWidth - PLR >= beforeW * realScale) {
    //     BTN_EL_ING.style.width = `${beforeW * realScale}px`;
    //   } else {
    //     BTN_EL_ING.style.width = `${INFO_DT.clientWidth - PLR}px`;
    //   }
    // }

    // 홈으로 이동 버튼 click event
    BTN_CLOSE.addEventListener("click", () => {
      const ROOT = document.getElementById("root");
      INFO_DD.remove();
      const IMG_EL = BTN_EL.querySelector("dt img");
      console.log(window.innerWidth);
      console.log(IMG_EL.clientWidth);
      console.log(IMG_EL.dataset.x);
      let posX = window.innerWidth / 2 - beforeW / 2 + parseInt(IMG_EL.dataset.x);
      let posY = window.innerHeight / 2 - beforeH / 2 - parseInt(IMG_EL.dataset.y);
      BTN_EL.style.removeProperty("left");
      BTN_EL.style.removeProperty("top");
      BTN_EL.style.removeProperty("transform");
      BTN_EL.style.removeProperty("margin-left");
      BTN_EL.style.removeProperty("margin-top");
      BTN_EL.style.removeProperty("max-height");
      BTN_EL.style.removeProperty("z-index");
      BTN_EL.style.removeProperty("background-color");
      BTN_EL.style.left = `${posX}px`;
      BTN_EL.style.top = `${posY}px`;
      BTN_EL.style.width = `${beforeW}px`;
      BTN_EL.style.height = `${beforeH}px`;

      IMG_EL.style.removeProperty("padding");
      IMG_EL.style.removeProperty("width");
      IMG_EL.style.removeProperty("height");

      ROOT.classList.remove("active");
      BTN_EL.classList.remove("active");
      IMG_EL.classList.remove("active");

      ISCROLL_USE.enabled();
    });
  }, 20);
};
const IMAGE_CLICK_EVENT = () => {
  const ROOT = document.getElementById("root");
  const IMG_LIST = document.querySelector(".image-list");
  const IMGS = IMG_LIST.querySelectorAll(".list");
  for (let i = 0; i < IMGS.length; i++) {
    if (IMGS[i].classList.contains("active")) return;
    IMGS[i].addEventListener(
      "tap",
      (e) => {
        ISCROLL_USE.disable();
        setTimeout(() => {
          IMAGE_CLICK_COMN(ROOT, e);
        }, 1);
      },
      false
    );
  }
};
document.addEventListener(
  "touchmove",
  function (e) {
    e.preventDefault();
  },
  isPassive()
    ? {
        capture: false,
        passive: false,
      }
    : false
);
function reduceNumbers(arr) {
  var start = 1;
  var end = 2;
  var targetStart = 1;
  var targetEnd = 0.5;

  var result = arr.map(function (number) {
    var ratio = (targetEnd - targetStart) / (end - start);
    var decreasedNumber = targetEnd - ratio * (end - number);
    return decreasedNumber;
  });

  return result.join("");
}

/**
 * DOCUMENT READY COMMON
 */
const COMN_INIT = () => {
  // image position
  IMAGE_POS();

  // iScoll
  const ROOT = document.getElementById("root");
  const startZoom = 1;
  const startX = 0 - (ROOT.clientWidth * startZoom - ROOT.clientWidth) / 2;
  const startY = 0 - (ROOT.clientHeight * startZoom - ROOT.clientHeight) / 2;
  myScroll = new IScroll("#root", {
    zoom: true,
    startZoom: startZoom,
    zoomMin: 1,
    zoomMax: 4,
    scrollX: true,
    scrollY: true,
    startX: startX,
    startY: startY,
    mouseWheel: true,
    freeScroll: true,
    wheelAction: "zoom",
    click: false,
    bounce: false,
    tap: true,
  });
  imgScale = Number(myScroll.wrapperWidth / myScroll.scrollerWidth);

  myScroll.on("zoomEnd", (e) => {
    scale = Number(myScroll.scale.toFixed(2));
    imgScale = Number(myScroll.wrapperWidth / myScroll.scrollerWidth);
  });

  // image click event
  IMAGE_CLICK_EVENT();
};

/**
 * DOCUMENT READY
 */
const READY_COMN = () => {
  if (document.readyState === "complete") COMN_INIT();
};
document.onreadystatechange = READY_COMN;
