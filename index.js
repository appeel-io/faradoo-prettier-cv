import Enquirer from 'enquirer'
import chalk from 'chalk'
import faradoo from './faradoo.js'

const enquirer = new Enquirer()

const emailRegEx = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/

try {
  console.log(
    chalk.blueBright.bold(
      'Create pretty cv\'s from the terminal with the info from faradoo',
      chalk.underline('anything')
    )
  )
  console.log('')

  const credentials = await enquirer.prompt([
    {
      type: 'input',
      name: 'email',
      message: 'Enter your email address that is linked to Faradoo',
      validate: (input) => emailRegEx.test(input)
    },
    {
      type: 'password',
      name: 'password',
      message: 'Password for Faradoo'
    }
    // {
    //   type: 'multiselect',
    //   name: 'updates',
    //   message: 'Pick your data to update. (space to select)',
    //   choices: [
    //     { name: 'All' },
    //     { name: 'Profile' },
    //     { name: 'Address' },
    //     { name: 'Skills' },
    //     { name: 'Projects' },
    //     { name: 'Languages' },
    //     { name: 'Education' },
    //     { name: 'Trainings / Seminars' },
    //     { name: 'Certificates' },
    //   ]
    // }
  ])

  init(credentials)
} catch (err) {
  console.log(chalk.red('Error while filling in the prompt'))
  process.exit(1)
}

async function init (credentials) {
  await faradoo.login(credentials)

  console.log('')
  console.log(chalk.blueBright.bold('Generated all cv\'s'))
}
