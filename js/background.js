// 发送闹钟提醒
function noticeAlert(hour, minute) {
  chrome.storage.local.get(['noticeList'], (result) => {
    const res = result.noticeList;
    if (res !== undefined && res !== null && res !== '') {
      try {
        const rows = JSON.parse(res);
        for (let i = 0; i < rows.length; i += 1) {
          if (parseInt(rows[i].hour, 10) === hour || parseInt(rows[i].hour, 10) === -1) {
            if (parseInt(rows[i].minute, 10) === minute) {
              chrome.notifications.create(null, {
                type: 'basic',
                iconUrl: './../images/icon.png',
                title: '知敏工具提醒您',
                message: rows[i].remark,
              });
            }
          }
        }
      } catch (e) {
        console.log(e);
      }
    }
  });
}

chrome.alarms.create({ periodInMinutes: 1 });
chrome.alarms.onAlarm.addListener(() => {
  const date = new Date();
  const hour = date.getHours();
  const minute = date.getMinutes();
  noticeAlert(hour, minute);
});

function request_proxy({ url, method, data }) {
  const XHR = new XMLHttpRequest();
  XHR.open(method, url);
  XHR.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
  XHR.send(data);
  XHR.onreadystatechange = function () {
    if (XHR.readyState === 4) {
      console.log(XHR.responseText);
    }
  };
}

chrome.runtime.onMessage.addListener((data, sender, sendResponse) => {
  const url = 'http://127.0.0.1:8081/api/chrome-extension/save-spider?token=zhimin-studio-save-spider';
  fetch(url, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  }).then((resp) => {
    console.log(resp);
  });
  // request_proxy({ url, method: 'POST', data });
  sendResponse({ code: 200 });
});
