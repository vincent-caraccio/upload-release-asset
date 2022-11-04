'use strict';

const core = require('@actions/core');
const github = require('@actions/github');
const fs = require('fs');
const path = require('path');

(async function () {
  try {
    const token = core.getInput('token');
    const uploadUrl = core.getInput('upload_url');
    const octokit = github.getOctokit(token);

    checkInputs();
    await uploadAsset(octokit, uploadUrl);
  } catch (error) {
    core.setFailed(error.message);
  }
})().catch(error => core.setFailed(error.message));

function checkInputs() {
  const safePath = getSafePath();
  if (!fs.existsSync(safePath)) throw new Error('Provided path is invalid (file does not exist)!');
  const asset_content_type = core.getInput('asset_content_type');
  if (!asset_content_type) throw new Error('Asset Content Type is missing!');
}

function getSafePath() {
  const asset_path = core.getInput('asset_path');
  if (!asset_path) return undefined;
  const split = asset_path.split('/');
  const safePath = path.join(process.env.GITHUB_WORKSPACE, ...split);
  return safePath;
}

async function uploadAsset(octokit, uploadUrl) {
  const safePath = getSafePath();
  const name = core.getInput('asset_name') || path.basename(safePath);
  const assetContentType = core.getInput('asset_content_type');

  console.log(`Starting upload of asset ${name}`);

  await octokit.request({
    method: 'POST',
    url: uploadUrl,
    headers: { 'Content-Type': assetContentType },
    name,
    data: fs.readFileSync(safePath)
  });

  console.log(`Successfully uploaded ${name}`);
}
