import { Command, Plugin } from 'obsidian';
import CustomMenuSettingsTab, { CustomMenuSettings, DEFAULT_SETTINGS } from './ui/settingsTab';

export default class CustomMenuPlugin extends Plugin {
	settings: CustomMenuSettings;

	async onload() {
		console.log('Loading customizable menu');

		await this.loadSettings();
		this.addSettingTab(new CustomMenuSettingsTab(this.app, this));


		this.settings.menuCommands.forEach(command => {
			this.addMenuItem(command);
		});
	}

	//add command to right-click menu
	addMenuItem(command: Command) {
		this.registerEvent(
			this.app.workspace.on("editor-menu", (menu) => {
				menu.addItem((item) => {
					item.setTitle(command.name)
					.setIcon(command.icon)
					.onClick(() => {
						//@ts-ignore
						this.app.commands.executeCommandById(command.id);
					});
				});
			})
		);
	}

	hideMenuItem() {
		
	}

	//add command to the list of commands to be added to right-click menu (persistent, saved in settings)
	async addMenuItemSetting(command: Command, settingTab: CustomMenuSettingsTab) {
		this.addMenuItem(command);
		this.settings.menuCommands.push(command);
		await this.saveSettings();

		settingTab.display(); //refresh settings tab
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}