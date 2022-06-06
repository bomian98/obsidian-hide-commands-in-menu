import { Command, Plugin, MenuItem } from 'obsidian';
import CustomMenuSettingsTab, { CustomMenuSettings, DEFAULT_SETTINGS } from './ui/settingsTab';
import { around } from 'monkey-around';

export default class CustomMenuPlugin extends Plugin {
	settings: CustomMenuSettings;

	async onload() {
		console.log('Loading customizable menu');

		await this.loadSettings();
		this.addSettingTab(new CustomMenuSettingsTab(this.app, this));

		this.settings.menuCommands.forEach(command => {
			this.addMenuItem(command);
		});

		/* moneky-around doesn't know about my this.settings, need to set it here */
		let hideTitles = this.settings.hideTitles

		/* https://github.com/Panossa/mindful-obsidian/blob/master/main.ts */
		this.register(around(MenuItem.prototype, {
			setTitle(old) {
				return function (title: string | DocumentFragment) {
					this.dom.dataset.stylizerTitle = String(title);

					if (hideTitles.includes(String(title))) {
						console.log(title);
						this.dom.addClass('custom-menu-hide-item');
					}

					return old.call(this, title);
				};
			}
		}));

		// this.register(around(MenuItem.prototype, {
		// 	setIcon(old) {
		// 		return function (icon: string | DocumentFragment) {
		// 			this.dom.dataset.stylizerIcon = String(icon);

		// 			if (icon === 'paste') {
		// 				this.dom.addClass('custom-menu-hide-item');
		// 			}

		// 			return old.call(this, icon);
		// 		};
		// 	}
		// }));
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