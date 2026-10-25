// FC 27 TCG 일반 선수 카드 만들기
// 사용 예:
//   import { renderCard } from './card.js';
//   document.querySelector('#hand').append(renderCard(player));
// card.css를 페이지에 함께 넣어야 합니다.

import { PHOTO_URL } from './loadPlayers.js';

// 포지션 그룹별 카드 색 [바탕, 강조]
export const GROUP_COLORS = {
  GK: ['#1f1a0b', '#e8b923'],
  DF: ['#0d1a2c', '#5b97ea'],
  MF: ['#0d2118', '#3fc283'],
  FW: ['#2a0e12', '#f0554d'],
};

// 국가 색 (국기 줄무늬 느낌, 3색). 목록에 없는 나라는 이름으로 색을 자동 생성.
export const NATION_COLORS = {
  '잉글랜드': ['#ffffff', '#cf142b', '#ffffff'], '독일': ['#1a1a1a', '#dd0000', '#ffce00'],
  '아르헨티나': ['#74acdf', '#ffffff', '#74acdf'], '스페인': ['#aa151b', '#f1bf00', '#aa151b'],
  '프랑스': ['#0055a4', '#ffffff', '#ef4135'], '이탈리아': ['#009246', '#ffffff', '#ce2b37'],
  '네덜란드': ['#ae1c28', '#ffffff', '#21468b'], '브라질': ['#009c3b', '#ffdf00', '#002776'],
  '미국': ['#b22234', '#ffffff', '#3c3b6e'], '노르웨이': ['#ba0c2f', '#ffffff', '#00205b'],
  '스웨덴': ['#006aa7', '#fecc00', '#006aa7'], '덴마크': ['#c8102e', '#ffffff', '#c8102e'],
  '대한민국': ['#ffffff', '#cd2e3a', '#0047a0'], '아일랜드': ['#169b62', '#ffffff', '#ff883e'],
  '사우디아라비아': ['#006c35', '#ffffff', '#006c35'], '벨기에': ['#1a1a1a', '#fdda24', '#ef3340'],
  '포르투갈': ['#006600', '#ff0000', '#ff0000'], '폴란드': ['#ffffff', '#dc143c', '#dc143c'],
  '중국': ['#de2910', '#ffde00', '#de2910'], '멕시코': ['#006847', '#ffffff', '#ce1126'],
  '콜롬비아': ['#fcd116', '#003893', '#ce1126'], '루마니아': ['#002b7f', '#fcd116', '#ce1126'],
  '오스트리아': ['#ed2939', '#ffffff', '#ed2939'], '터키': ['#e30a17', '#ffffff', '#e30a17'],
  '호주': ['#00008b', '#ffffff', '#ff0000'], '스코틀랜드': ['#005eb8', '#ffffff', '#005eb8'],
  '스위스': ['#da291c', '#ffffff', '#da291c'], '우루과이': ['#ffffff', '#0038a8', '#ffffff'],
  '인도': ['#ff9933', '#ffffff', '#138808'], '파라과이': ['#d52b1e', '#ffffff', '#0038a8'],
  '세네갈': ['#00853f', '#fdef42', '#e31b23'], '모로코': ['#c1272d', '#006233', '#c1272d'],
  '크로아티아': ['#ff0000', '#ffffff', '#171796'], '칠레': ['#ffffff', '#d52b1e', '#0039a6'],
  '나이지리아': ['#008751', '#ffffff', '#008751'], '웨일스': ['#ffffff', '#00b140', '#d30731'],
  '에콰도르': ['#ffdd00', '#034ea2', '#ed1c24'], '코트디부아르': ['#f77f00', '#ffffff', '#009e60'],
  '가나': ['#ce1126', '#fcd116', '#006b3f'], '베네수엘라': ['#ffcc00', '#00247d', '#cf142b'],
  '세르비아': ['#c6363c', '#0c4076', '#ffffff'], '일본': ['#ffffff', '#bc002d', '#ffffff'],
  '그리스': ['#0d5eaf', '#ffffff', '#0d5eaf'], '캐나다': ['#ff0000', '#ffffff', '#ff0000'],
  '체코': ['#ffffff', '#d7141a', '#11457e'], '우크라이나': ['#0057b7', '#ffd700', '#ffd700'],
  '페루': ['#d91023', '#ffffff', '#d91023'], '북아일랜드': ['#ffffff', '#c8102e', '#ffffff'],
  '카메룬': ['#007a5e', '#ce1126', '#fcd116'], '말리': ['#14b53a', '#fcd116', '#ce1126'],
  '핀란드': ['#ffffff', '#002f6c', '#ffffff'], '헝가리': ['#ce2939', '#ffffff', '#477050'],
  '알제리': ['#006233', '#ffffff', '#d21034'], '볼리비아': ['#d52b1e', '#f9e300', '#007934'],
  '알바니아': ['#e41e20', '#1a1a1a', '#e41e20'], '뉴질랜드': ['#00247d', '#ffffff', '#cc142b'],
  '아이슬란드': ['#02529c', '#ffffff', '#dc1e35'], '조지아': ['#ffffff', '#ff0000', '#ffffff'],
  '이집트': ['#ce1126', '#ffffff', '#1a1a1a'], '러시아': ['#ffffff', '#0039a6', '#d52b1e'],
  '슬로베니아': ['#ffffff', '#005da4', '#ed1c24'], '슬로바키아': ['#ffffff', '#0b4ea2', '#ee1c25'],
};

function nationColors(nation) {
  if (NATION_COLORS[nation]) return NATION_COLORS[nation];
  let h = 0;
  for (const ch of nation) h = (h * 31 + ch.codePointAt(0)) % 360;
  return [`hsl(${h} 55% 45%)`, `hsl(${(h + 40) % 360} 35% 80%)`, `hsl(${h} 55% 45%)`];
}

// 사진이 없는 선수용 기본 이미지 (상반신 실루엣, 포지션 색)
export function fallbackArt(player) {
  const accent = (GROUP_COLORS[player.group] || GROUP_COLORS.MF)[1];
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
<defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
<stop offset="0" stop-color="#ffffff" stop-opacity=".92"/><stop offset="1" stop-color="#ffffff" stop-opacity=".45"/></linearGradient></defs>
<circle cx="256" cy="188" r="82" fill="url(#g)"/>
<path d="M78 512c0-128 78-214 178-214s178 86 178 214z" fill="url(#g)"/>
<path d="M214 300l42 58 42-58" fill="none" stroke="${accent}" stroke-width="14" stroke-linejoin="round"/>
</svg>`;
  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
}

const STAT_LABELS = [['pac', '속도'], ['sho', '슛'], ['pas', '패스'], ['dri', '드리블'], ['def', '수비'], ['phy', '피지컬']];
const GK_LABELS = [['div', '다이빙'], ['han', '핸들링'], ['kic', '킥'], ['ref', '반응'], ['pos', '위치선정']];

const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

// 카드 요소 만들기. options.total = 전체 카드 수 (카드 번호 표시용)
export function renderCard(player, options = {}) {
  const total = options.total ?? 17849;
  const [base, accent] = GROUP_COLORS[player.group] || GROUP_COLORS.MF;
  const [na, nb, nc] = nationColors(player.nation);

  const stats = player.group === 'GK' && player.gk
    ? [...GK_LABELS.map(([k, l]) => [l, player.gk[k]]), ['속도', player.stats.pac]]
    : STAT_LABELS.map(([k, l]) => [l, player.stats[k]]);

  const el = document.createElement('article');
  el.className = 'fc-card';
  el.dataset.id = player.id;
  el.style.cssText = `--base:${base};--accent:${accent};--nat-a:${na};--nat-b:${nb};--nat-c:${nc}`;
  el.innerHTML = `
    <div class="fc-card__photo">
      <div class="fc-card__ovr"><b>${player.ovr}</b><span>${esc(player.pos)}</span>
        ${player.altPos.length ? `<em class="fc-card__alt">${esc(player.altPos.slice(0, 2).join(' · '))}</em>` : ''}</div>
      <div class="fc-card__nation"><div class="fc-card__flag"></div><small>${esc(player.nation)}</small></div>
      <img alt="">
    </div>
    <div class="fc-card__name"><h3 style="font-size:min(10.5cqw, ${(150 / Math.max(player.name.length, 1)).toFixed(2)}cqw)">${esc(player.name)}</h3><p>${esc(player.team)}</p></div>
    <ul class="fc-card__stats">${stats.map(([l, v]) =>
      `<li><div class="v"><b>${v}</b><span>${l}</span></div><i style="--w:${Math.min(v, 99)}%"></i></li>`).join('')}</ul>
    <div class="fc-card__foot">
      ${player.playStylePlus[0] ? `<span class="ps">${esc(player.playStylePlus[0])}</span>` : '<span></span>'}
      <span class="no">No.${String(player.rank).padStart(5, '0')} / ${total.toLocaleString()}</span>
    </div>`;

  const img = el.querySelector('img');
  img.alt = player.name;
  img.loading = 'lazy';
  img.decoding = 'async';
  img.onerror = () => {
    img.onerror = null;
    img.classList.add('is-fallback');
    img.src = fallbackArt(player);
  };
  img.src = options.noPhoto ? fallbackArt(player) : PHOTO_URL(player.id);
  if (options.noPhoto) img.classList.add('is-fallback');
  return el;
}
