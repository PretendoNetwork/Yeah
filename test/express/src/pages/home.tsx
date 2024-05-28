import { createElement } from '../../../../dist/server';

export function Head() {
	return (
		<link href='https://cdn.jsdelivr.net/npm/reset-css@5.0.2/reset.min.css' rel='stylesheet'></link>
	);
}

export function Body({ username }: { username: string }) {
	const text = "<b>hello</b>";
	return <p>{text}</p>;
}