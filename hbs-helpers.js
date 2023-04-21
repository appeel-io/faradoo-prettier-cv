import { globSync } from 'glob'
import chalk from 'chalk'
import path from 'path'
import fs from 'fs'

const helpers = {
  getBulletColor: (index, score) => {
    return index >= score ? 'bg-white' : 'bg-blue-dark'
  },
  createLogoImgUrl: (name) => {
    const image = fs.readFileSync(path.join(process.cwd(), `public/logos/${name}`))
    return image.toString('base64')
  },
  createEmployeeImgUrl: (name) => {
    const imageName = globSync(`public/employees/${name.toLowerCase().replaceAll(' ', '_')}.**`)[0]
    const image = fs.readFileSync(path.join(process.cwd(), imageName))
    return image.toString('base64')
  },
  checkIfEmployeeImgExists: (name) => {
    const formattedName = name.toLowerCase().replaceAll(' ', '_')
    const exists = !!globSync(`public/employees/${formattedName}.**`).length
    if (!exists) {
      console.log(
        chalk.red(
          `No file found in the public/employees folder with name: ${formattedName}`
        )
      )
    }
    return exists
  },
  times: (n, block) => {
    let accum = ''
    for (let i = 0; i < n; ++i) {
      accum += block.fn(i)
    }
    return accum
  },
  validDate: (date) => {
    return date.includes('null') ? 'NOW' : date
  },
  formatString: (str) => {
    return !str
      ? ''
      : str
        .trim()
        .replace(/[\r\n]/gm, '')
        .replace(/[@!^&\\#,+()$~%'"*<>{}]/g, '')
  }
}

export default helpers
