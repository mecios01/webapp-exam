import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useContext, useEffect, useState } from "react";
import siteContext from "../../contexts/siteContext.js";
import { useSnackbar } from "notistack";
import { editSiteName } from "../../apis/site.js";

const schema = yup.object({
	name: yup.string().required("Insert a name"),
});
export const useEditSiteName = () => {
	const { siteName, refreshName } = useContext(siteContext);
	const formData = useForm({
		resolver: yupResolver(schema),
		mode: "onSubmit",
		shouldUseNativeValidation: false,
		defaultValues: { name: siteName },
	});

	const { handleSubmit, reset } = formData;
	const [snackMessage, setSnackMessage] = useState();
	const { enqueueSnackbar } = useSnackbar();
	const showSnackbar = (message, variant) => {
		enqueueSnackbar(message, {
			variant: variant,
			anchorOrigin: {
				vertical: "top",
				horizontal: "center",
			},
			onExited: () => setSnackMessage(null),
			preventDuplicate: false,
			transitionDuration: 500,
			autoHideDuration: 2000,
		});
	};

	const onSubmit = e => {
		handleSubmit(
			data => {
				editSiteName(data.name).then(res => {
					if (res.status === 200) {
						setSnackMessage({
							message: "Name updated successfully",
							variant: "success",
						});
						refreshName();
					} else
						setSnackMessage({
							message: res?.error ?? res ?? "no error message bruh",
							variant: "error",
						});
				});
			},
			errors => {
				if (errors?.contents?.message)
					setSnackMessage({
						message: errors?.contents?.message,
						variant: "error",
					});
			},
		)(e);
	};

	const handleReset = () => {
		reset();
	};

	useEffect(() => {
		if (snackMessage) showSnackbar(snackMessage.message, snackMessage.variant);
	}, [snackMessage]);

	useEffect(() => {
		reset({ name: siteName });
	}, [siteName]);

	return {
		formData,
		handleSubmit,
		onSubmit,
		handleReset,
	};
};
