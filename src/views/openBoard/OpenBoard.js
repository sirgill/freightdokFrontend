import React, { Fragment, useEffect } from "react";
import { Button } from "@mui/material";
import { Route, useHistory, useRouteMatch } from "react-router-dom";
import EnhancedTable from "../../components/Atoms/table/Table";
import LoadDetails from "./LoadDetails";
import {
  bookNow,
  getBiddings,
} from "../../actions/openBoard.action";
import Form from "./Form";
import { withRouter } from "react-router-dom/cjs/react-router-dom.min";
import { useDispatch, useSelector } from "react-redux";

const payload = JSON.stringify({
  pageIndex: 0,
  pageSize: 100,
  regionCode: "NA",
  modes: ["V", "R"],
  carrierCode: "T2244688",
});

const OpenBoard = () => {
  const { path } = useRouteMatch(),
    dispatch = useDispatch(),
    { data: { results, totalResults } = {}, loading = false } = useSelector(
      (state) => state.openBoard
    ),
    history = useHistory();

  useEffect(() => {
    dispatch(getBiddings(payload));
  }, [dispatch]);

  const afterBookNow = ({ success = false }) => {
    if (success) {
      dispatch(getBiddings(payload));
    }
  };

  const handleBookNow = (row, e) => {
    e.stopPropagation();
    Object.assign(row, { defaultEmail: "vy4693@gmail.com", env: "dev" });
    bookNow(row, afterBookNow);
  };

  const tableConfig = {
    rowCellPadding: "inherit",
    emptyMessage: "No Shipments Found",
    onRowClick: ({ loadNumber }) => `${path}/${loadNumber}`,
    // count: totalResults,
    // limit: 10,
    columns: [
      {
        id: "loadNumber",
        label: "Load Number",
        renderer: ({ row }) => {
          return <Fragment>{row.loadNumber}</Fragment>;
        },
      },
      {
        id: "country",
        label: "Pickup Country/State",
        renderer: ({ row }) => {
          return (
            <Fragment>
              {row.origin.county}, {row.origin.stateCode}
            </Fragment>
          );
        },
      },
      {
        id: "pickupDate",
        label: "Pickup By",
        renderer: ({ row }) => {
          const date = new Date(row.pickUpByDate).toDateString();
          return <Fragment>{date}</Fragment>;
        },
      },
      {
        id: "dropCountry",
        label: "Drop Country/State",
        renderer: ({ row }) => {
          return (
            <Fragment>
              {row.destination.county}, {row.destination.stateCode}
            </Fragment>
          );
        },
      },
      {
        id: "dropDate",
        label: "Deliver By",
        renderer: ({ row }) => {
          const date = new Date(row.deliverBy).toDateString();
          return <Fragment>{date}</Fragment>;
        },
      },
      {
        id: "bookNow",
        label: "Book Now",
        renderer: ({ row = {} }) => {
          if (row.hasOwnProperty("availableLoadCosts")) {
            const { availableLoadCosts = [] } = row || {};
            const [item] = availableLoadCosts || [];
            if (item) {
              return (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleBookNow.bind(this, row)}
                >
                  $ {item.sourceCostPerUnit}
                </Button>
              );
            }
          }
          return null;
        },
      },
      {
        id: "Bidding",
        label: "Bid",
        renderer: ({ row }) => {
          return (
            <Fragment>
              <Button
                variant="contained"
                color="success"
                onClick={(e) => {
                  e.stopPropagation();
                  history.push(path + `/${row.loadNumber}/bid`, row);
                }}
              >
                Bid +
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
        data={results || []}
        loading={loading}
      />
      <Route path={path + "/:loadNumber"} exact component={LoadDetails} />
      <Route path={path + "/:loadNumber/bid"} component={Form} />
    </div>
  );
};

export default withRouter(OpenBoard);
