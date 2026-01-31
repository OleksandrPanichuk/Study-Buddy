import type {TTutorChat} from "@repo/schemas";
import {Checkbox} from "@repo/ui";
import {Link} from "@tanstack/react-router";
import {formatDistanceToNow} from "date-fns";
import {MessageSquareIcon} from "lucide-react";
import randomColor from "randomcolor";
import {TutorChatActions} from "@/features/tutor-chats";

interface ITutorChatCardProps {
	data: TTutorChat;
	isBulkMode?: boolean;
	isSelected?: boolean;
	onToggleSelection?: (id: string) => void;
}

export const TutorChatCard = ({ data, isBulkMode, isSelected, onToggleSelection }: ITutorChatCardProps) => {
	const topicLabel = data.topic?.trim() || "No topic";
	const description = data.description?.trim();

	return (
		<div className="group relative flex h-full flex-col gap-4 rounded-2xl border bg-card/80 p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:bg-accent/40 hover:shadow-md">
			<div className="flex items-start gap-4">
				{isBulkMode && (
					<div className="flex h-12 items-center">
						<Checkbox
							checked={isSelected}
							onCheckedChange={() => onToggleSelection?.(data.id)}
							onClick={(e) => e.stopPropagation()}
						/>
					</div>
				)}
				<div
					className="flex size-12 shrink-0 items-center justify-center rounded-2xl ring-1 ring-black/5"
					style={{
						backgroundColor: randomColor({
							seed: data.name,
							luminosity: "light"
						})
					}}>
					<MessageSquareIcon
						style={{
							fill: randomColor({
								seed: data.name,
								luminosity: "dark"
							}),
							stroke: "none"
						}}
						className="size-6"
					/>
				</div>

				<Link
					to={"/p/tutor-chats/$tutorChatId"}
					params={{ tutorChatId: data.id }}
					className="min-w-0 flex-1 space-y-2">
					<div className="space-y-1">
						<h3 className="truncate text-base font-semibold text-foreground transition-colors group-hover:text-primary">
							{data.name}
						</h3>
						{description ? (
							<p className="line-clamp-2 text-sm text-muted-foreground">{description}</p>
						) : (
							<p className="text-sm text-muted-foreground/70">No description yet</p>
						)}
					</div>
					<div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
						<span className="inline-flex items-center rounded-full bg-secondary px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-secondary-foreground">
							{topicLabel}
						</span>
						<span className="text-xs text-muted-foreground/60">Updated</span>
						<span className="text-xs">{formatDistanceToNow(data.updatedAt, { addSuffix: true })}</span>
					</div>
				</Link>
				<div className="flex shrink-0 items-start">
					<TutorChatActions data={data} />
				</div>
			</div>
		</div>
	);
};
