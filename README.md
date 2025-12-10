# aladin-assignment

GitHub 사용자 검색 API를 활용하여

- 기본 검색 + 상세(고급) 검색 필터
- 정렬 조건 및 페이지 개수 변경
- 무한 스크롤(Infinite Scroll)
- GitHub 레이트 리밋(rate limit) 시 대기 후 재시도
- 반응형(Responsive) 사용자 카드 그리드
- SSR 초기 상태 + CSR 검색 흐름 분리

를 구현한 Next.js 기반 웹 애플리케이션입니다.

---

## 1. 실행 및 테스트 방법

### 1-1. 환경 요구사항

- Node.js **v18 이상** 권장
- npm (또는 pnpm / yarn, 예시는 npm 기준)

### 1-2. 의존성 설치

```bash
npm install
```

### 1-3. 개발 서버 실행 (로컬 개발)

```bash
npm run dev
```

- 기본 접속 주소: http://localhost:3000

### 1-4. 프로덕션 빌드 및 실행

```bash
# 프로덕션 빌드
npm run build

# 빌드 결과 실행
npm start
```

### 1-5. 단위 / 통합 테스트 (Jest + React Testing Library)

```bash
npm test
```

사용 라이브러리:

- `jest`, `jest-environment-jsdom`
- `@testing-library/react`, `@testing-library/jest-dom`, `@testing-library/user-event`

테스트 범위 개요:

- 검색 쿼리 / 정렬 / 필터 로직 검증 (`SearchInput`)
- 페이지 개수/정렬 변경 및 상단 정보 표시 (`InfoBar`)
- 사용자 리스트 / 상세 정보 렌더링 (`UserListInfo`, `UserDetailInfo`)
- Canvas 기반 GitHub 사용자 카드 아바타 렌더링 (`GithubUserCard`)
- Web Worker 기반 카운트다운 스피너 동작 (`CountdownSpinner`)

### 1-6. E2E 테스트 (Cypress)

#### Headless 모드 전체 실행

```bash
npm run test:e2e
```

- `start-server-and-test`를 사용하여
  - `npm run dev`로 개발 서버를 기동한 뒤
  - `http://localhost:3000` 응답을 확인하면
  - `npm run cy:run`으로 Cypress E2E 테스트를 headless 모드로 실행합니다.

#### Cypress GUI 실행

```bash
# 1) 개발 서버 실행
npm run dev

# 2) 다른 터미널에서 Cypress GUI 실행
npm run cy:open
```

- Cypress 앱에서 개별 스펙 파일(`*.cy.ts`)을 선택해 실행/디버깅할 수 있습니다.

### 1-7. (선택) GitHub API 토큰 사용

기본적으로는 **비인증 상태**로 GitHub Search API를 호출하며, 퍼블릭 레이트 리밋에 도달하면 대기 후 재시도하는 로직이 동작합니다.

레이트 리밋을 여유 있게 사용하고 싶다면:

1. 프로젝트 루트에 `.env.local` 파일 생성 후 Personal Access Token 설정

```bash
GITHUB_TOKEN=your_token_here
```

2. 서버 라우트(fetch 호출부)에서 다음 주석을 해제하여 사용합니다.

```ts
// Authorization: `Bearer ${process.env.GITHUB_TOKEN}`
```

---

## 2. 구현 스펙 명세

### 2-1. 기술 스택

- Next.js 16 (App Router)
- React 19
- TypeScript
- MUI v7
- Tailwind CSS v4
- Zustand
- Jest + React Testing Library
- Cypress

### 2-2. 전역 레이아웃 / 인프라

- `app/layout.tsx`
  - `ThemeProvider`로 다크/라이트 모드 전역 제공.
  - 전역 UI 오버레이
    - `WarningOverlay` : 경고/에러 메시지
    - `SpinnerOverlay` : 전역 로딩 스피너
- `globals.css`
  - Tailwind 초기 설정 및 공통 스타일 정의.

### 2-3. 메인 페이지 (`app/page.tsx`)

- 상단 헤더
  - 좌측: 로고 (`/icons/logo.svg`) 클릭 시 `location.reload()`로 상태 초기화.
  - 중앙: `SearchInput` (기본 검색 + 상세 검색 토글).
  - 우측: 다크/라이트 테마 토글 (`Sun`/`Moon` + MUI `Switch`).
- 검색 정보 바 (`InfoBar`)
  - 페이지당 개수(perPage) 선택: 10 / 20 / 30.
  - 정렬 조건(sortKey) 선택: 기본 / followers / repositories / joined.
  - GitHub Search API 메타 정보 표시:
    - `데이터 건수: totalCount`
    - `쿼터(Total / Remain): limit / remaining`
- 컨텐츠 영역
  - 리스트 모드
    - 검색 결과를 그리드 형태로 렌더링.
    - Tailwind로 반응형 설정:
      - `grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4`
    - 각 카드 클릭 시 상세 모드로 전환.
    - 스크롤 컨테이너 하단에 sentinel div (`scrollingRef`)를 두고 `IntersectionObserver`로 감지하여 **무한 스크롤** 구현.
    - 검색 결과가 없으면 `SearchX` 아이콘과 `"조회된 결과가 없습니다."` 문구 표시.
  - 상세 모드
    - 선택된 사용자 정보를 `detailUserInfo`로 관리.
    - `GithubUserCard` + `UserDetailInfo`로 상세 정보 표시.
    - “뒤로 가기” 버튼 클릭 시 리스트 모드로 복귀.
    - 리스트에서의 스크롤 위치를 기억해, 상세에서 돌아올 때 기존 위치로 복원.

### 2-4. 검색 / 정렬 / 페이징 / 레이트 리밋

#### 검색 쿼리 생성 (`SearchInput.tsx`)

다음 값들을 조합해 GitHub Search API 의 `q` 파라미터를 구성합니다.

- 기본 검색어: 계정 이름, 성명 또는 메일
- 타입: `type:user` / `type:org`
- 리포지토리 수: `repos:min..max`, `repos:>=min`, `repos:<=max`
- 위치: `location:{값}`
- 언어: `language:{값}`
- 생성일: `created:from..to`, `created:>=from`, `created:<=to`
- 팔로워 수: `followers:min..max`, `followers:>=min`, `followers:<=max`
- 후원 가능 여부: `sponsorable:true`

검색어가 비어 있으면 `검색어가 없습니다.` 메시지를 보여주고 검색을 수행하지 않습니다.  
숫자/날짜 범위가 잘못된 경우 helperText로 에러 메시지를 표시합니다.

#### 검색 / 페이징 / 정렬 (`page.tsx`)

- 상태
  - `userList`, `totalCount`, `limit`, `remaining`
  - `page`, `perPage`, `sortKey`
  - `hasNext`, `isLoading`
  - `isRetryData`, `isRetrySecond`
- 흐름
  1. `SearchInput`에서 `searchFunc(q)` 호출 시 기존 결과와 카운트 초기화, `page`를 1로 세팅.
  2. `page` 변경 시 `/api/search-users?page={page}&perPage={perPage}&q={q}&sort={sortKey}&order=desc` 요청.
  3. 응답에 `error: 'rate_limit'`가 포함되면
     - `isRetryData = true`, `isRetrySecond = wait` 로 설정 후
     - 카운트다운 오버레이를 통해 일정 시간 후 동일 요청을 재실행.

#### 레이트 리밋 대기 / 재시도 (`CountdownSpinner.tsx`)

- inline Web Worker를 생성하여 1초마다 남은 시간을 줄여가며 메인 스레드에 전달. (다른 탭을 열었을때 정상적으로 interval이 동작하기 위함.)
- `{remainSeconds}초 후 다시 시도합니다...` 문구와 함께 MUI `CircularProgress`를 가운데에 띄움.
- 남은 시간이 0이 되면 Worker를 종료하고 콜백 함수(`callbackFunc`)를 호출하여 API 재요청.

### 2-5. 사용자 카드 및 상세 정보

- `GithubUserCard`
  - Canvas(`<canvas>`)로 동그란 아바타 이미지를 렌더링.
  - `squoosh_resize`를 통해 WASM 기반 이미지 리사이즈 수행.
  - `user`와 `Component` (`UserListInfo` 또는 `UserDetailInfo`)를 받아 카드 레이아웃 구성.
- `UserListInfo`
  - 검색 리스트용 요약 정보 카드.
  - `id`, `login`, `type`, `score`를 MUI `Typography`로 표시.
- `UserDetailInfo`
  - 상세 보기용 카드.
  - 마운트 시 `/api/detail-user?login={login}` 호출.
  - `openSpinner`, `closeSpinner`, `openWarning`을 사용해 로딩/에러 처리.
  - `login`, `id`, `name`, `user_view_type`, `followers`, `following`, `public_repos`, `public_gists`, `created_at`, `updated_at`, `url` 필드 표시.

### 2-6. SSR / CSR 경계

- 최초 접속(SSR 렌더) 시:
  - 검색 요청 없이 `"조회된 결과가 없습니다."` 문구만 표시되고 사용자 카드는 없음.
- CSR 상호작용(검색어 입력 + Enter) 이후에만:
  - `/api/search-users` 요청 발생
  - 사용자 카드 렌더링
  - 기존 빈 상태 문구 제거

---

## 3. MUI 와 Tailwind CSS 같이 사용할 때 주의할 점

이 프로젝트에서는 다음 원칙으로 MUI와 Tailwind를 함께 사용했습니다.

1. **역할 분리**
   - 레이아웃 / 그리드 / 간격 / 반응형: Tailwind
   - 컴포넌트 스타일 / 색상 / 타이포그래피: MUI (Theme + `sx`)
2. **반응형 기준 혼동 방지**
   - 반응형 컬럼 수는 Tailwind (`grid-cols-1 md:grid-cols-2 ...`)만 사용하고,  
     MUI `theme.breakpoints`와 섞어 사용하지 않도록 설계했습니다.
3. **테마 일관성**
   - 다크/라이트 모드는 MUI `ThemeProvider` 기준으로 구현하고,  
     텍스트/배경 색상은 MUI 팔레트(`color="text.secondary"` 등)를 우선 사용했습니다.
4. **전역 스타일 관리**
   - `globals.css` 에 Tailwind 설정 및 기본 스타일을 두고,  
     필요 시 MUI `GlobalStyles` 로 body/스크롤바 등만 보완했습니다.

---

## 4. 테스트 코드 구성 요약

과제 요구사항:

- 검색 쿼리, 정렬, 페이징 로직
- 데이터 매핑, 표시 안전성
- SSR, CSR 경계 로직
- (옵션) 추가 테스트

을 다음과 같이 커버합니다.

- Jest 단위/통합 테스트
  - `UserListInfo.test.tsx` : 리스트 카드 데이터 매핑/표시 검증
  - `UserDetailInfo.test.tsx` : 상세 데이터/기본 데이터 렌더링 검증
  - `SearchInput.test.tsx` : 검색 쿼리 생성 및 상세 검색 토글 동작 검증
  - `InfoBar.test.tsx` : 개수/정렬 변경 및 표시 값 검증
  - `GithubUserCard.test.tsx` : Canvas 아바타 및 자식 컴포넌트 렌더링 검증
  - `CountdownSpinner.test.tsx` : 카운트다운 및 콜백 호출 검증
- Cypress E2E 테스트
  - `detail.cy.ts` : 검색 → 카드 클릭 → 상세 정보 표시 플로우 검증
  - `infinite.cy.ts` : 무한 스크롤, 레이트 리밋 시 대기 후 재요청, 총 카드 개수 검증
  - `logic.cy.ts` : 상세 검색 전체 조건 + 개수/정렬이 URL 쿼리스트링과 일치하는지 검증
  - `responsive-web.cy.ts` : viewport 별 1/2/3/4 컬럼 반응형 동작 검증
  - `ssr-csr.cy.ts` : SSR 초기 빈 상태와 CSR 검색 이후 결과 렌더링 경계 검증

---

## 5. 사용한 프롬프트

이 과제 구현 및 README 작성에 사용한 ChatGPT 프롬프트는  
`prompts/used_prompts.md` 파일에 정리했습니다.