import { DataSource, ViewColumn, ViewEntity } from "typeorm";

const TinyIntTransformer = {
    to: (value: boolean | null): number | null => (value === null ? null : (value ? 1 : 0)),
    from: (value: number | null): boolean | null => (value === null ? null : value === 1),
};

@ViewEntity({
    name: 'es_asset_main_v',
    synchronize: false,
    expression: (dataSource: DataSource) => 
        dataSource
            .createQueryBuilder()
            .select('asset.id', 'id')
            .from('es_asset_main', 'asset')
})
export class AssetView {

    @ViewColumn()
    id: number;

    @ViewColumn()
    id_tinc: string;

    @ViewColumn()
    es_asset_type_cat_id: number;

    @ViewColumn()
    is_asset_main_id: number;

    @ViewColumn()
    es_asset_type_cat_name: string;

    @ViewColumn()
    es_asset_brand_cat_id: number;

    @ViewColumn()
    es_asset_brand_cat_name: string;

    @ViewColumn()
    es_asset_hierarchy_type_cat_id: number;

    @ViewColumn()
    es_asset_hierarchy_type_cat_name: string;

    @ViewColumn()
    model: string;

    @ViewColumn()
    serial_number: string;

    @ViewColumn()
    es_asset_status_cat_id: number;

    @ViewColumn()
    es_asset_status_cat_name: string;

    @ViewColumn()
    last_mprev_date: Date | null;

    @ViewColumn()
    next_mprev_date: Date | null;

    @ViewColumn()
    es_assigned_engineer_id: number;

    @ViewColumn()
    es_assigned_engineer_full_name: string;

    @ViewColumn()
    es_asset_criticality_cat_id: number;

    @ViewColumn()
    es_asset_criticality_cat_name: string;

    @ViewColumn()
    es_asset_category_cat_id: number;

    @ViewColumn()
    es_asset_category_cat_name: string;

    @ViewColumn()
    is_customer_main_id: number;

    @ViewColumn()
    is_customer_main_commercial_name: string;

    @ViewColumn()
    es_account_main_id: number;

    @ViewColumn()
    es_account_main_name: string;

    @ViewColumn()
    es_account_user_id: number;

    @ViewColumn()
    es_account_user_name: string;

    @ViewColumn()
    last_update_user_id: number;

    @ViewColumn()
    last_update_user_name: string;

    @ViewColumn()
    es_account_location_id: number;

    @ViewColumn()
    es_account_location_name: string;

    @ViewColumn()
    es_account_sublocation_id: number;

    @ViewColumn()
    es_account_sublocation_name: string;

    @ViewColumn()
    es_asset_ownership_cat_id: number;

    @ViewColumn()
    es_asset_ownership_cat_name: string;

    @ViewColumn()
    id_custom: string;

    @ViewColumn()
    es_asset_gmdn_cat_id: number;

    @ViewColumn()
    es_asset_gmdn_cat_name: string;

    @ViewColumn()
    gmdm_custom: string;

    @ViewColumn()
    es_asset_risk_cat_id: number;

    @ViewColumn()
    es_asset_risk_cat_name: string;

    @ViewColumn()
    description: string;

    @ViewColumn()
    comments: string;

    @ViewColumn()
    environment_reference: string;

    @ViewColumn()
    es_supplier_owner_id: number;

    @ViewColumn()
    es_supplier_owner_name: string;

    @ViewColumn()
    es_supplier_seller_id: number;

    @ViewColumn()
    es_supplier_seller_name: string;

    @ViewColumn()
    keeper: string;

    @ViewColumn()
    es_asset_mprev_freq_cat_id: number;

    @ViewColumn()
    es_asset_mprev_freq_cat_name: string;

    @ViewColumn()
    es_supplier_service_provider_id: number;

    @ViewColumn()
    es_supplier_service_provider_name: string;

    @ViewColumn()
    es_asset_mprev_routine_cat_id: number;

    @ViewColumn()
    es_asset_mprev_routine_cat_name: string;

    @ViewColumn()
    warranty_start_date: Date | null;

    @ViewColumn()
    warranty_end_date: Date | null;

    @ViewColumn()
    invoice_number: string;

    @ViewColumn()
    purchase_date: Date | null;

    @ViewColumn()
    installation_date: Date | null;

    @ViewColumn()
    gc_currency_cat_id: number;

    @ViewColumn()
    gc_currency_cat_name: string;

    @ViewColumn()
    purchase_price: number;

    @ViewColumn()
    estimated_lifespan: number;

    @ViewColumn()
    useful_life: number;

    @ViewColumn()
    software_version: string;

    @ViewColumn()
    operating_system: string;

    @ViewColumn()
    firmware_version: string;

    @ViewColumn()
    removal_date: Date | null;

    @ViewColumn()
    es_asset_removal_reason_cat_id: number;

    @ViewColumn()
    es_asset_removal_reason_cat_name: string;

    @ViewColumn()
    removal_comments: string;

    @ViewColumn()
    asset_picture: string;

    @ViewColumn()
    sale_date: Date | null;

    @ViewColumn()
    sale_price: number;

    @ViewColumn()
    real_lifespan: number;

    @ViewColumn()
    estimated_renewal_date: Date | null;

    @ViewColumn({ transformer: TinyIntTransformer })
    belongs_to_account: boolean;

    @ViewColumn({ transformer: TinyIntTransformer })
    is_delete_requested: boolean;

    @ViewColumn()
    delete_by_date: Date | null;

    @ViewColumn()
    owner: string;

    @ViewColumn()
    estimated_time_mprev: string;

    @ViewColumn()
    max_response_time_hours: number;

    @ViewColumn()
    timezone_create_at: Date;

    @ViewColumn()
    timezone_update_at: Date;

    @ViewColumn()
    create_at: Date;

    @ViewColumn()
    update_at: Date;

    @ViewColumn()
    timezone: string;

    @ViewColumn()
    es_asset_annual_plan_cat_id: number;

    @ViewColumn()
    es_asset_annual_plan_cat_name: string;
    
    @ViewColumn()
    preventive_services_concluded: number;

    @ViewColumn()
    repair_services_concluded: number;
} 