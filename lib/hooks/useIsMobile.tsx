import useMediaQuery from '@mui/material/useMediaQuery';

const breakpoints = {
	mobile: `(max-width: 1100px)`,
};

export function useIsMobile() {
	const matchesMobile = useMediaQuery(breakpoints.mobile);
	return {
		mobile: {
			isMobile: matchesMobile,
			mediaQuery: `@media ${breakpoints.mobile}`,
		},
	};
}
