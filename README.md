# Clash-Verge-Custom-Script

一个面向 **Clash Verge Rev / Mihomo** 的全量配置覆写脚本。

本项目基于 [AIsouler/MyClash](https://github.com/AIsouler/MyClash) 的 `mihomoScript.js` 进行定制，重点优化了 Clash Verge Rev 下的代理组组织、地区节点识别、全局模式节点选择、Crypto 直连能力以及本机安全默认值，目标是提供一份 **开箱即用、结构清晰、便于继续维护** 的 Mihomo 配置脚本。

> 本仓库只提供配置覆写脚本，不提供任何代理节点、订阅服务或网络接入服务。

---

## 功能概览

### 1. 完整的应用分流代理组

脚本会自动生成常用服务代理组：

| 代理组 | 用途 |
|---|---|
| `AI` | AI / 大模型相关服务 |
| `Media` | YouTube、Instagram、Netflix、HBO、Twitch、Disney+、BBC、Pornhub 等 |
| `FCM` | Google Firebase Cloud Messaging |
| `Google` | Google 域名与 IP |
| `Microsoft` | Microsoft；GitHub 规则归入默认代理 |
| `Apple` | Apple 服务 |
| `Telegram` | Telegram 域名与 IP |
| `Steam` | Steam |
| `TikTok` | TikTok |
| `Twitter` | Twitter / X |
| `Emby` | Emby 及相关客户端 |
| `PikPak` | PikPak |
| `Spotify` | Spotify |
| `Crypto` | 加密货币相关网站与服务，可手动选择 `直连` |
| `EHentai` | EHentai |
| `AdBlock` | 广告拦截，可选 `REJECT` / `REJECT-DROP` / `PASS` |

其中部分策略组设置了默认选择：

- `AI` → 美国
- `Media` → 日本
- `FCM` → 直连
- `TikTok` → 日本
- `Crypto` → 日本
- `EHentai` → 美国

其余策略组可以在 Clash Verge Rev 中自由选择默认代理、基础代理组、地区代理组以及允许的直连选项。

---

## 2. 自动地区节点分组

脚本会根据节点名称自动识别地区，并生成独立的地区策略组：

- 🇭🇰 香港
- 🇯🇵 日本
- 🇺🇸 美国
- 🇸🇬 新加坡
- 🇰🇷 韩国
- 🇹🇼 台湾省
- 低倍率节点
- 其他节点

每个正常地区组默认采用两层结构：

```text
日本
├─ 日本-自动选择
├─ 🇯🇵 日本节点 01
├─ 🇯🇵 日本节点 02
└─ ...
```

这样既可以：

- 让 Mihomo 自动选择该地区延迟较低的节点；
- 也可以手动指定某个具体节点。

节点名称没有国旗时，脚本会根据地区识别结果自动补充对应的 Emoji 国旗，方便在 Clash Verge Rev 中快速识别。

---

## 3. 基础代理组

默认提供三个基础策略组：

```text
手动选择
自动选择
负载均衡
```

### 手动选择

包含脚本过滤后的全部可用机场节点，可直接指定具体节点。

### 自动选择

使用 `url-test` 自动测试节点，当前默认：

```yaml
interval: 600
timeout: 3000
url: https://g.cn/generate_204
tolerance: 50
```

### 负载均衡

使用 Mihomo `load-balance`：

```yaml
strategy: sticky-sessions
```

适合希望多个节点共同承担连接的场景。

---

## 4. 更实用的 GLOBAL 全局模式

本项目对 `GLOBAL` 策略组进行了定制。

普通配置经常只把其他代理组塞进 `GLOBAL`，导致 Clash Verge Rev 首页进入全局模式后无法直接选择某个具体节点。

本项目的 `GLOBAL` 同时包含：

```text
GLOBAL
├─ 手动选择
├─ 自动选择
├─ 负载均衡
├─ 香港
├─ 日本
├─ 美国
├─ 新加坡
├─ 韩国
├─ 台湾省
├─ 低倍率节点
├─ 其他节点
├─ 🇭🇰 香港具体节点
├─ 🇯🇵 日本具体节点
├─ 🇺🇸 美国具体节点
├─ 🇰🇷 韩国具体节点
├─ ...
└─ 🇨🇳 直连 | 双栈
```

因此在 Clash Verge Rev 的 **全局模式** 下既可以选择地区/自动选择组，也可以直接选择某个具体机场节点。

三种代理模式的定位比较清晰：

```text
规则模式 → 按 AI / Media / Google / Crypto 等规则自动分流
全局模式 → 所有代理流量使用 GLOBAL 中选定的代理组或具体节点
直连模式 → 不使用代理
```

---

## 5. 多种直连模式

脚本内置 5 个 Mihomo `DIRECT` 节点：

```text
🇨🇳 直连 | 双栈
🇨🇳 直连 | IPv4优先
🇨🇳 直连 | IPv6优先
🇨🇳 直连 | 仅IPv4
🇨🇳 直连 | 仅IPv6
```

并统一通过 `直连` 策略组进行管理。

部分应用分流组允许直接选择 `直连`，例如：

```text
FCM
Microsoft
Apple
Steam
Emby
PikPak
Spotify
Crypto
```

---

## 6. DNS 与 Fake-IP

脚本会重建 Mihomo DNS 配置，主要包括：

- 启用 IPv4 / IPv6 DNS；
- 使用 `fake-ip` 增强模式；
- IPv4 Fake-IP 网段：`198.18.0.1/15`；
- IPv6 Fake-IP 网段：`2001:2::1/48`；
- 国内域名使用国内 DNS；
- 国外 DNS 默认通过 `默认代理` 查询；
- 支持机场配置中的私有 DNS / `hosts` 信息；
- 自动处理代理服务器域名对应的 DNS 策略；
- 使用 `fakeip-filter` 规则集避免不适合 Fake-IP 的域名被错误处理。

默认国内 DNS：

```text
223.5.5.5
119.29.29.29
```

默认国外 DoH：

```text
Cloudflare DNS
Google DNS
```

---

## 7. TUN 模式

脚本默认启用 Mihomo TUN：

```yaml
tun:
  enable: true
  stack: system
  auto-route: true
  strict-route: true
  auto-redirect: true
  auto-detect-interface: true
  dns-hijack:
    - any:53
    - tcp://any:53
```

适合 Clash Verge Rev 的虚拟网卡模式。

---

## 8. 本机安全默认值

本项目默认不向局域网开放 Clash/Mihomo 代理端口：

```yaml
allow-lan: false
bind-address: 127.0.0.1
external-controller: 127.0.0.1:9090
```

也就是说：

- 本机应用可以正常使用代理；
- 同一局域网中的其他设备无法直接连接你的代理端口；
- Mihomo External Controller 只监听本机。

如果你确实需要让手机、平板或其他局域网设备连接电脑代理，需要自行修改这部分配置。

---

## 9. 节点过滤与名称规范化

脚本会自动处理机场订阅中的节点：

- 排除 `DIRECT`、`REJECT` 等非代理节点；
- 过滤机场公告、流量信息、到期提示、客服信息等伪节点；
- 去除重复节点名称；
- 根据地区自动补全 Emoji 国旗；
- 修正节点重命名后可能失效的 `dialer-proxy` 引用；
- 可选择过滤高倍率节点；
- 可选择过滤非地区节点；
- 自动生成低倍率节点组和其他节点组。

---

## 10. Rule Provider

规则主要使用 Mihomo `.mrs` 格式，并按需加载。

主要来源包括：

- `MetaCubeX/meta-rules-dat`
- `wwqgtxx/clash-rules`
- `217heidai/adblockfilters`
- `666OS/rules`
- `binaryu/emos-proxy-rule`

脚本只会把当前启用的功能对应 Rule Provider 写入最终配置。

`屏蔽国外QUIC` 默认关闭，因此与该功能相关的额外 `cn_additional` 规则源默认不会进入最终生成配置。

---

# 安装方法

## 方法一：直接复制脚本

打开本仓库中的：

```text
mihomoScript.js
```

复制完整代码。

在 Clash Verge Rev 中找到订阅使用的 **扩展脚本 / 全局扩展覆写脚本** 入口，将代码粘贴并保存，然后重新更新订阅。

> Clash Verge Rev 不同版本的菜单名称可能略有不同，核心要求是让该 JavaScript 作为订阅配置的 Mihomo 覆写脚本执行。

---

## 方法二：使用 GitHub Raw

脚本 Raw 地址：

```text
https://raw.githubusercontent.com/hh1848/Clash-Verge-Custom-Script/main/mihomoScript.js
```

可以用于需要远程脚本 URL 的场景。

---

# 推荐使用方式

日常使用建议保持：

```text
代理模式：规则
```

然后分别设置：

```text
默认代理
AI
Media
Google
Microsoft
Apple
Telegram
Steam
TikTok
Twitter
Emby
PikPak
Spotify
Crypto
...
```

如果临时需要让所有流量使用同一个节点：

```text
代理模式 → 全局
```

然后直接在 `GLOBAL` 中选择地区组或具体节点。

---

# 可配置选项

脚本顶部的 `ruleOptionsEnable` 可以控制主要功能：

```javascript
const ruleOptionsEnable = {
  手动选择: true,
  自动选择: true,
  负载均衡: true,

  AI: true,
  Media: true,
  FCM: true,
  Google: true,
  Microsoft: true,
  Apple: true,
  Telegram: true,
  Steam: true,
  TikTok: true,
  Twitter: true,
  Emby: true,
  PikPak: true,
  Spotify: true,
  Crypto: true,
  EHentai: true,
  AdBlock: true,

  生成地区自动选择组: true,
  隐藏地区手动选择组: false,
  生成倍率组: true,
  分流组添加所有节点: false,
  过滤高倍率节点: false,
  过滤非地区节点: true,
  屏蔽国外QUIC: false,
  代理IPV4优先: false,
  代理IPV6优先: false,
  链式代理: false,
};
```

一般用户保持默认即可。

---

# 自定义节点与链式代理

脚本预留：

```javascript
const customizeProxies = [];
```

可以加入自己的 Mihomo 节点。

如果启用：

```javascript
链式代理: true
```

脚本会创建链式代理相关策略组，并使用自定义节点作为落地节点。

如果没有配置自定义节点却直接打开链式代理，脚本会主动报错，避免生成无效配置。

---

# 注意事项

1. **本项目不是机场订阅。**  
   你仍然需要一个能够正常提供 Mihomo/Clash 节点的订阅配置。

2. **脚本会重建配置。**  
   包括 DNS、TUN、代理组、规则和部分 Mihomo 通用设置，而不是简单追加几条规则。

3. **默认端口为 `7890`。**  
   如果你的环境必须固定使用其他 mixed-port，需要自行修改。

4. **默认禁止 LAN 访问。**  
   `allow-lan: false` 是本项目有意设置的安全默认值。

5. **TUN 默认开启。**  
   如果不使用虚拟网卡模式，需要自行调整脚本中的 `tun.enable`。

6. **地区识别依赖节点名称。**  
   如果你的机场使用非常特殊的命名方式，可以修改 `regionDefinitions` 中对应正则。

7. **规则源属于第三方资源。**  
   规则、图标和其他外部资源的可用性取决于各自上游项目。

---

# 效果预览

当前脚本在 Clash Verge Rev 中会形成清晰的分流层级：

```text
默认代理
手动选择
自动选择
负载均衡

AI
Media
FCM
Google
Microsoft
Apple
Telegram
Steam
TikTok
Twitter
Emby
PikPak
Spotify
Crypto
EHentai
AdBlock

香港
日本
美国
新加坡
韩国
台湾省
低倍率节点
其他节点
```

建议在仓库中建立：

```text
docs/images/
```

并把项目截图保存为：

```text
docs/images/proxy-groups-1.png
docs/images/proxy-groups-2.png
docs/images/region-groups.png
docs/images/home.png
```

然后在本节加入：

```markdown
![应用分流](docs/images/proxy-groups-1.png)
![更多分流](docs/images/proxy-groups-2.png)
![地区分组](docs/images/region-groups.png)
![Clash Verge Rev 首页](docs/images/home.png)
```

---

# 项目结构

```text
Clash-Verge-Custom-Script/
├── mihomoScript.js
├── README.md
└── docs/
    └── images/
```

---

# 常见问题

### 为什么全局模式里同时有代理组和具体节点？

这是本项目的设计。

`GLOBAL` 同时包含：

```text
基础代理组 + 地区代理组 + 全部具体节点 + 直连
```

这样既可以使用自动选择，也可以在 Clash Verge Rev 首页直接指定某个具体节点。

### 为什么 Crypto 有直连选项？

`Crypto` 被设置为允许 `DIRECT`，因此可以根据实际网络环境选择代理或直连。

### 为什么其他局域网设备连不上电脑的代理端口？

因为默认：

```yaml
allow-lan: false
bind-address: 127.0.0.1
```

这是安全设计，不是故障。

### 为什么更新订阅后代理组选择没有恢复默认值？

Mihomo 开启了：

```yaml
profile:
  store-selected: true
```

因此会尽量保留之前手动选择过的策略组状态。

### 更新订阅时报错怎么办？

优先检查 Clash Verge Rev 的日志。

常见原因：

```text
JavaScript 语法错误
复制脚本时漏掉括号
机场订阅没有有效 proxies
第三方 Rule Provider 暂时不可访问
```

---

# 致谢

本项目是在以下开源项目和公共规则资源基础上整理与定制：

- [AIsouler/MyClash](https://github.com/AIsouler/MyClash) — 原始 Mihomo 全量覆写脚本
- [MetaCubeX/mihomo](https://github.com/MetaCubeX/mihomo) — Mihomo 核心
- [clash-verge-rev/clash-verge-rev](https://github.com/clash-verge-rev/clash-verge-rev) — Clash Verge Rev
- [MetaCubeX/meta-rules-dat](https://github.com/MetaCubeX/meta-rules-dat) — Mihomo 规则数据
- [Koolson/Qure](https://github.com/Koolson/Qure) — 部分策略组图标
- 以及脚本中引用的其他规则维护项目

感谢所有上游开发者与规则维护者。

---

# License / 许可说明

本仓库包含基于上游项目修改的代码，同时依赖多个第三方规则与图标资源。

**各部分版权和许可证归各自原作者所有。**

在为本仓库正式添加 `LICENSE` 文件之前，建议先确认原始项目及相关代码的许可证要求，并选择与上游许可兼容的开源协议。

---

# Disclaimer / 免责声明

本项目仅用于 Mihomo / Clash Verge Rev 配置管理、规则组织和技术研究。

本项目：

- 不提供代理服务器；
- 不出售网络服务；
- 不提供机场订阅；
- 不保证所有第三方规则源永久可用。

使用者应自行确保其网络服务、订阅来源和使用方式符合所在地法律法规及相关服务条款。

---

如果这个项目对你有帮助，可以给仓库一个 ⭐ Star。

Issues 和 Pull Requests 欢迎用于提交：

```text
Bug
节点地区识别问题
规则缺失
兼容性问题
功能改进建议
新的服务分流需求
```
