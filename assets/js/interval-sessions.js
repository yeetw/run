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
// October 1 screenshots: work laps 9, 11, 13, 15; warm-up and cooldown excluded.
// Prescribed workout: 7 min run / 2 min rest. Heart rates from the BPM screenshot.
const october1Reps = [
 ['8:54','7:13',155,163,'2:06'],
 ['8:58','6:57',156,161,'2:02'],
 ['8:46','6:41',161,163,'2:21'],
 ['8:42','7:02',162,164,'1:46']
];
// November 5 screenshots: 1km work laps 3, 5, 7; warm-up and cooldown excluded.
const november5Reps = [
 ['8:48','8:53',153,164,'2:08'],
 ['8:53','8:53',157,162,'2:02'],
 ['8:47','8:51',158,162,'3:43']
];
export const sessions = [
 {date:'2026-11-05', interval:1000, reps:november5Reps, estimated:false, rest:'2', restUnit:'min', note:'課表：跑 1 公里、休 2 分鐘。採用原紀錄第 3、5、7 圈（實測 1.01、1.00、1.01 km）。最後一組後休息 3:43，之後收操；不計入組間休息。'},
 {date:'2026-11-03', reps:novemberReps, estimated:false, rest:'1', restUnit:'min'},
 {date:'2026-10-31', reps:octoberLaps.map(([time,km,hr,cadence,rest], i) => [octoberPaces[i],time,hr,cadence,rest]), estimated:false, rest:clock(Math.round(octoberLaps.filter(r=>r[4]).reduce((sum,r)=>sum+seconds(r[4]),0)/9)), restUnit:'平均'},
 {date:'2026-10-29', interval:600, reps:october29Reps, estimated:false, rest:'2:08', restUnit:'平均'},
 {date:'2026-10-15', reps:october15Reps, estimated:false, rest:clock(Math.round(october15Reps.filter(r=>r[4]).reduce((sum,r)=>sum+seconds(r[4]),0)/8)), restUnit:'平均'},
 {date:'2026-10-01', interval:'7min', label:'7 分鐘', repDistances:[0.81,0.77,0.76,0.81], reps:october1Reps, estimated:false, rest:'2', restUnit:'min'}
];
