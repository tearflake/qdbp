# QDBP Use Instructions

There may be two possible uses of *Symbolverse* regarding its installation: Javascript API access or command line access. In these instructions, we cover both use cases.

## javascript API access

QDBP may expose its functionality through javascript API (Application Programming Interface), both in browser and in Node.js.

To access the API from Node.js, install it by: `npm install git+ssh://github.com/tearflake/qdbp`, and include the following line in your code:

```
const QDBP = require('@tearflake/qdbp');
```

To access the API from browser, clone this repository from GitHub: `git clone https://github.com/tearflake/qdbp`, and include the following line in the body of HTML:

```
<script src="path-to-qdbp-package/qdbp.js"></script>
```

Below, regardless of accessing from Node.js or a browser, use the API as:

```
let strCode = `
(project
    Example-QDBP

    package
        .shapes

        .module
            ..math

            ..fn
                ...square
                ...(lambda (x)
                    (* x x))
)
`
let strSExpr = QDBP.compile (strCode);
```

## command line access

QDBP may function as a standalone executable operating on files. To build the executables from source code, do the following:

1. make sure you have git, Node.js, and npm installed in your system
2. enter OS command prompt
3. install pkg: `sudo npm install -g pkg` on Linux, or `npm install -g pkg` on Windows
4. change to your project directory
5. clone this repository: `git clone https://github.com/tearflake/qdbp`
6. change directory: `cd qdbp`
7. run pkg: `pkg . --out-path bin/`
8. if everything goes well, executables for Linux, Windows, and MacOS will be in `./bin/` directory

Executables run from command prompt, and take two parameters: input and output file. Input file parameter is mandatory, but if we omit the output-file parameter, the output is redirected to the terminal.

