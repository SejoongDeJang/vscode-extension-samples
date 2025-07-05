# Diagnostic Webview 시스템 구축 계획

## 프로젝트 개요
webview-sample을 기반으로 VS Code extension의 diagnostic 결과를 시각화하는 시스템을 구축합니다.

## 주요 목표
- **DiagnosticProvider** 클래스 구현: 각 extension에서 진단 제공자 역할
- **DiagnosticItem** 클래스 구현: 개별 진단 항목 관리
- **웹뷰 UI** 구현: 2개의 리스트뷰로 진단 결과 시각화
- **URL Handler** 구현: 외부 링크를 통한 진단 실행
- **테스트 코드** 작성: vscode 의존성 있는/없는 파일 구분
- **API 문서** 작성: 사용자 가이드 포함

## 작업 체크리스트

### 1. 프로젝트 설정 및 환경 구축
- [ ] webview-sample 분석 완료
- [ ] 프로젝트 구조 설계
- [ ] TypeScript 설정 업데이트
- [ ] 테스트 환경 설정 (Vitest, VS Code Test Framework)
- [ ] 개발 환경 설정

### 2. 핵심 클래스 구현
- [ ] **DiagnosticProvider** 클래스 구현
  - [ ] 생성자 (providerId, title) 
  - [ ] DiagnosticItem 배열 관리
  - [ ] 전체 진단 실행 메서드
  - [ ] 상태 관리 메서드
- [ ] **DiagnosticItem** 클래스 구현
  - [ ] 기본 속성 (id, title, status)
  - [ ] 진단 실행 메서드 (abstract)
  - [ ] 대책 실행 메서드 (abstract)
  - [ ] 로그 처리 메서드
  - [ ] 상태 변경 이벤트 처리

### 3. DiagnosticItem 상속 클래스 구현
- [ ] **NetworkDiagnosticItem** 클래스
  - [ ] 네트워크 연결 테스트
  - [ ] 응답 시간 측정
  - [ ] 오류 처리 및 대책 제공
- [ ] **CommandDiagnosticItem** 클래스
  - [ ] 명령어 실행 및 결과 확인
  - [ ] 환경 변수 검증
  - [ ] 오류 분석 및 대책 제공
- [ ] **LocalTerminalDiagnosticItem** 클래스
  - [ ] 로컬 터미널 명령어 실행
  - [ ] 실행 결과 검증
  - [ ] 권한 관련 오류 처리

### 4. 웹뷰 UI 구현
- [ ] **Provider 리스트뷰**
  - [ ] 등록된 프로바이더 목록 표시
  - [ ] 각 프로바이더의 진단 항목 개수 표시
  - [ ] 프로바이더 선택 시 해당 섹션으로 이동
- [ ] **DiagnosticItem 리스트뷰**
  - [ ] 프로바이더별 구분선 표시
  - [ ] "Diagnostic All" 버튼 구현
  - [ ] "Copy All" 버튼 구현
  - [ ] 개별 진단 항목 UI
    - [ ] 상태 표시 (성공/실패/진행중)
    - [ ] 진단 타이틀 표시
    - [ ] 개별 실행 버튼
    - [ ] 로그 창 토글
    - [ ] 대책 버튼 (실패 시)

### 5. VS Code Extension 기능 구현
- [ ] **Command 등록**
  - [ ] 진단 시작 명령어
  - [ ] 개별 진단 실행 명령어
  - [ ] 프로바이더 등록 명령어
- [ ] **URL Handler 구현**
  - [ ] 프로바이더 ID로 전체 진단 실행
  - [ ] 프로바이더 ID + 항목 ID로 개별 진단 실행
  - [ ] URL 스키마 정의
- [ ] **Extension 간 통신**
  - [ ] 프로바이더 등록 API
  - [ ] 진단 결과 수집 API
  - [ ] 이벤트 발생 시스템

### 6. 테스트 코드 작성
- [ ] **VS Code 독립적 테스트 (Vitest)**
  - [ ] DiagnosticProvider 유닛 테스트
  - [ ] DiagnosticItem 유닛 테스트
  - [ ] 상속 클래스 테스트
  - [ ] 유틸리티 함수 테스트
- [ ] **VS Code 의존성 테스트**
  - [ ] Extension 활성화 테스트
  - [ ] 웹뷰 생성 테스트
  - [ ] 명령어 등록 테스트
  - [ ] URL Handler 테스트

### 7. 문서화
- [ ] **API 문서 작성**
  - [ ] DiagnosticProvider API 문서
  - [ ] DiagnosticItem API 문서
  - [ ] 상속 클래스 사용 가이드
- [ ] **사용자 가이드**
  - [ ] 설치 및 설정 가이드
  - [ ] 명령어 사용법
  - [ ] URL Handler 사용법
  - [ ] 커스텀 진단 항목 생성 가이드

### 8. 통합 및 최적화
- [ ] **성능 최적화**
  - [ ] 대용량 로그 처리
  - [ ] 메모리 사용량 최적화
  - [ ] 비동기 처리 개선
- [ ] **사용자 경험 개선**
  - [ ] 로딩 상태 표시
  - [ ] 에러 메시지 개선
  - [ ] 접근성 향상

### 9. 배포 및 최종 검토
- [ ] **패키징**
  - [ ] 빌드 설정 최적화
  - [ ] 의존성 정리
  - [ ] 배포 파일 생성
- [ ] **최종 테스트**
  - [ ] 전체 시나리오 테스트
  - [ ] 크로스 플랫폼 테스트
  - [ ] 성능 테스트

## 기술 스택
- **Language**: TypeScript
- **Framework**: VS Code Extension API
- **Testing**: Vitest (독립적 테스트), VS Code Test Framework (통합 테스트)
- **UI**: HTML/CSS/JavaScript (웹뷰)
- **Build**: TypeScript Compiler

## 프로젝트 구조
```
webview-sample/
├── src/
│   ├── core/
│   │   ├── DiagnosticProvider.ts
│   │   ├── DiagnosticItem.ts
│   │   └── DiagnosticManager.ts
│   ├── items/
│   │   ├── NetworkDiagnosticItem.ts
│   │   ├── CommandDiagnosticItem.ts
│   │   └── LocalTerminalDiagnosticItem.ts
│   ├── webview/
│   │   └── DiagnosticWebviewProvider.ts
│   ├── handlers/
│   │   └── UrlHandler.ts
│   ├── utils/
│   │   └── Logger.ts
│   └── extension.ts
├── media/
│   ├── diagnostic.html
│   ├── diagnostic.js
│   └── diagnostic.css
├── test/
│   ├── unit/
│   └── integration/
├── docs/
│   ├── API.md
│   └── USER_GUIDE.md
└── package.json
```

## 성공 기준
1. 모든 테스트 통과
2. 3개 이상의 DiagnosticItem 상속 클래스 구현
3. 웹뷰 UI 완전 기능 구현
4. URL Handler 정상 작동
5. API 문서 및 사용자 가이드 완성
6. 다른 extension에서 쉽게 사용할 수 있는 API 제공

## 예상 일정
- **Phase 1**: 프로젝트 설정 및 핵심 클래스 구현 (2-3일)
- **Phase 2**: 웹뷰 UI 및 Extension 기능 구현 (3-4일)
- **Phase 3**: 테스트 코드 작성 및 문서화 (2-3일)
- **Phase 4**: 통합 및 최적화 (1-2일)

**총 예상 기간**: 8-12일