"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InitialSchema1785994859050 = void 0;
class InitialSchema1785994859050 {
    name = 'InitialSchema1785994859050';
    async up(queryRunner) {
        await queryRunner.query(`CREATE TYPE "public"."attendances_clock_in_method_enum" AS ENUM('RFID', 'FINGERPRINT')`);
        await queryRunner.query(`CREATE TYPE "public"."attendances_clock_out_method_enum" AS ENUM('RFID', 'FINGERPRINT')`);
        await queryRunner.query(`CREATE TYPE "public"."attendances_status_enum" AS ENUM('ON_TIME', 'LATE', 'EARLY_DEPARTURE', 'ABSENT', 'OVERTIME', 'INCOMPLETE', 'COMPLETED')`);
        await queryRunner.query(`CREATE TABLE "attendances" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "employee_id" uuid NOT NULL, "clock_in_time" TIMESTAMP NOT NULL, "clock_out_time" TIMESTAMP, "clock_in_method" "public"."attendances_clock_in_method_enum" NOT NULL, "clock_out_method" "public"."attendances_clock_out_method_enum", "clock_in_photo" character varying, "clock_out_photo" character varying, "status" "public"."attendances_status_enum" NOT NULL DEFAULT 'ON_TIME', "work_duration_minutes" integer, "overtime_minutes" integer DEFAULT '0', "shift_completed" boolean NOT NULL DEFAULT false, "clock_in_location" character varying, "clock_out_location" character varying, "notes" text, "is_manual_entry" boolean NOT NULL DEFAULT false, "adjusted_by" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_483ed97cd4cd43ab4a117516b69" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "departments" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "code" character varying(10) NOT NULL, "description" text, "manager_name" character varying, "manager_email" character varying, "is_active" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_8681da666ad9699d568b3e91064" UNIQUE ("name"), CONSTRAINT "UQ_91fddbe23e927e1e525c152baa3" UNIQUE ("code"), CONSTRAINT "PK_839517a681a86bb84cbcc6a1e9d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "designations" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "code" character varying(10) NOT NULL, "description" text, "is_active" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_d1a41bf55e5cc36fb0040d4560a" UNIQUE ("name"), CONSTRAINT "UQ_092119e4b89786770c1ec3b7c02" UNIQUE ("code"), CONSTRAINT "PK_a0f024b99b1491a03fc421858ea" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "postings" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "code" character varying(10) NOT NULL, "description" text, "is_active" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_9419a3b48dae96fc63fe6154c37" UNIQUE ("name"), CONSTRAINT "UQ_f603bd646bbc0c849429b0f968b" UNIQUE ("code"), CONSTRAINT "PK_6bdb1a5dc47d018aa7877aa9ffb" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."leaves_leave_type_enum" AS ENUM('ANNUAL', 'SICK', 'PERSONAL', 'MATERNITY', 'PATERNITY', 'UNPAID', 'STUDY', 'PASS', 'OTHER')`);
        await queryRunner.query(`CREATE TYPE "public"."leaves_status_enum" AS ENUM('PENDING', 'APPROVED', 'REJECTED', 'CANCELLED')`);
        await queryRunner.query(`CREATE TABLE "leaves" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "employee_id" uuid NOT NULL, "leave_type" "public"."leaves_leave_type_enum" NOT NULL, "start_date" date NOT NULL, "end_date" date NOT NULL, "days_count" integer NOT NULL, "reason" text NOT NULL, "status" "public"."leaves_status_enum" NOT NULL DEFAULT 'PENDING', "reviewed_by" character varying, "review_comments" text, "reviewed_at" TIMESTAMP, "attachment_url" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_4153ec7270da3d07efd2e11e2a7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."employees_disabled_auth_methods_enum" AS ENUM('RFID', 'FINGERPRINT')`);
        await queryRunner.query(`CREATE TYPE "public"."employees_status_enum" AS ENUM('ACTIVE', 'INACTIVE', 'SUSPENDED', 'TERMINATED')`);
        await queryRunner.query(`CREATE TABLE "employees" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "employee_id" character varying NOT NULL, "first_name" character varying NOT NULL, "last_name" character varying NOT NULL, "middle_name" character varying, "email" character varying, "phone" character varying, "department" character varying NOT NULL, "department_id" uuid, "position" character varying, "designation_id" uuid, "posting_id" uuid, "rfid_card_id" character varying, "fingerprint_template" text, "fingerprint_image" text, "fingerprint_sourceafis_template" text, "fingerprint_hash" character varying(64), "fingerprint_device_id" character varying, "disabled_auth_methods" "public"."employees_disabled_auth_methods_enum" array NOT NULL DEFAULT '{}', "photo_url" character varying, "status" "public"."employees_status_enum" NOT NULL DEFAULT 'ACTIVE', "shift_id" uuid NOT NULL, "date_joined" TIMESTAMP NOT NULL DEFAULT now(), "year_of_enlistment" integer, "notes" text, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_c9a09b8e6588fb4d3c9051c8937" UNIQUE ("employee_id"), CONSTRAINT "UQ_765bc1ac8967533a04c74a9f6af" UNIQUE ("email"), CONSTRAINT "UQ_8073101bf3139cd531f6b598eb0" UNIQUE ("rfid_card_id"), CONSTRAINT "PK_b9535a98350d5b26e7eb0c26af4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "shifts" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "start_time" character varying NOT NULL, "end_time" character varying NOT NULL, "grace_period_minutes" integer NOT NULL DEFAULT '15', "description" text, "color_code" character varying, "is_active" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_3ef662f98036997809da8338d31" UNIQUE ("name"), CONSTRAINT "PK_84d692e367e4d6cdf045828768c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."users_role_enum" AS ENUM('SUPER_ADMIN', 'ADMIN', 'SUPERVISOR', 'EMPLOYEE')`);
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "username" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "first_name" character varying NOT NULL, "last_name" character varying NOT NULL, "role" "public"."users_role_enum" NOT NULL DEFAULT 'ADMIN', "is_active" boolean NOT NULL DEFAULT true, "last_login" TIMESTAMP, "employee_id" uuid, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710" UNIQUE ("username"), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "UQ_9760615d88ed518196bb79ea03d" UNIQUE ("employee_id"), CONSTRAINT "REL_9760615d88ed518196bb79ea03" UNIQUE ("employee_id"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "audit_logs" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" character varying NOT NULL, "user_name" character varying NOT NULL, "action" character varying NOT NULL, "entity" character varying NOT NULL, "entity_id" character varying, "description" text NOT NULL, "details" jsonb, "ip_address" character varying, "user_agent" text, "result" character varying NOT NULL DEFAULT 'SUCCESS', "error_message" text, "timestamp" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_1bb179d048bbc581caa3b013439" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "attendances" ADD CONSTRAINT "FK_43dca8b4751d7449a38b583991c" FOREIGN KEY ("employee_id") REFERENCES "employees"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "leaves" ADD CONSTRAINT "FK_29d5827b1f3a86dc19288ec69a5" FOREIGN KEY ("employee_id") REFERENCES "employees"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "employees" ADD CONSTRAINT "FK_678a3540f843823784b0fe4a4f2" FOREIGN KEY ("department_id") REFERENCES "departments"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "employees" ADD CONSTRAINT "FK_2de5d6e4fb3345f18bc467017f0" FOREIGN KEY ("designation_id") REFERENCES "designations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "employees" ADD CONSTRAINT "FK_2c6d3ff0a6ec02c984e24d20076" FOREIGN KEY ("posting_id") REFERENCES "postings"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "employees" ADD CONSTRAINT "FK_98e5075745ff16aeca79c12311c" FOREIGN KEY ("shift_id") REFERENCES "shifts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_9760615d88ed518196bb79ea03d" FOREIGN KEY ("employee_id") REFERENCES "employees"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_9760615d88ed518196bb79ea03d"`);
        await queryRunner.query(`ALTER TABLE "employees" DROP CONSTRAINT "FK_98e5075745ff16aeca79c12311c"`);
        await queryRunner.query(`ALTER TABLE "employees" DROP CONSTRAINT "FK_2c6d3ff0a6ec02c984e24d20076"`);
        await queryRunner.query(`ALTER TABLE "employees" DROP CONSTRAINT "FK_2de5d6e4fb3345f18bc467017f0"`);
        await queryRunner.query(`ALTER TABLE "employees" DROP CONSTRAINT "FK_678a3540f843823784b0fe4a4f2"`);
        await queryRunner.query(`ALTER TABLE "leaves" DROP CONSTRAINT "FK_29d5827b1f3a86dc19288ec69a5"`);
        await queryRunner.query(`ALTER TABLE "attendances" DROP CONSTRAINT "FK_43dca8b4751d7449a38b583991c"`);
        await queryRunner.query(`DROP TABLE "audit_logs"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TYPE "public"."users_role_enum"`);
        await queryRunner.query(`DROP TABLE "shifts"`);
        await queryRunner.query(`DROP TABLE "employees"`);
        await queryRunner.query(`DROP TYPE "public"."employees_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."employees_disabled_auth_methods_enum"`);
        await queryRunner.query(`DROP TABLE "leaves"`);
        await queryRunner.query(`DROP TYPE "public"."leaves_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."leaves_leave_type_enum"`);
        await queryRunner.query(`DROP TABLE "postings"`);
        await queryRunner.query(`DROP TABLE "designations"`);
        await queryRunner.query(`DROP TABLE "departments"`);
        await queryRunner.query(`DROP TABLE "attendances"`);
        await queryRunner.query(`DROP TYPE "public"."attendances_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."attendances_clock_out_method_enum"`);
        await queryRunner.query(`DROP TYPE "public"."attendances_clock_in_method_enum"`);
    }
}
exports.InitialSchema1785994859050 = InitialSchema1785994859050;
//# sourceMappingURL=1785994859050-InitialSchema.js.map