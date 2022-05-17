import React, { Fragment, useEffect } from "react";
import { Button } from "@mui/material";
import { Route, useHistory, useRouteMatch } from "react-router-dom";
import EnhancedTable from "../../components/Atoms/table/Table";
import axios from "axios";
import OwnerOpDetails from "./OwnerOpLoadDetail";


const OwnerOperator = () => {
  const { path } = useRouteMatch(),
    history = useHistory();


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
        renderer: ({ row }) => {
          const date = new Date(row.deliverBy).toDateString();
          return <Fragment>Owner Operator</Fragment>;
        },
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
                  history.push(`/${row.loadNumber}/bid`);
                }}
                sx={{mr: 1}}
              >
                Update
              </Button>
              <Button
                  variant="contained"
                  color={'error'}
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
        data={[]}
        loading={false}
      />
      <Route path={path + "/:loadNumber"} component={OwnerOpDetails} />
    </div>
  );
};

export default OwnerOperator;
