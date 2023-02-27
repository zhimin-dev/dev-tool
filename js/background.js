// 发送闹钟提醒
function noticeAlert(hour, minute) {
  chrome.storage.local.get(["noticeList"], (result) => {
    const res = result.noticeList;
    if (res !== undefined && res !== null && res !== "") {
      try {
        const rows = JSON.parse(res);
        for (let i = 0; i < rows.length; i += 1) {
          if (
            parseInt(rows[i].hour, 10) === hour ||
            parseInt(rows[i].hour, 10) === -1
          ) {
            if (parseInt(rows[i].minute, 10) === minute) {
              chrome.notifications.create(null, {
                type: "basic",
                iconUrl: "./../icon.png",
                title: "dev-tool提醒您",
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
  XHR.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  XHR.send(data);
  XHR.onreadystatechange = function () {
    if (XHR.readyState === 4) {
      console.log(XHR.responseText);
    }
  };
}

const wbSpiderConfig = {};

chrome.storage.onChanged.addListener((changes, namespace) => {
  console.log("change ======");
  for (const [key, { oldValue, newValue }] of Object.entries(changes)) {
    console.log("change key", key, newValue);
    if (key === "wbSpider" || key === "wbSpiderStart") {
      if (key === "wbSpider") {
        wbSpiderConfig.url = newValue;
      } else if (key === "wbSpiderStart") {
        wbSpiderConfig.start = newValue;
      }
    }
    console.log(wbSpiderConfig);
  }
});

chrome.runtime.onMessage.addListener((data, sender, sendResponse) => {
  console.log(data, wbSpiderConfig);
  if (wbSpiderConfig.url !== "" && wbSpiderConfig.start) {
    fetch(wbSpiderConfig.url, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
      },
    })
      .then((resp) => {
        console.log(resp);
        sendResponse({ code: 200 });
      })
      .catch((err) => {
        console.log(err);
        sendResponse({ code: 500 });
      });
  }
  sendResponse({ code: 200 });
});
