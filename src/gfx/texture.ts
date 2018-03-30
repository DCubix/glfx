namespace GLFX {
	export class Texture2D implements IGLResource {
		private id: WebGLTexture;
		private ispow2: boolean;
		public width: number;
		public height: number;
		public valid: boolean;

		constructor(src: string = null, width: number = 1, height: number = 1) {
			this.id = GL.createTexture();
			this.ispow2 = false;
			this.valid = false;
			let _this = this;
			if (src) {
				let img = new Image();
				img.onload = function() {
					GL.bindTexture(GL.TEXTURE_2D, _this.id);
					GL.texImage2D(GL.TEXTURE_2D, 0, GL.RGBA, GL.RGBA, GL.UNSIGNED_BYTE, img);
					if (Math.isPowerOfTwo(img.width) && Math.isPowerOfTwo(img.height)) {
						GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_WRAP_S, GL.REPEAT);
						GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_WRAP_T, GL.REPEAT);
						GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MIN_FILTER, GL.LINEAR_MIPMAP_LINEAR);
						GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MAG_FILTER, GL.LINEAR);
	
						GL.generateMipmap(GL.TEXTURE_2D);
	
						_this.ispow2 = true;
					} else {
						GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_WRAP_S, GL.CLAMP_TO_EDGE);
						GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_WRAP_T, GL.CLAMP_TO_EDGE);
						GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MIN_FILTER, GL.LINEAR);
						GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MAG_FILTER, GL.LINEAR);
					}
					_this.valid = true;
					GL.bindTexture(GL.TEXTURE_2D, null);

					_this.width = img.width;
					_this.height = img.height;
				}
				img.src = src;
			} else {
				GL.bindTexture(GL.TEXTURE_2D, _this.id);
				if (Math.isPowerOfTwo(width) && Math.isPowerOfTwo(height)) {
					GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MIN_FILTER, GL.LINEAR_MIPMAP_LINEAR);
					GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MAG_FILTER, GL.LINEAR);
					_this.ispow2 = true;
				} else {
					GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MIN_FILTER, GL.LINEAR);
					GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MAG_FILTER, GL.LINEAR);
				}
				GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_WRAP_S, GL.CLAMP_TO_EDGE);
				GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_WRAP_T, GL.CLAMP_TO_EDGE);
				GL.texImage2D(GL.TEXTURE_2D, 0, GL.RGBA, width, height, 0, GL.RGBA, GL.UNSIGNED_BYTE, null);
				_this.valid = true;
				GL.bindTexture(GL.TEXTURE_2D, null);

				_this.width = width;
				_this.height = height;
			}
		}
	
		bind(slot: number = 0) {
			if (this.valid) {
				GL.activeTexture(GL.TEXTURE0 + slot);
				GL.bindTexture(GL.TEXTURE_2D, this.id);
			}
		}
	
		unbind() {
			GL.bindTexture(GL.TEXTURE_2D, null);
		}

		generateMipmaps() {
			if (this.ispow2) GL.generateMipmap(GL.TEXTURE_2D);
		}

		destroy(): void {
			GL.deleteTexture(this.id);
		}
	}
	
}