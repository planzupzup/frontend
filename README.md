# PlanZupZup (플랜줍줍)

"ZupZup (줍줍)"은 사용자가 여행 계획을 세우고, 다른 사람의 여행 일정을 공유하며 탐색할 수 있는 **여행 일정 큐레이션 및 플래닝 서비스**입니다.

## 📅 프로젝트 기간
- 2025.04.22 ~ 2025.12.04

## 🎨 디자인 가이드
- [Figma Design Link](https://www.figma.com/design/QaQYHAoKfJDS6X6fCn2y5Y/Planzupzup?node-id=193-1647&t=RF6zFCgFFsk978dD-0)

## 🛠 기술 스택
- **Core:** Next.js 15.3.1 (App Router), TypeScript 5.x, React 19
- **Styling:** SCSS (Sass) 1.87.0, CSS Modules
- **Maps API:** Google Maps API, Kakao Map API
- **Animations:** Lottie
- **Infrastructure:** Vercel (Recommended)
- **Linting:** ESLint

## ✨ 핵심 기능
- **여행 일정 탐색 및 검색**
    - 목적지별(서울, 부산, 제주, 강릉 등) 여행 계획 리스트 확인
    - 키워드를 통한 여행지 및 일정 검색 기능
    - Masonry Layout을 활용한 시각적인 일정 카드 UI
- **정교한 여행 플래너**
    - Google/Kakao 지도를 활용한 장소 선택 및 경로 시각화
    - 일차별(Day) 일정 관리 및 실시간 편집 기능
    - 장소 상세 정보 확인 및 경로 최적화
- **커뮤니티 및 소통**
    - 여행 계획에 대한 댓글 및 대댓글(Reply) 기능
    - 댓글 좋아요 기능 및 유저 간 의견 공유
- **사용자 관리 및 프로필**
    - 소셜 로그인 및 인증 처리
    - 나의 여행 계획 관리 및 프로필/이미지 수정 기능
- **반응형 UI/UX**
    - 모바일 최적화 반응형 디자인
    - Lottie 애니메이션을 활용한 인터랙티브한 사용자 경험

## 🚀 시작 가이드

NVM을 사용하여 노드 버전을 맞춘 후 (v18 이상 권장) 다음 명령어를 실행하세요.

```shell
# 노드 버전 설정
nvm use

# 의존성 설치
npm install

# 개발 서버 실행
npm run dev
```
