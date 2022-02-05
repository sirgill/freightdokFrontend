import React from "react";
import {Button} from "reactstrap";

import styles from './form.module.css';

const SubmitButton = ({children, className='', ...rest}) => {
    return <Button className={styles.submitBtn + ` ${className}`} {...rest}>
        {children}
    </Button>
}

export default SubmitButton;