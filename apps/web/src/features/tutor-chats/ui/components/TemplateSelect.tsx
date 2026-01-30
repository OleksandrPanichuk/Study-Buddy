import { Input } from "@repo/ui";
import { PlusIcon } from "lucide-react";
import { useState } from "react";
import { templates } from "../../constants";

interface ITemplateSelectProps {
	value: string | null;
	onChange: (templateId: string) => void;
}

export const TemplateSelect = ({ value, onChange }: ITemplateSelectProps) => {
	const [searchValue, setSearchValue] = useState("");
	const data = templates; //TODO: fetch templates from the server with searchValue

	return (
		<div className="rounded-2xl border bg-muted/30 p-4 sm:p-6">
			<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
				<div>
					<p className="text-sm font-semibold">Using a template</p>
					<p className="text-xs text-muted-foreground">
						Pick a template and adjust the details later.
					</p>
				</div>
				<div className="w-full sm:w-64">
					<Input
						value={searchValue}
						onChange={(e) => setSearchValue(e.target.value)}
						type="search"
						name="template-search"
						placeholder="Search templates..."
						className="bg-background"
					/>
				</div>
			</div>
			<div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
				{data.map((template) => {
					const isSelected = value === template.id;
					return (
						<button
							key={template.id}
							type="button"
							onClick={() => onChange(template.id)}
							className={`group flex flex-col rounded-xl border p-4 text-left shadow-sm transition-all ${
								isSelected
									? "border-primary bg-primary/5 ring-2 ring-primary/20"
									: "bg-background hover:border-primary/30 hover:bg-muted/50"
							}`}
						>
							<div className="mb-2 flex items-start justify-between gap-2">
								<p className="text-sm font-bold leading-tight group-hover:text-primary transition-colors">
									{template.name}
								</p>
								<div
									className={`flex size-5 shrink-0 items-center justify-center rounded-full border transition-colors ${
										isSelected
											? "border-primary bg-primary text-primary-foreground"
											: "border-muted-foreground/30 text-muted-foreground"
									}`}
								>
									{isSelected ? (
										<div className="size-2 rounded-full bg-current" />
									) : (
										<PlusIcon className={"size-3"} />
									)}
								</div>
							</div>
							<p className="flex-1 text-xs text-muted-foreground line-clamp-2">
								{template.description}
							</p>
							<div className="mt-4 flex items-center gap-1.5">
								<span className="inline-flex items-center rounded-md bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground ring-1 ring-inset ring-foreground/10">
									{template.topic}
								</span>
							</div>
						</button>
					);
				})}
			</div>
		</div>
	);
};
