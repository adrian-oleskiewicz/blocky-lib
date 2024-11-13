import { Typography } from '@mui/material';
import {
	GridColDef,
	GridRenderCellParams,
	GridSortModel,
	GridCallbackDetails,
	GridValidRowModel,
} from '@mui/x-data-grid';
import { GridApiCommunity } from '@mui/x-data-grid/models/api/gridApiCommunity';
import { useMemo, useCallback, MutableRefObject } from 'react';
import { useIsMobile } from './useIsMobile';

interface IProps<T extends GridValidRowModel> {
	isRowIdx?: boolean;
  pinnedColumnName?: string;
	columns: GridColDef<T>[];
	apiRef: MutableRefObject<GridApiCommunity>;
}

export function useDatagridOptions<T extends GridValidRowModel>({
	apiRef,
	columns,
	isRowIdx,
  pinnedColumnName,
}: IProps<T>) {
	const {
		mobile: { isMobile },
	} = useIsMobile();

	// isRowIdx <DataGrid onSortModelChange - keep row order after sorting
	const onSortModelChange = useCallback((
		_model: GridSortModel,
		details: GridCallbackDetails
	) => {
		const sortedRows = details.api.getSortedRows();
		sortedRows.forEach((row, idx) => {
			apiRef.current.updateRows([{ ...row, id: idx }]);
		});
	}, []);

	// pinnedColumnName <DataGrid sx - styles for pinned column
	const pinnedColSx = {
		'& .pinned-column--header': {
			position: 'sticky',
			left: 0,
			zIndex: 1000,
			transform: 'translateZ(0)',
		},
		'& .pinned-column--cell': {
			position: 'sticky',
			left: 0,
			zIndex: 1000,
			background: '#fff',
			transform: 'translateZ(0)',
			borderRight: isMobile ? '1px solid rgb(224, 224, 224)' : '',
		},
	};

	const orderColumn: GridColDef<T>[] = useMemo(
		() =>
			isMobile
				? []
				: [
						{
							field: 'id',
							headerName: '',
							width: 30,
							headerClassName: 'home-page-table-header',
							sortable: false,
							renderCell: (params: GridRenderCellParams) => (
								<Typography
									variant="body1"
									height="100%"
									display="flex"
									alignItems="center"
								>
									{params.api.state.sorting.sortedRows.indexOf(params.id) + 1}
								</Typography>
							),
						},
					],
		[isMobile]
	);

	const columnsWithOptions: GridColDef<T>[] = useMemo(
		() => [
			...(isRowIdx ? orderColumn : []),
			...(pinnedColumnName
				? columns.map((col) =>
						col.field === pinnedColumnName
							? {
									...col,
									headerClassName: isMobile
										? 'home-page-table-header pinned-column--header'
										: 'home-page-table-header',
									cellClassName: isMobile ? 'pinned-column--cell' : '',
								}
							: col
					)
				: columns),
		],
		[columns, orderColumn, isRowIdx, pinnedColumnName, isMobile]
	);

	return {
		columnsWithOptions,
		onSortModelChange,
    pinnedColSx
	};
}
