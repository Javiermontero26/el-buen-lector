import React, { useEffect, useState } from 'react';

const PopularBooks = () => {
  const [bookData, setBookData] = useState([]);
  const [loading, setLoading] = useState(true);

  // URL del API
  const urlLibros = 'http://localhost:8080/apiv1/libros/listar';

  // Fetch de los datos
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch(urlLibros);
        const data = await response.json();
        setBookData(data);  // Suponemos que la respuesta es un array de libros
      } catch (error) {
        console.error("Error fetching books:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  // Cuando los datos están listos, renderizamos el gráfico
  useEffect(() => {
    if (bookData.length === 0) return; // Evitamos crear el gráfico si no hay datos

    const ctx = document.getElementById('popularBooksChart').getContext('2d');

    // Destruir cualquier gráfico existente en el canvas antes de crear uno nuevo
    if (window.chartInstance) {
      window.chartInstance.destroy();
    }

    // Crear un nuevo gráfico
    const chart = new window.Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: bookData.map(book => book.titulo), // Usamos el título de cada libro como etiqueta
        datasets: [{
          data: bookData.map(book => book.popularidad), // Usamos un campo como "popularidad"
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
          ],
          borderWidth: 1,
        }],
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: 'Libros Más Populares',
          },
          tooltip: {
            callbacks: {
              label: (context) => `Popularidad: ${context.raw}`,
            },
          },
        },
        maintainAspectRatio: false,
        aspectRatio: 1, // Relación de aspecto 1:1
      },
    });

    // Guardar la instancia del gráfico para poder destruirla luego
    window.chartInstance = chart;
  }, [bookData]);

  return (
    <div className="p-5 estadistica">
      <h2 className="text-center">Libros Más Populares</h2>
      {loading ? (
        <p>Cargando...</p>
      ) : (
        <div style={{ position: 'relative', width: '300px', height: '300px' }}>
          <canvas id="popularBooksChart"></canvas>
        </div>
      )}
    </div>
  );
};

export default PopularBooks;
