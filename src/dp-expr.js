// dpe.js
// (c) tearflake, 2026
// MIT License

"use strict"

var DPExpr = (
    function (obj) {
        return {
            convert: obj.convert
        };
    }
) (
    (function () {

        function convert(str) {
            if (str.indexOf("(") > -1 || str.indexOf(")") > -1)
                throw new Error(`Parenthesis not allowed`);
                
            let acc = [];
            let depth = 0;
            let entry;
            let curr = 0;
            let tlc = 0;
            while (true) {
                [entry, curr] = nextToken(str, curr);
                if (entry == null)
                    break;
                
                if (depth === 0 || entry.depth == 0)
                    tlc++;
                    if (tlc > 1)
                        throw new Error(`Only one top level expression allowed`);
                
                while (depth < entry.depth) {
                    acc.push("(");
                    depth++;
                }
                
                while (depth > entry.depth) {
                    acc.push(")");
                    depth--;
                }
                    
                if (entry.val !== "")
                    acc.push(entry.val);
            }
            
            if (acc.length == 0)
                throw new Error(`Empty expression`);
                        
            while (depth > 0) {
                acc.push(")");
                depth--;
            }

            return acc.join(" ").replaceAll("( ", "(").replaceAll(" )", ")");
        }

        function nextToken(str, start) {
            while (start < str.length && "\n\r\t ".indexOf(str.charAt(start)) > -1)
                start++;
            
            let end = start
            while (end < str.length && "\n\r\t ".indexOf(str.charAt(end)) == -1)
                end++;
            
            if (start == end)
                return [null, end];
            
            let token = str.substring(start, end)
            let depth = 0;
            while (token.charAt(depth) == ".")
                depth++;
            
            return [{depth: depth, val: token.substring(depth, token.length)}, end];
        }
        
        return {
                convert: convert
        }
    }) ()
);

var isNode = new Function ("try {return this===global;}catch(e){return false;}");

if (isNode ()) {
    // begin of Node.js support

    module.exports = DPE;
    
    function escapeRegExp(string) {
      return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
    }

    function replaceAll(str, match, replacement){
       return str.replace(new RegExp(escapeRegExp(match), 'g'), ()=>replacement);
    }

    if(typeof String.prototype.replaceAll === "undefined") {
        String.prototype.replaceAll = function (match, replace) {return replaceAll (this.valueOf (), match, replace);};
    }

    // end of Node.js support
}

