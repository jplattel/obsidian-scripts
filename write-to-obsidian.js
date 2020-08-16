//
//  Build a list of tasks from Obsidian to Omnifocus
//
//  Will work anywhere you can invoke a JS automation script.
//  with "osascript -l JavaScript"
//
//  v 1.0.2 (full release history at bottom)



var SystemEvents = Application("System Events")
var fileManager = $.NSFileManager.defaultManager
var currentApp = Application.currentApplication()
var extensionsToProcess = ['md'] 
currentApp.includeStandardAdditions = true

getObsidianTasks();

function getObsidianTasks() {
    markdownFiles = getMarkdownFiles('/Users/joostplattel/Dropbox/2Projects/obsidian')
}

function getMarkdownFiles(path) {
    var isDir = Ref()
    if (fileManager.fileExistsAtPathIsDirectory(path, isDir) && isDir[0]) {
        processFolder(path)
    } else {
        processFile(path)
    }
}

function processFolder(folder) {
    // Retrieve a list of any visible items in the folder
    var folderItems = currentApp.listFolder(Path(folder), { invisibles: false })

    // Loop through the visible folder items
    for (var item of folderItems) {
        var itemPath = `${folder}/${item}`
        getMarkdownFiles(itemPath)
    }
    // Add additional folder processing code here
}

// processFile(currentItem)
function processFile(filePath) {
    // console.log(filePath)
    // Try getting the modification date of the file
    try {
        if (filePath.endsWith('md')) {
            fileContent = currentApp.read(filePath).split('\r\n')
            console.log(fileContent[0])
            // console.log(fileContent)
            
            // for (const line in fileContent) {
                // console.log(line)
                // if (line.includes('- [ ]')) {
                    // console.log(line)
                // }
            // }
        }
    } catch (e) {
        console.log(e)
    }
}
//     // NOTE: The variable file is an instance of the Path object
    // var fileString = 
//     var alias = SystemEvents.aliases.byName(fileString)
//     var extension = alias.nameExtension()
//     var fileType = alias.fileType()
//     var typeIdentifier = alias.typeIdentifier()
//     if (extensionsToProcess.includes(extension)) {
//         // Add file processing code here
//     }
// }