// Clash Verge Rev 全局扩展脚本
// 作用：保留当前机场的 proxies / proxy-providers，统一替换为 MihomoProPlus 的代理组、规则与 DNS。
// 使用位置：订阅 -> 全局扩展脚本（Script）

function main(config, profileName) {
  // 不处理 MihomoProPlus 模板本身
  if (
    typeof profileName === "string" &&
    profileName.indexOf("MihomoProPlus") !== -1
  ) {
    return config;
  }

  const directProxyCount = Array.isArray(config.proxies)
    ? config.proxies.length
