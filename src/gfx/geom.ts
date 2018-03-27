namespace glfx {
	class VertexAttrib {
		constructor(public size: number, public normalized: boolean) {}
	}

	export class VertexFormat {
		private attribs: Dict<VertexAttrib>;

		constructor() {
			this.attribs = new Dict();
		}

		add(name: string, size: number, norm: boolean) {
			this.attribs.add(name, new VertexAttrib(size, norm));
		}

		get size(): number {
			let off = 0;
			for (let v of this.attribs.values()) {
				off += Float32Array.BYTES_PER_ELEMENT * v.size;
			}
			return off;
		}

		bind(shader: Shader) {
			let stride = this.size;
			let off = 0;
			for (let k of this.attribs.keys()) {
				let v = this.attribs.get(k);
				let loc = shader.getAttribLocation(k);
				if (loc != -1) {
					GL.enableVertexAttribArray(loc);
					GL.vertexAttribPointer(loc, v.size, GL.FLOAT, v.normalized, stride, off);
				}
				off += Float32Array.BYTES_PER_ELEMENT * v.size;
			}
		}

		unbind(shader: Shader) {
			for (let k of this.attribs.keys()) {
				let loc = shader.getAttribLocation(k);
				if (loc != -1) {
					GL.disableVertexAttribArray(loc);
				}
			}
		}
	}

	export interface IVertex {
		getFormat(): VertexFormat;
		toArray(): Array<number>;
		getPosition(): Vec3;
		getNormal(): Vec3;
		setNormal(n: Vec3): void;
	}

	export interface IProcessor<V extends IVertex> {
		process(mesh: Mesh<V>): void;
	}

	export class NormalCalculator<V extends IVertex> implements IProcessor<V> {
		constructor(public mode: number) { }

		process(mesh: Mesh<V>): void {
			switch (this.mode) {
				case GL.POINTS:
				case GL.LINES:
				case GL.LINE_LOOP:
				case GL.LINE_STRIP:
					break;
				case GL.TRIANGLES: {
					for (let i = 0; i < mesh.indices.length; i+=3) {
						let i0 = mesh.getIndex(i + 0);
						let i1 = mesh.getIndex(i + 1);
						let i2 = mesh.getIndex(i + 2);
						this.__triNormal(mesh, i0, i1, i2);
					}
				} break;
				case GL.TRIANGLE_FAN: {
					for (let i = 0; i < mesh.indices.length; i+=2) {
						let i0 = mesh.getIndex(0);
						let i1 = mesh.getIndex(i);
						let i2 = mesh.getIndex(i + 1);
						this.__triNormal(mesh, i0, i1, i2);
					}
				} break;
				case GL.TRIANGLE_STRIP: {
					for (let i = 0; i < mesh.indices.length-2; i++) {
						let i0, i1, i2;
						if (i % 2 === 0) {
							i0 = mesh.getIndex(i + 0);
							i1 = mesh.getIndex(i + 1);
							i2 = mesh.getIndex(i + 2);
						} else {
							i0 = mesh.getIndex(i + 2);
							i1 = mesh.getIndex(i + 1);
							i2 = mesh.getIndex(i + 0);
						}
						this.__triNormal(mesh, i0, i1, i2);
					}
				} break;
			}
			
			for (let i = 0; i < mesh.vertices.length; i++) {
				mesh.vertices[i].setNormal(mesh.vertices[i].getNormal().normalized());
			}
		}

		private __triNormal(mesh: Mesh<V>, i0: number, i1: number, i2: number) {
			let v0 = mesh.vertices[i0].getPosition();
			let v1 = mesh.vertices[i1].getPosition();
			let v2 = mesh.vertices[i2].getPosition();

			let e0 = v1.sub(v0);
			let e1 = v2.sub(v0);
			let n = e0.cross(e1);

			mesh.vertices[i0].setNormal(mesh.vertices[i0].getNormal().add(n));
			mesh.vertices[i1].setNormal(mesh.vertices[i1].getNormal().add(n));
			mesh.vertices[i2].setNormal(mesh.vertices[i2].getNormal().add(n));
		}
	}

	export class Mesh<V extends IVertex> implements IGLResource {
		private vbo: WebGLBuffer;
		private ibo: WebGLBuffer;
		private format: VertexFormat;
		private indexed: boolean;
		private dynamic: boolean;
		private vbo_size: number;
		private ibo_size: number;
		public vertices: Array<V>;
		public indices: Array<number>;

		constructor(indexed: boolean = true, dynamic: boolean = false) {
			this.vbo = GL.createBuffer();
			this.format = null;
			this.indexed = indexed;
			this.dynamic = dynamic;
			this.vertices = new Array();
			this.indices = new Array();
			this.vbo_size = 0;
			this.ibo_size = 0;

			if (indexed) this.ibo = GL.createBuffer();
			else this.ibo = null;
		}

		clear() {
			this.vertices = [];
			this.indices = [];
		}

		get vertexCount(): number { return this.vertices.length; }
		get indexCount(): number { return this.indices.length; }

		addVertex(v: V) {
			this.vertices.push(v);
		}

		addIndex(i: number) {
			this.indices.push(i);
		}

		addTriangle(i0: number, i1: number, i2: number) {
			this.indices.push(i0, i1, i2);
		}

		getIndex(i: number) {
			if (this.indexed) {
				return this.indices[i];
			}
			return i;
		}

		process(processor: IProcessor<V>) {
			processor.process(this);
		}

		flush() {
			if (this.vertices.length == 0) return;
			if (this.format == null) {
				this.format = this.vertices[0].getFormat();
			}

			let vsize = this.format.size * this.vertices.length;
			let vdata = [];
			for (let v of this.vertices) {
				vdata.push(...v.toArray());
			}

			let usage = this.dynamic ? GL.DYNAMIC_DRAW : GL.STATIC_DRAW;

			GL.bindBuffer(GL.ARRAY_BUFFER, this.vbo);
			if (vsize > this.vbo_size) {
				if (!this.dynamic)
					GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(vdata), usage);
				else
					GL.bufferData(GL.ARRAY_BUFFER, vsize, usage);
				this.vbo_size = vsize;
			}
			if (this.dynamic) GL.bufferSubData(GL.ARRAY_BUFFER, 0, new Float32Array(vdata));

			if (this.indexed) {
				GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, this.ibo);
				let esize = Uint16Array.BYTES_PER_ELEMENT * this.indices.length;
				
				if (esize > this.ibo_size) {
					if (!this.dynamic)
						GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.indices), usage);
					else
						GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, esize, usage);
					this.ibo_size = esize;
				}
				if (this.dynamic) GL.bufferSubData(GL.ELEMENT_ARRAY_BUFFER, 0, new Uint16Array(this.indices));
				GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, null);
			}
			GL.bindBuffer(GL.ARRAY_BUFFER, null);
		}

		render(mode: number, shader: Shader) {
			if (this.indexed) {
				GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, this.ibo);
			}
			GL.bindBuffer(GL.ARRAY_BUFFER, this.vbo);
			this.format.bind(shader);
			if (this.indexed) {
				GL.drawElements(mode, this.indexCount, GL.UNSIGNED_SHORT, 0);
			} else {
				GL.drawArrays(mode, 0, this.vertexCount);
			}
			this.format.unbind(shader);
			if (this.indexed) {
				GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, null);
			}
			GL.bindBuffer(GL.ARRAY_BUFFER, null);
		}

		destroy(): void {
			GL.deleteBuffer(this.vbo);
			if (this.indexed) GL.deleteBuffer(this.ibo);
		}
	}
}