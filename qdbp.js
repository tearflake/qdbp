// qdbp.js
// (c) tearflake, 2026
// MIT License

"use strict";

var isNode = new Function ("try {return this===global;}catch(e){return false;}");

if (isNode ()) {
    // begin of Node.js support
    
    var path = require('path');
    var QDBP = require ("./src/qdbp.js");
    var SExpr = require ("./src/s-expr.js");
    
    var Files = {
        open: function (fileName) {
            const fs = require('fs');
            try { 
                return fs.readFileSync (fileName); 
                
            } catch (error) { 
                return false;
            } 
        },
        
        save: function (fileName, contents) {
            const fs = require('fs');
            try { 
                fs.writeFileSync (fileName, contents); 
                return true;
                
            } catch (error) { 
                return false;
            } 
        },
    };

    function exitSucc () {
        console.log ("Success.");
        process.exit (0);
    }

    function exitFail () {
        console.log ("Failure.");
        process.exit (1);
    }

    async function main(fInput, fOutput) {
        "use strict";
        
        if (fOutput !== undefined) console.log ("QDBP v" + require('./package.json').version);
        if (fOutput !== undefined) console.log ("");
        try {
            if (fOutput !== undefined) console.log ('Reading: ' + fInput);
            var fr = Files.open (fInput);
            if (fr === false) {
                console.log ('Error reading input file');
                exitFail ();
            }
            else {
                var fi = fr.toString ();
                var fo = QDBP.compile (fi);
                var prettyo = SExpr.stringify (SExpr.parse (fo))
                if (fo !== undefined) {
                    if (fOutput === undefined) {
                        console.log (prettyo);
                        process.exit (0);
                    }
                    else {
                        console.log ('Writing: ' + fOutput);
                        if (!Files.save (fOutput, prettyo)) {
                            console.log ('Error writing output file');
                            exitFail ();
                        }
                        else {
                            exitSucc ();
                        }
                    }
                }
                else {
                    exitFail ();
                }
            }
        }
        catch(e) {
            console.log("");
            console.log(e.name + ":\n" + e.message);
            console.log("");
            exitFail ();
        }
    }
    
    function escapeRegExp(string) {
      return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
    }

    function replaceAll(str, match, replacement){
       return str.replace(new RegExp(escapeRegExp(match), 'g'), ()=>replacement);
    }

    if(typeof String.prototype.replaceAll === "undefined") {
        String.prototype.replaceAll = function (match, replace) {return replaceAll (this.valueOf (), match, replace);};
    }

    if (require.main === module) {
        // called directly
        
        var args = process.argv.slice(2);
        if (args.length < 1) {
            console.log ("QDBP v" + require('./package.json').version);
            console.log ("");
            console.log ("Usage: qdbp <input-file> <output-file>");
            console.log ("");
        }
        else if (args.length === 1) {
            main (args[0], undefined);
        }
        else if (args.length === 2) {
            main (args[0], args[1]);
        }
    }
    else {
        // required as a module
        
        module.exports = QDBP;

    }
    
    // end of Node.js support
}
else {
    // begin of browser support

    (() => {
        var fullfn = document.currentScript.src;
        var path = fullfn.substring(0, fullfn.lastIndexOf('/')) + "/src/";
        
        var script = document.createElement('script')
        script.src = path + "qdbp.js"
        document.body.appendChild(script);
        
        var script = document.createElement('script')
        script.src = path + "s-expr.js"
        document.body.appendChild(script);
    })()        

    // end of browser support
}

