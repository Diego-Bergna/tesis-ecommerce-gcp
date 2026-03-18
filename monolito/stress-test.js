import http from 'k6/http';
import { check, sleep } from 'k6';

// Configuración del escenario
export const options = {
  stages: [
    { duration: '10s', target: 20 }, // Rampa de subida: de 0 a 20 usuarios en 10s
    { duration: '20s', target: 20 }, // Meseta: mantener 20 usuarios por 20s
    { duration: '5s', target: 0 },  // Rampa de bajada: volver a 0 en 5s
  ],
};

export default function () {
  const url = 'http://localhost:3000/orders';
  
  const payload = JSON.stringify({
    userId: 1,
    items: [
        {
          productId: 1,
          quantity: 1,
        }
      ]
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  // El "disparo" del cañón
  const res = http.post(url, payload, params);

  // Verificación de éxito (HTTP 201 Created)
  check(res, {
    'status es 201': (r) => r.status === 201,
  });

  // Simulamos un tiempo de pensamiento del usuario de 1 segundo
  sleep(1);
}