export default function CustomLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<head>
				<meta charSet="UTF-8" />
				<title>My App</title>
				<script src="https://cdn.jsdelivr.net/npm/htmx.org@2.0.8/dist/htmx.js" integrity="sha384-ezjq8118wdwdRMj+nX4bevEi+cDLTbhLAeFF688VK8tPDGeLUe0WoY2MZtSla72F" crossOrigin="anonymous"></script>
			</head>
			<body>
				<div>Custom Layout</div>
				<main>{children}</main>
			</body>
		</html>
	);
}
