const directoryList = require('./src/json/directoryList.json'); // load json to list


function createDirectory() {
    const opportunityDirectory = directoryList['opportunity_dir']
    const projectDirectory = directoryList['project_dir']
    const serviceDirectory = directoryList['service_dir']
    const HSEDirectory = directoryList['HSE_dir']

    var directories = {opportunityDirectory, projectDirectory, serviceDirectory, HSEDirectory}

    return directories
}
