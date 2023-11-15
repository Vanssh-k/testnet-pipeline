/**
 * @swagger
 * /api/ipns/generate_key:
 *    get:
 *    tags:
 *        - IPNS Operations
 *      summary: 'Generate IPNS key'
 *      description: 'This endpoint generates a new IPNS key.'
 *      responses:
 *        '200':
 *          description: 'Successful operation'
 *          schema:
 *            $ref: '#/definitions/IPNSKey'
 *      security:
 *        - BearerAuth: []
 *  @swagger
 *  /api/ipns/publish_record:
 *    get:
 *      tags:
 *        - IPNS Operations
 *      summary: 'Publish CID'
 *      description: 'This endpoint publishes a CID to IPNS.'
 *      parameters:
 *        - name: 'cid'
 *          in: 'query'
 *          required: true
 *          type: 'string'
 *        - name: 'keyName'
 *          in: 'query'
 *          required: true
 *          type: 'string'
 *      responses:
 *        '200':
 *          description: 'Successful operation'
 *          schema:
 *            $ref: '#/definitions/PublishCID'
 *      security:
 *        - BearerAuth: []
 *  @swagger
 *  /api/ipns/get_ipns_records:
 *    get:
 *      tags:
 *        - IPNS Operations
 *      summary: 'Get all IPNS records'
 *      description: 'This endpoint retrieves all IPNS records.'
 *      responses:
 *        '200':
 *          description: 'Successful operation'
 *          schema:
 *            type: 'array'
 *            items:
 *              $ref: '#/definitions/IPNSRecord'
 *      security:
 *        - BearerAuth: []
 *  @swagger
 *  /api/ipns/remove_key:
 *    delete:
 *      tags:
 *        - IPNS Operations
 *      summary: 'Remove IPNS key'
 *      description: 'This endpoint removes an IPNS key.'
 *      parameters:
 *        - name: 'keyName'
 *          in: 'query'
 *          required: true
 *          type: 'string'
 *      responses:
 *        '200':
 *          description: 'Successful operation'
 *          schema:
 *            $ref: '#/definitions/RemoveKey'
 *      security:
 *        - BearerAuth: []
 *definitions:
 *  IPNSKey:
 *    type: 'object'
 *    properties:
 *      ipnsName:
 *        type: 'string'
 *  PublishCID:
 *    type: 'object'
 *    properties:
 *      Value:
 *        type: 'string'
 *  IPNSRecord:
 *    type: 'object'
 *    properties:
 *      ipnsName:
 *        type: 'string'
 *  RemoveKey:
 *    type: 'object'
 *    properties:
 *      Keys:
 *        type: 'array'
 *        items:
 *          type: 'object'
 *          properties:
 *            Id:
 *              type: 'string'
 *securityDefinitions:
 *  BearerAuth:
 *    type: 'apiKey'
 *    name: 'Authorization'
 *    in: 'header'
 */
