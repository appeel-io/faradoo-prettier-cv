import axios from 'axios'
import ora from 'ora'

let bearer

const faradoo = {
  employees: null,
  languageOptions: null,
  login: async credentials => {
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
  },
  getEmployees: async () => {
    const spinner = ora('Fetching employees').start()
    try {
      const { data } = await axios({
        url: 'https://appeel.faradoo.com/api/search',
        method: 'POST',
        headers: {
          Authorization: `Bearer ${bearer.token}`
        },
        data: {
          certificates: [],
          skills: []
        }
      })
      faradoo.employees = data.filter(e => e.profile === 'Developer')
      spinner.succeed('Successfully fetched employees')
    } catch (err) {
      console.log(err)
      spinner.fail('Error fethcing employees')
      process.exit(1)
    }
  },
  getLanguageOptions: async () => {
    const { data } = await axios({
      url: 'https://appeel.faradoo.com/api/language',
      method: 'GET',
      headers: {
        Authorization: `Bearer ${bearer.token}`
      }
    })
    faradoo.languageOptions = data
  },
  getEmployeeData: async id => {
    const user = await getInfoByUserId('user', id)
    const projects = await getInfoByUserId('project', id)
    const evaluation = await getInfoByUserId('evaluation', id)
    const educations = await getInfoByUserId('education', id)
    const trainings = await getInfoByUserId('trainingseminar', id)
    const certifications = await getInfoByUserId('certification', id)
    const languages = await getInfoByUserId('language', id)

    if (!faradoo.languageOptions) await faradoo.getLanguageOptions()

    return {
      name: `${user.firstname} ${user.lastname}`,
      jobtitle: user.jobtitle,
      dob: user.dob,
      gender: user.gender,
      nationality: user.nationality,
      about: user.about,
      city: user.city,
      experience: calculateEnlistment(
        user.enlistmentDate,
        user.yearsOfExperience
      ),
      educations: formatEducations(educations),
      skills: formatSkills(evaluation),
      languages: formatLanguages(languages, faradoo.languageOptions),
      projects: formatProjects(projects),
      trainings: formatTrainings(trainings),
      certifications: formatCertifications(certifications)
    }
  }
}

async function getInfoByUserId (type, id) {
  const url = type === 'user'
    ? `https://appeel.faradoo.com/api/user/${id}`
    : `https://appeel.faradoo.com/api/${type}/user/${id}`

  const { data } = await axios({
    url,
    method: 'GET',
    headers: {
      Authorization: `Bearer ${bearer.token}`
    }
  })

  return data
}

function calculateEnlistment (date, prior) {
  if (date.length < 10) return prior
  else {
    const split = date.split('/')
    const old = new Date(split[2], Number(split[1]) - 1, split[0], 12)
    const ageDate = new Date(Date.now() - old)
    return Math.abs(ageDate.getUTCFullYear() - 1970) + prior
  }
}

function formatProjects (projects) {
  const formattedProjects = []

  projects.forEach(pro => {
    formattedProjects.push({
      name: pro.name,
      customer: pro.customer,
      description: pro.description,
      role: pro.role,
      start: `${pro.startMonth}/${pro.startYear}`,
      end: `${pro.endMonth}/${pro.endYear}`,
      technologies: pro.usedSkills.map(skill => skill.name).slice(0, 5)
    })
  })

  return formattedProjects
}

function formatSkills (evaluation) {
  const formattedSkills = []

  evaluation.forEach(eva => {
    formattedSkills.push({
      score:
      eva.score.value,
      name: eva.skill.name
    })
  })

  return formattedSkills
}

function formatLanguages (langs, options) {
  const formattedLangs = []

  langs.forEach(lang => {
    const { language, understanding, speaking, writing } = lang
    const langOption = options.find(option => option.value === language)
    const langName = langOption.name.split(';')[0].toLowerCase()
    const langNames = {
      1: 'mother tongue',
      2: 'very good',
      3: 'good',
      4: 'moderate',
      5: 'notices'
    }

    formattedLangs.push({
      language: langName,
      understanding: langNames[understanding.id],
      speaking: langNames[speaking.id],
      writing: langNames[writing.id]
    })
  })

  return formattedLangs
}

function formatEducations (educations) {
  const formattedEducations = []

  educations.forEach(education => {
    formattedEducations.push({
      institution: education.name,
      course: education.course,
      description: education.description,
      start: education.startYear,
      end: education.endYear
    })
  })

  return formattedEducations
}

function formatTrainings (trainings) {
  const formattedTrainings = []

  trainings.forEach(training => {
    formattedTrainings.push({
      title: training.title,
      location: training.location,
      type: Number(training.type) === 1
        ? 'training'
        : 'seminar',
      start: training.startDate,
      end: training.endDate
    })
  })

  return formattedTrainings
}

function formatCertifications (certifications) {
  const formattedCertifications = []

  certifications.forEach(cert => {
    formattedCertifications.push({
      name: cert.certificate.name,
      date: cert.date,
      category: cert.certificate.certificatecategory.name,
      score: cert.score
    })
  })

  return formattedCertifications
}

export default faradoo
