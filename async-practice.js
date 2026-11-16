// Task 1: Asynchronous JavaScript practice
const asyncOutput = document.getElementById("asyncOutput");

function log(message) {
  console.log(message);
  asyncOutput.textContent += message + "\n";
}

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/* 1 + 2. Execution context & event loop.
   Global code runs first in the global execution context (call stack).
   Promise callbacks go to the microtask queue, timers go to the task queue.
   The event loop runs microtasks before the next task. */
function executionOrderDemo() {
  log("--- Execution order ---");
  log("1. Sync: start");
  setTimeout(() => log("4. Task queue: setTimeout(0)"), 0);
  Promise.resolve().then(() => log("3. Microtask: Promise.then"));
  log("2. Sync: end");
}

// 3. setTimeout: show a message after 3 seconds
function timeoutDemo() {
  log("--- setTimeout ---");
  log("Waiting 3 seconds...");
  setTimeout(() => log("Hello! 3 seconds have passed."), 3000);
}

// 4. setInterval: simple countdown timer
function countdownDemo(seconds = 5) {
  log("--- setInterval countdown ---");
  let remaining = seconds;
  log(`Countdown: ${remaining}`);
  const timerId = setInterval(() => {
    remaining--;
    if (remaining > 0) {
      log(`Countdown: ${remaining}`);
    } else {
      clearInterval(timerId);
      log("Countdown finished!");
    }
  }, 1000);
}

// 5. Callback function
function getUser(id, callback) {
  setTimeout(() => callback({ id, name: "Anik" }), 1000);
}

function callbackDemo() {
  log("--- Callback ---");
  getUser(1, (user) => log(`Callback received user: ${user.name} (id ${user.id})`));
  log("getUser() called, waiting for callback...");
}

// 6. Promise with resolve and reject
function checkAge(age) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (age >= 18) resolve(`Age ${age}: access granted`);
      else reject(new Error(`Age ${age}: access denied`));
    }, 1000);
  });
}

function promiseDemo() {
  log("--- Promise ---");
  checkAge(20).then(log).catch((err) => log(err.message));
  checkAge(15).then(log).catch((err) => log(err.message));
}

// 7. Same example rewritten with async/await
async function asyncAwaitDemo() {
  log("--- Async/Await ---");
  for (const age of [20, 15]) {
    try {
      const result = await checkAge(age);
      log(result);
    } catch (error) {
      log(error.message);
    }
  }
}

const demos = {
  order: executionOrderDemo,
  timeout: timeoutDemo,
  countdown: () => countdownDemo(5),
  callback: callbackDemo,
  promise: promiseDemo,
  async: asyncAwaitDemo,
  clear: () => (asyncOutput.textContent = ""),
};

document.getElementById("async-section").addEventListener("click", (event) => {
  const demo = event.target.dataset.demo;
  if (demo) demos[demo]();
});
