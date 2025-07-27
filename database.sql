-- DROP SCHEMA public;

CREATE SCHEMA public AUTHORIZATION pg_database_owner;

-- DROP TYPE public."gender_enum";

CREATE TYPE public."gender_enum" AS ENUM (
	'Male',
	'Female',
	'Other',
	'Prefer not to say');

-- DROP TYPE public."item_type_medical";

CREATE TYPE public."item_type_medical" AS ENUM (
	'medicine',
	'supply');

-- DROP TYPE public."member_status_enum";

CREATE TYPE public."member_status_enum" AS ENUM (
	'Current Client',
	'Lost Client');

-- DROP TYPE public."user_type_enum";

CREATE TYPE public."user_type_enum" AS ENUM (
	'Agent',
	'Client',
	'Internal');

-- DROP SEQUENCE public.departments_id_seq;

CREATE SEQUENCE public.departments_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.floor_plans_id_seq;

CREATE SEQUENCE public.floor_plans_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.internal_roles_id_seq;

CREATE SEQUENCE public.internal_roles_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.inventory_medical_categories_id_seq;

CREATE SEQUENCE public.inventory_medical_categories_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.inventory_medical_id_seq;

CREATE SEQUENCE public.inventory_medical_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.inventory_medical_suppliers_id_seq;

CREATE SEQUENCE public.inventory_medical_suppliers_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.job_info_id_seq;

CREATE SEQUENCE public.job_info_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.members_id_seq;

CREATE SEQUENCE public.members_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.passwords_id_seq;

CREATE SEQUENCE public.passwords_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.personal_info_id_seq;

CREATE SEQUENCE public.personal_info_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.roles_id_seq;

CREATE SEQUENCE public.roles_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.stations_id_seq;

CREATE SEQUENCE public.stations_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.users_id_seq;

CREATE SEQUENCE public.users_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;-- public.floor_plans definition

-- Drop table

-- DROP TABLE public.floor_plans;

CREATE TABLE public.floor_plans (
	id serial4 NOT NULL,
	"name" text NOT NULL,
	address text NULL,
	svg_url text NULL,
	svg_path text NULL,
	created_at timestamp DEFAULT CURRENT_TIMESTAMP NULL,
	updated_at timestamp DEFAULT CURRENT_TIMESTAMP NULL,
	CONSTRAINT floor_plans_pkey PRIMARY KEY (id)
);

-- Table Triggers

create trigger update_floor_plans_updated_at before
update
    on
    public.floor_plans for each row execute function update_updated_at_column();


-- public.inventory_medical_categories definition

-- Drop table

-- DROP TABLE public.inventory_medical_categories;

CREATE TABLE public.inventory_medical_categories (
	id serial4 NOT NULL,
	item_type public."item_type_medical" NOT NULL,
	"name" varchar(100) NOT NULL,
	created_at timestamptz DEFAULT CURRENT_TIMESTAMP NULL,
	updated_at timestamptz DEFAULT CURRENT_TIMESTAMP NULL,
	CONSTRAINT inventory_medical_categories_item_type_name_key UNIQUE (item_type, name),
	CONSTRAINT inventory_medical_categories_pkey PRIMARY KEY (id)
);

-- Table Triggers

create trigger update_inventory_medical_categories_updated_at before
update
    on
    public.inventory_medical_categories for each row execute function update_updated_at_column();


-- public.inventory_medical_suppliers definition

-- Drop table

-- DROP TABLE public.inventory_medical_suppliers;

CREATE TABLE public.inventory_medical_suppliers (
	id serial4 NOT NULL,
	"name" varchar(255) NOT NULL,
	created_at timestamptz DEFAULT CURRENT_TIMESTAMP NULL,
	updated_at timestamptz DEFAULT CURRENT_TIMESTAMP NULL,
	CONSTRAINT inventory_medical_suppliers_name_key UNIQUE (name),
	CONSTRAINT inventory_medical_suppliers_pkey PRIMARY KEY (id)
);

-- Table Triggers

create trigger update_inventory_medical_suppliers_updated_at before
update
    on
    public.inventory_medical_suppliers for each row execute function update_updated_at_column();


-- public.members definition

-- Drop table

-- DROP TABLE public.members;

CREATE TABLE public.members (
	id serial4 NOT NULL,
	company text NOT NULL,
	address text NULL,
	phone text NULL,
	logo text NULL,
	service text NULL,
	status public."member_status_enum" NULL,
	created_at timestamp DEFAULT CURRENT_TIMESTAMP NULL,
	updated_at timestamp DEFAULT CURRENT_TIMESTAMP NULL,
	badge_color text NULL,
	country text NULL,
	website _text NULL,
	CONSTRAINT members_pkey PRIMARY KEY (id)
);

-- Table Triggers

create trigger update_members_updated_at before
update
    on
    public.members for each row execute function update_updated_at_column();


-- public.roles definition

-- Drop table

-- DROP TABLE public.roles;

CREATE TABLE public.roles (
	id serial4 NOT NULL,
	"name" text NOT NULL,
	description text NULL,
	created_at timestamp DEFAULT CURRENT_TIMESTAMP NULL,
	updated_at timestamp DEFAULT CURRENT_TIMESTAMP NULL,
	CONSTRAINT roles_name_key UNIQUE (name),
	CONSTRAINT roles_pkey PRIMARY KEY (id)
);

-- Table Triggers

create trigger update_roles_updated_at before
update
    on
    public.roles for each row execute function update_updated_at_column();


-- public.users definition

-- Drop table

-- DROP TABLE public.users;

CREATE TABLE public.users (
	id serial4 NOT NULL,
	email text NOT NULL,
	user_type public."user_type_enum" NOT NULL,
	created_at timestamp DEFAULT CURRENT_TIMESTAMP NULL,
	updated_at timestamp DEFAULT CURRENT_TIMESTAMP NULL,
	CONSTRAINT users_email_key UNIQUE (email),
	CONSTRAINT users_pkey PRIMARY KEY (id)
);

-- Table Triggers

create trigger update_users_updated_at before
update
    on
    public.users for each row execute function update_updated_at_column();


-- public.departments definition

-- Drop table

-- DROP TABLE public.departments;

CREATE TABLE public.departments (
	id serial4 NOT NULL,
	"name" text NOT NULL,
	description text NULL,
	member_id int4 NOT NULL,
	created_at timestamp DEFAULT CURRENT_TIMESTAMP NULL,
	updated_at timestamp DEFAULT CURRENT_TIMESTAMP NULL,
	CONSTRAINT departments_pkey PRIMARY KEY (id),
	CONSTRAINT unique_department_id_member UNIQUE (id, member_id),
	CONSTRAINT unique_department_per_member UNIQUE (name, member_id),
	CONSTRAINT departments_member_id_fkey FOREIGN KEY (member_id) REFERENCES public.members(id) ON DELETE CASCADE
);

-- Table Triggers

create trigger update_departments_updated_at before
update
    on
    public.departments for each row execute function update_updated_at_column();


-- public.internal definition

-- Drop table

-- DROP TABLE public.internal;

CREATE TABLE public.internal (
	user_id int4 NOT NULL,
	created_at timestamp DEFAULT CURRENT_TIMESTAMP NULL,
	updated_at timestamp DEFAULT CURRENT_TIMESTAMP NULL,
	CONSTRAINT internal_pkey PRIMARY KEY (user_id),
	CONSTRAINT internal_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE
);

-- Table Triggers

create trigger update_internal_updated_at before
update
    on
    public.internal for each row execute function update_updated_at_column();


-- public.internal_roles definition

-- Drop table

-- DROP TABLE public.internal_roles;

CREATE TABLE public.internal_roles (
	id serial4 NOT NULL,
	internal_user_id int4 NOT NULL,
	role_id int4 NOT NULL,
	created_at timestamp DEFAULT CURRENT_TIMESTAMP NULL,
	updated_at timestamp DEFAULT CURRENT_TIMESTAMP NULL,
	CONSTRAINT internal_roles_pkey PRIMARY KEY (id),
	CONSTRAINT unique_internal_role_assignment UNIQUE (internal_user_id, role_id),
	CONSTRAINT internal_roles_internal_user_id_fkey FOREIGN KEY (internal_user_id) REFERENCES public.internal(user_id) ON DELETE CASCADE,
	CONSTRAINT internal_roles_role_id_fkey FOREIGN KEY (role_id) REFERENCES public.roles(id) ON DELETE CASCADE
);

-- Table Triggers

create trigger update_internal_roles_updated_at before
update
    on
    public.internal_roles for each row execute function update_updated_at_column();


-- public.inventory_medical definition

-- Drop table

-- DROP TABLE public.inventory_medical;

CREATE TABLE public.inventory_medical (
	id serial4 NOT NULL,
	item_type public."item_type_medical" NOT NULL,
	"name" varchar(255) NOT NULL,
	description text NULL,
	category_id int4 NULL,
	stock int4 DEFAULT 0 NOT NULL,
	reorder_level int4 DEFAULT 10 NOT NULL,
	price numeric(10, 2) NULL,
	supplier_id int4 NULL,
	created_at timestamptz DEFAULT CURRENT_TIMESTAMP NULL,
	updated_at timestamptz DEFAULT CURRENT_TIMESTAMP NULL,
	CONSTRAINT inventory_medical_pkey PRIMARY KEY (id),
	CONSTRAINT inventory_medical_reorder_level_check CHECK ((reorder_level >= 0)),
	CONSTRAINT inventory_medical_stock_check CHECK ((stock >= 0)),
	CONSTRAINT inventory_medical_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.inventory_medical_categories(id) ON DELETE RESTRICT,
	CONSTRAINT inventory_medical_supplier_id_fkey FOREIGN KEY (supplier_id) REFERENCES public.inventory_medical_suppliers(id) ON DELETE SET NULL
);

-- Table Triggers

create trigger update_inventory_medical_updated_at before
update
    on
    public.inventory_medical for each row execute function update_updated_at_column();


-- public.passwords definition

-- Drop table

-- DROP TABLE public.passwords;

CREATE TABLE public.passwords (
	id serial4 NOT NULL,
	user_id int4 NOT NULL,
	"password" text NOT NULL,
	created_at timestamp DEFAULT CURRENT_TIMESTAMP NULL,
	updated_at timestamp DEFAULT CURRENT_TIMESTAMP NULL,
	CONSTRAINT passwords_pkey PRIMARY KEY (id),
	CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE
);


-- public.personal_info definition

-- Drop table

-- DROP TABLE public.personal_info;

CREATE TABLE public.personal_info (
	id serial4 NOT NULL,
	user_id int4 NOT NULL,
	first_name text NOT NULL,
	middle_name text NULL,
	last_name text NOT NULL,
	nickname text NULL,
	profile_picture text NULL,
	phone text NULL,
	birthday date NULL,
	city text NULL,
	address text NULL,
	gender public."gender_enum" NULL,
	created_at timestamp DEFAULT CURRENT_TIMESTAMP NULL,
	updated_at timestamp DEFAULT CURRENT_TIMESTAMP NULL,
	CONSTRAINT personal_info_pkey PRIMARY KEY (id),
	CONSTRAINT personal_info_user_id_key UNIQUE (user_id),
	CONSTRAINT personal_info_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE
);

-- Table Triggers

create trigger update_personal_info_updated_at before
update
    on
    public.personal_info for each row execute function update_updated_at_column();


-- public.stations definition

-- Drop table

-- DROP TABLE public.stations;

CREATE TABLE public.stations (
	id serial4 NOT NULL,
	station_id varchar(50) NOT NULL,
	assigned_user_id int4 NULL,
	asset_id varchar(50) NULL,
	floor_plan_id int4 NULL,
	created_at timestamp DEFAULT CURRENT_TIMESTAMP NULL,
	updated_at timestamp DEFAULT CURRENT_TIMESTAMP NULL,
	CONSTRAINT stations_pkey PRIMARY KEY (id),
	CONSTRAINT stations_station_id_key UNIQUE (station_id),
	CONSTRAINT unique_user_per_station UNIQUE (assigned_user_id),
	CONSTRAINT stations_assigned_user_id_fkey FOREIGN KEY (assigned_user_id) REFERENCES public.users(id) ON DELETE SET NULL,
	CONSTRAINT stations_floor_plan_id_fkey FOREIGN KEY (floor_plan_id) REFERENCES public.floor_plans(id) ON DELETE CASCADE
);

-- Table Triggers

create trigger update_stations_updated_at before
update
    on
    public.stations for each row execute function update_updated_at_column();


-- public.agents definition

-- Drop table

-- DROP TABLE public.agents;

CREATE TABLE public.agents (
	user_id int4 NOT NULL,
	exp_points int4 DEFAULT 0 NULL,
	member_id int4 NOT NULL,
	department_id int4 NULL,
	created_at timestamp DEFAULT CURRENT_TIMESTAMP NULL,
	updated_at timestamp DEFAULT CURRENT_TIMESTAMP NULL,
	CONSTRAINT agents_pkey PRIMARY KEY (user_id),
	CONSTRAINT agents_department_id_fkey FOREIGN KEY (department_id) REFERENCES public.departments(id) ON DELETE SET NULL,
	CONSTRAINT agents_member_id_fkey FOREIGN KEY (member_id) REFERENCES public.members(id) ON DELETE CASCADE,
	CONSTRAINT agents_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE
);

-- Table Triggers

create trigger update_agents_updated_at before
update
    on
    public.agents for each row execute function update_updated_at_column();


-- public.clients definition

-- Drop table

-- DROP TABLE public.clients;

CREATE TABLE public.clients (
	user_id int4 NOT NULL,
	member_id int4 NOT NULL,
	department_id int4 NULL,
	created_at timestamp DEFAULT CURRENT_TIMESTAMP NULL,
	updated_at timestamp DEFAULT CURRENT_TIMESTAMP NULL,
	CONSTRAINT clients_pkey PRIMARY KEY (user_id),
	CONSTRAINT clients_department_id_fkey FOREIGN KEY (department_id) REFERENCES public.departments(id) ON DELETE SET NULL,
	CONSTRAINT clients_member_id_fkey FOREIGN KEY (member_id) REFERENCES public.members(id) ON DELETE CASCADE,
	CONSTRAINT clients_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE
);

-- Table Triggers

create trigger update_clients_updated_at before
update
    on
    public.clients for each row execute function update_updated_at_column();


-- public.job_info definition

-- Drop table

-- DROP TABLE public.job_info;

CREATE TABLE public.job_info (
	id serial4 NOT NULL,
	employee_id varchar(20) NOT NULL,
	agent_user_id int4 NULL,
	internal_user_id int4 NULL,
	job_title text NULL,
	shift_period text NULL,
	shift_schedule text NULL,
	shift_time text NULL,
	work_setup text NULL,
	employment_status text NULL,
	hire_type text NULL,
	staff_source text NULL,
	start_date date NULL,
	exit_date date NULL,
	created_at timestamp DEFAULT CURRENT_TIMESTAMP NULL,
	updated_at timestamp DEFAULT CURRENT_TIMESTAMP NULL,
	CONSTRAINT chk_job_info_employee_type CHECK ((((agent_user_id IS NOT NULL) AND (internal_user_id IS NULL)) OR ((agent_user_id IS NULL) AND (internal_user_id IS NOT NULL)))),
	CONSTRAINT job_info_employee_id_key UNIQUE (employee_id),
	CONSTRAINT job_info_pkey PRIMARY KEY (id),
	CONSTRAINT job_info_agent_user_id_fkey FOREIGN KEY (agent_user_id) REFERENCES public.agents(user_id) ON DELETE CASCADE,
	CONSTRAINT job_info_internal_user_id_fkey FOREIGN KEY (internal_user_id) REFERENCES public.internal(user_id) ON DELETE CASCADE
);

-- Table Triggers

create trigger update_job_info_updated_at before
update
    on
    public.job_info for each row execute function update_updated_at_column();



-- DROP FUNCTION public.update_updated_at_column();

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$function$
;

-- Floorplans table (using your existing DDL)
CREATE TABLE public.floor_plans (
    id serial4 NOT NULL,
    "name" text NOT NULL,
    address text NULL,
    svg_url text NULL,
    svg_path text NULL,
    created_at timestamp DEFAULT CURRENT_TIMESTAMP NULL,
    updated_at timestamp DEFAULT CURRENT_TIMESTAMP NULL,
    CONSTRAINT floor_plans_pkey PRIMARY KEY (id)
);

-- Members table (assuming you already have this)
CREATE TABLE members (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    company VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Junction table for many-to-many relationship between floor_plans and members
CREATE TABLE floor_plan_members (
    id SERIAL PRIMARY KEY,
    floor_plan_id INTEGER NOT NULL,
    member_id INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Foreign key constraints
    FOREIGN KEY (floor_plan_id) REFERENCES public.floor_plans(id) ON DELETE CASCADE,
    FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE CASCADE,
    
    -- Composite unique constraint to prevent duplicate assignments
    UNIQUE(floor_plan_id, member_id)
);

-- Indexes for better performance
CREATE INDEX idx_floor_plan_members_floor_plan_id ON floor_plan_members(floor_plan_id);
CREATE INDEX idx_floor_plan_members_member_id ON floor_plan_members(member_id);

-- Optional: Floorplan areas/zones table for more detailed floorplan management
CREATE TABLE floor_plan_areas (
    id SERIAL PRIMARY KEY,
    floor_plan_id INTEGER NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    coordinates JSONB, -- For storing area boundaries/coordinates
    capacity INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (floor_plan_id) REFERENCES public.floor_plans(id) ON DELETE CASCADE
);

-- Optional: Area assignments to members (if you want to assign specific areas within floorplans)
CREATE TABLE area_members (
    id SERIAL PRIMARY KEY,
    area_id INTEGER NOT NULL,
    member_id INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (area_id) REFERENCES floor_plan_areas(id) ON DELETE CASCADE,
    FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE CASCADE,
    
    UNIQUE(area_id, member_id)
);

-- Example queries for common operations:

-- 1. Get all floorplans assigned to a specific member
-- SELECT f.* FROM public.floor_plans f
-- JOIN floor_plan_members fm ON f.id = fm.floor_plan_id
-- WHERE fm.member_id = ?;

-- 2. Get all members assigned to a specific floorplan
-- SELECT m.* FROM members m
-- JOIN floor_plan_members fm ON m.id = fm.member_id
-- WHERE fm.floor_plan_id = ?;

-- 3. Assign a floorplan to a member
-- INSERT INTO floor_plan_members (floor_plan_id, member_id)
-- VALUES (?, ?);

-- 4. Remove a floorplan assignment from a member
-- DELETE FROM floor_plan_members 
-- WHERE floor_plan_id = ? AND member_id = ?;

-- 5. Get floorplan assignment statistics
-- SELECT 
--     f.name as floorplan_name,
--     COUNT(fm.member_id) as assigned_members_count
-- FROM public.floor_plans f
-- LEFT JOIN floor_plan_members fm ON f.id = fm.floor_plan_id
-- GROUP BY f.id, f.name;

-- Sample INSERT statements for floor_plan_members table
-- Note: Make sure the floor_plan_id and member_id values exist in their respective tables

-- Insert sample floor plan members assignments
INSERT INTO floor_plan_members (floor_plan_id, member_id) VALUES
(1, 1),
(1, 2),
(2, 1),
(2, 3),
(3, 2),
(3, 3),
(4, 1),
(4, 4),
(5, 2),
(5, 4);

-- Alternative INSERT statements with explicit column specification
-- INSERT INTO floor_plan_members (id, floor_plan_id, member_id, created_at, updated_at) VALUES
-- (1, 1, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
-- (2, 1, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
-- (3, 2, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
-- (4, 2, 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
-- (5, 3, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Example of inserting a single floor plan member assignment
-- INSERT INTO floor_plan_members (floor_plan_id, member_id) 
-- VALUES (1, 1);

-- Example of inserting multiple assignments in a single statement
-- INSERT INTO floor_plan_members (floor_plan_id, member_id) VALUES
-- (1, 1),
-- (1, 2),
-- (2, 1);

-- public.clinic_log_medicines definition

-- Drop table

-- DROP TABLE public.clinic_log_medicines;

CREATE TABLE public.clinic_log_medicines (
	id serial4 NOT NULL,
	clinic_log_id int4 NOT NULL,
	inventory_item_id int4 NOT NULL,
	quantity int4 NOT NULL,
	created_at timestamptz DEFAULT CURRENT_TIMESTAMP NULL,
	updated_at timestamptz DEFAULT CURRENT_TIMESTAMP NULL,
	CONSTRAINT clinic_log_medicines_pkey PRIMARY KEY (id),
	CONSTRAINT clinic_log_medicines_quantity_check CHECK ((quantity > 0)),
	CONSTRAINT clinic_log_medicines_clinic_log_id_fkey FOREIGN KEY (clinic_log_id) REFERENCES public.clinic_logs(id) ON DELETE CASCADE,
	CONSTRAINT clinic_log_medicines_inventory_item_id_fkey FOREIGN KEY (inventory_item_id) REFERENCES public.inventory_medical(id) ON DELETE RESTRICT
);

-- Table Triggers

create trigger update_clinic_log_medicines_updated_at before
update
    on
    public.clinic_log_medicines for each row execute function update_updated_at_column();


-- public.clinic_log_supplies definition

-- Drop table

-- DROP TABLE public.clinic_log_supplies;

CREATE TABLE public.clinic_log_supplies (
	id serial4 NOT NULL,
	clinic_log_id int4 NOT NULL,
	inventory_item_id int4 NOT NULL,
	quantity int4 NOT NULL,
	created_at timestamptz DEFAULT CURRENT_TIMESTAMP NULL,
	updated_at timestamptz DEFAULT CURRENT_TIMESTAMP NULL,
	CONSTRAINT clinic_log_supplies_pkey PRIMARY KEY (id),
	CONSTRAINT clinic_log_supplies_quantity_check CHECK ((quantity > 0)),
	CONSTRAINT clinic_log_supplies_clinic_log_id_fkey FOREIGN KEY (clinic_log_id) REFERENCES public.clinic_logs(id) ON DELETE CASCADE,
	CONSTRAINT clinic_log_supplies_inventory_item_id_fkey FOREIGN KEY (inventory_item_id) REFERENCES public.inventory_medical(id) ON DELETE RESTRICT
);

-- Table Triggers

create trigger update_clinic_log_supplies_updated_at before
update
    on
    public.clinic_log_supplies for each row execute function update_updated_at_column();

-- Function to update inventory stock when items are used in clinic logs
CREATE OR REPLACE FUNCTION update_inventory_stock_on_clinic_log()
RETURNS TRIGGER AS $$
BEGIN
    -- Update inventory stock when items are used
    UPDATE public.inventory_medical 
    SET stock = stock - NEW.quantity,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = NEW.inventory_item_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers to automatically update inventory stock
CREATE TRIGGER update_inventory_on_medicine_usage
    AFTER INSERT ON public.clinic_log_medicines
    FOR EACH ROW
    EXECUTE FUNCTION update_inventory_stock_on_clinic_log();

CREATE TRIGGER update_inventory_on_supply_usage
    AFTER INSERT ON public.clinic_log_supplies
    FOR EACH ROW
    EXECUTE FUNCTION update_inventory_stock_on_clinic_log();

-- Sample INSERT statements for clinic logs and related tables

-- Sample clinic logs
INSERT INTO public.clinic_logs (patient_id, patient_diagnose, issued_by, additional_notes) VALUES
(1, 'Hypertension', 'Dr. Smith', 'Patient needs regular monitoring'),
(2, 'Diabetes Type 2', 'Dr. Johnson', 'Insulin adjustment required'),
(3, 'Common Cold', 'Dr. Williams', 'Symptomatic treatment');

-- Sample clinic log medicines (assuming inventory items exist)
INSERT INTO public.clinic_log_medicines (clinic_log_id, inventory_item_id, quantity) VALUES
(1, 1, 2),  -- Assuming inventory_item_id 1 exists
(1, 3, 1),  -- Assuming inventory_item_id 3 exists
(2, 2, 1),  -- Assuming inventory_item_id 2 exists
(3, 4, 3);  -- Assuming inventory_item_id 4 exists

-- Sample clinic log supplies (assuming inventory items exist)
INSERT INTO public.clinic_log_supplies (clinic_log_id, inventory_item_id, quantity) VALUES
(1, 5, 1),  -- Assuming inventory_item_id 5 exists
(2, 6, 2),  -- Assuming inventory_item_id 6 exists
(3, 7, 1);  -- Assuming inventory_item_id 7 exists

-- ALTER TABLE statements to modify existing clinic_log_medicines and clinic_log_supplies tables
-- Run these if you have existing tables without the inventory_item_id column

-- Add inventory_item_id column to clinic_log_medicines
ALTER TABLE public.clinic_log_medicines 
ADD COLUMN inventory_item_id int4 NULL;

-- Add inventory_item_id column to clinic_log_supplies  
ALTER TABLE public.clinic_log_supplies 
ADD COLUMN inventory_item_id int4 NULL;

-- Add foreign key constraints
ALTER TABLE public.clinic_log_medicines 
ADD CONSTRAINT clinic_log_medicines_inventory_item_id_fkey 
FOREIGN KEY (inventory_item_id) REFERENCES public.inventory_medical(id) ON DELETE RESTRICT;

ALTER TABLE public.clinic_log_supplies 
ADD CONSTRAINT clinic_log_supplies_inventory_item_id_fkey 
FOREIGN KEY (inventory_item_id) REFERENCES public.inventory_medical(id) ON DELETE RESTRICT;

-- Make the columns NOT NULL after adding the constraints (optional)
-- ALTER TABLE public.clinic_log_medicines ALTER COLUMN inventory_item_id SET NOT NULL;
-- ALTER TABLE public.clinic_log_supplies ALTER COLUMN inventory_item_id SET NOT NULL;

-- Update existing records to link with inventory items (example)
-- UPDATE public.clinic_log_medicines 
-- SET inventory_item_id = (
--     SELECT id FROM public.inventory_medical 
--     WHERE name = clinic_log_medicines.name 
--     LIMIT 1
-- )
-- WHERE inventory_item_id IS NULL;

-- UPDATE public.clinic_log_supplies 
-- SET inventory_item_id = (
--     SELECT id FROM public.inventory_medical 
--     WHERE name = clinic_log_supplies.name 
--     LIMIT 1
-- )
-- WHERE inventory_item_id IS NULL;