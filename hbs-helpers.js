import { globSync } from 'glob'
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
    return !!globSync(`public/employees/${name.toLowerCase().replaceAll(' ', '_')}.**`).length
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
