import { Workspace } from "@/components/Workspace/Workspace";
import { ContextMenu } from "@/components/ContextMenu/ContextMenu";

import styles from "./App.module.css";

export default function App() {
  return (
    <main className={styles.app}>
      <Workspace />
      <ContextMenu />
    </main>
  );
}
