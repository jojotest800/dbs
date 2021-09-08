const DBService = require('../src')

test('get connection', async () => {
  jest.setTimeout(900000000)

  const worker = new DBService()

  const connection = await worker.getConnection('no', 'local', {
    hooks: { Book: { afterUpdate: () => { console.log(1231) } } }
  })

  const bookNo = await connection.models.Book.findOne({ where: { id: 100000 } })

  // bookNo.title = 'new title 1'
  // await bookNo.save()

  expect(connection).not.toBeNull()
  expect(bookNo).not.toBeNull()

  await worker.closeConnection('no')
})

test('get connections', async () => {
  jest.setTimeout(900000000)

  const worker = new DBService()

  const connections = await worker.getConnections('local')

  const bookNo = await connections.no.models.Book.findOne({
    where: { id: 100000 },
  })

  const bookSe = await connections.se.models.Book.findOne({
    where: { id: 100000 },
  })

  expect(connections).not.toBeNull()
  expect(bookNo).not.toBeNull()
  expect(bookSe).toBeNull()

  await worker.closeConnection('no')
  await worker.closeConnections()
})
