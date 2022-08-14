import React from "react";
import _ from 'lodash';
import {FormGroup, Input} from "reactstrap";

const InputPure = (props) => {
    const {label = '', type = 'text', options = [], labelKey = 'label', valueKey = 'id', onChangeSelect, showFirstBlank = false, onBlur} = props;
    props = _.cloneDeep(props);
    delete props.showFirstBlank;

    if (type.toLowerCase() === 'select') {
        if (!Array.isArray(options) || !options.length) {
            console.error('Options are mandatory in array format');
        }
        const opts = options.map((opt, i) => {
            return <option value={opt[valueKey]}>{opt[labelKey]}</option>
        })
        if(showFirstBlank) opts.unshift(<option value=''>{'Select an option'}</option>)
        return <Input
            {...props}
            onChange={onChangeSelect}
            id={label}
            type={type}
        >{opts}</Input>
    }
    return <Input
        id={label}
        type={type}
        {...props}
    />
}
const InputField = (props = {}) => {
    const {label = '', type = 'text', multiple = false, onChange, labelStyle = {}, direction = 'column', formGrpStyle={}, errorText = '', onBlur} = props;

    const onChangeSelect = (e) => {
        if (type.toLowerCase() === 'select' && multiple) {
            const {options, name} = e.target;
            const values = [];
            for (let i = 0, l = options.length; i < l; i++) {
                if (options[i].selected) {
                    values.push(options[i].value);
                }
            }
            if (onChange) onChange(e, values, name)
        } else if (onChange) onChange(e)
    }
    return (
        <FormGroup style={direction === 'row' ? {display: 'flex', alignItems: 'center', ...formGrpStyle} : {...formGrpStyle}}>
            {label && <label
                className="form-control-label"
                htmlFor={label}
                style={{color: '#525F7F', marginRight: 8, ...labelStyle}}
            >
                {label}
            </label>}
            <InputPure {...props} onChangeSelect={onChangeSelect}/>
            {errorText && <p style={{color: 'red'}}>{errorText}</p>}
        </FormGroup>
    )
}

export default InputField;