// middleware/errorLogger.js
import morgan from "morgan";
import fs from "fs";
import path from "path";

const logDir = path.join(process.cwd(), "logs");
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

// Nombre del archivo según la fecha (YYYY-MM-DD.json)
const logFileName = `${new Date().toISOString().split("T")[0]}.json`;
const logFilePath = path.join(logDir, logFileName);

// Token personalizado en formato JSON
morgan.token("json", (req, res) => {
  return JSON.stringify({
    time: new Date().toISOString(),
    method: req.method,
    url: req.originalUrl,
    status: res.statusCode,
    ip: req.ip,
    userAgent: req.headers["user-agent"]
  });
});

// Función para escribir en archivo como array JSON
function writeJsonLog(jsonString) {
  let logs = [];
  if (fs.existsSync(logFilePath)) {
    try {
      const content = fs.readFileSync(logFilePath, "utf8");
      logs = JSON.parse(content);
    } catch {
      logs = [];
    }
  }
  logs.push(JSON.parse(jsonString));
  fs.writeFileSync(logFilePath, JSON.stringify(logs, null, 2));
}

// Middleware que loguea solo errores (>=400)
export const errorLoggerMiddleware = [
  morgan(":json", {
    skip: (req, res) => res.statusCode < 400,
    stream: {
      write: (message) => {
        writeJsonLog(message.trim());
      }
    }
  }),
  morgan(":json", {
    skip: (req, res) => res.statusCode < 400,
    stream: {
      write: (message) => {
        console.error(message.trim());
      }
    }
  })
];
