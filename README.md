# smart-smoke-bin-frontend

스마트 스모크 빈 프론트엔드 서버

## 환경변수 설정 (.env.local)

다음 키를 `.env.local`에 설정하세요:

```
NEXT_PUBLIC_API_BASE=https://api.example.com
NEXT_PUBLIC_API_TOKEN=
NEXT_PUBLIC_API_TIMEOUT_MS=10000
NEXT_PUBLIC_API_RETRY=2
```

설명:
- NEXT_PUBLIC_API_BASE: 백엔드 베이스 URL (필수)
- NEXT_PUBLIC_API_TOKEN: 초기 접근 토큰(선택). 런타임 로그인/리프레시가 있으면 생략 가능
- NEXT_PUBLIC_API_TIMEOUT_MS: 요청 타임아웃(ms), 기본 10000
- NEXT_PUBLIC_API_RETRY: 5xx/네트워크 오류 재시도 횟수, 기본 2