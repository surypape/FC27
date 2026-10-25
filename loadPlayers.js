// FC 27 TCG 선수 데이터 로더
// index.json을 읽고 나눠진 선수 파일을 한 번에 불러와 합칩니다.
// 깃허브 페이지처럼 웹 서버로 열어야 동작합니다 (파일을 더블클릭해서 열면 fetch가 막힘).

export async function loadAllPlayers(base = '.') {
  const index = await fetch(`${base}/index.json`).then(r => r.json());
  const chunks = await Promise.all(
    index.files.map(f => fetch(`${base}/${f.file}`).then(r => r.json()))
  );
  return chunks.flat(); // 17,849명, OVR 높은 순
}

// 필요한 파일만 불러오기 (예: 상위 1,000명만 = loadChunk(1))
export async function loadChunk(n, base = '.') {
  const file = `players_${String(n).padStart(2, '0')}.json`;
  return fetch(`${base}/${file}`).then(r => r.json());
}

// 챔피언 후보 ID 목록
export async function loadChampionCandidates(base = '.') {
  const c = await fetch(`${base}/champion_candidates.json`).then(r => r.json());
  return new Set(c.ids);
}

// 선수 사진 (EA 서버에서 바로 불러옴, 파일은 저장소에 없음)
export const PHOTO_URL = id =>
  `https://ratings-images-prod.pulse.ea.com/FC25/full/player-portraits/p${id}.png?padding=0.7`;

// 사진을 <img>에 넣고, 사진이 없는 선수면 fallback 이미지로 바꿈
export function setPlayerPhoto(img, player, fallback) {
  img.alt = player.name;
  img.loading = 'lazy'; // 화면에 보일 때만 불러옴
  img.onerror = () => {
    img.onerror = null;
    if (fallback) img.src = fallback;
    else img.style.visibility = 'hidden';
  };
  img.src = PHOTO_URL(player.id);
}

// 사용 예:
// import { loadAllPlayers } from './loadPlayers.js';
// const players = await loadAllPlayers();
// const argentina = players.filter(p => p.nation === '아르헨티나');
// const byId = new Map(players.map(p => [p.id, p]));
