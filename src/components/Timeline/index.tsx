import { FC } from "react";
import styles from "./style.module.scss";

const colors = ["darkslategrey", "limegreen", "cyan", "firebrick", "purple", "dodgerblue", "orange"];

const Timeline:FC = () => {
  return (
    <div className={styles.timeline}>
      {
        colors.map((color, index) => <div className={styles.box} style={{ background: color }} key={index}>{`Timeline ${index}`}</div>)
      }
    </div>
  )
}

export default Timeline;