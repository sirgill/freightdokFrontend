import {Input, LoadingButton} from "../../../components/Atoms";
import {Box} from "@mui/material";
import {memo, useCallback, useState} from "react";
import useMutation from "../../../hooks/useMutation";
import {CREATE_ADDITIONAL_CATEGORY} from "../../../config/requestEndpoints";
import {notification} from "../../../actions/alert";

const AddCategoryComponent = ({visible, onRefetch}) => {
    const [input, setInput] = useState('');
    const {mutation, loading} = useMutation(CREATE_ADDITIONAL_CATEGORY)

    const onSubmit = useCallback((e) => {
        e.preventDefault();
        console.log(input)
        mutation({category: input}, 'post')
            .then(({success, data}) => {
                if(success){
                    notification(data.message);
                    onRefetch();
                    setInput('');
                } else {
                    notification(data.message, 'error');
                }
            })
    }, [input, mutation, onRefetch])

    if(!visible) {
        return null;
    }

    return <Box sx={{display: 'flex', gap: 1}} component='form' onSubmit={onSubmit}>
        <Input isCapitalize label='Add Category' value={input} onChange={({value}) => setInput(value)} />
        <LoadingButton type='submit' isLoading={loading}>{loading ? 'Adding...' : 'Add'}</LoadingButton>
    </Box>
}

export default memo(AddCategoryComponent);