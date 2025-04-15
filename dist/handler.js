"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.updateUser = exports.getUserById = exports.listUsers = exports.addUser = void 0;
const aws_sdk_1 = require("aws-sdk");
const uuid_1 = require("uuid");
const docClient = new aws_sdk_1.DynamoDB.DocumentClient();
const tableName = process.env.USERS_TABLE;
const addUser = async (event) => {
    try {
        const body = JSON.parse(event.body || "{}");
        const { name } = body;
        if (!name) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: "name is required" }),
            };
        }
        const id = (0, uuid_1.v4)();
        await docClient
            .put({
            TableName: tableName,
            Item: { id, name },
        })
            .promise();
        return {
            statusCode: 200,
            body: JSON.stringify({
                message: "User added successfully",
                user: { id, name },
            }),
        };
    }
    catch (err) {
        console.error(err);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: "Internal server error" }),
        };
    }
};
exports.addUser = addUser;
const listUsers = async () => {
    try {
        const result = await docClient
            .scan({
            TableName: tableName,
        })
            .promise();
        return {
            statusCode: 200,
            body: JSON.stringify({
                message: "Fetched users",
                users: result.Items,
            }),
        };
    }
    catch (err) {
        console.error(err);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: "Internal server error" }),
        };
    }
};
exports.listUsers = listUsers;
const getUserById = async (event) => {
    try {
        const id = event.pathParameters?.id;
        if (!id) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: "Missing user ID in path" }),
            };
        }
        const result = await docClient
            .get({
            TableName: tableName,
            Key: { id },
        })
            .promise();
        if (!result.Item) {
            return {
                statusCode: 404,
                body: JSON.stringify({ message: "User not found" }),
            };
        }
        return {
            statusCode: 200,
            body: JSON.stringify({
                message: "User fetched successfully",
                user: result.Item,
            }),
        };
    }
    catch (err) {
        console.error(err);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: "Internal server error" }),
        };
    }
};
exports.getUserById = getUserById;
const updateUser = async (event) => {
    try {
        const id = event.pathParameters?.id;
        const body = JSON.parse(event.body || "{}");
        const { name } = body;
        if (!id || !name) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: "Both user ID and name are required" }),
            };
        }
        await docClient
            .update({
            TableName: tableName,
            Key: { id },
            UpdateExpression: "set #n = :name",
            ExpressionAttributeNames: { "#n": "name" },
            ExpressionAttributeValues: { ":name": name },
        })
            .promise();
        return {
            statusCode: 200,
            body: JSON.stringify({
                message: "User updated successfully",
                user: { id, name },
            }),
        };
    }
    catch (err) {
        console.error(err);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: "Internal server error" }),
        };
    }
};
exports.updateUser = updateUser;
const deleteUser = async (event) => {
    try {
        const id = event.pathParameters?.id;
        if (!id) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: "User ID is required in path" }),
            };
        }
        await docClient
            .delete({
            TableName: tableName,
            Key: { id },
        })
            .promise();
        return {
            statusCode: 200,
            body: JSON.stringify({ message: "User deleted successfully", id }),
        };
    }
    catch (err) {
        console.error(err);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: "Internal server error" }),
        };
    }
};
exports.deleteUser = deleteUser;
