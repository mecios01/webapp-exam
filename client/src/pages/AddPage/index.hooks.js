import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useContext, useEffect, useState } from "react";
import { useSnackbar } from "notistack";
import UserContext from "../../contexts/userContext.js";
import dayjs from "dayjs";
import utcPlugin from "dayjs/plugin/utc";
import timezonePlugin from "dayjs/plugin/timezone";
import { addNewPage } from "../../apis/pages.js";

dayjs.extend(utcPlugin);
dayjs.extend(timezonePlugin);

export const useCreatePage = () => {
	const { user } = useContext(UserContext);
	const authorOptions = [
		{
			label: `${user?.name} - (${user?.email})`,
			value: user?.email,
		},
	];

	const schema = yup.object({
		title: yup.string().required("Insert a title"),
		hasPublicationDate: yup.boolean().default(false),
		author: yup
			.string()
			.required("You must provide an author")
			.oneOf([user?.email]),
		publicationDate: yup
			.date()
			.when("hasPublicationDate", ([hasPublicationDate], schema) =>
				hasPublicationDate
					? yup.date().required("Publication date is required")
					: yup.date().nullable(),
			),
		creationDate: yup.date().required(),
		contents: yup
			.array()
			.of(
				yup.object({
					type: yup
						.string()
						.required("Select a type")
						.oneOf(
							["image", "paragraph", "header"],
							"Select one of the possible options",
						),
					content: yup
						.string()
						.when("type", ([type], schema) =>
							type === "image"
								? schema.required("Choose an image")
								: schema.required("Insert some text"),
						),
				}),
			)
			.test(
				"hasRequiredContents",
				"At least two contents are required with one header and one paragraph or image",
				contents => {
					const headerExists = contents.some(
						content => content.type === "header",
					);
					const paragraphOrImageExists = contents.some(
						content => content.type === "paragraph" || content.type === "image",
					);

					return headerExists && paragraphOrImageExists;
				},
			),
	});

	const [snackMessage, setSnackMessage] = useState(null);
	const formData = useForm({
		resolver: yupResolver(schema),
		mode: "onSubmit",
		defaultValues: {
			title: "",
			hasPublicationDate: false,
			publicationDate: null,
			creationDate: dayjs.utc(Date.now()).startOf("day"),
			author: user?.email,
			contents: [
				{ type: "header", content: "" },
				{ type: "image", content: "" },
				{ type: "paragraph", content: "" },
			],
		},
	});
	const fieldArray = useFieldArray({
		control: formData.control,
		name: "contents",
		rules: { validate: true },
	});

	const { hasPublicationDate } = useWatch({
		control: formData.control,
		name: ["hasPublicationDate"],
	});

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

	const handleReset = () => {
		formData.reset();
	};
	const handleFormSubmit = e => {
		formData.handleSubmit(
			data => {
				addNewPage(data).then(res => {
					if (res.status === 200) {
						setSnackMessage({
							message: "Page added successfully",
							variant: "success",
						});
						formData.reset();
					} else
						setSnackMessage({
							message:
								res?.data?.error ??
								res?.error ??
								res ??
								"no error message bruh",
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

	const moveUp = index => {
		if (index > 0) {
			fieldArray.swap(index, index - 1);
		}
	};
	const moveDown = index => {
		if (index < fieldArray.fields.length - 1) {
			fieldArray.swap(index, index + 1);
		}
	};
	const remove = index => {
		fieldArray.remove(index);
	};
	const addEmptyContent = () => {
		fieldArray.append({
			type: "paragraph",
			content: "",
		});
	};

	useEffect(() => {
		if (snackMessage) showSnackbar(snackMessage.message, snackMessage.variant);
	}, [snackMessage]);

	return {
		formData,
		fieldArray,
		handleFormSubmit,
		moveDown,
		moveUp,
		remove,
		addEmptyContent,
		authorOptions,
		handleReset,
	};
};
