namespace GLFX {
	export class Vec2 {
		x: number;
		y: number;

		constructor(x: number = 0, y: number = 0) {
			this.x = x;
			this.y = y;
		}

		dot(b: Vec2): number {
			return this.x * b.x + this.y * b.y;
		}

		perpDot(b: Vec2): number {
			return this.x * b.y - this.y * b.x;
		}

		neg(): Vec2 {
			return this.mul(-1);
		}

		extend(z: number): Vec3 {
			return new Vec3(this.x, this.y, z);
		}

		normalized(): Vec2 {
			let len = this.length;
			return new Vec2(this.x / len, this.y / len);
		}

		get perp(): Vec2 {
			return new Vec2(-this.y, this.x);
		}

		get angle(): number {
			return Math.atan2(this.y, this.x);
		}

		get lengthSqr(): number {
			return this.dot(this);
		}

		get length(): number {
			return Math.sqrt(this.lengthSqr);
		}

		add(b: Vec2 | number): Vec2 {
			let v: Vec2;
			if (b instanceof Vec2) {
				v = b;
			} else {
				v = new Vec2(b, b);
			}
			return new Vec2(this.x + v.x, this.y + v.y);
		}

		sub(b: Vec2 | number): Vec2 {
			let v: Vec2;
			if (b instanceof Vec2) {
				v = b;
			} else {
				v = new Vec2(b, b);
			}
			return new Vec2(this.x - v.x, this.y - v.y);
		}

		mul(b: Vec2 | number): Vec2 {
			let v: Vec2;
			if (b instanceof Vec2) {
				v = b;
			} else {
				v = new Vec2(b, b);
			}
			return new Vec2(this.x * v.x, this.y * v.y);
		}

		div(b: Vec2 | number): Vec2 {
			let v: Vec2;
			if (b instanceof Vec2) {
				v = b;
			} else {
				v = new Vec2(b, b);
			}
			return new Vec2(this.x / v.x, this.y / v.y);
		}

		set(x: number, y: number) {
			this.x = x;
			this.y = y;
		}
	}

	export class Vec3 {
		x: number;
		y: number;
		z: number;

		constructor(x: number = 0, y: number = 0, z: number = 0) {
			this.x = x;
			this.y = y;
			this.z = z;
		}

		dot(b: Vec3): number {
			return this.x * b.x + this.y * b.y + this.z * b.z;
		}

		cross(b: Vec3): Vec3 {
			return new Vec3(
				this.y * b.z - this.z * b.y,
				this.z * b.x - this.x * b.z,
				this.x * b.y - this.y * b.x
			);
		}

		neg(): Vec3 {
			return this.mul(-1);
		}

		extend(w: number): Vec4 {
			return new Vec4(this.x, this.y, this.z, w);
		}

		normalized(): Vec3 {
			let len = this.length;
			return new Vec3(this.x / len, this.y / len, this.z / len);
		}

		get lengthSqr(): number {
			return this.dot(this);
		}

		get length(): number {
			return Math.sqrt(this.lengthSqr);
		}

		add(b: Vec3 | number): Vec3 {
			let v: Vec3;
			if (b instanceof Vec3) {
				v = b;
			} else {
				v = new Vec3(b, b, b);
			}
			return new Vec3(this.x + v.x, this.y + v.y, this.z + v.z);
		}

		sub(b: Vec3 | number): Vec3 {
			let v: Vec3;
			if (b instanceof Vec3) {
				v = b;
			} else {
				v = new Vec3(b, b, b);
			}
			return new Vec3(this.x - v.x, this.y - v.y, this.z - v.z);
		}

		mul(b: Vec3 | number): Vec3 {
			let v: Vec3;
			if (b instanceof Vec3) {
				v = b;
			} else {
				v = new Vec3(b, b, b);
			}
			return new Vec3(this.x * v.x, this.y * v.y, this.z * v.z);
		}

		div(b: Vec3 | number): Vec3 {
			let v: Vec3;
			if (b instanceof Vec3) {
				v = b;
			} else {
				v = new Vec3(b, b);
			}
			return new Vec3(this.x / v.x, this.y / v.y, this.z / v.z);
		}
	}

	export class Vec4 {
		x: number;
		y: number;
		z: number;
		w: number;

		constructor(x: number = 0, y: number = 0, z: number = 0, w: number = 1) {
			this.x = x;
			this.y = y;
			this.z = z;
			this.w = w;
		}

		dot(b: Vec4): number {
			return this.x * b.x + this.y * b.y + this.z * b.z + this.w * b.w;
		}

		normalized(): Vec4 {
			let len = this.length;
			return new Vec4(this.x / len, this.y / len, this.z / len, this.w / len);
		}

		set(x: number, y: number, z: number, w: number) {
			this.x = x;
			this.y = y;
			this.z = z;
			this.w = w;
		}

		neg(): Vec4 {
			return this.mul(-1);
		}

		get lengthSqr(): number {
			return this.dot(this);
		}

		get length(): number {
			return Math.sqrt(this.lengthSqr);
		}

		get values(): Array<number> {
			return [this.x, this.y, this.z, this.w];
		}

		add(b: Vec4 | number): Vec4 {
			let v: Vec4;
			if (b instanceof Vec4) {
				v = b;
			} else {
				v = new Vec4(b, b, b, b);
			}
			return new Vec4(this.x + v.x, this.y + v.y, this.z + v.z, this.w + v.w);
		}

		sub(b: Vec4 | number): Vec4 {
			let v: Vec4;
			if (b instanceof Vec4) {
				v = b;
			} else {
				v = new Vec4(b, b, b);
			}
			return new Vec4(this.x - v.x, this.y - v.y, this.z - v.z, this.w - v.w);
		}

		mul(b: Vec4 | number): Vec4 {
			let v: Vec4;
			if (b instanceof Vec4) {
				v = b;
			} else {
				v = new Vec4(b, b, b, b);
			}
			return new Vec4(this.x * v.x, this.y * v.y, this.z * v.z, this.w * v.w);
		}
	}
}