import type {TFindAllTutorChatsInput} from "@repo/schemas";

export const TUTOR_CHATS_API_ROUTES = {
	root: "tutor-chats",
	by_id: (id: string) => `tutor-chats/by-id/${id}`,
	bulk: "tutor-chats/bulk"
} as const;

export const TUTOR_CHATS_QUERY_KEYS = {
	base: ["tutor-chats"],
	findAll: (data?: TFindAllTutorChatsInput) =>
		[...TUTOR_CHATS_QUERY_KEYS.base, "all", data?.limit, data?.cursor].filter(Boolean),
	findAllInfinite: (data?: TFindAllTutorChatsInput) => [...TUTOR_CHATS_QUERY_KEYS.findAll(data), "infinite"]
};

export const DEFAULT_TUTOR_CHATS_LIMIT = 20;

export const templates = [
	{
		id: "stem-problem-solver",
		name: "STEM Problem Solver",
		description: "Step-by-step reasoning with checkpoints.",
		topic: "Math & Physics"
	},
	{
		id: "essay-coach",
		name: "Essay Coach",
		description: "Thesis support, structure, and citations.",
		topic: "Writing & Humanities"
	},
	{
		id: "language-drill",
		name: "Language Drill",
		description: "Vocabulary, grammar, and quick practice loops.",
		topic: "Languages"
	},
	{
		id: "chem-lab-guide",
		name: "Chem Lab Guide",
		description: "Lab reports, safety, and reaction walkthroughs.",
		topic: "Chemistry"
	},
	{
		id: "history-debate",
		name: "History Debate",
		description: "Balanced viewpoints with evidence prompts.",
		topic: "History & Debate"
	},
	{
		id: "code-mentor",
		name: "Code Mentor",
		description: "Debugging, patterns, and clean explanations.",
		topic: "Programming"
	},
	{
		id: "exam-prep",
		name: "Exam Prep Sprint",
		description: "Timeboxed drills with spaced repetition.",
		topic: "Test Prep"
	},
	{
		id: "calculus-walkthrough",
		name: "Calculus Walkthrough",
		description: "Derivatives and integrals made intuitive.",
		topic: "Calculus"
	},
	{
		id: "reading-companion",
		name: "Reading Companion",
		description: "Summaries, themes, and comprehension checks.",
		topic: "Literature"
	},
	{
		id: "econ-explainer",
		name: "Econ Explainer",
		description: "Models, graphs, and real-world examples.",
		topic: "Economics"
	},
	{
		id: "bio-concepts",
		name: "Bio Concepts",
		description: "Systems thinking for biology fundamentals.",
		topic: "Biology"
	},
	{
		id: "productivity-coach",
		name: "Study Focus Coach",
		description: "Plans, accountability, and progress checks.",
		topic: "Study Skills"
	}
];
