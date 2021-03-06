interface Math {
	radians(d: number): number;
	degrees(r: number): number;
	cot(a: number): number;
	isPowerOfTwo(v: number): boolean;
	sinCos(a: number): Array<number>;
}

Math.radians = function(d: number): number {
	return d * Math.PI / 180;
}

Math.degrees = function(r: number): number {
	return r * 180 / Math.PI;
}

Math.cot = function(a: number): number {
	return 1.0 / Math.tan(a);
}

Math.isPowerOfTwo = function(v: number): boolean {
	return (v & (v - 1)) == 0;
}

Math.sinCos = function(a: number): Array<number> {
	return [Math.sin(a), Math.cos(a)];
}

interface Array<T> {
	first(): T;
	last(): T;
	empty(): boolean;
}

Array.prototype.first = function() {
	return this[0];
}

Array.prototype.last = function() {
	return this[this.length-1];
}

Array.prototype.empty = function() {
	return this.length == 0;
}

namespace GLFX {
	export interface IGLResource {
		destroy(): void;
	}

	export interface IDict<V> {
		add(k: string, value: V): void;
		containsKey(k: string): boolean;
		length(): number;
		get(k: string): V;
		keys(): string[];
		remove(k: string): V;
		values(): V[];
	}

	export class Dict<V> implements IDict<V> {
		private items: { [index: string]: V } = {};

		containsKey(k: string): boolean {
			return this.items.hasOwnProperty(k);
		}

		length(): number {
			return this.keys().length;
		}

		add(k: string, value: V) {
			this.items[k] = value;
		}

		remove(k: string): V {
			var val = this.items[k];
			delete this.items[k];
			return val;
		}

		get(k: string): V {
			return this.items[k];
		}

		keys(): string[] {
			return Object.keys(this.items);
		}

		values(): V[] {
			return Object.keys(this.items).map(key => this.items[key]);
		}
	}
}