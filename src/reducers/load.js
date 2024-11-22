import {
  GET_LOADS,
  GET_LOAD,
  LOAD_ERROR,
  ADD_LOAD,
  DELETE_LOAD,
  PATCH_PICKUP,
  PICKUP_ERROR,
  PATCH_DROP,
  DROP_ERROR,
  UPDATE_LOAD,
  UPDATE_LOAD_ERROR,
  LOAD_DOC_DELETE,
  RETURNED_SEARCHED_LOADS,
  RESET_SEARCHED_LOADS,
  SELECT_LOAD,
  LOAD_DOC_UPLOAD,
  INVOICE_CREATED,
  INVOICE_LOAD_FETCHED,
  MERGE_LOAD_DOCS,
  RESET_INVOICE_GENERATED, LOADS_FETCHING
} from '../actions/types';

const initialState = {
  loads: [],
  load: null,
  loading: true,
  loads_pagination: {},
  page: 0,
  rowsPerPage: 100,
  error: {},
  search: {
    query: '',
    loads: [],
    page: 0,
    limit: 15,
    total:0,
    totalPages: 0,
  },
  invoices: {
    search: '',
    data: [],
    page: 0,
    limit: 5,
    total: 0,
    totalPages: 0,
    isRefetching: false,
    loading: false
  },
  invoiceGenerated: null,
  isLoadsFetching: false
};

export default function(state = initialState, action) {
  const { type, payload } = action;

  switch(type) {
    case LOADS_FETCHING:
      return {
        ...state,
        isLoadsFetching: payload.isLoadsFetching
      }
    case GET_LOADS:
      return {
        ...state,
        allLoads: payload.loads.allLoads,
        loads: payload.loads.load,
        loads_pagination: {
          limit: payload.loads.limit,
          total: payload.loads.total,
          totalPages: payload.loads.totalPages,
          currPage: payload.loads.currentPage
        },
        page: payload.page,
        rowsPerPage: payload.limit,
        loading: false,
        load: null
      };
    case INVOICE_LOAD_FETCHED:
      return {
        ...state,
        invoices: {
          ...state.invoices,
          data: payload.data,
          search: payload.search,
          page: payload.page,
          limit: payload.limit,
          total: payload.total,
          totalPages: payload.totalPages,
          loading: payload.loading,
          isRefetching: payload.isRefetching,
        }
      };
    case LOAD_DOC_DELETE:
      return {
        ...state,
        invoices: {
          ...state.invoices,
          data: state.invoices.data.map(invoice => {
            if (invoice._id === payload.load_id) {
              invoice[payload.doc_type] = [];
            }
            return invoice;
          })
        }
      };
    case LOAD_DOC_UPLOAD:
      return {
        ...state,
        invoices: {
          ...state.invoices,
          data: state.invoices.data.map(invoice => {
            if (invoice._id === payload.load_id) {
              invoice[payload.doc_type] = payload.file_data;
            }
            return invoice;
          })
        }
      }
    case INVOICE_CREATED:
      return {
        ...state,
        invoices: {
          ...state.invoices,
          data: state.invoices.data.filter(invoice => invoice._id !== payload.load_id)
        }
      }
    case SELECT_LOAD:
      return {
        ...state,
        load: payload
      };
    case RETURNED_SEARCHED_LOADS:
      return {
        ...state,
        search: {
          query: payload.search,
          loads: payload.data.load,
          page: +payload.page,
          limit: +payload.data.limit,
          total: payload.data.total,
          totalPages: payload.data.totalPages
        },
        load: null
      };
    case RESET_SEARCHED_LOADS:
      return {
        ...state,
        search: {
          query: '',
          loads: [],
          page: 0,
          limit: 5,
          total:0,
          totalPages: 0,
        }
      }
      case GET_LOAD:
        return {
          ...state,
          load: payload,
          loading: false
        };
      case ADD_LOAD:
        let newLoads = state.loads;
        if (newLoads.length === 5)
          newLoads.splice(-1, 1);
        newLoads = [payload, ...newLoads];
        return {
          ...state,
          loads: newLoads,
          loads_pagination: { ...state.loads_pagination, total: state.loads_pagination.total+1 },
          loading: false
        };
      case UPDATE_LOAD:
        // don't remove if update event triggered from load status view
        return {
          ...state,
          error: {},
          loads: payload.status !== 'Delivered' ? state.loads.map(l => {
            if (l._id === payload._id) {
              return payload;
            }
            return l;
          }) : state.loads.filter(l => l._id !== payload._id),
          loads_pagination: {
            ...state.loads_pagination,
            total: payload.status === 'Delivered' ? --state.loads_pagination.total : state.loads_pagination.total 
          },
          loading: false
        };
      case DELETE_LOAD:
        return {
          ...state,
          loads: state.loads.filter(load => load._id !== payload),
          loading: false
        }
      case LOAD_ERROR:
        return {
          ...state,
          error: payload,
          loading: false
      };
      case UPDATE_LOAD_ERROR:
        return {
          ...state,
          error: payload,
          loading: false
      };
      case PATCH_PICKUP:
        return{
          ...state,
          load: payload,
          loading: false,
        }
      case PICKUP_ERROR:
        return{
          ...state,
          error:payload,
          loading: false,
        };
      case PATCH_DROP:
        return{
          ...state,
          load: payload,
          loading:false,
        };
      case DROP_ERROR:
        return{
          ...state,
          load: payload,
          loading:false,
        };

      case MERGE_LOAD_DOCS:
        return {
          ...state,
          invoiceGenerated: payload,
          loading: false
        }

      case RESET_INVOICE_GENERATED:
        return {
          ...state,
          invoiceGenerated: null,
          loading: false
        }
      default:
        return state;
  }

}
