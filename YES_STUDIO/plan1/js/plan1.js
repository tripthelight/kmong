require("./assets.js");
// require("./browserfs.min.js");

const BrowserFS = require("browserfs");

/**
 * VARIABLES
 */
const SLIDE_DIV = 4; // index 화면에서 로고의 width, height를 이 값으로 나눔 - 높음수록 작아짐
// const SLIDE_SPEED = 4; // index 화면에서 로고의 움직임 속도를 이 값으로 설정 - 높을수록 빠름
const SEQUENCE_WHITE_SPACE = 50; // 시퀀스 이미지가 올라갈 때 남을 여백
let sequenceFile = new Object();
let sequenceData = new Object();
let sequenceSlide = new Object();
let sequenceActiveImg = null;
let sequenceActiveCnt = 0;
let sequenceClickState = false;
let activeSlide = null;
let linkTxt = null;

/**
 * CLASS
 */
class LOGO_ANIMATION {
  constructor(x, y, dx, dy, raduis, slide, idx, flag, click) {
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.raduis = raduis;
    this.slide = slide;
    this.idx = idx;
    this.flag = flag;
    this.click = click;
  }
  draw() {
    return this;
  }
  update() {
    if (this.flag) return;
    if (this.x + this.raduis > window.innerWidth - this.slide.clientWidth || this.x - this.raduis < 0) {
      this.dx = -this.dx;
    }
    if (this.y + this.raduis > window.innerHeight - this.slide.clientHeight || this.y - this.raduis < 0) {
      this.dy = -this.dy;
    }

    this.idx % 2 === 0 ? (this.x += this.dx) : (this.x -= this.dx);
    this.idx % 2 === 0 ? (this.y += this.dy) : (this.y -= this.dy);

    this.slide.style.transform = "translate(" + this.x + "px, " + this.y + "px)";
  }
}

/**
 * FUNCTIONS
 */
const LOADING = {
  show: () => {
    const LOADING = document.querySelector(".loading");
    LOADING.classList.add("show");
  },
  hide: () => {
    const LOADING = document.querySelector(".loading");
    LOADING.classList.remove("show");
  },
};
LOADING.show();

const GET_SEQUENCE_LIST = () => {
  return new Promise((resolve, reject) => {
    const LIST = document.querySelector(".floating-list");
    const LISTS = LIST.querySelectorAll(".sequence");
    if (LISTS.length < 1) return;
    const DATA = [];

    for (let i = 0; i < LISTS.length; i++) {
      const IMG_DATA = [];
      DATA.push(IMG_DATA);
      const S_LIST = LISTS[i].querySelector(".sequence-list");
      if (S_LIST) {
        const LIST_IMG = S_LIST.querySelectorAll("img");
        if (LIST_IMG.length > 0) {
          for (let j = 0; j < LIST_IMG.length; j++) {
            IMG_DATA.push({
              src: LIST_IMG[j].src,
              link: LIST_IMG[j].dataset.link,
              color: LIST_IMG[j].dataset.color,
            });
            if (j === LIST_IMG.length - 1) {
              // 시퀀스의 이미지들을 배열에 모두 담으면 html 제거
              S_LIST.remove();
            }
          }
        }
      }
    }

    resolve(DATA);
  });
};
const RETURN_DELAY = (_delay) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, _delay);
  });
};
const GET_TRANSLATE_XY = (_elem) => {
  const style = window.getComputedStyle(_elem);
  const matrix = new DOMMatrixReadOnly(style.transform);
  return {
    translateX: matrix.m41,
    translateY: matrix.m42,
  };
};
const ZOOM_X = (_elem) => window.innerWidth / 2 - _elem.clientWidth / 2;
const ZOOM_Y = (_elem) => window.innerHeight / 2 - _elem.clientHeight / 2;
const ZOOM_SCALE = (_elem) => {
  let w = _elem.clientWidth;
  let h = _elem.clientHeight;
  let zoom = 0;
  if (w >= h) {
    zoom = window.innerHeight / h;
  } else {
    zoom = window.innerWidth / w;
  }
  return zoom;
};
const SHOW_SEQ_IMG = (_logo) => {
  sequenceClickState = false;
  sequenceActiveImg = new Image();
  sequenceActiveImg.src = sequenceData[_logo.idx][sequenceActiveCnt].src;
  sequenceActiveImg.setAttribute("data-color", sequenceData[_logo.idx][sequenceActiveCnt].color);
  sequenceActiveImg.classList.add("sequence-img");
  sequenceActiveImg.classList.add("active-sequence");
  document.body.appendChild(sequenceActiveImg);
  linkTxt.innerText = sequenceData[_logo.idx][sequenceActiveCnt].link;
  linkTxt.style.color = sequenceData[_logo.idx][sequenceActiveCnt].color;

  sequenceActiveImg.classList.add("show-first-before");
  setTimeout(() => {
    sequenceActiveImg.classList.remove("show-first-before");
    sequenceActiveImg.classList.add("show-first-after");
    setTimeout(() => {
      sequenceActiveImg.classList.remove("show-first-after");
      sequenceClickState = true;
    }, 1);
  }, 201);
};
const CLICK_ZOOM = (_logo, _elem) => {
  if (_elem) _elem.style.transform = `translate(${ZOOM_X(_elem)}px, ${ZOOM_Y(_elem)}px) scale(${Number((SLIDE_DIV + ZOOM_SCALE(_elem)).toFixed(1))})`;
  // 2번 이미지 나옴
  SHOW_SEQ_IMG(_logo);

  if (sequenceActiveCnt === sequenceData[_logo.idx].length - 1) return;
  sequenceActiveImg.addEventListener("click", () => {
    if (!sequenceClickState) return;
    sequenceActiveCnt += 1;
    let posY = Math.abs((window.innerHeight - sequenceActiveImg.clientHeight) / 2 + sequenceActiveImg.clientHeight - SEQUENCE_WHITE_SPACE);
    sequenceActiveImg.classList.remove("active-sequence");
    sequenceActiveImg.classList.add("prev-sequence");

    const PREV_SEQ = document.querySelectorAll(".prev-sequence");
    let resPrevY = 0;
    for (let i = 0; i < PREV_SEQ.length; i++) {
      let prevX = GET_TRANSLATE_XY(PREV_SEQ[i]).translateX;
      let prevY = GET_TRANSLATE_XY(PREV_SEQ[i]).translateY;
      resPrevY = 0 - Number(Math.abs(prevY) + Math.abs(posY));
      PREV_SEQ[i].style.transform = `translate(${prevX}px, ${resPrevY}px) scale(1)`;
    }

    CLICK_ZOOM(_logo);
  });
};
const ZOOM_CLOSE_COMN = (_elem, _param) => {
  if (sequenceActiveImg) {
    sequenceActiveImg.style.transition = `transform 0.2s ease-in, opacity 0.2s ease-in`;
    sequenceActiveImg.style.opacity = 0;
    sequenceActiveImg.style.transform = `translate(-50%, -50%) scale(0.6)`;
    setTimeout(() => {
      const SEQUENCE_IMGS = document.querySelectorAll("img.sequence-img");
      [...SEQUENCE_IMGS].map((item) => item.remove());
      _elem.classList.remove("active");
      _elem.parentNode.style.transform = `translate(${ZOOM_X(_elem)}px, ${ZOOM_Y(_elem)}px) scale(${SLIDE_DIV})`;
    }, 201);
  } else {
    _elem.classList.remove("active");
    _elem.parentNode.style.transform = `translate(${ZOOM_X(_elem)}px, ${ZOOM_Y(_elem)}px) scale(${SLIDE_DIV})`;
  }

  linkTxt.innerText = _param.slide.querySelector("img.img-home").dataset.link;
  linkTxt.style.color = _param.slide.querySelector("img.img-home").dataset.color;
};
const reduceNumbers = (arr, len) => {
  var start = 0;
  var end = len - 1;
  var targetStart = len - 1;
  var targetEnd = 0;

  var result = arr.map(function (number) {
    var ratio = (targetEnd - targetStart) / (end - start);
    var decreasedNumber = targetEnd - ratio * (end - number);
    return decreasedNumber;
  });

  return parseInt(result.join(""));
};
const ZOOM_CLOSE = (_elem, _param) => {
  sequenceActiveCnt = 0;
  sequenceClickState = false;

  const PREV_SEQ = document.querySelectorAll(".prev-sequence");
  if (PREV_SEQ.length > 0) {
    // 촤라락 내림
    const SEQ_EL = document.querySelectorAll(".sequence-img");

    // for (let i = SEQ_EL.length - 1 /*, p = Promise.resolve()*/; i >= 0; i--) {
    //   if (i === 0) {
    //     SEQ_EL[i].style.transform = `translate(-50%, -50%) scale(1)`;
    //     sequenceActiveImg = SEQ_EL[i];
    //     setTimeout(ZOOM_CLOSE_COMN, 401, _elem);
    //   } else {
    //     let x = GET_TRANSLATE_XY(SEQ_EL[i]).translateX;
    //     let y = Math.abs(GET_TRANSLATE_XY(SEQ_EL[reduceNumbers([i], SEQ_EL.length)]).translateY);
    //     SEQ_EL[i].style.transform = `translate(${x}px, ${y}px) scale(1)`;
    //   }
    //   if (cnt > 10) {
    //     SEQ_EL[0].style.transform = `translate(-50%, -50%) scale(1)`;
    //     sequenceActiveImg = SEQ_EL[0];
    //     setTimeout(ZOOM_CLOSE_COMN, 401, _elem);
    //     break;
    //   }
    //   cnt++;
    // }
    let delayLen = SEQ_EL.length > 11 ? SEQ_EL.length / 50 : 0.2;
    for (let i = 0, p = Promise.resolve(); i < SEQ_EL.length; i++) {
      p = p
        .then(() => {
          return RETURN_DELAY(1);
        })
        .then(() => {
          if (i === 0) {
            SEQ_EL[i].style.transition = `transform ${delayLen}s ease-in`;
            SEQ_EL[i].style.transform = `translate(-50%, -50%) scale(1)`;
          } else {
            let x = GET_TRANSLATE_XY(SEQ_EL[i]).translateX;
            let y = Math.abs(GET_TRANSLATE_XY(SEQ_EL[reduceNumbers([i], SEQ_EL.length)]).translateY);
            SEQ_EL[i].style.transition = `transform ${delayLen}s ease-in`;
            SEQ_EL[i].style.transform = `translate(${x}px, ${y}px) scale(1)`;
          }
          if (i === SEQ_EL.length - 1) {
            sequenceActiveImg = SEQ_EL[0];
            setTimeout(() => {
              ZOOM_CLOSE_COMN(_elem, _param);
            }, Number(delayLen * 1000 + 100));
          }
        });
    }
  } else {
    ZOOM_CLOSE_COMN(_elem, _param);
  }
};
const ACTIVE_SLIDE_CLICK = (_event) => {
  const PARAM = _event.currentTarget.param;
  if (_event.target.classList.contains("active")) return ZOOM_CLOSE(_event.target, PARAM);
  _event.target.classList.add("active");
  setTimeout(() => {
    CLICK_ZOOM(PARAM, _event.target.parentNode);
  }, 1);
};
const BG = {
  show: (_logo) => {
    const BG_EL = document.querySelector(".bg");
    BG_EL.classList.add("show");
    BG_EL.style.backgroundColor = `rgba(0,0,0,1)`;
    BG_EL.onclick = () => {
      if (activeSlide !== null) {
        activeSlide.classList.remove("active");
        activeSlide.removeEventListener("click", ACTIVE_SLIDE_CLICK);
      }
      BG.hide();
      _logo.slide.style.transform = `translate(${_logo.x}px, ${_logo.y}px) scale(1)`;
      setTimeout(() => {
        _logo.slide.style.removeProperty("transition");
        _logo.slide.classList.remove("active");
        _logo.click = false;
        _logo.flag = false;
      }, 201);
    };
  },
  hide: () => {
    const BG_EL = document.querySelector(".bg");
    BG_EL.style.backgroundColor = `rgba(0,0,0,0)`;
    setTimeout(() => {
      BG_EL.classList.remove("show");
    }, 201);

    if (linkTxt !== null) linkTxt.remove();
  },
};
const ZOOM_SLIDE = (_logo) => {
  if (_logo.slide.classList.contains("active")) return;
  _logo.slide.classList.add("active");
  _logo.slide.style.transition = "transform .2s ease-in";
  _logo.slide.style.transform = `translate(${ZOOM_X(_logo.slide)}px, ${ZOOM_Y(_logo.slide)}px) scale(${SLIDE_DIV})`;

  linkTxt = document.createElement("div");
  linkTxt.classList.add("link-txt");
  linkTxt.innerText = _logo.slide.querySelector("img.img-home").dataset.link;
  linkTxt.style.color = _logo.slide.querySelector("img.img-home").dataset.color;
  document.body.appendChild(linkTxt);

  BG.show(_logo);

  /**
   * slide click event
   */
  if (sequenceData[_logo.idx].length > 0) {
    activeSlide = _logo.slide.querySelector("img.img-home");
    activeSlide.addEventListener("click", ACTIVE_SLIDE_CLICK);
    activeSlide.param = _logo;
  } else {
    // 시퀀스 이미지의 개수가 0개면 리턴
    activeSlide = null;
    return;
  }
};
const SLIDE_MOVE = (_slides) => {
  let logoArray = [];
  for (let i = 0; i < _slides.length; i++) {
    let raduis = Math.random() * 10 + 1;
    let x = GET_TRANSLATE_XY(_slides[i]).translateX;
    let y = GET_TRANSLATE_XY(_slides[i]).translateY;
    let dx = Math.random() * SLIDE_SPEED;
    let dy = Math.random() * SLIDE_SPEED;
    logoArray.push(new LOGO_ANIMATION(x, y, dx, dy, raduis, _slides[i], i, false, false));
  }

  function animate() {
    requestAnimationFrame(animate);
    logoArray.forEach((logo) => {
      logo.draw().update();

      // 로고에서 마우스 오버 시 멈춤
      logo.slide.onmouseover = () => {
        logo.flag = true;
      };
      // 로고 클릭
      logo.slide.onclick = () => {
        logo.click = true;
        logo.flag = true;
        ZOOM_SLIDE(logo);
      };
      // 로고에서 마우스 떠나면 다시 움직임
      logo.slide.onmouseleave = () => {
        if (logo.click) return;
        logo.flag = false;
      };
    });
  }

  animate();
  LOADING.hide();
};
const RANDOM_POS_X = (_w) => Math.floor(Math.random() * (window.innerWidth - _w - 100 - 100)) + 100;
const RANDOM_POS_Y = (_h) => Math.floor(Math.random() * (window.innerHeight - _h - 100 - 100)) + 100;
const SLIDE_SIZE = (_slides) => {
  const LOGO_SWIPER = document.querySelector(".floating-list");
  let imgEl = new Object();
  let w = 0;
  let h = 0;

  for (let slide of _slides) {
    imgEl = slide.querySelector("img");
    w = imgEl.clientWidth / SLIDE_DIV;
    h = imgEl.clientHeight / SLIDE_DIV;
    slide.style.cssText = `
      width: ${w}px;
      height: ${h}px;
      transform: translate(${RANDOM_POS_X(w)}px, ${RANDOM_POS_Y(h)}px);
    `;
  }

  // 기본 위치가 설정되면 wrapper의 opacity를 1로 바꿔줘야 함
  LOGO_SWIPER.classList.add("show");

  // move slide animation
  SLIDE_MOVE(_slides);
};

/**
 * DOCUMENT READY COMMON
 */
const COMN_INIT = async () => {
  try {
    /**
     * sequence list array - html에서 가져옴
     */
    const SEQUENCE_LIST = await GET_SEQUENCE_LIST();

    /**
     * fs init
     */
    BrowserFS.install(window);
    // var Buffer = BrowserFS.BFSRequire("buffer").Buffer;
    BrowserFS.configure(
      {
        fs: "LocalStorage",
      },
      (e) => {
        if (e) throw e;

        const FS = BrowserFS.BFSRequire("fs");
        // fs.writeFile("./test.txt", "Cool, I can do this in the browser!", (err) => {
        //   fs.readFile("./test.txt", (err, contents) => {
        //     console.log(contents.toString());
        //   });
        // });
        // const FS = require("fs");

        FS.writeFileSync("./sequence.json", JSON.stringify(SEQUENCE_LIST), (err) => {
          if (err) throw err;
        });
        sequenceFile = FS.readFileSync("./sequence.json");
        sequenceData = JSON.parse(sequenceFile.toString());

        // image size
        SLIDE_SIZE(document.querySelectorAll(".sequence"));
      }
    );
  } catch (error) {
    alert(error + " :: 이미지를 저장 할 수 없습니다.");
  }
};

/**
 * DOCUMENT READY
 */
const READY_COMN = () => {
  if (document.readyState === "complete") COMN_INIT();
};
document.onreadystatechange = READY_COMN;
