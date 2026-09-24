// tells TypeScript that pywebview adds window.pywebview.api at runtime
declare global {
  interface Window {
    pywebview: {
      api: Record<string, (...args: unknown[]) => Promise<unknown>>;
    };
  }
}

// resolves once pywebview has injected the api
const ready = new Promise<void>((resolve) => {
  if (window.pywebview?.api) return resolve();
  else window.addEventListener("pywebviewready", () => resolve());
});

// function to call a Python methods
export async function call<Returns>(
  name: string,
  ...args: unknown[]
): Promise<Returns> {
  await ready;

  const pythonFunction = window.pywebview.api[name];
  if (!pythonFunction) throw new Error(`Python method "${name}" not found`);

  try {
    return (await pythonFunction(...args)) as Returns;
  } catch (err) {
    throw new Error(
      `Python "${name}" failed: ${err instanceof Error ? err.message : err}`,
    );
  }
}
