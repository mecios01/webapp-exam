export function accessObject(obj, str) {
	return str
		.split(".")
		.reduce((o, i) => (o ?? {})?.[i] ?? (o ?? {})?.[parseInt(i, 10)], obj);
}
