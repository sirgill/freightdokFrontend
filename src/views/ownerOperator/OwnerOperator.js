import React, {Fragment, useCallback, useEffect} from "react";
import {Button} from "@mui/material";
import {Route, useHistory, useRouteMatch} from "react-router-dom";
import EnhancedTable from "../../components/Atoms/table/Table";
import FormModal from "./FormModal";
import {addEvent, removeEvent} from "../../utils/utils";
import {showDelete} from "../../actions/component.action";
import {UserSettings} from "../../components/Atoms/client";
import useEnhancedFetch from "../../hooks/useEnhancedFetch";


const OwnerOperator = () => {
  const { path } = useRouteMatch(),
      {edit, delete: canDelete} = UserSettings.getUserPermissionsByDashboardId('ownerOperator'),
          {data: queryData = {}, isRefetching, loading, refetch, page, limit, onLimitChange, onPageChange, isPaginationLoading} = useEnhancedFetch('/api/ownerOperator', {
          page: 1, limit: 10
      }),
      {data, totalCount} = queryData || {},
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
    rowCellPadding: "inherit",
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

  return (
    <div>
      <EnhancedTable
        config={tableConfig}
        data={data}
        loading={loading}
        isRefetching={isRefetching}
        onRefetch={refetch}
        isPaginationLoading={isPaginationLoading}
      />
        {/*<Button*/}
        {/*    variant='contained'*/}
        {/*    component={Link}*/}
        {/*    to={path + '/add'}*/}
        {/*    className={'addNewOwnerOp'}*/}
        {/*    sx={{position: 'absolute', right: 10}}*/}
        {/*>*/}
        {/*    Add Owner Operator*/}
        {/*</Button>*/}
      <Route path={path + "/add"} render={(props) => <FormModal {...props} onCloseUrl={path} />} />
      <Route path={path + "/edit/:id"} render={(props) => <FormModal {...props} onCloseUrl={path} />} />
    </div>
  );
};

export default OwnerOperator;
