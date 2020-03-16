package specs.api

import groovyx.net.http.HttpResponseException 
import groovyx.net.http.RESTClient
import spock.lang.Shared
import spock.lang.Specification

class SitrepAPITest extends Specification{
    static String testURL = "http://localhost:3000"

    RESTClient restClient = new RESTClient(testURL)

    def 'User Should be able to perform Create Request'(){

        given :
        def requestBody = [firstName: 'John', lastName: 'Doe', email: 'john.doe@gmail.com']

        when:
        def response = restClient.post(path: '/students', body: requestBody, requestContentType: 'application/json')
        def testUserId = response.responseData

        then:
        response.status == 200

        cleanup:
        deleteTestUser(testUserId)
    }

    def 'User should be able to perform Read Request'(){
        setup:
        def testUserId = createTestUser().responseData

        when:
        def response = restClient.get( path: '/students')

        then:
        response.status == 200

        and:
        response.responseData.id
        response.responseData.firstName
        response.responseData.lastName

        cleanup:
        deleteTestUser(testUserId)

    }

    def 'User should be able to perform Update Request'(){
        setup:
        def testUserId = createTestUser().responseData

        when:
        def updatedUser = [firstName: 'Doe', lastName: 'John', email: 'doe.john@gmail.com']
        def response = restClient.put(path: '/students/' + testUserId, body: updatedUser, requestContentType: 'application/json')

        then:
        response.status == 200

        cleanup:
        deleteTestUser(testUserId)
    }

    def 'User should be able to perform Delete Request'(){
        setup:
        def testUserId = createTestUser().responseData

        when:
        def response = restClient.delete(path: '/students/' + testUserId)

        then:
        response.status == 200

    }


    def createTestUser() {
        def requestBody = [firstName: 'John', lastName: 'Doe', email: 'john.doe@gmail.com']
        return restClient.post(path: '/students', body: requestBody, requestContentType: 'application/json')
    }

    def deleteTestUser(def userId) {
        return restClient.delete(path: '/students/' + userId)

    }

}
