# 이벤트 - 보상 시스템 (Event Reward System)

## 개요

이 프로젝트는 **NestJS**, **MongoDB**, **JWT 인증**을 기반으로 한 **마이크로서비스 아키텍처 (MSA)** 기반 **이벤트 및 보상 시스템**입니다. 사용자는 회원가입/로그인 후 이벤트(예: 7일 연속 로그인)에 참여하고, 조건을 충족하면 보상을 받을 수 있습니다.

## 프로젝트 구조

```
.
├── gateway/          # 역할 기반 JWT 검증이 포함된 API Gateway
├── auth/             # 사용자 인증, 로그인 기록, 아이템 저장
├── event/            # 이벤트 생성, 전략 기반 조건 검증 및 보상 지급
├── docker-compose.yml
```

## 주요 기능

### 인증 서버 (`auth`)

* 사용자 회원가입 (USER 권한만 허용)
* 로그인 및 JWT 발급
* 로그인 히스토리 저장
* 사용자 아이템 추가 (보상 지급 시 사용)
* 사용자 프로필 및 아이템 목록 조회

### 게이트웨이 서버 (`gateway`)

* JWT 토큰 검증
* 역할(Role) 기반 요청 필터링
* 인증된 요청을 내부 서비스로 포워딩

### 이벤트 서버 (`event`)

* 이벤트 등록
    * 제목, 이벤트 타입(`SEVEN_DAY_LOGIN`, `FIRST_LOGIN` 등)
    * 설정값(config): 기간, 보상 타입, 보상 내용
    * 시작일/종료일 설정
* 전략 패턴 기반 조건 검증
* 조건 충족 시 보상 자동 지급
* 수동 보상 수령 요청(`/reward/claim`)
* 전체 보상 기록 또는 사용자별 조회 기능

### 보상 시스템

* 보상 타입: `ITEM`, `POINT` (포인트도 아이템으로 처리됨)
* 팩토리 + 레지스트리 기반 전략 적용
* 중복 수령 방지
* 보상 수령 로그 기록 (성공/실패 사유 포함)

## 기술 스택

* **NestJS** (모듈화, 의존성 주입 구조)
* **MongoDB** 및 Mongoose ODM
* **JWT 인증 기반 접근 제어**
* **Docker & docker-compose**
* **디자인 패턴**: Strategy, Factory, Registry

## API 예시

### 회원가입

```http
POST /proxy/auth/register
{
  "username": "tester",
  "password": "1234",
  "role": "USER"
}
```

### 로그인

```http
POST /proxy/auth/login
{
  "username": "tester",
  "password": "1234"
}
```

### 이벤트 등록

```http
POST /proxy/event
Authorization: Bearer <TOKEN>
{
  "title": "7일 로그인 보너스",
  "eventType": "SEVEN_DAY_LOGIN",
  "config": {
    "days": 7,
    "rewardType": "ITEM",
    "payload": {
      "name": "point",
      "quantity": 100
    }
  },
  "startDate": "2025-05-10T00:00:00Z",
  "endDate": "2025-05-20T00:00:00Z"
}
```

### 보상 수령 요청

```http
POST /proxy/reward/claim
Authorization: Bearer <TOKEN>
{
  "eventId": "..."
}
```

### 내 정보 및 아이템 조회

```http
GET /proxy/auth/user/me
Authorization: Bearer <TOKEN>
```

## 실행 방법

```bash
docker-compose up --build
```

## 확장성

* `event/strategies/implementations`에 새로운 이벤트 전략 추가
* registry 및 factory에 등록만 하면 전략 적용 완료
* 새로운 보상 타입 추가 가능 (예: 쿠폰, 뱃지 등)
* 외부 시스템과 연동 용이한 API 기반 설계

## 개발 원칙

* JWT 파싱 및 권한 검사는 Gateway에서만 처리
* 각 서비스는 JWT 구조를 알지 못함
* 서비스 간 통신은 service name 기반 주소 사용 (예: [http://auth:3001](http://auth:3001))
