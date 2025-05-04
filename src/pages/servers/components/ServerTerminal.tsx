import React, { useState, useEffect, useRef } from "react";
import { Card, Input, Button, Typography, Alert, Spin, Divider } from "antd";
import { SendOutlined, ClearOutlined, CodeOutlined } from "@ant-design/icons";
import { serversApi } from "../../../api/servers";
import { message } from "../../../utils/message";
import { ServerStatus } from "../../../types/api";

const { Paragraph } = Typography;
const { TextArea } = Input;

interface ServerTerminalProps {
  serverId: number | string;
  serverName: string;
  serverStatus: ServerStatus;
}

/**
 * 服务器终端组件
 */
const ServerTerminal: React.FC<ServerTerminalProps> = ({
  serverId,
  serverName,
  serverStatus,
}) => {
  const [command, setCommand] = useState("");
  const [output, setOutput] = useState<string>("");
  const [isExecuting, setIsExecuting] = useState(false);
  const [lastExitCode, setLastExitCode] = useState<number | null>(null);
  const outputRef = useRef<HTMLDivElement>(null);

  // 如果服务器离线，显示警告
  if (serverStatus !== "online") {
    return (
      <Alert
        message="服务器离线"
        description="服务器当前不在线，无法执行命令。请等待服务器恢复在线状态后再试。"
        type="warning"
        showIcon
      />
    );
  }

  // 执行命令
  const executeCommand = async () => {
    if (!command.trim()) {
      message.warning("请输入要执行的命令");
      return;
    }

    try {
      setIsExecuting(true);
      const result = await serversApi.executeCommand(serverId, {
        command: command.trim(),
        timeout: 30, // 默认30秒超时
      });

      // 添加命令和结果到输出
      let commandOutput = `$ ${command}\n${result.stdout}`;
      if (result.stderr) {
        commandOutput += `\n${result.stderr}`;
      }

      setOutput((prev) =>
        prev ? `${prev}\n\n${commandOutput}` : commandOutput
      );
      setLastExitCode(result.exitCode);
      setCommand(""); // 清空命令输入
    } catch (error) {
      message.error(
        `执行命令失败: ${error instanceof Error ? error.message : "未知错误"}`
      );
    } finally {
      setIsExecuting(false);
    }
  };

  // 清空输出
  const clearOutput = () => {
    setOutput("");
    setLastExitCode(null);
  };

  // 滚动到输出底部
  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [output]);

  // 处理回车键提交
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      executeCommand();
    }
  };

  return (
    <Card
      title={
        <div className="flex items-center">
          <CodeOutlined className="mr-2" />
          <span>{serverName} 终端</span>
        </div>
      }
      className="h-full"
    >
      <div className="space-y-4">
        {/* 终端输出区域 */}
        <div
          ref={outputRef}
          className="bg-gray-900 text-gray-200 p-4 rounded-md h-80 overflow-auto font-mono"
        >
          {output ? (
            <pre className="whitespace-pre-wrap">{output}</pre>
          ) : (
            <div className="text-gray-500 italic">
              输出将显示在这里。输入命令并按回车键执行。
            </div>
          )}
          {isExecuting && (
            <div className="mt-2">
              <Spin size="small" /> <span className="ml-2">执行中...</span>
            </div>
          )}
        </div>

        {/* 退出码显示 */}
        {lastExitCode !== null && (
          <div
            className={`text-right ${
              lastExitCode === 0 ? "text-green-500" : "text-red-500"
            }`}
          >
            退出码: {lastExitCode}
          </div>
        )}

        {/* 命令输入区域 */}
        <div className="flex space-x-2">
          <TextArea
            value={command}
            onChange={(e) => setCommand(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="输入命令，按回车执行"
            autoSize={{ minRows: 1, maxRows: 3 }}
            disabled={isExecuting}
            className="font-mono"
          />
          <div className="flex flex-col space-y-2">
            <Button
              type="primary"
              icon={<SendOutlined />}
              onClick={executeCommand}
              loading={isExecuting}
            >
              执行
            </Button>
            <Button
              icon={<ClearOutlined />}
              onClick={clearOutput}
              disabled={isExecuting || !output}
            >
              清空
            </Button>
          </div>
        </div>

        {/* 使用提示 */}
        <Divider dashed />
        <Paragraph type="secondary" className="text-sm">
          <ul className="list-disc pl-5">
            <li>输入命令后按回车键执行</li>
            <li>使用Shift+Enter可以在命令中换行</li>
            <li>命令执行超时时间为30秒</li>
            <li>
              注意：此终端不支持交互式命令（如vim、top等），请使用非交互式命令
            </li>
          </ul>
        </Paragraph>
      </div>
    </Card>
  );
};

export default ServerTerminal;
