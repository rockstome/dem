pipeline {
    agent any

    stages {
        stage('Build reporter') { 
            steps {
                dir('newman-reporter-elastic') {
                    bat 'npm uninstall -g newman-reporter-es-1.0.0.tgz' 
                    bat 'npm pack'
                    bat 'npm install -g newman-reporter-es-1.0.0.tgz'
                }
            }
        }
        stage('Install newman') {
            steps {
                bat 'npm install -g newman'
            }
        }
        stage('Run collections') {
            steps {
                dir('collections') {
                    bat 'C:\\Users\\tomas\\AppData\\Roaming\\npm\\newman run collection1.json -r newman-reporter-es -x'
                }
            }
        }
    }
}
