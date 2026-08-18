# Clash Verge Custom Script

面向 **Clash Verge Rev / Mihomo** 的全局扩展脚本。

当前版本基于 `MihomoProPlus` 配置思路重构，目标不是把多个机场写死在脚本里，而是：

> **保留当前订阅提供的节点或 `proxy-providers`，统一覆盖代理组、分流规则、Rule Provider、DNS、Sniffer、Hosts 与部分 TUN 参数。**

这样以后在 Clash Verge Rev 中导入新的机场订阅，只要启用本脚本，就会自动生成同一套代理组与分流结构，无需逐个修改机场配置。

> [!IMPORTANT]
> 本仓库仅提供 Mihomo / Clash Verge Rev 配置脚本，不提供代理节点、机场订阅、网络接入或相关售卖服务。

---

## 核心特性

- **适配多个机场订阅**：不需要在脚本中填写机场 URL，直接使用当前订阅中的 `proxies` / `proxy-providers`。
- **全局统一代理组**：不同机场导入后自动得到相同的代理组结构。
- **全球手动置顶**：`全球手动` 位于代理页面第一项，可直接选择当前机场的全部有效节点。
- **地区自动识别**：香港、台湾、新加坡、日本、韩国、美国、欧盟自动分类。
- **自动测速**：每个主要地区均生成 `url-test` 自动选择组。
- **两种负载均衡**：每个主要地区均提供 `consistent-hashing` 与 `round-robin`。
- **应用级分流**：AI、GitHub、Google、Microsoft、Apple、Telegram、Twitter、Crypto、游戏、Emby、YouTube、Netflix 等独立策略组。
- **广告与跟踪拦截**：整合 Tracking、Advertising 与 AWAvenue Ads 规则。
- **Fake-IP DNS**：区分国内直连 DNS 与国外 DoH，并根据规则集分配解析策略。
- **TUN 参数补充**：保留 Clash Verge 当前 TUN 配置，只补充 `mixed` 栈、DNS 劫持、自动路由等参数。
- **不接管 Clash Verge 端口**：不会强制覆盖 `mixed-port`、`external-controller`、`secret`、`listeners` 等由 Clash Verge 管理的配置。

---

## 文件

```text
Clash-Verge-Custom-Script/
├── mihomoScript.js    # Clash Verge Rev 全局扩展脚本
└── README.md
```

主脚本：[`mihomoScript.js`](./mihomoScript.js)

Raw 地址：

```text
https://raw.githubusercontent.com/hh1848/Clash-Verge-Custom-Script/main/mihomoScript.js
```

> Raw 地址用于获取/同步脚本源码。Clash Verge Rev 的“全局扩展脚本”编辑器中应粘贴 JavaScript 代码本身，而不是把 Raw 地址当成机场订阅链接。

---

## 使用方法

### 1. 导入机场订阅

先在 Clash Verge Rev 的 **订阅** 页面正常导入你的机场订阅。

可以同时保存多个机场，例如：

```text
机场 A
机场 B
机场 C
机场 D
```

本脚本不要求提前知道机场名称，也不需要手动填写每个机场的订阅 URL。

### 2. 打开全局扩展脚本

进入：

```text
Clash Verge Rev
→ 订阅
→ 全局扩展脚本（Script）
```

注意是 **全局扩展脚本**，不是“全局扩展覆写配置 / Merge”。

### 3. 粘贴脚本

打开 [`mihomoScript.js`](./mihomoScript.js)，复制完整代码，粘贴到 Clash Verge Rev 的全局扩展脚本编辑器并保存。

### 4. 刷新并选择机场

回到订阅页面：

1. 刷新机场订阅；
2. 点击该订阅使其成为当前配置；
3. 打开 **代理** 页面。

只要机场配置中存在有效 `proxies` 或 `proxy-providers`，脚本就会自动套用统一配置。

以后新增机场时仍然是：

```text
粘贴机场订阅链接
        ↓
导入 Clash Verge Rev
        ↓
选择该机场
        ↓
全局扩展脚本自动执行
        ↓
生成统一代理组 / DNS / 规则
```

无需再次修改脚本。

---

## 脚本处理逻辑

脚本的核心入口：

```javascript
function main(config, profileName) {
  // ...
  return config;
}
```

执行时遵循以下逻辑：

```text
当前机场订阅
│
├─ proxies                  ┐
└─ proxy-providers          ┘ 保留
        │
        ▼
全局扩展脚本
        │
        ├─ 重建 proxy-groups
        ├─ 重建 rules
        ├─ 重建 rule-providers
        ├─ 重建 dns
        ├─ 重建 sniffer
        ├─ 合并 hosts
        └─ 补充 tun / profile / experimental 参数
        │
        ▼
最终 Mihomo 配置
```

### 空订阅保护

如果当前配置既没有 `proxies`，也没有 `proxy-providers`，脚本直接返回原配置，不进行覆盖。

### MihomoProPlus 名称保护

如果 Profile 名称中包含：

```text
MihomoProPlus
```

脚本会跳过处理，避免对原始模板再次套用全局覆写。

---

## 代理组架构

当前脚本生成 **54 个代理组**。

### 主要代理组

| 代理组 | 类型 | 说明 |
| --- | --- | --- |
| `全球手动` | `select` | 位于第一项，直接显示当前订阅的全部有效节点 |
| `默认代理` | `select` | 常规代理入口 |
| `故障转移` | `fallback` | 地区策略之间自动故障切换 |
| `国外流量` | `select` | 通用国外流量 |
| `国内流量` | `select` | 国内规则流量，默认可直连 |
| `兜底流量` | `select` | 最终 `MATCH` 兜底 |
| `直接连接` | `select` | 包含 `DIRECT`，默认隐藏 |
| `网络测试` | `select` | Speedtest 等测速流量 |

`全球手动` 使用 `include-all: true`，因此可以直接聚合当前配置中的节点与代理提供者。

---

## 应用与服务分流

脚本提供以下独立策略组：

| 策略组 | 主要用途 |
| --- | --- |
| `人工智能` | AI / 大模型相关服务 |
| `货币平台` | Crypto / 数字资产相关服务 |
| `游戏平台` | 游戏相关规则 |
| `Github` | GitHub |
| `微软服务` | Microsoft |
| `谷歌服务` | Google |
| `苹果服务` | Apple |
| `电报消息` | Telegram |
| `推特社交` | Twitter / X |
| `社交平台` | 其他社交媒体 |
| `Emby服` | Emby |
| `油管视频` | YouTube |
| `奈飞视频` | Netflix |
| `国际媒体` | Streaming / 国际流媒体 |
| `新闻媒体` | 新闻媒体 |
| `抖快书定位` | 抖音 / 快手 / 小红书等定位类分流 |
| `UKwifi` | WiFi Calling 相关规则 |

其中：

- `人工智能` 默认优先从美国策略开始选择；
- `货币平台` 默认优先从新加坡策略开始选择；
- 其他大多数国外服务可在默认代理、故障转移、各地区策略、全球手动和直连之间选择。

---

## 地区策略

脚本自动识别以下地区：

```text
香港
台湾
新加坡（狮城）
日本
韩国
美国
欧盟
```

节点识别依据节点名称中的中文地区名、国旗、常见英文缩写和部分机场代码，例如：

```text
香港：港 / 🇭🇰 / HK / Hong / HKG
日本：日 / 🇯🇵 / JP / Japan / NRT / HND / KIX
美国：美 / 🇺🇸 / US / USA / LAX / SFO / JFK
新加坡：坡 / 🇸🇬 / SG / Sing / SIN
韩国：韩 / 🇰🇷 / KR / KOR / Korea
台湾：台 / 🇹🇼 / TW / TPE / TSA / KHH
欧盟：欧洲国家名称、国旗以及 FRA / AMS / MAD / FCO / MUC 等
```

没有被这些主要地区规则匹配的节点会进入：

```text
冷门自选
```

---

## 地区自动选择与负载均衡

每个主要地区都会自动生成 4 个层级：

以香港为例：

```text
香港策略
├── 香港自动
├── 香港均衡-散列
├── 香港均衡-轮询
└── 香港具体节点...
```

### 自动测速

自动组使用：

```yaml
type: url-test
url: https://www.google.com/generate_204
interval: 200
lazy: true
```

### 一致性散列

```yaml
type: load-balance
strategy: consistent-hashing
```

适合希望同一目标尽量保持在同一节点的场景。

### 轮询

```yaml
type: load-balance
strategy: round-robin
```

用于在匹配地区的多个节点之间轮换请求。

地区没有匹配节点时使用：

```yaml
empty-fallback: COMPATIBLE
```

避免空代理组直接导致配置不可用。

---

## DNS

脚本会重建 DNS 配置，并使用 Fake-IP：

```yaml
dns:
  enable: true
  ipv6: true
  enhanced-mode: fake-ip
  fake-ip-range: 198.18.0.1/16
  use-hosts: true
  respect-rules: true
```

### Bootstrap DNS

```text
tls://223.5.5.5
tls://223.6.6.6
```

### 国外 DoH

```text
https://cloudflare-dns.com/dns-query
https://dns.google/dns-query
```

### 国内 / 直连 DoH

```text
https://dns.alidns.com/dns-query
https://doh.pub/dns-query
```

### DNS 分流

国内规则：

```text
Direct
Private
China
```

优先使用国内 DoH。

国外服务规则：

```text
Speedtest
Twitter
Telegram
SocialMedia
NewsMedia
Games
Crypto
Emby
Netflix
YouTube
Streaming
Apple
Google
Microsoft
Proxy
```

优先使用 Google / Cloudflare DoH。

广告域名规则：

```text
Advertising
AWAvenueAds
```

直接返回：

```text
rcode://success
```

---

## TUN 与基础 Mihomo 参数

脚本不会强制控制 Clash Verge Rev 界面中的 TUN 开关，但会在现有 `tun` 配置上补充：

```yaml
stack: mixed
dns-hijack:
  - any:53
  - tcp://any:53
auto-route: true
auto-redirect: true
auto-detect-interface: true
```

因此：

- 是否开启 TUN 仍由 Clash Verge Rev 界面控制；
- 脚本不会强制修改 `tun.enable`；
- 如果开启 TUN，上述参数会参与最终配置。

其他基础设置包括：

```yaml
mode: rule
ipv6: true
unified-delay: true
tcp-concurrent: true
find-process-mode: always
keep-alive-interval: 15
keep-alive-idle: 600
```

同时启用：

```yaml
profile:
  store-selected: true
  store-fake-ip: true
```

策略组选择因此可以被 Mihomo 持久化保存。

---

## Sniffer

启用 HTTP / TLS / QUIC 流量嗅探：

```text
HTTP : 80, 8080-8880
TLS  : 443, 8443
QUIC : 443, 8443
```

HTTP 会开启：

```yaml
override-destination: true
```

跳过：

```text
Mijia Cloud
+.push.apple.com
```

---

## 分流规则

脚本当前重建 **44 条主规则**，总体顺序为：

```text
广告 / Tracking
        ↓
阻止 UDP 443 / QUIC
        ↓
WiFi Calling / 定位
        ↓
Private / Direct / Download
        ↓
AI / Speedtest
        ↓
Telegram / Twitter / Social Media
        ↓
游戏 / Crypto
        ↓
Emby / Netflix / YouTube / Streaming
        ↓
Apple / Google / GitHub / Microsoft
        ↓
Proxy / China
        ↓
IP Rule Set
        ↓
MATCH → 兜底流量
```

其中包含：

```yaml
AND,((DST-PORT,443),(NETWORK,UDP)),REJECT
```

即默认拒绝 UDP 443，以避免 QUIC 绕过预期的 TCP 代理路径。

---

## Rule Provider

当前脚本定义 **42 个 Rule Provider**。

主要来源包括：

### 666OS/rules

用于大多数 Domain / IP 规则，包括：

```text
Tracking
Advertising
Direct
Private
AI
Telegram
Twitter
SocialMedia
NewsMedia
Games
Crypto
Netflix
YouTube
Emby
Streaming
Apple
Google
Microsoft
Proxy
China
...
```

Domain 与 IP 规则主要使用 Mihomo `mrs` 格式。

### HenryChiao/wificalling

用于：

```text
UKwifi
```

### AWAvenue Ads Rule

用于额外广告域名拦截：

```text
AWAvenueAds
```

### Kelee GitHub Rule

用于独立的：

```text
Github
```

分流规则。

---

## 不会覆盖的配置

为了避免与 Clash Verge Rev 自身管理逻辑冲突，脚本不会主动写死以下配置：

```text
mixed-port
port
socks-port
redir-port
external-controller
secret
authentication
listeners
```

这类参数继续交给 Clash Verge Rev 管理。

同时脚本会：

- **保留原订阅的 `proxies`**；
- **保留原订阅的 `proxy-providers`**；
- 合并现有 `hosts`；
- 合并现有 `tun` 的其他字段；
- 合并现有 `experimental` 与 `profile` 中未被脚本指定的字段。

---

## 多机场使用方式

本项目最适合这种场景：

```text
Clash Verge Rev
│
├── 机场 A
├── 机场 B
├── 机场 C
├── 机场 D
│
└── 全局扩展脚本
    └── mihomoScript.js
```

切换到不同机场时：

```text
机场节点发生变化
        ↓
脚本逻辑保持不变
        ↓
代理组名称保持一致
        ↓
规则 / DNS / 分流保持一致
```

因此无需维护：

```text
机场 A 专用脚本
机场 B 专用脚本
机场 C 专用脚本
```

只维护这一份全局脚本即可。

---

## 常见问题

### 1. 导入机场后为什么没有生成代理组？

脚本要求当前配置至少存在以下之一：

```text
proxies
proxy-providers
```

如果机场返回的并不是 Mihomo / Clash 可识别配置，需要先通过机场自身提供的 Clash / Mihomo 订阅格式导入。

### 2. 为什么某个地区策略没有节点？

地区策略依赖节点名称匹配。

例如机场把香港节点命名为完全不包含 `香港 / 港 / HK / HKG` 的自定义名称，就可能无法识别。

可自行修改脚本中的：

```javascript
FilterHK
FilterSG
FilterJP
FilterKR
FilterUS
FilterTW
FilterEU
```

### 3. 为什么机场自己的代理组消失了？

这是预期行为。

脚本会保留机场节点，但重建：

```text
proxy-groups
rules
rule-providers
dns
```

目的就是让不同机场统一使用同一套代理组和分流逻辑。

### 4. 为什么 `全球手动` 在最上面？

这是当前脚本的设计。

`全球手动` 被放在 `proxy-groups` 第一项，方便切换机场后直接选择具体节点。

### 5. TUN 会被脚本自动打开吗？

不会。

脚本只补充 TUN 参数，不写入：

```yaml
enable: true
```

TUN 是否启用由 Clash Verge Rev 的界面设置决定。

### 6. 为什么无法使用 HTTP/3 / QUIC？

脚本明确包含：

```yaml
AND,((DST-PORT,443),(NETWORK,UDP)),REJECT
```

因此 UDP 443 会被拒绝。如果你需要 QUIC / HTTP/3，需要自行调整该规则。

---

## 配置来源与致谢

当前脚本的代理组和分流设计参考 / 使用了以下项目或资源：

- [HenryChiao/MIHOMO_YAMLS](https://github.com/HenryChiao/MIHOMO_YAMLS)
- [666OS/rules](https://github.com/666OS/rules)
- [HenryChiao/wificalling](https://github.com/HenryChiao/wificalling)
- [TG-Twilight/AWAvenue-Ads-Rule](https://github.com/TG-Twilight/AWAvenue-Ads-Rule)
- [Koolson/Qure](https://github.com/Koolson/Qure) — 策略组图标
- [Orz-3/mini](https://github.com/Orz-3/mini) — 部分图标
- `rule.kelee.one` — GitHub 分流规则

第三方规则、图标和数据由对应项目维护，本仓库只负责组合与配置逻辑。

---

## 更新

脚本更新后，只需要重新复制最新的 [`mihomoScript.js`](./mihomoScript.js) 到 Clash Verge Rev 的全局扩展脚本中并保存即可。

Raw：

```text
https://raw.githubusercontent.com/hh1848/Clash-Verge-Custom-Script/main/mihomoScript.js
```

如果机场订阅本身更新，只需要在 Clash Verge Rev 中正常刷新该机场，无需修改本脚本。
