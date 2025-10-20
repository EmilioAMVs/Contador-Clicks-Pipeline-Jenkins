pipeline {
    agent any

    environment {
        NODE_VERSION = "22.17"  // Ajusta según tu versión
        SSH_KEY_PATH = "C:\\Users\\PC\\JenkinsKey\\.ssh\\contador_clicks_key"
        REPO_URL = "git@github.com:EmilioAMVs/Contador-Clicks-Pipeline-Jenkins.git"
        DEPLOY_BRANCH = "gh-pages"
        POWER_AUTOMATE_URL = "https://default585a4d92db1d4bbbb5acc5299e3894.e3.environment.api.powerplatform.com:443/powerautomate/automations/direct/workflows/6f7c6fd284914f01b857dd1b363302fc/triggers/manual/paths/invoke?api-version=1&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=0nW7l_BuvhrNdr_M-9upE2LqKnuMucpsH8c20YnwqhI"
    }

    stages {
        stage('Checkout') {
            steps {
                bat '''
                set GIT_SSH_COMMAND=ssh -i "%SSH_KEY_PATH%" -o IdentitiesOnly=yes -o StrictHostKeyChecking=no
                if exist repo rmdir /s /q repo
                mkdir repo
                cd repo
                git init
                git remote add origin %REPO_URL%
                git fetch origin main
                git checkout -B main origin/main
                '''
            }
        }

        stage('Install dependencies') {
            steps {
                dir('repo') {
                    cache(maxCacheSize: 1, key: "npm-${NODE_VERSION}", paths: ['node_modules', '.npm']) {
                        bat 'npm install'
                    }
                }
            }
        }

        stage('Lint & Test') {
            steps {
                dir('repo') {
                    bat 'npm run test'
                    bat 'npm run report'
                }
            }
        }

        stage('Build for Pages') {
            steps {
                dir('repo') {
                    bat '''
                    if exist deploy rmdir /s /q deploy
                    mkdir deploy
                    copy index.html deploy\\
                    copy style.css deploy\\
                    copy report.html deploy\\
                    copy script.js deploy\\
                    xcopy /E /I coverage deploy\\coverage
                    xcopy /E /I reports deploy\\reports
                    '''
                }
            }
        }

        stage('Deploy to GitHub Pages') {
            steps {
                dir('repo/deploy') {
                    bat '''
                    set GIT_SSH_COMMAND=ssh -i "%SSH_KEY_PATH%" -o IdentitiesOnly=yes -o StrictHostKeyChecking=no
                    git init
                    git remote add origin %REPO_URL%
                    git fetch origin %DEPLOY_BRANCH% || echo Branch no existe
                    git checkout -B %DEPLOY_BRANCH%
                    git config user.name "EmilioAMVs"
                    git config user.email "emiliocabrera321@outlook.com"
                    git add .
                    git commit -m "Deploy from Jenkins"
                    git push -f origin %DEPLOY_BRANCH%
                    '''
                }
            }
        }
    }

    post {
        always {
            bat 'echo Pipeline finalizado'

            // --- Enviar notificación a Power Automate ---
            script {
                def summaryText = readFile('repo/reports/summary.txt')
                def payload = [
                    pipelineName: env.JOB_NAME,
                    status: currentBuild.currentResult,
                    summary: summaryText
                ]
                
                // Llamada HTTP POST
                httpRequest(
                    url: env.POWER_AUTOMATE_URL,
                    httpMode: 'POST',
                    contentType: 'APPLICATION_JSON',
                    acceptType: 'APPLICATION_JSON',
                    requestBody: groovy.json.JsonOutput.toJson(payload)
                )
            }
        }
        success {
            bat 'echo Deploy completado correctamente'
        }
        failure {
            bat 'echo Hubo un error en el pipeline'
        }
    }
}
