@Library("inspirare-tech-jenkins-pipeline-library@master") _

pipeline {
    agent none
    environment {
        APP_TYPE = "nest-card"
        APP_VERSION = setVersion()
        S3_BUCKET = "s3-vpc01-lambda-deployment-inspiraremgt01"
    }

    options {
        buildDiscarder(logRotator(artifactDaysToKeepStr: '', artifactNumToKeepStr: '', daysToKeepStr '30', numToKeepStr: '50'))
    }

    stages {
        stage("Building and Testing") {
            agent {
                label 'node-14'
            }
            environment {
                PATH = "/usr/local/lib/npm/bin/:{env.PATH}"
            }
            steps {
                sh "npm --production= false install"
                sh "npm test && npm run test:coverage"
                withSonarQubeEnv("sonar.inspirare.io") {
                    sh "sonar-scanner -Dsonar.projectVersion=${APP_VERSION}"
                }
            }
        }

        stage{"Sonar Quality Gate"} {
            agent none
            when {
                not {
                    branch "PR-*"
                }
            }
            steps {
                timeout(time: 1, unit: "HOURS") {
                    waitForQualityGate abortPipeline: true
                }
            }
        }

        stage("Bundle") {
            agent {
                label "node-14"
            }
            when {
                beforeAgent true
                anyOf {
                    branch "master"
                    branch "develop"
                }
            }
            environment {
                PATH = "/usr/local/lib/npm/bin/:${env.PATH}"
            }
            steps {
                sh "npm install"
                sh "npm run prebuild"
                sh "npm run build"
                sh "npm run bundle"
                sh "cp package.json dist/"
                sh "cp package-lock.json dist/"
                dir("dist") {
                    sh "npm install --production"
                    sh "zip -r ../${APP_TYPE}-${APP_VERSION}.zip *"
                }
                stash name "package_zip", includes: "${APP_TYPE}-${APP_VERSION}.zip"
            }
        }

        stage("Git Tag") {
             agent any
             when {
                 beforeAgent true
                 branch "master"
             }
             steps {
                 script {
                     withCredentials([[$class: 'UsernamePasswordMultiBinding', credentialsId: 'github-inspirare-admin', usernameVariable: 'USERNAME', passwordVariable: 'PASSWORD']]) {
                         sh("git tag -a ${APP_VERSION} -m 'Version ${APP_VERSION}'")
                         sh("git push https://${USERNAME}:${PASSWORD}@github.com/inspirare/${APP_TYPE}.git --tags")
                     }
                 }
             }
        }

        stage("Send zip to S3") {
            agent {
                label "node-14"
            }
            environment {
                AWS_ACCOUNT_ID = "1234567890"
                AWS_REGION = "ap-southeast-2"
            }
            when {
                beforeAgent true
                anyOf {
                    branch "master"
                    branch "develop"
                }
                steps {
                    unstash "package_zip"
                    withAWS(role:"assumed-jenkins", roleAccount:"${AWS_ACCOUNT_ID}", region:"${AWS_REGION}") {
                        s3Upload(file"${APP_TYPE}-${APP_VERSION}.zip", bucket"${S3_BUCKET}", path:"${APP_TYPE}/")
                    }
                }
            }
        }

        stage("Deploy dev") {
            agent any
            when {
                beforeAgent true
                branch "develop"
            }
            environment {
                AWS_ACCOUNT_ID = "1234567890"
                AWS_REGION = "ap-southeast-2"
                AWS_ACCOUNT = "aws-account-inspiraredev"
                ENV = "dev"
            }
            steps {
                ansibleDeploy(
                    awsAccount: "${AWS_ACCOUNT}",
                    env: "${ENV}",
                    appType: "${APP_TYPE}",
                    appVersion: "${APP_VERSION}",
                    protectedDeployment: false
                )
            }
        }

 
        stage("Deploy sit") {
            agent any
            when {
                beforeAgent true
                branch "develop"
            }
            environment {
                AWS_ACCOUNT_ID = "1234567890"
                AWS_REGION = "ap-southeast-2"
                AWS_ACCOUNT = "aws-account-inspiraresit"
                ENV = "sit"
            }
            input {
                message "Deploy to SIT?"
                ok "Yes"
            }
            options {
                timeout(time: 7, unit: "DAYS")
            }
            steps {
                ansibleDeploy(
                    awsAccount: "${AWS_ACCOUNT}",
                    env: "${ENV}",
                    appType: "${APP_TYPE}",
                    appVersion: "${APP_VERSION}",
                    protectedDeployment: false
                )
            }
        }

        stage("Deploy stage") {
            agent any
            when {
                beforeAgent true
                branch "master"
            }
            environment {
                AWS_ACCOUNT_ID = "1234567890"
                AWS_REGION = "ap-southeast-2"
                AWS_ACCOUNT = "aws-account-inspirarestg"
                ENV = "stg"
            }
            input {
                message "Deploy to STAGE?"
                ok "Yes"
            }
            options {
                timeout(time: 14, unit: "DAYS")
            }
            steps {
                ansibleDeploy(
                    awsAccount: "${AWS_ACCOUNT}",
                    env: "${ENV}",
                    appType: "${APP_TYPE}",
                    appVersion: "${APP_VERSION}",
                    protectedDeployment: false
                )
            }
        }

        stage("Deploy production") {
            agent any
            when {
                beforeAgent true
                beforeInput true
                branch "master"
            }
            environment {
                AWS_ACCOUNT_ID = "1234567890"
                AWS_REGION = "ap-southeast-2"
                AWS_ACCOUNT = "aws-account-inspirareprd"
                ENV = "prd"
            }
            input {
                message "Deploy to PRD?"
                ok "Yes"
            }
            options {
                timeout(time: 28, unit: "DAYS")
            }
            steps {
                ansibleDeploy(
                    awsAccount: "${AWS_ACCOUNT}",
                    env: "${ENV}",
                    appType: "${APP_TYPE}",
                    appVersion: "${APP_VERSION}",
                    protectedDeployment: true
                )
            }
        }
    }
}