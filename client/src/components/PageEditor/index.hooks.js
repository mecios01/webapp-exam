import { useCallback, useContext, useEffect, useState } from "react";
import UserContext from "../../contexts/userContext.js";
import { useFieldArray, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { getPage, updatePage } from "../../apis/pages.js";
import { getAllUsers } from "../../apis/user.js";
import dayjs from "dayjs";
import { useNavigate, useParams } from "react-router-dom";
import { useSnackbar } from "notistack";

export const usePageEditor = () => {
	const { user } = useContext(UserContext);
	const { pageSlug } = useParams();
	const navigate = useNavigate();

	//Data fetch

	const [isLoading, setIsLoading] = useState(true);
	const [page, setPage] = useState(null);
	const [users, setUsers] = useState([]);
	const [userOptions, setUserOptions] = useState(null);
	//get page(with blocks) and list of users. If one fails no page and no users (then give error)
	useEffect(() => {
		const getData = async () => {
			try {
				const page_res = await getPage(pageSlug);
				setPage({
					...page_res,
					contents: page_res.contents.map(c => {
						return { type: c.type, content: c.data };
					}),
				});
				const users_res = await getAllUsers();
				setUsers(users_res);
				setUserOptions(
					users_res.map(u => {
						return {
							label: `${u.name} - (${u.email})`,
							value: `${u.email}`,
						};
					}),
				);
			} catch (e) {
				console.log(e);
			} finally {
				setIsLoading(false);
			}
		};
		getData();
	}, []);

	const useCustomResolver = useCallback(() => {
		return yupResolver(
			yup.object({
				title: yup.string().required("Insert a title"),
				hasPublicationDate: yup.boolean().default(false),
				author: yup
					.string()
					.required("You must provide an author")
					.test(
						"isOneOfTheUsers",
						"Choose one of the options available",
						(value, context) => {
							return users.some(u => u.email === value);
						},
					),
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
								content =>
									content.type === "paragraph" || content.type === "image",
							);

							return headerExists && paragraphOrImageExists;
						},
					),
			}),
		);
	}, [users, page]);

	const formData = useForm({
		resolver: useCustomResolver(),
		mode: "onSubmit",
		defaultValues: {
			title: "",
			author: "",
			publicationDate: null,
			creationDate: null,
			hasPublicationDate: false,
			contents: [{ type: "", content: "" }],
		},
	});
	const { control, reset } = formData;

	const fieldArray = useFieldArray({
		control,
		name: "contents",
		rules: { validate: true },
	});
	const { fields, remove, swap, replace, append } = fieldArray;
	const [snackMessage, setSnackMessage] = useState(null);
	const { enqueueSnackbar } = useSnackbar();
	const showSnackbar = (message, variant) => {
		enqueueSnackbar(message, {
			variant: variant,
			anchorOrigin: {
				vertical: "top",
				horizontal: "center",
			},
			onEnter: () => {
				navigate("/");
			},

			preventDuplicate: false,
			transitionDuration: 500,
			autoHideDuration: 1000,
		});
	};
	const handleFormSubmit = e => {
		formData.handleSubmit(
			data => {
				const sendData = {
					id: page.id,
					title: data.title,
					author: data.author,
					publicationDate: data.hasPublicationDate
						? data.publicationDate.toISOString()
						: null,
					contents: data.contents,
				};
				updatePage(sendData, page.slug).then(res => {
					if (res.status === 200) {
						setSnackMessage({
							message: "Page updated successfully",
							variant: "success",
						});
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

	const moveUp = index => {
		if (index > 0) {
			swap(index, index - 1);
		}
	};
	const moveDown = index => {
		if (index < fieldArray.fields.length - 1) {
			swap(index, index + 1);
		}
	};
	const remove_ = index => {
		remove(index);
	};
	const addEmptyContent = () => {
		fieldArray.append({
			type: "paragraph",
			content: "",
		});
	};

	useEffect(() => {
		if (!page) return;
		const hasPub = page.publication_date !== null;
		reset({
			title: page.title,
			author: page.author.email,
			hasPublicationDate: hasPub,
			publicationDate: hasPub ? dayjs.utc(page.publication_date) : null,
			creationDate: dayjs.utc(page.creationDate),
			contents: page.contents,
		});
		replace(page.contents);
	}, [page]);

	useEffect(() => {
		if (snackMessage) showSnackbar(snackMessage.message, snackMessage.variant);
	}, [snackMessage]);

	return {
		formData,
		fields,
		isLoading,
		page,
		users,
		userOptions,
		addEmptyContent,
		remove: remove_,
		handleFormSubmit,
		user,
		moveDown,
		moveUp,
	};
};
