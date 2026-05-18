import { spawn } from "node:child_process";

const isWindows = process.platform === "win32";
const npmCmd = isWindows ? "npm.cmd" : "npm";
const command = isWindows ? (process.env.ComSpec || "cmd.exe") : npmCmd;
const npmArgs = (script) => isWindows ? ["/d", "/s", "/c", npmCmd, "run", script] : ["run", script];

const processes = [
  spawn(command, npmArgs("dev:client"), {
    stdio: "inherit",
    shell: false,
    env: {
      ...process.env,
      VITE_SOCKET_URL: process.env.VITE_SOCKET_URL || "http://localhost:3000"
    }
  }),
  spawn(command, npmArgs("dev:server"), {
    stdio: "inherit",
    shell: false,
    env: {
      ...process.env,
      PORT: process.env.PORT || "3000"
    }
  })
];

function shutdown(code = 0) {
  processes.forEach((child) => {
    if (!child.killed) child.kill();
  });
  process.exit(code);
}

processes.forEach((child) => {
  child.on("exit", (code) => {
    if (code && code !== 0) shutdown(code);
  });
});

process.on("SIGINT", () => shutdown(0));
process.on("SIGTERM", () => shutdown(0));
