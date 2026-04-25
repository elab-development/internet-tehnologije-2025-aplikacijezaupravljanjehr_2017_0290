import { db } from "./index";
import { users,departments,employees } from "./schema";
import bcrypt from "bcrypt";

const hash = await bcrypt.hash("1234", 10);

await db.transaction(async (tx) => {
    const [admin] = await tx.insert(users).values({
        name: "Admin",
        email: "admin@hrapp.com",
        password: hash,
        position: "ADMIN",
    }).returning();

    const [hr] = await tx.insert(users).values({
        name: "HR Manager",
        email: "hr@hrapp.com",
        password: hash,
        position: "HR_MANAGER",
    }).returning();

    const [emp] = await tx.insert(users).values({
        name: "Petar Petrovic",
        email: "emp@hrapp.com",
        password: hash,
        position: "EMPLOYEE",
    }).returning();

    const [dept] = await tx.insert(departments).values({
        name: "IT",
        description: "Information Technology Department",
    }).returning();

    await tx.insert(employees).values({
        userId: emp.id,
        departmentId: dept.id,
        firstName: "Petar",
        lastName: "Petrovic",
        jobTitle: "Software Engineer",
        hireDate: "2020-01-15",
    });
});

console.log("Seed OK");
process.exit(0);
