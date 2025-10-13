pipeline {
    agent any

    environment {
        NODE_VERSION = "22.17" // asegúrate de usar la versión que tienes
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/EmilioAMVs/Contador-Clicks-Pipeline-Jenkins.git'
            }
        }

        stage('Test SSH') {
            steps {
                bat '''
                set GIT_SSH_COMMAND=ssh -i "C:\\Users\\PC\\JenkinsKey\\.ssh\\contador_clicks_key" -T git@github.com -o IdentitiesOnly=yes -o StrictHostKeyChecking=no
                '''
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
                xcopy /E /I coverage deploy\\coverage
                xcopy /E /I reports deploy\\reports
                '''
            }
        }

        stage('Deploy to GitHub Pages') {
            steps {
                bat """
                set GIT_SSH_COMMAND=ssh -i "C:\\Users\\PC\\JenkinsKey\\.ssh\\contador_clicks_key" -T git@github.com -o IdentitiesOnly=yes -o StrictHostKeyChecking=no
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
                """
            }
        }
    } // fin de stages

    post {
        success {
            bat 'echo Deploy completado'
        }
        failure {
            bat 'echo Algo falló en el pipeline'
        }
    }
}
