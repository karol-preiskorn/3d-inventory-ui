#
# File:        @/src/cddi/version-change.py
# Description:
# Used by:
# Dependency:
#
# Date        By       Comments
# ----------  -------  ------------------------------
# 2023-07-22  C2RLO


const semver = require("semver");
const simpleGit = require("simple-git");

const options = {
  baseDir: process.cwd(),
  binary: "git",
  maxConcurrentProcesses: 6,
};

const git = simpleGit(options);

const json = require("./package.json");

function savePackage() {
  require("fs").writeFileSync(
    process.cwd() + "/package.json",
    JSON.stringify(json, null, 2)
  );
}
async function updateVersion() {
  try {
    if (json.version) {
      const version = semver.parse(json.version);
      version.inc("minor");
      json.version = version.toString();
      savePackage();
      await git.add("package.json");
      process.exit(0);
    }
  } catch (e) {
    console.log(e);
    process.exit(1);
  }
}
