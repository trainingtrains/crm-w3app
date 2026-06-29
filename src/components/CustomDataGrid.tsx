import { memo, useMemo, type JSX } from 'react';

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

// ─── Constants ───────────────────────────────────────────────────────────────

const ACTIONS_FIELD = 'actions' as const;
const PAGINATION_MODEL = { pageSize: 10, page: 0 } as const;
const PAGE_SIZE_OPTIONS = [10, 25, 50, 100] as const;

// ─── Types ───────────────────────────────────────────────────────────────────

export interface CustomDataGridProps<T extends GridValidRowModel> {
  rows: T[];
  columns: GridColDef<T>[];
  loading?: boolean;
  height?: number | string;
  showActions?: boolean;
  onView?: (id: GridRowId, row: T) => void;
  onEdit?: (id: GridRowId, row: T) => void;
  onDelete?: (id: GridRowId, row: T) => void;
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const ACTION_STACK_SX = {
  height: '100%',
  alignItems: 'center',
  justifyContent: 'center',
} as const;

const getDataGridSx = (height: number | string) =>
  ({
    height,
    border: 0,
    my: 2,

    '& .MuiDataGrid-columnHeaders .MuiDataGrid-columnHeader': {
      backgroundColor: '#000000 !important',
      borderBottom: '2px solid #e2e8f0',
    },
    '& .MuiDataGrid-columnHeaderTitle': {
      fontWeight: 700,
      color: '#ffffff',
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

    // ── Sticky actions column (Community edition workaround) ──
    [`& .MuiDataGrid-cell[data-field="${ACTIONS_FIELD}"]`]: {
      position: 'sticky',
      right: 0,
      zIndex: 3,
      backgroundColor: '#ffffff',
      boxShadow: '-2px 0 4px rgba(0,0,0,0.08)',
    },
    [`& .MuiDataGrid-row:nth-of-type(even) .MuiDataGrid-cell[data-field="${ACTIONS_FIELD}"]`]: {
      backgroundColor: '#fafafa',
    },
    [`& .MuiDataGrid-row:hover .MuiDataGrid-cell[data-field="${ACTIONS_FIELD}"]`]: {
      backgroundColor: '#e3f2fd',
    },
    [`& .MuiDataGrid-columnHeader[data-field="${ACTIONS_FIELD}"]`]: {
      position: 'sticky',
      right: 0,
      zIndex: 4,
      backgroundColor: '#000000 !important',
      boxShadow: '-2px 0 4px rgba(0,0,0,0.08)',
    },
  }) as const;

// ─── Action Cell ─────────────────────────────────────────────────────────────

interface ActionCellProps<T extends GridValidRowModel> {
  params: GridRenderCellParams<T>;
  onView?: (id: GridRowId, row: T) => void;
  onEdit?: (id: GridRowId, row: T) => void;
  onDelete?: (id: GridRowId, row: T) => void;
}

const ActionCell = memo(
  <T extends GridValidRowModel>({ params, onView, onEdit, onDelete }: ActionCellProps<T>) => (
    <Stack direction="row" spacing={0.5} sx={ACTION_STACK_SX}>
      {onView && (
        <Tooltip title="View">
          <IconButton color="info" size="small" onClick={() => onView(params.id, params.row as T)}>
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
  )
) as <T extends GridValidRowModel>(props: ActionCellProps<T>) => JSX.Element;

// ─── Component ───────────────────────────────────────────────────────────────

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
  const finalColumns = useMemo<GridColDef<T>[]>(() => {
    const filtered = columns.filter((col) => col.field !== ACTIONS_FIELD);

    if (!showActions) return filtered;

    const actionColumn: GridColDef<T> = {
      field: ACTIONS_FIELD,
      headerName: 'Actions',
      width: 150,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params: GridRenderCellParams<T>) => (
        <ActionCell params={params} onView={onView} onEdit={onEdit} onDelete={onDelete} />
      ),
    };

    return [...filtered, actionColumn];
  }, [columns, showActions, onView, onEdit, onDelete]);

  const sx = useMemo(() => getDataGridSx(height), [height]);

  return (
    <DataGrid<T>
      rows={rows}
      columns={finalColumns}
      loading={loading}
      disableRowSelectionOnClick
      disableColumnMenu
      pageSizeOptions={PAGE_SIZE_OPTIONS as unknown as number[]}
      initialState={{
        pagination: { paginationModel: PAGINATION_MODEL },
      }}
      sx={sx}
    />
  );
}

export default CustomDataGrid;
