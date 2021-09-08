const Sequelize = require('sequelize')
const { SSM } = require('aws-ssm')

const { getAllModels } = require('./models')

const getFromSSM = async (country, environment) => {
  const ssm = new SSM({
    region: process.env.AWS_REGION,
  })

  process.env.AWS_STAGE = environment

  const { [`db_credentials_${country}`]: credentials } = await ssm.modules([
    `db_credentials_${country}`,
  ])
  return credentials
}

class DBService {
  constructor() {
    this.countries = ['se', 'no']

    this.dbs = { Sequelize }

    this.closeConnection = this.closeConnection.bind(this)
  }

  static async connect(country, options) {
    const { port, host, readHost, name, username, password, hooks } = options

    const config = {
      port,
      host,
      dialect: 'postgres',
      logging: false,
    }

    if (readHost) {
      config.replication = {
        read: [{ host: readHost, username, password }],
        write: { host, username, password },
      }

      return new Sequelize(name, null, null, config)
    }

    const sequelize = new Sequelize(name, username, password, config)

    getAllModels(sequelize, hooks)

    await sequelize.authenticate()

    return sequelize
  }

  async getConnection(country, environment, opt) {
    if (!this.dbs[country]) {
      const options = await getFromSSM(country, environment)
      this.dbs[country] = await DBService.connect(country, { ...options, ...opt })
    }

    return this.dbs[country]
  }

  getConnections(environment, opt) {
    return this.countries.reduce(
      (promise, c) =>
        promise.then((connections) =>
          this.getConnection(c, environment, opt).then((connection) => ({
            ...connections,
            [c]: connection,
          }))
        ),
      Promise.resolve({})
    )
  }

  closeConnections() {
    return Promise.all(this.countries.map(this.closeConnection))
  }

  closeConnection(country) {
    if (!this.dbs[country]) {
      console.info(`PostgreSQL connection for ${country} was not opened.`)
      return 0
    }

    console.log(`Closing of ${country} connection.`)

    return this.dbs[country]
      .close()
      .then(() => {
        console.info(`PostgreSQL connection for ${country} has been closed.`)
        this.dbs[country] = null
        return 0
      })
      .catch((err) => {
        console.info(
          `There is error during closing of the ${country} connection.`
        )
        console.log('error:', err)
        console.log('error message:', err.message)
        return err.code || 1
      })
  }
}

module.exports = DBService
