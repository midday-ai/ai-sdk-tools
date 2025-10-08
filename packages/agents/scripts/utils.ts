export function showSpinner(message: string): NodeJS.Timeout {
  const frames = ["|", "/", "-", "\\"];
  let i = 0;
  return setInterval(() => {
    process.stdout.write(`\r${frames[i]} ${message}`);
    i = (i + 1) % frames.length;
  }, 100);
}

export function stopSpinner(interval: NodeJS.Timeout, finalMessage: string) {
  clearInterval(interval);
  process.stdout.write(`\r${finalMessage.padEnd(50)}\n`);
}

export async function getInput(prompt: string): Promise<string> {
  process.stdout.write(prompt);
  return new Promise((resolve) => {
    process.stdin.once("data", (data) => {
      resolve(data.toString().trim());
    });
  });
}

export function printHeader(title: string) {
  console.log(`\n${"=".repeat(70)}`);
  console.log(title.padStart((70 + title.length) / 2).padEnd(70));
  console.log("=".repeat(70));
}

export function printStats(stats: Record<string, string | number>) {
  const statsStr = Object.entries(stats)
    .map(([key, value]) => `${key}=${value}`)
    .join(" ");
  console.log(`\nSTATS: ${statsStr}`);
}
