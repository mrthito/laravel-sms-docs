# Log

<p class="lead">기본 드라이버입니다. 모든 메시지를 실제로 보내지 않고 Laravel 로그에 기록하므로, 제공업체 계정이나 실제 휴대폰 없이도 SMS 기능을 만들고 직접 눌러 보며 확인할 수 있습니다.</p>

```ini [.env]
SMS_PROVIDER=log
SMS_LOG_CHANNEL=sms   # 선택 사항: config/logging.php에 정의한 전용 채널
```

메시지 하나가 `debug` 로그 한 줄이 됩니다.

```text
[2026-11-02 10:24:51] local.DEBUG: SMS captured by log driver {"provider":"log","recipients":["***4567"],"message":"Your code is 4821","template_id":null,"variables":[]}
```

수신자는 가려지지만, 개발 중에 코드를 확인할 수 있도록 메시지 본문은 그대로 기록됩니다. 그래서 log 드라이버는 **절대 프로덕션에서 쓰면 안 됩니다.** 로그인 코드가 로그 파일에 고스란히 남게 됩니다.

`sendNow()`는 `log-…` 형태로 생성된 메시지 ID가 담긴 `SmsResult`를 반환하므로, ID를 저장하는 코드도 그대로 동작합니다.
