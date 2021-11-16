import { FC } from "react";
import Accordion from "./Accordion";
import styles from "./App.module.scss";
import Outline from "./Outline";
import Timeline from "./Timeline";

const generateDummyList = (size: number, color: React.CSSProperties["backgroundColor"]) => {
    return Array(size)
        .fill(0)
        .map((item) => <div style={{ height: 50, width: "100%", backgroundColor: color, marginBottom: 10 }} />);
};

const items = [
    {
        key: "panel1",
        header: "Code",
        content:
            "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Accusantium assumenda quos unde magni eius et vitae enim, sed numquam laboriosam distinctio quasi dolore architecto eos tempora facere quas aperiam? Provident!",
    },
    {
        key: "panel2",
        header: "Timeline",
        content: <Timeline />,
    },
    {
        key: "panel3",
        header: "Outline",
        content: <Outline />,
    },
    {
        key: "panel4",
        header: "Tag",
        content: "59 Kohinoor"
    }

    // {
    //     header: "Green",
    //     content: generateDummyList(10000, "green"),
    // },
    // {
    //     header: "Red",
    //     content: generateDummyList(10000, "red"),
    // },
    // {
    //     header: "Yellow",
    //     content: generateDummyList(10000, "yellow"),
    // },
];

const App: FC = (): JSX.Element => {
    return (
        <div className={styles.container}>
            <Accordion panels={items} />
        </div>
    );
};

export default App;
