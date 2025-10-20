pipeline {
    agent any

    environment {
        NODE_VERSION = "22.17"
        GIT_SSH_KEY_ID = "GITHUB_SSH_KEY" // ID de la credencial SSH en Jenkins
    }

    stages {
        stage('Checkout') {
            steps {
                checkout([$class: 'GitSCM',
                          branches: [[name: 'main']],
                          userRemoteConfigs: [[
                              url: 'git@github.com:EmilioAMVs/Contador-Clicks-Pipeline-Jenkins.git',
                              credentialsId: env.GIT_SSH_KEY_ID
                          ]]
                ])
            }
        }

        stage('Install dependencies') {
            steps {
                bat 'npm install'
            }
        }

        stage('Run Tests & Lint') {
            steps {
                bat 'npm run lint'
                bat 'npm run test'
                bat 'npm run report'
            }
        }

        stage('Build for Pages') {
            steps {
                bat '''
                if exist deploy rmdir /s /q deploy
                mkdir deploy
                copy index.html deploy\\
                copy style.css deploy\\
                copy report.html deploy\\
                copy logic.js deploy\\
                copy script.js deploy\\
                xcopy /E /I coverage deploy\\coverage
                xcopy /E /I reports deploy\\reports
                '''
            }
        }

        stage('Deploy to GitHub Pages') {
            steps {
                sshagent([env.GIT_SSH_KEY_ID]) {
                    bat '''
                    cd deploy
                    git init
                    git remote add origin git@github.com:EmilioAMVs/Contador-Clicks-Pipeline-Jenkins.git
                    git fetch origin gh-pages || echo Branch no existe
                    git checkout -B gh-pages
                    git config user.name "EmilioAMVs"
                    git config user.email "emiliocabrera321@outlook.com"
                    git add .
                    git commit -m "Deploy from Jenkins"
                    git push -f origin gh-pages
                    '''
                }
            }
        }
    }

    post {
        always {
            bat 'echo Pipeline terminado (always)'
        }
        success {
            bat 'echo Deploy completado con éxito!'
        }
        failure {
            bat 'echo Algo falló en el pipeline'
        }
    }
}
