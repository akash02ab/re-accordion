import classNames from "classnames";
import { FC } from "react";
import IpanelProps from "../interface";
import styles from "./style.module.scss";

const Panel: FC<IpanelProps> = ({ header, content, index, active, height, dragging, panelRef, clickhandler }): JSX.Element => {
    return (
        <div className={styles.panel} ref={panelRef}>
            <div className={styles.row} onClick={() => clickhandler(index)}>
                <img src="/chevron-right-solid.svg" alt="v" className={active ? styles.rotate : ""} />
                <label htmlFor="code">{header}</label>
            </div>
            <div
                className={classNames(styles.content, active ? styles.active : "")}
                style={{ height: height, transition: dragging ? undefined : "height .2s" }}
            >
                {content}
            </div>
        </div>
    );
};

export default Panel;
