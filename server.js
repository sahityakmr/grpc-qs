const grpc = require("grpc");
const protoLoader = require("@grpc/proto-loader");
const packageDef = protoLoader.loadSync("todo.proto", {});
const grpcObject = grpc.loadPackageDefinition(packageDef);
const todoPackage = grpcObject.todoPackage;

const server = new grpc.Server();
server.bind("0.0.0.0:4141", grpc.ServerCredentials.createInsecure());
server.addService(todoPackage.Todo.service, {
    "createTodo": createTodoMethod,
    "readTodos": readTodosMethod,
    "readTodosStream": readTodosStreamMethod
})

server.start();
todos = []
function createTodoMethod(call, callback){
    const todoItem = {
        "id": todos.length + 1,
        "text": call.request.text
    }
    todos.push(todoItem);
    callback(null, todoItem);
}

function readTodosMethod(call, callback){
    callback(null, {"todoItems": todos})
}

function readTodosStreamMethod(call, callback){
    todos.forEach(element => {
        call.write(element);
    });
    call.end();
}