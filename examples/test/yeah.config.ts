import type { Express } from 'express';

export default {
	port: 3333, // * Listen port
	configureServer(app: Express) {
		// * Configure the Express app like you would any other. This can
		// * effectively be used to replace files like
		// * https://github.com/PretendoNetwork/juxtaposition/blob/1cd5297b86a25e62941f60d2a97f5fcb99ea89a3/apps/juxtaposition-ui/src/server.js
		// * by doing all this setup in this file and callback function
	}
};