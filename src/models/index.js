const fs = require('fs')
const { resolve } = require('path')

const dirPath = resolve(__dirname)

module.exports = {
  getAllModels(sequelize, hooks = {}) {
    const files = fs.readdirSync(dirPath)

    const models = files
      .filter((fileName) => !['index.js', 'BaseModel.js'].includes(fileName))
      .reduce((initialized, modelFileName) => {
        // eslint-disable-next-line global-require,import/no-dynamic-require
        const model = require(`${dirPath}/${modelFileName}`)(sequelize)
        return { ...initialized, [model.name]: model }
      }, {})

    Object.values(models).forEach((m) => {
      if(m.associate) {
        m.associate(models)
      }

      if (hooks[m.name]) {
        Object.entries(hooks[m.name]).forEach(([key, value]) => {
          m.addHook(key, value)
        })
      }
    })

    return models
  },
}
