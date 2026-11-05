// Screenshot laps 5–27: complete work intervals only; warm-up laps 1–4 excluded.
const novemberReps = [
  ['8:16','2:32',141,159,'1:05'], ['8:24','2:33',147,162,'1:17'],
  ['8:11','2:28',151,161,'1:02'], ['8:15','2:30',155,160,'1:02'],
  ['8:20','2:34',156,155,'1:02'], ['8:09','2:30',157,159,'1:03'],
  ['8:25','2:36',158,158,'1:44'], ['8:25','2:32',155,159,'1:02'],
  ['8:05','2:31',158,163,'1:02'], ['8:27','2:35',157,160,'1:05'],
  ['8:15','2:33',160,160,'1:02'], ['8:03','2:27',164,156,null]
];
const seconds = value => value.split(':').reduce((sum, n) => sum * 60 + Number(n), 0);
const clock = value => `${Math.floor(value / 60)}:${String(Math.round(value % 60)).padStart(2,'0')}`;
// October screenshots: work laps 3,5,...,21; original pace from IMG_1398.
const octoberLaps = [
 ['2:44',.31,136,162,'1:13'], ['2:42',.31,143,161,'1:31'],
 ['2:45',.31,146,161,'1:47'], ['2:52',.32,147,161,'1:15'],
 ['2:47',.30,147,160,'1:18'], ['2:48',.31,147,163,'1:10'],
 ['2:41',.31,149,161,'1:18'], ['2:49',.30,149,157,'1:07'],
 ['2:38',.30,158,159,'1:09'], ['2:32',.31,159,159,null]
];
const octoberPaces = ['8:51','8:45','8:59','9:05','9:12','8:56','8:43','9:15','8:43','8:16'];
// October 15 screenshots: complete 300m work laps 9,11,...,25 only.
const october15Reps = [
 ['7:31','2:18',153,169,'0:52'], ['7:55','2:24',158,165,'1:17'],
 ['8:13','2:26',156,164,'1:21'], ['8:16','2:32',152,168,'1:08'],
 ['8:02','2:27',155,173,'0:57'], ['7:57','2:23',156,167,'0:58'],
 ['8:18','2:33',157,166,'1:02'], ['8:21','2:36',154,167,'0:56'],
 ['7:58','2:30',156,169,null]
];
// October 29 screenshots: 600m work laps 3, 5, 7; laps 1–2 excluded.
const october29Reps = [
 ['10:54','7:00',137,153,'2:07'],
 ['10:29','7:08',142,159,'2:09'],
 ['11:09','6:45',139,154,'1:50']
];
const sessions = [
 {date:'2026-11-03', reps:novemberReps, estimated:false, rest:'1', restUnit:'min'},
 {date:'2026-10-31', reps:octoberLaps.map(([time,km,hr,cadence,rest], i) => [octoberPaces[i],time,hr,cadence,rest]), estimated:false, rest:clock(Math.round(octoberLaps.filter(r=>r[4]).reduce((sum,r)=>sum+seconds(r[4]),0)/9)), restUnit:'平均'},
 {date:'2026-10-29', interval:600, reps:october29Reps, estimated:false, rest:'2:08', restUnit:'平均'},
 {date:'2026-10-15', reps:october15Reps, estimated:false, rest:clock(Math.round(october15Reps.filter(r=>r[4]).reduce((sum,r)=>sum+seconds(r[4]),0)/8)), restUnit:'平均'}
];
function sessionCard(session) {
 const {reps} = session;
 const interval = session.interval ?? 300;
 const metricHighlight = (value, column) => {
   const values = reps.map(r => r[column]);
   return value === Math.max(...values) ? 'ir-pace-best' : value === Math.min(...values) ? 'ir-pace-slowest' : '';
 };
const fastestPace = Math.min(...reps.map(r => seconds(r[0])));
const slowestPace = Math.max(...reps.map(r => seconds(r[0])));
// Relative comparison: faster repetitions have longer bars, from 35% to 100%.
const paceWidth = pace => slowestPace === fastestPace ? 100 : 35 + 65 * (slowestPace - seconds(pace)) / (slowestPace - fastestPace);
const totalTime = reps.reduce((sum, r) => sum + seconds(r[1]), 0);
// Pace weighted by work duration; distance inferred from the displayed lap pace,
// avoiding bias from screenshot distances rounded to 0.01 km.
const totalDistance = session.distance ?? reps.reduce((sum, r) => sum + seconds(r[1]) / seconds(r[0]), 0);
const weighted = column => Math.round(reps.reduce((sum, r) => sum + r[column] * seconds(r[1]), 0) / totalTime);
return `
    <details class="ir-session">
      <summary>
        <div class="ir-date"><span class="ir-label">日期</span><time datetime="${session.date}">${session.date.replaceAll('-', '/')}</time><span class="ir-session-tag">${interval}m × ${reps.length} 組</span></div>
        <div><span class="ir-label">平均配速</span><strong>${session.estimated ? '約 ' : ''}${clock(Math.round(totalTime / totalDistance))}</strong><span class="ir-unit"> /km</span></div>
        <div><span class="ir-label">組間休息</span><strong>${session.rest}</strong><span class="ir-unit"> ${session.restUnit}</span></div>
        <div><span class="ir-label">平均心率</span><strong>${weighted(2)}</strong><span class="ir-unit"> bpm</span></div>
        <div><span class="ir-label">步頻</span><strong>${weighted(3)}</strong><span class="ir-unit"> spm</span></div>
        <span class="ir-expand"><span class="ir-open-text" aria-hidden="true">＋</span><span class="ir-close-text" aria-hidden="true">－</span><span class="ir-sr-only">逐組數據</span></span>
      </summary>
      <div class="ir-detail">
        <div class="ir-detail-heading"><h3>${interval}m × ${reps.length} 組</h3><span>快跑合計 ${clock(totalTime)} · 不含暖身與休息</span></div>
        <div class="ir-table-scroll"><table class="ir-table"><caption class="ir-sr-only">${session.date}，${reps.length}組${interval}公尺間歇逐組數據</caption><thead><tr><th scope="col">組數</th><th scope="col"><span class="ir-desktop-label">配速 /km</span><span class="ir-mobile-label">配速</span></th><th scope="col"><span class="ir-desktop-label">完成時間</span><span class="ir-mobile-label">時間</span></th><th scope="col"><span class="ir-desktop-label">平均心率 <small>bpm</small></span><span class="ir-mobile-label">心率</span></th><th scope="col"><span class="ir-desktop-label">步頻 <small>spm</small></span><span class="ir-mobile-label">步頻</span></th><th scope="col"><span class="ir-desktop-label">組後休息</span><span class="ir-mobile-label">休息</span></th><th scope="col" class="ir-comparison">配速比較</th></tr></thead><tbody>
        ${reps.map((r,i) => `<tr><th scope="row">${String(i+1).padStart(2,'0')}<span class="ir-rep-distance">${interval}m</span></th><td class="ir-pace" title="${session.estimated ? '依截圖距離與時間估算' : '原始配速'}"><span class="ir-pace-value${seconds(r[0]) === fastestPace ? ' ir-pace-best' : seconds(r[0]) === slowestPace ? ' ir-pace-slowest' : ''}">${session.estimated ? '約 ' : ''}${r[0]}</span></td><td>${r[1]}</td><td><span class="ir-pace-value ${metricHighlight(r[2],2)}">${r[2]}</span></td><td><span class="ir-pace-value ${metricHighlight(r[3],3)}">${r[3]}</span></td><td class="ir-rest">${r[4] || '—'}</td><td class="ir-comparison"><span class="ir-pace-track${seconds(r[0]) === fastestPace ? ' ir-fastest' : ''}" role="img" aria-label="第 ${i+1} 組配速 ${r[0]} 每公里${seconds(r[0]) === fastestPace ? '，最快' : ''}"><span style="width:${paceWidth(r[0]).toFixed(2)}%"></span></span></td></tr>`).join('')}
        </tbody></table></div>
      </div>
    </details>`;
}
const section = document.querySelector('#interval-run-content');
const filter = document.querySelector('#interval-distance');
function renderIntervals() {
  const selected = sessions.filter(session => filter.value === 'all' || String(session.interval ?? 300) === filter.value);
  if (!selected.length) {
    section.innerHTML = '<div class="ir-empty" role="status">目前還沒有這個距離的間歇紀錄。</div>';
    return;
  }
  section.innerHTML = selected.map(sessionCard).join('');
}
filter.addEventListener('change', renderIntervals);
renderIntervals();
