const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
const argv = yargs(hideBin(process.argv))
  .option({
    i: {
      alias: 'input',
      default: 'index.js',
      describe: 'input .js filename to bundle',
      type: 'string',
      nargs: 1,
      demandOption: false
    },
    o: {
      alias: 'output',
      default: 'bundle.js',
      describe: 'output .js bundled filename',
      type: 'string',
      nargs: 1,
      demandOption: false
    },
    m: {
      alias: 'mode',
      describe: 'production or development',
      type: 'string',
      nargs: 1,
      demandOption: false
    }
  })
  .version('v')
  .alias('v', 'version')
  .help('h')
  .alias('h', 'help')
  .usage('Usage: $0 [options]')
  .example('• node $0 -i myScript.js -o bundle.js', 'bundle myScript.js and stores the resulting bundle.js file in the same directory as myScript.js')
  .example('• npm run $0 -- -i myScript.js -o bundle.js', 'bundle myScript.js and stores the resulting bundle.js file in the same directory as myScript.js')
  .epilog('Angelytics copyright since 2023')
  .argv;

argv.i && require('../utils/bundle')({ 
  input: argv.i,
  output: argv.o,
  mode: argv.m
});