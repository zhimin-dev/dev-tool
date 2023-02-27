setTimeout(() => {
  const hideContent = document.getElementsByClassName("article-hide-content");
  if (hideContent.length > 0) {
    console.log("block hide content");
    console.log(hideContent[0]);
    hideContent[0].style.height = "auto";
    hideContent[0].style.overflow = "visible";
  }
  const mask = document.getElementsByClassName("dbl-popup-backdrop");
  if (mask.length > 0) {
    console.log("block mask");
    mask[0].style.display = "none";
  }
}, 5000);
