import type {TCreateTutorChatInput} from "@repo/schemas";
import {Button, Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle} from "@repo/ui";
import {useMutation} from "@tanstack/react-query";
import {useNavigate} from "@tanstack/react-router";
import {BookOpenIcon, SparklesIcon} from "lucide-react";
import {useState} from "react";
import {toast} from "sonner";
import {MODALS, useModal} from "@/features/shared";
import {
	getCreateTutorChatMutationOptions,
	templates,
	TemplateSelect,
	TutorChatForm,
	tutorChatFormId
} from "@/features/tutor-chats";

export const CreateTutorChatModal = () => {
	const { isOpen, close } = useModal(MODALS.CREATE_TUTOR_CHAT);
	const [step, setStep] = useState<"choose" | "scratch" | "template">("choose");
	const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

	const navigate = useNavigate();

	const { mutate: createTutorChat } = useMutation(getCreateTutorChatMutationOptions());

	const handleCreateFromScratch = (data: TCreateTutorChatInput) => {
		createTutorChat(data, {
			onSuccess: (result) => {
				handleClose();

				toast.success("Tutor chat created successfully!");

				navigate({
					to: "/p/tutor-chats/$tutorChatId",
					params: {
						tutorChatId: result.id
					}
				});
			},
			onError: (error) => {
				if (error instanceof Error) {
					toast.error(error.message);
				}
			}
		});
	};

	const handleCreateFromTemplate = () => {
		// TODO: replace with actual implementation
		const template = templates.find((t) => t.id === selectedTemplate);

		if (!template) return;

		handleCreateFromScratch({
			name: template.name,
			description: template.description,
			topic: template.topic
		});
	};

	const handleClose = () => {
		setStep("choose");
		setSelectedTemplate(null);
		close();
	};

	return (
		<Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
			<DialogContent className="flex max-h-[90vh] flex-col overflow-hidden p-0 sm:max-w-4xl">
				<div className="relative border-b px-6 py-4 sm:px-8 sm:py-6">
					<div className="pointer-events-none absolute inset-0 bg-[radial-gradient(80%_80%_at_10%_0%,rgba(56,189,248,0.1),transparent_60%),radial-gradient(60%_60%_at_100%_0%,rgba(16,185,129,0.08),transparent_55%)]" />
					<DialogHeader className="relative text-left">
						<div className="flex items-center gap-4">
							<div className="flex size-12 shrink-0 items-center justify-center rounded-2xl border bg-background/80 shadow-sm">
								<BookOpenIcon className="size-6 text-foreground" />
							</div>
							<div className="space-y-1">
								<DialogTitle className="text-xl font-bold sm:text-2xl">Create a tutor chat</DialogTitle>
								<DialogDescription className="text-sm">
									Design a focused study companion with a clear topic, tone, and teaching style.
								</DialogDescription>
							</div>
						</div>
					</DialogHeader>
				</div>

				<div className="relative flex-1 overflow-y-auto px-6 py-6 sm:px-8">
					<div className="space-y-6">
						{step === "choose" && (
							<div className="rounded-2xl border bg-muted/30 p-4 sm:p-6">
								<div className="flex items-center justify-between gap-3">
									<div>
										<p className="text-sm font-semibold">Choose a creation mode</p>
										<p className="text-xs text-muted-foreground">Start from scratch or pick a proven template.</p>
									</div>
									<div className="rounded-full border bg-background px-2.5 py-1 text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
										Step 1
									</div>
								</div>
								<div className="mt-4 grid gap-4 md:grid-cols-2">
									<button
										type="button"
										onClick={() => setStep("scratch")}
										className="group relative flex flex-col items-start gap-2 rounded-xl border bg-background p-5 text-left shadow-sm transition-all hover:border-primary/50 hover:bg-primary/5 hover:shadow-md">
										<div className="flex w-full items-start justify-between">
											<div className="rounded-lg bg-primary/10 p-2 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
												<SparklesIcon className="size-5" />
											</div>
											<span className="rounded-full bg-primary/10 px-2.5 py-1 text-[10px] font-bold text-primary uppercase">
												Recommended
											</span>
										</div>
										<div className="mt-2">
											<p className="text-base font-bold">From scratch</p>
											<p className="mt-1 text-xs leading-relaxed text-muted-foreground">
												Define your own name, topic, and prompt for total control.
											</p>
										</div>
									</button>
									<button
										type="button"
										onClick={() => setStep("template")}
										className="group flex flex-col items-start gap-2 rounded-xl border bg-background p-5 text-left shadow-sm transition-all hover:border-primary/50 hover:bg-primary/5 hover:shadow-md">
										<div className="rounded-lg bg-muted p-2 text-muted-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
											<BookOpenIcon className="size-5" />
										</div>
										<div className="mt-2">
											<p className="text-base font-bold">Using a template</p>
											<p className="mt-1 text-xs leading-relaxed text-muted-foreground">
												Search and reuse high-performing tutor setups.
											</p>
										</div>
									</button>
								</div>
							</div>
						)}

						{step === "scratch" && (
							<>
								<div className="rounded-2xl border bg-muted/30 p-4 sm:p-6">
									<div className="flex items-center justify-between gap-3 mb-6<">
										<div>
											<p className="text-sm font-semibold">From scratch</p>
											<p className="text-xs text-muted-foreground">
												Build a tutor with a custom prompt and teaching style.
											</p>
										</div>
										<div className="rounded-full border bg-background px-2.5 py-1 text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
											Step 2
										</div>
									</div>
									<TutorChatForm mode={"create"} onSubmit={handleCreateFromScratch} />
								</div>
								<div className="flex flex-wrap items-center gap-3">
									<div className="inline-flex items-center gap-2 rounded-lg border bg-muted/20 px-3 py-1.5 text-[11px] font-medium text-muted-foreground">
										<SparklesIcon className="size-3.5 text-primary" />
										<span>Keep prompts concise for best results</span>
									</div>
									<div className="inline-flex items-center gap-2 rounded-lg border bg-muted/20 px-3 py-1.5 text-[11px] font-medium text-muted-foreground">
										<div className="size-1.5 rounded-full bg-primary" />
										<span>Every field sharpens the tutor's focus</span>
									</div>
								</div>
							</>
						)}

						{step === "template" && <TemplateSelect value={selectedTemplate} onChange={setSelectedTemplate} />}
					</div>
				</div>
				<DialogFooter className="border-t bg-muted/30 px-6 py-4 sm:px-8">
					<div className="flex w-full items-center justify-between">
						<Button
							variant="ghost"
							type="button"
							className="h-9 px-4 text-sm font-medium"
							onClick={() => {
								if (step === "choose") {
									handleClose();
									return;
								}
								setStep("choose");
							}}>
							{step === "choose" ? "Cancel" : "Back"}
						</Button>
						<div className="flex items-center gap-3">
							{step === "scratch" && (
								<Button type="submit" form={tutorChatFormId} className="h-9 px-5 text-sm font-bold">
									Create tutor chat
								</Button>
							)}
							{step === "template" && (
								<Button
									type="button"
									disabled={!selectedTemplate}
									onClick={handleCreateFromTemplate}
									className="h-9 px-5 text-sm font-bold">
									Continue
								</Button>
							)}
						</div>
					</div>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};
