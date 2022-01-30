import React from "react";
import {FormGroup, Input} from "reactstrap";

const InputPure = (props) => {
    const {label = '', type = 'text', options = [], labelKey='', valueKey=''} = props;

    if(type.toLowerCase()==='select'){
        if(!Array.isArray(options) || !options.length) {
            throw new Error('Options are mandatory in array format');
        }
        return <Input
            id={label}
            type={type}
            {...props}
        >{options.map(opt => <option value={opt[valueKey]}>{opt[labelKey]}</option>)}</Input>
    }
    return <Input
        id={label}
        type={type}
        {...props}
    />
}
const InputField = (props = {}) => {
    const {label = '', type = 'text'} = props;
    return (
        <FormGroup>
            <label
                className="form-control-label"
                htmlFor={label}
                style={{color: '#525F7F'}}
            >
                {label}
            </label>
            <InputPure {...props} />
        </FormGroup>
    )
}

export default InputField;