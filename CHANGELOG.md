# Changelog

本项目的重要变更记录在此文件中。

## Unreleased

### Added
- 增加韩国地区节点识别与 `韩国 / 韩国-自动选择` 策略组。
- `Crypto` 策略组增加 `直连` 选项，并保留日本作为默认选择。
- 优化 `GLOBAL`：同时提供基础代理组、地区代理组、全部具体节点与双栈直连，方便在 Clash Verge Rev 全局模式中直接选择具体节点。
- 默认提供香港、日本、美国、新加坡、韩国、台湾省、低倍率节点和其他节点分组。
- 增加本机安全默认值：`allow-lan: false`、`bind-address: 127.0.0.1`、`external-controller: 127.0.0.1:9090`。

### Changed
- 默认关闭 `屏蔽国外QUIC`，避免在未启用该功能时将额外 `cn_additional` 规则源加入最终配置。
- README 补充功能说明、使用方法、安全默认值、GLOBAL 行为与常见问题。

## 说明

本项目基于 AIsouler/MyClash 的 Mihomo 全量覆写脚本进行定制。后续更新会尽量保持现有行为兼容，并在本文件中记录用户可感知的变化。
