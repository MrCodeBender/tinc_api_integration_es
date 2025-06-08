import {
  ViewEntity,
  ViewColumn,
  DataSource,
} from 'typeorm';

// Assuming a TinyInt transformer similar to the one in EsTicketMain might be needed for boolean fields
// If is_active, first_log, terms_accepted, is_superuser, is_plan_paid are tinyint(1)
const TinyIntTransformer = {
  to: (value: boolean | null): number | null => (value === null ? null : (value ? 1 : 0)),
  from: (value: number | null): boolean | null => (value === null ? null : value === 1),
};

@ViewEntity({
  name: 'auth_v',
  expression: (
    dataSource: DataSource // Optional: You can provide the SQL expression here if needed for generation/sync (but sync is disabled)
  ) => dataSource
    .createQueryBuilder()
    .select('userProfile.id', 'id_user')
    // ... Add the rest of the complex view query here if you want TypeORM to manage it (generally not recommended for existing complex views)
    // For existing views, just providing the name is usually sufficient.
    .from('is_user_profile', 'userProfile'), // Simplified placeholder
  synchronize: false, // Important: Prevent TypeORM from trying to manage this view
})
export class AuthView {
  @ViewColumn()
  id: number;

  @ViewColumn()
  email: string;

  @ViewColumn()
  password: string | null;

  @ViewColumn()
  full_name: string;

  @ViewColumn()
  es_user_role_cat_id: number;

  @ViewColumn()
  es_user_role_cat_name: string | null;

  @ViewColumn({ transformer: TinyIntTransformer })
  is_active: boolean;

  @ViewColumn()
  create_at: Date;

  @ViewColumn()
  update_at: Date;

  @ViewColumn()
  is_customer_main_id: number | null;

  @ViewColumn()
  activation_code: string | null;

  @ViewColumn({ transformer: TinyIntTransformer })
  first_log: boolean;

  @ViewColumn()
  epassword_reset_code: string | null;

  @ViewColumn({ transformer: TinyIntTransformer })
  terms_accepted: boolean;

  @ViewColumn()
  es_account_user_id: number | null;

  @ViewColumn()
  es_account_main_name: string | null;

  @ViewColumn()
  es_account_main_id: number | null;

  @ViewColumn()
  gc_currency_cat_name: string | null;

  @ViewColumn()
  gc_city_cat_id: number | null;

  @ViewColumn()
  gc_state_cat_id: number | null;

  @ViewColumn()
  gc_country_cat_id: number | null;

  @ViewColumn()
  es_account_sector_cat_id: number | null;

  @ViewColumn()
  es_account_type_cat_id: number | null;

  @ViewColumn({ transformer: TinyIntTransformer })
  is_plan_paid: boolean | null;

  @ViewColumn()
  es_account_plan_cat_id: number | null;

  @ViewColumn()
  es_supplier_main_id: number | null;

  @ViewColumn()
  es_user_timezone_cat_id: number | null;

  @ViewColumn()
  es_user_timezone_cat_name: string | null;

  @ViewColumn()
  es_account_main_create_at: Date | null;
}
