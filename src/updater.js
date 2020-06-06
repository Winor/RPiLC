'use strict'
const fs = require('fs-extra')
const semver = require('semver')
const request = require('request')
const AdmZip = require('adm-zip')
const packagefile = fs.readFileSync('package.json')
const packagejson = JSON.parse(packagefile)
const dlinfo = {}
const spare = ['node_modules', 'config.json', 'storage.json']
const remove = ['.gitignore', 'README.md', 'app.js', 'client', 'index.js', 'package.json', 'src', '.git']
const exec = require('child_process').exec

module.exports = {
  CheckForUpdates: async function () {
    try {
      const UpdateInfo = await GetUpdateInfo('https://api.github.com/repos/winor/rpilc/releases/latest')
      if (!semver.gte(packagejson.version, UpdateInfo.version)) {
        dlinfo.url = UpdateInfo.dlurl
        dlinfo.filename = 'RPiLC-' + UpdateInfo.version.replace('v', '') + '.zip'
        dlinfo.version = UpdateInfo.version.replace('v', '')
        console.log('new update available ' + UpdateInfo.version)
        dlinfo.update = true
        return {
          update: true,
          version: UpdateInfo.version,
          updateinfo: UpdateInfo.changelog
        }
      } else {
        console.log('You are running the latest version ' + 'v' + packagejson.version)
        return {
          update: false,
          version: UpdateInfo.version,
          updateinfo: UpdateInfo.changelog
        }
      }
    } catch (err) {
      console.log(err)
    }
  },
  update: async function () {
    if (dlinfo.update) {
      try {
        console.log('1')
        await removeonly()
        console.log('2')
        await dl(dlinfo.url, dlinfo.filename)
        console.log('3')
        unzip()
        console.log('4')
        await strip()
        console.log('5')
        await npminstall()
      } catch (err) {
        console.log(err)
      }
    }
  }
}

function call (url) {
  return new Promise((resolve, reject) => {
    request(url, { json: true, headers: { 'User-Agent': 'request' } }, (err, res, body) => {
      if (err) { reject(err) }
      resolve(body)
    })
  })
}

function dl (url, filename) {
  return new Promise((resolve, reject) => {
    request
      .get(url, { headers: { 'User-Agent': 'request' } })
      .on('error', function (err) {
        reject(err)
      })
      .pipe(fs.createWriteStream(filename))
      .on('close', function () {
        resolve('done')
      })
  })
}

async function GetUpdateInfo (url) {
  try {
    const githubinfo = await call(url)
    return {
      version: githubinfo.tag_name,
      dlurl: 'https://github.com/winor/rpilc/archive/' + githubinfo.tag_name + '.zip',
      changelog: githubinfo.body
    }
  } catch (err) {
    console.log(err)
  }
}

function unzip () {
  var zip = new AdmZip(dlinfo.filename)
  zip.extractAllTo('./', true)
}

async function removeall () {
  try {
    const files = await fs.readdir('./')
    for (let i = 0; i < files.length; i++) {
      if (spare.includes(files[i])) {
        console.log('skiped: ' + files[i])
      } else {
        await fs.remove('./' + files[i])
        console.log('removed: ' + files[i])
      }
    }
  } catch (err) {
    console.log(err)
  }
}

async function removeonly () {
  try {
    for (let i = 0; i < remove.length; i++) {
      await fs.remove('./' + remove[i])
      console.log('removed: ' + remove[i])
    }
  } catch (err) {
    console.log(err)
  }
}

async function strip () {
  try {
    await fs.copy('./RPiLC-' + dlinfo.version, './')
    await fs.remove(dlinfo.filename)
    await fs.remove('./RPiLC-' + dlinfo.version)
    console.log('success!')
  } catch (err) {
    console.error(err)
  }
}

function npminstall () {
  return new Promise((resolve, reject) => {
    exec('npm install', (err, stdout) => {
      console.log(stdout)
      resolve(stdout)
    })
  })
}

// call('https://api.github.com/repos/winor/rpilc/releases/latest').then(console.log)
// dl('https://github.com/Winor/RPiLC/archive/v1.3.0-beta.zip','test.zip').then(console.log)
// module.exports.CheckForUpdates().then(result => { module.exports.update();});
