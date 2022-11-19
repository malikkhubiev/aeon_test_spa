import axios from "axios";
import React, { useState, useEffect } from "react";
import downloadIcon from '../assets/download.svg';
import { Diagram } from "../components/Diagram/Diagram";
import { Tasks } from "../components/Tasks/Tasks";
import styles from './App.less';

const firstTransformTasks = (tasks, level) => {
    const result = [];
    tasks.forEach(task => {
        // setting time to 0, because time doesn't matter 
        let period_start = new Date(task.period_start);
        period_start.setHours(0, 0, 0, 0);
        let period_end = new Date(task.period_end);
        period_end.setHours(0, 0, 0, 0);

        // initializing transformedTask
        const transformedTask = {
            id: task.id,
            title: task.title,
            period_start,
            period_end,
            level,
            isClosed: false,
        };

        // checking it's sub tasks
        if (task.sub) {
            transformedTask["size"] = task.sub.length;
            transformedTask["sub"] = firstTransformTasks(task.sub, level + 1);
            transformedTask["_sub"] = transformedTask["sub"];
        };

        // push to result
        result.push(transformedTask);
    });
    return result;
};

const months = {
    // kind of enum
    '1': "Jan",
    '2': "Feb",
    '3': "Mar",
    '4': "Apr",
    '5': "May",
    '6': "Jun",
    '7': "Jul",
    '8': "Aug",
    '9': "Sep",
    '10': "Oct",
    '11': "Nov",
    '12': "Dec",
};

const quarter = (initialDate) => {
    // start date
    const startMonth = months[initialDate.getMonth() + 1];
    let startDay = initialDate.getDate();
    if (startDay < 10) startDay = `0${startDay}`; // formatting
    else startDay = String(startDay); // formatting
    const leftPart = startDay + " " + startMonth; // formatting

    // finish date
    const finishDate = new Date(initialDate.setDate(initialDate.getDate() + 6));
    const finishMonth = months[initialDate.getMonth() + 1];
    let finishDay = finishDate.getDate();
    if (finishDay < 10) finishDay = `0${finishDay}`; // formatting
    else finishDay = String(finishDay); // formatting
    const rightPart = finishDay + " " + finishMonth; // formatting

    // result
    return leftPart + " - " + rightPart;
};

const getAllQuarters = (initialDate) => {
    const result = [];
    let newDate = initialDate;
    for (let i = 0; i < 8; i++) {
        if (i == 0)
            // as start value
            newDate = new Date(initialDate.setDate(initialDate.getDate()));
        else
            newDate = new Date(initialDate.setDate(initialDate.getDate() + 7));
        result.push(quarter(newDate));
    };
    return result;
};

const getDays = (startDate, stopDate) => {
    const dateArray = [];
    let currentDate = startDate;
    currentDate.setHours(0, 0, 0, 0); // because time doesn't matter
    let counter = -1;
    let greyDates = [5, 6];
    while (currentDate <= stopDate) {
        // push new day in array
        const day = {
            id: ++counter,
            text: new Date(currentDate).getDate(),
            date: new Date(currentDate)
        };
        dateArray.push(day);

        // setting last two days' color to "grey" 
        if (counter >= greyDates[0] && counter <= greyDates[1]) {
            dateArray[dateArray.length - 1]["color"] = "grey";
        } else if (counter > greyDates[1]) {
            greyDates[0] += 7;
            greyDates[1] += 7;
        };

        // incrementing current date
        currentDate.setDate(currentDate.getDate() + 1);
    };
    return dateArray;
};

const periodToRussia = (str) => {
    // start date
    let start = str.split('-')[0]; // taking start part
    let startMonth = +start.split('.')[1]; // taking month
    if (startMonth < 10) startMonth = "0" + startMonth; // formatting
    let startDay = +start.split('.')[0] - 1; // taking day
    if (startDay < 10) startDay = `0${startDay}`; // formatting
    else startDay = String(startDay); // formatting
    let startDateInStr = `${startMonth}.${startDay}.${start.split(".")[2]}`; // concatenating
    let startDate = new Date(startDateInStr); // converting to date type
    startDate.setHours(0, 0, 0, 0); // because time doesn't matter

    // stop date
    let stop = str.split('-')[1]; // taking stop part
    let stopMonth = +stop.split('.')[1]; // taking month
    if (stopMonth < 10) stopMonth = "0" + stopMonth; // formatting
    let stopDay = stop.split('.')[0] // taking day
    let stopDateInStr = `${stopMonth}.${stopDay}.${stop.split(".")[2]}`; // concatenating
    let stopDate = new Date(stopDateInStr); // converting to date type
    stopDate.setHours(0, 0, 0, 0); // because time doesn't matter

    // result returning
    return { startDate, stopDate };
};

const transformTasksIntoArrayType = (tasks) => {
    // it's easy
    let result = [];
    tasks.forEach(task => {
        result.push(task);
        if (task.sub) {
            result = [...result, ...transformTasksIntoArrayType(task.sub)];
        };
    });
    return result;
};

export const App = () => {

    const [tasks, setTasks] = useState(null);
    const [tasksInArrayType, setTasksInArrayType] = useState(null);
    let [incomingData, setIncomingData] = useState(null);
    let [days, setDays] = useState(null); // bottom header
    let [quarters, setQuarters] = useState(null); // top header

    const api = async() => {
        const response = await axios.get("http://82.202.204.94/tmp/test.php");
        const serverData = response.data;

        let { startDate, stopDate } = periodToRussia(serverData.period);
        const quarters = getAllQuarters(new Date(startDate));
        setQuarters(prev => prev = quarters)
        const days = getDays(new Date(startDate), new Date(stopDate));
        setDays(prev => prev = days)

        setIncomingData(prev => serverData);
        const transformedTasks = firstTransformTasks([serverData.chart], 0);
        setTasks(prev => prev = transformedTasks);
        setTasksInArrayType(prev => prev = transformTasksIntoArrayType(transformedTasks));
    };

    useEffect(() => {
        // const serverData = {
        //     "project": "DMS 2.0",
        //     "period": "02.09.2022-31.12.2022",
        //     "chart": {
        //         "id": 1,
        //         "title": "Marketing Launch",
        //         "period_start": "2022-09-02",
        //         "period_end": "2022-09-08",
        //         "sub": [
        //             {
        //                 "id": 2,
        //                 "title": "Banners for social networks",
        //                 "period_start": "2022-09-02",
        //                 "period_end": "2022-09-07",
        //                 "sub": [
        //                     {
        //                         "id": 3,
        //                         "title": "Choosing a platform for ads",
        //                         "period_start": "2022-09-02",
        //                         "period_end": "2022-09-06",
        //                         "sub": [
        //                             {
        //                                 "id": 4,
        //                                 "title": "Custom issue level #4",
        //                                 "period_start": "2022-09-03",
        //                                 "period_end": "2022-09-05",
        //                                 "sub": [
        //                                     {
        //                                         "id": 5,
        //                                         "title": "Custom issue level #5",
        //                                         "period_start": "2022-09-04",
        //                                         "period_end": "2022-09-05"
        //                                     },
        //                                     {
        //                                         "id": 6,
        //                                         "title": "Custom task",
        //                                         "period_start": "2022-09-05",
        //                                         "period_end": "2022-09-05"
        //                                     }
        //                                 ]
        //                             }
        //                         ]
        //                     }
        //                 ]
        //             }
        //         ]
        //     }
        // };
        api();
    }, []);

    const normalizeStringToDate = (tasks) => {
        tasks.forEach(task => {
            task.period_start = new Date(task.period_start);
            task.period_start.setHours(0, 0, 0, 0);
            task.period_end = new Date(task.period_end);
            task.period_end.setHours(0, 0, 0, 0);
            if (task.sub) normalizeStringToDate(task.sub);
        });
        return tasks;
    };

    const collapseToggleCallback = (id, action) => {
        let currentTasks = JSON.parse(JSON.stringify(tasks));
        const findAndCollapseRecoursive = (arrayOfTasks) => {
            arrayOfTasks.forEach(task => {
                task.period_start = new Date(task.period_start);
                task.period_start.setHours(0, 0, 0, 0);
                task.period_end = new Date(task.period_end);
                task.period_end.setHours(0, 0, 0, 0);
        
                if (task.id === id) {
                    if (task.sub || task._sub) {
                        if (action === "collapse") {
                            delete task["sub"];        
                        }else{
                            task["sub"] = normalizeStringToDate(task["_sub"]);
                        };
                    };
                    return;
                }else{
                    if (task.sub) findAndCollapseRecoursive(task.sub);
                }
            });
            return arrayOfTasks;
        };
        const result = findAndCollapseRecoursive(currentTasks);
        setTasks(prev => prev = result);
        setTasksInArrayType(prev => prev = transformTasksIntoArrayType(result));
    };

    return (
        <div className={styles.section}>
            {
                tasks && incomingData ?
                    <>
                        <div className={styles.section_header}>
                            <h1>{incomingData.project} / {incomingData.period}</h1>
                            <button className={styles.export_button}>
                                <img src={downloadIcon} />
                                Export
                            </button>
                        </div>
                        <div className={styles.section_body}>
                            <Tasks
                                collapseCallback={collapseToggleCallback}
                                tasks={tasks}
                            />
                            <Diagram
                                quarters={quarters}
                                days={days}
                                tasks={tasksInArrayType}
                            />
                        </div>
                    </>
                    :
                    ""
            }
        </div>
    )
};