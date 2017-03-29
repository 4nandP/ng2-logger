import { Logger } from './logger';
import { Level } from './level';
import { Display } from './display';
import { contain } from './include';
import { Injectable } from '@angular/core';

/**
 * Log Service Options
 */
export class LogServiceOptions {
    /**
     * The levels to which logging is limited
     */
    levels?: Level[];

    /**
     * The modules to which logging is limited
     */
    modules?: string[];

    /**
     * Whether to use production mode (i.e. disable logging to browser console)
     */
    productionMode: boolean = false;
}

/**
 * Injectable angular service that provides logging
 */
@Injectable()
export class LogService {
    private instances = {};

    private fixedWidth = 0;
    private _logOnly = false;
    private levels: Level[] = [];
    private _logModules = false;
    private modules: string[] = [];
    private isDevelopmentMode = true;
    private modeIsSet: boolean = false;

    /**
     * Creates a new logging service instance. Typically this would be used as a singleton
     * @param options Optional options for filtering
     */
    constructor(options?: LogServiceOptions) {
        if (options) {
            if (options.levels) {
                this.onlyLevel(...options.levels);
            }

            if (options.modules) {
                this.onlyModules(...options.modules);
            }

            if (options.productionMode) {
                this.setProductionMode();
            }
        }
    }

    /**
     * Creates a logger instance for the specified module
     * @param name The module name
     * @param level The logging level
     */
    create<TA>(name: string, ...level: Level[]): Logger<TA> {
        let i: Logger<TA>;
        if (this.instances[name] === undefined) {
            i = new Logger<TA>(
                name,
                LogService.getRandomColor(),
                this.levels.length > 0 ? this.display : undefined,
                this.isDevelopmentMode,
                level,
                this.isMutedModule(name),
                this.levels.length > 0 ? this.fixedWidth : undefined
            );
            this.instances[name] = i;
        } else {
            i = this.instances[name];
        }
        return i;
    }

    private onlyLevel(...level: Level[]) {
        if (this._logOnly) {
            console.error('You should use function onlyLevel only once');
            return;
        }
        if (this._logOnly) this._logOnly = true;
        if (level.length === 0) return;
        this.levels = level;
    }

    private onlyModules(...modules: string[]) {
        if (this._logModules) {
            console.error('You should use function onlyModules only once');
            return;
        }
        if (modules.length === 0) return;
        this.modules = modules;
        this.muteAllOtherModules();
    }

    private setProductionMode() {
        if (this.modeIsSet) {
            console.error('Mode is already set');
            return;
        }
        if (console !== undefined && console.clear !== undefined) {
            setTimeout(() => {
                console.clear();
                console.log = () => { };
                console.error = () => { };
                console.warn = () => { };
                console.info = () => { };
            });
        }
        Logger.isProductionMode = true;
        this.isDevelopmentMode = false;
    }

    private static getRandomColor() {
        let letters = '012345'.split('');
        let color = '#';
        color += letters[Math.round(Math.random() * 5)];
        letters = '0123456789ABCDEF'.split('');
        for (let i = 0; i < 5; i++) {
            color += letters[Math.round(Math.random() * 15)];
        }
        if (color === undefined) return this.getRandomColor();
        return color;
    }

    private display(name: string, data: any, incoming: Level, moduleName: string) {
        if (!contain(this.levels, incoming)) return;
        if (incoming === Level.DATA) {
            Display.msg(name, data, name, this.instances[moduleName].color, Level.DATA, this.instances[moduleName].fixedWidth);
        }
        if (incoming === Level.ERROR) {
            Display.msg(name, data, name, this.instances[moduleName].color, Level.ERROR, this.instances[moduleName].fixedWidth);
        }
        if (incoming === Level.INFO) {
            Display.msg(name, data, name, this.instances[moduleName].color, Level.INFO, this.instances[moduleName].fixedWidth);
        }
        if (incoming === Level.WARN) {
            Display.msg(name, data, name, this.instances[moduleName].color, Level.WARN, this.instances[moduleName].fixedWidth);
        }
    }

    private isMutedModule(moduleName: string): boolean {
        if (this.modules.length == 0) return false;
        if (!contain(this.modules, moduleName)) return true;
        return false;
    }

    private muteAllOtherModules() {
        for (var moduleName in this.instances) {
            if (!contain(this.modules, moduleName))
                this.instances[moduleName].mute()
        }
    }
}