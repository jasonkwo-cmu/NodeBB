"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const winston = require("winston");
const path = require("path");
const nconf = require("nconf");
const { install } = require("../../install/web");
function setup(initConfig) {
    return __awaiter(this, void 0, void 0, function* () {
        const { paths } = require("../constants");
        const install = require("../install");
        const build = require("../meta/build");
        const prestart = require("../prestart");
        const pkg = require("../../package.json");
        winston.info("NodeBB Setup Triggered via Command Line");
        console.log(`\nWelcome to NodeBB v${pkg.version}!`);
        console.log("\nThis looks like a new installation, so you'll have to answer a few questions about your environment before we can proceed.");
        console.log("Press enter to accept the default setting (shown in brackets).");
        install.values = initConfig;
        const data = yield install.setup();
        let configFile = paths.config;
        if (nconf.get("config")) {
            configFile = path.resolve(paths.baseDir, nconf.get("config"));
        }
        prestart.loadConfig(configFile);
        if (!nconf.get("skip-build")) {
            yield build.buildAll();
        }
        let separator = "     ";
        if (process.stdout.columns > 10) {
            for (let x = 0, cols = process.stdout.columns - 10; x < cols; x += 1) {
                separator += "=";
            }
        }
        console.log(`\n${separator}\n`);
        if (data.hasOwnProperty("password")) {
            console.log("An administrative user was automatically created for you:");
            console.log(`    Username: ${data.username}`);
            console.log(`    Password: ${data.password}`);
            console.log("");
        }
        console.log('NodeBB Setup Completed. Run "./nodebb start" to manually start your NodeBB server.');
        // If I am a child process, notify the parent of the returned data before exiting (useful for notifying
        // hosts of auto-generated username/password during headless setups)
        if (process.send) {
            process.send(data);
        }
        process.exit();
    });
}
exports.setup = setup;
exports.webInstall = install;
