# Artisan 명령어

## sms:test {#sms-test}

애플리케이션과 같은 코드 경로로 실제 문자를 보내 인증 정보를 확인합니다.

```bash
php artisan sms:test {to} [--provider=] [--message=]
```

| | |
|---|---|
| `to` | 수신자. E.164 형식을 권장합니다: `+15551234567` |
| `--provider` | 사용할 제공업체 키. 기본값은 `SMS_PROVIDER`입니다. |
| `--message` | 보낼 본문. 기본값은 짧은 테스트 메시지입니다. |

```bash
php artisan sms:test +15551234567 --provider=sinch --message="Hello from production"
```

성공하면 제공업체와 메시지 ID를 출력합니다. 실패하면 제공업체가 밝힌 사유를 출력하고 0이 아닌 종료 코드로 끝나므로, 배포 스크립트나 헬스 체크에 활용할 수 있습니다.

::: warning 실제 문자가 발송됩니다
요금도 부과됩니다. 본인 번호로 시험하세요.
:::

## about {#about}

Laravel의 `php artisan about` 명령어에 **Laravel SMS** 섹션이 추가됩니다.

```text
  Laravel SMS ............................................................
  Default provider ................................................. twilio
  Queue .......................................................... disabled
  Webhooks ........................................................ enabled
```
