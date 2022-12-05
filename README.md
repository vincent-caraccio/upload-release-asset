# Upload release asset

This action extracts the version of the latest release and increments it.
Result is stored in a environment variable named RELEASE_VERSION.

## Inputs

## `token`

**Required** The github token to query the list of artifacts.

## `asset_path / asset_name / asset_content_type`

**Optional** Asset information to upload to the release (path should be Unix style). If path is defined, `asset_content_type` will be mandatory.

## Example usage

```
- name: Upload Release Asset
  uses: vincent-caraccio/upload-release-asset@v1.0.1
  with:
    token: ${{ secrets.GITHUB_TOKEN }} # No need to create it
    uploadUrl: ${{ steps.create_release.outputs.upload_url }}
    asset_path: build/libs/${{ github.event.repository.name }}-${{ env.RELEASE_VERSION }}.jar
    asset_name:  ${{ github.event.repository.name }}-${{ env.RELEASE_VERSION }}.jar
    asset_content_type: application/java-archive
```
