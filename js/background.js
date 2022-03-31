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
