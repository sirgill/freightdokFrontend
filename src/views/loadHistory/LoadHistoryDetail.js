import useFetchWithSearchPagination from "../../hooks/useFetchWithSearchPagination";
import {deleteLoad, selectLoad} from "../../actions/load";
import LoadDetailModal from "../../components/loads/LoadDetailModal";
import {useDispatch} from "react-redux";
import {UserSettings} from "../../components/Atoms/client";
import {FullScreenLoader} from "../../components/Atoms";

const LoadHistoryDetail = (props) => {
    const {edit} = UserSettings.getUserPermissionsByDashboardId('loads');
    const {match: {params: {id} = {}} = {}} = props;
    const dispatch = useDispatch()
    const {loading = true, data: {data = {}} = {}} = useFetchWithSearchPagination('/api/loadHistory/' + id);

    if(loading){
        return  <FullScreenLoader />
    }

    return <LoadDetailModal
        modalEdit={false}
        open={!loading}
        load={data}
        handleClose={({history}) => {
            history.goBack()
            dispatch(selectLoad());
        }}
        deleteLoad={(_id) => dispatch(deleteLoad(_id))}
        canUpdate={!!edit}
    />
}

export default LoadHistoryDetail;