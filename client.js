const grpc = require("grpc");
const protoLoader = require("@grpc/proto-loader");
const packageDef = protoLoader.loadSync("todo.proto", {});
const grpcObject = grpc.loadPackageDefinition(packageDef);
const todoPackage = grpcObject.todoPackage;

const text = process.argv[2];

const client = new todoPackage.Todo("0.0.0.0:4141", grpc.credentials.createInsecure());

client.createTodo({
    "text": text
}, (err, response) => {
    console.log("Write Success : " + JSON.stringify(response));
});

// client.readTodos(
//     {},
//     (err, response) => {
//         response.todoItems.forEach(element => {
//             console.log(element);
//         });
//     }
// )

const call = client.readTodosStream();
call.on("data", item => {
    console.log("received item from server: " + JSON.stringify(item));
});

call.on("end", e => console.log("Server Done"));