import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from 'typeorm';

export class InitialMigration1700000000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1. Users table
    await queryRunner.createTable(
      new Table({
        name: 'users',
        columns: [
          { name: 'id', type: 'varchar', length: '64', isPrimary: true },
          { name: 'name', type: 'varchar', length: '255' },
          { name: 'email', type: 'varchar', length: '255', isUnique: true },
          { name: 'password_hash', type: 'varchar', length: '255' },
          { name: 'role', type: 'varchar', length: '50', default: "'OPERATOR'" },
          { name: 'is_active', type: 'boolean', default: true },
          { name: 'created_at', type: 'timestamptz', default: 'CURRENT_TIMESTAMP' },
          { name: 'updated_at', type: 'timestamptz', default: 'CURRENT_TIMESTAMP' },
          { name: 'deleted_at', type: 'timestamptz', isNullable: true },
        ],
      }),
      true
    );

    // 2. Booths table
    await queryRunner.createTable(
      new Table({
        name: 'booths',
        columns: [
          { name: 'id', type: 'varchar', length: '64', isPrimary: true },
          { name: 'code', type: 'varchar', length: '50', isUnique: true },
          { name: 'name', type: 'varchar', length: '255' },
          { name: 'location', type: 'varchar', length: '255', default: "''" },
          { name: 'status', type: 'varchar', length: '50', default: "'OFFLINE'" },
          { name: 'ip_address', type: 'varchar', length: '45', isNullable: true },
          { name: 'paper_count', type: 'int', default: 700 },
          { name: 'max_paper_capacity', type: 'int', default: 700 },
          { name: 'camera_model', type: 'varchar', length: '100', default: "'Canon EOS R100'" },
          { name: 'notes', type: 'text', isNullable: true },
          { name: 'created_at', type: 'timestamptz', default: 'CURRENT_TIMESTAMP' },
          { name: 'updated_at', type: 'timestamptz', default: 'CURRENT_TIMESTAMP' },
          { name: 'deleted_at', type: 'timestamptz', isNullable: true },
        ],
      }),
      true
    );

    // 3. Photo Sessions table
    await queryRunner.createTable(
      new Table({
        name: 'photo_sessions',
        columns: [
          { name: 'id', type: 'varchar', length: '64', isPrimary: true },
          { name: 'booth_id', type: 'varchar', length: '64' },
          { name: 'session_code', type: 'varchar', length: '100', isUnique: true },
          { name: 'customer_name', type: 'varchar', length: '255', isNullable: true },
          { name: 'customer_email', type: 'varchar', length: '255', isNullable: true },
          { name: 'status', type: 'varchar', length: '50', default: "'PENDING'" },
          { name: 'total_photos', type: 'int', default: 4 },
          { name: 'print_copies', type: 'int', default: 2 },
          { name: 'template_id', type: 'varchar', length: '64', isNullable: true },
          { name: 'started_at', type: 'timestamptz', isNullable: true },
          { name: 'ended_at', type: 'timestamptz', isNullable: true },
          { name: 'created_at', type: 'timestamptz', default: 'CURRENT_TIMESTAMP' },
          { name: 'updated_at', type: 'timestamptz', default: 'CURRENT_TIMESTAMP' },
        ],
      }),
      true
    );

    // Foreign key for photo_sessions -> booths
    await queryRunner.createForeignKey(
      'photo_sessions',
      new TableForeignKey({
        columnNames: ['booth_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'booths',
        onDelete: 'CASCADE',
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('photo_sessions', true);
    await queryRunner.dropTable('booths', true);
    await queryRunner.dropTable('users', true);
  }
}
