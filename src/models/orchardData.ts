export interface OrchardLocation {
   name: string,
	fruit: string,
	variety: string,
	growingSystem: string,
	areaHa: number,
	trees: number,
	planted: number,
	lat: number,
	lng: number,
	boundaries: Boundaries;
}

export interface Boundaries {
	type: string,
	coordinates: number[][];
}
