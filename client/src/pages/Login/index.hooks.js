import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { checkLogin } from "../../apis/user.js";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";
import UserContext from "../../contexts/userContext.js";
import { useContext, useEffect } from "react";

const schema = yup.object({
	username: yup
		.string()
		.typeError("Insert email")
		.required("No email provided")
		.email("Email is not valid"),
	password: yup
		.string()
		.typeError("Insert password")
		.required("No password provided"),
});
function useLogin({ setUser }) {
	const navigate = useNavigate();
	const { user } = useContext(UserContext);

	useEffect(() => {
		return () => {
			if (user) {
				navigate("/");
			}
		};
	}, []);

	const { enqueueSnackbar } = useSnackbar();
	const showSnackbar = (message, variant) => {
		enqueueSnackbar(message, {
			variant: variant,
			anchorOrigin: {
				vertical: "top",
				horizontal: "center",
			},
			transitionDuration: 500,
			autoHideDuration: 2000,
		});
	};

	const formData = useForm({
		resolver: yupResolver(schema),
		defaultValues: {
			username: "",
			password: "",
		},
	});
	const { handleSubmit } = formData;

	const onSubmit = e => {
		handleSubmit(async data => {
			try {
				const { username, password } = data;
				const user = await checkLogin(username, password);
				setUser(user);
				navigate("/");
			} catch (e) {
				formData.reset();
				showSnackbar(e.message, "error");
			}
		})(e);
	};

	return {
		formData,
		onSubmit,
	};
}

export default useLogin;
