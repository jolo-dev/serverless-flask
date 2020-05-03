// Check to see if the user has Docker installed and which version of Python they prefer.

'use strict'
var inquirer = require('inquirer')
var chalk = require('chalk')
var YAML = require('js-yaml')
var fs = require('fs')

var AWS = require('aws-sdk')

var ec2 = new AWS.EC2({ region: 'eu-central-1' })

console.log(chalk.yellow('Hi, a few quick questions before we start:'))

const questions = (defaultRegion, regions) => {
  return [
    {
      type: 'input',
      name: 'service',
      message: 'Your Service Name',
      default: 'serverless-flask'
    },
    {
      type: 'list',
      name: 'python',
      message: 'What Python version?',
      choices: ['python3.8', 'python3.7', 'python3.6', 'python2.7'],
      default: 'python3.8',
      filter: function (val) {
        return val.toLowerCase()
      }
    },
    {
      type: 'list',
      name: 'region',
      message: 'In what Region do you want to deploy?',
      choices: regions,
      default: defaultRegion,
      filter: function (val) {
        return val.toLowerCase()
      }
    },
    {
      type: 'confirm',
      name: 'docker',
      message: 'Do you have Docker installed? Recommended, but not required.',
      default: false
    },
    {
      type: 'confirm',
      name: 'wantsDomain',
      message:
        'Do you want to set up a custom domain? e.g. api.mycompany.com? Requires a domain in Route53.',
      default: false
    },
    {
      type: 'input',
      name: 'domainName',
      message: 'What is your domain name? e.g. api.mycompany.com',
      when: function (answers) {
        return answers.wantsDomain
      }
    }
  ]
}

const ask = () => {
  const letsAsk = async () => {
    const defaultRegion =
      AWS.config.region === undefined ? '' : AWS.config.region
    const regions = (await ec2.describeRegions({}).promise()).Regions.map(
      (r) => {
        return r.RegionName
      }
    )
    const answers = await inquirer.prompt(questions(defaultRegion, regions))
    var doc = YAML.safeLoad(fs.readFileSync('serverless.yml', 'utf8'))
    doc.service = answers.service
    doc.custom.pythonRequirements.dockerizePip = answers.docker
    doc.provider.runtime = answers.python
    doc.provider.region = answers.region
    if (answers.wantsDomain) {
      doc.plugins.push('serverless-domain-manager')
      doc.custom.customDomain = createCustomDomain(answers.domainName)
    }
    saveServerlessYml(doc)
    console.log(
      chalk.yellow('All set! Run `sls deploy` to send your code to the cloud')
    )
    if (answers.wantsDomain) {
      console.log(
        chalk.yellow('Run `sls create_domain` to set up your custom domain.')
      )
    }
  }
  letsAsk()
}

ask()

const createCustomDomain = (domainName) => {
  return {
    domainName,
    basePath: '',
    stage: '${self:provider.stage}',
    createRoute53Record: true
  }
}

const saveServerlessYml = (config) => {
  /*
  When dumping to yml, it puts quotation marks around Serverless variables. This
  breaks variable resolution, so I clean it out after dumping to yml but before
  writing to the config file.
  */
  const dumped = YAML.dump(config)
  const cleaned = dumped.replace(
    "'${self:provider.stage}'",
    '${self:provider.stage}'
  )
  fs.writeFileSync('serverless.yml', cleaned)
}
