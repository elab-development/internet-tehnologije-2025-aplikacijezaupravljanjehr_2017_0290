CREATE TABLE "pto_requests" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"employee_id" uuid NOT NULL,
	"start_date" date NOT NULL,
	"end_date" date NOT NULL,
	"status" "PTO_status" DEFAULT 'PENDING' NOT NULL,
	"reason" varchar(500),
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "pto_requests" ADD CONSTRAINT "pto_requests_employee_id_employees_id_fk" FOREIGN KEY ("employee_id") REFERENCES "public"."employees"("id") ON DELETE cascade ON UPDATE no action;