const errorCodes = {
  AUTH_001: 'Error de autenticación',
  AUTH_002: 'Token inválido o expirado',
  AUTH_003: 'Cuenta no verificada',
  USER_001: 'Usuario no encontrado',
  USER_002: 'Datos de usuario inválidos',
  SERVICE_001: 'Servicio no encontrado',
  SERVICE_002: 'Error al crear servicio',
  SERVICE_003: 'El servicio ya no está disponible',
  SERVICE_004: 'El servicio no puede ser completado',
  PAYMENT_001: 'Error en el procesamiento del pago',
  PAYMENT_002: 'Fondos insuficientes',
  LOCATION_001: 'Error al actualizar la ubicación',
  CHAT_001: 'Error en el procesamiento del mensaje',
};

export function handleError(error, req, res) {
  console.error('Error:', error);

  const errorCode = error.code || 'UNKNOWN_ERROR';
  const errorMessage = errorCodes[errorCode] || 'Error desconocido';

  res.status(error.status || 500).json({
    error: {
      code: errorCode,
      message: errorMessage,
    },
  });
}

export class AppError extends Error {
  constructor(code, status = 500) {
    super(errorCodes[code] || 'Error desconocido');
    this.code = code;
    this.status = status;
  }
}