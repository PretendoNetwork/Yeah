#!/usr/bin/env node --import tsx

import { spawn } from 'node:child_process';
import path from 'node:path';
import http from 'node:http';
import { Command } from 'commander';
import chokidar from 'chokidar';
import { build } from '@/build';
import type { ChildProcess } from 'node:child_process';
import type { AddressInfo } from 'node:net';

const program = new Command();

program
	.name('yeah')
	.description('CLI for Yeah framework')
	.version('1.0.0');

program
	.command('build')
	.description('Build the application')
	.argument('[path]', 'Path to application root', process.cwd())
	.action(async (appRoot: string) => {
		console.log('Build starting');

		try {
			await build({ appRoot });
			console.log('Build completed successfully');
		} catch (error) {
			console.error('Build failed:', error);
			process.exit(1);
		}
	});

program
	.command('dev')
	.description('Start development server with watch mode')
	.argument('[path]', 'Path to application root', process.cwd())
	.action(async (appRoot: string) => {
		const sseClients: http.ServerResponse[] = [];
		let serverProcess: ChildProcess | null = null;

		function startServer(): void {
			if (serverProcess) {
				serverProcess.kill();
			}

			serverProcess = spawn('node', ['dist/server.mjs'], {
				cwd: appRoot,
				stdio: 'inherit'
			});
		}

		try {
			// * Use SSE for hot reloading instead of WebSockets because the 3DS/Wii U doesn't support them
			const hotReloadServer = http.createServer((request, response) => {
				if (request.url === '/dev-reload') { // TODO - Randomize the endpoint, like the port? To not conflict with application routes?
					response.writeHead(200, {
						'Content-Type': 'text/event-stream',
						'Cache-Control': 'no-cache',
						'Connection': 'keep-alive',
						'Access-Control-Allow-Origin': '*',
						'Access-Control-Allow-Methods': 'GET, OPTIONS',
						'Access-Control-Allow-Headers': 'Content-Type'
					});
					response.flushHeaders();

					sseClients.push(response);

					response.write('event: connected\n');
					response.write('data: {"message":"connected"}\n\n');

					request.on('close', () => {
						const index = sseClients.indexOf(response);
						if (index !== -1) {
							sseClients.splice(index, 1);
						}
					});
				} else {
					response.writeHead(404);
					response.end();
				}
			});

			console.log('Starting hot reload server...');

			hotReloadServer.listen(async () => {
				const hotReloadPort = (hotReloadServer.address() as AddressInfo)?.port;

				console.log(`Live reload server running on http://localhost:${hotReloadPort}`);
				console.log('Starting development server...');

				await build({
					appRoot,
					hotReloadPort
				});
				startServer();

				const watcher = chokidar.watch([
					path.join(appRoot, 'yeah.config.ts'),
					path.join(appRoot, 'src')
				], {
					ignored: ['**/node_modules/**', '**/dist/**'],
					ignoreInitial: true,
					persistent: true
				});

				watcher.on('all', async (event, filepath) => {
					console.log(`File ${event}: ${filepath}`);
					console.log('Rebuilding...');

					try {
						await build({
							appRoot,
							hotReloadPort
						});

						console.log('Restarting server...');

						startServer();

						setTimeout(() => {
							sseClients.forEach((client) => {
								client.write('event: reload\n');
								client.write('data: {"message":"reload"}\n\n');
							});
						}, 500); // * Wait a bit to give the server time to restart
					} catch (error) {
						console.error('Rebuild failed:', error);
					}
				});

				// TODO - Randomly assign server port, like with the hot reload server?
				console.log('Development server started on port 3333. Watching for changes...');
			});
		} catch (error) {
			console.error('Dev server failed:', error);
			process.exit(1);
		}
	});

program.parse();
