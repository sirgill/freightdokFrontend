import React, {Fragment} from 'react';
import styles from './components.module.css'

const CustomTextField = ({placeholder='', onChange, label, style, className = ''}) => {
    return (
        <Fragment>
            <label className={styles['label_'+className]}>
                <input
                    className={`${styles.customTextField} ${className} ${styles[className]}`}
                    placeholder={placeholder}
                    onChange={onChange}
                    style={style}
                />
            </label>
        </Fragment>
    )
}

export default CustomTextField;