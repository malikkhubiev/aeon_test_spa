import React from 'react';
import { Task } from '../Task/Task';
import styles from "./Tasks.less";

const transformForRender = (tasks) => {
    let result = [];
    tasks.forEach(task => {
        result.push(task);
        if (task.sub) {
            result = [...result, ...transformForRender(task.sub)];
        };
    });
    return result;
};

export const Tasks = ({tasks, collapseCallback}) => {
    let tasksForRender = transformForRender(tasks);
    return (
        <div className={styles.tasks}>
            <div className={styles.header}>
                <span className={styles.header_name}>Work item</span>
            </div>
            <div className={styles.tasksList}>
                <Task
                    key={Date.now()}
                    task=""
                />
                {tasksForRender.map(task => {
                    return <Task
                        key={task.id}
                        task={task}
                        collapseCallback={collapseCallback}
                    />
                })}
            </div>
            <div className={styles.emptyBox}></div>
        </div>
    );
};