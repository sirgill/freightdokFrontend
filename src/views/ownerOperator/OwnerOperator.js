import React, {Fragment, useEffect, useState} from "react";
import {Button} from "@mui/material";
import {Link, Route, useHistory, useRouteMatch} from "react-router-dom";
import EnhancedTable from "../../components/Atoms/table/Table";
import axios from "axios";
import {getBaseUrl} from "../../config";
import FormModal from "./FormModal";
import {notification} from "../../actions/alert";
import {addEvent, removeEvent} from "../../utils/utils";


const OwnerOperator = () => {
  const { path } = useRouteMatch(),
      [row, setRow] = useState([]),
      [loading, setLoading] = useState(false),
    history = useHistory();

  function fetchOwnerOp() {
      setLoading(true);
      axios.get(getBaseUrl() + '/api/ownerOperator').then(r => {
          const {data: {data = []} = {}} = r;
          setRow(data);
          setLoading(false);
      })
          .catch(err => {
              console.log(err.message)
              setLoading(false);
          })
  }

  useEffect(() => {
      fetchOwnerOp();
      addEvent(window, 'refreshOwnerOp', fetchOwnerOp)

      return () => removeEvent(window, 'refreshOwnerOp', fetchOwnerOp)
  }, [])

    const onDelete = (id, e) => {
      e.stopPropagation();
      axios.delete(getBaseUrl() + "/api/ownerOperator/"+id)
          .then(({data = {}}) => {
              notification(data.message)
              fetchOwnerOp()
          })
        .catch(err => console.log(err.message))
    }

  const tableConfig = {
    rowCellPadding: "inherit",
    emptyMessage: "No Owner Operator Found",
    columns: [
      {
        id: "firstName",
        label: "First Name",
      },
      {
        id: "lastName",
        label: "Last Name",
      },
      {
        id: "role",
        label: "Role",
        renderer: () => {
          return <Fragment>Owner Operator</Fragment>;
        },
      },

      {
        id: "update",
        renderer: ({ row, role }) => {
          return (
            <Fragment>
              <Button
                variant="contained"
                onClick={(e) => {
                  e.stopPropagation();
                  history.push(path + `/edit/${row._id}`);
                }}
                sx={{mr: 1}}
              >
                Update
              </Button>
              <Button
                  variant="contained"
                  color={'error'}
                  onClick={onDelete.bind(this, row._id)}
                  disabled={['ownerOperator', 'dispatch',].includes(role)}
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
        data={row}
        loading={loading}
      />
        <Button
            variant='contained'
            component={Link}
            to={path + '/add'}
            className={'addNewOwnerOp'}
            sx={{position: 'absolute', right: 10}}
        >
            Add Owner Operator
        </Button>
      <Route path={path + "/add"} render={(props) => <FormModal {...props} onCloseUrl={path} />} />
      <Route path={path + "/edit/:id"} render={(props) => <FormModal {...props} onCloseUrl={path} />} />
    </div>
  );
};

export default OwnerOperator;
