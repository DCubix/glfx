namespace GLFX {
	export class Quat {
		x: number;
		y: number;
		z: number;
		w: number;

		constructor(x: number, y: number, z: number, w: number) {
			this.x = x;
			this.y = y;
			this.z = z;
			this.w = w;
		}

		get imaginary(): Vec3 {
			return new Vec3(this.x, this.y, this.z);
		}

		get magnitude(): number {
			return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w);
		}

		get forward(): Vec3 {
			return this.mul(new Vec3(0, 0, -1)) as Vec3;
		}

		get right(): Vec3 {
			return this.mul(new Vec3(1, 0, 0)) as Vec3;
		}

		get up(): Vec3 {
			return this.mul(new Vec3(0, 1, 0)) as Vec3;
		}

		normalized(): Quat {
			let m = this.magnitude;
			return new Quat(this.x / m, this.y / m, this.z / m, this.w / m);
		}

		conjugated(): Quat {
			return new Quat(-this.x, -this.y, -this.z, this.w);
		}

		toMat4(): Mat4 {
			return Mat4.fromRows([
				(this.mul(new Vec3(1.0, 0.0, 0.0)) as Vec3).extend(0.0),
				(this.mul(new Vec3(0.0, 1.0, 0.0)) as Vec3).extend(0.0),
				(this.mul(new Vec3(0.0, 0.0, 1.0)) as Vec3).extend(0.0),
				new Vec4(0, 0, 0, 1)
			]).transposed();
		}

		add(q: Quat): Quat {
			return new Quat(this.x + q.x, this.y + q.y, this.z + q.z, this.w + q.w);
		}

		mul(o: Quat | Vec3 | number): Quat | Vec3 {
			if (o instanceof Quat) {
				return new Quat(
					 this.w*o.x - this.z*o.y + this.y*o.z + this.x*o.w,
					 this.z*o.x + this.w*o.y - this.x*o.z + this.y*o.w,
					-this.y*o.x + this.x*o.y + this.w*o.z + this.z*o.w,
					-this.x*o.x - this.y*o.y - this.z*o.z + this.w*o.w
				);
			} else if (o instanceof Vec3) {
				let q = new Quat(o.x, o.y, o.z, 0.0);
				return (this.mul(q.mul(this.conjugated())) as Quat).imaginary;
			} else {
				return new Quat(this.x * o, this.y * o, this.z * o, this.w * o);
			}
		}

		static axisAngle(axis: Vec3, angle: number): Quat {
			let a = angle / 2.0;
			let s = Math.sin(angle);

			return new Quat(
				axis.x * s,
				axis.y * s,
				axis.z * s,
				Math.cos(a)
			);
		}
	}
}