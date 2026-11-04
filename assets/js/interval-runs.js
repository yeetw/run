// Screenshot laps 5–27: complete work intervals only; warm-up laps 1–4 excluded.
const reps = [
  ['8:16','2:32',141,159,'1:05'], ['8:24','2:33',147,162,'1:17'],
  ['8:11','2:28',151,161,'1:02'], ['8:15','2:30',155,160,'1:02'],
  ['8:20','2:34',156,155,'1:02'], ['8:09','2:30',157,159,'1:03'],
  ['8:25','2:36',158,158,'1:44'], ['8:25','2:32',155,159,'1:02'],
  ['8:05','2:31',158,163,'1:02'], ['8:27','2:35',157,160,'1:05'],
  ['8:15','2:33',160,160,'1:02'], ['8:03','2:27',164,156,null]
];
const seconds = value => value.split(':').reduce((sum, n) => sum * 60 + Number(n), 0);
const clock = value => `${Math.floor(value / 60)}:${String(Math.round(value % 60)).padStart(2,'0')}`;
const totalTime = reps.reduce((sum, r) => sum + seconds(r[1]), 0);
// Pace weighted by work duration; distance inferred from the displayed lap pace,
// avoiding bias from screenshot distances rounded to 0.01 km.
const totalDistance = reps.reduce((sum, r) => sum + seconds(r[1]) / seconds(r[0]), 0);
const weighted = column => Math.round(reps.reduce((sum, r) => sum + r[column] * seconds(r[1]), 0) / totalTime);
const section = document.querySelector('#interval-run-content');
const filter = document.querySelector('#interval-distance');
function renderIntervals() {
  if (!['all','300'].includes(filter.value)) {
    section.innerHTML = '<div class="ir-empty" role="status">目前還沒有這個距離的間歇紀錄。</div>';
    return;
  }
  section.innerHTML = `
    <details class="ir-session">
      <summary>
        <div class="ir-date"><span class="ir-label">日期</span><time datetime="2026-11-03">2026/11/03</time><span class="ir-session-tag">300m × 12 組</span></div>
        <div><span class="ir-label">平均配速</span><strong>${clock(Math.round(totalTime / totalDistance))}</strong><span class="ir-unit"> /km</span></div>
        <div><span class="ir-label">組間休息</span><strong>1</strong><span class="ir-unit"> min</span></div>
        <div><span class="ir-label">平均心率</span><strong>${weighted(2)}</strong><span class="ir-unit"> bpm</span></div>
        <div><span class="ir-label">步頻</span><strong>${weighted(3)}</strong><span class="ir-unit"> spm</span></div>
        <span class="ir-expand"><span class="ir-open-text" aria-hidden="true">＋</span><span class="ir-close-text" aria-hidden="true">－</span><span class="ir-sr-only">逐組數據</span></span>
      </summary>
      <div class="ir-detail">
        <div class="ir-detail-heading"><h3>300m × 12 組</h3><span>快跑合計 ${clock(totalTime)} · 不含暖身與休息</span></div>
        <div class="ir-table-scroll"><table class="ir-table"><caption class="ir-sr-only">2026年11月3日，12組300公尺間歇逐組數據</caption><thead><tr><th scope="col">組數</th><th scope="col">配速 /km</th><th scope="col">完成時間</th><th scope="col">平均心率 <small>bpm</small></th><th scope="col">步頻 <small>spm</small></th><th scope="col">組後休息</th></tr></thead><tbody>
        ${reps.map((r,i) => `<tr><th scope="row">${String(i+1).padStart(2,'0')}<span class="ir-rep-distance">300m</span></th><td class="ir-pace">${r[0]}</td><td>${r[1]}</td><td>${r[2]}</td><td>${r[3]}</td><td class="ir-rest">${r[4] || '—'}</td></tr>`).join('')}
        </tbody></table></div>
      </div>
    </details>`;
}
filter.addEventListener('change', renderIntervals);
renderIntervals();
