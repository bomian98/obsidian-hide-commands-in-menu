import { PluginSettingTab, App, Setting, debounce } from "obsidian";
import CustomMenuPlugin from "src/main";


export interface CustomMenuSettings {
    hideTitles: string[];
}

export const DEFAULT_SETTINGS: CustomMenuSettings = {
    hideTitles: [],
}


export default class CustomMenuSettingsTab extends PluginSettingTab {
    plugin: CustomMenuPlugin;

    constructor(app: App, plugin: CustomMenuPlugin) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display(): void {
        let { containerEl } = this;
        containerEl.empty();

        containerEl.createEl('h2', { text: 'Hide commands' });

        new Setting(containerEl)
            .setDesc("Enter the names of the commands as a comma-separated list. Commands are case-sensitive. You will need to restart Obsidian for the changes to take effect.")
            .addTextArea(text => {
                const onChange = async (value: string) => {
                    const list = value.split('\n').map((v) => v.trim());
                    this.plugin.settings.hideTitles = list;
                    await this.plugin.saveSettings();
                };
                text.setPlaceholder(
                    'Enter commands to hide',
                );
                text.setValue(
                    this.plugin.settings.hideTitles.join('\n'),
                ).onChange(debounce(onChange, 500, true));
                text.inputEl.rows = 10;
                text.inputEl.cols = 30;
            });
    }
}



