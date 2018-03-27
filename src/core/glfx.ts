namespace glfx {
	export var GL: WebGLRenderingContext = null;
	export var Canvas: HTMLCanvasElement = null;

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

	export function nextFrame(callback: FrameRequestCallback) {
		if (window.requestAnimationFrame) {
			window.requestAnimationFrame(callback);
		} else {
			console.error("Your browser does not support requestAnimationFrame, please use setTimeout instead.");
		}
	}

}