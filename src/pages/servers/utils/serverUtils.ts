import { CreateServerDto } from "../../../api/servers";

/**
 * 解析文本格式的服务器数据
 *
 * 使用简单直接的方法解析CSV格式的服务器数据，避免可能导致堆栈溢出的复杂操作
 *
 * @param text CSV格式的服务器数据
 * @returns 解析后的服务器对象数组
 */
export const parseTextFormat = (text: string): CreateServerDto[] => {
  try {
    // 基本验证
    if (!text || typeof text !== "string") {
      throw new Error("输入必须是非空字符串");
    }

    // 分割行并过滤空行 - 使用更简单的方法避免可能的堆栈溢出
    const rawLines = text.trim().split(/\r?\n/);
    const lines: string[] = [];

    // 手动过滤空行，避免使用filter方法
    for (let i = 0; i < rawLines.length; i++) {
      if (rawLines[i] && rawLines[i].trim()) {
        lines.push(rawLines[i].trim());
      }
    }

    if (lines.length === 0) {
      throw new Error("没有有效的数据行");
    }

    // 限制行数
    const maxLines = 500;
    if (lines.length > maxLines) {
      throw new Error(`数据行数过多，最多支持${maxLines}行`);
    }

    // 结果数组 - 预分配空间以优化内存使用
    const result: CreateServerDto[] = new Array(lines.length);

    // 逐行处理
    for (let i = 0; i < lines.length; i++) {
      try {
        const line = lines[i];

        // 分割字段 - 限制最大字段数以避免内存问题
        const parts = line.split(",", 9); // 最多处理9个字段

        // 验证字段数量
        if (parts.length < 4) {
          // 至少需要name, host, port, username
          throw new Error(`字段数量不足，至少需要4个字段`);
        }

        // 提取并验证必要字段 - 使用更安全的方式获取字段值
        let name = parts[0] ? parts[0].trim() : "";
        const host = parts[1] ? parts[1].trim() : "";
        const portStr = parts[2] ? parts[2].trim() : "";
        const username = parts[3] ? parts[3].trim() : "";

        // 如果name和host相同，使用host加上序号作为name
        if (name === host) {
          name = `Server-${host}-${i + 1}`;
        }

        // 验证必要字段
        if (!name) throw new Error(`缺少服务器名称`);
        if (!host) throw new Error(`缺少主机地址`);
        if (!username) throw new Error(`缺少用户名`);

        // 解析端口 - 使用更安全的方式解析端口
        let port = 22; // 默认SSH端口
        if (portStr) {
          try {
            const parsedPort = parseInt(portStr, 10);
            if (!isNaN(parsedPort) && parsedPort > 0 && parsedPort <= 65535) {
              port = parsedPort;
            }
          } catch (e) {
            // 如果端口解析失败，使用默认值
          }
        }

        // 创建服务器对象 - 只包含必要字段
        const server: CreateServerDto = {
          name,
          host,
          port,
          username,
        };

        // 添加可选字段 - 使用更安全的方式获取字段值
        const password = parts[4] ? parts[4].trim() : "";
        if (password) server.password = password;

        const privateKey = parts[5] ? parts[5].trim() : "";
        if (privateKey) server.privateKey = privateKey;

        // 处理连接类型 - 简化逻辑
        const connType = parts[6] ? parts[6].trim().toLowerCase() : "";
        server.connectionType = connType === "proxy" ? "proxy" : "direct";

        // 处理代理ID - 简化逻辑
        const proxyId = parts[7] ? parts[7].trim() : "";
        if (proxyId && server.connectionType === "proxy") {
          server.proxyId = proxyId;
        }

        // 添加到结果数组
        result[i] = server;
      } catch (lineError) {
        // 捕获并重新抛出每行的错误，提供更清晰的错误信息
        throw new Error(
          `第${i + 1}行: ${
            lineError instanceof Error ? lineError.message : String(lineError)
          }`
        );
      }
    }

    // 过滤掉可能的undefined值（虽然不应该有）
    return result.filter(Boolean);
  } catch (error) {
    // 捕获并重新抛出错误，提供更清晰的错误信息
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new Error(`解析文本格式失败: ${errorMessage}`);
  }
};
