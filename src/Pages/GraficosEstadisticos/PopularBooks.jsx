import React, { useEffect } from 'react';

const PopularBooks = () => {
  useEffect(() => {

    if (window.Chart) {
      const ctx = document.getElementById('popularBooksChart').getContext('2d');

      // Destruye cualquier gráfico existente en el canvas antes de crear uno nuevo
      if (window.chartInstance) {
        window.chartInstance.destroy();
      }

      // Crea un nuevo gráfico
      const chart = new window.Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ['La Odise', 'El Principito', 'Cien Años de Soledad', 'Orgullo y Prejuicio'],
          datasets: [{
            data: [50, 150, 200, 100],  // Popularidad de cada libro (ej. basado en reseñas o ventas)
            backgroundColor: ['rgba(255, 99, 132, 0.2)', 'rgba(54, 162, 235, 0.2)', 'rgba(255, 206, 86, 0.2)', 'rgba(75, 192, 192, 0.2)'],
            borderColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)', 'rgba(255, 206, 86, 1)', 'rgba(75, 192, 192, 1)'],
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
          // Ajuste para hacer el gráfico más pequeño
          maintainAspectRatio: false,
          aspectRatio: 1,  // Relación de aspecto 1:1
        },
      });

      // Guarda la instancia del gráfico en window para destruirlo luego
      window.chartInstance = chart;
    }

    return () => {
      // Limpiar el gráfico cuando el componente se desmonte
      if (window.chartInstance) {
        window.chartInstance.destroy();
      }
    };
  }, []);

  return (

    <div className="p-5 estadistica" >
      <h2 className="text-center">Libros Más Populares</h2>
      <div style={{ position: 'relative', width: '300px', height: '300px' }}>
        <canvas id="popularBooksChart"></canvas>
      </div>
    </div>

  );
};

export default PopularBooks;
