pipeline {
  agent any
  stages {
    stage('Build') {
      agent any
      environment {
        DOCKER_CREDENTIALS = credentials('jenkins-harbor')
        BUILDX_PLATFORM = 'linux/amd64'
        CI_REGISTRY = 'reg.dev.opnd.io'
        IS_PULL = 'true'
        IS_PUSH = 'true'
      }
      steps {
        withCredentials([gitUsernamePassword(credentialsId: 'jenkins-ldap')]) {
          sh 'git fetch'
        }
        lock('docker-builder') {
          sh 'docker login -u "${DOCKER_CREDENTIALS_USR}" -p "${DOCKER_CREDENTIALS_PSW}" ${CI_REGISTRY}'
          sh 'task all'
        }
      }
    }
  }
}
