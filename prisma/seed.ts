import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';
import 'dotenv/config';

async function main() {
  console.log("Seeding database via direct connection...");

  // Parse connection string
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    throw new Error("DATABASE_URL is not defined in .env");
  }

  // Example: mysql://root:password@localhost:3306/dbname
  // Example: mysql://root:password@localhost:3306/dbname or mysql://root@localhost:3306/dbname
  const urlPattern = /mysql:\/\/([^:]+)(?::([^@]*))?@([^:]+):(\d+)\/(.+)/;
  const match = dbUrl.match(urlPattern);

  if (!match) {
    throw new Error("Invalid DATABASE_URL format. Expected mysql://user:password@host:port/database or mysql://user@host:port/database");
  }

  const [_, user, password = '', host, port, database] = match;

  const connection = await mysql.createConnection({
    host,
    user,
    password,
    database,
    port: parseInt(port),
  });

  try {
    // Admin user
    const adminEmail = "admin@zuaplace.com";
    const adminPassword = "adminpassword123";
    const hashedAdminPassword = await bcrypt.hash(adminPassword, 10);

    const [adminRows]: any = await connection.execute('SELECT id FROM User WHERE email = ?', [adminEmail]);

    if (adminRows.length === 0) {
      const id = `admin-${Date.now()}`;
      await connection.execute(
        'INSERT INTO User (id, email, username, password, role, isActive, isVerified, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())',
        [id, adminEmail, 'admin', hashedAdminPassword, 'ADMIN', 1, 1]
      );
      console.log(`Admin user created: ${adminEmail}`);
    }

    // Client user
    const clientEmail = "client@zuaplace.com";
    const clientPassword = "clientpassword123";
    const hashedClientPassword = await bcrypt.hash(clientPassword, 10);

    const [clientRows]: any = await connection.execute('SELECT id FROM User WHERE email = ?', [clientEmail]);

    if (clientRows.length === 0) {
      const userId = `user-client-${Date.now()}`;
      const clientId = `client-${Date.now()}`;
      
      // Insert User with isVerified = 1
      await connection.execute(
        'INSERT INTO User (id, email, username, password, role, isActive, isVerified, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())',
        [userId, clientEmail, 'client', hashedClientPassword, 'CLIENT', 1, 1]
      );
      
      console.log(`Client user created: ${clientEmail}`);
    }
  } catch (error) {
    console.error("Error during seeding:", error);
  } finally {
    await connection.end();
  }

  console.log("Seeding completed.");
}

main().catch(console.error);
