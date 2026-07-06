// Minimal in-process job queue (concurrency 1) for async renders.
// Swap for BullMQ/Redis in production — the route code only uses enqueue().

const queue = [];
let running = false;

async function drain() {
  if (running) return;
  running = true;
  while (queue.length) {
    const job = queue.shift();
    try {
      await job();
    } catch (err) {
      console.error("queue: job failed:", err);
    }
  }
  running = false;
}

export function enqueue(job) {
  queue.push(job);
  drain();
}
