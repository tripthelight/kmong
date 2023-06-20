const hasChildren = require("./hasChildren.js");

const calculateDepth = (elements) => {
  let list = elements.constructor.name === "HTMLCollection" ? [].concat(elements) : Array.from(elements.children);

  let findDepts = list
    .filter((item) => item.classList.contains("dept"))
    .map((element) => {
      if (hasChildren(element)) {
        return 1 + calculateDepth(element);
      } else {
        return 1;
      }
    });

  findDepts.push(0);
  return Math.max.apply(null, findDepts);

  // let depths = list.map((element) => {
  //   // if (!element.classList.contains("dept")) return 0;
  //   if (hasChildren(element)) {
  //     return 1 + calculateDepth(element);
  //   } else {
  //     return 1;
  //   }
  // });
  // depths.push(0);
  // return Math.max.apply(null, depths);
};

module.exports = calculateDepth;
