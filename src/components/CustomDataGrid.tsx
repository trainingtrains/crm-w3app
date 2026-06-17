import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';

import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';

import { DataGrid } from '@mui/x-data-grid';

import type {
  GridColDef,
  GridRenderCellParams,
  GridRowId,
  GridValidRowModel,
} from '@mui/x-data-grid';

export interface CustomDataGridProps<T extends GridValidRowModel> {
  rows: T[];
  columns: GridColDef[];

  loading?: boolean;
  height?: number;

  showActions?: boolean;

  onView?: (id: GridRowId, row: T) => void;

  onEdit?: (id: GridRowId, row: T) => void;

  onDelete?: (id: GridRowId, row: T) => void;
}

export function CustomDataGrid<T extends GridValidRowModel>({
  rows,
  columns,

  loading = false,
  height = 600,

  showActions = true,

  onView,
  onEdit,
  onDelete,
}: CustomDataGridProps<T>) {
  const actionColumn: GridColDef = {
    field: 'actions',

    headerName: 'Actions',

    width: 150,

    sortable: false,

    filterable: false,

    disableColumnMenu: true,

    align: 'center',

    headerAlign: 'center',

    renderCell: (params: GridRenderCellParams) => (
      <Stack direction="row" spacing={0.5}>
        {onView && (
          <Tooltip title="View">
            <IconButton
              color="info"
              size="small"
              onClick={() => onView(params.id, params.row as T)}
            >
              <VisibilityOutlinedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )}

        {onEdit && (
          <Tooltip title="Edit">
            <IconButton
              color="primary"
              size="small"
              onClick={() => onEdit(params.id, params.row as T)}
            >
              <EditOutlinedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )}

        {onDelete && (
          <Tooltip title="Delete">
            <IconButton
              color="error"
              size="small"
              onClick={() => onDelete(params.id, params.row as T)}
            >
              <DeleteOutlineOutlinedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )}
      </Stack>
    ),
  };

  const finalColumns = showActions ? [...columns, actionColumn] : columns;

  return (
    <Paper
      elevation={0}
      sx={{
        width: '100%',
        mt: 3,
        borderRadius: 3,
        overflow: 'hidden',
        border: '1px solid',
        borderColor: 'divider',
      }}
    >
      <DataGrid
        rows={rows}
        columns={finalColumns}
        loading={loading}
        disableRowSelectionOnClick
        pageSizeOptions={[10, 25, 50, 100]}
        disableColumnMenu
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 10,
              page: 0,
            },
          },
        }}
        sx={{
          height,

          border: 0,

          '& .MuiDataGrid-columnHeaders .MuiDataGrid-columnHeader': {
            backgroundColor: '#000000 !important',
            borderBottom: '2px solid #e2e8f0',
          },

          '& .MuiDataGrid-columnHeaderTitle': {
            fontWeight: 700,
            color:"#ffffff"
          },

          '& .MuiDataGrid-row:nth-of-type(even)': {
            backgroundColor: '#fafafa',
          },

          '& .MuiDataGrid-row:hover': {
            backgroundColor: '#e3f2fd',
            cursor: 'pointer',
          },

          '& .MuiDataGrid-cell': {
            borderColor: '#f1f5f9',
          },

          '& .MuiDataGrid-footerContainer': {
            borderTop: '1px solid #e2e8f0',
          },
        }}
      />
    </Paper>
  );
}

export default CustomDataGrid;
