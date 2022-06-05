import { FuzzySuggestModal, Command, FuzzyMatch, setIcon } from "obsidian";
import CustomMenuPlugin from "src/main";
import CommandSuggester from "./commandSuggester";
import CustomMenuSettingsTab from "./settingsTab";
import { ICON_LIST } from "./iconList";

export default class IconPicker extends FuzzySuggestModal<string>{
	plugin: CustomMenuPlugin;
	settingTab: CustomMenuSettingsTab;
	command: Command;
	editMode: boolean;

	constructor(suggester: CommandSuggester, command: Command, editMode = false) {
		super(suggester.plugin.app);
		this.plugin = suggester.plugin;
		this.settingTab = suggester.settingTab;
		this.command = command;
		this.editMode = editMode;

		this.setPlaceholder("Pick an icon");
	}

	private cap(string: string): string {
		const words = string.split(" ");

		return words.map((word) => {
			return word[0].toUpperCase() + word.substring(1);
		}).join(" ");
	}

	getItems(): string[] {
		return ICON_LIST;
	}

	getItemText(item: string): string {
		return this.cap(item.replace(/-/ig, " "));
	}

	renderSuggestion(item: FuzzyMatch<string>, el: HTMLElement): void {
		el.addClass("custom-menu-icon-container");
		const div = createDiv({ cls: "custom-menu-icon" });
		el.appendChild(div);
		setIcon(div, item.item);
		super.renderSuggestion(item, el);
	}

	async onChooseItem(item: string): Promise<void> {
		if (this.editMode === false) {
			const command = {name: this.command.name, id: this.command.id, icon: item}
			await this.plugin.addMenuItemSetting(command, this.settingTab);
		} else {
			this.command.icon = item;
			await this.plugin.saveSettings();
			this.settingTab.display();
		}
	}
}
