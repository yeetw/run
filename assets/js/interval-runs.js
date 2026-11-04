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
// October screenshots: work laps 3,5,...,21. Pace is estimated from rounded GPS distance.
const octoberLaps = [
 ['2:44',.31,136,162,'1:13'], ['2:42',.31,143,161,'1:31'],
 ['2:45',.31,146,161,'1:47'], ['2:52',.32,147,161,'1:15'],
 ['2:47',.30,147,160,'1:18'], ['2:48',.31,147,163,'1:10'],
 ['2:41',.31,149,161,'1:18'], ['2:49',.30,149,157,'1:07'],
 ['2:38',.30,158,159,'1:09'], ['2:32',.31,159,159,null]
];
const sessions = [
 {date:'2026-11-03', reps:novemberReps, estimated:false, rest:'1', restUnit:'min'},
 {date:'2026-10-31', reps:octoberLaps.map(([time,km,hr,cadence,rest]) => [clock(Math.round(seconds(time)/km)),time,hr,cadence,rest]), distance:octoberLaps.reduce((sum,r)=>sum+r[1],0), estimated:true, rest:clock(Math.round(octoberLaps.filter(r=>r[4]).reduce((sum,r)=>sum+seconds(r[4]),0)/9)), restUnit:'平均'}
];
function sessionCard(session) {
 const {reps} = session;
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
        <div class="ir-date"><span class="ir-label">日期</span><time datetime="${session.date}">${session.date.replaceAll('-', '/')}</time><span class="ir-session-tag">300m × ${reps.length} 組</span></div>
        <div><span class="ir-label">平均配速</span><strong>${session.estimated ? '約 ' : ''}${clock(Math.round(totalTime / totalDistance))}</strong><span class="ir-unit"> /km</span></div>
        <div><span class="ir-label">組間休息</span><strong>${session.rest}</strong><span class="ir-unit"> ${session.restUnit}</span></div>
        <div><span class="ir-label">平均心率</span><strong>${weighted(2)}</strong><span class="ir-unit"> bpm</span></div>
        <div><span class="ir-label">步頻</span><strong>${weighted(3)}</strong><span class="ir-unit"> spm</span></div>
        <span class="ir-expand"><span class="ir-open-text" aria-hidden="true">＋</span><span class="ir-close-text" aria-hidden="true">－</span><span class="ir-sr-only">逐組數據</span></span>
      </summary>
      <div class="ir-detail">
        <div class="ir-detail-heading"><h3>300m × ${reps.length} 組</h3><span>快跑合計 ${clock(totalTime)} · 不含暖身與休息</span></div>
        <div class="ir-table-scroll"><table class="ir-table"><caption class="ir-sr-only">${session.date}，${reps.length}組300公尺間歇逐組數據</caption><thead><tr><th scope="col">組數</th><th scope="col"><span class="ir-desktop-label">配速 /km</span><span class="ir-mobile-label">配速</span></th><th scope="col"><span class="ir-desktop-label">完成時間</span><span class="ir-mobile-label">時間</span></th><th scope="col"><span class="ir-desktop-label">平均心率 <small>bpm</small></span><span class="ir-mobile-label">心率</span></th><th scope="col"><span class="ir-desktop-label">步頻 <small>spm</small></span><span class="ir-mobile-label">步頻</span></th><th scope="col"><span class="ir-desktop-label">組後休息</span><span class="ir-mobile-label">休息</span></th><th scope="col" class="ir-comparison">配速比較</th></tr></thead><tbody>
        ${reps.map((r,i) => `<tr><th scope="row">${String(i+1).padStart(2,'0')}<span class="ir-rep-distance">300m</span></th><td class="ir-pace" title="${session.estimated ? '依截圖距離與時間估算' : '原始配速'}">${session.estimated ? '約 ' : ''}${r[0]}</td><td>${r[1]}</td><td>${r[2]}</td><td>${r[3]}</td><td class="ir-rest">${r[4] || '—'}</td><td class="ir-comparison"><span class="ir-pace-track${seconds(r[0]) === fastestPace ? ' ir-fastest' : ''}" role="img" aria-label="第 ${i+1} 組配速 ${r[0]} 每公里${seconds(r[0]) === fastestPace ? '，最快' : ''}"><span style="width:${paceWidth(r[0]).toFixed(2)}%"></span></span></td></tr>`).join('')}
        </tbody></table></div>
      </div>
    </details>`;
}
const section = document.querySelector('#interval-run-content');
const filter = document.querySelector('#interval-distance');
function renderIntervals() {
  if (!['all','300'].includes(filter.value)) {
    section.innerHTML = '<div class="ir-empty" role="status">目前還沒有這個距離的間歇紀錄。</div>';
    return;
  }
  section.innerHTML = sessions.map(sessionCard).join('');
}
filter.addEventListener('change', renderIntervals);
renderIntervals();
