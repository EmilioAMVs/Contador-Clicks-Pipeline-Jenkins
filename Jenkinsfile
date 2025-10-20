pipeline {
    agent any

    environment {
        NODE_VERSION = "22.17"  // Ajusta según tu versión
        SSH_KEY_PATH = "C:\\Users\\PC\\JenkinsKey\\.ssh\\contador_clicks_key"
        REPO_URL = "git@github.com:EmilioAMVs/Contador-Clicks-Pipeline-Jenkins.git"
        DEPLOY_BRANCH = "gh-pages"
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
                    bat 'npm install'
                }
            }
        }

        stage('Lint & Test') {
            steps {
                dir('repo') {
                    bat 'npm run lint'
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
        }
        success {
            bat 'echo Deploy completado correctamente'
        }
        failure {
            bat 'echo Hubo un error en el pipeline'
        }
    }
}
