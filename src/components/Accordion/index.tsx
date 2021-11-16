import classNames from "classnames";
import React, { FC, useEffect, useRef, useState } from "react";
import Panel from "./Panel";
import styles from "./style.module.scss";

type TPanel = { key: string; header: React.ReactNode; content: React.ReactNode };

type AccordionComponent = { panels: TPanel[] };
const DIVIDER_HEIGHT = 2;
const MIN_PANEL_HEIGHT = 182;

const Accordion: FC<AccordionComponent> = ({ panels }): JSX.Element => {
    const [scope, setScope] = useState<boolean>(true);
    const [currentY, setCurrentY] = useState<number>(0);
    const [dragging, setDragging] = useState<boolean>(false);
    // eslint-disable-next-line
    const [activeIndex, setActiveIndex] = useState<number>(-1);
    const [closestActiveIndexUp, setClosestActiveIndexUp] = useState<number>(-1);
    const [closestActiveIndexDown, setClosestActiveIndexDown] = useState<number>(-1);
    const [currentHeight, setCurrentHeight] = useState<number>(0);
    const [panelHeights, setPanelHeights] = useState<number[]>(Array(panels.length).fill(0));
    const [activePanels, setActivePanels] = useState<boolean[]>(Array(panels.length).fill(false));
    const [activeDividers, setActiveDividers] = useState<boolean[]>(Array(panels.length).fill(false));
    const panelRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    /* On mousedown event:
       1. setDragging to true, this will enable mouse movement tracking only if left mouse button is hold down
       2. setActiveIndex to `index - 1`, this will track which Accordion Panel to resize
       3. setCurrentY to clientY, this will point to current position of mouse in Y direction 
       4. setClosestActiveIndexUp to closest activePanel index in up direction
       5. setClosestActiveIndexDown to closest activePanel index in down direction */
    const onMouseDown = (event: React.MouseEvent, index: number) => {
        setDragging(true);
        setActiveIndex(index);
        setCurrentY((prev) => event.clientY);
        let closestIndex = index - 1;
        while (!activePanels[closestIndex]) {
            closestIndex -= 1;
        }
        setClosestActiveIndexUp(closestIndex);
        closestIndex = index;
        while (!activePanels[closestIndex]) {
            closestIndex += 1;
        }
        setClosestActiveIndexDown(closestIndex);
    };

    /* On mouse move pass the current clientY position to onMove function every time it gets updated */
    const onMouseMove = (event: MouseEvent) => {
        event.preventDefault();
        onMove(event.clientY);
    };

    /* On mouse up setDragging is set to false this will stop mouse movement tracking */
    const onMouseUp = () => {
        setDragging(false);
    };

    
    const onMove = (clientY: number) => {
      if (dragging) {
            /* offset is use to track if the mouse is moving upward or downward */
            let offset = currentY - clientY;
            /* resizeH is the maximum height to which an accordion panel can be resized */ 
            let resizeH = 0;

            /* if offset is less than 0 it means mouse is moving downward else upward */
            if (offset < 0) {
                resizeH = panelHeights[closestActiveIndexDown] - MIN_PANEL_HEIGHT;
            } else {
                resizeH = panelHeights[closestActiveIndexUp] - MIN_PANEL_HEIGHT;
            }

            /* if resizeH is greater than 0 then there is scope of resizing the accordion panel.
               Identify the accordion panel whose height is to be updated using activeIndex.
               Update the panelHeight of accordion panel which is pointed by activeIndex and 
               the accordion panel closest to it */
          if (resizeH > 0) {
                setPanelHeights((prevState) => {
                    const nextState = prevState.map((height, index) => {
                        if (index === closestActiveIndexDown) {
                            return prevState[index] + offset;
                        } else if (index === closestActiveIndexUp) {
                            return prevState[index] - offset;
                        } else {
                            return height;
                        }
                    });
                    return nextState;
                });
                setCurrentY((prev) => clientY);
            }
        }
    };

    /* if any accordion panel is clicked then update the activePanels state varialbe based upon its previous state, 
       if its closed than open it or if its already open than close it */
    const clickhandler = (index: number) => {
        setActivePanels((prevState) => {
            let nextState = [...prevState];
            nextState[index] = !nextState[index];
            return nextState;
        });
    };

    /* Add eventlisteners to mousemove and mouseup event and clear it using callback */
    useEffect(() => {
        document.addEventListener("mousemove", onMouseMove);
        document.addEventListener("mouseup", onMouseUp);

        return () => {
            document.removeEventListener("mousemove", onMouseMove);
            document.removeEventListener("mouseup", onMouseUp);
        };
    });

    /* When the Accordion components loads for the first time calculate the following: 
       1. containerH -> height of the container which contains all the accordions panel
       2. panelH -> height of the accordion panel when it is closed
       3. currentHeight -> height remaining in container after placing all the accordion panels
    */
    useEffect(() => {
        let containerH = containerRef.current?.clientHeight;
        let panelH = panelRef.current?.offsetHeight;

        if (containerH && panelH) {
            let currentH = containerH - panels.length * panelH - panels.length * DIVIDER_HEIGHT - 20;
            setCurrentHeight(currentH);
        }
    }, [panels.length]);

  useEffect(() => {
        /* activePanelCount represent the number of accordion panel which are open */
        let activePanelCount = activePanels.filter(Boolean).length;
        /* availableH is the height left considering the some of the accordion panel can be in open state */
        let availableH = currentHeight - activePanelCount * MIN_PANEL_HEIGHT;
        /* maxPanelHeight is the maximum height the accordion panel can take from availableH.
           If availableH is less than MIN_PANEL_HEIGHT than take MIN_PANEL_HEIGHT anyways */
        let maxPanelHeight = Math.max(Math.floor(currentHeight / activePanelCount), MIN_PANEL_HEIGHT);

        /* Check if accordion panel is open or not.
           If its open the updated the panelHeight else set it to 0 */
        setPanelHeights((prevState) => {
            return prevState.map((height, index) => {
                if (activePanels[index]) {
                    return maxPanelHeight;
                } else {
                    return 0;
                }
            });
        });

        /* show dividers between two opened accordion panel */
      setActiveDividers(() => {
          let [start, end] = [activePanels.indexOf(true), activePanels.lastIndexOf(true)];
            return activePanels.map((current, index) => {
                if (index > start && index <= end) {
                    return true;
                }
                return false;
            });
        });

        /* scope is to track if there is scope to show dividers at all,
           show dividers if there is scope of resizing the accordion panel and more than 1 accordion panel is open */
        if (availableH > 0 && activePanelCount > 1) {
            setScope(true);
        } else {
            setScope(false);
        }
    }, [activePanels, currentHeight]);

    return (
        <div
            className={classNames(styles.accordion, styles.resize, styles.horizontal)}
            style={{ userSelect: dragging ? "none" : undefined }}
        >
            <h4>EXPLORER</h4>
            <div className={styles.inner} ref={containerRef}>
                {panels.map((panel, index) => {
                    return (
                        <React.Fragment key={panel.key}>
                            {scope && activeDividers[index] ? (
                                <div className={styles.dividerHitbox} onMouseDown={(event) => onMouseDown(event, index)}>
                                    <div className={styles.divider}></div>
                                </div>
                            ) : null}
                            <Panel
                                header={panel.header}
                                content={panel.content}
                                index={index}
                                height={panelHeights[index]}
                                active={activePanels[index]}
                                panelRef={panelRef}
                                dragging={dragging}
                                clickhandler={clickhandler}
                            />
                        </React.Fragment>
                    );
                })}
            </div>
        </div>
    );
};

export default Accordion;
