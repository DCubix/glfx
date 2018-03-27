namespace glfx {
	export var GL: WebGLRenderingContext = null;
	export var Canvas: HTMLCanvasElement = null;

	/**
	 * Creates/Sets up a new WebGL context.
	 * You can access the Context and the Canvas from the glfx namespace directly.
	 * @param eid Canvas element ID, id it's undefined or null, a new canvas is created.
	 * @param width Canvas width.
	 * @param height Canvas height.
	 */
	export function createContext(eid?: string, width?: number, height?: number): void {
		let canvas: HTMLCanvasElement = null;
		if (eid) {
			canvas = document.getElementById(eid) as HTMLCanvasElement;
		} else {
			canvas = document.createElement("canvas");
			canvas.id = "glfx";
			canvas.width = width;
			canvas.height = height;
		}
		glfx.Canvas = canvas;
		glfx.GL = canvas.getContext("webgl");
	}

	/**
	 * requestAnimationFrame wrapper.
	 * @param callback Frame callback.
	 */
	export function nextFrame(callback: FrameRequestCallback) {
		if (window.requestAnimationFrame) {
			window.requestAnimationFrame(callback);
		} else {
			console.error("Your browser does not support requestAnimationFrame, please use setTimeout instead.");
		}
	}

}