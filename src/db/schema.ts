import{
    pgTable, uuid, text, timestamp,
    varchar, date, numeric, pgEnum, boolean
} from 'drizzle-orm/pg-core';

// ENUM definisanje tipova korisnika, kao i statusa PTO zahteva
export const userPositionEnum = pgEnum('user_position', ['ADMIN', 'HR_MANAGER', 'EMPLOYEE']);
export const PTOstatusEnum = pgEnum('PTO_status', ['APPROVED', 'PENDING', 'REJECTED']);


// Tabela korisnika sa osnovnim informacijama
export const users = pgTable('users', {
    id: uuid('id').primaryKey().defaultRandom(),
    name: varchar('name', { length: 100 }).notNull(),
    email: varchar('email', { length: 150 }).notNull().unique(),
    password: varchar('password', { length: 100 }).notNull(),
    position: userPositionEnum('position').default('EMPLOYEE').notNull(),
    createdAt: timestamp('created_at').defaultNow(),
});

// Tabela departmana sa nazivom i opisom
export const departments = pgTable('departments', {
    id: uuid('id').primaryKey().defaultRandom(),
    name: varchar('name', { length: 100 }).notNull().unique(),
    description: text('description'),
    createdAt: timestamp('created_at').defaultNow(),
});

// Tabela zaposlenih, 1:1 sa korisnikom, N:1 sa departmanom
export const employees = pgTable('employees', {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
    departmentId: uuid('department_id').references(() => departments.id, { onDelete: 'set null' }),
    firstName: varchar('first_name', { length: 100 }).notNull(),
    lastName: varchar('last_name', { length: 100 }).notNull(),
    jobTitle: varchar('job_title', { length: 150 }).notNull(),
    hireDate: date('hire_date').notNull(),
    active: boolean('active').default(true).notNull(),
});

// Tabela za plate zaposlenih i istorijom isplacivanja
export const salaries = pgTable('salaries', {
    id: uuid('id').primaryKey().defaultRandom(),
    employeeId: uuid('employee_id').references(() => employees.id, { onDelete: 'cascade' }).notNull(),
    amount: numeric('amount', { precision: 10, scale: 2 }).notNull(),
    currency: varchar('currency', { length: 3 }).default('RSD').notNull(),
    effectiveDate: date('effective_date').notNull(),
    validTO: timestamp('valid_to').defaultNow(),
});

// Tabela za PTO zahteve sa statusom i datumima
export const ptoRequests = pgTable('pto_requests', {
    id: uuid('id').primaryKey().defaultRandom(),
    employeeId: uuid('employee_id').references(() => employees.id, { onDelete: 'cascade' }).notNull(),
    startDate: date('start_date').notNull(),
    endDate: date('end_date').notNull(),
    status: PTOstatusEnum('status').default('PENDING').notNull(),
    reason: varchar('reason', { length: 500 }),
    createdAt: timestamp('created_at').defaultNow(),
});

// Tabela za evaluaciju performansi zaposlenih sa ocenom i komentarom
export const performanceReviews = pgTable('performance_reviews', {
    id: uuid('id').primaryKey().defaultRandom(),
    employeeId: uuid('employee_id').references(() => employees.id).notNull(),
    reviewerId: uuid('reviewer_id').references(() => users.id).notNull(),
    reviewDate: date('review_date').notNull(),
    rating: numeric('rating', { precision: 2, scale: 1 }).notNull(),
    comments: text('comments'),
    createdAt: timestamp('created_at').defaultNow(),
});