import { Plugin, MenuItem, Menu } from 'obsidian';
import HidingCommandSettingsTab, { DEFAULT_SETTINGS } from './ui/settingsTab';
import { around } from 'monkey-around';
import { hideMenuItems } from './utils';
import { HideCommands, HidingCommandSettings, MouseEvent } from './types';

export default class HidingCommandPlugin extends Plugin {
  settings: HidingCommandSettings;

  async onload() {
    console.log('Loading Hide Commands in Menu');

    await this.loadSettings();
    this.addSettingTab(new HidingCommandSettingsTab(this.app, this));

    const menuHideCommands: Record<string, HideCommands> = {
      'file-menu-tab-header': this.settings.fileMenu.tabHeader,
      'file-menu-more-options': this.settings.fileMenu.moreOptions,
      'file-menu-file-explorer-context-menu':
        this.settings.fileMenu.fileExplorerContext,
      'file-menu-link-context-menu': this.settings.fileMenu.linkContext,
      'files-menu-file-explorer-context-menu':
        this.settings.filesMenu.fileExplorerContext,
      'editor-menu': this.settings.editorMenu,
      'url-menu': this.settings.urlMenu,
      'other-menu': this.settings.otherMenu,
    };

    const delayTime = this.settings.delayTime ? this.settings.delayTime : 1;

    const clickEvents: MouseEvent[] = [
      'auxclick',
      'contextmenu',
      'click',
      'dblclick',
    ];
    for (const event of clickEvents) {
      this.registerDomEvent(document.body, event, (ev) => {
        setTimeout(() => hideMenuItems(menuHideCommands, ev), delayTime);
      });
    }

    this.registerEvent(
      this.app.workspace.on('file-menu', (menu, file, source) => {
        // console.log('file-menu', source);
        (menu as any).dom.addClass(`file-menu-${source}`);
      })
    );

    this.registerEvent(
      this.app.workspace.on('files-menu', (menu, files, source) => {
        // console.log('files-menu', source);
        (menu as any).dom.addClass(`files-menu-${source}`);
      })
    );

    this.registerEvent(
      this.app.workspace.on('editor-menu', (menu) => {
        // console.log('editor-menu');
        (menu as any).dom.addClass('editor-menu');
      })
    );

    this.registerEvent(
      this.app.workspace.on('url-menu', (menu) => {
        // console.log('url-menu');
        (menu as any).dom.addClass('url-menu');
      })
    );
  }

  async loadSettings() {
    this.settings = { ...DEFAULT_SETTINGS, ...(await this.loadData()) };
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }
}
