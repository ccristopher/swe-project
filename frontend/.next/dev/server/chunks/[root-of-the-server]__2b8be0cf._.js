module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/node:crypto [external] (node:crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:crypto", () => require("node:crypto"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/action-async-storage.external.js [external] (next/dist/server/app-render/action-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/action-async-storage.external.js", () => require("next/dist/server/app-render/action-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/node:async_hooks [external] (node:async_hooks, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:async_hooks", () => require("node:async_hooks"));

module.exports = mod;
}),
"[externals]/path [external] (path, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("path", () => require("path"));

module.exports = mod;
}),
"[externals]/fs [external] (fs, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("fs", () => require("fs"));

module.exports = mod;
}),
"[externals]/os [external] (os, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("os", () => require("os"));

module.exports = mod;
}),
"[externals]/crypto [external] (crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("crypto", () => require("crypto"));

module.exports = mod;
}),
"[project]/backend/db/mongo.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

const path = __turbopack_context__.r("[externals]/path [external] (path, cjs)");
__turbopack_context__.r("[project]/node_modules/dotenv/lib/main.js [app-route] (ecmascript)").config({
    path: path.resolve(("TURBOPACK compile-time value", "/ROOT/backend/db"), '../.env'),
    debug: true
});
const { MongoClient, ServerApiVersion } = __turbopack_context__.r("[externals]/mongodb [external] (mongodb, cjs, [project]/node_modules/mongodb)");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.pfigh3v.mongodb.net/pet_n_prose?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true
    }
});
let db;
async function connectDB() {
    if (!db) {
        await client.connect();
        db = client.db('pet_n_prose');
        console.log("MongoDB connected");
    }
    return db;
}
module.exports = connectDB;
async function testConnection() {
    try {
        const db = await connectDB();
        console.log("Connected to MongoDB!");
        // Ping
        await db.command({
            ping: 1
        });
        console.log("Ping successful!");
        // List collections
        const collections = await db.listCollections().toArray();
        console.log("Collections:", collections.map((c)=>c.name));
        console.log('Users collection:', usersCollection);
    } catch (err) {
        console.error("Connection failed:", err.message);
    }
}
// Run test if called directly
if (/*TURBOPACK member replacement*/ __turbopack_context__.t.main === module) testConnection();
module.exports = connectDB;
}),
"[project]/backend/db/schema.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

const connectDB = __turbopack_context__.r("[project]/backend/db/mongo.js [app-route] (ecmascript)");
// Validation schemas
const userSchema = {
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: [
                "clerkUserId",
                "createdAt"
            ],
            properties: {
                clerkUserId: {
                    bsonType: "string"
                },
                username: {
                    bsonType: "string"
                },
                email: {
                    bsonType: "string",
                    pattern: "^.+@.+$",
                    description: "must be a valid email"
                },
                createdAt: {
                    bsonType: "date"
                }
            }
        }
    }
};
const petsSchema = {
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: [
                "name",
                "type",
                "ownerId"
            ],
            properties: {
                name: {
                    bsonType: "string",
                    description: "must be a string and is required"
                },
                type: {
                    bsonType: "string",
                    description: "must be a string and is required"
                },
                ownerId: {
                    bsonType: "objectId",
                    description: "must be an ObjectId and is required"
                },
                imageID: {
                    bsonType: "string",
                    description: "must be an image path"
                }
            }
        }
    }
};
const booksSchema = {
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: [
                "ownerId",
                "name",
                "author"
            ],
            properties: {
                ownerId: {
                    bsonType: "objectId",
                    description: "must be an ObjectId"
                },
                name: {
                    bsonType: "string",
                    description: "must be a string"
                },
                author: {
                    bsonType: "string",
                    description: "must be a string"
                },
                genre: {
                    bsonType: "string",
                    description: "must be a string"
                },
                completed: {
                    bsonType: "bool",
                    description: "must be a boolean"
                },
                numberOfPages: {
                    bsonType: "int",
                    description: "must be an integer"
                }
            }
        }
    }
};
const itemsSchema = {
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: [
                "ownerId",
                "name"
            ],
            properties: {
                ownerId: {
                    bsonType: "objectId",
                    description: "must be an ObjectId"
                },
                name: {
                    bsonType: "string",
                    description: "must be a string"
                },
                description: {
                    bsonType: "string",
                    description: "must be a string"
                },
                imageID: {
                    bsonType: "string",
                    description: "must be an image path"
                }
            }
        }
    }
};
// Initialize collections with validation
async function initSchemas() {
    const db = await connectDB();
    const users = await db.createCollection('users', userSchema).catch(()=>db.collection('users'));
    const pets = await db.createCollection('pets', petsSchema).catch(()=>db.collection('pets'));
    const books = await db.createCollection('books', booksSchema).catch(()=>db.collection('books'));
    const items = await db.createCollection('items', itemsSchema).catch(()=>db.collection('items'));
    return {
        users,
        pets,
        books,
        items
    };
}
module.exports = initSchemas;
}),
"[project]/frontend/app/api/users/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$clerk$2f$nextjs$2f$dist$2f$esm$2f$app$2d$router$2f$server$2f$auth$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/@clerk/nextjs/dist/esm/app-router/server/auth.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$clerk$2f$nextjs$2f$dist$2f$esm$2f$server$2f$clerkClient$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/@clerk/nextjs/dist/esm/server/clerkClient.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$db$2f$schema$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/backend/db/schema.js [app-route] (ecmascript)");
;
;
console.log("USER:", process.env.DB_USER);
async function POST() {
    try {
        const session = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$clerk$2f$nextjs$2f$dist$2f$esm$2f$app$2d$router$2f$server$2f$auth$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["auth"])();
        if (!session.userId) return new Response(JSON.stringify({
            error: 'Not signed in'
        }), {
            status: 401
        });
        const user = await (await (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$clerk$2f$nextjs$2f$dist$2f$esm$2f$server$2f$clerkClient$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["clerkClient"])()).users.getUser(session.userId);
        const { users, pets, books, items } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$db$2f$schema$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"])();
        // Check if user already exists
        let dbUser = await users.findOne({
            clerkUserId: session.userId
        });
        if (dbUser) return new Response(JSON.stringify({
            message: 'User exists',
            user: dbUser
        }));
        // Map Clerk data to Mongo schema
        const newUser = {
            clerkUserId: session.userId,
            username: user.username || `User-${session.userId.slice(0, 6)}`,
            email: user.emailAddresses?.[0]?.emailAddress || 'no-email@example.com',
            createdAt: new Date()
        };
        const result = await users.insertOne(newUser);
        const userId = result.insertedId;
        console.log('Inserted user:', newUser);
        // test: insert a pet for this user
        const petResult = await pets.insertOne({
            name: 'Fluffy',
            type: 'Dog',
            ownerId: userId,
            imageID: 'fluffy.png'
        });
        return new Response(JSON.stringify({
            message: 'User added',
            userId,
            petId: petResult.insertedId
        }));
    } catch (err) {
        console.error('Error inserting user:', err);
        return new Response(JSON.stringify({
            error: err.message
        }), {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__2b8be0cf._.js.map