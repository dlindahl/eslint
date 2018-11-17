"use strict";

const chalk = require("chalk"),
      lodash = require("lodash"),
      log = require("./util/logging");

const CONFIG_RULES = {
  0: 'off',
  1: 'warn',
  2: 'error'
};

function reportRuleSet([extension, config, isRoot], index, ruleSets) {
  let status;
  const nextRuleSet = ruleSets[index + 1];
  const prevRuleSet = ruleSets[index - 1];
  if (prevRuleSet) {
    status = chalk.gray.bold('overridden');
  } else if (nextRuleSet && lodash.isEqual(config, nextRuleSet[1])) {
    if(isRoot) {
      status = chalk.red.bold('redundant');
    } else {
      status = chalk.blue.bold('duplicate');
    }
  }
  log.info('');
  log.info('  %s %s', chalk.white(extension), status || '');
  if (Number(config)) {
    const cfgRule = chalk.dim(`(${CONFIG_RULES[config]})`);
    config = `${config} ${cfgRule}`;
  } else if (String(config) !== config) {
    config = JSON.stringify(config, null, 2);
  }
  log.info(
    config
      .split('\n')
      .map(line => `    ${line}`)
      .join('\n')
  );
}

module.exports = function reportRuleUsage(ruleUsage, configFile) {
  Object.entries(ruleUsage).forEach(([rule, ruleSets]) => {
    log.info(chalk.underline(rule));
    ruleSets.map(([extension, config]) => ([
      extension || chalk.bold(configFile),
      config,
      !extension
    ])).forEach(reportRuleSet);
    log.info('');
  });
}
