namespace GLFX {
	export class Mat4 {
		private rows: Array<Vec4>;
		private fa: Float32Array;
		constructor(v: Float32Array | Array<number> = null) {
			if ((v instanceof Float32Array || v instanceof Array) && v.length == 16) {
				this.rows = [
					new Vec4(v[0], v[1], v[2], v[3]),
					new Vec4(v[4], v[5], v[6], v[7]),
					new Vec4(v[8], v[9], v[10], v[11]),
					new Vec4(v[12], v[13], v[14], v[15])
				];
			} else {
				this.rows = [
					new Vec4(1, 0, 0, 0),
					new Vec4(0, 1, 0, 0),
					new Vec4(0, 0, 1, 0),
					new Vec4(0, 0, 0, 1)
				];
			}
			this.fa = new Float32Array(16);
		}

		static fromRows(rows: Array<Vec4>): Mat4 {
			let m = new Mat4();
			m.rows = rows;
			return m;
		}

		get value(): Float32Array {
			let i = 0;
			for (let row of this.rows) {
				for (let v of row.values) {
					this.fa[i++] = v;
				}
			}
			return this.fa;
		}

		getValue(row: number, col: number): number {
			return this.rows[row].values[col];
		}

		clone(): Mat4 {
			let [a, b, c, d] = this.rows;
			return new Mat4([
				a.x, a.y, a.z, a.w,
				b.x, b.y, b.z, b.w,
				c.x, c.y, c.z, c.w,
				d.x, d.y, d.z, d.w
			]);
		}

		transposed(): Mat4 {
			let [a, b, c, d] = this.rows;
			return new Mat4([
				a.x, b.x, c.x, d.x,
				a.y, b.y, c.y, d.y,
				a.z, b.z, c.z, d.z,
				a.w, b.w, c.w, d.w
			]);
		}

		inverted(): Mat4 {
			let mat = [
				[0, 0, 0, 0],
				[0, 0, 0, 0],
				[0, 0, 0, 0],
				[0, 0, 0, 0]
			];
			let tmp = new Array(12);
			let src = new Array(16);
	
			// Transpose
			for (let i = 0; i < 4; i++) {
				src[i + 0] = this.getValue(i, 0);
				src[i + 4] = this.getValue(i, 1);
				src[i + 8] = this.getValue(i, 2);
				src[i + 12] = this.getValue(i, 3);
			}
	
			// Calculate pairs for first 8 elements (cofactors)
			tmp[0] = src[10] * src[15];
			tmp[1] = src[11] * src[14];
			tmp[2] = src[9] * src[15];
			tmp[3] = src[11] * src[13];
			tmp[4] = src[9] * src[14];
			tmp[5] = src[10] * src[13];
			tmp[6] = src[8] * src[15];
			tmp[7] = src[11] * src[12];
			tmp[8] = src[8] * src[14];
			tmp[9] = src[10] * src[12];
			tmp[10] = src[8] * src[13];
			tmp[11] = src[9] * src[12];
	
			// Calculate first 8 elements (cofactors)
			mat[0][0] = tmp[0] * src[5] + tmp[3] * src[6] + tmp[4] * src[7];
			mat[0][0] -= tmp[1] * src[5] + tmp[2] * src[6] + tmp[5] * src[7];
			mat[0][1] = tmp[1] * src[4] + tmp[6] * src[6] + tmp[9] * src[7];
			mat[0][1] -= tmp[0] * src[4] + tmp[7] * src[6] + tmp[8] * src[7];
			mat[0][2] = tmp[2] * src[4] + tmp[7] * src[5] + tmp[10] * src[7];
			mat[0][2] -= tmp[3] * src[4] + tmp[6] * src[5] + tmp[11] * src[7];
			mat[0][3] = tmp[5] * src[4] + tmp[8] * src[5] + tmp[11] * src[6];
			mat[0][3] -= tmp[4] * src[4] + tmp[9] * src[5] + tmp[10] * src[6];
			mat[1][0] = tmp[1] * src[1] + tmp[2] * src[2] + tmp[5] * src[3];
			mat[1][0] -= tmp[0] * src[1] + tmp[3] * src[2] + tmp[4] * src[3];
			mat[1][1] = tmp[0] * src[0] + tmp[7] * src[2] + tmp[8] * src[3];
			mat[1][1] -= tmp[1] * src[0] + tmp[6] * src[2] + tmp[9] * src[3];
			mat[1][2] = tmp[3] * src[0] + tmp[6] * src[1] + tmp[11] * src[3];
			mat[1][2] -= tmp[2] * src[0] + tmp[7] * src[1] + tmp[10] * src[3];
			mat[1][3] = tmp[4] * src[0] + tmp[9] * src[1] + tmp[10] * src[2];
			mat[1][3] -= tmp[5] * src[0] + tmp[8] * src[1] + tmp[11] * src[2];
	
			// Calculate pairs for second 8 elements (cofactors)
			tmp[0] = src[2] * src[7];
			tmp[1] = src[3] * src[6];
			tmp[2] = src[1] * src[7];
			tmp[3] = src[3] * src[5];
			tmp[4] = src[1] * src[6];
			tmp[5] = src[2] * src[5];
			tmp[6] = src[0] * src[7];
			tmp[7] = src[3] * src[4];
			tmp[8] = src[0] * src[6];
			tmp[9] = src[2] * src[4];
			tmp[10] = src[0] * src[5];
			tmp[11] = src[1] * src[4];
	
			// Calculate second 8 elements (cofactors)
			mat[2][0] = tmp[0] * src[13] + tmp[3] * src[14] + tmp[4] * src[15];
			mat[2][0] -= tmp[1] * src[13] + tmp[2] * src[14] + tmp[5] * src[15];
			mat[2][1] = tmp[1] * src[12] + tmp[6] * src[14] + tmp[9] * src[15];
			mat[2][1] -= tmp[0] * src[12] + tmp[7] * src[14] + tmp[8] * src[15];
			mat[2][2] = tmp[2] * src[12] + tmp[7] * src[13] + tmp[10] * src[15];
			mat[2][2] -= tmp[3] * src[12] + tmp[6] * src[13] + tmp[11] * src[15];
			mat[2][3] = tmp[5] * src[12] + tmp[8] * src[13] + tmp[11] * src[14];
			mat[2][3] -= tmp[4] * src[12] + tmp[9] * src[13] + tmp[10] * src[14];
			mat[3][0] = tmp[2] * src[10] + tmp[5] * src[11] + tmp[1] * src[9];
			mat[3][0] -= tmp[4] * src[11] + tmp[0] * src[9] + tmp[3] * src[10];
			mat[3][1] = tmp[8] * src[11] + tmp[0] * src[8] + tmp[7] * src[10];
			mat[3][1] -= tmp[6] * src[10] + tmp[9] * src[11] + tmp[1] * src[8];
			mat[3][2] = tmp[6] * src[9] + tmp[11] * src[11] + tmp[3] * src[8];
			mat[3][2] -= tmp[10] * src[11] + tmp[2] * src[8] + tmp[7] * src[9];
			mat[3][3] = tmp[10] * src[10] + tmp[4] * src[8] + tmp[9] * src[9];
			mat[3][3] -= tmp[8] * src[9] + tmp[11] * src[10] + tmp[5] * src[8];
	
			// Calculate determinant
			let det = 1.0 / (src[0] * mat[0][0] + src[1] * mat[0][1] + src[2] * mat[0][2] + src[3] * mat[0][3]);
			for (let i = 0; i < 4; i++) {
				for (let j = 0; j < 4; j++) {
					mat[i][j] = mat[i][j] * det;
				}
			}
	
			let fmat = new Array(16);
			for (let row of mat) {
				fmat.push(...row);
			}
			return new Mat4(fmat);
		}

		mul(rhs: Mat4 | Vec4 | Vec3): Mat4 | Vec4 | Vec3 {
			if (rhs instanceof Mat4) {
				let d = new Array(16);
				let ot = rhs.transposed();
				for (let j = 0; j < 4; j++) {
					for (let i = 0; i < 4; i++) {
						d[i + j * 4] = this.rows[j].dot(ot.rows[i]);
					}
				}
				return new Mat4(d);
			} else if (rhs instanceof Vec4) {
				return new Vec4(
					this.rows[0].dot(rhs),
					this.rows[1].dot(rhs),
					this.rows[2].dot(rhs),
					this.rows[3].dot(rhs)
				);
			} else if (rhs instanceof Vec3) {
				let v = new Vec4(rhs.x, rhs.y, rhs.z, 1);
				return new Vec3(
					this.rows[0].dot(v),
					this.rows[1].dot(v),
					this.rows[2].dot(v)
				);
			} else if (typeof rhs == 'number') {
				let d = new Array(16);
				for (let j = 0; j < 4; j++) {
					for (let i = 0; i < 4; i++) {
						d[i + j * 4] = this.getValue(j, i) * rhs;
					}
				}
				return new Mat4(d);
			}
		}

		static ident(): Mat4 {
			return new Mat4([
				1, 0, 0, 0,
				0, 1, 0, 0,
				0, 0, 1, 0,
				0, 0, 0, 1
			]);
		}
	
		static translation(x: number | Vec3, y: number=0, z: number=0): Mat4 {
			let vx = 0, vy = y, vz = z;
			if (x instanceof Vec3) {
				vx = x.x; vy = x.y; vz = x.z;
			} else {
				vx = x; vy = y; vz = z;
			}
			return new Mat4([
				1, 0, 0, 0,
				0, 1, 0, 0,
				0, 0, 1, 0,
				vx, vy, vz, 1
			]);
		}
	
		static scale(x: number | Vec3, y: number=0, z: number=0): Mat4 {
			let vx = 0, vy = y, vz = z;
			if (x instanceof Vec3) {
				vx = x.x; vy = x.y; vz = x.z;
			} else {
				vx = x; vy = y; vz = z;
			}
			return new Mat4([
				vx, 0, 0, 0,
				0, vy, 0, 0,
				0, 0, vz, 0,
				0, 0, 0, 1
			]);
		}
	
		static uniformScale(s: number): Mat4 {
			return new Mat4([
				s, 0, 0, 0,
				0, s, 0, 0,
				0, 0, s, 0,
				0, 0, 0, 1
			]);
		}
	
		static rotationX(a: number): Mat4 {
			let s = Math.sin(a), c = Math.cos(a);
			return new Mat4([
				1.0, 0.0, 0.0, 0.0,
				0.0,   c,  -s, 0.0,
				0.0,   s,   c, 0.0,
				0.0, 0.0, 0.0, 1.0
			]);
		}
	
		static rotationY(a: number): Mat4 {
			let s = Math.sin(a), c = Math.cos(a);
			return new Mat4([
				  c, 0.0,  -s, 0.0,
				0.0, 1.0, 0.0, 0.0,
				  s, 0.0,   c, 0.0,
				0.0, 0.0, 0.0, 1.0
			]);
		}
	
		static rotationZ(a: number): Mat4 {
			let s = Math.sin(a), c = Math.cos(a);
			return new Mat4([
				  c,  -s, 0.0, 0.0,
				  s,   c, 0.0, 0.0,
				0.0, 0.0, 1.0, 0.0,
				0.0, 0.0, 0.0, 1.0
			]);
		}
	
		static axisAngle(axis: Vec3, a: number): Mat4 {
			let s = Math.sin(a), c = Math.cos(a);
			let t = 1.0 - c;
			let ax = axis.normalized();
			let x = ax.x;
			let y = ax.y;
			let z = ax.z;
			return new Mat4([
				t * x * x + c, t * x * y - z * s, t * x * z + y * s, 0.0,
				t * x * y + z * s, t * y * y + c, t * y * z - x * s, 0.0,
				t * x * z - y * s, t * y * z + x * s, t * z * z + c, 0.0,
				0.0, 0.0, 0.0, 1.0
			]);
		}
	
		static ortho(l: number, r: number, t: number, b: number, n: number, f: number): Mat4 {
			let w = r - l;
			let h = b - t;
			let d = f - n;
			return new Mat4([
					 2.0 / w,			0.0,		  0.0, 0.0,
						 0.0,		2.0 / h,		  0.0, 0.0,
						 0.0,			0.0, 	 -2.0 / d, 0.0,
				-(r + l) / w,  -(t + b) / h, -(f + n) / d, 1.0
			]);
		}
	
		static ortho2D(width: number, height: number): Mat4 {
			return Mat4.ortho(0, width, height, 0, -1, 1);
		}
	
		static frustum(l: number, r: number, b: number, t: number, n: number, f: number): Mat4 {
			let n2, w, h, d;
	
			n2 = 2 * n;
			w = r - l;
			h = t - b;
			d = f - n;
	
			let m = new Mat4();
			m.rows[0].set(n2 / w, 0, 0, 0);
			m.rows[1].set(0, n2 / h, 0, 0);
			m.rows[2].set((r + l) / w, (t + b) / h, (-f - n) / d, -1);
			m.rows[3].set(0, 0, (-n2 * f) / d, 0);
	
			return m;
		}
	
		static perspective(fov: number, asp: number, n: number, f: number): Mat4 {
			let xmax, ymax;
			ymax = n * Math.tan(fov);
			xmax = ymax * asp;
			return Mat4.frustum(-xmax, xmax, -ymax, ymax, n, f);
		}
	
		static lookAt(eye: Vec3, at: Vec3, up: Vec3): Mat4 {
			let z = eye.sub(at).normalized();
			let x = up.cross(z).normalized();
			let y = z.cross(x);
	
			let R = new Mat4([
				x.x, x.y, -x.z, 0.0,
				y.x, y.y, -y.z, 0.0,
				z.x, z.y, -z.z, 0.0,
				0.0, 0.0, 0.0, 1.0
			]);
	
			return Mat4.translation(eye.mul(-1)).mul(R) as Mat4;
		}
	}
}