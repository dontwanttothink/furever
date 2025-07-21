export enum Sex {
	Unknown = 0,
	Male,
	Female,
	Indeterminate,
}

export function getUserReadableSexName(sex: Sex): string {
	switch (sex) {
		case Sex.Unknown:
			return "Desconocido";
		case Sex.Male:
			return "Masculino";
		case Sex.Female:
			return "Femenino";
		case Sex.Indeterminate:
			return "Indeterminado u ambiguo";
	}
}

export enum Species {
	Other = 0,
	Dog = 1,
	Cat = 2,
}

export function getUserReadableSpeciesName(species: Species): string {
	switch (species) {
		case Species.Cat:
			return "Gato";
		case Species.Dog:
			return "Perro";
		case Species.Other:
			return "Otra especie";
	}
}

export enum DogBreeds {
	Other = 0,
	Unknown = 1,
	Mixed = 2,
	BorderCollie,
	Labrador,
	GermanShepherd,
	GoldenRetriever,
	Bulldog,
	Beagle,
	Poodle,
	Rottweiler,
	YorkshireTerrier,
	Boxer,
	Dachshund,
}

export function getUserReadableBreedName(breed: DogBreeds): string {
	switch (breed) {
		case DogBreeds.Other:
			return "Otra raza";
		case DogBreeds.Mixed:
			return "Mestizo";
		case DogBreeds.Unknown:
			return "Ninguna especificada";
		case DogBreeds.BorderCollie:
			return "Border Collie";
		case DogBreeds.Labrador:
			return "Labrador";
		case DogBreeds.GermanShepherd:
			return "Pastor Alemán";
		case DogBreeds.GoldenRetriever:
			return "Golden Retriever";
		case DogBreeds.Bulldog:
			return "Bulldog";
		case DogBreeds.Beagle:
			return "Beagle";
		case DogBreeds.Poodle:
			return "Poodle";
		case DogBreeds.Rottweiler:
			return "Rottweiler";
		case DogBreeds.YorkshireTerrier:
			return "Yorkshire Terrier";
		case DogBreeds.Boxer:
			return "Boxer";
		case DogBreeds.Dachshund:
			return "Dachshund";
	}
}

export enum CatBreeds {
	Mixed = 0,
	Unknown = 1,
}

export enum Temperament {
	Unknown = 0,
	Calm,
	Friendly,
	Aggressive,
	Playful,
	Shy,
	Loyal,
	Energetic,
	Curious,
	Protective,
	Independent,
	Affectionate,
}

export enum ChronicConditions {
	Arthritis = 0,
	Diabetes,
	HeartDisease,
	KidneyDisease,
	LiverDisease,
	Cancer,
	Epilepsy,
	Allergies,
	Obesity,
	DentalDisease,
	Hypothyroidism,
	Hyperthyroidism,
	CushingSyndrome,
	AddisonDisease,
	RespiratoryIssues,
	UrinaryTractInfections,
	SkinConditions,
	GastrointestinalIssues,
	Blindness,
	Deafness,
	HipDysplasia,
	LuxatingPatella,
	Bloat,
	Anemia,
	Parvovirus,
	Distemper,
	LymeDisease,
	FelineLeukemia,
	FelineImmunodeficiencyVirus,
	Rabies,
	Heartworm,
	Ringworm,
	Mange,
	Pancreatitis,
	Glaucoma,
	Cataracts,
	Anxiety,
	Depression,
}
