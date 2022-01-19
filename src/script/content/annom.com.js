function parseTime(testTime) {
  const a = testTime.split(' ');
  const result = {
    y: 0, m: 0, d: 0, h: 0, mi: 0, s: 0,
  };
  if (a.length >= 2) {
    const ymd = a[0].split('-');
    result.y = Number(ymd[0]);
    result.m = Number(ymd[1]);
    result.d = Number(ymd[2]);
    const hms = a[1].split(':');
    result.h = Number(hms[0]);
    result.mi = Number(hms[1]);
    result.s = Number(hms[2]);
  }
  return result;
}

setInterval(() => {
  const list = document.getElementsByClassName('content');
  if (list.length === 3) {
    const one = list[2].getElementsByClassName('collapsible-section');
    if (one.length >= 1) {
      const obj = one[0].getElementsByClassName('dl-horizontal');
      if (obj.length >= 1) {
        const r = obj[0].getElementsByTagName('dt');
        const j = obj[0].getElementsByTagName('dd');
        for (let i = 0; i < r.length; i += 1) {
          const dtname = r[i].innerText;
          if (dtname === 'Created') {
            const timeValue = j[i].innerText;
            const timeValueS = timeValue.split(' ');
            if (timeValueS.length === 3 && timeValueS[2] === 'PST') {
              const re = parseTime(timeValue);
              const stamp = new Date(re.y, re.m - 1, re.d, re.h, re.mi, re.s).getTime()
              / 1000 + 16 * 3600;
              j[i].innerText = new Date(stamp * 1000).toLocaleString();
            }
          }
        }
      }
    }
  }
}, 1000);
