// 공개 시연용 후처리: 앱 소스는 건드리지 않고, 빌드된 index.html에만
// (1) 검색 제외 표시 (2) 음성 조작부 숨김 (3) 안내 띠를 덧붙인다.
// 사용: node make-public-demo.mjs <dist 폴더>
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const dist = process.argv[2];
if (!dist) { console.error('dist 폴더 경로가 필요합니다.'); process.exit(1); }
const file = join(dist, 'index.html');
let html = readFileSync(file, 'utf8');
if (html.includes('data-public-demo')) { console.log('이미 처리됨'); process.exit(0); }

const head = `<meta name="robots" content="noindex,nofollow"><style data-public-demo>
.voice-panel .consent,.voice-panel .actions,.voice-panel .voice-stage,#audio-sample{display:none!important}
.public-demo-bar{margin:0;padding:10px 16px;background:#1f4d3f;color:#fff;font:600 14px/1.5 system-ui,sans-serif;text-align:center}
@media print{.public-demo-bar{display:none}}
</style>`;
const bar = `<p class="public-demo-bar" role="note">공개 시연 · 글자 입력만 됩니다. 음성 기록은 개발 PC에 연결한 시연에서 동작합니다.</p>`;

if (!html.includes('</head>') || !html.includes('<div id="app">')) { console.error('index.html 구조가 예상과 다릅니다.'); process.exit(1); }
html = html.replace('</head>', `${head}</head>`).replace('<div id="app">', `${bar}<div id="app">`);
writeFileSync(file, html);
console.log('공개 시연용 index.html 처리 완료');
