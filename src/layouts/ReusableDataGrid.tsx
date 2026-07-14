import React, { useMemo } from 'react';
import { Box, Button } from '@mui/material';
import { DataGrid, type GridColDef, type GridRenderCellParams } from '@mui/x-data-grid';

interface ReusableDataGridProps {
  /** Array of objects representing rows */
  data: Record<string, any>[];
  loading?: boolean;
  /** Height of the scrollable grid viewport */
  maxHeight?: number | string;
  /** Callback function triggered when the View button is clicked */
  onView?: (row: any) => void;
  /** Callback function triggered when the Export CSV button is clicked */
  onExportCSV?: () => void;
}

const ReusableDataGrid: React.FC<ReusableDataGridProps> = ({
  data = [],
  loading = false,
  maxHeight = 560,
  onView,
  onExportCSV,
}) => {
  const columns: GridColDef[] = useMemo(() => {
    if (!data || data.length === 0) return [];

    const generatedCols: GridColDef[] = Object.keys(data[0])
      .filter((key) => key.toLowerCase() !== 'id') // Filters out 'id', 'Id', 'ID', etc.
      .map((key) => {
        const formattedHeader = key
          .replace(/([A-Z])/g, ' $1')
          .replace(/[_-]/g, ' ')
          .replace(/^./, (str) => str.toUpperCase())
          .trim();

        return {
          field: key,
          headerName: formattedHeader,
          flex: 1,
          minWidth: 150,
          valueGetter: (value: any) => {
            if (value && typeof value === 'object') {
              if ('value' in value) {
                return value.value;
              }
              if ('label' in value) {
                return value.label;
              }
            }
            return value;
          },
        };
      });

    const actionsCol: GridColDef = {
      field: 'actions',
      headerName: 'Actions',
      width: 100,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      renderCell: (params: GridRenderCellParams) => (
        <Button
          size="small"
          variant="text"
          onClick={() => onView && onView(params.row)}
          disabled={!onView}
        >
          View
        </Button>
      ),
    };

    return [...generatedCols, actionsCol];
  }, [data, onView]);

  const rowsWithIds = useMemo(() => {
    return data.map((item, index) => ({
      id: item.id || item.uuid || `row-${index}`,
      ...item,
    }));
  }, [data]);

  return (
    <Box sx={{ width: '100%', mt: 2 }}>
      {onExportCSV && data.length > 0 && (
        <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 2 }}>
          <Button variant="outlined" onClick={onExportCSV}>
            Export CSV
          </Button>
        </Box>
      )}
      {!data.length ? (
        <Box
          sx={{
            p: 3,
            textAlign: 'center',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius)',
            bgcolor: 'var(--surface)',
            color: 'text.secondary',
          }}
        >
          No record found
        </Box>
      ) : (
        <Box
          sx={{
            width: '100%',
            height: maxHeight,
            // Reordering the core layouts using CSS Flex order
            '& .MuiDataGrid-root': {
              display: 'flex',
              flexDirection: 'column',
            },
            '& .MuiDataGrid-main': {
              order: 2, // Moves the main table grid content below the footer
            },
            '& .MuiDataGrid-footerContainer': {
              order: 1, // Moves the pagination footer container to the top
              borderBottom: '1px solid rgba(224, 224, 224, 1)', // Adds divider line underneath the top pagination
              borderTop: 'none', // Removes default top border
            },
            '& .MuiDataGrid-cell:focus, & .MuiDataGrid-cell:focus-within': {
              outline: 'none !important',
            },
            '& .MuiDataGrid-columnHeader:focus, & .MuiDataGrid-columnHeader:focus-within': {
              outline: 'none !important',
            },
            '& .MuiDataGrid-columnHeader': {
              backgroundColor: '#000000 !important',
            },
            '& .MuiDataGrid-columnHeaderTitle': {
              color: '#ffffff !important',
              fontWeight: 700,
            },
            '& .MuiDataGrid-iconButtonContainer': {
              color: '#ffffff !important',
            },
            '& .MuiDataGrid-menuIcon': {
              color: '#ffffff !important',
            },
            '& .even-row': {
              backgroundColor: 'rgba(0, 0, 0, 0.02)',
            },
            '& .odd-row': {
              backgroundColor: '#ffffff',
            },
            '& .MuiDataGrid-columnHeader[data-field="actions"]': {
              position: 'sticky',
              right: 0,
              backgroundColor: '#000000 !important',
              zIndex: 3,
              boxShadow: '-2px 0px 4px rgba(0,0,0,0.15)',
            },
            '& .MuiDataGrid-cell[data-field="actions"]': {
              position: 'sticky',
              right: 0,
              zIndex: 2,
              boxShadow: '-2px 0px 4px rgba(0,0,0,0.05)',
            },
            '& .even-row .MuiDataGrid-cell[data-field="actions"]': {
              backgroundColor: '#f9f9f9 !important',
            },
            '& .odd-row .MuiDataGrid-cell[data-field="actions"]': {
              backgroundColor: '#ffffff !important',
            },
          }}
        >
          <DataGrid
            rows={rowsWithIds}
            columns={columns}
            loading={loading}
            disableRowSelectionOnClick
            disableColumnFilter
            disableColumnMenu
            pageSizeOptions={[5, 10, 25, 50]}
            getRowClassName={(params) =>
              params.indexRelativeToCurrentPage % 2 === 0 ? 'even-row' : 'odd-row'
            }
            initialState={{
              pagination: { paginationModel: { pageSize: 10 } },
            }}
          />
        </Box>
      )}
    </Box>
  );
};

export default ReusableDataGrid;
