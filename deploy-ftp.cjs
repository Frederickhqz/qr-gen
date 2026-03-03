const ftp = require('ftp')
const fs = require('fs')
const path = require('path')

const config = {
  host: '86.38.202.68',
  user: 'u811644574.qrgen.studio',
  password: '+Ed2ajqV[tEPLoEX'
}

const localDir = './dist'
const remoteDir = '/public_html'

const client = new ftp()

function uploadDir(localPath, remotePath) {
  return new Promise((resolve, reject) => {
    fs.readdir(localPath, (err, files) => {
      if (err) return reject(err)
      
      let pending = files.length
      if (pending === 0) return resolve()
      
      files.forEach(file => {
        const localFile = path.join(localPath, file)
        const remoteFile = path.posix.join(remotePath, file)
        
        fs.stat(localFile, (err, stats) => {
          if (err) return reject(err)
          
          if (stats.isDirectory()) {
            console.log(`Creating directory: ${remoteFile}`)
            client.mkdir(remoteFile, true, err => {
              if (err && err.code !== 550) {
                console.log(`Directory exists or error: ${err.message}`)
              }
              uploadDir(localFile, remoteFile)
                .then(() => {
                  pending--
                  if (pending === 0) resolve()
                })
                .catch(reject)
            })
          } else {
            console.log(`Uploading: ${localFile} -> ${remoteFile}`)
            client.put(localFile, remoteFile, err => {
              if (err) {
                console.error(`Error uploading ${file}: ${err.message}`)
              } else {
                console.log(`✓ Uploaded: ${file}`)
              }
              pending--
              if (pending === 0) resolve()
            })
          }
        })
      })
    })
  })
}

client.on('ready', async () => {
  console.log('Connected to FTP server')
  
  try {
    // Ensure remote directory exists
    client.mkdir(remoteDir, true, async err => {
      if (err && err.code !== 550) {
        console.log('Directory check:', err.message)
      }
      
      // Ensure assets directory exists
      client.mkdir(`${remoteDir}/assets`, true, async err => {
        if (err && err.code !== 550) {
          console.log('Assets directory check:', err.message)
        }
        
        try {
          await uploadDir(localDir, remoteDir)
          console.log('\n✅ Deployment complete!')
        } catch (e) {
          console.error('Upload error:', e)
        }
        
        client.end()
      })
    })
  } catch (e) {
    console.error('Error:', e)
    client.end()
  }
})

client.on('error', err => {
  console.error('FTP Error:', err.message)
})

console.log('Connecting to FTP server...')
client.connect(config)