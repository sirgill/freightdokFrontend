import React, {Fragment, useCallback, useEffect} from "react";
import {Button} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import {Link, Route, useHistory, useRouteMatch} from "react-router-dom";
import EnhancedTable from "../../components/Atoms/table/Table";
import FormModal from "./FormModal";
import {addEvent, removeEvent} from "../../utils/utils";
import {showDelete} from "../../actions/component.action";
import {UserSettings} from "../../components/Atoms/client";
import useFetchWithSearchPagination from "../../hooks/useFetchWithSearchPagination";


const OwnerOperator = () => {
  const { path } = useRouteMatch(),
        {edit, delete: canDelete, add} = UserSettings.getUserPermissionsByDashboardId('ownerOperator'),
        {data: queryData, loading, page, isPaginationLoading, limit, onLimitChange, onPageChange, refetch, isRefetching} = useFetchWithSearchPagination('/api/ownerOperator'),
        { data, totalCount} = queryData || {},
        history = useHistory();

  const fetchOwnerOp = useCallback(() => {
        refetch();
    }, [refetch]);

  useEffect(() => {
      addEvent(window, 'refreshOwnerOp', fetchOwnerOp)

      return () => removeEvent(window, 'refreshOwnerOp', fetchOwnerOp)
  }, [fetchOwnerOp])

    const afterDelete = ({success}) => {
        if(success) {
            fetchOwnerOp()
        }
    }


  const tableConfig = {
    rowCellPadding: "normal",
    showRefresh: true,
    emptyMessage: "No Owner Operator Found",
    count: totalCount,
      page,
      limit,
      onPageSizeChange: onLimitChange,
      onPageChange,
    columns: [
      {
        id: "firstName",
        label: "First Name",
        emptyState: '--',
      },
      {
        id: "lastName",
        label: "Last Name",
        emptyState: '--',
      },
      {
        id: "role",
        label: "Role",
        renderer: () => {
          return <Fragment>Owner Operator</Fragment>;
        },
      },
        {
            id: 'email',
            label: 'Email'
        },
      {
        id: "update",
        renderer: ({ row }) => {
          return (
            <Fragment>
              <Button
                variant="contained"
                onClick={(e) => {
                  e.stopPropagation();
                  history.push(path + `/edit/${row._id}`);
                }}
                sx={{mr: 1}}
                disabled={!edit}
              >
                Update
              </Button>
              <Button
                  variant="contained"
                  color={'error'}
                  onClick={showDelete({
                      uri: "/api/ownerOperator/"+ row._id,
                      message: 'Are you sure you want to delete this Owner Operator?',
                      afterSuccessCb: afterDelete
                  })}
                  disabled={!canDelete}
              >
                Delete
              </Button>
            </Fragment>
          );
        },
      },
    ],
  };
  const Actions = <Button
      variant='contained'
      component={Link}
      to={path + '/add'}
      disabled={!add}
      startIcon={<AddIcon />}
  >
      Add
  </Button>

  return (
    <>
      <EnhancedTable
        config={tableConfig}
        data={data}
        loading={loading}
        isRefetching={isRefetching}
        onRefetch={refetch}
        isPaginationLoading={isPaginationLoading}
        actions={Actions}
      />

      <Route path={path + "/add"} render={(props) => <FormModal {...props} onCloseUrl={path} />} />
      <Route path={path + "/edit/:id"} render={(props) => <FormModal {...props} onCloseUrl={path} />} />
    </>
  );
};

export default OwnerOperator;
