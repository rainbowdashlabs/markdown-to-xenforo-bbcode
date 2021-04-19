const fs = require('fs')
const path = require('path')

function readInput() {
    let inputPath = path.join(__dirname, "input");
    console.log(inputPath)
    try {
        return fs.readFileSync(inputPath, `utf-8`,)
    } catch (err) {
        console.error(err);
        return null
    }
}

function convertFiles() {
    let text = readInput();

    if (text == null) {
        console.log("No file found.")
        return;
    }
    if (text.length === 0) {
        console.log("File is empty")
        return;
    }

    // convert heading
    text = text.replace(/^###\s-?(.+?)$/gm, '[HEADING=3]$1[/HEADING]')
        .replace(/^##\s+?(.+?)$/gm, '[HEADING=2]$1[/HEADING]')
        .replace(/^#\s+?(.+?)$/gm, '[HEADING=1]$1[/HEADING]')

        // convert code blocks
        .replace(/```\s?([a-z]*)(.+?)```/gms, "[code=$1]$2[/code]")

        // convert inline
        .replace(/`(.+?)`/gm, "[ICODE]$1[/ICODE]")

        // Convert tables. This is clusterfuck and only works on windows
        // sorry linux users
        // remove indicator line
        .replace(/^\|[\s-:|]*?\|\r\n/gm, "")
        // replace start of table row
        .replace(/^\|/gm, "[TR][TD]")
        // replace end of table row
        .replace(/\|$/gm, "[/TD][/TR]")
        // replace table row separator
        .replace(/\|/gm, "[/TD][TD]")
        // add table at start and end
        .replace(/([^\]])\r\n\[TR\]/gm, "$1\n[TABLE][TR]")
        .replace(/\[\/TR\]\r\n([^\[])/gm, "[/TR]\n[/TABLE]\n$1")

        // convert bold
        .replace(/\*\*(.+?)\*\*/gm, "[b]$1[/b]")
        .replace(/__(.+?)__/gm, "[b]$1[/b]")

        // convert italic
        .replace(/\*(.+?)\*/gms, "[i]$1[/i]")
        .replace(/_(.+?)_/gms, "[i]$1[/i]")

        // convert strike-through
        .replace(/~~(.+?)~~/gms, "[s]$1[/s]")

        // replace dangling escapes
        .replace(/\\/gm, "")

        // replace inline code
        .replace(/`(\|)(\|)$[^|]`/gm, "[ICODE=]$1[/ICODE]")

        // convert images
        .replace(/!\[.+?\]\[(.+?)\]/gm, "[IMG]$1[/IMG]")
        .replace(/\[(.+?)\]\((.+?)\s.+?\)/gm, "[IMG]$1[/IMG]")

        // convert url
        .replace(/\[(.+?)\]\((.+?)\)/gm, "[URL='$2']$1[/URL]")

        // convert rule
        .replace(/---+?/gm, "[HR][/HR]")
        .replace(/\*\*\*+?/gm, "[HR][/HR]")
        .replace(/___+?/gm, "[HR][/HR]");

    console.log(text)

    try {
        fs.writeFileSync('output', text, "utf-8");
    } catch (err) {
        console.log(err)
    }
}

convertFiles()
