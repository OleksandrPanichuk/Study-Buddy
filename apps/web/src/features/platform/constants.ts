import {
	BookOpenIcon,
	DumbbellIcon,
	FileTextIcon,
	GraduationCapIcon,
	HomeIcon,
	LibraryIcon,
	type LucideIcon,
	MessageSquareIcon,
	NotebookPenIcon,
	SparklesIcon
} from "lucide-react";

interface ISidebarItem {
	title: string;
	href: string;
	icon: LucideIcon;
}

export const generalSidebarItems: ISidebarItem[] = [
	{
		title: "Overview",
		href: "/dashboard",
		icon: HomeIcon,
	},
	{
		title: "Practice",
		href: "/dashboard/practice",
		icon: DumbbellIcon,
	},
] as const;

export const librarySidebarItems: ISidebarItem[] = [
	{
		title: "All Materials",
		href: "/dashboard/library",
		icon: LibraryIcon,
	},
	{
		title: "Files",
		href: "/dashboard/library/files",
		icon: FileTextIcon,
	},
	{
		title: "Flashcards",
		href: "/dashboard/library/flashcards",
		icon: BookOpenIcon,
	},
	{
		title: "Quizzes",
		href: "/dashboard/library/quizzes",
		icon: SparklesIcon,
	},
	{
		title: "Notes",
		href: "/dashboard/library/notes",
		icon: NotebookPenIcon,
	},
] as const;

// TODO: remove next two constants when provided logic for chat/study sessions creation
export const tutorChatsSidebarItems: ISidebarItem[] = [
	{
		title: "Math Chat",
		href: "/dashboard/chats/math",
		icon: MessageSquareIcon,
	},
	{
		title: "Physics Chat",
		href: "/dashboard/chats/physics",
		icon: MessageSquareIcon,
	},
	{
		title: "Python Chat",
		href: "/dashboard/chats/python",
		icon: MessageSquareIcon,
	},
] as const;

export const studySessionsSidebarItems: ISidebarItem[] = [
	{
		title: "Python Basics",
		href: "/dashboard/sessions/python-basics",
		icon: GraduationCapIcon,
	},
	{
		title: "Linear Algebra",
		href: "/dashboard/sessions/linear-algebra",
		icon: GraduationCapIcon,
	},
	{
		title: "English Vocabulary",
		href: "/dashboard/sessions/english-vocab",
		icon: GraduationCapIcon,
	},
] as const;
