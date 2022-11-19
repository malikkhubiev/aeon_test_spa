import React, { useState } from 'react';
import styles from "./Task.less";
import arrow from '../../assets/arrow.svg';
import bookmark from '../../assets/bookmark.svg';
import lamp from '../../assets/lamp.svg';
import lightning from '../../assets/lightning.svg';
import stack from '../../assets/stack.svg';
import target from '../../assets/target.svg';

const iconTypeByLevel = {
    0: stack,
    1: lamp,
    2: bookmark,
    3: target,
    4: lightning
};

export const Task = ({ task, collapseCallback }) => {

    let [isCollapsed, setIsCollapsed] = useState(false);

    const toggleButtonHandler = () => {
        if (isCollapsed) {
            collapseCallback(task.id, "unCollapse");
            setIsCollapsed(prev => prev = false);
        } else {
            collapseCallback(task.id, "collapse");
            setIsCollapsed(prev => prev = true);
        }
    };

    return (
        <div className={styles.task}>
            {
                task.title ?
                    <div
                        className={styles.indent}
                        style={{
                            marginLeft: `${20 * task.level}px`,
                        }}
                    >
                        <button
                            onClick={toggleButtonHandler}
                            className={styles.toggleButton}
                            style={{
                                transform: `rotate(${isCollapsed ? "-90deg" : "0deg"})`
                            }}
                        >
                            <img src={arrow} />
                        </button>
                        <div className={styles.icon}>
                            <img src={iconTypeByLevel[task.level]} />
                        </div>
                        <span className={styles.size}>
                            {task.size}
                        </span>
                        <span className={styles.title}>
                            {task.title}
                        </span>
                    </div>
                    :
                    ""
            }
        </div>
    );
};