import React from "react";

export default interface IpanelProps {
    content?: React.ReactNode;
    header: React.ReactNode;
    index: number;
    height: number;
    active: boolean;
    dragging: boolean;
    panelRef?: React.RefObject<HTMLDivElement>;
    clickhandler: (index: number) => void;
}
