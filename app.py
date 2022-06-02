from flask import Flask, request, jsonify
from flask_pymongo import PyMongo, ObjectId
from flask_cors import CORS

app = Flask(__name__)
app.config['MONGO_URI']='mongodb://localhost/pyreactdb'
mongo = PyMongo(app)

CORS(app)

db = mongo.db.usuarios


@app.route('/usuarios', methods=['POST'])
def createUsuario():
    id = db.insert_one({
        'nombre': request.json['nombre'],
        'email': request.json['email'],
        'password': request.json['password']
    })
    return(str(id))

@app.route('/usuarios', methods=['GET'])
def getUsuarios():
    usuarios = []
    for doc in db.find():
        usuarios.append({
            '_id': str(ObjectId(doc['_id'])),
            'nombre': doc['nombre'],
            'email': doc['email'],
            'password': doc['password']
        })
    return jsonify(usuarios)

@app.route('/usuario/<id>', methods=['GET'])
def getUsuario(id):
    usuario = db.find_one({'_id': ObjectId(id)})
    print(usuario)
    return jsonify({
        '_id': str(ObjectId(usuario['_id'])),
        'nombre': usuario['nombre'],
        'email': usuario['email'],
        'password': usuario['password']
    })

@app.route('/usuarios/<id>', methods=['DELETE'])
def deleteUsuario(id):
    db.delete_one({'_id': ObjectId(id)})
    return jsonify({ 'msg': 'Usuario eliminado' })

@app.route('/usuarios/<id>', methods=['PUT'])
def updateUsuario(id):
    db.update_one({'_id': ObjectId(id)}, {'$set': {
        'nombre': request.json['nombre'],
        'email': request.json['email'],
        'password': request.json['password']
    }})
    return jsonify({ 'msg': 'Usuario actualizado' })


if __name__ == "__main__":
    app.run(debug=True)