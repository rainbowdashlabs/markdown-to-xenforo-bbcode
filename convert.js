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
    LineEndingCorrector = require('line-ending-corrector').LineEndingCorrector

    let text = readInput();

    if (text == null) {
        console.log("No file found.")
        return;
    }
    if (text.length === 0) {
        console.log("File is empty")
        return;
    }

    let corrected = LineEndingCorrector.correctSync(text);

    text = corrected[1];

    // convert heading
    text = text
        // replace lines after heading
        .replace(/(#.+?)(\n+?)/gm, "$1\n")
        // replace heading
        .replace(/^###\s-?(.+?)\n+/gm, '[HEADING=3]$1[/HEADING]\n')
        .replace(/^##\s+?(.+?)\n+/gm, '[HEADING=2]$1[/HEADING]\n')
        .replace(/^#\s+?(.+?)\n+/gm, '[HEADING=1]$1[/HEADING]\n')

        // convert code blocks
        .replace(/```\s?([a-z]*)(.+?)```/gms, "[code=$1]$2[/code]")

        // convert inline
        .replace(/`(.+?)`/gm, "[ICODE]$1[/ICODE]")

        // remove indicator line
        .replace(/^\|[\s-:|]*?\|\n/gm, "")
        // replace start of table row
        .replace(/^\|/gm, "[TR][TD]")
        // replace end of table row
        .replace(/\|$/gm, "[/TD][/TR]")
        // replace table row separator
        .replace(/\|/gm, "[/TD][TD]")
        // add table at start and end
        .replace(/([^\]])\n\[TR\]/gm, "$1\n[TABLE][TR]")
        .replace(/\[\/TR\]\n([^\[])/gm, "[/TR]\n[/TABLE]\n$1")

        // convert bold
        .replace(/(^|\s)\*\*(.+?)\*\*(\s|$)/gm, "$1[b]$2[/b]$3")
        .replace(/(^|\s)__(.+?)__(\s|$)/gm, "$1[b]$2[/b]$3")

        // convert italic
        .replace(/(^|\s)\*(.+?)\*(\s|$)/gms, "$1[i]$2[/i]$3")
        .replace(/(^|\s)_(.+?)_(\s|$)/gms, "$1[i]$2[/i]$3")

        // convert strike-through
        .replace(/(^|\s)~~(.+?)~~(\s|$)/gms, "$1[s]$2[/s]3")

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
        .replace(/___+?/gm, "[HR][/HR]")

        .replace(/>>>(.+?)\n\n/gm, "[QUOTE]$1[/QUOTE]\n")
        .replace(/>(.+?)\n([^>])/gms, "[QUOTE]$1[/QUOTE]\n$2");

    //console.log(text)

    try {
        fs.writeFileSync('output', text, "utf-8");
    } catch (err) {
        console.log(err)
    }
}

convertFiles()
