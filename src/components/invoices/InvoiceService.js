import React, { useMemo, Fragment, useState } from "react";
import './styles.css'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { Button, IconButton, List, Popover, Stack, ListItem, ListItemText, ListItemButton } from "@mui/material";
import InputField from "../Atoms/form/InputField";
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

const LOOKUP_DATA = [
    { label: "Detention", cost: '67' },
    { label: "Loads", cost: '1000' },
    { label: "Lumper", cost: '786' },
]

const InvoiceService = ({ serviceName, amount, price, quantity, description, index, deleteService, onChangeService }) => {
    const handleChange = (e) => {
        const name = e.target.name
        const value = e.target.value
        if (onChangeService) {
            onChangeService(index, { name, value })
        }
    }

    const handleQuantity = (e) => {
        const name = e.target.name
        const value = parseInt(e.target.value)
        onChangeService(index, { name, value })
    }

    const onBlur = (e) => {
        const value = parseInt(e.target.value)
        const name = e.target.name
        if (value < 1) {
            if (onChangeService) {
                onChangeService(index, { name, value: 1 })
                onChangeService(index, { name: 'price', value: parseInt(amount) });

            }
        } else {
            if (onChangeService) {
                onChangeService(index, { name, value });
                onChangeService(index, { name: 'price', value: parseInt(amount) * value });
            }
        }
    }

    return (
        <Fragment>
            <tr className='invoiceServiceRow'>
                <td>{serviceName}</td>
                <td><InputField name={'description'} value={description} onChange={handleChange} className='serviceInputField'
                    placeholder={'Enter item description'} /></td>
                <td><InputField name={'quantity'} onChange={handleQuantity} onBlur={onBlur} className='serviceInputField' type='number' value={quantity} /></td>
                <td><InputField name={'price'} onChange={handleChange} value={price} className='serviceInputField' /></td>
                <td>{price ? `$${parseFloat(price).toFixed(2)}` : '$0.00'}</td>
                <td><IconButton onClick={deleteService.bind(null, index)}>
                    <DeleteOutlineIcon color={'error'} />
                </IconButton></td>
            </tr>
        </Fragment>
    )
}


const InvoiceDataTableRows = ({ price = 99 }) => {
    return (<Fragment>
        <tr className='InvoiceDataTableRows'>
            <td>9</td>
            <td>a</td>
            <td>b</td>
            <td>c</td>
            <td>{price ? `$${parseFloat(price).toFixed(2)}` : '$0.00'}</td>
        </tr>
    </Fragment>)
}

const LookUp = ({ handleClose, anchorEl, onAddNewService }) => {
    const [list, setList] = useState(LOOKUP_DATA)
    const onChange = (e) => {
        const val = e.target.value.toLowerCase();
        if (val) {
            const filtered = list.filter(item => item.label.toLowerCase().includes(val));
            setList(filtered)
        } else setList(LOOKUP_DATA)
    }

    const handleClick = (selected) => {
        if (onAddNewService) {
            onAddNewService(selected)
        }
        handleClose()
    }

    return <Popover
        id={'jugal'}
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
        }}
        transformOrigin={{
            vertical: 'center',
            horizontal: 'left',
        }}
    >
        <Stack sx={{ p: 2, width: 500 }}>
            <Stack>
                <InputField name={'search'} autoFocus placeholder='Type on item name' onChange={onChange} />
            </Stack>
            <Stack>
                <List>
                    {list.map(data => {
                        return <ListItemButton key={data.label} onClick={handleClick.bind(null, data)}>
                            <ListItem disablePadding secondaryAction={<span
                                className={'listButtonPickerCost'}>{"$" + data.cost}</span>}>
                                <ListItemText primary={data.label} />
                            </ListItem>
                        </ListItemButton>
                    })}
                </List>
            </Stack>
            <Stack>
                <Button startIcon={<AddCircleOutlineIcon />}>
                    Create a new Item
                </Button>
            </Stack>
        </Stack>
    </Popover>
}

const InvoiceServiceWrapper = ({ services, onAddNewService, onChangeService, deleteService }) => {
    // console.log('services', services)
    const [anchorEl, setAnchorEl] = React.useState(null);
    const servicesComp = useMemo(() => {
        return services.map((s, index) => {
            return <InvoiceService {...s} index={index} onChangeService={onChangeService}
                deleteService={deleteService} />
        })
    }, [services])

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <React.Fragment>
            <table className='invoiceServiceTable'>
                <tr className='tableHeader'>
                    <th>Services</th>
                    <th />
                    <th>Quantity</th>
                    <th>Price</th>
                    <th>Amount</th>
                    <th />
                </tr>
                {servicesComp}
                <tr className='addNewItemRow'>
                    <td className='addNewItem' onClick={handleClick}>
                        <Button sx={{ width: 135 }} startIcon={<AddCircleOutlineIcon />} aria-describedby={'jugal'}>
                            Add new item
                        </Button>
                    </td>
                </tr>
            </table>
            <LookUp handleClose={handleClose} anchorEl={anchorEl} onAddNewService={onAddNewService} />
        </React.Fragment>
    )
}

export default InvoiceServiceWrapper;