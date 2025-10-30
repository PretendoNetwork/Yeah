import type { Context } from '@/context';

// * Manage connections for https://en.wikipedia.org/wiki/Server-sent_events
const SSE_CONNECTIONS: Record<number, Context> = {};

/**
 * Creates an SSE tunnel on a given request endpoint.
 * See https://en.wikipedia.org/wiki/Server-sent_events for details on SSE.
 *
 * @param connectionID - A unique ID to represent a connection. Used for sending data back to specific connections.
 * @param ctx - Yeah request context.
 */
export function setupSSE(connectionID: number, ctx: Context) {
	// TODO - Send the user back its connection ID as a cookie, so we can reference the user later?
	ctx.response.setHeader('Content-Type', 'text/event-stream');
	ctx.response.setHeader('Cache-Control', 'no-cache');
	ctx.response.setHeader('Connection', 'keep-alive');
	ctx.response.flushHeaders();

	ctx.request.on('close', () => {
		if (SSE_CONNECTIONS[connectionID]) {
			SSE_CONNECTIONS[connectionID].response.end();
			delete SSE_CONNECTIONS[connectionID];
		}
	});

	SSE_CONNECTIONS[connectionID] = ctx;
}

/**
 * Send an event to a specific connection. If the connection is not found, does nothing.
 *
 * @param event - Name of the SSE event.
 * @param connectionID - Unique ID for the connection to send the event to.
 * @param data - Optional. Event data.
 */
export function sendEvent(event: string, connectionID: number, data: Record<any, unknown> = {}) {
	const connection = SSE_CONNECTIONS[connectionID];

	if (connection) {
		connection.response.write(`event: ${event}\n`);
		connection.response.write(`data: ${JSON.stringify(data)}\n\n`);
	}
}

/**
 * Send an event to all connections.
 *
 * @param event - Name of the SSE event.
 * @param data - Optional. Event data.
 * @param excludedConnectionIDs - Optional. Connection IDs to exclude from the broadcast, such as the user who created the event.
 */
export function broadcast(event: string, data: Record<any, unknown> = {}, excludedConnectionIDs: number[] = []) {
	for (const connectionID in SSE_CONNECTIONS) {
		if (excludedConnectionIDs.includes(Number(connectionID))) {
			continue;
		}

		const connection = SSE_CONNECTIONS[connectionID];

		connection.response.write(`event: ${event}\n`);
		connection.response.write(`data: ${JSON.stringify(data)}\n\n`);
	}
}

// TODO - Add "broadcastToPage", which will broadcast an event to everyone on X page