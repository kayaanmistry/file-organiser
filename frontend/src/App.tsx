import { useState } from "react";
import { ping } from "./api/files";

import styles from "./App.module.css";

export default function App() {
  const [reply, setReply] = useState("");

  return (
    <main className={styles.app}>
      <button onClick={async () => setReply(await ping())}>Ping</button>
      <p>{reply}</p>
    </main>
  );
}
