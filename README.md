# NRJS

## introduction
a cli utility for npm script with support for `multiline command`,`function`, `@build -> npm run build` by patching the `package.json` file, no need to install as devDeps.

## Usage

```
npm i -g nrjs
```

then add a `nr.js` on the same directory with `package.json`

```
module.exports = {
    compile: [
        `tsc -d --outDir lib`,
    ],
    build: [
        `@compile`,        
        async function () {
            console.log('done')
        }
    ]
};
```

1. notice you still have to use `&&` each line to check the exit code `0`.
2. The multiline command is automatically trim to single line by design, if you happen to need multiline bash script, write an object with key `script`
3. use `['@compile:css &','@compile:coffee &', 'wait', 'echo done!!']` for parallel tasks 

```
$ nr # run the picker to choose tasks

? pick a script to run (Use arrow keys)   
❯ compile 
  build 


$ nr build # run the task


# and on wards later...
$ npm run build # this will work as intended, check your package.json
```