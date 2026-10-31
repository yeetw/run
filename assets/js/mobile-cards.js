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
    const goal = 100;
    const current = new Date().toLocaleDateString('sv-SE', {timeZone:'Asia/Taipei'}).slice(0,7);
    mount('monthly-summary-table', months.map(m => `<details class="record-card month-card"><summary><div class="record-heading"><span>${escape(m.month.replace('-', ' / '))}${m.month === current ? '<small class="period-note">截至今日</small>' : ''}</span><strong>${escape(distance(m.totalDistance))}</strong></div><div class="record-meta">${escape(m.totalRuns)} 次跑步 <span>·</span> ${escape(m.totalDuration)}</div><div class="goal-caption"><span>月目標 ${goal} km</span><strong>${Math.round((parseFloat(m.totalDistance)||0)/goal*1000)/10}%</strong></div><div class="distance-track" role="progressbar" aria-label="月跑量目標 ${goal} km" aria-valuemin="0" aria-valuemax="${goal}" aria-valuenow="${Math.min(goal,Math.max(0,parseFloat(m.totalDistance)||0))}" aria-valuetext="${escape(distance(m.totalDistance))}，目標 ${goal} km"><div style="width:${Math.min(100,Math.max(0,(parseFloat(m.totalDistance)||0)/goal*100))}%"></div></div><div class="goal-remaining">${(parseFloat(m.totalDistance)||0) >= goal ? '目標達成'+((parseFloat(m.totalDistance)||0)>goal ? ' · 超過 '+Number(((parseFloat(m.totalDistance)||0)-goal).toFixed(1))+' km' : '') : (m.month === current ? '還差 ' : '距目標差 ')+Number((goal-(parseFloat(m.totalDistance)||0)).toFixed(1))+' km'}</div><span class="expand-hint">詳細數據</span></summary><dl class="record-metrics">${metric('最快配速',m.fastestPace)}${metric('最長距離',distance(m.longestDistance))}${metric('最高平均心率',m.maxAvgHR)}${metric('最高步頻',m.maxCadence)}</dl></details>`).join(''));
}
export function weeklyCards(weeks) {
    const days = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
    mount('weekly-overview-table', weeks.map(w => {
        const [total,time,pace] = w.summary.split('/').map(s=>s.trim());
        return `<article class="record-card week-card"><div class="record-heading"><span>${escape(w.dateRange)}</span><strong>${escape(distance(total))}</strong></div><div class="record-meta">${escape(time)} <span>·</span> ${escape(pace)} /km</div><div class="week-days">${days.map((day,i) => {
            const value = w.days[i];
            if (!value) return `<div class="rest-day"><span>${day}</span><span class="day-marker" aria-label="休息日"></span></div>`;
            const [dist,p,h] = value.split('/').map(s=>s.trim());
            return `<details class="active-day"><summary aria-label="${day} ${escape(value)}"><span>${day}</span><span class="day-marker"></span><span class="day-distance">${escape(dist.replace(/km/i,''))}</span></summary><dl class="day-details">${metric('距離',distance(dist))}${metric('配速',p+' /km')}${metric('心率',h+' bpm')}</dl></details>`;
        }).join('')}</div></article>`;
    }).join(''));
}
export function runCards(runs) {
    mount('recent-runs-table',runs.map(r=>`<details class="record-card"><summary><div class="record-heading"><span>${escape(r.date)}</span><strong>${escape(distance(r.distance))}</strong></div><div class="record-meta">${escape(r.pace)} /km <span>·</span> ${escape(r.duration)}</div><span class="expand-hint">詳細數據</span></summary><dl class="record-metrics">${metric('起跑時間',r.time)}${metric('平均心率',r.heartRate)}${metric('平均步頻',r.cadence)}${metric('VDOT',r.vdot)}</dl></details>`).join(''));
}
export function raceCards(races) {
    mount('achievements-table',races.map(r=>`<details class="record-card race-card"><summary><div class="record-meta">${escape(r.date)} <span>·</span> #${escape(r.no)}</div><h3>${escape(r.race)}</h3><div class="record-heading"><strong>${escape(distance(r.distance))}</strong><span>${escape(r.duration)}</span></div><span class="expand-hint">成績與分段</span></summary><dl class="record-metrics">${metric('平均配速',r.avgPace)}${metric('平均心率',r.avgHeartRate)}${metric('平均步頻',r.avgCadence)}</dl>${r.splits?.length ? `<div class="mobile-splits">${r.splits.map(s=>`<div><strong>${escape(s.km)} km</strong><dl class="record-metrics">${metric('配速',s.pace)}${metric('時間',s.time)}${metric('心率',s.heartRate)}${metric('步頻',s.cadence)}</dl></div>`).join('')}</div>` : '<p class="record-meta">尚無分段資料</p>'}</details>`).join(''));
}
