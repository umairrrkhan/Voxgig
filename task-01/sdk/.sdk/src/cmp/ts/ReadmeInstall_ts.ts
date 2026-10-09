import { cmp, Content, installCommand, isPublished, repoInfo } from '@voxgig/sdkgen'

const ReadmeInstall = cmp(function ReadmeInstall(props: any) {
  const { target, ctx$ } = props
  const { model } = ctx$
  if (isPublished(model, target.name)) {
    Content('```bash\n' + installCommand(model, target.name) + '\n```')
    return
  }
  const { repoUrl, repo } = repoInfo(model)
  const folder = `./${repo}/task-01/sdk/${target.name}`
  Content(`This package is not published to npm. Clone and build the SDK before installing it locally. Requires Node.js 24 or later.

\`\`\`bash
git clone ${repoUrl}
npm ci --prefix ${folder}
npm run build --prefix ${folder}
npm install ${folder}
\`\`\`
`)
})

export { ReadmeInstall }
