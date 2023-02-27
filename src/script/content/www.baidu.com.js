setTimeout(() => {
  // 右侧百度热榜
  const rightObj = document.getElementById("content_right");
  if (rightObj !== undefined) {
    rightObj.remove();
  }
  // 左侧广告
  for (let j = 1; j < 10; j += 1) {
    const tempMin = j * 1000;
    const tempMax = tempMin + 20;
    for (let i = tempMin; i < tempMax; i += 1) {
      const pObj = document.getElementById(`${i}`);
      if (pObj !== undefined && pObj !== null) {
        pObj.style.display = "none !important";
        pObj.remove();
      }
    }
  }
}, 1000);
setInterval(() => {
  // 左侧广告
  const tuiguangPpm = document.getElementsByClassName("EC_ppim_new_gap_bottom");
  for (let i = 0; i < tuiguangPpm.length; i += 1) {
    tuiguangPpm[i].remove();
  }
  const tuiGuangObj = document.getElementsByClassName("ec_tuiguang_pplink");
  for (let i = 0; i < tuiGuangObj.length; i += 1) {
    tuiGuangObj[i].parentNode.parentNode.remove();
  }
}, 10);
