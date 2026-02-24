import {AI_DEFAULT_MODEL, AIModels} from "@repo/constants";
import {
	Button,
	ModelSelector,
	ModelSelectorContent,
	ModelSelectorGroup,
	ModelSelectorInput,
	ModelSelectorItem,
	ModelSelectorLogo,
	ModelSelectorLogoGroup,
	ModelSelectorName,
	ModelSelectorTrigger
} from "@repo/ui";
import {CheckIcon} from "lucide-react";
import {memo, useCallback, useState} from "react";
import {models} from "@/features/tutor-chat";

interface IModelItemProps {
	model: (typeof models)[0];
	selectedModel: AIModels;
	onSelect: (id: AIModels) => void;
}

const ModelItem = memo(({ model, selectedModel, onSelect }: IModelItemProps) => {
	const handleSelect = useCallback(() => onSelect(model.id), [onSelect, model.id]);
	return (
		<ModelSelectorItem key={model.id} onSelect={handleSelect} value={model.id}>
			<ModelSelectorLogo provider={model.chefSlug} />
			<ModelSelectorName>{model.name}</ModelSelectorName>
			<ModelSelectorLogoGroup>
				{model.providers.map((provider) => (
					<ModelSelectorLogo key={provider} provider={provider} />
				))}
			</ModelSelectorLogoGroup>
			{selectedModel === model.id ? <CheckIcon className="ml-auto size-4" /> : <div className="ml-auto size-4" />}
		</ModelSelectorItem>
	);
});

interface IModelSelectProps {
	value?: AIModels;
	onChange: (value: AIModels) => void;
}

export const ModelSelect = ({ value, onChange }: IModelSelectProps) => {
	const [open, setOpen] = useState(false);
	const [selected, setSelected] = useState(value || AI_DEFAULT_MODEL);

	const handleSelect = useCallback(
		(id: AIModels) => {
			setSelected(id);
			onChange(id);
			setOpen(false);
		},
		[onChange]
	);

	const selectedModelData = models.find((model) => model.id === selected);
	const chefs = [...new Set(models.map((model) => model.chef))];

	return (
		<ModelSelector open={open} onOpenChange={setOpen}>
			<ModelSelectorTrigger asChild>
				<Button className=" justify-between" variant="ghost">
					{selectedModelData?.chefSlug && <ModelSelectorLogo provider={selectedModelData.chefSlug} />}
					{selectedModelData?.name && <ModelSelectorName>{selectedModelData.name}</ModelSelectorName>}
				</Button>
			</ModelSelectorTrigger>
			<ModelSelectorContent>
				<ModelSelectorInput placeholder={"Search models..."} />
				{chefs.map((chef) => (
					<ModelSelectorGroup heading={chef} key={chef}>
						{models
							.filter((model) => model.chef === chef)
							.map((model) => (
								<ModelItem key={model.id} model={model} selectedModel={selected} onSelect={handleSelect} />
							))}
					</ModelSelectorGroup>
				))}
			</ModelSelectorContent>
		</ModelSelector>
	);
};
