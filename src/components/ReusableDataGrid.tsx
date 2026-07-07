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

  if(!data.length) return <>No record found</>
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
    <Box sx={{ width: '100%', mt:2 }}>
      {onExportCSV && (
        <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 2 }}>
          <Button variant="outlined" onClick={onExportCSV}>
            Export CSV
          </Button>
        </Box>
      )}

      <Box 
        sx={{ 
          width: '100%', 
          height: maxHeight,
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
            backgroundColor: 'inherit', 
          }
        }}
      >
        <DataGrid
          rows={rowsWithIds}
          columns={columns}
          loading={loading}
          disableRowSelectionOnClick
          pageSizeOptions={[5, 10, 25, 50]}
          getRowClassName={(params) => 
            params.indexRelativeToCurrentPage % 2 === 0 ? 'even-row' : 'odd-row'
          }
          initialState={{
            pagination: { paginationModel: { pageSize: 10 } },
          }}
        />
      </Box>
    </Box>
  );
};

export default ReusableDataGrid;
