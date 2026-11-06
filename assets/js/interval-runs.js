import { sessions } from './interval-sessions.js';
const seconds = value => value.split(':').reduce((sum, n) => sum * 60 + Number(n), 0);
const clock = value => `${Math.floor(value / 60)}:${String(Math.round(value % 60)).padStart(2,'0')}`;
function sessionCard(session) {
 const {reps} = session;
 const interval = session.interval ?? 300;
 const label = session.label ?? (interval === 1000 ? '1km' : `${interval}m`);
 const showDistance = Array.isArray(session.repDistances);
 const distanceTotal = showDistance ? session.repDistances.reduce((sum, km) => sum + km, 0) : null;
 const metricHighlight = (value, column) => {
   if (value == null) return '';
   const values = reps.map(r => r[column]).filter(v => v != null);
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
const weighted = column => {
 const available = reps.filter(r => r[column] != null);
 return available.length ? Math.round(available.reduce((sum, r) => sum + r[column] * seconds(r[1]), 0) / available.reduce((sum, r) => sum + seconds(r[1]), 0)) : '—';
};
return `
    <details class="ir-session" id="interval-${session.date}">
      <summary>
        <div class="ir-date"><span class="ir-label">日期</span><time datetime="${session.date}">${session.date.replaceAll('-', '/')}</time><span class="ir-session-tag">${label} × ${reps.length} 組</span></div>
        <div><span class="ir-label">平均配速</span><strong>${session.estimated ? '約 ' : ''}${clock(Math.round(totalTime / totalDistance))}</strong><span class="ir-unit"> /km</span></div>
        <div><span class="ir-label">組間休息</span><strong>${session.rest}</strong><span class="ir-unit"> ${session.restUnit}</span></div>
        <div><span class="ir-label">平均心率</span><strong>${weighted(2)}</strong><span class="ir-unit"> bpm</span></div>
        <div><span class="ir-label">步頻</span><strong>${weighted(3)}</strong><span class="ir-unit"> spm</span></div>
        <span class="ir-expand"><span class="ir-open-text" aria-hidden="true">＋</span><span class="ir-close-text" aria-hidden="true">－</span><span class="ir-sr-only">逐組數據</span></span>
      </summary>
      <div class="ir-detail">
        <div class="ir-detail-heading"><h3>${label} × ${reps.length} 組</h3><span>快跑合計 ${clock(totalTime)}${showDistance ? ` · ${distanceTotal.toFixed(2)} km` : ''} · 不含暖身與休息</span></div>
        <div class="ir-table-scroll"><table class="ir-table"><caption class="ir-sr-only">${session.date}，${reps.length}組${label}間歇逐組數據</caption><thead><tr><th scope="col">組數</th>${showDistance ? '<th scope="col">距離 <small>km</small></th>' : ''}<th scope="col"><span class="ir-desktop-label">配速 /km</span><span class="ir-mobile-label">配速</span></th><th scope="col"><span class="ir-desktop-label">完成時間</span><span class="ir-mobile-label">時間</span></th><th scope="col"><span class="ir-desktop-label">平均心率 <small>bpm</small></span><span class="ir-mobile-label">心率</span></th><th scope="col"><span class="ir-desktop-label">步頻 <small>spm</small></span><span class="ir-mobile-label">步頻</span></th><th scope="col"><span class="ir-desktop-label">組後休息</span><span class="ir-mobile-label">休息</span></th><th scope="col" class="ir-comparison">配速比較</th></tr></thead><tbody>
        ${reps.map((r,i) => `<tr><th scope="row">${String(i+1).padStart(2,'0')}<span class="ir-rep-distance">${label}</span></th>${showDistance ? `<td>${session.repDistances[i].toFixed(2)}</td>` : ''}<td class="ir-pace" title="${session.estimated ? '依截圖距離與時間估算' : '原始配速'}"><span class="ir-pace-value${seconds(r[0]) === fastestPace ? ' ir-pace-best' : seconds(r[0]) === slowestPace ? ' ir-pace-slowest' : ''}">${session.estimated ? '約 ' : ''}${r[0]}</span></td><td>${r[1]}</td><td><span class="ir-pace-value ${metricHighlight(r[2],2)}">${r[2] ?? '—'}</span></td><td><span class="ir-pace-value ${metricHighlight(r[3],3)}">${r[3]}</span></td><td class="ir-rest">${r[4] || '—'}</td><td class="ir-comparison"><span class="ir-pace-track${seconds(r[0]) === fastestPace ? ' ir-fastest' : ''}" role="img" aria-label="第 ${i+1} 組配速 ${r[0]} 每公里${seconds(r[0]) === fastestPace ? '，最快' : ''}"><span style="width:${paceWidth(r[0]).toFixed(2)}%"></span></span></td></tr>`).join('')}
        </tbody></table></div>
        ${session.note ? `<p class="ir-note">${session.note}</p>` : ''}
        ${session.interval === '7min' ? '<p class="ir-note">課表：跑 7 分鐘、休 2 分鐘。採用原紀錄第 9、11、13、15 圈；完成時間與組後休息保留實際紀錄。</p>' : ''}
      </div>
    </details>`;
}
const section = document.querySelector('#interval-run-content');
const filter = document.querySelector('#interval-distance');
const showAllButton = document.querySelector('#interval-show-all');
let showAll = false;
const mobileLayout = window.matchMedia('(max-width: 768px)');
function renderIntervals() {
  const limit = mobileLayout.matches ? 3 : 5;
  const selected = sessions.filter(session => {
    const interval = session.interval ?? 300;
    const type = typeof interval === 'string' && interval.endsWith('min') ? 'timed' : String(interval);
    return filter.value === 'all' || type === filter.value;
  }).sort((a, b) => b.date.localeCompare(a.date));
  showAllButton.style.display = !showAll && selected.length > limit ? 'flex' : 'none';
  showAllButton.setAttribute('aria-expanded', String(showAll));
  if (!selected.length) {
    section.innerHTML = '<div class="ir-empty" role="status">目前還沒有這個類型的間歇紀錄。</div>';
    return;
  }
  section.innerHTML = (showAll ? selected : selected.slice(0, limit)).map(sessionCard).join('');
}
mobileLayout.addEventListener('change', renderIntervals);
filter.addEventListener('change', () => {
  showAll = false;
  renderIntervals();
});
showAllButton.addEventListener('click', () => {
  showAll = true;
  renderIntervals();
});
renderIntervals();

function openLinkedInterval() {
  const date = window.location.hash.match(/^#interval-(\d{4}-\d{2}-\d{2})$/)?.[1];
  if (!date || !sessions.some(session => session.date === date)) return;
  filter.value = 'all';
  showAll = true;
  renderIntervals();
  const target = document.getElementById(`interval-${date}`);
  target.open = true;
  target.scrollIntoView({ block: 'start' });
  target.querySelector('summary').focus({ preventScroll: true });
}
window.addEventListener('hashchange', openLinkedInterval);
document.addEventListener('click', event => {
  const link = event.target.closest('a.week-session-tag');
  if (link?.getAttribute('href') === window.location.hash) {
    event.preventDefault();
    openLinkedInterval();
  }
});
openLinkedInterval();
