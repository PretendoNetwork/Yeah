export default function App({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<head>
				<meta charSet="UTF-8" />
				<title>My App</title>
				<script src="https://cdn.jsdelivr.net/npm/htmx.org@2.0.8/dist/htmx.js" integrity="sha384-ezjq8118wdwdRMj+nX4bevEi+cDLTbhLAeFF688VK8tPDGeLUe0WoY2MZtSla72F" crossOrigin="anonymous"></script>
			</head>
			<body>
				<nav>
					<a href="/">Home</a>
					<a href="/about">About</a>
				</nav>
				<main>{children}</main>
			</body>
		</html>
	);
}
