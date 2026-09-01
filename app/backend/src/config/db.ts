import { Pool } from 'pg';
import { env } from './env';

class DB {
  private pool: Pool;

  constructor() {
    this.pool = new Pool({
      host: env.dbHost,
      port: env.dbPuerto,
      database: env.dbNombre,
      user: env.dbUsuario,
      password: env.dbPassword,
    });

    // Escuchador de errores en segundo plano
    this.pool.on('error', (err) => {
      console.error('Problema crítico en el Pool de PostgreSQL:', err);
    });
  }

  // Método para verificar la conexión inicial
  public async conectar(): Promise<void> {
    try {
      const cliente = await this.pool.connect();
      const respuesta = await cliente.query('SELECT NOW()');
      console.log(`Conexión a BD GestorDeGastos exitosa [Hora: ${respuesta.rows[0].now}]`);
      cliente.release();
    } catch (error) {
      console.error('Error fatal: No se pudo conectar a PostgreSQL.', error);
      process.exit(1); 
    }
  }

  public async query(textoSql: string, parametros?: any[]) {
    return this.pool.query(textoSql, parametros);
  }
}

export const database = new DB();