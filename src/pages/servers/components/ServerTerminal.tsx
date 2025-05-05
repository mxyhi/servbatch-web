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
  const [isExecuting, setIsExecuting] = useState(false);
  const outputRef = useRef<HTMLDivElement>(null);

  // 新增：存储执行历史记录
  interface ExecutionRecord {
    id: number; // 用于 React key
    command: string;
    stdout: string;
    stderr?: string;
    exitCode: number | null;
  }
  const [executionHistory, setExecutionHistory] = useState<ExecutionRecord[]>(
    []
  );
  const executionCounter = useRef(0); // 用于生成唯一 ID

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
      const trimmedCommand = command.trim();
      const result = await serversApi.executeCommand(serverId, {
        command: trimmedCommand,
        timeout: 30, // 默认30秒超时
      });

      // 新增：创建执行记录并添加到历史
      const newRecord: ExecutionRecord = {
        id: executionCounter.current++,
        command: trimmedCommand,
        stdout: result.stdout,
        stderr: result.stderr,
        exitCode: result.exitCode,
      };
      setExecutionHistory((prev) => [...prev, newRecord]);

      setCommand(""); // 清空命令输入
    } catch (error) {
      // 如果API调用失败，也记录一个失败的块
      const errorRecord: ExecutionRecord = {
        id: executionCounter.current++,
        command: command.trim(),
        stdout: "",
        stderr: `执行命令失败: ${
          error instanceof Error ? error.message : "未知错误"
        }`,
        exitCode: -1, // 使用特殊退出码表示执行错误
      };
      setExecutionHistory((prev) => [...prev, errorRecord]);
      message.error(
        `执行命令失败: ${error instanceof Error ? error.message : "未知错误"}`
      );
    } finally {
      setIsExecuting(false);
    }
  };

  // 清空输出历史
  const clearOutput = () => {
    setExecutionHistory([]);
    // lastExitCode 不再需要单独管理，它是记录的一部分
  };

  // 滚动到输出底部
  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [executionHistory]); // 依赖改为 executionHistory

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
          className="bg-slate-900 text-slate-200 p-4 rounded-md h-80 overflow-auto font-mono border border-slate-700 space-y-4" // 添加 space-y-4
        >
          {executionHistory.length > 0 ? (
            executionHistory.map((record) => (
              <div
                key={record.id}
                className="border border-slate-700 rounded-md p-3 bg-slate-800/50" // 块级样式
              >
                {/* 命令 */}
                <div className="text-cyan-400 mb-1">
                  <span className="select-none">$ </span>
                  {record.command}
                </div>
                {/* 标准输出 */}
                {record.stdout && (
                  <pre className="whitespace-pre-wrap text-slate-200">
                    {record.stdout}
                  </pre>
                )}
                {/* 标准错误 */}
                {record.stderr && (
                  <pre className="whitespace-pre-wrap text-rose-400">
                    {record.stderr}
                  </pre>
                )}
                {/* 退出码 */}
                {record.exitCode !== null && (
                  <div
                    className={`text-right text-xs mt-1 font-medium ${
                      record.exitCode === 0
                        ? "text-emerald-500"
                        : "text-rose-500"
                    }`}
                  >
                    退出码: {record.exitCode}
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-slate-400 italic">
              执行记录将显示在这里。输入命令并按回车键执行。
            </div>
          )}
          {/* 执行中提示移到末尾 */}
          {isExecuting && (
            <div className="flex items-center text-slate-400 mt-2">
              <Spin size="small" /> <span className="ml-2">执行中...</span>
            </div>
          )}
        </div>

        {/* 命令输入区域 */}
        <div className="flex space-x-2">
          <TextArea
            value={command}
            onChange={(e) => setCommand(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="输入命令，按回车执行"
            autoSize={{ minRows: 1, maxRows: 3 }}
            disabled={isExecuting}
            className="font-mono focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
              disabled={isExecuting || executionHistory.length === 0} // 依赖改为 executionHistory
            >
              清空
            </Button>
          </div>
        </div>

        {/* 使用提示 */}
        <Divider dashed />
        <Paragraph type="secondary" className="text-sm">
          <ul className="list-disc pl-6">
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
