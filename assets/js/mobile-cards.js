const escape = value => String(value ?? '—').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const metric = (label, value) => `<div><dt>${escape(label)}</dt><dd>${escape(value)}</dd></div>`;
const distance = value => `${String(value ?? '—').replace(/\s*km$/i, '')} km`;
function mount(tableId, html) {
    const table = document.getElementById(tableId);
    if (!table) return;
    const wrapper = table.closest('.table-wrapper');
    wrapper.classList.add('desktop-records');
    let cards = wrapper.nextElementSibling;
    if (!cards?.classList.contains('mobile-records')) {
        cards = document.createElement('div');
        cards.className = 'mobile-records';
        wrapper.after(cards);
    }
    cards.innerHTML = html;
    cards.querySelectorAll('.active-day').forEach(day => day.addEventListener('toggle', () => {
        if (day.open) day.parentElement.querySelectorAll('.active-day').forEach(other => {
            if (other !== day) other.open = false;
        });
    }));
}
export function monthlyCards(months) {
    const goal = 80;
    const current = new Date().toLocaleDateString('sv-SE', {timeZone:'Asia/Taipei'}).slice(0,7);
    mount('monthly-summary-table', months.map(m => `<details class="record-card month-card"><summary><div class="record-heading"><span>${escape(m.month.replace('-', ' / '))}${m.month === current ? '<small class="period-note">截至今日</small>' : ''}</span><strong>${escape(distance(m.totalDistance))}</strong></div><div class="record-meta">${escape(m.totalRuns)} 次跑步 <span>·</span> ${escape(m.totalDuration)}</div><div class="goal-caption"><span>月目標 ${goal} km</span><strong>${Math.round((parseFloat(m.totalDistance)||0)/goal*1000)/10}%</strong></div><div class="distance-track" role="progressbar" aria-label="月跑量目標 ${goal} km" aria-valuemin="0" aria-valuemax="${goal}" aria-valuenow="${Math.min(goal,Math.max(0,parseFloat(m.totalDistance)||0))}" aria-valuetext="${escape(distance(m.totalDistance))}，目標 ${goal} km"><div style="width:${Math.min(100,Math.max(0,(parseFloat(m.totalDistance)||0)/goal*100))}%"></div></div><div class="goal-remaining">${(parseFloat(m.totalDistance)||0) >= goal ? '目標達成'+((parseFloat(m.totalDistance)||0)>goal ? ' · 超過 '+Number(((parseFloat(m.totalDistance)||0)-goal).toFixed(1))+' km' : '') : (m.month === current ? '還差 ' : '距目標差 ')+Number((goal-(parseFloat(m.totalDistance)||0)).toFixed(1))+' km'}</div><span class="expand-hint">詳細數據</span></summary><dl class="record-metrics">${metric('最快配速',m.fastestPace)}${metric('最長距離',distance(m.longestDistance))}${metric('最高平均心率',m.maxAvgHR)}${metric('最高步頻',m.maxCadence)}</dl></details>`).join(''));
}
export function weeklyCards(weeks) {
    const days = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
    mount('weekly-overview-table', weeks.map(w => {
        const [total,time,pace] = w.summary.split('/').map(s=>s.trim());
        return `<article class="record-card week-card"><div class="record-heading"><span>${escape(w.dateRange)}</span><strong>${escape(distance(total))}</strong></div><div class="record-meta">${escape(time)} <span>·</span> ${escape(pace)} /km</div><div class="week-desktop-summary"><div><span>週跑量</span><strong>${escape(total.replace(/km/i,''))}<small> km</small></strong></div><div><span>跑步次數</span><strong>${w.days.filter(Boolean).length}<small> 次</small></strong></div><div><span>總時長</span><strong>${Number(time.split(':')[0])}<small> 小時 </small>${Number(time.split(':')[1])}<small> 分</small></strong></div></div><div class="week-days">${days.map((day,i) => {
            const value = w.days[i];
            if (!value) return `<div class="rest-day"><span>${day}</span><span class="day-marker" aria-label="休息日"></span></div>`;
            const [dist,p,h] = value.split('/').map(s=>s.trim());
            const type = ['race','interval','group','easy'].includes(w.dayTypes?.[i]) ? w.dayTypes[i] : 'easy';
            const typeName = {race:'比賽',interval:'間歇跑',group:'團練／教練課',easy:'一般跑'}[type];
            return `<details class="active-day" data-run-type="${type}"><summary aria-label="${day} ${escape(value)}，${typeName}"><span>${day}</span><span class="day-marker"></span><span class="day-distance">${escape(dist.replace(/km/i,''))}</span></summary><dl class="day-details">${metric('距離',distance(dist))}${metric('配速',p+' /km')}${metric('心率',h+' bpm')}</dl></details>`;
        }).join('')}</div></article>`;
    }).join(''));
}
export function runCards(runs) {
    mount('recent-runs-table',runs.map(r=>`<details class="record-card"><summary><div class="record-heading"><span>${escape(r.date)}</span><strong>${escape(distance(r.distance))}</strong></div><div class="record-meta">${escape(r.pace)} /km <span>·</span> ${escape(r.duration)}</div><span class="expand-hint">詳細數據</span></summary><dl class="record-metrics">${metric('起跑時間',r.time)}${metric('平均心率',r.heartRate)}${metric('平均步頻',r.cadence)}${metric('VDOT',r.vdot)}</dl></details>`).join(''));
}
function splitList(splits = []) {
    if (!splits.length) return '<p class="record-meta">尚無分段資料</p>';
    const paceSeconds = value => {
        const parts = String(value ?? '').split(':').map(Number);
        return parts.length === 2 && parts.every(Number.isFinite) && parts[0] >= 0 && parts[1] >= 0 && parts[1] < 60
            ? parts[0] * 60 + parts[1] : NaN;
    };
    const valid = splits.map(s => paceSeconds(s.pace)).filter(n => Number.isFinite(n) && n > 0);
    const fastest = Math.min(...valid);
    const slowest = Math.max(...valid);
    return `<section class="split-analysis" aria-label="每公里分段">
        <div class="split-heading"><h4>每公里分段</h4><span>配速 min/km · 橫條越長越快</span></div>
        <label class="split-toggle"><input type="checkbox"> 顯示心率與步頻</label>
        <div class="split-scroll"><table class="split-list"><thead><tr><th scope="col">公里</th><th scope="col">配速比較</th><th scope="col">配速</th><th scope="col">累計時間</th><th scope="col" class="split-extra">心率 <small>bpm</small></th><th scope="col" class="split-extra">步頻 <small>spm</small></th></tr></thead><tbody>
        ${splits.map(s => {
            const pace = paceSeconds(s.pace);
            const validPace = Number.isFinite(pace) && pace > 0;
            const best = validPace && pace === fastest;
            const width = validPace ? (fastest === slowest ? 100 : 35 + (slowest - pace) / (slowest - fastest) * 65) : 0;
            return `<tr${best ? ' class="split-fastest"' : ''}><th scope="row">${escape(s.km)}</th><td><span class="split-bar" aria-hidden="true"><span style="width:${width}%"></span></span></td><td class="split-pace">${escape(s.pace)}${best ? '<span class="split-best">最快</span>' : ''}</td><td>${escape(String(s.time ?? '—').replace(/^00:/, ''))}</td><td class="split-extra">${escape(s.heartRate)}</td><td class="split-extra">${escape(s.cadence)}</td></tr>`;
        }).join('')}
        </tbody></table></div>
    </section>`;
}
export function raceCards(races) {
    mount('achievements-table', races.map(r => `<details class="record-card race-card"><summary>
        <div class="record-meta">${escape(r.date)} <span>·</span> 第 ${escape(r.no)} 場</div>
        <h3>${escape(r.race)}</h3>
        <div class="race-primary">
            <div><span>距離</span><strong>${escape(r.distance)}<small> km</small></strong></div>
            <div><span>總時長</span><strong>${escape(r.duration)}</strong></div>
            <div><span>平均配速</span><strong>${escape(r.avgPace)}<small> /km</small></strong></div>
        </div>
        <span class="expand-hint">詳細數據與分段 <span class="race-expand-icon" aria-hidden="true"></span></span>
        </summary>
        <dl class="record-metrics">${metric('平均心率',r.avgHeartRate)}${metric('平均步頻',r.avgCadence)}</dl>
        ${splitList(r.splits)}
    </details>`).join(''));
}
