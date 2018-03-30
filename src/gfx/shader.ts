namespace GLFX {
	export class Uniform {
		private loc: WebGLUniformLocation;

		constructor(loc: WebGLUniformLocation) {
			this.loc = loc;
		}

		setInt(v: number) {
			GL.uniform1i(this.loc, v);
		}
	
		setFloat(v: number) {
			GL.uniform1f(this.loc, v);
		}
	
		setVec2(v: Vec2) {
			GL.uniform2f(this.loc, v.x, v.y);
		}
	
		setVec3(v: Vec3) {
			GL.uniform3f(this.loc, v.x, v.y, v.z);
		}
	
		setVec4(v: Vec4) {
			GL.uniform4f(this.loc, v.x, v.y, v.z, v.w);
		}
	
		setMat4(v: Mat4) {
			GL.uniformMatrix4fv(this.loc, false, v.value);
		}
	}

	export class Shader implements IGLResource {
		
		private uniforms: Dict<WebGLUniformLocation>;
		private attributes: Dict<number>;
		private program: WebGLProgram;

		constructor(vert: string, frag: string) {
			this.program = GL.createProgram();
			this.uniforms = new Dict();
			this.attributes = new Dict();

			let vs = GL.createShader(GL.VERTEX_SHADER);
			GL.shaderSource(vs, vert);
			GL.compileShader(vs);
			
			if (!GL.getShaderParameter(vs, GL.COMPILE_STATUS)) {
				console.error("Vertex Shader Error:\n\t" + GL.getShaderInfoLog(vs));
				GL.deleteShader(vs);
				return;
			}
			//
			let fs = GL.createShader(GL.FRAGMENT_SHADER);
			GL.shaderSource(fs, frag);
			GL.compileShader(fs);
			
			if (!GL.getShaderParameter(fs, GL.COMPILE_STATUS)) {
				console.error("Fragment Shader Error:\n\t" + GL.getShaderInfoLog(fs));
				GL.deleteShader(fs);
				return;
			}

			GL.attachShader(this.program, vs);
			GL.attachShader(this.program, fs);
			GL.linkProgram(this.program);

			GL.deleteShader(vs);
			GL.deleteShader(fs);
		}

		static fromHTMLElement(veid: string, feid: string): Shader {
			return new Shader(
				document.getElementById(veid).innerHTML,
				document.getElementById(feid).innerHTML
			);
		}

		bind() {
			GL.useProgram(this.program);
		}
	
		unbind() {
			GL.useProgram(null);
		}

		getUniformLocation(name: string) {
			if (!this.uniforms.containsKey(name)) {
				let loc = GL.getUniformLocation(this.program, name);
				if (loc !== null && loc !== -1) {
					this.uniforms.add(name, loc);
				} else {
					return null;
				}
			}
			return this.uniforms.get(name);
		}
	
		getAttribLocation(name: string) {
			if (!this.attributes.containsKey(name)) {
				let loc = GL.getAttribLocation(this.program, name);
				if (loc !== null && loc !== -1) {
					this.attributes.add(name, loc);
				} else {
					return null;
				}
			}
			return this.attributes.get(name);
		}

		getUniform(name: string) {
			let loc = this.getUniformLocation(name);
			if (loc) {
				return new Uniform(loc);
			}
			return null;
		}

		destroy(): void {
			GL.deleteProgram(this.program);
		}
	}
}