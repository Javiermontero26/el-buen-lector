import React, { useEffect, useState } from 'react';



const Libros = () => {
  const [posts, setPosts] = useState([]); // Estado para almacenar los posts
  const [selectedPost, setSelectedPost] = useState(null); // Estado para el post seleccionado
  const [modalType, setModalType] = useState(''); // Estado para el tipo de modal (add, edit, delete)

  // Obtener los datos de la API cuando el componente se monte
  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/posts')
      .then(response => response.json())
      .then(data => setPosts(data))
      .catch(error => console.error('Error al obtener los posts:', error));
  }, []);

  // Inicializar DataTables cuando se carguen los datos
  useEffect(() => {
    if (posts.length > 0) {
      $('#tablaLibros').DataTable(); // Inicializa DataTables
    }
  }, [posts]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSelectedPost({ ...selectedPost, [name]: value });
  };

  const handleAddPost = () => {
    setSelectedPost({ userId: '', title: '', body: '' });
    setModalType('add');
  };

  const handleEditPost = (post) => {
    setSelectedPost(post);
    setModalType('edit');
  };

  const handleSavePost = () => {
    if (modalType === 'add') {
      setPosts([...posts, { ...selectedPost, id: posts.length + 1 }]);
    } else if (modalType === 'edit') {
      setPosts(posts.map(p => (p.id === selectedPost.id ? selectedPost : p)));
    }
    setModalType('');
    setSelectedPost(null);
  };

  const handleDeletePost = (id) => {
    setPosts(posts.filter(post => post.id !== id));
  };

  return (
      <div className="container mt-3">
        <h2 className="text-center">Lista de Libros</h2>
        <hr className="text-dark" />
        <button className="btn btn-primary mb-3" onClick={handleAddPost}>Agregar Libro</button>
        <table id="tablaLibros" className="table table-striped">
          <thead>
            <tr>
              <th>User ID</th>
              <th>ID</th>
              <th>Title</th>
              <th>Body</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {posts.map(post => (
              <tr key={post.id}>
                <td>{post.userId}</td>
                <td>{post.id}</td>
                <td className="col-4">{post.title}</td>
                <td className="col-4">{post.body}</td>
                <td>
                  <button className="btn btn-warning bi-pencil-square me-2" onClick={() => handleEditPost(post)}></button>
                  <button className="btn btn-danger bi-archive-fill" onClick={() => handleDeletePost(post.id)}></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Modal */}
        {modalType && (
          <div className="modal show d-block">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">{modalType === 'add' ? 'Agregar Libro' : 'Editar Libro'}</h5>
                  <button type="button" className="btn-close" onClick={() => setModalType('')}></button>
                </div>
                <div className="modal-body">
                  <form>
                    <div className="mb-3">
                      <label className="form-label">User ID</label>
                      <input
                        type="number"
                        className="form-control"
                        name="userId"
                        value={selectedPost?.userId || ''}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Title</label>
                      <input
                        type="text"
                        className="form-control"
                        name="title"
                        value={selectedPost?.title || ''}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Body</label>
                      <textarea
                        className="form-control"
                        name="body"
                        value={selectedPost?.body || ''}
                        onChange={handleChange}
                      ></textarea>
                    </div>
                  </form>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setModalType('')}>Cancelar</button>
                  <button type="button" className="btn btn-primary" onClick={handleSavePost}>
                    {modalType === 'add' ? 'Guardar' : 'Actualizar'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
  );
};

export default Libros;
