import React from 'react';

const Configuracion = () => {
  return (
    <div>
      <h1 className="text-center p-3">MI PERFIL</h1>
      <div>
        <div className="mt-6 border-t border-gray-100">
          <dl className="divide-y divide-gray-100">
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium text-gray-900">Nombre completo</dt>
              <dd className="mt-1 text-sm text-gray-700 sm:col-span-2 sm:mt-0">Juan Camizan Castillo</dd>
            </div>
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium text-gray-900">Solicitud para</dt>
              <dd className="mt-1 text-sm text-gray-700 sm:col-span-2 sm:mt-0">Desarrollador Backend</dd>
            </div>
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium text-gray-900">Correo electrónico</dt>
              <dd className="mt-1 text-sm text-gray-700 sm:col-span-2 sm:mt-0">juancamizan@example.com</dd>
            </div>
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium text-gray-900">Expectativa salarial</dt>
              <dd className="mt-1 text-sm text-gray-700 sm:col-span-2 sm:mt-0">$120,000</dd>
            </div>
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium text-gray-900">Acerca de mí</dt>
              <dd className="mt-1 text-sm text-gray-700 sm:col-span-2 sm:mt-0">
                Soy un apasionado desarrollador backend con experiencia en la creación de sistemas robustos y eficientes. Me encanta
                resolver problemas complejos y optimizar procesos para crear soluciones escalables. Mi objetivo es seguir aprendiendo y
                contribuyendo a proyectos que me desafíen.
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
};

export default Configuracion;
