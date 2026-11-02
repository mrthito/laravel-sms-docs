# 제공업체 고르기

<p class="lead">모든 제공업체가 같은 API로 동작하므로, 이 선택은 코드가 아니라 가격, 도달 범위, 서류 작업의 문제입니다. 나중에 마음이 바뀌면 <code>.env</code>에서 한 줄만 고치면 됩니다.</p>

## 한눈에 보기 {#at-a-glance}

| 제공업체 | 키 | 지원 지역 | 발송 방식 | 템플릿 | 웹훅 |
|---|---|---|---|---|---|
| [Twilio](/ko/providers/twilio) | `twilio` | 전 세계 | 병렬 |  |  |
| [Vonage](/ko/providers/vonage) | `vonage` | 전 세계 | 병렬 |  |  |
| [Sinch](/ko/providers/sinch) | `sinch` | 전 세계 | 대량 |  |  |
| [Bird](/ko/providers/bird) | `bird` | 전 세계 | 병렬 |  |  |
| [Plivo](/ko/providers/plivo) | `plivo` | 전 세계 | 대량 |  |  |
| [Telnyx](/ko/providers/telnyx) | `telnyx` | 전 세계 | 병렬 |  |  |
| [Infobip](/ko/providers/infobip) | `infobip` | 전 세계 | 대량 |  |  |
| [ClickSend](/ko/providers/clicksend) | `clicksend` | 전 세계 | 대량 |  |  |
| [Clickatell](/ko/providers/clickatell) | `clickatell` | 전 세계 | 대량 |  |  |
| [Brevo](/ko/providers/brevo) | `brevo` | 전 세계 | 병렬 | ✓ |  |
| [Bandwidth](/ko/providers/bandwidth) | `bandwidth` | 미국, 캐나다 | 병렬 |  |  |
| [SendPulse](/ko/providers/sendpulse) | `sendpulse` | 전 세계 | 대량 |  |  |
| [Amazon SNS](/ko/providers/aws-sns) | `aws_sns` | 전 세계 | SDK |  |  |
| [WhatsApp](/ko/providers/whatsapp) | `whatsapp` | 전 세계 | 병렬 | ✓ | ✓ |
| [MSG91](/ko/providers/msg91) | `msg91` | 인도 | 둘 다 | ✓ |  |
| [Sparrow SMS](/ko/providers/sparrow) | `sparrow` | 네팔 | 대량 |  |  |
| [Termii](/ko/providers/termii) | `termii` | 나이지리아 및 아프리카 | 병렬 |  | ✓ |
| [Sendchamp](/ko/providers/sendchamp) | `sendchamp` | 나이지리아 및 아프리카 | 대량 |  | ✓ |
| [Africa's Talking](/ko/providers/africastalking) | `africastalking` | 아프리카 전역 | 대량 |  | ✓ |
| [BulkSMS](/ko/providers/bulksms) | `bulksms` | 전 세계, 남아프리카에서 특히 강함 | 대량 |  | ✓ |

**대량** 제공업체는 모든 수신자를 요청 하나로 받습니다. **병렬** 제공업체는 요청 하나에 수신자 한 명만 받으며, 패키지가 이 요청들을 [동시에](/ko/guide/performance) 보냅니다.

## 고르는 방법 {#picking-one}

**사용자가 어디에 있는지부터 보세요.** 글로벌 제공업체는 거의 모든 국가에 닿지만, 현지에서는 지역 게이트웨이가 더 저렴하고 안정적인 경우가 많습니다. 나이지리아에서는 [Termii](/ko/providers/termii)와 [Sendchamp](/ko/providers/sendchamp)가 많은 해외 발신자를 막는 DND(수신 거부) 제한을 우회해 전달합니다. 인도에서는 [MSG91](/ko/providers/msg91)이 DLT 등록을 처리해 줍니다. 네팔에서는 [Sparrow SMS](/ko/providers/sparrow)가 두 통신사 모두와 직접 연결되어 있습니다.

**다음으로, 무엇을 보내는지 생각해 보세요.**

- *로그인 코드와 알림 문자*는 저렴한 가격보다 빠르고 확실한 전달이 중요합니다. Twilio, Sinch, Vonage, Infobip이 통신사와 가장 폭넓게 직접 연결되어 있습니다.
- *대규모 공지*에는 모든 수신자에게 요청 한 번으로 보내는 대량 발송 제공업체가 유리합니다. Sinch, Plivo, Infobip, ClickSend, Clickatell이 여기에 해당합니다.
- 고객이 답장하는 *대화형 메시지*라면 [WhatsApp](/ko/providers/whatsapp)이나, 양방향 번호와 전송 상태 웹훅을 갖춘 제공업체가 맞습니다.

**이미 쓰고 있는 서비스도 따져 보세요.** 이미 AWS를 쓰고 있다면 [Amazon SNS](/ko/providers/aws-sns)는 기존 계정으로 청구됩니다. Brevo로 이메일을 보내고 있다면 Brevo의 [SMS](/ko/providers/brevo)도 같은 대시보드에서 관리할 수 있습니다.

::: tip 네트워크 하나에만 의존하지 마세요
어떤 제공업체를 고르든, [페일오버](/ko/guide/failover)로 뒤에 두 번째 제공업체를 붙여 두세요. 장애는 드물지만, 일단 생기면 그때도 로그인 코드는 계속 도착합니다.
:::

## 발신자 ID와 등록 {#sender-ids-and-registration}

요즘은 대부분의 국가에서 애플리케이션이 사람에게 보내는(A2P) SMS를 대량으로 보내려면 사전 등록이 필요합니다.

- **미국:** 10DLC 브랜드 및 캠페인 등록, 또는 인증된 수신자 부담(toll-free) 번호.
- **인도:** 발신자 ID와 모든 메시지 템플릿의 DLT 등록.
- **그 밖의 많은 국가**에서도 영숫자 발신자 ID를 미리 등록해야 합니다.

등록 절차는 제공업체가 안내해 줍니다. 출시 전에 며칠 정도 여유를 두세요.

## 개발과 테스트용 {#for-development-and-tests}

| 드라이버 | 용도 |
|---|---|
| [`log`](/ko/providers/log) | 로컬 개발. 메시지를 실제로 보내지 않고 Laravel 로그에 기록합니다. |
| [`fake`](/ko/guide/testing) | 자동화 테스트. `Sms::fake()`로 어서션을 작성합니다. |
| [`failover`](/ko/guide/failover) | 실제 제공업체를 체인으로 연결해 장애에 대비합니다. |
