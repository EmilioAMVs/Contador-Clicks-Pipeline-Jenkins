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
        bat '''
        cd deploy
        git init
        git remote add origin git@github.com:EmilioAMVs/Contador-Clicks-Pipeline-Jenkins.git
        git fetch origin gh-pages || echo Branch no existe
        git checkout -B gh-pages
        git add .
        git commit -m "Deploy from Jenkins"
        git push -f origin gh-pages
        '''
    }
}
