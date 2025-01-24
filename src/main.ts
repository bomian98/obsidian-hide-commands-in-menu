import { Plugin, MenuItem } from 'obsidian';
import CustomMenuSettingsTab, { CustomMenuSettings, DEFAULT_SETTINGS } from './ui/settingsTab';
import { around } from 'monkey-around';

export default class CustomMenuPlugin extends Plugin {
	settings: CustomMenuSettings;

	async onload() {
		console.log('Loading customizable menu');

		await this.loadSettings();
		this.addSettingTab(new CustomMenuSettingsTab(this.app, this));

		let hideTitles = this.settings.hideTitles
		// console.log("hideTitles", hideTitles)

		this.register(around(MenuItem.prototype, {
			setTitle(old) {
				return function (title: string | DocumentFragment) {
					this.dom.dataset.stylizerTitle = String(title);
					if (hideTitles.includes(String(title))) {
						this.dom.addClass('custom-menu-hide-item');
					}
					return old.call(this, title);
				};
			}
		}));
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}