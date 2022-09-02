console.log('----zhimin spider inject');

function parseStyleUrl(str) {
  const regex = /url\(\"(.*)\"\)/gm;

  // Alternative syntax using RegExp constructor
  // const regex = new RegExp('url\\(\\"(.*)\\"\\)', 'gm')
  let m;
  const save = {};

  while ((m = regex.exec(str)) !== null) {
    // This is necessary to avoid infinite loops with zero-width matches
    if (m.index === regex.lastIndex) {
      regex.lastIndex++;
    }

    // The result can be accessed through the `m`-variable.
    m.forEach((match, groupIndex) => {
      save[groupIndex] = match;
    });
  }
  return save;
}

setInterval(() => {
  const saveData = [];
  const content = document.getElementsByClassName('wbpro-scroller-item');
  for (let i = 0; i < content.length; i += 1) {
    const oneItem = content[i];
    let videoUrl = '';
    let videoCover = '';

    let repost = false;
    // 转发的内容 正文+视频+封面
    const originalContent = oneItem.getElementsByClassName('wbpro-feed-reText');
    for (let iD = 0; iD < originalContent.length; iD += 1) {
      repost = true;
      const videoContainer = originalContent[iD].nextSibling;
      const videoInfo = videoContainer.getElementsByTagName('video');
      if (videoInfo.length > 0) {
        videoUrl = videoInfo[0].getAttribute('src');
      }
      const coverInfo = videoContainer.getElementsByClassName('wbpv-poster');
      if (coverInfo.length > 0) {
        videoCover = coverInfo[0].getAttribute('style');
      }
    }
    let userName = '';
    for (let oC = 0; oC < originalContent.length; oC += 1) {
      if (oC === 0) {
        userName = originalContent[oC].innerText;
      }
    }

    // 原始的内容 正文+视频+封面
    const userContent = oneItem.getElementsByClassName('wbpro-feed-ogText');
    let uContent = '';
    for (let uC = 0; uC < userContent.length; uC += 1) {
      if (uC === 0) {
        uContent = userContent[uC].innerText;
      }
      if (!repost) {
        const videoContainer = userContent[uC].nextSibling;
        if (videoContainer) {
          const videoInfo = videoContainer.getElementsByTagName('video');
          if (videoInfo.length > 0) {
            videoUrl = videoInfo[0].getAttribute('src');
          }
          const coverInfo = videoContainer.getElementsByClassName('wbpv-poster');
          if (coverInfo.length > 0) {
            videoCover = coverInfo[0].getAttribute('style');
          }
        }
      }
    }

    // 获取文本链接
    let linkUrl = '';
    const contentId = oneItem.getElementsByClassName('woo-box-justifyBetween');
    for (let iC = 0; iC < contentId.length; iC += 1) {
      if (iC === 0) {
        if (contentId[iC].getElementsByTagName('a').length > 0) {
          linkUrl = contentId[iC].getElementsByTagName('a')[0].getAttribute('href');
        }
      }
    }
    if (linkUrl === '') {
      const clink = oneItem.getElementsByClassName('woo-box-justifyCenter');
      for (let iC = 0; iC < clink.length; iC += 1) {
        if (iC === 1) {
          if (clink[iC].getElementsByTagName('a').length > 0) {
            linkUrl = clink[iC].getElementsByTagName('a')[0].getAttribute('href');
          }
        }
      }
    }

    // 获取图片或者live photo视频
    const imageList = [];
    const videoList = [];
    const orignalPic = oneItem.getElementsByClassName('woo-picture-slot');
    for (let p = 0; p < orignalPic.length; p += 1) {
      const oneSmallPic = orignalPic[p].getElementsByTagName('img');
      if (oneSmallPic.length > 0) {
        for (let sP = 0; sP < oneSmallPic.length; sP += 1) {
          imageList.push(oneSmallPic[sP].getAttribute('src'));
        }
      }
      const vides = orignalPic[p].getElementsByTagName('video');
      if (vides.length > 0) {
        for (let sP = 0; sP < vides.length; sP += 1) {
          videoList.push(vides[sP].getAttribute('src'));
        }
      }
    }
    const exp = userName.split('\n');
    let uName = '';
    let ucContent = '';
    if (exp.length >= 2) {
      [uName, ucContent] = exp;
    } else {
      ucContent = userName;
    }
    let videoCoverUrl = '';
    if (videoCover !== '') {
      const urlArr = parseStyleUrl(videoCover);
      if (urlArr[1] !== undefined) {
        videoCoverUrl = urlArr[1];
      }
    }
    saveData.push({
      link: linkUrl,
      content: uContent,
      post: {
        userName: uName,
        content: ucContent,
      },
      videoInfo: {
        videoUrl,
        videoCoverUrl,
      },
      images: imageList,
      liveVideo: videoList,
    });
  }
  chrome.runtime.sendMessage({ list: saveData }, (data) => {
  });
}, 3000);
