// 设置csdn烦人的【展开阅读全文】、【弹出登录】功能
setTimeout(() => {
  document.getElementById("article_content").style.height = "auto";
  const hideOpenMore = document.getElementsByClassName("hide-article-box");
  for (let i = 0; i < hideOpenMore.length; i += 1) {
    hideOpenMore[i].remove();
  }
  document.getElementById("passportbox").style.display = "none";
  const loginMark = document.getElementsByClassName("login-mark");
  for (let i = 0; i < loginMark.length; i += 1) {
    loginMark[i].remove();
  }
}, 2000);
