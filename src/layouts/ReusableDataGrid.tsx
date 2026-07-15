import React, { useMemo, useState } from 'react';
import { Box, Button, TextField } from '@mui/material';
import { DataGrid, type GridColDef, type GridRenderCellParams } from '@mui/x-data-grid';
import SearchIcon from '@mui/icons-material/Search';
import { useLanguage } from '../context/LanguageContext';

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
  const { t } = useLanguage();
  const [searchText, setSearchText] = useState('');

  const columns: GridColDef[] = useMemo(() => {
    if (!data || data.length === 0) return [];

    const generatedCols: GridColDef[] = Object.keys(data[0])
      .filter((key) => !['id', 'raw'].includes(key.toLowerCase())) // Filters out 'id' and 'raw'
      .map((key) => {
        const formattedHeader = key
          .replace(/([A-Z])/g, ' $1')
          .replace(/[_-]/g, ' ')
          .replace(/^./, (str) => str.toUpperCase())
          .trim();
        const translatedHeader = t(key);
        const headerName = translatedHeader !== key ? translatedHeader : formattedHeader;

        return {
          field: key,
          headerName: headerName,
          flex: 1,
          minWidth: 150,
          resizable: true,
          valueGetter: (value: any) => {
            if (value === null || value === undefined || value === '') {
              return 'N/A';
            }
            if (typeof value === 'object') {
              if ('name' in value && 'id' in value) {
                return `${value.id} - ${value.name}`;
              }
              if ('firstName' in value || 'lastName' in value) {
                return `${value.firstName || ''} ${value.lastName || ''}`.trim() || 'N/A';
              }
              if ('name' in value) {
                return value.name;
              }
              if ('label' in value) {
                return value.label;
              }
              if ('value' in value) {
                return value.value;
              }
              if ('userName' in value || 'username' in value) {
                return `@${value.userName || value.username}`;
              }
              try {
                return JSON.stringify(value);
              } catch {
                return 'N/A';
              }
            }
            return value;
          },
        };
      });

    const actionsCol: GridColDef = {
      field: 'actions',
      headerName: t('actions'),
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
          {t('view', 'View')}
        </Button>
      ),
    };

    return [...generatedCols, actionsCol];
  }, [data, onView, t]);

  const rowsWithIds = useMemo(() => {
    return data.map((item, index) => ({
      id: item.id || item.uuid || `row-${index}`,
      ...item,
    }));
  }, [data]);

  const filteredRows = useMemo(() => {
    if (!searchText) return rowsWithIds;
    const lowerSearch = searchText.toLowerCase();
    return rowsWithIds.filter((row) => {
      return Object.entries(row).some(([key, val]) => {
        if (key === 'id' || key === 'raw') return false;
        if (val === null || val === undefined) return false;
        if (typeof val === 'object') {
          return JSON.stringify(val).toLowerCase().includes(lowerSearch);
        }
        return String(val).toLowerCase().includes(lowerSearch);
      });
    });
  }, [rowsWithIds, searchText]);

  return (
    <Box sx={{ width: '100%', mt: 2 }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 2.5,
          gap: 2,
          flexWrap: 'wrap',
        }}
      >
        <TextField
          size="small"
          placeholder={t('searchGrid', 'Search in table...')}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          sx={{ minWidth: 280, bgcolor: 'background.paper', borderRadius: 1 }}
          slotProps={{
            input: {
              startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary', fontSize: 20 }} />,
            },
          }}
        />
        {onExportCSV && data.length > 0 && (
          <Button variant="outlined" onClick={onExportCSV}>
            {t('exportCSV')}
          </Button>
        )}
      </Box>

      {filteredRows.length === 0 ? (
        <Box
          sx={{
            p: 5,
            textAlign: 'center',
            border: '1px solid var(--border)',
            borderRadius: '12px',
            bgcolor: 'var(--surface)',
            color: 'text.secondary',
          }}
        >
          {t('noRecordFound', 'No record found matching the search criteria')}
        </Box>
      ) : (
        <Box
          sx={{
            width: '100%',
            height: maxHeight,
            '& .MuiDataGrid-root': {
              display: 'flex',
              flexDirection: 'column',
              border: '1px solid var(--border)',
              borderRadius: '12px',
              bgcolor: 'background.paper',
              overflow: 'hidden',
            },
            '& .MuiDataGrid-main': {
              order: 2,
            },
            '& .MuiDataGrid-footerContainer': {
              order: 1,
              borderBottom: '1px solid var(--border)',
              borderTop: 'none',
              bgcolor: 'background.paper',
            },
            '& .MuiDataGrid-cell:focus, & .MuiDataGrid-cell:focus-within': {
              outline: 'none !important',
            },
            '& .MuiDataGrid-columnHeader:focus, & .MuiDataGrid-columnHeader:focus-within': {
              outline: 'none !important',
            },
            '& .MuiDataGrid-columnHeader': {
              backgroundColor: 'var(--background) !important',
              borderBottom: '1px solid var(--border)',
            },
            '& .MuiDataGrid-columnHeaderTitle': {
              color: 'text.primary',
              fontWeight: 700,
            },
            '& .MuiDataGrid-iconButtonContainer': {
              color: 'text.secondary',
            },
            '& .MuiDataGrid-menuIcon': {
              color: 'text.secondary',
            },
            '& .even-row': {
              backgroundColor: 'rgba(0, 0, 0, 0.015)',
            },
            '& .odd-row': {
              backgroundColor: 'background.paper',
            },
            '& .MuiDataGrid-columnHeader[data-field="actions"]': {
              position: 'sticky',
              right: 0,
              backgroundColor: 'var(--background) !important',
              zIndex: 3,
              boxShadow: '-2px 0px 4px rgba(0,0,0,0.05)',
            },
            '& .MuiDataGrid-cell[data-field="actions"]': {
              position: 'sticky',
              right: 0,
              zIndex: 2,
              boxShadow: '-2px 0px 4px rgba(0,0,0,0.03)',
            },
            '& .even-row .MuiDataGrid-cell[data-field="actions"]': {
              backgroundColor: '#f9f9f9 !important',
            },
            '& .odd-row .MuiDataGrid-cell[data-field="actions"]': {
              backgroundColor: 'background.paper !important',
            },
          }}
        >
          <DataGrid
            rows={filteredRows}
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
