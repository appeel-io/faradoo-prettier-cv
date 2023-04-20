import { globSync } from 'glob'

const helpers = {
  getBulletColor: (index, score) => {
    return index >= score ? 'bg-white' : 'bg-blue-dark'
  },
  createEmployeeImgUrl: (name) => {
    const image = globSync(`public/employees/${name.toLowerCase().replaceAll(' ', '_')}.**`)[0]
    return image.replace('public/', '')
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
  }
}

export default helpers
