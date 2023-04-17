import axios from 'axios'
import ora from 'ora'

let bearer

const faradoo = {
  login: async (credentials) => {
    const spinner = ora('Logging in to Faradoo').start()
    try {
      const { data } = await axios({
        url: 'https://appeel.faradoo.com/api/login_check',
        method: 'POST',
        data: {
          _password: credentials.password,
          _username: credentials.email
        }
      })
      bearer = data
      spinner.succeed('Successfully logged in to Faradoo')
    } catch (err) {
      spinner.fail('Error while logging into Faradoo')
      process.exit(1)
    }
  }
}

export default faradoo
