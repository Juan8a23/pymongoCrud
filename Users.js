import React, {useState, useEffect} from 'react';

const API =  process.env.REACT_APP_API;

export const Users = () => {

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [editing, setEditing] = useState(false);
    const [id, setId] = useState('');

    const [users, setUsers] = useState([]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!editing) {
            const res = await fetch(`${API}/usuarios`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    nombre: name, 
                    email: email,
                    password: password
                })
            });
            const data = await res.json();
            console.log(data);
        } else {
            const res = await fetch(`${API}/usuarios/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    nombre: name,
                    email: email,
                    password: password
                })
            });
            const data = await res.json();
            console.log(data);
            setEditing(false);
            setId('');
        }
        await getUsuarios();

        setName('');
        setEmail('');
        setPassword('');
    }

    const getUsuarios = async () => {
        const res = await fetch(`${API}/usuarios`)
        const data = await res.json();
        setUsers(data);
    }

    useEffect(() => {
        getUsuarios();
    }, []);

    const deleteUser = async (id) => {
        const userResponse = window.confirm('Está seguro de que desea eliminar este usuario?');
        if (userResponse) {
            const res = await fetch(`${API}/usuarios/${id}`, {
                method: 'DELETE'
            });
            await res.json();
            await getUsuarios();
        }
    }

    const editUser = async (id) => {
        const res = await fetch(`${API}/usuario/${id}`);
        const data = await res.json();
        setEditing(true);
        setId(id);
        console.log(data);

        setName(data.nombre);
        setEmail(data.email);
        setPassword(data.password);

    }

    return (
        <>
        <div className='row'>
            <div className='col-md-4'>
                <form onSubmit={handleSubmit} className="card card-body">
                    <div className='form-group'>
                        <input type="text" 
                        onChange={e => setName(e.target.value)} value={name}
                        className="form-control"
                        placeholder='name'
                        autoFocus
                    />
                    </div>

                    <div className='form-group'>
                        <input type="email" 
                        onChange={e => setEmail(e.target.value)} value={email}
                        className="form-control"
                        placeholder='email'
                    />
                    </div>

                    <div className='form-group'>
                        <input type="text" 
                        onChange={e => setPassword(e.target.value)} value={password}
                        className="form-control"
                        placeholder='password'
                    />
                    </div>
                    <button className='btn btn-primary btn-block'>
                        {editing ? 'Actualizar' : 'Crear'}
                    </button>
                </form>
            </div>
            <div className='col md-8'>
                <table className='table table-bordered'>
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Email</th>
                            <th>Password</th>
                            <th>Operaciones</th>
                        </tr>
                    </thead>
                    <tbody>
                    {users.map(user => (
                            <tr key={user._id}>
                                <td>{user.nombre}</td>
                                <td>{user.email}</td>
                                <td>{user.password}</td>
                                <td>
                                    <button className='btn btn-secondary btn-sm btn-block'
                                        onClick={e => editUser(user._id)}>
                                        EDITAR
                                    </button>
                                    <button 
                                        className='btn btn-danger btn-sm btn-block'
                                        onClick={() => deleteUser(user._id)}>
                                        BORRAR
                                    </button>
                                </td>
                            </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
        </>
    )
}