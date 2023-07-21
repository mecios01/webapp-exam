import { useFormContext, useWatch } from "react-hook-form";

const defaultOptions = [
	{ value: "-", label: "None" },
	{ value: "header", label: "Header" },
	{ value: "paragraph", label: "Paragraph" },
	{ value: "image", label: "Image" },
];

const defaultImages = [
	{ value: "", label: "None" },
	{ value: "/img/blob.jpg", label: "Blob" },
	{ value: "/img/lake.jpg", label: "Lake" },
	{ value: "/img/pebbles.jpg", label: "Pebbles" },
	{ value: "/img/disaster_girl.jpg", label: "Disaster" },
	{ value: "/img/abstract.jpg", label: "Abstracts" },
	{ value: "/img/dontopen.jpg", label: "Don't open" },
	{ value: "/img/late_deliver.jpg", label: "Late deliver" },
	{ value: "/img/seriously.jpg", label: "Seriously?" },
	{ value: "/img/think.jpg", label: "Think" },
];

export const useEditContent = (name, control) => {
	const { type, content } = useWatch({
		control,
		name,
	});
	const { setValue } = useFormContext();

	return {
		type,
		content,
		setValue,
		defaultOptions,
		defaultImages,
	};
};
