import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'is_account_integration_auth', synchronize: false }) // 🔥 Important: Don't allow synchronization
export class IsAccountIntegrationAuth {
    @PrimaryGeneratedColumn('increment', { type: 'bigint' })
    id: number;

    @Column({ type: 'bigint', nullable: false })
    is_account_main_id: number;

    @Column({ type: 'varchar', length: 255, unique: true, nullable: false })
    email: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    password: string;

    @Column({ type: 'varchar', length: 255, unique: true, nullable: true })
    api_key: string;

    @Column({ type: 'varchar', length: 255, unique: true, nullable: true })
    webhook_url: string;
}
