import { useEffect, useState } from "react";

export const useImageBox = value => {
	const [hasError, setHasError] = useState(false);
	const baseURL = import.meta.env.VITE_SERVER_IMG_BASE;
	const signalError = () => {
		setHasError(true);
	};
	useEffect(() => {
		setHasError(false);
	}, [value]);

	return {
		baseURL,
		hasError,
		signalError,
	};
};
