import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import { DataGrid, type GridColDef, type GridRowId } from '@mui/x-data-grid';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';

interface CustomDataGridProps {
  rows: any[];
  columns: GridColDef[];
  loading?: boolean;
  onView?: (id: GridRowId) => void;
  onEdit?: (id: GridRowId) => void;
  onDelete?: (id: GridRowId) => void;
}

const CustomDataGrid = ({
  rows,
  columns,
  loading = false,
  onView,
  onEdit,
  onDelete,
}: CustomDataGridProps) => {
  const finalColumns: GridColDef[] = [
    ...columns,
    {
      field: 'actions',
      headerName: 'Actions',
      width: 140,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            gap: 0.5,
          }}
        >
          {onView && (
            <Tooltip title="View">
              <IconButton size="small" color="info" onClick={() => onView(params.id)}>
                <VisibilityOutlinedIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
          {onEdit && (
            <Tooltip title="Edit">
              <IconButton size="small" color="primary" onClick={() => onEdit(params.id)}>
                <EditOutlinedIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
          {onDelete && (
            <Tooltip title="Delete">
              <IconButton size="small" color="error" onClick={() => onDelete(params.id)}>
                <DeleteOutlineOutlinedIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      ),
    },
  ];

  return (
    <DataGrid
      rows={rows}
      columns={finalColumns}
      loading={loading}
      getRowHeight={() => 'auto'} // Core rule: dynamic auto-measurement hook
      pageSizeOptions={[10, 20, 50]}
      initialState={{
        pagination: {
          paginationModel: {
            page: 0,
            pageSize: 10,
          },
        },
      }}
      disableRowSelectionOnClick
      sx={{
        border: 0,
        '& .MuiDataGrid-columnHeaders': {
          backgroundColor: 'var(--primary)',
          color: '#fff',
          fontWeight: 600,
        },
        '& .MuiDataGrid-row:nth-of-type(even)': {
          backgroundColor: 'var(--surface-hover)',
        },
        // FIX OVERLAP: Forces grid layout wrappers to expand properly
        '& .MuiDataGrid-cell': {
          display: 'flex !important',
          alignItems: 'center', // Vertically centers your dynamic boxes
          paddingTop: '12px !important',
          paddingBottom: '12px !important',
          whiteSpace: 'normal !important',
          maxHeight: 'none !important',
          overflow: 'visible !important',
        },
        // Allows custom wrapper containers inside cells to grow naturally
        '& .MuiDataGrid-cellContent': {
          maxHeight: 'none !important',
          display: 'block',
          width: '100%',
        },
      }}
    />
  );
};

export default CustomDataGrid;
