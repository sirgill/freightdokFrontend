import React, {Fragment} from 'react';
import styles from './components.module.css'

const CustomTextField = ({placeholder='', onChange, label, style, className = ''}) => {
    return (
        <Fragment>
            <input
                className={`${styles.customTextField} ${className}`}
                placeholder={placeholder}
                onChange={onChange}
                style={style}
            />
        </Fragment>
    )
}

export default CustomTextField;