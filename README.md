# asciitable-cli
___

Converts delimited text input to an ASCII table.

### Installation
```bash
> npm install -g asciitable-cli
```

### Basic Usage
```
Usage: asciitable -i <input>

Options:
  --help                  Show help                      [boolean]
  --version               Show version number            [boolean]
  -i, --input             Delimited input                [string] [required]
  -s, --style             Table style                    [string] [choices: "mysql", "unicode", "compact"] [default: "unicode"]
  -c, --column-separator  Column delimiter               [string] [default: "|"]
  -r, --row-separator     Row delimiter                  [string] [default: ">"]
```

### Practical Usage Example

In this example, we're going to list all enabled NGINX sites. This assumes that all site configuration files are named according to the site's domain name. We'll also be pulling relevant information from a JSON deployment manifest file.
```bash
#!/bin/bash

FILES=(/etc/nginx/sites-enabled/*)
LAST_POS=$(( ${#FILES[*]} - 1 ))
LAST=${FILES[$POS]}
TBL_STR="DOMAIN | VERSION | PATH | LAST DEPLOYMENT>"

for FILE in "${FILES[@]}";
do
  DOMAIN=$(basename "$FILE")
  DEPLOY_DIR=$(grep -m1 -Poe 'root \K[^; ]+' $FILE)
  DEPLOY_MANIFEST="${DEPLOY_DIR}/deployment.json"
  DEPLOY_VER="N/A"
  DEPLOY_DATE="N/A"

  if [ -f $DEPLOY_MANIFEST ];
  then
    DEPLOY_VER=$(jq -r ".version" $DEPLOY_MANIFEST)
    DEPLOY_DATE=$(jq -r ".date" $DEPLOY_MANIFEST)
  fi

  TBL_STR+="${DOMAIN} | ${DEPLOY_VER} | ${DEPLOY_DIR} | ${DEPLOY_DATE}"

  if [[ $FILE != $LAST ]];
  then
    TBL_STR+=">"
  fi
done

asciitable -i "${TBL_STR}"
```
**Output**:
```
╔═════════════════════╦═══════════════╦════════════════════════════════════════════════════╦═════════════════════════╗
║       DOMAIN        ║    VERSION    ║                        PATH                        ║     LAST_DEPLOYMENT     ║
╠═════════════════════╬═══════════════╬════════════════════════════════════════════════════╬═════════════════════════╣
║  ilovekitties.org   ║  v1.0.0       ║  /home/deploy/ilovekitties.org/releases/current    ║  Sept 15, 2022 7:01am   ║
║  bugs.com           ║  v1.0.9993    ║  /home/deploy/bugs.com/releases/current            ║  Oct 05, 2019 5:38am    ║
║  default            ║  N/A          ║  /var/www/html                                     ║  N/A                    ║
╚═════════════════════╩═══════════════╩════════════════════════════════════════════════════╩═════════════════════════╝
```
