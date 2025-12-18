# Pickle Admin - 온보딩 가이드

## 목차
- [프로젝트 개요](#프로젝트-개요)
- [기술 스택](#기술-스택)
- [프로젝트 구조](#프로젝트-구조)
- [핵심 기능](#핵심-기능)
- [데이터 흐름](#데이터-흐름)
- [인증 시스템](#인증-시스템)
- [API 통합](#api-통합)
- [Excel 연동](#excel-연동)
- [상태 관리](#상태-관리)
- [주요 유틸리티 함수](#주요-유틸리티-함수)
- [타입 정의](#타입-정의)
- [개발 환경 설정](#개발-환경-설정)
- [배포 및 빌드](#배포-및-빌드)
- [트러블슈팅](#트러블슈팅)

---

## 프로젝트 개요

**Pickle Admin**은 팟캐스트/오디오 콘텐츠 플랫폼(Pickle)의 관리자용 웹 애플리케이션입니다. Pickle 백엔드 API와 Google Sheets API를 연동하여 에피소드, 채널, 큐레이션 데이터를 조회하고 관리하는 시스템입니다.

### 주요 목적
- Pickle API에서 최신 콘텐츠 데이터 조회
- Google Sheets에 데이터 동기화 및 관리
- 중복 데이터 탐지 및 로그 관리
- 대규모 데이터셋(300,000~행) 효율적 처리

---

## 기술 스택

### 프론트엔드
- **React 19.1.1** - 최신 React concurrent 기능 활용
- **TypeScript 5.9.3** - 타입 안정성 보장
- **React Router 7.9.4** - 클라이언트 사이드 라우팅
- **Tailwind CSS 4.1.14** - 유틸리티 기반 스타일링

### 상태 관리 및 API
- **Zustand 5.0.8** - 경량 상태 관리 라이브러리
- **Axios 1.12.2** - HTTP 클라이언트 (인터셉터 포함)
- **googleapis** - Google Sheets API 클라이언트

### UI/UX
- **React Toastify 11.0.5** - 토스트 알림
- **@tanstack/react-virtual** - 대규모 리스트 가상 스크롤링

### 빌드 도구
- **Vite 7.1.7** - 빠른 빌드 및 개발 서버
- **ESLint + Prettier** - 코드 품질 관리
- **PostCSS** - CSS 후처리

---

## 프로젝트 구조

```
pickle-admin/
├── src/
│   ├── api/
│   │   └── apis.ts                    # Google Sheets API 엔드포인트 설정
│   │
│   ├── components/
│   │   ├── Button.tsx                 # 공통 버튼 컴포넌트
│   │   └── LoadingOverlay.tsx         # 로딩 오버레이
│   │
│   ├── feature/                       # 기능별 모듈
│   │   ├── episode/                   # 에피소드 관리
│   │   │   ├── EpisodeLayout.tsx      # 메인 레이아웃
│   │   │   └── EpisodeList.tsx        # 목록 UI
│   │   │
│   │   ├── channel-book/              # 채널/도서 관리
│   │   │   ├── ChannelLayout.tsx
│   │   │   └── ChannelList.tsx
│   │   │
│   │   ├── curation/                  # 큐레이션 관리
│   │   │   ├── CurationLayout.tsx
│   │   │   └── CurationList.tsx
│   │   │
│   │   └── login/
│   │       └── Login.tsx              # 관리자 로그인 페이지
│   │
│   ├── layout/
│   │   ├── Header.tsx                 # 상단 헤더 (로그인 버튼 포함)
│   │   ├── Layout.tsx                 # 메인 레이아웃 컨테이너
│   │   ├── Sidebar.tsx                # 사이드바 네비게이션
│   │   └── components/
│   │       └── MenuButton.tsx         # 메뉴 버튼 컴포넌트
│   │
│   ├── store/                         # Zustand 상태 관리
│   │   ├── useAccessTokenStore.ts     # Pickle API 토큰
│   │   └── useLoginTokenStore.ts      # Google Sheets 토큰
│   │
│   ├── utils/                         # 핵심 유틸리티
│   │   ├── api.ts                     # Axios 인스턴스 설정
│   │   ├── auth.ts                    # Google OAuth 인증
│   │   ├── updateExcel.ts             # Excel 읽기/쓰기 핵심 로직
│   │   ├── syncNewEpisodesToExcel.ts  # 에피소드 동기화
│   │   ├── syncNewCurationToExcel.ts  # 큐레이션 동기화
│   │   ├── updateLogs.ts              # 로그 관리 및 중복 탐지
│   │   ├── getNewData.ts              # 새 데이터 조회
│   │   ├── getNewCuration.ts          # 새 큐레이션 조회
│   │   ├── fetchAllData.ts            # 전체 데이터 조회
│   │   ├── getSheetList.ts            # 시트 목록 조회
│   │   └── formatDateString.ts        # 날짜 포맷팅
│   │
│   ├── type.ts                        # TypeScript 타입 정의
│   ├── App.tsx                        # 라우팅 설정
│   └── main.tsx                       # 애플리케이션 진입점
│
├── public/                            # 정적 파일
├── dist/                              # 빌드 결과물
├── .env                               # 환경 변수 (Git 미포함)
├── tailwind.config.js                 # Tailwind 설정
├── vite.config.ts                     # Vite 빌드 설정
└── package.json                       # 프로젝트 의존성
```

---

## 핵심 기능

### 1. 에피소드 관리 (Episode Management)

**위치**: [src/feature/episode/EpisodeLayout.tsx](src/feature/episode/EpisodeLayout.tsx)

#### 주요 기능
- **새로운 에피소드 검색**: API에서 최신 에피소드를 조회하고 Excel 데이터와 비교
- **중복 탐지**: 동일한 제목의 에피소드를 자동으로 식별
- **Excel 동기화**: 새로운 에피소드를 Google Sheets에 추가
- **전체 변환**: 모든 에피소드를 Excel 형식으로 내보내기
- **로그 관리**: 중복 에피소드를 별도 시트(Episode_Logs)에 기록

#### 데이터 항목
- 에피소드 ID, 사용 여부, 채널명, 에피소드명
- 표시 날짜/시간, 생성일
- 좋아요 수, 청취 수, 재생 시간
- 썸네일 URL, 오디오 URL, 채널 ID

### 2. 채널/도서 관리 (Channel/Book Management)

**위치**: [src/feature/channel-book/ChannelLayout.tsx](src/feature/channel-book/ChannelLayout.tsx)

#### 주요 기능
- **채널 정보 조회**: 모든 채널 목록 및 메타데이터 확인
- **최신 에피소드 업로드일 추적**: 각 채널의 최근 에피소드 업로드 날짜 자동 조회
- **Excel 동기화**: 채널 데이터를 Google Sheets에 업로드
- **작업 취소**: AbortController를 사용한 진행 중 작업 취소

#### 데이터 항목
- 채널 ID, 인터페이스 URL, 사용 여부
- 채널명, 채널 타입, 인터페이스 타입
- 카테고리 ID/명, 공급자명
- 좋아요 수, 청취 수, 생성일
- 최신 에피소드 업로드일, 썸네일 URL

### 3. 큐레이션 관리 (Curation Management)

**위치**: [src/feature/curation/CurationLayout.tsx](src/feature/curation/CurationLayout.tsx)

#### 주요 기능
- **큐레이션 조회**: 전시 기간 및 상태별 큐레이션 필터링
- **에피소드 연결**: 큐레이션에 포함된 에피소드 정보 관리
- **Excel 동기화**: 큐레이션 데이터를 Google Sheets에 저장
- **전시 기간 관리**: 시작일/종료일 추적

#### 데이터 항목
- 썸네일 제목, 분야, 섹션
- 활성 상태, 전시 상태
- 큐레이션 타입, 이름, 설명
- 전시 시작/종료 날짜, 생성일
- 연결된 에피소드 정보 (채널 ID, 에피소드 ID 등)

---

## 데이터 흐름

### 1. 에피소드 신규 데이터 동기화 프로세스

```
사용자 액션: "새로운 에피소드 검색" 버튼 클릭
    ↓
[getNewDataWithExcel() 실행]
    ↓
├─ Pickle API 호출
│  └─ GET /admin/episode?page={page}&size={size}
│     └─ 페이지 단위로 전체 에피소드 조회
│
├─ Google Sheets 데이터 읽기
│  └─ getExcelData("Episode", "episode")
│     └─ 기존 Excel 데이터 배치 읽기 (범위: B4:M{lastRow})
│
└─ 데이터 비교 및 필터링
   └─ getNewDataWithExcel()
      ├─ Excel에서 최대 episodeId 추출
      ├─ API 데이터에서 새 데이터만 필터링 (id > maxId)
      └─ findUpdateData()로 변경 사항 탐지
    ↓
[UI에 새 데이터 표시]
    ↓
사용자 액션: "Excel 동기화" 버튼 클릭
    ↓
[syncNewDataToExcel() 실행]
    ↓
├─ 기존 Excel 데이터 읽기
├─ 새 데이터 병합
├─ 중복 제거 (episodeId 기준)
└─ overwriteExcelData()로 전체 덮어쓰기
    ↓
[중복 데이터 로그 처리]
    ↓
├─ findChangedData()로 중복 에피소드 탐지
└─ syncNewDuplicateDataToExcel()로 Episode_Logs 시트에 기록
    ↓
[완료: 토스트 알림 표시]
```

### 2. 전체 에피소드 변환 프로세스

```
사용자 액션: "전체 에피소드 시트로 변환" 버튼 클릭
    ↓
[fetchAllData() 실행]
    ↓
├─ Pickle API에서 전체 에피소드 조회 (페이지 크기: 10,000)
├─ 진행률 추적 (totalPages, currentPage)
└─ 모든 페이지 데이터 수집
    ↓
[findChangedData() 실행]
    ↓
├─ 에피소드명 기준으로 중복 탐지
└─ 중복 에피소드 목록 생성
    ↓
[addMissingRows() 실행]
    ↓
├─ 기존 Excel 데이터 읽기
├─ 누락된 에피소드 식별 (episodeId 비교)
└─ 배치 단위(10,000행)로 Google Sheets에 추가
    ↓
[Episode_Logs 시트로 전환]
    ↓
└─ 중복 에피소드를 로그 시트에 추가
    ↓
[완료: 토스트 알림 표시]
```

### 3. 채널 최신 에피소드 업로드일 조회 프로세스

```
사용자 액션: "채널 최신 에피소드 업로드일 조회" 버튼 클릭
    ↓
[fetchAllData() 실행 - 채널 모드]
    ↓
├─ Pickle API에서 전체 채널 조회
│  └─ GET /admin/channel?page={page}&size={size}
│
└─ 각 채널별로 최신 에피소드 조회
   └─ GET /admin/channel/{channelId}/episode?page=1&size=1
      ├─ AbortSignal로 취소 가능
      ├─ 진행률 실시간 표시
      └─ dispDtime (최신 에피소드 업로드일) 추출
    ↓
[UI에 채널 데이터 표시]
    ↓
사용자 액션: "전체 채널 시트로 변환" 버튼 클릭
    ↓
[addMissingRows() 실행]
    ↓
├─ 기존 Channel 시트 데이터 읽기
├─ 누락된 채널 식별
└─ Google Sheets에 배치 추가
    ↓
[완료: 토스트 알림 표시]
```

---

## 인증 시스템

### 이중 인증 구조

이 애플리케이션은 두 가지 독립적인 인증 시스템을 사용합니다.

#### 1. Pickle 관리자 인증

**위치**: [src/feature/login/Login.tsx](src/feature/login/Login.tsx)

**흐름**:
```
1. 사용자가 로그인 페이지에서 ID/PW 입력
   ↓
2. POST https://pickle.obigo.ai/admin/login
   Body: { id: string, password: string }
   ↓
3. 응답으로 토큰 수신
   {
     accessToken: string,
     refreshToken: string
   }
   ↓
4. localStorage에 저장
   - "accessToken"
   - "refreshToken"
   ↓
5. Zustand 스토어 업데이트
   - useAccessTokenStore.setAccessToken()
   ↓
6. /episode 페이지로 리다이렉트
```

**토큰 사용**:
- Pickle API 호출 시 자동으로 Bearer 토큰 주입 ([src/utils/api.ts](src/utils/api.ts))
- 만료 시 자동 갱신 (E0123 에러 코드 감지)

#### 2. Google Sheets OAuth 2.0 인증

**위치**: [src/utils/auth.ts](src/utils/auth.ts)

**초기화 흐름**:
```
1. Header 컴포넌트 마운트 시 initializeGoogleAPI() 실행
   ↓
2. Google API 및 GIS 클라이언트 라이브러리 로드
   - gapi.client.init()
   - google.accounts.oauth2.initTokenClient()
   ↓
3. 스코프 설정
   - https://www.googleapis.com/auth/spreadsheets
   ↓
4. localStorage에서 기존 토큰 확인
   - "googleAccessToken" 존재 시 자동 로그인
```

**로그인 흐름**:
```
1. 사용자가 "Google Sheets 로그인" 버튼 클릭
   ↓
2. login() 함수 실행
   ↓
3. OAuth 팝업 창 표시
   - google.accounts.oauth2 사용
   ↓
4. 사용자 동의 후 토큰 수신
   ↓
5. localStorage 및 Zustand에 저장
   - useLoginTokenStore.setToken()
   ↓
6. gapi.client.setToken() 호출
```

**토큰 갱신**:
```
Google Sheets API 호출 시 401 에러 발생
   ↓
acquireTokenSilently() 실행
   ↓
tokenClient.requestAccessToken({ prompt: '' })
   ↓
새 토큰 발급 (사용자 상호작용 없음)
   ↓
localStorage 및 Zustand 업데이트
   ↓
실패한 요청 재시도
```

### 상태 관리

#### useAccessTokenStore (Pickle API)

**위치**: [src/store/useAccessTokenStore.ts](src/store/useAccessTokenStore.ts)

```typescript
interface AccessTokenStore {
  accessToken: string;
  refreshToken: string;
  setAccessToken: (token: string) => void;
  setRefreshToken: (token: string) => void;
  clearTokens: () => void;
}
```

- localStorage 동기화
- 페이지 새로고침 시 자동 복원

#### useLoginTokenStore (Google Sheets)

**위치**: [src/store/useLoginTokenStore.ts](src/store/useLoginTokenStore.ts)

```typescript
interface LoginTokenStore {
  token: string;
  setToken: (token: string) => void;
  clearToken: () => void;
}
```

- Google OAuth 토큰 관리
- 401 에러 시 자동 갱신 메커니즘

---

## API 통합

### Pickle Backend API

**Base URL**: `https://pickle.obigo.ai`

**Axios 인스턴스 설정**: [src/utils/api.ts](src/utils/api.ts)

#### 요청 인터셉터
```typescript
axiosInstance.interceptors.request.use(
  (config) => {
    const token = useAccessTokenStore.getState().accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  }
);
```

#### 응답 인터셉터 (자동 토큰 갱신)
```typescript
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.data?.code === 'E0123') {
      const refreshToken = useAccessTokenStore.getState().refreshToken;
      // 리프레시 토큰으로 새 액세스 토큰 발급
      const newAccessToken = await refreshAccessToken(refreshToken);
      // 재시도
      return axiosInstance.request(originalRequest);
    }
    return Promise.reject(error);
  }
);
```

#### 주요 엔드포인트

| Method | Endpoint | 설명 | 파라미터 |
|--------|----------|------|----------|
| POST | `/admin/login` | 관리자 로그인 | `{ id, password }` |
| GET | `/admin/episode` | 에피소드 목록 조회 | `?page={page}&size={size}` |
| GET | `/admin/episode/{episodeId}` | 에피소드 상세 조회 | episodeId (path) |
| GET | `/admin/channel` | 채널 목록 조회 | `?page={page}&size={size}` |
| GET | `/admin/channel/{channelId}/episode` | 채널별 에피소드 조회 | channelId (path), page, size |
| GET | `/admin/curation` | 큐레이션 목록 조회 | `?page={page}&size={size}&periodType=ALL` |
| GET | `/admin/curation/{curationId}` | 큐레이션 상세 조회 | curationId (path) |

### Google Sheets API

**Base URL**: Google API 클라이언트 라이브러리 사용

**인증**: OAuth 2.0 (Scope: `https://www.googleapis.com/auth/spreadsheets`)

#### 주요 작업

**1. 시트 목록 조회**

**위치**: [src/utils/getSheetList.ts](src/utils/getSheetList.ts)

```typescript
gapi.client.sheets.spreadsheets.get({
  spreadsheetId: SPREADSHEET_ID,
})
```

**2. 사용된 범위 조회**

**위치**: [src/utils/updateExcel.ts](src/utils/updateExcel.ts:45)

```typescript
gapi.client.sheets.spreadsheets.values.get({
  spreadsheetId: SPREADSHEET_ID,
  range: `${sheetName}!A1:Z`,
})
```

**3. 데이터 읽기 (배치 처리)**

```typescript
// 10,000행 단위로 배치 읽기
const range = `${sheetName}!B${startRow}:M${endRow}`;
gapi.client.sheets.spreadsheets.values.get({
  spreadsheetId: SPREADSHEET_ID,
  range: range,
})
```

**4. 데이터 쓰기 (배치 처리)**

**위치**: [src/utils/updateExcel.ts](src/utils/updateExcel.ts:168)

```typescript
gapi.client.sheets.spreadsheets.values.update({
  spreadsheetId: SPREADSHEET_ID,
  range: `${sheetName}!B${startRow}`,
  valueInputOption: 'USER_ENTERED',
  resource: {
    values: batchData, // 최대 10,000행
  },
})
```

**5. 범위 삭제**

**위치**: [src/utils/updateExcel.ts](src/utils/updateExcel.ts:405)

```typescript
gapi.client.sheets.spreadsheets.values.clear({
  spreadsheetId: SPREADSHEET_ID,
  range: `${sheetName}!${range}`,
})
```

---

## Excel 연동

### 데이터 구조

#### 에피소드 시트 (Episode)

| 열 | 필드명 | 타입 | 설명 |
|----|--------|------|------|
| B | episodeId | number | 에피소드 고유 ID |
| C | usageYn | string | 사용 여부 (Y/N) |
| D | channelName | string | 채널명 |
| E | episodeName | string | 에피소드명 |
| F | dispDtime | string | 표시 날짜/시간 |
| G | createdAt | string | 생성일 |
| H | playTime | number | 재생 시간 (초) |
| I | likeCnt | number | 좋아요 수 |
| J | listenCnt | number | 청취 수 |
| K | thumbnailUrl | string | 썸네일 URL |
| L | audioUrl | string | 오디오 URL |
| M | channelId | number | 채널 ID |

**범위**: `B4:M{lastRow}` (헤더는 B3:M3)

#### 채널 시트 (Channel)

| 열 | 필드명 | 타입 | 설명 |
|----|--------|------|------|
| B | channelId | number | 채널 고유 ID |
| C | interfaceUrl | string | 인터페이스 URL |
| D | usageYn | string | 사용 여부 (Y/N) |
| E | channelName | string | 채널명 |
| F | channelTypeName | string | 채널 타입 |
| G | interfaceType | string | 인터페이스 타입 |
| H | categoryId | number | 카테고리 ID |
| I | categoryName | string | 카테고리명 |
| J | vendorName | string | 공급자명 |
| K | likeCnt | number | 좋아요 수 |
| L | listenCnt | number | 청취 수 |
| M | createdAt | string | 생성일 |
| N | dispDtime | string | 최신 에피소드 업로드일 |
| O | thumbnailUrl | string | 썸네일 URL |

**범위**: `B4:O{lastRow}`

#### 큐레이션 시트 (Curation)

| 열 | 필드명 | 설명 |
|----|--------|------|
| B-K | 큐레이션 메타데이터 | thumbnailTitle, field, section, activeState, exhibitionState, curationType, curationName, curationDesc, dispStartDtime, dispEndDtime, curationCreatedAt |
| L-W | 에피소드 정보 | channelId, episodeId, usageYn, channelName, episodeName, dispDtime, createdAt, playTime, likeCnt, listenCnt, thumbnailUrl, audioUrl |

### 배치 처리 전략

**읽기 최적화**: [src/utils/updateExcel.ts](src/utils/updateExcel.ts:87)

```typescript
// 최대 300,000행 지원
const BATCH_SIZE = 10000; // 한 번에 10,000행 읽기

for (let i = startRow; i <= endRow; i += BATCH_SIZE) {
  const batchEnd = Math.min(i + BATCH_SIZE - 1, endRow);
  const range = `${sheetName}!B${i}:M${batchEnd}`;

  const response = await gapi.client.sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: range,
  });

  allData.push(...response.result.values);
}
```

**쓰기 최적화**: [src/utils/updateExcel.ts](src/utils/updateExcel.ts:168)

```typescript
// 10,000행 단위로 배치 쓰기
for (let i = 0; i < missingRows.length; i += BATCH_SIZE) {
  const batch = missingRows.slice(i, i + BATCH_SIZE);

  await gapi.client.sheets.spreadsheets.values.update({
    spreadsheetId: SPREADSHEET_ID,
    range: `${sheetName}!B${startRow + i}`,
    valueInputOption: 'USER_ENTERED',
    resource: { values: batch },
  });

  // 진행률 업데이트
  const progress = ((i + batch.length) / totalRows) * 100;
  setProgress(progress);
}
```

### 데이터 변환

**Excel → TypeScript 객체**: [src/utils/updateExcel.ts](src/utils/updateExcel.ts:108)

```typescript
const episodes: usingDataProps[] = validRows.map((row) => ({
  episodeId: Number(row[0]) || 0,
  usageYn: String(row[1] || ''),
  channelName: String(row[2] || ''),
  episodeName: String(row[3] || ''),
  dispDtime: formatDateString(row[4]),
  createdAt: formatDateString(row[5]),
  playTime: Number(row[6]) || 0,
  likeCnt: Number(row[7]) || 0,
  listenCnt: Number(row[8]) || 0,
  thumbnailUrl: String(row[9] || ''),
  audioUrl: String(row[10] || ''),
  channelId: Number(row[11]) || 0,
}));
```

**TypeScript 객체 → Excel**: [src/utils/updateExcel.ts](src/utils/updateExcel.ts:184)

```typescript
const episodeRows = episodes.map((episode) => [
  episode.episodeId,
  episode.usageYn,
  episode.channelName,
  episode.episodeName,
  episode.dispDtime,
  episode.createdAt,
  episode.playTime,
  episode.likeCnt,
  episode.listenCnt,
  episode.thumbnailUrl,
  episode.audioUrl,
  episode.channelId,
]);
```

---

## 상태 관리

### Zustand 스토어

#### 1. useAccessTokenStore

**위치**: [src/store/useAccessTokenStore.ts](src/store/useAccessTokenStore.ts)

**목적**: Pickle API 인증 토큰 관리

```typescript
const useAccessTokenStore = create<AccessTokenStore>((set) => ({
  accessToken: localStorage.getItem('accessToken') || '',
  refreshToken: localStorage.getItem('refreshToken') || '',

  setAccessToken: (token: string) => {
    localStorage.setItem('accessToken', token);
    set({ accessToken: token });
  },

  setRefreshToken: (token: string) => {
    localStorage.setItem('refreshToken', token);
    set({ refreshToken: token });
  },

  clearTokens: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    set({ accessToken: '', refreshToken: '' });
  },
}));
```

**사용 예시**:
```typescript
// 컴포넌트에서
const { accessToken, setAccessToken } = useAccessTokenStore();

// API 인터셉터에서
const token = useAccessTokenStore.getState().accessToken;
```

#### 2. useLoginTokenStore

**위치**: [src/store/useLoginTokenStore.ts](src/store/useLoginTokenStore.ts)

**목적**: Google Sheets OAuth 토큰 관리

```typescript
const useLoginTokenStore = create<LoginTokenStore>((set) => ({
  token: localStorage.getItem('googleAccessToken') || '',

  setToken: (token: string) => {
    localStorage.setItem('googleAccessToken', token);
    set({ token });
  },

  clearToken: () => {
    localStorage.removeItem('googleAccessToken');
    set({ token: '' });
  },
}));
```

### 로컬 상태 관리

각 기능 컴포넌트는 React의 `useState` 훅을 사용하여 로컬 상태를 관리합니다:

**에피소드 관리 예시**: [src/feature/episode/EpisodeLayout.tsx](src/feature/episode/EpisodeLayout.tsx)

```typescript
const [newData, setNewData] = useState<usingDataProps[]>([]);
const [changedData, setChangedData] = useState<usingDataProps[]>([]);
const [isLoading, setIsLoading] = useState(false);
const [progress, setProgress] = useState(0);
const [abortController, setAbortController] = useState<AbortController | null>(null);
```

---

## 주요 유틸리티 함수

### 1. Excel 작업 (updateExcel.ts)

**위치**: [src/utils/updateExcel.ts](src/utils/updateExcel.ts)

#### getUsedRange()

**목적**: 시트의 마지막 사용된 행 번호 조회

```typescript
export async function getUsedRange(
  sheetName: string
): Promise<number>
```

**동작**:
1. Google Sheets API로 `A1:Z` 범위 조회
2. 빈 행 제외하고 마지막 행 반환
3. 최소값: 4 (헤더 다음 행)

#### getExcelData()

**목적**: Excel에서 데이터를 배치 단위로 읽기

```typescript
export async function getExcelData<T extends "episode" | "channel" | "curation">(
  sheetName: string,
  category: T,
  setProgress?: (progress: number) => void
): Promise<CategoryDataMap[T][]>
```

**동작**:
1. `getUsedRange()`로 마지막 행 확인
2. 10,000행 단위로 배치 읽기
3. 빈 행 필터링
4. 타입별로 데이터 변환
5. 진행률 업데이트 (옵션)

**지원 카테고리**:
- `"episode"` → `usingDataProps[]`
- `"channel"` → `usingChannelProps[]`
- `"curation"` → `usingCurationExcelProps[]`

#### addMissingRows()

**목적**: 누락된 데이터 행을 Excel에 추가

```typescript
export async function addMissingRows<T extends "episode" | "channel" | "curation">(
  sheetName: string,
  category: T,
  data: CategoryDataMap[T][],
  setProgress?: (progress: number) => void
): Promise<void>
```

**동작**:
1. 기존 Excel 데이터 읽기
2. ID 기준으로 누락된 행 식별
3. 10,000행 단위로 배치 추가
4. 진행률 업데이트

#### overwriteExcelData()

**목적**: Excel 시트 전체를 새 데이터로 덮어쓰기

```typescript
export async function overwriteExcelData<T extends "episode" | "channel" | "curation">(
  sheetName: string,
  category: T,
  newData: CategoryDataMap[T][],
  setProgress?: (progress: number) => void
): Promise<void>
```

**동작**:
1. 기존 데이터 범위 삭제 (`clearExcelRange()`)
2. 새 데이터를 배치 단위로 쓰기
3. 중복 제거 (ID 기준)

#### clearExcelRange()

**목적**: 지정된 범위의 데이터 삭제

```typescript
export async function clearExcelRange(
  sheetName: string,
  range: string
): Promise<void>
```

### 2. 데이터 조회 (getNewData.ts)

**위치**: [src/utils/getNewData.ts](src/utils/getNewData.ts)

#### getNewDataWithExcel()

**목적**: API와 Excel 데이터를 비교하여 새 데이터 추출

```typescript
export async function getNewDataWithExcel<T extends "episode" | "channel">(
  sheetName: string,
  category: T,
  setProgress?: (progress: number) => void
): Promise<CategoryDataMap[T][]>
```

**동작**:
1. Excel에서 기존 데이터 읽기
2. 최대 ID 추출
3. API에서 전체 데이터 조회 (페이지 크기: 10,000)
4. ID > maxId인 데이터만 필터링

### 3. 데이터 동기화 (syncNewEpisodesToExcel.ts)

**위치**: [src/utils/syncNewEpisodesToExcel.ts](src/utils/syncNewEpisodesToExcel.ts)

#### syncNewDataToExcel()

**목적**: 새 에피소드를 Excel에 동기화

```typescript
export async function syncNewDataToExcel(
  sheetName: string,
  newData: usingDataProps[],
  setProgress?: (progress: number) => void
): Promise<void>
```

**동작**:
1. 기존 Excel 데이터 읽기
2. 새 데이터 병합
3. episodeId 기준 중복 제거
4. `overwriteExcelData()`로 전체 덮어쓰기

#### syncNewDuplicateDataToExcel()

**목적**: 중복 에피소드를 로그 시트에 기록

```typescript
export async function syncNewDuplicateDataToExcel(
  sheetName: string,
  newData: usingDataProps[],
  setProgress?: (progress: number) => void
): Promise<void>
```

### 4. 로그 관리 (updateLogs.ts)

**위치**: [src/utils/updateLogs.ts](src/utils/updateLogs.ts)

#### findChangedData()

**목적**: 중복된 에피소드명을 가진 모든 에피소드 반환

```typescript
export async function findChangedData(
  allData: usingDataProps[]
): Promise<usingDataProps[]>
```

**동작**:
1. episodeName별로 그룹화
2. 2개 이상 존재하는 그룹 추출
3. 해당 그룹의 모든 에피소드 반환

#### findUpdateData()

**목적**: Excel과 API 데이터를 비교하여 변경된 데이터 탐지

```typescript
export async function findUpdateData(
  excelData: usingDataProps[],
  newData: usingDataProps[]
): Promise<usingDataProps[]>
```

**동작**:
1. episodeId로 매칭
2. usageYn 값 비교
3. 변경된 에피소드만 반환

### 5. 인증 (auth.ts)

**위치**: [src/utils/auth.ts](src/utils/auth.ts)

#### initializeGoogleAPI()

**목적**: Google API 및 OAuth 클라이언트 초기화

```typescript
export const initializeGoogleAPI = async (): Promise<void>
```

**동작**:
1. Google API 클라이언트 라이브러리 로드
2. gapi.client.init() 호출
3. GIS tokenClient 초기화
4. localStorage에서 토큰 복원

#### login()

**목적**: Google OAuth 로그인 팝업 표시

```typescript
export const login = (): void
```

#### acquireTokenSilently()

**목적**: 사용자 상호작용 없이 토큰 갱신

```typescript
export const acquireTokenSilently = async (): Promise<void>
```

**동작**:
1. `tokenClient.requestAccessToken({ prompt: '' })` 호출
2. 새 토큰 발급
3. localStorage 및 Zustand 업데이트

#### logout()

**목적**: 로그아웃 및 토큰 삭제

```typescript
export const logout = (): void
```

---

## 타입 정의

**위치**: [src/type.ts](src/type.ts)

### 에피소드 데이터

```typescript
export interface usingDataProps {
  episodeId: number;
  usageYn: string;
  channelName: string;
  episodeName: string;
  dispDtime: string;
  createdAt: string;
  playTime: number;
  likeCnt: number;
  listenCnt: number;
  thumbnailUrl: string;
  audioUrl: string;
  channelId: number;
}
```

### 채널 데이터

```typescript
export interface usingChannelProps {
  channelId: number;
  interfaceUrl: string;
  usageYn: string;
  channelName: string;
  channelTypeName: string;
  interfaceType: string;
  categoryId: number;
  categoryName: string;
  vendorName: string;
  likeCnt: number;
  listenCnt: number;
  createdAt: string;
  dispDtime: string; // 최신 에피소드 업로드일
  thumbnailUrl: string;
}
```

### 큐레이션 데이터

```typescript
export interface usingCurationExcelProps {
  thumbnailTitle?: string;
  field?: string;
  section?: number;
  activeState?: string;
  exhibitionState?: string;
  curationType: string;
  curationName: string;
  curationDesc: string;
  dispStartDtime: string;
  dispEndDtime: string;
  curationCreatedAt: string;
  // 에피소드 정보
  channelId?: number;
  episodeId?: number;
  usageYn?: string;
  channelName?: string;
  episodeName?: string;
  dispDtime?: string;
  createdAt?: string;
  playTime?: number;
  likeCnt?: number;
  listenCnt?: number;
  thumbnailUrl?: string;
  audioUrl?: string;
}
```

### 카테고리 매핑

```typescript
export interface CategoryDataMap {
  episode: usingDataProps;
  channel: usingChannelProps;
  curation: usingCurationExcelProps;
}
```

---

## 개발 환경 설정

### 필수 요구사항

- **Node.js**: 18.x 이상
- **npm**: 9.x 이상
- **Google Cloud Project**: OAuth 2.0 클라이언트 ID
- **Google Sheets**: 편집 권한이 있는 스프레드시트

### 설치 및 실행

```bash
# 저장소 클론
git clone <repository-url>
cd pickle-admin

# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 빌드
npm run build

# 프리뷰 (빌드 결과 확인)
npm run preview
```

### 환경 변수 설정

`.env` 파일을 프로젝트 루트에 생성하고 다음 값을 설정하세요:

```env
# Google Sheets 설정
VITE_SPREADSHEET_ID=your_google_sheets_id_here

# Google OAuth 2.0 설정
VITE_GOOGLE_CLIENT_ID=your_google_client_id_here
VITE_GOOGLE_API_KEY=your_google_api_key_here

# Pickle 관리자 대시보드 URL (옵션)
VITE_ADMIN_EPI_URL=https://pickle.obigo.ai/admin-web/#/episode-list
```

#### Google Cloud 설정 방법

1. **Google Cloud Console** 접속
   - https://console.cloud.google.com

2. **프로젝트 생성** (또는 기존 프로젝트 선택)

3. **API 활성화**
   - "API 및 서비스" > "라이브러리"
   - "Google Sheets API" 검색 및 활성화

4. **OAuth 2.0 클라이언트 ID 생성**
   - "API 및 서비스" > "사용자 인증 정보"
   - "사용자 인증 정보 만들기" > "OAuth 클라이언트 ID"
   - 애플리케이션 유형: "웹 애플리케이션"
   - 승인된 JavaScript 원본: `http://localhost:5173`
   - 승인된 리디렉션 URI: `http://localhost:5173`
   - 클라이언트 ID를 `.env`에 복사

5. **API 키 생성**
   - "사용자 인증 정보 만들기" > "API 키"
   - API 키를 `.env`에 복사

6. **Google Sheets 스프레드시트 ID 확인**
   - 스프레드시트 URL: `https://docs.google.com/spreadsheets/d/{SPREADSHEET_ID}/edit`
   - `{SPREADSHEET_ID}` 부분을 `.env`에 복사

### 프로젝트 구조 이해

- **src/feature**: 각 기능(에피소드, 채널, 큐레이션)별 독립적인 모듈
- **src/utils**: 재사용 가능한 유틸리티 함수 (Excel, API, 인증)
- **src/store**: 전역 상태 관리 (Zustand)
- **src/layout**: 공통 레이아웃 컴포넌트

---

## 배포 및 빌드

### 빌드 설정

**위치**: [vite.config.ts](vite.config.ts)

```typescript
export default defineConfig({
  plugins: [react()],
  base: '/', // 배포 경로
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
});
```

### 빌드 실행

```bash
# 프로덕션 빌드
npm run build

# 빌드 결과물 확인
npm run preview
```

### 배포 체크리스트

1. **환경 변수 설정**
   - 프로덕션 환경에 맞는 `.env` 파일 준비
   - Google OAuth 리디렉션 URI에 프로덕션 도메인 추가

2. **빌드 실행**
   ```bash
   npm run build
   ```

3. **dist/ 폴더 배포**
   - 정적 파일 호스팅 서비스에 업로드
   - 예: Vercel, Netlify, AWS S3 + CloudFront

4. **CORS 설정 확인**
   - Pickle API가 프로덕션 도메인을 허용하는지 확인

5. **Google OAuth 설정 업데이트**
   - Google Cloud Console에서 프로덕션 도메인을 승인된 JavaScript 원본에 추가

---

## 트러블슈팅

### 1. Google Sheets 로그인 실패

**증상**: "Google Sheets 로그인" 버튼 클릭 시 팝업이 뜨지 않거나 오류 발생

**해결 방법**:
1. 브라우저 팝업 차단 해제 확인
2. `.env` 파일의 `VITE_GOOGLE_CLIENT_ID` 확인
3. Google Cloud Console에서 승인된 JavaScript 원본 확인
   - `http://localhost:5173` (개발)
   - 프로덕션 도메인 (배포 시)
4. 브라우저 개발자 도구 콘솔에서 오류 메시지 확인

### 2. Excel 데이터 읽기 실패 (401 Unauthorized)

**증상**: "Excel 데이터를 읽어오는 중 오류가 발생했습니다" 토스트 메시지

**해결 방법**:
1. Google Sheets 로그인 상태 확인
   - localStorage에 `googleAccessToken` 존재 여부 확인
2. 토큰 만료 시 자동 갱신 확인
   - [src/utils/updateExcel.ts](src/utils/updateExcel.ts) 내 `acquireTokenSilently()` 호출 확인
3. 스프레드시트 공유 권한 확인
   - 로그인한 Google 계정에 편집 권한 부여

### 3. Pickle API 호출 실패

**증상**: 에피소드/채널 데이터 조회 시 오류 발생

**해결 방법**:
1. 관리자 로그인 상태 확인
   - localStorage에 `accessToken` 존재 여부 확인
2. 네트워크 연결 확인
   - 개발자 도구 > Network 탭에서 API 응답 확인
3. 토큰 갱신 확인
   - E0123 오류 시 자동 리프레시 토큰 갱신 확인
4. CORS 오류
   - Pickle API 서버에서 CORS 설정 확인

### 4. 배치 쓰기 실패

**증상**: "Excel 동기화" 시 일부 데이터만 저장되거나 오류 발생

**해결 방법**:
1. Google Sheets API 할당량 확인
   - Google Cloud Console > API 및 서비스 > 할당량
2. 배치 크기 조정
   - [src/utils/updateExcel.ts](src/utils/updateExcel.ts)의 `BATCH_SIZE` 값 변경 (기본: 10,000)
3. 네트워크 속도 확인
   - 대량 데이터 전송 시 타임아웃 발생 가능

### 5. 중복 데이터 탐지 오류

**증상**: 중복이 아닌 데이터가 중복으로 표시됨

**해결 방법**:
1. `findChangedData()` 로직 확인
   - episodeName 기준 중복 탐지
2. 데이터 정규화 확인
   - 공백, 특수문자 제거 필요 시 추가 로직 구현

### 6. 날짜 포맷 오류

**증상**: Excel에 날짜가 숫자로 표시됨

**해결 방법**:
1. `formatDateString()` 함수 확인
   - [src/utils/formatDateString.ts](src/utils/formatDateString.ts)
2. Excel에서 날짜 형식 설정
   - Google Sheets에서 열 형식을 "날짜/시간"으로 변경

---

## 추가 리소스

### API 문서
- **Google Sheets API**: https://developers.google.com/sheets/api
- **Google Identity Services**: https://developers.google.com/identity/gsi/web

### 라이브러리 문서
- **React**: https://react.dev
- **Zustand**: https://zustand.docs.pmnd.rs
- **Axios**: https://axios-http.com
- **Tailwind CSS**: https://tailwindcss.com

### 개발 도구
- **Vite**: https://vite.dev
- **TypeScript**: https://www.typescriptlang.org

---
