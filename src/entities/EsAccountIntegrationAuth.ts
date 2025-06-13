import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'es_account_integration_auth', synchronize: false }) // 🔥 Important: Don't allow synchronization
export class EsAccountIntegrationAuth {
    @PrimaryGeneratedColumn('increment', { type: 'bigint' })
    id: number;

    @Column({ type: 'bigint', nullable: false })
    es_account_main_id: number;

    @Column({ type: 'varchar', length: 255, unique: true, nullable: true })
    api_key: string;

    @Column({ type: 'varchar', length: 255, unique: true, nullable: true })
    webhook_url: string;
}
