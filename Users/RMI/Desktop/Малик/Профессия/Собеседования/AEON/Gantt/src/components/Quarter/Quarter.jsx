import React from 'react';
import styles from './Quarter.less';

export const Quarter = ({text}) => {
    return (
        <div className={styles.quarter}>
            {text}
        </div>
    );
};