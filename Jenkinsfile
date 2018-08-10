pipeline {
    agent {
        label 'linux'
    }
    
    environment {
        CI = 'true'
    }
    
    stages {
        stage('Install') {              
            tools {
                nodejs "NodeJS-8.11.3"
            }
            steps {
                dir('VengabusFrontend') {
                    sh 'npm install'
                }
            }
        }
        stage('Frontend test') {            
            tools {
                nodejs "NodeJS-8.11.3"
            }
            steps {
                dir('VengabusFrontend') {
                    sh 'npm run test'
                }
            }
        }
    }
    
    post {
        fixed {
            notifySlack(":green_heart: Build fixed")
        }
        failure {
            notifySlack(":red_circle: Build failed")
        }
        unstable {
            notifySlack(":large_orange_diamond: Build unstable")
        }
}


def notifySlack(message) {
    withCredentials([string(credentialsId: 'slack-token', variable: 'SLACKTOKEN')]) {
        slackSend teamDomain: "softwire",
            channel: "#team-vengabus",
            token: "$SLACKTOKEN",
            message: "*${message}* - ${env.JOB_NAME} ${env.BUILD_NUMBER} (<${env.BUILD_URL}|Open>)"
    }
}