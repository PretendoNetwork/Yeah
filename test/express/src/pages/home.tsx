import { createElement } from '../../../../dist/server';

export function Header() {
	return (
		<link href='https://cdn.jsdelivr.net/npm/reset-css@5.0.2/reset.min.css' rel='stylesheet'></link>
	);
}

export function Body({ username }: { username: string }) {
	return (
		<div>
			<h1>Hello {username}</h1>
			<p>Test page</p>
		</div>
	);
}