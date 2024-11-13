import { Typography } from '@mui/material';
import {
	GridColDef,
	GridRenderCellParams,
	GridSortModel,
	GridCallbackDetails,
	GridValidRowModel,
} from '@mui/x-data-grid';
import { GridApiCommunity } from '@mui/x-data-grid/models/api/gridApiCommunity';
import { useMemo, MutableRefObject } from 'react';
import { useIsMobile } from './useIsMobile';

interface IProps<T extends GridValidRowModel> {
	isRowIdx?: boolean;
	columns: GridColDef<T>[];
	apiRef: MutableRefObject<GridApiCommunity>;
}

export function useDatagridOptions<T extends GridValidRowModel>({
	apiRef,
	columns,
	isRowIdx,
}: IProps<T>) {
	const {
		mobile: { isMobile },
	} = useIsMobile();

	const onSortModelChange = (
		_model: GridSortModel,
		details: GridCallbackDetails
	) => {
		const sortedRows = details.api.getSortedRows();
		sortedRows.forEach((row, idx) => {
			apiRef.current.updateRows([{ ...row, id: idx }]);
		});
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
		() => [...(isRowIdx ? orderColumn : []), ...columns],
		[columns, orderColumn, isRowIdx]
	);

	return {
		columnsWithOptions,
		onSortModelChange,
	};
}
