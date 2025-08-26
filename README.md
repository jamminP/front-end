# 🎯 EVI Frontend

AI 공부 도우미 EVI의 프론트엔드 레포입니다. <br/>
**학습 계획**, **문서 요약**, **커뮤니티 기능**을 담아 학습자가 필요로 하는 주요 기능을 한곳에서 이용할 수 있습니다.

## 👨‍💻 Frontend 팀원

<table>
  <tr>
    <td align="center">
        <img src="https://avatars.githubusercontent.com/u/206815651?v=4" width="96"/><br/>
        <b>김은빈</b> (<a href="https://github.com/bin00125">@bin00125</a>)
      <br/>
      <sub>Header · Login · 마이페이지</sub>
    </td>
    <td align="center">
        <img src="https://avatars.githubusercontent.com/u/117453101?v=4" width="96"/><br/>
        <b>박재민</b> (<a href="https://github.com/jamminP">@jamminP</a>)
      <br/>
      <sub>Landing · AI 페이지</sub>
    </td>
    <td align="center">
        <img src="https://avatars.githubusercontent.com/u/202897450?v=4" width="96"/><br/>
        <b>이재은</b> (<a href="https://github.com/Jaeeun0723">@Jaeeun0723</a>)
      <br/>
      <sub>커뮤니티 페이지</sub>
    </td>
  </tr>
</table>


## 🔗 배포 링크
- **서비스**: https://evida.site  
- **백엔드 API**: https://backend.evida.site  


## 🧰 기술 스택

<p align="left">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" width="120" height="120"/>
  &nbsp;&nbsp;&nbsp;
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg" width="120" height="120"/>
  &nbsp;&nbsp;&nbsp;
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vite/vite-original.svg" width="120" height="120"/>
  &nbsp;&nbsp;&nbsp;
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg" width="120" height="120"/>
  &nbsp;&nbsp;&nbsp;
</p>
<br/>

- 프론트엔드 핵심 프레임워크: **React 19 / TypeScript / Vite**
- UI 스타일링 및 애니메이션: **Tailwind CSS / Framer Motion / Swiper** 
- 라우팅, 서버 상태 관리, 전역 상태 관리: **React Router / TanStack Query / Zustand**
- 스키마 기반 Validation: **Zod**
- HTTP 통신: **Axios**
- 유틸 & 확장 기능: **date-fns / React Virtuoso / React Dropzone**
- 코드 품질 관리: **ESLint / Prettier**


## ✨ 주요 기능

- **AI 학습 지원**
  - 학습 계획 생성/문서 요약 요청 → 진행 상태 → 결과 카드 렌더링
- **커뮤니티**
  - 무한 스크롤 게시판, 댓글/좋아요, 카테고리 탭(Free/Share/Study)
- **마이페이지**
  - 학습 기록/요약/챌린지 현황 관리
- **실시간 알림**
  - SSE(EventSource) 기반 스트리밍 알림
- **UX/UI**
  - 반응형 디자인, 키보드 접근성, 애니메이션(Framer Motion)


## 🚀 사용방법

```bash
npm install   # 의존성 설치
npm run dev   # 로컬 개발 서버 실행
npm run build # 프로덕션 빌드
npm run preview # 빌드 미리보기
```

## ⚙️ 환경 변수 설정 (.env)
> Vite 규칙상 접두어 VITE_ 필수
```bash
VITE_API_BASE_URL="백엔드서버주소"
```

## ☁️ 배포 (Vercel)

SPA 경로 새로고침 시 404 오류를 방지하려면 `vercel.json`에 다음 설정을 추가합니다:
```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/" }]
}

```
또는 Vercel Project → Settings → Redirects에서
`Source: /(.*)` → `Destination: /index.html` (Rewrite) 로 설정

## 🎨 디자인 & 상태 관리

- **TailwindCSS**: 색상/간격/타이포 토큰화 및 유틸 클래스
- **Framer Motion**: 페이지/컴포넌트 전환 애니메이션
- **React Virtuoso**: 긴 목록 렌더링 최적화
- **React Dropzone**: 파일 업로드 UX
- **Zustand**: 인증 정보 및 전역 상태 관리
- **TanStack Query**: 서버 상태 관리 (목록, 상세, 페이지네이션, SSE 등)
- **Zod**: 폼 입력 및 API 응답 스키마 검증

## 📌 컨벤션

- **브랜치**: `feature/<scope>`, `fix/<scope>`
- **커밋**: `feat|fix|refactor|style|docs|test|chore: 한글 설명`
- **PR**: 템플릿 기반 작성, 최소 1명 리뷰 필수
- **Issue**: Bug/Feature 템플릿 사용

---

## 🧭 트러블슈팅 (FAQ)

- **/ai 새로고침 404** → Vercel `rewrites` 설정 확인
- **쿠키 미적용** → `withCredentials: true` + 백엔드 CORS/도메인/HTTPS 설정 필요
- **무한스크롤 중복 요청** → `hasNextPage` 체크 및 인터섹션 옵저버 조건 확인
