import fs from 'fs'
import path from 'path'

const helpers = {
  getBulletColor: (index, score) => {
    return index >= score ? 'bg-white' : 'bg-blue-dark'
  },
  createEmployeeImgUrl: (name) => {
    return name.toLowerCase().replaceAll(' ', '_')
  },
  checkIfEmployeeImgExists: (name) => {
    return fs.existsSync(
      path.join(
        process.cwd(),
        `/public/employees/${name.toLowerCase().replaceAll(' ', '_')}.png`
      )
    )
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
  }
}

export default helpers
