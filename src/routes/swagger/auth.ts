/**
 *  @swagger
 *  /api/auth/get_auth_message:
 *    get:
 *      summary: Returns authentication message, to be signed by user
 *      parameters:
 *        - in: query
 *          name: publicKey
 *          schema:
 *            type: string
 *          required: true
 *      responses:
 *        '200':
 *          description: Successful response
 *          content:
 *            application/json:
 *              example: "Please prove you are the owner of this wallet by signing this message, nonce=1699843285334"
 *  @swagger
 *  /api/auth/verify_signer:
 *    post:
 *      summary: 'Verify Signer and Access Token'
 *      description: 'This endpoint is used to verify the signer and access token.'
 *      parameters:
 *        - in: 'body'
 *          name: 'body'
 *          description: 'Public key and signed message'
 *          required: true
 *          schema:
 *            type: 'object'
 *            properties:
 *              publicKey:
 *                type: 'string'
 *                example: '0x487fc2fE07c593EAb555729c3DD6dF85020B5160'
 *              signedMessage:
 *                type: 'string'
 *                example: 'signedMessage'
 *      responses:
 *        '200':
 *          description: 'Successful operation'
 *          schema:
 *            type: 'object'
 *            properties:
 *              accessToken:
 *                type: 'string'
 *              refreshToken:
 *                type: 'string'
 *        '401':
 *          description: 'Unauthorized'
 *  @swagger
 *  /api/auth/verify_access_token:
 *    get:
 *      summary: 'Verify Access Token'
 *      description: 'This endpoint is used to verify the access token.'
 *      parameters:
 *        - in: 'header'
 *          name: 'Authorization'
 *          type: 'string'
 *          required: true
 *          description: 'Bearer token format. Example: Bearer {access_token}'
 *      responses:
 *        '200':
 *          description: 'Access token is valid'
 *        '401':
 *          description: 'Unauthorized, invalid access token'
 *  @swagger
 *  /api/auth/refresh_access_token:
 *    get:
 *      summary: 'Refresh Access Token'
 *      description: 'This endpoint is used to refresh the access token.'
 *      parameters:
 *        - in: 'header'
 *          name: 'Authorization'
 *          type: 'string'
 *          required: true
 *          description: 'Bearer token format. Example: Bearer {refresh_token}'
 *      responses:
 *        '200':
 *          description: 'Access token refreshed successfully'
 *        '401':
 *          description: 'Unauthorized, invalid refresh token'
 *  @swagger
 *  /api/auth/get_api_key:
 *    post:
 *      summary: 'Get API Key'
 *      description: 'This endpoint is used to get an API key.'
 *      parameters:
 *        - in: 'body'
 *          name: 'body'
 *          description: 'Public key and signed message'
 *          required: true
 *          schema:
 *            type: 'object'
 *            properties:
 *              publicKey:
 *                type: 'string'
 *              signedMessage:
 *                type: 'string'
 *      responses:
 *        '200':
 *          description: 'API key'
 *          schema:
 *            type: 'string'
 *        '401':
 *          description: 'Unauthorized'
 *  @swagger
 *  /api/auth/remove_api_key:
 *    delete:
 *      summary: 'Remove API Key'
 *      description: 'This endpoint is used to remove an API key.'
 *      parameters:
 *        - in: 'query'
 *          name: 'keyId'
 *          type: 'string'
 *          required: true
 *        - in: 'header'
 *          name: 'Authorization'
 *          type: 'string'
 *          required: true
 *      responses:
 *        '200':
 *          description: 'API key removed'
 *          schema:
 *            type: 'string'
 *        '403':
 *          description: 'Forbidden'
 *        '401':
 *          description: 'Unauthorized'
 *  @swagger
 *  /api/auth/verify_api_key:
 *    get:
 *      summary: 'Verify API Key'
 *      description: 'This endpoint is used to verify an API key.'
 *      parameters:
 *        - in: 'header'
 *          name: 'Authorization'
 *          type: 'string'
 *          required: true
 *      responses:
 *        '200':
 *          description: 'API key verified'
 *          schema:
 *            type: 'object'
 *            properties:
 *              publicKey:
 *                type: 'string'
 *        '401':
 *          description: 'Unauthorized'
 *  @swagger
 *  /api/auth/get_user_keys:
 *    get:
 *      summary: 'Get all API keys for the authenticated user'
 *      description: 'This endpoint retrieves all API keys associated with the authenticated user.'
 *      parameters:
 *        - in: 'header'
 *          name: 'Authorization'
 *          type: 'string'
 *          required: true
 *          description: 'Bearer token for authentication. Format: "Bearer {apiKey}"'
 *      responses:
 *        '200':
 *          description: 'Successful operation'
 *          schema:
 *            type: 'array'
 *            items:
 *              type: 'object'
 *              properties:
 *                id:
 *                  type: 'string'
 *                  description: 'The ID of the API key'
 *        '401':
 *          description: 'Unauthorized. Invalid or missing API key.'
 *        '403':
 *          description: 'Forbidden. The user does not have necessary permissions for the resource.'
 */
