import Enquirer from 'enquirer'
import chalk from 'chalk'
import faradoo from './faradoo.js'
import fs from 'fs'
import path from 'path'
import handlebars from 'handlebars'
import pdf from 'html-pdf-node'
import helpers from './hbs-helpers.js'
import { glob } from 'glob'

const cvTemplate = fs.readFileSync(path.join(process.cwd(), 'template.html'), 'utf8')

handlebars.registerHelper(helpers)
const template = handlebars.compile(cvTemplate)

const enquirer = new Enquirer()
const emailRegEx = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/

try {
  console.log(
    chalk.blue.bold('Create pretty cv\'s from the terminal with the info from faradoo')
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
  ])

  init(credentials)
} catch (err) {
  console.log(chalk.red('Error while filling in the prompt'))
  process.exit(1)
}

async function init (credentials) {
  await faradoo.login(credentials)
  await faradoo.getEmployees()

  const cvOptions = await askCvOptions()

  const ids = !cvOptions.employees.length
    ? Object.values(faradoo.employees.map(e => e.id))
    : cvOptions.employees

  for (const id of ids) {
    try {
      const data = await faradoo.getEmployeeData(Number(id))
      await createPDF(data)
    } catch (err) {
      console.log(
        chalk.red(`Error while fetching cv data from employee: ${id}`)
      )
    }
  }
}

async function createPDF (data) {
  console.log(
    chalk.blue(`Started creating cv for ${data.name}`)
  )

  if (!data.jobtitle) data.jobtitle = 'Frontend Developer'

  const options = await enquirer.prompt([
    {
      type: 'text',
      name: 'jobtitle',
      message: `Change the job title? leave empty when you want to keep ${data.jobtitle} as job title`
    }
  ])

  if (options.jobtitle) data.jobtitle = options.jobtitle

  if (options.showSkills) {
    data.skills = data.skills.filter(skill => Number(skill.score) >= Number(options.showSkills) - 1)
  }

  if (options.showProjects) {
    data.projects = data.projects.slice(0, options.showProjects)
  }

  const content = template({ ...options, ...data })

  await pdf.generatePdf(
    { content },
    {
      format: 'A4',
      printBackground: true,
      margin: { top: 20, bottom: 20 }
    }
  ).then(file => {
    fs.writeFileSync(`cv-files/${data.name.replaceAll(' ', '_')}.pdf`, file)
  })

  console.log(
    chalk.green(`Created cv for ${data.name} successfully`)
  )
}

async function askCvOptions () {
  const logos = await glob('public/logos/**.**')

  return await enquirer.prompt([
    {
      type: 'select',
      name: 'logo',
      message: 'Pick your logo to display on the cv\'s',
      choices: logos.map(v => v.split('logos/')[1])
    },
    {
      type: 'multiselect',
      name: 'employees',
      message: 'For wich employee do you want to generate a cv (press space to select, when left empty generate for everyone)',
      choices: [
        ...faradoo.employees.map(e => {
          return { name: e.name, value: e.id }
        })
      ],
      result (employees) {
        return Object.values(this.map(employees))
      }
    },
    {
      type: 'select',
      name: 'showSkills',
      message: 'Only show skills when they hava a specific score or higher',
      choices: ['1', '2', '3', '4', '5']
    },
    {
      type: 'numeral',
      name: 'showProjects',
      message: 'Max amount of projects to be shown on the cv, when left empty there\'s no max'
    }
  ])
}
