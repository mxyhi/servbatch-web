import React, { useState, useEffect, useRef, useCallback } from "react"; // 引入 useCallback
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

const MIN_HEIGHT = 100; // 最小高度
const MAX_HEIGHT = 800; // 最大高度
const DEFAULT_HEIGHT = 300; // 默认高度

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

  // --- 动态调整高度相关状态和 Ref ---
  const [height, setHeight] = useState(DEFAULT_HEIGHT);
  const isResizing = useRef(false);
  const startY = useRef(0);
  const startHeight = useRef(0);
  // ------------------------------------

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
  };

  // 滚动到输出底部
  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [executionHistory]);

  // 处理回车键提交
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      executeCommand();
    }
  };

  // --- 动态调整高度事件处理 ---
  const handleMouseDown = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      isResizing.current = true;
      startY.current = e.clientY;
      startHeight.current = height;
      e.preventDefault(); // 防止文本选中等默认行为
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    },
    [height]
  ); // 依赖当前高度

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isResizing.current) return;
    const dy = e.clientY - startY.current;
    let newHeight = startHeight.current + dy;
    // 应用高度限制
    newHeight = Math.max(MIN_HEIGHT, Math.min(MAX_HEIGHT, newHeight));
    setHeight(newHeight);
  }, []); // 无依赖，因为 startY 和 startHeight 是 ref

  const handleMouseUp = useCallback(() => {
    if (isResizing.current) {
      isResizing.current = false;
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    }
  }, [handleMouseMove]); // 依赖 handleMouseMove 以确保移除的是同一个函数实例

  // 组件卸载时清理事件监听器
  useEffect(() => {
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]); // 依赖事件处理器
  // -----------------------------

  return (
    <Card
      title={
        <div className="flex items-center">
          <CodeOutlined className="mr-2" />
          <span>{serverName} 终端</span>
        </div>
      }
      className="h-full flex flex-col" // 确保 Card 内部使用 flex 布局
    >
      <div className="flex-grow flex flex-col space-y-0 overflow-hidden">
        {" "}
        {/* 移除 space-y-4 */}
        {/* 终端输出区域 */}
        <div
          ref={outputRef}
          className="bg-slate-900 text-slate-200 p-4 rounded-t-md overflow-auto font-mono border border-b-0 border-slate-700 space-y-4 flex-shrink-0" // 移除 flex-grow, 添加 flex-shrink-0, 移除底部边框和圆角
          style={{ height: `${height}px` }} // 应用动态高度
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
        {/* 调整大小的把手 */}
        <div
          onMouseDown={handleMouseDown} // 绑定 mousedown 事件
          className="h-2 bg-slate-700 hover:bg-blue-600 cursor-ns-resize rounded-b-md border border-t-0 border-slate-700 flex-shrink-0" // 把手样式, 添加 flex-shrink-0, 调整边框
        ></div>
        {/* 命令输入区域 */}
        <div className="flex items-end space-x-2 pt-4 flex-shrink-0">
          {" "}
          {/* 添加 flex-shrink-0 和 pt-4 */}
          <TextArea
            value={command}
            onChange={(e) => setCommand(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="输入命令，按回车执行"
            autoSize={{ minRows: 1, maxRows: 3 }}
            disabled={isExecuting}
            className="flex-grow font-mono border border-slate-600 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 rounded-md"
          />
          <div className="flex space-x-2">
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
              disabled={isExecuting || executionHistory.length === 0}
            >
              清空
            </Button>
          </div>
        </div>
        {/* 使用提示 */}
        <div className="flex-shrink-0 pt-4">
          {" "}
          {/* 添加 flex-shrink-0 和 pt-4 */}
          <Divider dashed className="my-0" /> {/* 移除垂直 margin */}
          <Paragraph type="secondary" className="text-sm pt-4">
            {" "}
            {/* 添加 pt-4 */}
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
      </div>
    </Card>
  );
};

export default ServerTerminal;
