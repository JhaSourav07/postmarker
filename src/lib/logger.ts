const colors = {
  reset: "\x1b[0m",
  info: "\x1b[32m", // Green
  warn: "\x1b[33m", // Yellow
  error: "\x1b[31m", // Red
  debug: "\x1b[36m", // Cyan
  tag: "\x1b[35m",   // Magenta
  time: "\x1b[90m",  // Gray
};

export class Logger {
  private static formatTime() {
    return `${colors.time}[${new Date().toISOString()}]${colors.reset}`;
  }

  static info(tag: string, message: string, ...args: any[]) {
    console.log(
      `${this.formatTime()} ${colors.info}[INFO]${colors.reset} ${colors.tag}[${tag.toUpperCase()}]${colors.reset} ${message}`,
      ...args
    );
  }

  static warn(tag: string, message: string, ...args: any[]) {
    console.warn(
      `${this.formatTime()} ${colors.warn}[WARN]${colors.reset} ${colors.tag}[${tag.toUpperCase()}]${colors.reset} ${message}`,
      ...args
    );
  }

  static error(tag: string, message: string, ...args: any[]) {
    console.error(
      `${this.formatTime()} ${colors.error}[ERROR]${colors.reset} ${colors.tag}[${tag.toUpperCase()}]${colors.reset} ${message}`,
      ...args
    );
  }

  static debug(tag: string, message: string, ...args: any[]) {
    // Only print debug statements in development mode to save log bandwidth in prod
    if (process.env.NODE_ENV === "development") {
      console.log(
        `${this.formatTime()} ${colors.debug}[DEBUG]${colors.reset} ${colors.tag}[${tag.toUpperCase()}]${colors.reset} ${message}`,
        ...args
      );
    }
  }
}
