import React from 'react';
import styles from './Day.less';

export const Day = ({text, isGrey}) => {
    return (
        <div
            className={styles.day}
            style={{
                color: isGrey ? "#A9A9B8" : "unset" 
            }}
        >
            {text}
        </div>
    );
};