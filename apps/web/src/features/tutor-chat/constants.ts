import {AIModels} from "@repo/constants";

export const models = [
	{
		chef: "Google",
		chefSlug: "google",
		id: AIModels.GEMINI_2_5_FLASH,
		name: "Gemini 2.5 Flash",
		providers: ["google", "google-vertex"]
	},
	{
		chef: "Google",
		chefSlug: "google",
		id: AIModels.GEMINI_3_FLASH,
		name: "Gemini 3.0 Flash",
		providers: ["google", "google-vertex"]
	},
	{
		chef: "Google",
		chefSlug: "google",
		id: AIModels.GEMINI_3_PRO,
		name: "Gemini 3.0 Pro",
		providers: ["google", "google-vertex"]
	}
];


