import { ServerEntity } from "../../../api/servers";

export const parseTextFormat = (text: string): ServerEntity[] => {
  // 分割行
  const lines = text.trim().split(/\r?\n/);
  if (lines.length === 0) {
    throw new Error("没有数据行");
  }

  // 定义固定的字段顺序
  const fieldOrder = [
    "name",
    "host",
    "port",
    "user",
    "pwd",
    "key",
    "connectionType",
    "proxyId",
  ];

  // 解析数据行
  const servers = [];
  for (let i = 0; i < lines.length; i++) {
    if (!lines[i].trim()) continue; // 跳过空行

    const values = lines[i].split(",").map((v) => v.trim());
    if (values.length > fieldOrder.length) {
      throw new Error(
        `第 ${i + 1} 行的列数超过了预期的 ${fieldOrder.length} 列`
      );
    }

    const server: Partial<ServerEntity> = {};
    values.forEach((value, index) => {
      if (!value) return; // 跳过空值

      const field = fieldOrder[index];
      if (field === "port") {
        server["port"] = parseInt(value, 10);
      } else if (field === "user") {
        server["username"] = value;
      } else if (field === "pwd") {
        server["password"] = value;
      } else if (field === "key") {
        server["privateKey"] = value;
      } else if (field === "connectionType") {
        server["connectionType"] = value === "proxy" ? "proxy" : "direct";
      } else if (field === "proxyId") {
        server["proxyId"] = value;
      } else if (field) {
        server[field] = value;
      }
    });

    // 检查必要的字段
    if (!server.name || !server.host || !server.username) {
      throw new Error(`第 ${i + 1} 行缺少必要的字段: name, host 或 username`);
    }

    servers.push(server);
  }

  return servers;
};
