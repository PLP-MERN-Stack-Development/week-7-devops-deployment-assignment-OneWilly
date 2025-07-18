const fs = require("fs")
const path = require("path")
const readline = require("readline")

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

async function setupEnvironment() {
  console.log("🚀 MERN App Environment Setup\n")

  // Get deployment platform
  const platform = await askQuestion("Which platform are you deploying to? (render/heroku/railway/vercel): ")

  let apiUrl = ""

  switch (platform.toLowerCase()) {
    case "render":
      const serviceName = await askQuestion("Enter your Render service name: ")
      apiUrl = `https://${serviceName}.onrender.com/api`
      break

    case "heroku":
      const appName = await askQuestion("Enter your Heroku app name: ")
      apiUrl = `https://${appName}.herokuapp.com/api`
      break

    case "railway":
      const railwayName = await askQuestion("Enter your Railway app name: ")
      apiUrl = `https://${railwayName}.up.railway.app/api`
      break

    case "vercel":
      const vercelName = await askQuestion("Enter your Vercel app name: ")
      apiUrl = `https://${vercelName}.vercel.app/api`
      break

    default:
      apiUrl = "http://localhost:5000/api"
  }

  // Create environment files
  const envContent = `# ${platform.toUpperCase()} Environment Variables
REACT_APP_API_BASE_URL=${apiUrl}
GENERATE_SOURCEMAP=false
SKIP_PREFLIGHT_CHECK=true
`

  // Write to .env.production
  fs.writeFileSync(path.join(__dirname, "../client/.env.production"), envContent)

  console.log("\n✅ Environment files created!")
  console.log(`📍 API URL: ${apiUrl}`)
  console.log("📁 File: client/.env.production")

  rl.close()
}

function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer)
    })
  })
}

setupEnvironment().catch(console.error)
