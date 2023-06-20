require("./assets.js");

/**
 * VARIABLES
 */
let imageScale = 0;

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

const IMG_SCALE = (_imgEl) => {
  if (_imgEl.classList.contains("zoom")) {

  } else {
    _imgEl.classList.add("zoom");
    if (IMAGE_SCALE > 0) {
      imageScale = _imgEl.clientWidth * IMAGE_SCALE;
    } else if (IMAGE_SCALE < 0) {
      imageScale = _imgEl.clientWidth / Math.abs(IMAGE_SCALE);
    } else {
      return alert("이미지 크기는 0보다 크거나 작아야 합니다.")
    }
    _imgEl.style.width = `${imageScale}px`;
  }
}

const IMG_CLICK = (_imgEl) => {
  // 이미지의 active class 제거
  const ACTIVE_IMG = document.querySelector("img.active");
  if (ACTIVE_IMG) ACTIVE_IMG.classList.remove("active");
  _imgEl.classList.add("active");

  // 클릭한 이미지 외 모든 이미지 제거
  const IMGS = document.querySelectorAll("img");
  if (IMGS.length > 0) {
    for (let i = 0; i < IMGS.length; i++) {
      if (IMGS[i] !== _imgEl) IMGS[i].style.display = "none";
    }
  }

  // 클릭한 이미지 중앙으로 이동
  _imgEl.style.transition = "transform .2s ease-in";
  let posX = window.innerWidth / 2 - _imgEl.clientWidth / 2;
  let posY = window.innerHeight / 2 - _imgEl.clientHeight / 2;
  let rotate = _imgEl.dataset.angle;
  _imgEl.style.transform = `translate(${posX}px, ${posY}px) rotate(${rotate}deg)`;

  // 하위 이미지 보이기
  const DEPT = _imgEl.closest(".dept");
  const DEPT_CLASS = DEPT.className;
  const DEPT_NUM = parseInt(DEPT_CLASS.replace(/dept/g, ""));
  if (DEPT) {
    const DEPT_N = DEPT.querySelectorAll(`.dept${DEPT_NUM + 1}`);
    if (DEPT_N.length > 0) {
      for (let i = 0; i < DEPT_N.length; i++) {
        DEPT_N[i].style.display = "block";
        const IMG_EL = DEPT_N[i].querySelector("img");
        // for (let j = 0; j < IMG_EL.length; j++) {
          IMG_EL.style.opacity = 0;
          IMG_EL.style.display = "block";
          
          // if (IMG_EL[j].clientWidth > window.innerWidth / 6) {
          //   IMG_EL[j].style.width = `${window.innerWidth / 6}px`;
          // }
          
          IMG_SCALE(IMG_EL);

          let x = window.innerWidth / 2 - IMG_EL.clientWidth / 2;
          let y = window.innerHeight / 2 - IMG_EL.clientHeight / 2;
          let rotate = IMG_EL.dataset.angle;
          IMG_EL.style.removeProperty("transition");
          IMG_EL.style.transform = `translate(${x}px, ${y}px) rotate(${rotate}deg)`;
          setTimeout(() => {
            IMG_EL.style.transition = "transform .8s ease-in, opacity .2s ease-in";
            IMG_EL.style.opacity = 1;
            let posX = IMG_EL.dataset.x;
            let posY = IMG_EL.dataset.y;
            IMG_EL.style.transform = `translate(${posX}px, ${posY}px) rotate(${rotate}deg)`;
            IMG_EL.onclick = () => {
              if (IMG_EL.classList.contains("active")) return;
              IMG_CLICK(IMG_EL);
            };
          }, 201);
        // }
      }
    }
  }
};

/**
 * DOCUMENT READY COMMON
 */
const COMN_INIT = async () => {
  try {
    const DEPT_0 = document.querySelectorAll(".dept0");
    if (DEPT_0.length > 0) {
      for (let i = 0; i < DEPT_0.length; i++) {
        const IMG_EL = DEPT_0[i].querySelector("img");
        // for (let j = 0; j < IMG_EL.length; j++) {
          // if (IMG_EL[j].clientWidth > window.innerWidth / 6) {
          //   IMG_EL[j].style.width = `${window.innerWidth / 6}px`;
          // }

          IMG_SCALE(IMG_EL);
          
          IMG_EL.style.width = `${imageScale}px`;
          let posX = IMG_EL.dataset.x;
          let posY = IMG_EL.dataset.y;
          let rotate = IMG_EL.dataset.angle;
          IMG_EL.style.transform = `translate(${posX}px, ${posY}px) rotate(${rotate}deg)`;
          IMG_EL.onclick = () => {
            if (IMG_EL.classList.contains("active")) return;
            IMG_CLICK(IMG_EL);
          };
        // }
      }
    }

    // home 버튼 클릭
    const BTN_HOME = document.querySelector(".btn-block a.home");
    if (BTN_HOME) {
      BTN_HOME.onclick = () => {
        location.reload();
      };
    }

    // 이전 버튼 클릭
    const BTN_PREV = document.querySelector(".btn-block a.prev");
    if (BTN_PREV) {
      BTN_PREV.onclick = () => {
        const ACTIVE_IMG = document.querySelector("img.active");
        if (!ACTIVE_IMG) return;
        const DEPT_0 = ACTIVE_IMG.closest(".dept0");
        if (!DEPT_0) return;
        const DEPT_1 = ACTIVE_IMG.closest(".dept");
        if (!DEPT_1) return;

        const DEPT_CHILDE = DEPT_1.querySelectorAll(".dept");
        if (DEPT_CHILDE.length > 0) {
          for (let i = 0; i < DEPT_CHILDE.length; i++) {
            DEPT_CHILDE[i].style.display = "none";
          }
        }

        // dept0 이미지에서 back 일 경우
        if (DEPT_1.classList.contains("dept0")) {
          const DEPT_0_EL = document.querySelectorAll(".dept0");
          if (DEPT_0_EL.length < 1) return;
          for (let i = 0; i < DEPT_0_EL.length; i++) {
            const IMG_EL = DEPT_0_EL[i].querySelector("img");
            if (IMG_EL) {
              IMG_EL.style.display = "block";
              IMG_EL.style.transform = `translate(${IMG_EL.dataset.x}px, ${IMG_EL.dataset.y}px) rotate(${IMG_EL.dataset.angle}deg)`;
              IMG_EL.classList.remove("active");
            }
          }
          return;
        }

        const DEPT_2 = DEPT_1.parentNode;
        if (!DEPT_2) return;

        const DEPT_ARR = DEPT_1.className.split(" ");
        const DEPT_LIST = DEPT_2.querySelectorAll(`.${DEPT_ARR.join(".")}`);
        // const DEPT_LIST = DEPT_0.querySelectorAll(DEPT_EL);

        if (DEPT_LIST.length > 0) {
          for (let i = 0; i < DEPT_LIST.length; i++) {
            DEPT_LIST[i].style.display = "block";

            const IMG_EL = DEPT_LIST[i].querySelector("img");
            if (IMG_EL === ACTIVE_IMG) {
              let rotate = IMG_EL.dataset.angle;
              let posX = IMG_EL.dataset.x;
              let posY = IMG_EL.dataset.y;
              IMG_EL.style.transform = `translate(${posX}px, ${posY}px) rotate(${rotate}deg)`;
            } else {
              IMG_EL.style.removeProperty("transition");
              IMG_EL.style.display = "block";
              IMG_EL.style.opacity = 0;
              // if (IMG_EL.clientWidth > window.innerWidth / 6) {
              //   IMG_EL.style.width = `${window.innerWidth / 6}px`;
              // }
              IMG_SCALE(IMG_EL);
              let x = window.innerWidth / 2 - IMG_EL.clientWidth / 2;
              let y = window.innerHeight / 2 - IMG_EL.clientHeight / 2;
              let rotate = IMG_EL.dataset.angle;
              IMG_EL.style.transform = `translate(${x}px, ${y}px) rotate(${rotate}deg)`;
              setTimeout(() => {
                IMG_EL.style.transition = "transform .8s ease-in, opacity .2s ease-in";
                IMG_EL.style.opacity = 1;
                let posX = IMG_EL.dataset.x;
                let posY = IMG_EL.dataset.y;
                IMG_EL.style.transform = `translate(${posX}px, ${posY}px) rotate(${rotate}deg)`;
              }, 201);
            }
          }

          const ACTIVE_AFTER = DEPT_2.querySelector("img");
          if (ACTIVE_AFTER) {
            ACTIVE_AFTER.style.display = "block";
            let x = window.innerWidth / 2 - ACTIVE_AFTER.clientWidth / 2;
            let y = window.innerHeight / 2 - ACTIVE_AFTER.clientHeight / 2;
            let rotate = ACTIVE_AFTER.dataset.angle;
            ACTIVE_AFTER.style.opacity = 1;
            ACTIVE_AFTER.style.transform = `translate(${x}px, ${y}px) rotate(${rotate}deg)`;
            ACTIVE_IMG.classList.remove("active");
            ACTIVE_AFTER.classList.add("active");
          }
        }
      };
    }

    LOADING.hide();
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
