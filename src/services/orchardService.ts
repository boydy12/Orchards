import { OrchardLocation } from "../models/orchardData";

export async function getOrchards(): Promise<OrchardLocation[]> {
	const orchardGet = await fetch("https://bx.group/.test/orchards.json");
	const orchardData = await orchardGet.json();
	return orchardData;
}