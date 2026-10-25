# FC 27 TCG 선수 데이터

축구선수 TCG에서 쓰는 선수 데이터입니다.

- **출처**: EA SPORTS FC 27 공식 선수 등급 DB (ea.com/games/ea-sports-fc/ratings), 남자 축구
- **조회일**: 2026-10-25 (EA가 시즌 중 등급을 바꿔도 이 데이터는 이 날짜 기준으로 고정)
- **인원**: 남자 선수 17,849명 전원 = 일반 카드 풀
- **챔피언 후보**: OVR 76 이상 1,502명 (상위 1500위, 76 동점자 전원 포함)

## 파일 구성

모든 파일이 한 폴더(저장소 맨 바깥)에 있습니다. 폴더를 만들 필요 없이 전부 한 번에 올리면 됩니다.

```
index.json                 파일 목록, 인원수, 필드 설명
champion_candidates.json   챔피언 후보 EA ID 1,502개
players_01.json ~ players_18.json   선수 데이터 (OVR 높은 순, 1,000명씩)
loadPlayers.js             불러오기 함수
card.js / card.css         카드 그리기 (renderCard)
demo.html                  검색해서 카드 보는 미리보기 페이지
```

## 선수 한 명의 데이터

```json
{
  "id": 231747, "rank": 1, "name": "Kylian Mbappé", "ovr": 91,
  "pos": "ST", "group": "FW", "altPos": ["LW"],
  "nation": "프랑스", "team": "Real Madrid", "league": "LALIGA EA SPORTS",
  "birth": "1998-12-20", "foot": "R", "skill": 5, "weakFoot": 4,
  "stats": { "pac": 96, "sho": 91, "pas": 80, "dri": 92, "def": 29, "phy": 76 },
  "playStylePlus": ["퀵 스텝+"], "playStyle": ["감아차기", "아크로바틱", "낮은 드리븐 슛"],
  "championEligible": true
}
```

- `id`는 EA 선수 ID라 고유합니다. 카드나 덱을 저장할 때 이 값을 쓰면 됩니다.
- `gk`(다이빙·핸들링·킥·반응·위치선정)는 골키퍼에게만 있습니다.
- `pos`의 `CAM`은 공격형 미드필더입니다.
- 일부 구단은 게임 속 라이선스 이름으로 나옵니다 (예: Lombardia FC = 인테르, Milano FC = AC 밀란).

## 선수 사진

사진 파일은 저장소에 넣지 않고, EA 서버의 사진 주소를 게임에서 바로 불러옵니다.

```
https://ratings-images-prod.pulse.ea.com/FC25/full/player-portraits/p{id}.png?padding=0.7
```

- 모든 선수가 이 주소 규칙을 따릅니다 (`{id}` 자리에 선수 `id`). 주소 안의 `FC25`는 오타가 아니라 EA가 실제로 쓰는 경로입니다.
- **사진이 없는 선수가 많습니다.** 표본 409명을 확인해보니 약 55%만 사진이 떴고, 주로 덜 알려진 선수들이 비어 있습니다. 스타 선수들은 대부분 있습니다.
- 그래서 사진이 안 뜨면 자동으로 기본 이미지로 바꾸는 `setPlayerPhoto()`를 `loadPlayers.js`에 넣어뒀습니다.
- EA가 주소를 바꾸면 사진이 한꺼번에 안 뜰 수 있습니다. 그때는 `PHOTO_URL`만 고치면 됩니다.

```js
import { setPlayerPhoto } from './loadPlayers.js';
const img = document.createElement('img');
setPlayerPhoto(img, player, 'img/no-photo.png'); // 세 번째 값 = 사진 없을 때 쓸 이미지
```

## 카드 그리기

```html
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600;700;800&family=IBM+Plex+Sans+KR:wght@400;600&display=swap">
<link rel="stylesheet" href="card.css">
<script type="module">
  import { loadAllPlayers } from './loadPlayers.js';
  import { renderCard } from './card.js';
  const players = await loadAllPlayers();
  document.body.append(renderCard(players[0]));
</script>
```

- 카드 색은 포지션 그룹(GK 노랑, DF 파랑, MF 초록, FW 빨강), 사진 뒤 줄무늬는 국적 색입니다.
- 국가 색은 `card.js`의 `NATION_COLORS`에 약 60개국이 들어 있고, 없는 나라는 이름으로 색을 자동으로 만듭니다.
- EA 사진이 없는 선수는 상반신 실루엣 기본 이미지(`fallbackArt`)로 자동으로 바뀝니다.
- 카드 크기는 감싸는 칸의 너비를 따라갑니다 (비율 5:7).
- `demo.html`을 깃허브 페이지에서 열면 17,849장을 검색해서 볼 수 있습니다.
