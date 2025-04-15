"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.graphqlHandler = void 0;
const aws_sdk_1 = require("aws-sdk");
const uuid_1 = require("uuid");
const docClient = new aws_sdk_1.DynamoDB.DocumentClient();
const TableName = process.env.USERS_TABLE;
const graphqlHandler = (event) => __awaiter(void 0, void 0, void 0, function* () {
    const { fieldName } = event.info;
    const args = event.arguments;
    switch (fieldName) {
        case "getUser":
            const user = yield docClient
                .get({
                TableName,
                Key: { id: args.id },
            })
                .promise();
            return user.Item;
        case "createUser":
            const newItem = { id: (0, uuid_1.v4)(), name: args.name, email: args.email };
            yield docClient
                .put({
                TableName,
                Item: newItem,
            })
                .promise();
            return newItem;
        default:
            return null;
    }
});
exports.graphqlHandler = graphqlHandler;
