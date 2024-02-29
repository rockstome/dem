pipeline {
    agent any

    stages {
        stage('Hello') {
            steps {
                echo 'Hello World'
            }
        }
        stage('Build reporter') { 
            steps {
                sh 'npm uninstall -g .\newman-reporter-elastic-1.0.0.tgz' 
            }
        }
    }
}
