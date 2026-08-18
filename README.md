# Clash Verge Rev & FlClash Custom Script

面向 **Clash Verge Rev** 与 **FlClash** 的 Mihomo 自定义覆写脚本。

本项目的核心目标不是把机场订阅或节点写死在配置中，而是：

> **保留当前机场提供的 `proxies` / `proxy-providers`，统一重建代理组、分流规则、Rule Providers、DNS、Sniffer、Hosts 与部分 Mihomo 参数。**

因此，无论使用哪个机场订阅，都可以套用同一套代理组和分流逻辑，无需逐个修改机场原始配置。

> [!IMPORTANT]
> 本仓库仅提供 Mihomo 配置覆写脚本，不提供代理节点、机场订阅、网络接入或相关售卖服务。

---

## 支持客户端

| 客户端 | 脚本 |
| --- | --- |
| Clash Verge Rev | [`Clash-Verge-Rev-mihomoScript.js`](./Clash-Verge-Rev-mihomoScript.js) |
| FlClash | [`FlClash-mihomoScript.js`](./FlClash-mihomoScript.js) |

两个脚本的代理组、分流规则、DNS 与 Rule Provider 架构基本一致，但针对不同客户端分别提供入口与兼容处理。

---

## 项目结构

```text
Clash-Verge-and-FlClash-Custom-Script/
├── Clash-Verge-Rev-mihomoScript.js
├── FlClash-mihomoScript.js
└── README.md
```

### Clash Verge Rev Raw

```text
https://raw.githubusercontent.com/hh1848/Clash-Verge-and-FlClash-Custom-Script/main/Clash-Verge-Rev-mihomoScript.js
```

### FlClash Raw

```text
https://raw.githubusercontent.com/hh1848/Clash-Verge-and-FlClash-Custom-Script/main/FlClash-mihomoScript.js
```

> Raw 地址用于查看、复制或同步脚本源码，不是机场订阅地址。

---

## 核心特性

- **兼容不同机场订阅**：无需在脚本中填写机场 URL，自动使用当前配置已有的 `proxies` / `proxy-providers`。
- **统一代理组**：不同机场切换后仍然使用相同的代理组结构。
- **全球手动置顶**：`全球手动` 始终作为第一个代理组，便于直接手动选择节点。
- **节点自动排序**：内联 `proxies` 按香港 → 台湾 → 新加坡 → 日本 → 韩国 → 美国 → 英国 → 德国 → 法国 → 其他地区排列。
- **地区自动识别**：香港、台湾、新加坡、日本、韩国、美国、欧盟。
- **地区自动测速**：每个主要地区均提供 `url-test` 自动选择。
- **双负载均衡**：支持 `consistent-hashing` 与 `round-robin`。
- **服务独立分流**：AI、GitHub、Google、Microsoft、Apple、Telegram、Twitter/X、Crypto、游戏、Emby、YouTube、Netflix、国际流媒体、新闻媒体等。
- **广告与跟踪拦截**：Tracking、Advertising、AWAvenue Ads。
- **Fake-IP DNS**：国内与国外 DNS 分流，并支持基于 Rule Provider 的 DNS Policy。
- **流量嗅探**：HTTP、TLS、QUIC。
- **TUN 参数补充**：保留客户端现有 TUN 配置，不强制开启 TUN。
- **空配置保护**：没有 `proxies` 或 `proxy-providers` 时直接返回原配置。

---

## 工作原理

```text
机场订阅
   │
   ├── proxies
   │
   └── proxy-providers
          │
          ▼
     自定义覆写脚本
          │
          ├── 保留机场节点
          ├── 重建 proxy-groups
          ├── 重建 rules
          ├── 重建 rule-providers
          ├── 重建 dns
          ├── 重建 sniffer
          ├── 合并 hosts
          └── 补充 Mihomo / TUN 参数
          │
          ▼
      最终 Mihomo 配置
```

需要注意：

> 本项目并不会把多个机场合并成一个机场。

它的作用是让不同机场使用同一套代理组、DNS 和分流结构：

```text
机场 A ─┐
机场 B ─┼─→ 使用相同覆写脚本 → 相同代理组 / DNS / 分流结构
机场 C ─┘
```

切换机场时，使用的是当前机场自己的节点。

---

# Clash Verge Rev 使用方法

## 1. 导入机场订阅

先在 Clash Verge Rev 中正常添加机场订阅，无需修改机场原始订阅文件。

## 2. 打开全局扩展脚本

进入：

```text
Clash Verge Rev
→ 订阅
→ 全局扩展脚本
```

注意：

> 使用的是 **全局扩展脚本（Script）**，不是“全局扩展覆写配置（Merge）”。

## 3. 粘贴脚本

打开：

[`Clash-Verge-Rev-mihomoScript.js`](./Clash-Verge-Rev-mihomoScript.js)

复制全部 JavaScript 代码，粘贴到 Clash Verge Rev 的全局扩展脚本编辑器并保存。

## 4. 刷新订阅

刷新并选择任意机场：

```text
机场订阅
    ↓
Clash Verge Rev 加载原始配置
    ↓
执行全局扩展脚本
    ↓
生成统一代理组 / DNS / 规则
```

以后添加新的机场订阅时，无需再次修改脚本。

### MihomoProPlus 名称保护

Clash Verge Rev 版本入口为：

```javascript
function main(config, profileName)
```

如果 Profile 名称包含：

```text
MihomoProPlus
```

脚本会直接跳过处理，避免对 MihomoProPlus 模板本身再次覆写。

---

# FlClash 使用方法

## 1. 添加机场订阅

先在 FlClash 中正常导入机场配置。

## 2. 创建脚本

进入：

```text
FlClash
→ 工具
→ 进阶配置
→ 脚本
→ 新建
```

将：

[`FlClash-mihomoScript.js`](./FlClash-mihomoScript.js)

中的完整代码复制进去并保存。

## 3. 关联机场配置

将创建好的脚本关联到需要使用的机场配置：

```text
机场 A ─→ FlClash 覆写脚本
机场 B ─→ FlClash 覆写脚本
机场 C ─→ FlClash 覆写脚本
```

这样每个机场都可以使用相同的代理组与规则结构。

### FlClash DNS 注意事项

脚本本身会完整生成 `dns` 配置。

如果 FlClash 同时启用了客户端自己的 **覆写 DNS**，客户端可能再次修改脚本生成的 DNS 配置。

如果希望本脚本中的 DNS 配置完整生效，建议关闭 FlClash 自己的 **覆写 DNS**。

---

# 全球手动

`全球手动` 是整个脚本的第一个代理组，主要用于直接手动选择机场节点。

对于机场直接提供的：

```yaml
proxies:
```

脚本会过滤机场公告、套餐信息等非节点内容，并按以下地区顺序重新排列：

```text
香港
台湾
新加坡
日本
韩国
美国
英国
德国
法国
其他
```

同一地区内部保持机场原来的节点顺序。

例如：

```text
全球手动

香港 01
香港 02
香港 03

台湾 01
台湾 02

新加坡 01
新加坡 02

日本 01
日本 02

美国 01
英国 01
德国 01
其他节点
```

### proxy-providers

如果机场使用：

```yaml
proxy-providers:
```

脚本会通过 `use` 将这些 Provider 加入 `全球手动`。

> 上述国家/地区排序主要针对直接存在于 `config.proxies` 中的节点；`proxy-providers` 内部节点顺序仍由对应 Provider 与 Mihomo 决定。

---

# 代理组架构

当前脚本生成 **54 个代理组**。

## 核心代理组

| 代理组 | 类型 | 用途 |
| --- | --- | --- |
| `全球手动` | `select` | 手动选择当前机场节点 |
| `默认代理` | `select` | 默认代理入口 |
| `故障转移` | `fallback` | 不同地区之间故障切换 |
| `国外流量` | `select` | 通用国外流量 |
| `国内流量` | `select` | 国内流量 |
| `兜底流量` | `select` | 最终 `MATCH` |
| `直接连接` | `select` | `DIRECT` |
| `网络测试` | `select` | Speedtest 等测速服务 |

---

# 服务分流

| 策略组 | 主要用途 |
| --- | --- |
| `人工智能` | ChatGPT、Claude、Gemini 等 AI 服务 |
| `货币平台` | Crypto / 数字资产服务 |
| `游戏平台` | 游戏相关流量 |
| `Github` | GitHub |
| `微软服务` | Microsoft |
| `谷歌服务` | Google |
| `苹果服务` | Apple |
| `电报消息` | Telegram |
| `推特社交` | Twitter / X |
| `社交平台` | 其他国际社交平台 |
| `Emby服` | Emby |
| `油管视频` | YouTube |
| `奈飞视频` | Netflix |
| `国际媒体` | 国际流媒体 |
| `新闻媒体` | 国际新闻媒体 |
| `抖快书定位` | 抖音 / 快手 / 小红书定位相关流量 |
| `UKwifi` | WiFi Calling |

其中：

- `人工智能` 默认优先提供 `美国策略`；
- `货币平台` 默认优先提供 `狮城策略`；
- 其他服务可以在默认代理、故障转移、地区策略、全球手动与直接连接之间切换。

---

# 地区策略

脚本自动识别：

```text
香港
台湾
新加坡
日本
韩国
美国
欧盟
```

节点名称可以通过中文名称、国家/地区旗帜、英文缩写和机场代码识别。

### 香港

```text
香港 / 港 / 🇭🇰 / HK / Hong / HKG
```

### 台湾

```text
台湾 / 台灣 / 🇹🇼 / TW / Taiwan / TPE / TSA / KHH
```

### 新加坡

```text
新加坡 / 狮城 / 🇸🇬 / SG / Singapore / SIN / XSP
```

### 日本

```text
日本 / 🇯🇵 / JP / Japan / NRT / HND / KIX / CTS / FUK
```

### 韩国

```text
韩国 / 韓國 / 首尔 / 🇰🇷 / KR / KOR / Korea
```

### 美国

```text
美国 / 🇺🇸 / US / USA / LAX / SFO / JFK / SJC / SEA / IAD / ORD / ATL / DFW / MIA
```

其他没有被主要地区规则识别的节点会进入：

```text
冷门自选
```

---

# 自动测速与负载均衡

每个主要地区都提供：

```text
地区策略
├── 自动测速
├── 一致性散列
├── 轮询
└── 具体节点
```

例如：

```text
香港策略
├── 香港自动
├── 香港均衡-散列
├── 香港均衡-轮询
└── 香港节点
```

## 自动测速

```yaml
type: url-test
url: https://www.google.com/generate_204
interval: 200
lazy: true
```

## 一致性散列

```yaml
type: load-balance
strategy: consistent-hashing
```

适合希望同一目标尽量维持在相同节点上的场景。

## 轮询

```yaml
type: load-balance
strategy: round-robin
```

用于在同地区多个节点之间轮换连接。

---

# DNS

脚本会重建 Mihomo DNS，并启用 Fake-IP。

```yaml
enable: true
ipv6: true
enhanced-mode: fake-ip
fake-ip-range: 198.18.0.1/16
use-hosts: true
respect-rules: true
```

## Bootstrap DNS

```text
tls://223.5.5.5
tls://223.6.6.6
```

## 国外 DNS

```text
https://cloudflare-dns.com/dns-query
https://dns.google/dns-query
```

## 国内 / 直连 DNS

```text
https://dns.alidns.com/dns-query
https://doh.pub/dns-query
```

## DNS Policy

国内规则：

```text
Direct
Private
China
```

优先使用国内 DoH。

国外服务：

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

广告规则：

```text
Advertising
AWAvenueAds
```

返回：

```text
rcode://success
```

---

# Fake-IP Filter

以下类型会绕过 Fake-IP：

```text
LAN / Local
NTP / Time
Xiaomi
3GPP / WiFi Calling
Apple Push
Bing
Direct
Private
China
```

用于减少局域网、时间同步、推送与部分系统服务受到 Fake-IP 影响的情况。

---

# TUN

脚本不会强制：

```yaml
tun:
  enable: true
```

而是在客户端已有 `tun` 配置基础上补充：

```yaml
stack: mixed

dns-hijack:
  - any:53
  - tcp://any:53

auto-route: true
auto-redirect: true
auto-detect-interface: true
```

因此是否开启 TUN 仍由 Clash Verge Rev / FlClash 自己的客户端设置决定。

---

# Mihomo 基础参数

脚本设置：

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

用于保存代理组选择以及 Fake-IP 状态。

---

# Sniffer

脚本开启 Mihomo 流量嗅探。

### HTTP

```text
80
8080-8880
```

并启用：

```yaml
override-destination: true
```

### TLS

```text
443
8443
```

### QUIC

```text
443
8443
```

跳过：

```text
Mijia Cloud
+.push.apple.com
```

---

# QUIC

分流规则中包含：

```text
AND,((DST-PORT,443),(NETWORK,UDP)),REJECT
```

因此会阻止 UDP 443。

> **HTTP/3 / QUIC 默认被禁用，相关连接通常会回落到 TCP / HTTP/2。**

如果某些应用必须依赖 QUIC，请自行删除或修改这条规则。

---

# 分流规则

当前脚本包含 **44 条主规则**，总体顺序为：

```text
广告 / Tracking
        ↓
阻止 UDP 443 / QUIC
        ↓
WiFi Calling
        ↓
抖快书定位
        ↓
Private / Direct
        ↓
下载 / Apple CN
        ↓
AI
        ↓
Speedtest
        ↓
Twitter / Telegram / Social Media
        ↓
News
        ↓
Games / Crypto
        ↓
Emby / Netflix / YouTube / Streaming
        ↓
Apple / Google / GitHub / Microsoft
        ↓
Proxy
        ↓
China
        ↓
IP Rules
        ↓
MATCH
```

最终：

```text
MATCH,兜底流量
```

---

# Rule Providers

规则主要来自：

- [666OS/rules](https://github.com/666OS/rules)
- [AWAvenue Ads Rule](https://github.com/TG-Twilight/AWAvenue-Ads-Rule)
- [HenryChiao/wificalling](https://github.com/HenryChiao/wificalling)
- Kelee GitHub Rule

主要覆盖：

```text
Tracking
Advertising
Direct
Private
Download
Speedtest
AI
Telegram
Twitter
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
China
```

以及对应的部分 IP CIDR 规则。

Rule Provider 默认每天更新一次：

```yaml
interval: 86400
```

GitHub 独立规则：

```yaml
interval: 3600
```

---

# Hosts

脚本会在原有 Hosts 基础上追加：

```text
miwifi.com
epdg.epc.mnc010.mcc234.pub.3gppnetwork.org
services.googleapis.cn
cn.bing.com
```

原机场已有的其他 Hosts 不会被直接清空，而是通过 `Object.assign()` 合并。

---

# 机场公告节点过滤

很多机场会把以下内容伪装成节点：

```text
剩余流量
套餐到期
官方网站
客服
公告
订阅信息
邮箱
频道
教程
版本
```

`全球手动` 会过滤包含常见公告关键词的条目，尽可能只显示实际代理节点。

---

# 兼容性说明

脚本要求使用 **Mihomo 内核**。

不建议用于旧版 Clash Premium 或不支持 Mihomo 扩展字段的客户端。

脚本使用了以下 Mihomo 功能：

```text
Rule Providers
MRS
include-all
filter
empty-fallback
load-balance
consistent-hashing
round-robin
Fake-IP
respect-rules
Sniffer
TUN
```

---

# 外部依赖

本项目本身不内置 Rule Provider 数据。

首次加载或规则更新时，Mihomo 需要访问 GitHub 或其他规则源下载：

```text
.mrs
.yaml
.list
```

如果对应规则源暂时无法访问，相关 Rule Provider 可能加载失败。

代理组图标同样来自第三方公开资源。

---

# 常见问题

## 1. 可以同时添加多个机场吗？

可以。

每个机场都可以套用本项目的统一代理组与规则，但脚本不会自动把多个机场的节点合并到同一个配置。

## 2. 切换机场需要重新修改脚本吗？

### Clash Verge Rev

不需要。使用全局扩展脚本后，切换其他机场会自动重新执行。

### FlClash

需要确保对应机场已经关联此覆写脚本。

## 3. 为什么全球手动排在第一位？

这是脚本刻意设计的，方便进入代理页面后直接选择具体节点。

## 4. 为什么有些机场节点没有按国家排序？

国家排序主要针对：

```yaml
proxies:
```

如果机场大量使用：

```yaml
proxy-providers:
```

Provider 内部节点排序可能由 Provider 自身决定。

## 5. 为什么打不开某些使用 HTTP/3 的网站？

脚本默认阻止 UDP 443，因此 QUIC / HTTP/3 会被禁用。绝大多数网站会自动回落到 TCP，但少数服务可能受到影响。

## 6. 为什么 FlClash 的 DNS 和脚本里不一样？

检查 FlClash 是否开启了 **覆写 DNS**。如果客户端再次覆盖 DNS，脚本生成的 `dns` 配置可能不会完整保留。

## 7. 开启脚本后还需要打开 TUN 吗？

脚本不会替你决定是否启用 TUN。是否开启 TUN 仍由客户端控制，脚本只负责补充 TUN 参数。

---

# 更新方式

仓库脚本更新后，可以重新复制对应文件内容覆盖客户端中的旧脚本。

Clash Verge Rev：

```text
Clash-Verge-Rev-mihomoScript.js
```

FlClash：

```text
FlClash-mihomoScript.js
```

建议脚本更新后重新刷新一次机场订阅，使配置重新生成。

---

# 致谢

本项目的部分设计、规则与资源参考或使用了以下开源项目：

- [Mihomo](https://github.com/MetaCubeX/mihomo)
- [666OS/rules](https://github.com/666OS/rules)
- [Koolson/Qure](https://github.com/Koolson/Qure)
- [AWAvenue Ads Rule](https://github.com/TG-Twilight/AWAvenue-Ads-Rule)
- [HenryChiao/wificalling](https://github.com/HenryChiao/wificalling)

感谢相关项目维护者。

---

# Disclaimer

本项目仅用于 Mihomo 配置研究、学习与个人网络配置管理。

使用者应自行确保：

- 遵守所在国家或地区的法律法规；
- 遵守网络服务提供商及相关平台的服务条款；
- 对第三方 Rule Provider 的可用性与安全性自行判断；
- 对配置修改造成的网络异常自行承担责任。

本项目不提供任何代理节点、机场订阅或相关网络服务。
