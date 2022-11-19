import React from 'react';
import { Day } from '../Day/Day';
import { Quarter } from '../Quarter/Quarter';
import styles from './Diagram.less';

const backgroundColors = {
    0: "#E2EBFF",
    1: "#FFF2E0",
    2: "#CFF0D6",
    3: "#CFF0D6",
    4: "#FFF2E0"
};

const borderColors = {
    0: "#497CF6",
    1: "#FFA530",
    2: "#2DB77B",
    3: "#2DB77B",
    4: "#FFA530"
};

const plugArray = [];
for (let i = 0; i < 15; i++) {
    plugArray.push(i);
};

export const Diagram = ({ quarters, days, tasks }) => {
    return (
        <div className={styles.table}>
            <div className={styles.header}>
                <div className={styles.quarters}>
                    {
                        quarters.map(
                            quarter =>
                                <Quarter
                                    key={quarter}
                                    text={quarter}
                                />
                        )
                    }
                </div>
                <div className={styles.days}>
                    {
                        days.map(
                            day =>
                                <Day
                                    isGrey={Boolean(day.color)}
                                    key={day.id}
                                    text={day.text}
                                />
                        )
                    }
                </div>
            </div>
            <table>
                <tr key="unique">
                    {
                        days.map(day => <td key={day.id}></td>)
                    }
                </tr>
                {
                    tasks.map(task =>
                        <tr key={task.title}>
                            {
                                days.map(day => {
                                    let className;
                                    if (
                                        day.date.getTime() === task.period_start.getTime()
                                        &&
                                        day.date.getTime() === task.period_end.getTime()
                                    ) className = "one"
                                    else if (day.date.getTime() === task.period_start.getTime())
                                        className = "start";
                                    else if (
                                        day.date.getTime() > task.period_start.getTime()
                                        &&
                                        day.date.getTime() < task.period_end.getTime()
                                    )
                                        className = "inside";
                                    else if (day.date.getTime() === task.period_end.getTime())
                                        className = "end";
                                    return <td key={day.id}>
                                        {
                                            className ?
                                                <>
                                                    <div
                                                        className={styles[className]}
                                                        style={{
                                                            backgroundColor: backgroundColors[task.level],
                                                            borderColor: borderColors[task.level],
                                                        }}
                                                    ></div>
                                                    {
                                                        className === "end" || className === "one" ?
                                                            <span className={styles.taskTitle}>{task.title}</span>
                                                            :
                                                            ""
                                                    }
                                                </>
                                                :
                                                ""
                                        }
                                    </td>
                                })
                            }
                        </tr>
                    )
                }
                {
                    plugArray.map(plug => <tr key={plug}>
                        {
                            days.map(day => <td key={day.id}></td>)
                        }
                    </tr>)
                }
            </table>
        </div>
    );
};